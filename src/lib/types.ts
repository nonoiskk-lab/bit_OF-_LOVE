export type Diet = "veg" | "nonveg" | "egg";

export type NavGroup =
  | "breakfast"
  | "protein"
  | "coffee"
  | "burgers"
  | "pizza"
  | "pasta"
  | "quick-bites"
  | "chicken"
  | "fine-dine"
  | "biryani"
  | "mocktails"
  | "dessert"
  | "combos";

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  diet: Diet;
  description?: string;
  hero?: boolean;
  datePick?: boolean;
  protein?: boolean;
  deliveryEligible?: boolean;
  mood?: string[];
}

export interface MenuCategory {
  id: string;
  number: string;
  title: string;
  navGroup: NavGroup;
  emotionalLine: string;
  mood: "bright" | "clean" | "warm-dark" | "bold" | "elegant" | "playful" | "romantic";
  timeContext?: "morning" | "afternoon-evening" | "evening" | "all-day";
  items: MenuItem[];
}

export interface Cottage {
  id: string;
  name: string;
  capacity: number;
  minDurationMinutes: number;
  price: number;
  description: string;
  amenities: string[];
}

export type Occasion =
  | "date"
  | "birthday"
  | "anniversary"
  | "celebration"
  | "private-dinner"
  | "family"
  | "friends"
  | "other";

export interface Mood {
  id: string;
  emoji: string;
  label: string;
  navGroups: NavGroup[];
}

export interface OrderLine {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface OrderRecord {
  id: string;
  createdAt: string;
  fulfilment: "delivery" | "pickup";
  status: "NEW" | "CONFIRMED" | "PREPARING" | "READY" | "OUT_FOR_DELIVERY" | "COMPLETED" | "CANCELLED";
  lines: OrderLine[];
  total: number;
  customer: { name: string; phone: string; address?: string };
  paymentMethod: "upi" | "card" | "cod";
}

export interface TableBookingRecord {
  id: string;
  createdAt: string;
  date: string;
  time: string;
  guests: number;
  seating: "indoor" | "outdoor";
  customer: { name: string; phone: string };
  specialRequest?: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
}

export interface CottageBookingRecord {
  id: string;
  createdAt: string;
  cottageId: string;
  date: string;
  time: string;
  guests: number;
  occasion: Occasion;
  customRequest?: string;
  customer: { name: string; phone: string; email?: string };
  advancePaid: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
}

export interface CateringLead {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email?: string;
  eventDate?: string;
  eventType: string;
  guestCount: number;
  budget?: string;
  foodPreference: "veg" | "nonveg" | "mixed";
  message?: string;
}
