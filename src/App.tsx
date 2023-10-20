import React, {useEffect} from 'react';
import {useDispatch} from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { autoLogin } from './actions/authActions';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import EditUser from './pages/EditUser';
import AlertNotification from "./components/AlertNotification"
import { useAppSelector } from './store';
import Loading from './components/Loading';
import Department from './components/Department';
import Designation from './components/Designation';

function App() {

    const dispatch = useDispatch();
    const { loading } = useAppSelector(
        (state) => state.auth
    ); 

  // auto login
  useEffect(() => {
    dispatch(autoLogin());
  }, [dispatch])
  

  if(loading) {
    return <Loading />
  }
  return (
      <>
          <BrowserRouter>
              <Routes>
                  <Route path="/register" element={<Register />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/edituser/:userid" element={<EditUser />} />
                  <Route path="/department" element={<Department />} />
                  <Route path="/designation" element={<Designation />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="*" element={<Navigate to="/dashboard" />} />
              </Routes>
          </BrowserRouter>
          <AlertNotification />
      </>
  );
}

export default App;
