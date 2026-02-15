'use client'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export default function Card({
  children,
  className = '',
  hover = false,
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-xl shadow-sm border border-gray-100 p-6
        transition-all duration-300
        ${hover ? 'hover:shadow-md cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}
