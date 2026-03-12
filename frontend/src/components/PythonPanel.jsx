import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PanelWrapper from './PanelWrapper'

function TypewriterLine({ text, lineNum, isCurrent }) {
  return (
    <motion.div
      initial={{ opacity: 0, width: 0 }}
      animate={{ opacity: 1, width: '100%' }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex items-start font-mono text-[13px] leading-relaxed"
      style={{
        background: isCurrent
          ? 'linear-gradient(90deg, #00ff4118, transparent)'
          : 'transparent',
        boxShadow: isCurrent ? 'inset 3px 0 0 #00ff41' : 'none',
        borderRadius: '2px',
        padding: '1px 0',
      }}
    >
      {/* Line number */}
      <span
        className="select-none text-right pr-3 shrink-0"
        style={{
          color: isCurrent ? '#00ff4180' : '#003b00',
          minWidth: '32px',
        }}
      >
        {lineNum}
      </span>

      {/* Code */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        style={{ color: '#00ff41' }}
        className="whitespace-pre"
      >
        {highlightPython(text)}
      </motion.span>

      {/* Glow effect on current line */}
      {isCurrent && (
        <motion.div
          className="absolute inset-0 pointer-events-none rounded"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ background: 'linear-gradient(90deg, #00ff4108, transparent)' }}
        />
      )}
    </motion.div>
  )
}

function highlightPython(code) {
  const keywords = [
    'def','return','if','else','elif','for','while','in','import','from',
    'class','print','range','len','True','False','None','and','or','not',
    'with','as','try','except','finally','break','continue','pass',
    'lambda','yield'
  ]

  const parts = []
  let remaining = code

  while (remaining.length > 0) {
    const stringMatch = remaining.match(/^(["'])(?:(?!\1).)*\1/)
    if (stringMatch) {
      parts.push(
        <span key={parts.length} style={{ color: '#39ff14' }}>
          {stringMatch[0]}
        </span>
      )
      remaining = remaining.slice(stringMatch[0].length)
      continue
    }

    const numMatch = remaining.match(/^\b\d+(?:\.\d+)?\b/)
    if (numMatch) {
      parts.push(
        <span key={parts.length} style={{ color: '#39ff14', fontWeight: 'bold' }}>
          {numMatch[0]}
        </span>
      )
      remaining = remaining.slice(numMatch[0].length)
      continue
    }

    const wordMatch = remaining.match(/^\b[a-zA-Z_]\w*\b/)
    if (wordMatch) {
      const word = wordMatch[0]

      if (keywords.includes(word)) {
        parts.push(
          <span key={parts.length} style={{ color: '#39ff14', fontWeight: 'bold' }}>
            {word}
          </span>
        )
      } else {
        parts.push(
          <span key={parts.length} style={{ color: '#00ff41' }}>
            {word}
          </span>
        )
      }

      remaining = remaining.slice(word.length)
      continue
    }

    const commentMatch = remaining.match(/^#.*$/)
    if (commentMatch) {
      parts.push(
        <span key={parts.length} style={{ color: '#003b00' }}>
          {commentMatch[0]}
        </span>
      )
      remaining = remaining.slice(commentMatch[0].length)
      continue
    }

    parts.push(
      <span key={parts.length} style={{ color: '#4a7a4a' }}>
        {remaining[0]}
      </span>
    )
    remaining = remaining.slice(1)
  }

  return parts
}

export default function PythonPanel({ pythonCode, currentLine, active }) {

  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (pythonCode.length === 0) return

    try {
      await navigator.clipboard.writeText(pythonCode.join('\n'))

      setCopied(true)

      setTimeout(() => {
        setCopied(false)
      }, 2000)

    } catch (err) {
      console.error("Clipboard copy failed:", err)
    }
  }

  return (
    <PanelWrapper title="Generated Python Code" delay={0.2} active={active}>

      {/* Copy Button */}
      <div className="flex justify-end mb-2">
        <button
          onClick={handleCopy}
          disabled={pythonCode.length === 0}
          className="text-xs px-2 py-1 border rounded transition-colors duration-200"
          style={{
            color: '#00ff41',
            borderColor: '#00ff41',
            opacity: pythonCode.length === 0 ? 0.5 : 1
          }}
        >
          {copied ? 'COPIED!' : 'COPY'}
        </button>
      </div>

      <div className="h-full overflow-auto">
        {pythonCode.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <span className="text-xs italic" style={{ color: '#003b00' }}>
              Translated code will appear here...
            </span>
          </div>
        ) : (
          <AnimatePresence>
            {pythonCode.map((line, i) => (
              <TypewriterLine
                key={`line-${i}`}
                text={line}
                lineNum={i + 1}
                isCurrent={currentLine === i}
              />
            ))}
          </AnimatePresence>
        )}
      </div>

    </PanelWrapper>
  )
}