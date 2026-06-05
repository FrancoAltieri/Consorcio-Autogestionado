import { createBrowserRouter } from "react-router";
import { RootLayout } from "@/layouts/RootLayout";
import { Dashboard } from '../screens/Dashboard'
import { Socios } from '../screens/Socios/Socios'
import { Gastos } from '../screens/Gastos/Gastos'
import { Pagos } from '../screens/Pagos/Pagos'
import { Balance } from '../screens/Balance/Balance'
import { Reportes } from '../screens/Reportes/Reportes'
import { Configuracion } from "@/screens/Configuracion";
import Landing from "@/screens/Landing";
import Login from "@/screens/Login";
import Register from "@/screens/Register";
import MisConsorcios from "@/screens/MisConsorcios";

export const router = createBrowserRouter([
  { path: "/", Component: Landing },
  { path: "/login", Component: Login },
  { path: "/register", Component: Register },
  { path: "/mis-consorcios", Component: MisConsorcios },
  {
    path: "/app/:consorcioId",
    Component: RootLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "socios", Component: Socios },
      { path: "gastos", Component: Gastos },
      { path: "pagos", Component: Pagos },
      { path: "balance", Component: Balance },
      { path: "reportes", Component: Reportes },
      { path: "configuracion", Component: Configuracion },
    ],
  },
]);