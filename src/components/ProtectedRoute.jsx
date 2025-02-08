// components/ProtectedRoute.js
import { Navigate } from "react-router-dom";
import { useSubscription } from "../hooks/useSubscription";
import { toast } from "react-toastify";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export const ProtectedRoute = ({ children, feature }) => {
  const { user } = useContext(UserContext);

  if (
    !user ||
    (user.subscriptionTier !== "premium" && feature !== "freeFeature")
  ) {
    toast.info(`This feature requires a premium subscription`);
    return <Navigate to="/upgrade" replace />;
  }

  return children;
};
