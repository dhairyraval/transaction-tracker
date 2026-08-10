// import React from 'react'
import { Route, Routes } from 'react-router'

import DashboardPage from './pages/DashboardPage'
import UploadPage from './pages/UploadPage'
import TransactionsPage from './pages/TransactionsPage'

const App = () => {
  return (
    <div data-theme="cupcake">
      <Routes>
        <Route path='/' element={<DashboardPage />} />
        <Route path='/upload' element={<UploadPage />} />
        <Route path='/transactions' element={<TransactionsPage />} />
      </Routes>
    </div>
  )
}

export default App