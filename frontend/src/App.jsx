import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";

function App() {
  const {authUser ,isCheckingAuth, checkAuth} =  useAuthStore()
  
  useEffect(() =>{
    checkAuth()
  } , [checkAuth])
  if( isCheckingAuth  && !authUser) {
    return(
      <div className=" flex justify-center items-center h-screen">
         <Loader className=" size-10 animate-spin "/>
      </div>
    )
  }
  return (
    <div className="flex flex-col items-center justify-center">
      <Toaster/>
      <Routes>
        <Route
          path="/"
          element={<HomePage /> }
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/signup"
          element={ <SignupPage /> }
        />
      </Routes>
    </div>
  );
}

export default App;
