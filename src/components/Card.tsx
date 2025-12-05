export default function Card({ title, value, children }: { title?: string, value?: React.ReactNode, children?: React.ReactNode }){
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      {title && <div className="text-xs text-gray-500">{title}</div>}
      {value !== undefined && <div className="text-3xl font-semibold">{value}</div>}
      {children}
    </div>
  )
}
