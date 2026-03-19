import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Navigation, Sparkles, X, ArrowLeft } from "lucide-react";
import { restaurants, userProfile } from "@/data/mockData";
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

type HistoryVisit = {
  id: string;
  user: string;
  restaurantId: string;
  image: string;
  timestamp: string;
  withWho: string;
  note: string;
};

type HistoryGroup = {
  id: string;
  restaurantId: string;
  restaurantName: string;
  lat: number;
  lng: number;
  visits: HistoryVisit[];
  coverImage: string;
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
  const [historyFriend, setHistoryFriend] = useState<string>("all");
  const [selectedHistoryGroupId, setSelectedHistoryGroupId] = useState<string | null>(null);
  const [selectedHistoryVisitId, setSelectedHistoryVisitId] = useState<string | null>(null);

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

  const myVisits = useMemo<HistoryVisit[]>(() => [
    {
      id: "visit-me-1",
      user: "me",
      restaurantId: "1",
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=360&fit=crop",
      timestamp: t("heatmap.mock.time1"),
      withWho: "Minh",
      note: t("heatmap.mock.meJournal1"),
    },
    {
      id: "visit-me-2",
      user: "me",
      restaurantId: "3",
      image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=500&h=360&fit=crop",
      timestamp: t("heatmap.mock.time2"),
      withWho: "Linh",
      note: t("heatmap.mock.meCaption1"),
    },
    {
      id: "visit-me-3",
      user: "me",
      restaurantId: "3",
      image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&h=360&fit=crop",
      timestamp: "3d ago",
      withWho: "Hana",
      note: t("heatmap.mock.meCaption2"),
    },
  ], [t]);

  const friendVisits = useMemo<HistoryVisit[]>(() => {
    return filteredRestaurants.flatMap((restaurant) =>
      restaurant.friendFeedback
        .filter((feedback) => feedback.reviewImage)
        .map((feedback, index) => ({
          id: `visit-${restaurant.id}-${feedback.name}-${index}`,
          user: feedback.name,
          restaurantId: restaurant.id,
          image: feedback.reviewImage as string,
          timestamp: feedback.timestamp,
          withWho: restaurant.friendsVisited.slice(0, 2).join(", ") || t("heatmap.me"),
          note: feedback.comment,
        }))
    );
  }, [filteredRestaurants, t]);

  const historyFriendOptions = useMemo(() => {
    const names = Array.from(new Set(friendVisits.map((item) => item.user)));
    return ["all", "me", ...names];
  }, [friendVisits]);

  const historyGroups = useMemo<HistoryGroup[]>(() => {
    const sourceVisits = historyFriend === "all"
      ? [...myVisits, ...friendVisits]
      : historyFriend === "me"
      ? myVisits
      : friendVisits.filter((visit) => visit.user === historyFriend);

    const byRestaurant: Record<string, HistoryVisit[]> = {};
    sourceVisits.forEach((visit) => {
      if (!byRestaurant[visit.restaurantId]) byRestaurant[visit.restaurantId] = [];
      byRestaurant[visit.restaurantId].push(visit);
    });

    return Object.entries(byRestaurant)
      .map(([restaurantId, visits]) => {
        const restaurant = filteredRestaurants.find((item) => item.id === restaurantId);
        if (!restaurant) return null;
        return {
          id: `group-footprint-${restaurantId}`,
          restaurantId,
          restaurantName: restaurant.name,
          lat: restaurant.lat,
          lng: restaurant.lng,
          visits,
          coverImage: visits[0]?.image || restaurant.image,
        };
      })
      .filter(Boolean) as HistoryGroup[];
  }, [historyFriend, myVisits, friendVisits, filteredRestaurants]);

  const selectedHistoryGroup = historyGroups.find((group) => group.id === selectedHistoryGroupId) || null;
  const selectedHistoryVisit = selectedHistoryGroup?.visits.find((visit) => visit.id === selectedHistoryVisitId) || null;

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

  const toPosition = (lat: number, lng: number) => ({
    x: ((lng - 106.670) / 0.045) * 100,
    y: ((10.795 - lat) / 0.050) * 100,
  });

  return (
    <div className="min-h-screen safe-bottom relative">
      {/* Map area - full height with muted tones */}
      <div className="relative w-full h-screen bg-accent/30 overflow-hidden">
        <div className="absolute top-14 left-5 z-30">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 rounded-full bg-card/90 px-3 py-2 backdrop-blur-sm shadow-card">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-xs font-medium">{t("heatmap.back")}</span>
          </button>
        </div>

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

        <div className="absolute top-28 left-0 right-0 z-20 px-5">
          <div className="mx-auto w-fit rounded-full bg-card/90 p-1.5 backdrop-blur-sm shadow-card">
            <select
              value={historyFriend}
              onChange={(e) => {
                setHistoryFriend(e.target.value);
                setSelectedHistoryGroupId(null);
                setSelectedHistoryVisitId(null);
              }}
              className="min-w-[140px] rounded-full border border-border/60 bg-background px-3 py-1.5 text-xs font-medium text-foreground outline-none"
            >
              {historyFriendOptions.map((friend) => (
                <option key={friend} value={friend}>
                  {friend === "all" ? t("heatmap.allUsers") : friend === "me" ? t("heatmap.me") : friend}
                </option>
              ))}
            </select>
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
                      <div key={f.name} className="relative">
                        <img src={f.avatar} alt={f.name} className="h-5 w-5 rounded-full border-2 border-card object-cover" />
                        <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-destructive border border-card" />
                      </div>
                    ))}
                  </motion.div>
                )}
              </motion.button>
            </div>
          );
        })}

        {historyGroups.map((group) => {
          const pos = toPosition(group.lat, group.lng);
          const isActive = selectedHistoryGroupId === group.id;
          return (
            <button
              key={group.id}
              onClick={() => setSelectedHistoryGroupId(group.id)}
              className="absolute z-20"
              style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: "translate(-50%, -50%)" }}
            >
              <div className={`relative h-11 w-11 overflow-hidden rounded-xl border-2 shadow-elevated transition-all ${isActive ? "border-primary scale-110" : "border-card"}`}>
                <img src={group.coverImage} alt={group.restaurantName} className="h-full w-full object-cover" />
                <span className="absolute -bottom-1 -right-1 rounded-full bg-card px-1.5 py-0.5 text-[9px] font-bold text-primary">
                  {group.visits.length}
                </span>
              </div>
            </button>
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
        {selectedHistoryGroup && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40">
            <button className="absolute inset-0 bg-black/35" onClick={() => setSelectedHistoryGroupId(null)} />
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="absolute left-1/2 top-1/2 w-[calc(100%-2.5rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-card p-3 shadow-elevated max-h-[min(75vh,560px)] overflow-hidden"
            >
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">{selectedHistoryGroup.restaurantName}</p>
                  <p className="text-[11px] text-muted-foreground">{selectedHistoryGroup.visits.length} {t("heatmap.visits")}</p>
                </div>
                <button onClick={() => navigate(`/restaurant/${selectedHistoryGroup.restaurantId}`)} className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                  {t("heatmap.viewRestaurant")}
                </button>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1">
                {selectedHistoryGroup.visits.map((visit) => (
                  <button
                    key={visit.id}
                    onClick={() => setSelectedHistoryVisitId(visit.id)}
                    className="min-w-[170px] rounded-xl bg-muted/70 p-2 text-left"
                  >
                    <img src={visit.image} alt={selectedHistoryGroup.restaurantName} className="mb-2 h-24 w-full rounded-lg object-cover" />
                    <p className="text-[11px] font-semibold">{visit.timestamp}</p>
                    <p className="text-[10px] text-muted-foreground">{t("heatmap.withWho")}: {visit.withWho}</p>
                    <p className="mt-1 line-clamp-3 text-[10px] text-foreground/85">{visit.note}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedHistoryVisit && selectedHistoryGroup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#07111a]"
          >
            <button
              aria-label="Close detail"
              onClick={() => setSelectedHistoryVisitId(null)}
              className="absolute inset-0"
            />

            <div className="relative mx-auto h-full w-full max-w-lg overflow-hidden px-3 pb-3 pt-14">
              <div className="relative h-full rounded-[30px] bg-black/35 p-3 backdrop-blur-sm">
                <img src={selectedHistoryVisit.image} alt={selectedHistoryGroup.restaurantName} className="h-[72%] w-full rounded-[26px] object-cover" />

                <div className="pointer-events-none absolute inset-x-3 top-3 h-[72%] rounded-[26px] bg-gradient-to-b from-black/35 via-transparent to-black/55" />

                <div className="absolute left-6 right-6 top-6 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/70 bg-white/20 text-xs font-semibold text-white">
                      {(selectedHistoryVisit.user === "me" ? t("heatmap.me") : selectedHistoryVisit.user).slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white drop-shadow-sm">{selectedHistoryVisit.user === "me" ? t("heatmap.me") : selectedHistoryVisit.user}</p>
                      <p className="text-sm text-white/80">{selectedHistoryVisit.timestamp}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedHistoryVisitId(null)}
                    className="rounded-full bg-black/35 p-2"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                </div>

                <div className="mt-3 rounded-2xl bg-[#0f1724] px-4 py-3 text-white shadow-elevated">
                  <p className="text-sm font-semibold">{selectedHistoryGroup.restaurantName}</p>
                  <p className="mt-1 text-xs text-white/80">{t("heatmap.withWho")}: {selectedHistoryVisit.withWho}</p>
                  <p className="mt-2 text-sm text-white/95">{selectedHistoryVisit.note}</p>
                </div>

                <div className="mt-4 rounded-full bg-[#2c343f] px-3 py-2">
                  <div className="flex items-center justify-between">
                    <p className="text-2xl leading-none text-white/80">{t("heatmap.messagePlaceholder")}</p>
                    <div className="flex items-center gap-3 text-3xl leading-none">
                      <button aria-label="Heart reaction">😍</button>
                      <button aria-label="Cry reaction">😭</button>
                      <button aria-label="Hands reaction">🫶</button>
                      <button aria-label="More">☺</button>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/restaurant/${selectedHistoryGroup.restaurantId}`);
                      setSelectedHistoryVisitId(null);
                      setSelectedHistoryGroupId(null);
                    }}
                    className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white"
                  >
                    {t("heatmap.viewRestaurant")}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HeatMapPage;
