import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Body from './Body'
function App() {
  return (
    <>
      <BrowserRouter basename="/">
      <Routes>
        <Route path="/login" element={<Body/>}/>
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
