import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useSubscription } from "../hooks/useSubscription";

export const LimitedRoute = ({ children, feature }) => {
  const { isWithinUsageLimit, checkAndShowUpgradePrompt } = useSubscription();
  const [loading, setLoading] = useState(true);
  const [canAccess, setCanAccess] = useState(true);
  const [buildCount, setBuildCount] = useState(() => {
    const stored = localStorage.getItem("buildCount");
    return stored ? parseInt(stored, 10) : 0;
  });

  useEffect(() => {
    localStorage.setItem("buildCount", buildCount.toString());
  }, [buildCount]);

  useEffect(() => {
    const checkLimit = () => {
      const hasAccess = isWithinUsageLimit(feature, buildCount);
      if (!hasAccess) {
        checkAndShowUpgradePrompt(feature);
      }
      setCanAccess(hasAccess);
      setLoading(false);
    };
    checkLimit();
  }, [feature, buildCount, isWithinUsageLimit, checkAndShowUpgradePrompt]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return canAccess ? children : <Navigate to="/upgrade" replace />;
};
