import { createBrowserRouter } from "react-router";
import { RootLayout } from "@/layouts/RootLayout";
import { Dashboard } from "@/screens/Dashboard";
import { Socios } from "@/screens/Socios";
import { Gastos } from "@/screens/Gastos";
import { Pagos } from "@/screens/Pagos";
import { Balance } from "@/screens/Balance";
import { Reportes } from "@/screens/Reportes";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "socios", Component: Socios },
      { path: "gastos", Component: Gastos },
      { path: "pagos", Component: Pagos },
      { path: "balance", Component: Balance },
      { path: "reportes", Component: Reportes },
    ],
  },
]);
