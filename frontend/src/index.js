// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App";
// import "./styles.css";
// import AuthProvider from "./context/AuthContext";

// const root = ReactDOM.createRoot(document.getElementById("root"));
// // root.render(<App />);
// root.render(
//   <AuthProvider>
//     <App />
//   </AuthProvider>
// );


import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);