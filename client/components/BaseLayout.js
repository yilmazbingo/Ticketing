import React from "react";
import Header from "./header";

export default function BaseLayout({ children, currentUser }) {
  return (
    <div className="container">
      <Header currentUser={currentUser}></Header>
      {children}
    </div>
  );
}
