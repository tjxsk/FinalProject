import { Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import Login from './components/Login/Login'
import Home from './components/Home/Home'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import Books from './components/Books/Books'
import PrivateRoutes from './components/PrivateRoutes';
import Stories from './components/Stories/Stories'

function App() {

  const location = useLocation();

  return (
    <>
      {location.pathname !== '/' && (
        <>
          <Navbar />
          <Sidebar />
        </>
      )}
      <Routes>
        <Route path='/' element={<Login />} />
        <Route element={<PrivateRoutes />}>
          <Route path='/home' element={<Home />} />
          <Route path='/books' element={<Books />} />
          <Route path='/stories' element={<Stories/>}/>
        </Route>
      </Routes>
    </>
  )
}

export default App
