// src/AppRouter.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App";
import RequireAuth from "./components/RequireAuth";
import Login from "./scenes/login";

import {
  Dashboard,
  Reservas,
  ReservasCalendario,
  Espacios,
  Usuarios,
  FechasBloqueadas,
  Notificaciones,
  Pie,
  FAQ,

} from "./scenes";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<App />}>
          <Route index element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          } />
          <Route path="/espacios" element={<RequireAuth><Espacios /></RequireAuth>} />
          <Route path="/usuarios" element={<RequireAuth><Usuarios /></RequireAuth>} />
          <Route path="/fechas-bloqueadas" element={<RequireAuth><FechasBloqueadas /></RequireAuth>} />
          <Route path="/reservas" element={<RequireAuth><Reservas /></RequireAuth>} />
          <Route path="/notificaciones" element={<RequireAuth><Notificaciones /></RequireAuth>} />
          <Route path="/calendario" element={<RequireAuth><ReservasCalendario/></RequireAuth>} />
          <Route path="/pie" element={<RequireAuth><Pie /></RequireAuth>} />
          <Route path="/faq" element={<RequireAuth><FAQ /></RequireAuth>} />
        </Route>
      </Routes>

    </Router>
  );
};

export default AppRouter;
