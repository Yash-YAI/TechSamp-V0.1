/**
 * Global Main Administrative Roles
 * Defined once here: Admin and Super Admin have default access to all modules.
 * - Super Admin can view and open ALL modules (including Coming Soon).
 * - Admin can view all modules, open Completed ('F') and Developing ('D') modules, but cannot open Coming Soon ('C') modules.
 */
export const MAIN_ROLES = ["Super Admin", "Admin"];

/**
 * Module Configuration
 * No need to repeat "Admin" and "Super Admin" inside each item; they are handled universally above.
 * Each module specifies only its module-specific role name.
 * 
 * Status values:
 *   'F' = Completed (Light Green) 1.0
 *   'D' = Under Developing (Light Orange) 1.5
 *   'C' = Coming Soon (Light Gray) 0 - Can be seen by Admin on Home, but opened by Super Admin only
 * Version values:
 *   '1.0' / '0.5' / '0.1' / '0' ('0' defaults to 'C')
 */
export const modulesConfig = [
  {
    id: "main_operations",
    titleKey: "tech.Production Planning & Operations",
    title: "Production Planning & Operations",
    items: [
      {
        path: "/marker-order",
        roles: ["Marker Order"],
        image: "/assets/modules/marker-order.jpg",
        titleKey: "tech.Marker Order",
        title: "Marker Order",
        description: "Create and manage marker orders.",
        status: "C",
        version: "0",
      },
      {
        path: "/marker-ratio",
        roles: ["Marker Ratio"],
        image: "/assets/modules/marker-ratio.jpg",
        titleKey: "tech.Marker Ratio",
        title: "Marker Ratio",
        description: "Marker ratio planning.",
        status: "C",
        version: "0",
      },
      {
        path: "/fabric-consumption",
        roles: ["Fabric Consumption"],
        image: "/assets/modules/fabric-consumption.jpg",
        titleKey: "tech.Fabric Consumption",
        title: "Fabric Consumption",
        description: "Fabric usage estimates.",
        status: "C",
        version: "0",
      },
      {
        path: "/thread-consumption",
        roles: ["Thread Consumption"],
        image: "/assets/modules/thread-consumption.jpg",
        titleKey: "tech.Thread Consumption",
        title: "Thread Consumption",
        description: "Thread usage estimates.",
        status: "c",
        version: "0",
      },
      {
        path: "/gsd-sam",
        roles: ["GSD / SAM"],
        image: "/assets/modules/gsd-sam.jpg",
        titleKey: "tech.GSD / SAM",
        title: "GSD / SAM",
        description: "General sewing data / standard allowed minutes.",
        status: "C",
        version: "0",
      },
      {
        path: "/sample",
        roles: ["Sample"],
        image: "/assets/modules/sample.jpg",
        titleKey: "tech.Sample",
        title: "Sample",
        description: "Sample development and approvals.",
        status: "C",
        version: "0",
      },
    ],
  },
];

export default modulesConfig;
