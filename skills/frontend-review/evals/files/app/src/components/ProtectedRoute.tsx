import { Navigate } from "react-router-dom";
import { useAppStore } from "../store/appStore";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user } = useAppStore();
  if (!user) return <Navigate to="/login" />;
  return children;
}
