export const themes = [
  {
    id: "default",
    name: "Défaut",
    className: "bg-background dark:bg-slate-900",
    preview: "linear-gradient(to bottom right, #f8fafc, #f1f5f9)",
  },
  {
    id: "ocean",
    name: "Océan",
    className:
      "bg-gradient-to-br from-blue-200 via-cyan-100 to-blue-50 dark:from-blue-900 dark:via-cyan-900 dark:to-blue-800",
    preview: "linear-gradient(to bottom right, #bfdbfe, #a5f3fc, #dbeafe)",
  },
  {
    id: "forest",
    name: "Forêt",
    className:
      "bg-gradient-to-br from-emerald-200 via-green-100 to-emerald-50 dark:from-emerald-900 dark:via-green-900 dark:to-emerald-800",
    preview: "linear-gradient(to bottom right, #a7f3d0, #bbf7d0, #d1fae5)",
  },
  {
    id: "sunset",
    name: "Crépuscule",
    className:
      "bg-gradient-to-br from-rose-200 via-orange-100 to-yellow-50 dark:from-rose-900 dark:via-orange-900 dark:to-yellow-800",
    preview: "linear-gradient(to bottom right, #fecdd3, #fed7aa, #fef3c7)",
  },
  {
    id: "galaxy",
    name: "Galaxie",
    className: "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800",
    preview: "linear-gradient(to bottom right, #0f172a, #581c87, #1e293b)",
  },
  {
    id: "candy",
    name: "Bonbon",
    className:
      "bg-gradient-to-br from-pink-200 via-fuchsia-100 to-purple-50 dark:from-pink-900 dark:via-fuchsia-900 dark:to-purple-800",
    preview: "linear-gradient(to bottom right, #fbcfe8, #f5d0fe, #fae8ff)",
  },
  {
    id: "lavender",
    name: "Lavande",
    className:
      "bg-gradient-to-br from-purple-200 via-violet-100 to-indigo-50 dark:from-purple-900 dark:via-violet-900 dark:to-indigo-800",
    preview: "linear-gradient(to bottom right, #e9d5ff, #ddd6fe, #e0e7ff)",
  },
  {
    id: "autumn",
    name: "Automne",
    className:
      "bg-gradient-to-br from-amber-200 via-orange-100 to-red-50 dark:from-amber-900 dark:via-orange-900 dark:to-red-800",
    preview: "linear-gradient(to bottom right, #fde68a, #fed7aa, #fee2e2)",
  },
  // Thèmes avec images
  {
    id: "mountains",
    name: "Montagnes",
    type: "image",
    imageUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80",
    className: "bg-cover bg-center bg-no-repeat",
    style: {
      backgroundImage:
        "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80')",
    },
    preview: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80')",
  },
  {
    id: "beach",
    name: "Plage Tropicale",
    type: "image",
    imageUrl:
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1920&q=80",
    className: "bg-cover bg-center bg-no-repeat",
    style: {
      backgroundImage:
        "url('https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1920&q=80')",
    },
    preview: "url('https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400&q=80')",
  },
  {
    id: "northern-lights",
    name: "Aurore Boréale",
    type: "image",
    imageUrl:
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1920&q=80",
    className: "bg-cover bg-center bg-no-repeat",
    style: {
      backgroundImage:
        "url('https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1920&q=80')",
    },
    preview: "url('https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&q=80')",
  },
  {
    id: "cherry-blossom",
    name: "Cerisier en Fleur",
    type: "image",
    imageUrl:
      "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=1920&q=80",
    className: "bg-cover bg-center bg-no-repeat",
    style: {
      backgroundImage:
        "url('https://images.unsplash.com/photo-1522383225653-ed111181a951?w=1920&q=80')",
    },
    preview: "url('https://images.unsplash.com/photo-1522383225653-ed111181a951?w=400&q=80')",
  },
  {
    id: "space",
    name: "Espace",
    type: "image",
    imageUrl:
      "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&q=80",
    className: "bg-cover bg-center bg-no-repeat",
    style: {
      backgroundImage:
        "url('https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&q=80')",
    },
    preview: "url('https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&q=80')",
  },
  {
    id: "tokyo-night",
    name: "Tokyo de Nuit",
    type: "image",
    imageUrl:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1920&q=80",
    className: "bg-cover bg-center bg-no-repeat",
    style: {
      backgroundImage:
        "url('https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1920&q=80')",
    },
    preview: "url('https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80')",
  },
  {
    id: "desert",
    name: "Désert",
    type: "image",
    imageUrl:
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1920&q=80",
    className: "bg-cover bg-center bg-no-repeat",
    style: {
      backgroundImage:
        "url('https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1920&q=80')",
    },
    preview: "url('https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&q=80')",
  },
  {
    id: "waterfall",
    name: "Cascade",
    type: "image",
    imageUrl:
      "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=1920&q=80",
    className: "bg-cover bg-center bg-no-repeat",
    style: {
      backgroundImage:
        "url('https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=1920&q=80')",
    },
    preview: "url('https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=400&q=80')",
  },
  // Patterns géométriques
  {
    id: "geometric-blue",
    name: "Géométrique Bleu",
    type: "pattern",
    className: "bg-blue-50 dark:bg-blue-900",
    style: {
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233b82f6' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    },
    preview: "linear-gradient(to bottom right, #eff6ff, #dbeafe)",
  },
  {
    id: "dots-purple",
    name: "Points Violets",
    type: "pattern",
    className: "bg-purple-50 dark:bg-purple-900",
    style: {
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239333ea' fill-opacity='0.2' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
    },
    preview: "linear-gradient(to bottom right, #faf5ff, #f3e8ff)",
  },
  {
    id: "waves-teal",
    name: "Vagues Turquoise",
    type: "pattern",
    className: "bg-teal-50 dark:bg-teal-900",
    style: {
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%2314b8a6' fill-opacity='0.15'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    },
    preview: "linear-gradient(to bottom right, #f0fdfa, #ccfbf1)",
  },
];
