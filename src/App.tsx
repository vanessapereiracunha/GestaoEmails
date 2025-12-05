import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Pendentes from './pages/Pendentes'
import CadastroManual from './pages/CadastroManual'
import ListaGeral from './pages/ListaGeral'
import Detalhes from './pages/Detalhes'

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
