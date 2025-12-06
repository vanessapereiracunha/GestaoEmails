export default function Badge({ children, color = 'slate' }: { children: React.ReactNode, color?: 'slate'|'green'|'red'|'indigo' }){
  const colors: Record<string,string> = {
    slate: 'bg-slate-100 text-slate-700',
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
    indigo: 'bg-indigo-100 text-indigo-700',
  }
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[color]}`}>{children}</span>
}
