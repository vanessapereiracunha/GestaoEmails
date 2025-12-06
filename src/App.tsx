import { Route, Routes } from 'react-router-dom'
import Layout from './view/components/Layout'
import Dashboard from './view/pages/Dashboard'
import Pendentes from './view/pages/Pendentes'
import CadastroManual from './view/pages/CadastroManual'
import ListaGeral from './view/pages/ListaGeral'
import Detalhes from './view/pages/Detalhes'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/pendentes" element={<Pendentes />} />
        <Route path="/cadastro" element={<CadastroManual />} />
        <Route path="/lista" element={<ListaGeral />} />
        <Route path="/detalhes/:id" element={<Detalhes />} />
      </Routes>
    </Layout>
  )
}
