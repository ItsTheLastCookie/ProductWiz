import { MarketingScenario } from './types';

export const MARKETING_SCENARIOS: MarketingScenario[] = [
  // Apparel - Tops
  {
    id: 'tshirt',
    label: 'T-Shirt',
    icon: '👕',
    promptTemplate: 'Visualize this product design printed on the center of a plain white cotton t-shirt worn by a model in a casual setting.'
  },
  {
    id: 'hoodie',
    label: 'Hoodie',
    icon: '🧥', // using coat icon as close proxy or custom
    promptTemplate: 'Show this product design on a high-quality heather grey streetwear hoodie. The product branding should be visible on the chest.'
  },
  {
    id: 'jacket_denim',
    label: 'Denim Jacket',
    icon: '🧥',
    promptTemplate: 'Place this design as a patch or print on the back of a vintage blue denim jacket.'
  },
  {
    id: 'jacket_bomber',
    label: 'Bomber Jacket',
    icon: '✈️',
    promptTemplate: 'Visualize this product style integrated onto a sleek black bomber jacket worn by a fashion model.'
  },
  
  // Apparel - Bottoms
  {
    id: 'shorts',
    label: 'Shorts',
    icon: '🩳',
    promptTemplate: 'Display this pattern or logo on a pair of athletic mesh shorts suitable for summer or sports.'
  },
  {
    id: 'sweatpants',
    label: 'Joggers',
    icon: '👖',
    promptTemplate: 'Show this design featured on the leg of comfortable cotton sweatpants/joggers in a studio setting.'
  },
  {
    id: 'jeans',
    label: 'Jeans',
    icon: '👖',
    promptTemplate: 'Apply this product aesthetic to the back pocket embroidery of a pair of classic blue jeans.'
  },

  // Headwear
  {
    id: 'cap',
    label: 'Baseball Cap',
    icon: '🧢',
    promptTemplate: 'Visualize this logo or design embroidered on the front of a classic structured baseball cap.'
  },
  {
    id: 'beanie',
    label: 'Beanie',
    icon: '❄️',
    promptTemplate: 'Show this product logo on a folded knitted beanie label, winter fashion style.'
  },

  // Accessories & Objects
  {
    id: 'totebag',
    label: 'Tote Bag',
    icon: '👜',
    promptTemplate: 'Print this design on a canvas tote bag hanging on a shoulder, lifestyle photography.'
  },
  {
    id: 'mug',
    label: 'Coffee Mug',
    icon: '☕',
    promptTemplate: 'Place this product realistically onto a generic white ceramic coffee mug sitting on a wooden table. Maintain the product branding and appearance perfectly.'
  },
  {
    id: 'bottle',
    label: 'Water Bottle',
    icon: '💧',
    promptTemplate: 'Apply this design to a stainless steel reusable water bottle, gym setting background.'
  },
  {
    id: 'phonecase',
    label: 'Phone Case',
    icon: '📱',
    promptTemplate: 'Visualize this pattern or image covering the back of a modern smartphone case.'
  },
  {
    id: 'backpack',
    label: 'Backpack',
    icon: '🎒',
    promptTemplate: 'Show this design applied to the front pocket area of a modern urban backpack.'
  },

  // Advertising
  {
    id: 'billboard',
    label: 'Billboard',
    icon: '🏙️',
    promptTemplate: 'Show this product displayed on a large digital billboard in a busy city intersection like Times Square. The product should be the main focus of the advertisement.'
  },
  {
    id: 'magazine',
    label: 'Magazine Ad',
    icon: '📰',
    promptTemplate: 'Create a glossy magazine advertisement layout featuring this product. Use professional studio lighting and a clean, minimalist background.'
  }
];

export const EDIT_SUGGESTIONS = [
  "Make it look vintage and worn",
  "Add a cyberpunk neon glow",
  "Turn it into a pencil sketch",
  "Place it on a marble countertop",
  "Add a snowy winter background",
  "Make it gold plated",
  "Set it on fire (visually)",
  "Underwater scene with bubbles"
];

// Increased to 50 thanks to IndexedDB storage
export const MAX_GENERATED_HISTORY = 50;