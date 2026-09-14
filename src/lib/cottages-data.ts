import { Cottage } from "./types";

export const COTTAGES: Cottage[] = [
  {
    id: "cottage-01",
    name: "Cottage 01",
    capacity: 4,
    minDurationMinutes: 90,
    price: 1499,
    description:
      "An intimate cottage built for two, or a small table of close friends. Low light, close seating, private door.",
    amenities: [
      "Private seating for up to 4",
      "Dedicated server",
      "Ambient lighting control",
      "Bluetooth speaker",
      "Complimentary candle setup",
    ],
  },
  {
    id: "cottage-02",
    name: "Cottage 02",
    capacity: 6,
    minDurationMinutes: 90,
    price: 1899,
    description:
      "A larger private cottage for birthdays, small celebrations and family dinners, with room to decorate.",
    amenities: [
      "Private seating for up to 6",
      "Dedicated server",
      "Space for decoration setup",
      "Bluetooth speaker",
      "Complimentary candle setup",
    ],
  },
];

export const OCCASIONS: { id: string; label: string }[] = [
  { id: "date", label: "Date" },
  { id: "birthday", label: "Birthday" },
  { id: "anniversary", label: "Anniversary" },
  { id: "celebration", label: "Celebration" },
  { id: "private-dinner", label: "Private Dinner" },
  { id: "family", label: "Family" },
  { id: "friends", label: "Friends" },
  { id: "other", label: "Other" },
];

/** Restaurant service window used to generate bookable time slots. */
export const SLOT_TIMES = [
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "6:00 PM",
  "7:00 PM",
  "7:30 PM",
  "8:00 PM",
  "8:30 PM",
  "9:00 PM",
  "9:30 PM",
];
