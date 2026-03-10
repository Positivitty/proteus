from __future__ import annotations

import io
import sys
import copy
import signal
from typing import Any, Optional


class _Timeout:
    """Context manager that raises TimeoutError after *seconds* on Unix."""

    def __init__(self, seconds: int = 2):
        self.seconds = seconds

    def _handler(self, signum, frame):
        raise TimeoutError("Code execution exceeded the 2-second time limit.")

    def __enter__(self):
        try:
            signal.signal(signal.SIGALRM, self._handler)
            signal.alarm(self.seconds)
        except (ValueError, AttributeError):
            # signal.alarm not available (Windows / non-main thread) — skip
            pass
        return self

    def __exit__(self, *args):
        try:
            signal.alarm(0)
        except (ValueError, AttributeError):
            pass


# Builtins we allow inside executed code — deliberately minimal.
_SAFE_BUILTINS = {
    "print": print,
    "range": range,
    "len": len,
    "int": int,
    "float": float,
    "str": str,
    "bool": bool,
    "abs": abs,
    "min": min,
    "max": max,
    "sum": sum,
    "round": round,
    "list": list,
    "dict": dict,
    "tuple": tuple,
    "set": set,
    "enumerate": enumerate,
    "zip": zip,
    "sorted": sorted,
    "reversed": reversed,
    "True": True,
    "False": False,
    "None": None,
}

# Tokens that must never appear in user code.
_FORBIDDEN_TOKENS = [
    "import ",
    "from ",
    "__import__",
    "open(",
    "exec(",
    "eval(",
    "compile(",
    "globals(",
    "locals(",
    "getattr(",
    "setattr(",
    "delattr(",
    "__builtins__",
    "__class__",
    "__subclasses__",
    "os.",
    "sys.",
    "subprocess",
    "shutil",
    "pathlib",
]


class SafeExecutor:
    """Execute generated Python code in a restricted sandbox."""

    def __init__(self, timeout: int = 2):
        self.timeout = timeout

    @staticmethod
    def _check_forbidden(code: str) -> Optional[str]:
        """Return an error message if the code contains forbidden tokens."""
        for token in _FORBIDDEN_TOKENS:
            if token in code:
                return f"Forbidden operation detected: '{token.strip()}' is not allowed."
        return None

    def run(self, python_code: str) -> dict[str, Any]:
        """
        Execute *python_code* safely and return results.

        Returns
        -------
        {
            "output": str,       # captured stdout
            "variables": list,   # [{"step": int, "variables": dict}, ...]
            "error": str | None,
        }
        """
        # Pre-scan for disallowed operations
        err = self._check_forbidden(python_code)
        if err:
            return {"output": "", "variables": [], "error": err}

        # Build restricted global namespace
        namespace: dict[str, Any] = {"__builtins__": _SAFE_BUILTINS}

        # Capture stdout
        captured = io.StringIO()

        # We'll execute line-groups and snapshot variables after each top-level
        # statement to build the step trace.
        variable_snapshots: list[dict] = []

        def _user_vars(ns: dict) -> dict:
            """Extract user-defined variables (skip dunder keys)."""
            return {
                k: _safe_repr(v)
                for k, v in ns.items()
                if not k.startswith("_") and k != "__builtins__"
            }

        try:
            with _Timeout(self.timeout):
                old_stdout = sys.stdout
                sys.stdout = captured
                try:
                    # Split code into top-level statements for step tracking.
                    statements = self._split_top_level(python_code)
                    for step_idx, stmt in enumerate(statements):
                        exec(stmt, namespace)  # noqa: S102
                        variable_snapshots.append(
                            {"step": step_idx, "variables": _user_vars(namespace)}
                        )
                finally:
                    sys.stdout = old_stdout

        except TimeoutError as exc:
            return {
                "output": captured.getvalue(),
                "variables": variable_snapshots,
                "error": str(exc),
            }
        except Exception as exc:
            return {
                "output": captured.getvalue(),
                "variables": variable_snapshots,
                "error": f"{type(exc).__name__}: {exc}",
            }

        return {
            "output": captured.getvalue(),
            "variables": variable_snapshots,
            "error": None,
        }

    # ── Helpers ────────────────────────────────────────────────────────

    @staticmethod
    def _split_top_level(code: str) -> list[str]:
        """
        Split Python source into top-level statement groups.

        A new group starts at every line with zero indentation that is not a
        blank line, unless the previous line ended with ':' (block opener).
        """
        lines = code.split("\n")
        groups: list[list[str]] = []
        current: list[str] = []

        for line in lines:
            stripped = line.rstrip()
            if not stripped:
                if current:
                    current.append(line)
                continue

            is_top = not line[0:1].isspace()

            if is_top and current:
                groups.append(current)
                current = [line]
            else:
                current.append(line)

        if current:
            groups.append(current)

        return ["\n".join(g) for g in groups]


def _safe_repr(value: Any) -> Any:
    """Return a JSON-safe representation of a value."""
    if isinstance(value, (int, float, bool, str, type(None))):
        return value
    if isinstance(value, (list, tuple)):
        return [_safe_repr(v) for v in value]
    if isinstance(value, dict):
        return {str(k): _safe_repr(v) for k, v in value.items()}
    if isinstance(value, set):
        return [_safe_repr(v) for v in sorted(value, key=str)]
    return str(value)
