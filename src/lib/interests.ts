export interface Interest {
  id: string;
  label: string;
  emoji: string;
  category: string;
}

export const interests: Interest[] = [
  { id: "hiking", label: "Hiking", emoji: "🥾", category: "Outdoors" },
  { id: "beach", label: "Beach", emoji: "🏖️", category: "Outdoors" },
  { id: "camping", label: "Camping", emoji: "⛺", category: "Outdoors" },
  { id: "cycling", label: "Cycling", emoji: "🚴", category: "Outdoors" },
  { id: "fine-dining", label: "Fine Dining", emoji: "🍽️", category: "Food & Drink" },
  { id: "street-food", label: "Street Food", emoji: "🍜", category: "Food & Drink" },
  { id: "cafes", label: "Cafés", emoji: "☕", category: "Food & Drink" },
  { id: "bars", label: "Bars & Nightlife", emoji: "🍸", category: "Food & Drink" },
  { id: "cooking", label: "Cooking Class", emoji: "👨‍🍳", category: "Food & Drink" },
  { id: "movies", label: "Movies", emoji: "🎬", category: "Entertainment" },
  { id: "gaming", label: "Gaming", emoji: "🎮", category: "Entertainment" },
  { id: "board-games", label: "Board Games", emoji: "🎲", category: "Entertainment" },
  { id: "karaoke", label: "Karaoke", emoji: "🎤", category: "Entertainment" },
  { id: "escape-room", label: "Escape Rooms", emoji: "🔐", category: "Entertainment" },
  { id: "football", label: "Football", emoji: "⚽", category: "Sports" },
  { id: "gym", label: "Gym", emoji: "💪", category: "Sports" },
  { id: "swimming", label: "Swimming", emoji: "🏊", category: "Sports" },
  { id: "go-kart", label: "Go Karting", emoji: "🏎️", category: "Sports" },
  { id: "museums", label: "Museums", emoji: "🏛️", category: "Culture" },
  { id: "art", label: "Art Galleries", emoji: "🎨", category: "Culture" },
  { id: "music", label: "Live Music", emoji: "🎵", category: "Culture" },
  { id: "theatre", label: "Theatre", emoji: "🎭", category: "Culture" },
  { id: "road-trip", label: "Road Trips", emoji: "🚗", category: "Travel" },
  { id: "city-break", label: "City Breaks", emoji: "🌆", category: "Travel" },
  { id: "nature-retreat", label: "Nature Retreats", emoji: "🌿", category: "Travel" },
  { id: "backpacking", label: "Backpacking", emoji: "🎒", category: "Travel" },
];

export const interestCategories = [...new Set(interests.map((i) => i.category))];

export function getInterestById(id: string): Interest | undefined {
  return interests.find((i) => i.id === id);
}
