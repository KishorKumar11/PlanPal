export interface Interest {
  id: string;
  label: string;
  icon: string; // Lucide icon name
  category: string;
}

export const interests: Interest[] = [
  { id: "hiking", label: "Hiking", icon: "Mountain", category: "Outdoors" },
  { id: "beach", label: "Beach", icon: "Sunset", category: "Outdoors" },
  { id: "camping", label: "Camping", icon: "Tent", category: "Outdoors" },
  { id: "cycling", label: "Cycling", icon: "Bike", category: "Outdoors" },
  { id: "fine-dining", label: "Fine Dining", icon: "UtensilsCrossed", category: "Food & Drink" },
  { id: "street-food", label: "Street Food", icon: "Sandwich", category: "Food & Drink" },
  { id: "cafes", label: "Cafés", icon: "Coffee", category: "Food & Drink" },
  { id: "bars", label: "Bars & Nightlife", icon: "Wine", category: "Food & Drink" },
  { id: "cooking", label: "Cooking Class", icon: "ChefHat", category: "Food & Drink" },
  { id: "movies", label: "Movies", icon: "Film", category: "Entertainment" },
  { id: "gaming", label: "Gaming", icon: "Gamepad2", category: "Entertainment" },
  { id: "board-games", label: "Board Games", icon: "Dices", category: "Entertainment" },
  { id: "karaoke", label: "Karaoke", icon: "Mic", category: "Entertainment" },
  { id: "escape-room", label: "Escape Rooms", icon: "Lock", category: "Entertainment" },
  { id: "football", label: "Football", icon: "Trophy", category: "Sports" },
  { id: "gym", label: "Gym", icon: "Dumbbell", category: "Sports" },
  { id: "swimming", label: "Swimming", icon: "Waves", category: "Sports" },
  { id: "go-kart", label: "Go Karting", icon: "Gauge", category: "Sports" },
  { id: "museums", label: "Museums", icon: "Landmark", category: "Culture" },
  { id: "art", label: "Art Galleries", icon: "Brush", category: "Culture" },
  { id: "music", label: "Live Music", icon: "Music", category: "Culture" },
  { id: "theatre", label: "Theatre", icon: "Drama", category: "Culture" },
  { id: "road-trip", label: "Road Trips", icon: "Route", category: "Travel" },
  { id: "city-break", label: "City Breaks", icon: "Building2", category: "Travel" },
  { id: "nature-retreat", label: "Nature Retreats", icon: "TreePine", category: "Travel" },
  { id: "backpacking", label: "Backpacking", icon: "Backpack", category: "Travel" },
];

export const interestCategories = [...new Set(interests.map((i) => i.category))];

export function getInterestById(id: string): Interest | undefined {
  return interests.find((i) => i.id === id);
}
