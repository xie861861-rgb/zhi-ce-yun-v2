'use client'

interface ProgressBarProps {
  value: number
  max?: number
  showLabel?: boolean
  color?: 'primary' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function ProgressBar({
  value,
  max = 100,
  showLabel = false,
  color = 'primary',
  size = 'md',
  className = '',
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  const colors = {
    primary: 'bg-gradient-to-r from-primary-500 to-primary-600',
    success: 'bg-gradient-to-r from-green-500 to-green-600',
    warning: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
    danger: 'bg-gradient-to-r from-red-500 to-red-600',
  }

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  }

  return (
    <div className={className}>
      <div className={`bg-gray-200 rounded-full overflow-hidden ${sizes[size]}`}>
        <div
          className={`${colors[color]} ${sizes[size]} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1 text-sm">
          <span className="text-gray-500">进度</span>
          <span className="font-medium text-gray-700">{percentage.toFixed(0)}%</span>
        </div>
      )}
    </div>
  )
}
