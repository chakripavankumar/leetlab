import { Footer, Header } from "../components/common";
import { Outlet } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 overflow-x-hidden">
        <Analytics />
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
