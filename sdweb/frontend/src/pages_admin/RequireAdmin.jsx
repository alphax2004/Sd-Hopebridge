import ProtectedRoute from "../components/ProtectedRoute";

export default function RequireAdmin({ children }) {
  return <ProtectedRoute requireAdmin>{children}</ProtectedRoute>;
}