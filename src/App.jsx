import { Routes, Route, Navigate } from 'react-router-dom'
import Welcome from './Pages/Welcome'
import UserReg from './Auth/UserReg'
import UserLogin from './Auth/UserLogin'
import Home from './Pages/Home'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/signup" element={<UserReg />} />
      <Route path="/login" element={<UserLogin />} />
      <Route path="/home" element={<Home />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}