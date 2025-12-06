import { Users } from 'lucide-react'

type TopDestinatario = {
  destinatario: string
  total: number
}

export default function TopDestinatarios({ items }: { items: TopDestinatario[] }) {
  if (!items.length) {
    return null
  }

  return (
    <section className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Users size={20} className="text-indigo-600" />
        Top Destinatários
      </h2>
      <ol className="space-y-3">
        {items.map((t, index) => (
          <li key={t.destinatario} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full text-sm font-medium">
                {index + 1}
              </span>
              <span className="text-gray-700">{t.destinatario}</span>
            </div>
            <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
              {t.total}
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}
