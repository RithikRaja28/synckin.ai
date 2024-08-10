import React from 'react'
import { Routes,Route } from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Authentication/Login.jsx';
import Signup from './components/Authentication/SignUp.jsx';
const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path = "/register" element={<Signup />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
