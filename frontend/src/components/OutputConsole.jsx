import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PanelWrapper from './PanelWrapper'

function OutputLine({ line }) {
  const colorMap = {
    system: '#4a7a4a',
    output: '#00ff41',
    error: '#ff4141',
    info: '#4a7a4a',
  }

  const color = colorMap[line.type] || '#00ff41'
  const isSystem = line.type === 'system'
  const isError = line.type === 'error'

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex items-start gap-2 text-[13px] leading-relaxed"
    >
      {!isSystem && !isError && (
        <span style={{ color: '#003b00' }} className="select-none shrink-0">
          {'\u25B8'}
        </span>
      )}
      <span
        style={{
          color,
          textShadow: isError
            ? '0 0 4px #ff414140'
            : line.type === 'output'
            ? '0 0 4px #00ff4130'
            : 'none',
        }}
        className={isSystem ? 'italic' : ''}
      >
        {line.text}
      </span>
    </motion.div>
  )
}

export default function OutputConsole({ output, active }) {
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [output])

  return (
    <PanelWrapper title="Output Console" delay={0.4} active={active}>
      <div ref={scrollRef} className="h-full overflow-auto">
        {output.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <span className="text-xs italic" style={{ color: '#003b00' }}>
              Program output will appear here...
            </span>
          </div>
        ) : (
          <div className="space-y-1">
            <AnimatePresence>
              {output.map(line => (
                <OutputLine key={line.id} line={line} />
              ))}
            </AnimatePresence>

            {/* Blinking cursor at end */}
            <span
              className="blink inline-block w-2 h-4 ml-1"
              style={{ backgroundColor: '#00ff41' }}
            />
          </div>
        )}
      </div>
    </PanelWrapper>
  )
}
