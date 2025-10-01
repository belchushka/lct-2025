import { Route, Routes } from 'react-router'
import { StartPage } from './pages/start'
import { ArPage } from './pages/ar'

function App() {

  return (
    <Routes>
      <Route index element={<StartPage />}/>
      <Route path='/ar' element={<ArPage />}/>
    </Routes>
  )
}

export default App
