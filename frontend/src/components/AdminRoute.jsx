import { Loader } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const { authUser, isCheckingAuth } = useAuthStore();
  if (isCheckingAuth) {
    return (
      <div className=" bg-black flex justify-center items-center min-h-screen w-full">
        <Loader className="size-36 animate-spin" />
      </div>
    );
  }
  if (!authUser || authUser.role !== "ADMIN") {
    return <Navigate to="/" />;
  }
  return <Outlet />;
};

export default AdminRoute;
