import {Routes , Route, Navigate} from 'react-router-dom'; 
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return  (
    <>
      <Routes>
        <Route path='/' element={<ProtectedRoutes><Homepage /></ProtectedRoutes>} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </>
  );
}

export function ProtectedRoutes (props) {
  if (localStorage.getItem('user'))
  {
    return props.children;
  }
  else
  {
    return <Navigate to="/login"/>
  }
}

export default App;
