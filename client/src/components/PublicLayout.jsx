import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-sage/20">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
