type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary'|'secondary'|'ghost' }

export default function Button({ variant = 'primary', className = '', ...props }: Props){
  const base = 'inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed'
  const variants: Record<string,string> = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-600',
    secondary: 'bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-900',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-slate-300',
  }
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />
}
