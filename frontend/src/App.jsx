import { useState } from 'react'
import Header from './components/Header'
import HumanTerminal from './components/HumanTerminal'
import PythonPanel from './components/PythonPanel'
import VariableMemory from './components/VariableMemory'
import OutputConsole from './components/OutputConsole'
import ExplanationPanel from './components/ExplanationPanel'
import CommandReference from './components/CommandReference'
import { useProteus } from './hooks/useProteus'

function App() {
  const [showCommandReference, setShowCommandReference] = useState(false)

  const {
    englishCode,
    setEnglishCode,
    pythonCode,
    explanations,
    variables,
    output,
    phase,
    currentLine,
    runProgram,
    aiEnabled,
  } = useProteus()

  const isTranslating = phase === 'translating' || phase === 'parsing'
  const isExecuting = phase === 'executing'

  return (
    <div className="scanlines relative h-screen w-screen flex flex-col overflow-hidden" style={{ background: '#0a0a0a' }}>
      <Header phase={phase} onRun={runProgram} aiEnabled={aiEnabled} />

      <button
        type="button"
        onClick={() => setShowCommandReference(true)}
        className="absolute top-20 right-4 z-40 px-3 py-1.5 text-xs font-bold tracking-wider border rounded transition-colors duration-150 hover:bg-[#003b00]/50"
        style={{
          color: 'var(--neon-green)',
          borderColor: 'var(--neon-green)',
          background: '#0d0d0d',
        }}
      >
        COMMANDS
      </button>

      <main
        className="flex-1 grid gap-2 p-2 min-h-0"
        style={{
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '2fr 1fr 1fr',
        }}
      >
        <HumanTerminal
          value={englishCode}
          onChange={setEnglishCode}
          active={isTranslating}
        />
        <PythonPanel
          pythonCode={pythonCode}
          currentLine={currentLine}
          active={isTranslating || pythonCode.length > 0}
        />
        <div style={{ gridColumn: '1 / -1', minHeight: 0 }} className="flex flex-col">
          <ExplanationPanel
            explanations={explanations}
            currentLine={currentLine}
            active={isTranslating || explanations.length > 0}
          />
        </div>
        <VariableMemory
          variables={variables}
          active={isExecuting || variables.length > 0}
        />
        <OutputConsole
          output={output}
          active={output.length > 0}
        />
      </main>

      {showCommandReference && (
        <CommandReference onClose={() => setShowCommandReference(false)} />
      )}
    </div>
  )
}

export default App
