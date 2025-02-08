// hooks/useSubscription.js
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import {
  FEATURE_ACCESS,
  USAGE_LIMITS,
  UPGRADE_MESSAGES,
} from "../config/permissions";
import { toast } from "react-toastify";

export const useSubscription = () => {
  const { user } = useContext(UserContext);
  const tier = user?.subscriptionTier || "free";

  const canAccess = (feature) => {
    if (tier === "premium") return true;
    if (!FEATURE_ACCESS[feature]) return false;
    if (Array.isArray(FEATURE_ACCESS[feature])) {
      return FEATURE_ACCESS[feature].includes(tier);
    }
    return true;
  };

  const getLimit = (feature) => {
    if (!FEATURE_ACCESS[feature]) return 0;
    return FEATURE_ACCESS[feature][tier];
  };

  const checkAndShowUpgradePrompt = (feature) => {
    if (!canAccess(feature)) {
      toast.info(
        UPGRADE_MESSAGES[feature] ||
          "Upgrade to Premium for additional features"
      );
      return false;
    }
    return true;
  };

  const isWithinUsageLimit = (feature, currentCount) => {
    if (tier === 'premium') return true;
    const limits =
      tier === "free" ? USAGE_LIMITS.FREE_TIER : USAGE_LIMITS.PREMIUM_TIER;
    const limit = limits[feature];
    return currentCount < limit;
  };

  return {
    tier,
    canAccess,
    getLimit,
    checkAndShowUpgradePrompt,
    isWithinUsageLimit,
    isPremium: tier === "premium",
  };
};
