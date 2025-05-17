import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSignup: false,
  isLoggingIn: false,
  isCheckingAuth: false,

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get("/auth/check");
      console.log("checkAuth responce ", res.data);
      set({ authUser: res.data.user });
    } catch (error) {
      console.error("error while singing in from frontend", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signUp: async (data) => {
    set({ isSignup: true });
    try {
      const res = await axiosInstance.post("/auth/register", data);
      set({ authUser: res.data.user });
      toast.success(res.data.message);
    } catch (error) {
      console.error("Error signing up", error);
      toast.error("Error signing up");
    } finally {
      set({ isSignup: false });
    }
  },
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data.user });
      toast.success(res.data.message);
    } catch (error) {
      console.error("error while logging", error);
      toast.error("Error logging in");
    } finally {
      set({ isLoggingIn: false });
    }
  },
  logout: async (data) => {
    try {
      await axiosInstance.post("/auth/logout", data);
      set({ authUser: null });
      toast.success("Logout Successful");
    } catch (error) {
      console.error("error while logging out:", error);
      toast.error("Error logging out");
    }
  },
}));
