import { createBrowserRouter } from "react-router";
import { Layout } from "./components/layout";
import { DashboardPage } from "./pages/dashboard-page";
import { OrderManagementPage } from "./pages/order-management-page";
import { DesignSystemPage } from "./pages/design-system-page";
import { ChargingAiFcstPage } from "./pages/charging-ai-fcst-page";
import { FcstSupplyReportPage } from "./pages/fcst-supply-report-page";
import { AiStatusReportPage } from "./pages/ai-status-report-page";
import { ContractPage } from "./pages/contract-page";
import { DsSchedulePage } from "./pages/ds-schedule-page";
import { PoManagementPage } from "./pages/po-management-page";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: DashboardPage },
      { path: "design-system", Component: DesignSystemPage },
      // 계획 정보
      { path: "plan", Component: DashboardPage },
      { path: "plan/ai-fcst", Component: ChargingAiFcstPage },
      {
        path: "plan/assembly-fcst",
        Component: OrderManagementPage,
      },
      {
        path: "plan/assembly-summary",
        Component: OrderManagementPage,
      },
      { path: "plan/lp-fcst", Component: OrderManagementPage },
      {
        path: "plan/lp-summary",
        Component: OrderManagementPage,
      },
      { path: "plan/po", Component: PoManagementPage },
      // 공급 정보
      { path: "supply", Component: DashboardPage },
      { path: "supply/ai", Component: OrderManagementPage },
      {
        path: "supply/assembly",
        Component: OrderManagementPage,
      },
      { path: "supply/lp", Component: OrderManagementPage },
      // 레포트
      { path: "report", Component: DashboardPage },
      {
        path: "report/supply",
        Component: FcstSupplyReportPage,
      },
      { path: "report/ai", Component: AiStatusReportPage },
      {
        path: "report/assembly",
        Component: OrderManagementPage,
      },
      { path: "report/ds", Component: OrderManagementPage },
      // 단일 페이지
      { path: "contract", Component: ContractPage },
      { path: "schedule", Component: DsSchedulePage },
      { path: "*", Component: DashboardPage },
    ],
  },
]);