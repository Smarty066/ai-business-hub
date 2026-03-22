export const FREE_FEATURE_ROUTES = ["/converter", "/calculator", "/notes", "/affiliate"] as const;

export const PAID_FEATURES = {
  "/dashboard": "Business Dashboard",
  "/booking": "Bookings",
  "/budget": "Budget & Finance",
  "/customers": "Customer CRM",
  "/inventory": "Inventory Management",
  "/sales-report": "Sales Reports",
} as const;

export function getDefaultAppRoute(hasFullAccess: boolean) {
  return hasFullAccess ? "/dashboard" : "/notes";
}

export function isPaidFeatureRoute(path: string) {
  return path in PAID_FEATURES;
}