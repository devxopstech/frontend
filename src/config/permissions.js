// config/permissions.js
export const SUBSCRIPTION_TIERS = {
  FREE: "free",
  PREMIUM: "premium",
};

export const FEATURE_ACCESS = {
  // Basic Schedule Features (Available to All)
  createSchedule: ["free", "premium"],
  viewSchedule: ["free", "premium"],
  deleteSchedule: ["free", "premium"],
  submitPriorities: ["free", "premium"],
  viewCurrentPriorities: ["free", "premium"],
  addEmployee: ["free", "premium"],

  // Limited Features (With Counts for Free Users)
  workArrangementBuilds: {
    free: 5,
    premium: "unlimited",
  },
  schedulePerMonth: {
    free: 3,
    premium: "unlimited",
  },
  employeesPerSchedule: {
    free: 10,
    premium: "unlimited",
  },

  // Premium-Only Features
  exportSchedule: ["premium"],
  shareSchedule: ["premium"],
  exportCalendar: ["premium"],
  archiveAccess: ["premium"],

  // Additional Premium Features
  customScheduleSettings: ["premium"],
  priorityAnalytics: ["premium"],
  scheduleTemplates: ["premium"],
  advancedReports: ["premium"],
};

// Usage limits and thresholds
export const USAGE_LIMITS = {
  FREE_TIER: {
    maxBuildsPerMonth: 5,
    maxSchedulesPerMonth: 3,
    maxEmployeesPerSchedule: 10,
    maxPrioritiesPerEmployee: 5,
  },
  PREMIUM_TIER: {
    maxBuildsPerMonth: Infinity,
    maxSchedulesPerMonth: Infinity,
    maxEmployeesPerSchedule: Infinity,
    maxPrioritiesPerEmployee: Infinity,
  },
};

// Feature routes that require premium
export const PREMIUM_ROUTES = [
  "/share/:scheduleId",
  "/export/:scheduleId",
  "/archive/:scheduleId",
];

// Toast messages for upgrade prompts
export const UPGRADE_MESSAGES = {
  exportSchedule: "Upgrade to Premium to export schedules",
  shareSchedule: "Upgrade to Premium to share schedules",
  workArrangementLimit: "Upgrade to Premium for unlimited arrangement builds",
  employeeLimit: "Upgrade to Premium to add more employees",
  archiveAccess: "Upgrade to Premium to access archive features",
};
