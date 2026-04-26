import Login from "./Login"
import Signup from "./Signup"
import Dashboard from "./Dashboard";
import { BrowserRouter, Routes, Route,Navigate } from 'react-router-dom';
import ProtectedRoute from "./ProtectedRoute";


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login"/>}></Route>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/signup" element={<Signup/>}></Route>
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App