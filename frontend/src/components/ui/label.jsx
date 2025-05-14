// ✅ Label 组件（src/components/ui/label.jsx）
export function Label({ className = "", ...props }) {
  return <label className={`block mb-1 text-sm font-medium ${className}`} {...props} />
}
