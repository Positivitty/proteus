import { motion, AnimatePresence } from 'framer-motion'
import PanelWrapper from './PanelWrapper'

function formatValue(value) {
  if (typeof value === 'string') return `"${value}"`
  if (Array.isArray(value)) return `[${value.join(', ')}]`
  if (typeof value === 'object' && value !== null) return JSON.stringify(value)
  return String(value)
}

function typeColor(type) {
  switch (type) {
    case 'int':
    case 'float':
      return '#39ff14'
    case 'str':
      return '#00ff41'
    case 'bool':
      return '#00cc33'
    case 'list':
      return '#33ff66'
    default:
      return '#4a7a4a'
  }
}

function VariableCard({ variable }) {
  const { name, value, type, isNew, changed } = variable

  return (
    <motion.div
      layout
      initial={isNew ? { scale: 0, opacity: 0 } : false}
      animate={{
        scale: 1,
        opacity: 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 25,
      }}
      className="rounded border p-2.5 relative overflow-hidden"
      style={{
        borderColor: changed ? '#00ff4160' : '#0a3d0040',
        background: changed
          ? 'linear-gradient(135deg, #003b0020, #0d0d0d)'
          : '#0a0a0a',
      }}
    >
      {/* Pulse overlay on change */}
      {changed && (
        <motion.div
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 pointer-events-none"
          style={{ background: '#00ff4115' }}
        />
      )}

      {/* Variable name */}
      <div className="flex items-center justify-between mb-1">
        <span
          className="text-xs font-bold tracking-wider"
          style={{ color: '#00ff41' }}
        >
          {name}
        </span>
        <span
          className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded"
          style={{
            color: typeColor(type),
            backgroundColor: '#003b0020',
            border: `1px solid ${typeColor(type)}30`,
          }}
        >
          {type}
        </span>
      </div>

      {/* Variable value */}
      <motion.div
        key={JSON.stringify(value)}
        initial={changed ? { scale: 1.1 } : false}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="text-sm font-mono truncate"
        style={{ color: typeColor(type) }}
        title={formatValue(value)}
      >
        {formatValue(value)}
      </motion.div>
    </motion.div>
  )
}

export default function VariableMemory({ variables, active }) {
  return (
    <PanelWrapper title="Variable Memory" delay={0.3} active={active}>
      <div className="h-full overflow-auto">
        {variables.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <span className="text-xs italic" style={{ color: '#003b00' }}>
              Variables will be tracked here...
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <AnimatePresence>
              {variables.map(v => (
                <VariableCard key={v.id} variable={v} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </PanelWrapper>
  )
}
