// Roles that open a module. Admin and Super Admin can open every module; other users only get a module once
// an Admin assigns them one of its roles in Role Management. The backend checks the same roles
// (backend/routes/Translation/documentTranslationRoutes.js, backend/routes/TechPack/legacyTpRoutes.js).
export const DOCUMENT_TRANSLATION_ROLES = ["Document Translation"];
export const LEGACY_TP_ROLES = ["Legacy TP"];
export const DATA_CENTER_ROLES = ["MR Clerk", "Tech Pack", "Admin", "Super Admin"];
// Colour Bank is shared master data; "Tech Pack" users keep access because the BOM sub-page adds colours to it.
// Keep in sync with COLOR_BANK_ROLES in backend/routes/TechPack/colorBankRoutes.js
export const COLOR_BANK_ROLES = ["Color Bank", "Tech Pack"];

/**
 * Module Configuration
 * Status values:
 *   'F' = Completed (Light Green)
 *   'D' = Under Developing (Light Orange)
 *   'C' = Coming Soon (Light Gray, Super Admin access only)
 * Version values:
 *   '1.0' / '0.5' / '0.1' / '0' ('0' defaults to 'C')
 */
export const modulesConfig = [
  {
    id: "main_operations",
    titleKey: "tech.Production Planning & Operations",
    items: [
      {
        path: "/marker-order",
        roles: ["Admin", "Super Admin", "Tech Pack"],
        image: "/assets/modules/marker-order.jpg",
        titleKey: "tech.Marker Order",
        description: "Create and manage marker orders.",
        status: "C",
        version: "0",
      },
      {
        path: "/marker-ratio",
        roles: ["Admin", "Super Admin", "Tech Pack"],
        image: "/assets/modules/marker-ratio.jpg",
        titleKey: "tech.Marker Ratio",
        description: "Marker ratio planning.",
        status: "C",
        version: "0",
      },
      {
        path: "/fabric-consumption",
        roles: ["Admin", "Super Admin", "Tech Pack"],
        image: "/assets/modules/fabric-consumption.jpg",
        titleKey: "tech.Fabric Consumption",
        description: "Fabric usage estimates.",
        status: "C",
        version: "0",
      },
      {
        path: "/thread-consumption",
        roles: ["Admin", "Super Admin", "Tech Pack"],
        image: "/assets/modules/thread-consumption.jpg",
        titleKey: "tech.Thread Consumption",
        description: "Thread usage estimates.",
        status: "C",
        version: "0",
      },
      {
        path: "/gsd-sam",
        roles: ["Super Admin"],
        image: "/assets/modules/gsd-sam.jpg",
        titleKey: "tech.GSD / SAM",
        description: "General sewing data / standard allowed minutes.",
        status: "C",
        version: "0",
      },
      {
        path: "/sample",
        roles: ["Super Admin"],
        image: "/assets/modules/sample.jpg",
        titleKey: "tech.Sample",
        description: "Sample development and approvals.",
        status: "C",
        version: "0",
      },
    ],
  },
];

export default modulesConfig;
