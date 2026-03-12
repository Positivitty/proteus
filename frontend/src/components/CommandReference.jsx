import { useEffect } from 'react'
import PanelWrapper from './PanelWrapper'

const COMMANDS = [
  { english: 'set x to 5', python: 'x = 5' },
  { english: 'print x', python: 'print(x)' },
  { english: 'output x / show x / display x', python: 'print(x)' },
  { english: 'repeat 3 times', python: 'for _i in range(3):' },
  { english: 'for each item in mylist', python: 'for item in mylist:' },
  { english: 'while x is greater than 10', python: 'while x > 10:' },
  { english: 'add 2 to x', python: 'x += 2' },
  { english: 'subtract 1 from x', python: 'x -= 1' },
  { english: 'multiply x by 3', python: 'x *= 3' },
  { english: 'divide x by 2', python: 'x /= 2' },
  { english: 'while x is less than 10', python: 'while x < 10:' },
  { english: 'while x is not 0', python: 'while x != 0:' },
  { english: 'if x is 5', python: 'if x == 5:' },
  { english: 'if x is greater than 10', python: 'if x > 10:' },
  { english: 'if x is less than 10', python: 'if x < 10:' },
  { english: 'create list names with Alice, Bob, Eve', python: 'names = ["Alice", "Bob", "Eve"]' },
  { english: 'create array nums with 3, 1, 9', python: 'nums = [3, 1, 9]' },
  { english: 'append 7 to list nums', python: 'nums.append(7)' },
  { english: 'remove 1 from array nums', python: 'nums.remove(1)' },
  { english: 'get the length of nums', python: 'print(len(nums))' },
  { english: 'find shortest in names', python: 'print(min(names, key=len))' },
  { english: 'find longest in names', python: 'print(max(names, key=len))' },
  { english: 'find smallest in nums', python: 'print(min(nums))' },
  { english: 'find largest in nums', python: 'print(max(nums))' },
  { english: 'sort mylist', python: 'mylist.sort()' },
  { english: 'sort mylist in descending order', python: 'mylist.sort(reverse=True)' },
  { english: 'get item 0 from mylist', python: 'print(mylist[0])' },
  { english: 'store shortest in names as result', python: 'result = min(names, key=len)' },
  { english: 'join names with ", "', python: 'print(", ".join(names))' },
  { english: 'ask username', python: 'username = input("username: ")' },
]

export default function CommandReference({ onClose }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0, 0, 0, 0.72)' }}
      role="dialog"
      aria-modal="true"
      aria-label="Supported commands reference"
      onClick={onClose}
    >
      <div className="w-full max-w-5xl h-full max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
        <PanelWrapper title="Command Reference" active>
          <div className="mb-3 flex items-center justify-between gap-4">
            <p className="text-xs tracking-wide" style={{ color: 'var(--text-dim)' }}>
              Supported English commands and their generated Python.
            </p>
            <button
              onClick={onClose}
              className="px-3 py-1 text-xs font-bold tracking-wider border rounded transition-colors duration-150 hover:bg-[#003b00]/50"
              style={{
                color: 'var(--neon-green)',
                borderColor: 'var(--neon-green)',
                background: 'transparent',
              }}
            >
              CLOSE
            </button>
          </div>

          <div className="overflow-auto rounded border" style={{ borderColor: 'var(--panel-border)' }}>
            <table className="w-full text-left text-sm" style={{ color: 'var(--neon-green)' }}>
              <thead
                className="sticky top-0 z-10"
                style={{ background: 'linear-gradient(180deg, #111 0%, #0d0d0d 100%)' }}
              >
                <tr>
                  <th className="px-3 py-2 text-xs uppercase tracking-widest border-b" style={{ borderColor: 'var(--panel-border)' }}>
                    English
                  </th>
                  <th className="px-3 py-2 text-xs uppercase tracking-widest border-b" style={{ borderColor: 'var(--panel-border)' }}>
                    Python
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMMANDS.map((cmd) => (
                  <tr key={cmd.english} className="align-top">
                    <td
                      className="px-3 py-2 border-b text-xs md:text-sm"
                      style={{ borderColor: '#0a3d0030', color: 'var(--accent-green)' }}
                    >
                      {cmd.english}
                    </td>
                    <td
                      className="px-3 py-2 border-b text-xs md:text-sm"
                      style={{ borderColor: '#0a3d0030', color: 'var(--neon-green)' }}
                    >
                      <code>{cmd.python}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-3 text-xs" style={{ color: 'var(--text-dim)' }}>
            Block commands like repeat, for each, while, and if auto-indent following lines. Use a blank line to close the block.
          </p>
          <p className="mt-1 text-xs" style={{ color: 'var(--text-dim)' }}>
            Tip: press ESC to close this panel.
          </p>
        </PanelWrapper>
      </div>
    </div>
  )
}