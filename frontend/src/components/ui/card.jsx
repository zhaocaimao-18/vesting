// ✅ Card 组件（src/components/ui/card.jsx）
export function Card({ className = "", ...props }) {
  return <div className={`rounded-xl border bg-white text-black shadow ${className}`} {...props} />
}

export function CardContent({ className = "", ...props }) {
  return <div className={`p-6 ${className}`} {...props} />
}
