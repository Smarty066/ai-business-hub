export const FREE_FEATURE_ROUTES = ["/converter", "/calculator", "/notes", "/affiliate"] as const;

export const PAID_FEATURES = {
  "/booking": "Bookings",
  "/budget": "Budget & Finance",
  "/customers": "Customer CRM",
  "/inventory": "Inventory Management",
  "/sales-report": "Sales Reports",
} as const;

export function getDefaultAppRoute(_hasFullAccess: boolean) {
  return "/dashboard";
}

export function isPaidFeatureRoute(path: string) {
  return path in PAID_FEATURES;
}
