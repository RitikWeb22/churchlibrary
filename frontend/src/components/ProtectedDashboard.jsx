import Dashboard from "../Dashboard/Dashboard"; // Adjust the path as needed
import DashboardStatistics from "../Dashboard/DashboardStatistics";
import BookManagement from "../Dashboard/BookManagement";
import PaymentManagement from "../Dashboard/PaymentManagement";
import { withAuth } from "../components/withAuth";

export const ProtectedDashboard = withAuth(Dashboard);
export const ProtectedDashboardStatistics = withAuth(DashboardStatistics);
export const ProtectedBookManagement = withAuth(BookManagement);
export const ProtectedPaymentManagement = withAuth(PaymentManagement);
export default ProtectedDashboard;
