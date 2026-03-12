export type DashboardStep = {
  title: string;
  href: string;
  shortTitle: string;
};

export const dashboardSteps: DashboardStep[] = [
  {
    title: "Fill out the Real Estate Condition Report",
    shortTitle: "Condition Report",
    href: "/dashboard/condition-report",
  },
  {
    title: "Fill out the Lead Paint Disclosure",
    shortTitle: "Lead Paint Disclosure",
    href: "/dashboard/lead-paint",
  },
  {
    title: "Set Price",
    shortTitle: "Set Price",
    href: "/dashboard/set-price",
  },
  {
    title: "List the Home",
    shortTitle: "List the Home",
    href: "/dashboard/list-home",
  },
  {
    title: "Prepare Marketing",
    shortTitle: "Prepare Marketing",
    href: "/dashboard/prepare-marketing",
  },
  {
    title: "Accept Offers",
    shortTitle: "Accept Offers",
    href: "/dashboard/accept-offers",
  },
  {
    title: "Complete Inspection",
    shortTitle: "Complete Inspection",
    href: "/dashboard/inspection",
  },
  {
    title: "Closing",
    shortTitle: "Closing",
    href: "/dashboard/closing",
  },
];