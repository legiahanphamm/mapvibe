import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Navigation, Sparkles, X } from "lucide-react";
import { restaurants } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

type TimeFilter = "today" | "week" | "all";

type SearchMockItem = {
  id: string;
  name: string;
  subtitle: string;
  type: "restaurant" | "dish" | "area";
  restaurantId?: string;
};

type FriendStoryItem = {
  id: string;
  friendName: string;
  avatar: string;
  restaurantId: string;
  restaurantName: string;
  comment: string;
  timestamp: string;
  image: string;
};

const searchMockData: SearchMockItem[] = [
  { id: "res-1", name: "The Green Patio", subtitle: "Restaurant · District 1", type: "restaurant", restaurantId: "1" },
  { id: "res-2", name: "Saigon BBQ House", subtitle: "Restaurant · District 1", type: "restaurant", restaurantId: "2" },
  { id: "dish-1", name: "Banh Mi", subtitle: "Popular dish nearby", type: "dish" },
  { id: "dish-2", name: "Com Tam", subtitle: "Popular dish nearby", type: "dish" },
  { id: "dish-3", name: "Hu Tieu", subtitle: "Popular dish nearby", type: "dish" },
  { id: "area-1", name: "Thao Dien", subtitle: "Area · Thu Duc", type: "area" },
  { id: "area-2", name: "Ben Thanh", subtitle: "Area · District 1", type: "area" },
  { id: "area-3", name: "Pham Viet Chanh", subtitle: "Area · Binh Thanh", type: "area" },
];

const HeatMapPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selectedPin, setSelectedPin] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("today");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStoryFriend, setActiveStoryFriend] = useState<string | null>(null);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);

  const timeFilters: { id: TimeFilter; labelKey: string }[] = [
    { id: "today", labelKey: "heatmap.today" },
    { id: "week", labelKey: "heatmap.thisWeek" },
    { id: "all", labelKey: "heatmap.allTime" },
  ];

  const filteredRestaurants = timeFilter === "today"
    ? restaurants.filter((_, i) => [0, 1, 5, 7].includes(i))
    : timeFilter === "week"
    ? restaurants.filter((_, i) => [0, 1, 2, 3, 5, 7].includes(i))
    : restaurants;

  const friendStories = useMemo(() => {
    const storyMap: Record<string, FriendStoryItem[]> = {};

    filteredRestaurants.forEach((restaurant) => {
      restaurant.friendFeedback.forEach((feedback, feedbackIndex) => {
        if (!feedback.reviewImage) return;

        const story: FriendStoryItem = {
          id: `${restaurant.id}-${feedback.name}-${feedbackIndex}`,
          friendName: feedback.name,
          avatar: feedback.avatar,
          restaurantId: restaurant.id,
          restaurantName: restaurant.name,
          comment: feedback.comment,
          timestamp: feedback.timestamp,
          image: feedback.reviewImage,
        };

        if (!storyMap[feedback.name]) {
          storyMap[feedback.name] = [];
        }
        storyMap[feedback.name].push(story);
      });
    });

    return storyMap;
  }, [filteredRestaurants]);

  const activeStoryList = activeStoryFriend ? (friendStories[activeStoryFriend] || []) : [];
  const activeStory = activeStoryList[activeStoryIndex] || null;

  const selectedRestaurant = filteredRestaurants.find((r) => r.id === selectedPin);
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const searchResults = normalizedQuery
    ? searchMockData.filter((item) => {
        const haystack = `${item.name} ${item.subtitle}`.toLowerCase();
        return haystack.includes(normalizedQuery);
      }).slice(0, 5)
    : [];

  const handleSelectSearchItem = (item: SearchMockItem) => {
    setSearchQuery(item.name);
    if (item.restaurantId) {
      setSelectedPin(item.restaurantId);
      return;
    }
    setSelectedPin(null);
  };

  const openFriendStory = (friendName: string) => {
    if (!friendStories[friendName] || friendStories[friendName].length === 0) return;
    setActiveStoryFriend(friendName);
    setActiveStoryIndex(0);
  };

  const closeStory = () => {
    setActiveStoryFriend(null);
    setActiveStoryIndex(0);
  };

  const nextStory = () => {
    if (!activeStoryFriend) return;
    if (activeStoryIndex < activeStoryList.length - 1) {
      setActiveStoryIndex((prev) => prev + 1);
      return;
    }
    closeStory();
  };

  const prevStory = () => {
    if (activeStoryIndex > 0) {
      setActiveStoryIndex((prev) => prev - 1);
    }
  };

  useEffect(() => {
    if (!activeStoryFriend || activeStoryList.length === 0) return;
    const timer = window.setTimeout(() => {
      setActiveStoryIndex((prev) => {
        if (prev < activeStoryList.length - 1) return prev + 1;
        setActiveStoryFriend(null);
        return 0;
      });
    }, 2800);

    return () => window.clearTimeout(timer);
  }, [activeStoryFriend, activeStoryIndex, activeStoryList.length]);

  const toPosition = (lat: number, lng: number) => ({
    x: ((lng - 106.670) / 0.045) * 100,
    y: ((10.795 - lat) / 0.050) * 100,
  });

  return (
    <div className="min-h-screen safe-bottom relative">
      {/* Map area - full height with muted tones */}
      <div className="relative w-full h-screen bg-accent/30 overflow-hidden">
        {/* Simulated map texture */}
        <div className="absolute inset-0">
          {/* Water features */}
          <div className="absolute top-[15%] right-0 w-[35%] h-[25%] bg-primary/5 rounded-l-[60px]" />
          <div className="absolute bottom-[25%] left-[10%] w-[40%] h-[20%] bg-primary/8 rounded-[40px]" />
          {/* Parks */}
          <div className="absolute top-[40%] right-[20%] w-[25%] h-[15%] bg-accent/60 rounded-[30px]" />
          {/* Roads */}
          <div className="absolute top-0 bottom-0 left-[30%] w-[2px] bg-foreground/[0.06]" />
          <div className="absolute top-0 bottom-0 left-[55%] w-[2px] bg-foreground/[0.06]" />
          <div className="absolute top-0 bottom-0 left-[75%] w-[1.5px] bg-foreground/[0.06]" />
          <div className="absolute left-0 right-0 top-[35%] h-[3px] bg-foreground/[0.08]" />
          <div className="absolute left-0 right-0 top-[60%] h-[2px] bg-foreground/[0.06]" />
          <div className="absolute left-0 right-0 top-[80%] h-[2px] bg-foreground/[0.05]" />
          {/* District labels */}
          <span className="absolute top-[22%] left-[8%] text-[9px] text-muted-foreground/40 font-medium tracking-wider uppercase">P. Bình An</span>
          <span className="absolute top-[50%] right-[8%] text-[9px] text-muted-foreground/40 font-medium tracking-wider uppercase">P. Long</span>
          <span className="absolute bottom-[30%] left-[15%] text-[9px] text-muted-foreground/40 font-medium tracking-wider uppercase">P. Tân Phú</span>
          <span className="absolute bottom-[15%] right-[25%] text-[9px] text-muted-foreground/40 font-medium tracking-wider uppercase">P. Long Thạnh Mỹ</span>
        </div>

        {/* Time filter - top */}
        <div className="absolute top-14 left-0 right-0 z-20 px-5">
          <div className="flex gap-1.5 rounded-full bg-card/90 backdrop-blur-sm p-1 shadow-card w-fit mx-auto">
            {timeFilters.map((tf) => (
              <button
                key={tf.id}
                onClick={() => { setTimeFilter(tf.id); setSelectedPin(null); }}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                  timeFilter === tf.id ? "gradient-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t(tf.labelKey)}
              </button>
            ))}
          </div>
        </div>

        {/* Profile avatar - top right */}
        {/* <div className="absolute top-14 right-5 z-20">
          <div className="relative">
            <img src={userProfile.avatar} alt="" className="h-10 w-10 rounded-full object-cover ring-2 ring-card shadow-elevated" />
            <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive border-2 border-card flex items-center justify-center">
              <span className="text-[8px] text-destructive-foreground font-bold">3</span>
            </div>
          </div>
        </div> */}

        {/* Food photo pins */}
        {filteredRestaurants.map((r) => {
          const pos = toPosition(r.lat, r.lng);
          const isSelected = selectedPin === r.id;
          const hasFriends = r.friendsVisited.length > 0;

          return (
            <div key={r.id} className="absolute z-10" style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: "translate(-50%, -50%)" }}>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => setSelectedPin(isSelected ? null : r.id)}
                className="relative"
              >
                {/* Pin shape with food photo */}
                <div className={`relative rounded-full overflow-hidden shadow-elevated transition-all ${
                  isSelected ? "h-16 w-16 ring-3 ring-primary" : "h-11 w-11"
                }`}>
                  <img src={r.image} alt={r.name} className="h-full w-full object-cover" />
                </div>
                {/* Pin tail */}
                <div className={`mx-auto w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-transparent ${
                  isSelected ? "border-t-primary" : "border-t-card"
                }`} />

                {/* Friends avatar cluster */}
                {hasFriends && !isSelected && (
                  <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground border-2 border-card">
                    {r.friendsVisited.length}
                  </div>
                )}

                {/* Friend faces on selected */}
                {isSelected && r.friendFeedback.length > 0 && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-2 -right-4 flex -space-x-1.5">
                    {r.friendFeedback.slice(0, 3).map((f) => (
                      <button
                        key={f.name}
                        onClick={(e) => {
                          e.stopPropagation();
                          openFriendStory(f.name);
                        }}
                        className="relative"
                      >
                        <img src={f.avatar} alt={f.name} className="h-5 w-5 rounded-full border-2 border-card object-cover" />
                        <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-destructive border border-card" />
                      </button>
                    ))}
                  </motion.div>
                )}
              </motion.button>
            </div>
          );
        })}

        {/* User location dot */}
        <div className="absolute z-10" style={{ left: "50%", top: "45%", transform: "translate(-50%, -50%)" }}>
          <motion.div animate={{ scale: [1, 1.6, 1] }} transition={{ duration: 2, repeat: Infinity }} className="absolute -inset-3 rounded-full bg-primary/20" />
          <div className="relative h-4 w-4 rounded-full gradient-primary border-2 border-card shadow-glow" />
        </div>

        {/* Some special markers */}
        <div className="absolute bottom-[40%] left-[8%] z-10">
          <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <span className="text-xs">🍷</span>
          </div>
        </div>
        <div className="absolute bottom-[42%] left-[12%] z-10">
          <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <span className="text-xs">🍷</span>
          </div>
        </div>
      </div>

      {/* Search bar floating at bottom */}
      <div className="fixed bottom-20 left-0 right-0 z-30 px-5">
        <div className="mx-auto max-w-lg">
          {/* Selected restaurant card */}
          <AnimatePresence>
            {selectedRestaurant && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mb-3 rounded-2xl bg-card shadow-elevated p-3 cursor-pointer"
                onClick={() => navigate(`/restaurant/${selectedRestaurant.id}`)}
              >
                <div className="flex gap-3">
                  <img src={selectedRestaurant.image} alt={selectedRestaurant.name} className="h-14 w-14 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-sm font-semibold truncate">{selectedRestaurant.name}</h3>
                    <p className="text-xs text-muted-foreground">{selectedRestaurant.category} · {selectedRestaurant.distance}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex -space-x-1">
                        {selectedRestaurant.friendFeedback.slice(0, 3).map((f) => (
                          <img key={f.name} src={f.avatar} alt={f.name} className="h-4 w-4 rounded-full border border-card object-cover" />
                        ))}
                      </div>
                      <span className="text-[10px] text-muted-foreground">{selectedRestaurant.friendsVisited.length} {t("heatmap.friends")}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Navigation className="h-4 w-4 text-primary" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search input */}
          <div className="flex items-center gap-2 rounded-full bg-card/95 backdrop-blur-sm px-4 py-3 shadow-elevated">
            <Sparkles className="h-4 w-4 text-primary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("heatmap.searchPlaceholder")}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>

          {searchResults.length > 0 && (
            <div className="mt-2 rounded-2xl bg-card/95 backdrop-blur-sm p-2 shadow-elevated">
              {searchResults.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectSearchItem(item)}
                  className="w-full rounded-xl px-3 py-2 text-left hover:bg-muted/70 transition-colors"
                >
                  <p className="text-sm font-medium text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {activeStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black"
          >
            <button
              aria-label="Close story"
              onClick={closeStory}
              className="absolute inset-0"
            />

            <div className="relative mx-auto h-full w-full max-w-lg overflow-hidden">
              <img src={activeStory.image} alt={activeStory.comment} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/10 to-black/55" />

              <div className="absolute left-0 right-0 top-0 p-3">
                <div className="mb-3 flex gap-1">
                  {activeStoryList.map((story, index) => (
                    <span
                      key={story.id}
                      className={`h-1 flex-1 rounded-full ${index <= activeStoryIndex ? "bg-white" : "bg-white/35"}`}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={activeStory.avatar} alt={activeStory.friendName} className="h-9 w-9 rounded-full border-2 border-white/60 object-cover" />
                    <div>
                      <p className="text-sm font-semibold text-white">{activeStory.friendName}</p>
                      <p className="text-xs text-white/80">{activeStory.timestamp} · {t("heatmap.liveCheckin")}</p>
                    </div>
                  </div>

                  <button
                    onClick={closeStory}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>

              <button
                aria-label="Previous story"
                onClick={(e) => {
                  e.stopPropagation();
                  prevStory();
                }}
                className="absolute left-0 top-0 h-full w-1/2"
              />
              <button
                aria-label="Next story"
                onClick={(e) => {
                  e.stopPropagation();
                  nextStory();
                }}
                className="absolute right-0 top-0 h-full w-1/2"
              />

              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-sm font-medium text-white">{activeStory.comment}</p>
                <p className="mt-1 text-xs text-white/85">{activeStory.restaurantName}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="rounded-full bg-destructive/85 px-2.5 py-1 text-[10px] font-semibold text-white">
                    {t("heatmap.liveCheckin")}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/restaurant/${activeStory.restaurantId}`);
                      closeStory();
                    }}
                    className="rounded-full bg-white/20 px-3 py-1.5 text-xs font-medium text-white"
                  >
                    {t("heatmap.viewRestaurant")}
                  </button>
                </div>
                <p className="mt-2 text-[10px] text-white/80">{t("heatmap.storyHint")}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HeatMapPage;
