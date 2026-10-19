import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import AnnualReportPage from './pages/AnnualReportPage'
import CemeteryPage from './pages/CemeteryPage'
import ReceptionPage from './pages/ReceptionPage'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<ReceptionPage />} />
        <Route path="/cemetery" element={<CemeteryPage />} />
        <Route path="/annual" element={<AnnualReportPage />} />
      </Routes>
    </Layout>
  )
}