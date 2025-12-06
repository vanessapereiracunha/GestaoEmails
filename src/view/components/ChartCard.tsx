import type { ReactNode } from 'react'
import { TrendingUp } from 'lucide-react'

export function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <TrendingUp size={20} className="text-indigo-600" />
        {title}
      </h2>
      {children}
    </section>
  )
}
