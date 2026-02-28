export interface Restaurant {
  id: string;
  name: string;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  priceRange: string;
  distance: string;
  vibes: string[];
  address: string;
  openHours: string;
  isOpen: boolean;
  menu: { name: string; price: string }[];
  checkins: number;
  friendsVisited: string[];
}

export const moods = [
  { id: "study", emoji: "📚", label: "Study" },
  { id: "date", emoji: "💕", label: "Date" },
  { id: "group", emoji: "👥", label: "Group" },
  { id: "chill", emoji: "🧊", label: "Chill" },
  { id: "alone", emoji: "🎧", label: "Alone" },
] as const;

export const foodCategories = [
  "All", "Vietnamese", "Korean", "Japanese", "Italian", "Thai", "Café", "BBQ", "Dessert", "Street Food"
];

export const restaurants: Restaurant[] = [
  {
    id: "1",
    name: "The Green Patio",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop",
    category: "Café",
    rating: 4.8,
    reviewCount: 342,
    priceRange: "$$",
    distance: "0.3 km",
    vibes: ["Quiet", "Aesthetic", "Study-Friendly"],
    address: "12 Nguyen Hue, District 1",
    openHours: "7:00 AM - 10:00 PM",
    isOpen: true,
    menu: [
      { name: "Matcha Latte", price: "55k" },
      { name: "Avocado Toast", price: "85k" },
      { name: "Açaí Bowl", price: "95k" },
    ],
    checkins: 128,
    friendsVisited: ["Minh", "Hana", "Duc"],
  },
  {
    id: "2",
    name: "Saigon BBQ House",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop",
    category: "BBQ",
    rating: 4.5,
    reviewCount: 567,
    priceRange: "$$$",
    distance: "1.2 km",
    vibes: ["Crowded", "Group-Friendly", "Lively"],
    address: "88 Le Loi, District 1",
    openHours: "11:00 AM - 11:00 PM",
    isOpen: true,
    menu: [
      { name: "Premium Wagyu Set", price: "350k" },
      { name: "Seafood Platter", price: "280k" },
      { name: "Combo for 4", price: "600k" },
    ],
    checkins: 456,
    friendsVisited: ["Linh", "Tuan"],
  },
  {
    id: "3",
    name: "Moonlight Ramen",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=400&fit=crop",
    category: "Japanese",
    rating: 4.7,
    reviewCount: 289,
    priceRange: "$$",
    distance: "0.8 km",
    vibes: ["Cozy", "Romantic", "Quiet"],
    address: "45 Hai Ba Trung, District 3",
    openHours: "10:00 AM - 9:30 PM",
    isOpen: true,
    menu: [
      { name: "Tonkotsu Ramen", price: "120k" },
      { name: "Gyoza Set", price: "75k" },
      { name: "Matcha Tiramisu", price: "65k" },
    ],
    checkins: 234,
    friendsVisited: ["Hana", "Phuong", "Minh", "An"],
  },
  {
    id: "4",
    name: "Phở Thìn Legacy",
    image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&h=400&fit=crop",
    category: "Vietnamese",
    rating: 4.9,
    reviewCount: 1203,
    priceRange: "$",
    distance: "2.1 km",
    vibes: ["Authentic", "Local", "Quick Bite"],
    address: "13 Lo Duc, Hai Ba Trung",
    openHours: "6:00 AM - 2:00 PM",
    isOpen: false,
    menu: [
      { name: "Phở Bò Đặc Biệt", price: "55k" },
      { name: "Phở Tái Nạm", price: "45k" },
      { name: "Quẩy", price: "10k" },
    ],
    checkins: 892,
    friendsVisited: ["Duc"],
  },
  {
    id: "5",
    name: "Sunset Rooftop Bar",
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&h=400&fit=crop",
    category: "Italian",
    rating: 4.6,
    reviewCount: 456,
    priceRange: "$$$$",
    distance: "3.5 km",
    vibes: ["Romantic", "Aesthetic", "Date Night"],
    address: "Top Floor, AB Tower, District 1",
    openHours: "5:00 PM - 1:00 AM",
    isOpen: true,
    menu: [
      { name: "Truffle Pasta", price: "280k" },
      { name: "Wine Flight", price: "350k" },
      { name: "Tiramisu", price: "120k" },
    ],
    checkins: 312,
    friendsVisited: ["Linh", "Hana"],
  },
  {
    id: "6",
    name: "Bún Chả 36",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop",
    category: "Street Food",
    rating: 4.4,
    reviewCount: 789,
    priceRange: "$",
    distance: "0.5 km",
    vibes: ["Local", "Quick Bite", "Authentic"],
    address: "36 Hang Manh, Hoan Kiem",
    openHours: "10:00 AM - 8:00 PM",
    isOpen: true,
    menu: [
      { name: "Bún Chả Hà Nội", price: "40k" },
      { name: "Nem Rán", price: "25k" },
      { name: "Trà Đá", price: "5k" },
    ],
    checkins: 567,
    friendsVisited: ["Tuan", "Minh", "An"],
  },
  {
    id: "7",
    name: "K-Town Kitchen",
    image: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=600&h=400&fit=crop",
    category: "Korean",
    rating: 4.3,
    reviewCount: 321,
    priceRange: "$$",
    distance: "1.8 km",
    vibes: ["Group-Friendly", "Lively", "Fun"],
    address: "77 Tran Hung Dao, District 5",
    openHours: "11:00 AM - 10:00 PM",
    isOpen: true,
    menu: [
      { name: "Bibimbap", price: "95k" },
      { name: "Korean Fried Chicken", price: "150k" },
      { name: "Soju Tower", price: "200k" },
    ],
    checkins: 198,
    friendsVisited: ["Phuong"],
  },
  {
    id: "8",
    name: "Gelato Paradiso",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=400&fit=crop",
    category: "Dessert",
    rating: 4.7,
    reviewCount: 654,
    priceRange: "$",
    distance: "0.6 km",
    vibes: ["Sweet", "Aesthetic", "Date-Friendly"],
    address: "22 Dong Khoi, District 1",
    openHours: "9:00 AM - 11:00 PM",
    isOpen: true,
    menu: [
      { name: "Triple Scoop", price: "65k" },
      { name: "Gelato Cake", price: "120k" },
      { name: "Affogato", price: "55k" },
    ],
    checkins: 445,
    friendsVisited: ["Hana", "Linh", "Minh"],
  },
];

export const trendingByTime = {
  morning: restaurants.filter((_, i) => [0, 3, 5].includes(i)),
  afternoon: restaurants.filter((_, i) => [1, 2, 6].includes(i)),
  night: restaurants.filter((_, i) => [4, 1, 7].includes(i)),
};

export const userProfile = {
  name: "Alex Nguyen",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop",
  username: "@alexnguyen",
  totalCheckins: 47,
  streak: 5,
  badges: ["🔥 5-Day Streak", "🎯 Explorer", "📸 Foodie Pro", "👥 Social Butterfly"],
  favoriteRestaurants: ["1", "3", "5"],
  eatingPrefs: ["Vietnamese", "Japanese", "Café"],
  weeklyCheckins: [3, 5, 2, 4, 6, 3, 4],
  monthlyBudget: 2500000,
  monthlySpent: 1850000,
  friends: [
    { name: "Hana", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" },
    { name: "Minh", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" },
    { name: "Linh", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" },
    { name: "Duc", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" },
    { name: "Phuong", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop" },
  ],
};
