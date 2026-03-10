import { motion } from 'framer-motion'

export default function PanelWrapper({ title, children, delay = 0, active = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className="flex flex-col rounded border overflow-hidden"
      style={{
        borderColor: active ? '#00ff4140' : '#0a3d0040',
        background: '#0d0d0d',
        boxShadow: active
          ? '0 0 8px #00ff4130, 0 0 16px #00ff4110, inset 0 0 8px #00ff4108'
          : '0 0 4px #00ff4110, inset 0 0 4px #00ff4105',
      }}
    >
      {/* Header bar */}
      <div
        className="flex items-center gap-2 px-3 py-1.5 border-b select-none"
        style={{
          borderColor: active ? '#0a3d0060' : '#0a3d0030',
          background: 'linear-gradient(180deg, #111 0%, #0d0d0d 100%)',
        }}
      >
        <span
          className={`inline-block w-2 h-2 rounded-full ${active ? 'active-dot' : 'pulse-dot'}`}
          style={{ backgroundColor: '#00ff41' }}
        />
        <span
          className="text-xs font-bold tracking-widest uppercase"
          style={{ color: active ? '#00ff41' : '#4a7a4a' }}
        >
          {title}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-3 min-h-0">
        {children}
      </div>
    </motion.div>
  )
}
