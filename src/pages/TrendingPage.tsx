import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Navigation, Sparkles } from "lucide-react";
import { restaurants, userProfile } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

type TimeFilter = "today" | "week" | "all";

const HeatMapPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selectedPin, setSelectedPin] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("today");
  const [searchQuery, setSearchQuery] = useState("");

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

  const selectedRestaurant = filteredRestaurants.find((r) => r.id === selectedPin);

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
        <div className="absolute top-14 right-5 z-20">
          <div className="relative">
            <img src={userProfile.avatar} alt="" className="h-10 w-10 rounded-full object-cover ring-2 ring-card shadow-elevated" />
            <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive border-2 border-card flex items-center justify-center">
              <span className="text-[8px] text-destructive-foreground font-bold">3</span>
            </div>
          </div>
        </div>

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
                      <img key={f.name} src={f.avatar} alt={f.name} className="h-5 w-5 rounded-full border-2 border-card object-cover" />
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
        </div>
      </div>
    </div>
  );
};

export default HeatMapPage;
