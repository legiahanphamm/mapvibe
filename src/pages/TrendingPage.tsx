import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Users, Navigation, Flame } from "lucide-react";
import { restaurants, userProfile } from "@/data/mockData";
import { useNavigate } from "react-router-dom";

const MAP_CENTER = { lat: 10.775, lng: 106.698 };

type TimeFilter = "today" | "week" | "all";

const timeFilters: { id: TimeFilter; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "week", label: "This Week" },
  { id: "all", label: "All Time" },
];

const HeatMapPage = () => {
  const navigate = useNavigate();
  const [selectedPin, setSelectedPin] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("today");

  // Simulate different data per time filter
  const filteredRestaurants = timeFilter === "today"
    ? restaurants.filter((_, i) => [0, 1, 5, 7].includes(i))
    : timeFilter === "week"
    ? restaurants.filter((_, i) => [0, 1, 2, 3, 5, 7].includes(i))
    : restaurants;

  const sorted = [...filteredRestaurants].sort((a, b) => b.checkins - a.checkins);
  const selectedRestaurant = filteredRestaurants.find((r) => r.id === selectedPin);

  // Convert lat/lng to percentage position on our fake map
  const toPosition = (lat: number, lng: number) => ({
    x: ((lng - 106.670) / 0.045) * 100,
    y: ((10.795 - lat) / 0.050) * 100,
  });

  const getHeatSize = (checkins: number) => {
    if (checkins > 600) return "h-16 w-16";
    if (checkins > 300) return "h-12 w-12";
    return "h-9 w-9";
  };

  const getHeatOpacity = (checkins: number) => {
    if (checkins > 600) return 0.6;
    if (checkins > 300) return 0.45;
    return 0.3;
  };

  return (
    <div className="min-h-screen safe-bottom">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 px-5 pt-14 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-display font-bold flex items-center gap-2">
              <Flame className="h-5 w-5 text-secondary" /> Heat Map
            </h1>
            <p className="text-xs text-muted-foreground">Friends' check-ins near you</p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-card/90 backdrop-blur-sm px-3 py-1.5 shadow-card">
            <Navigation className="h-3 w-3 text-primary" />
            <span className="text-xs font-medium">District 1</span>
          </div>
        </div>
      </div>

      {/* Time Filter Tabs */}
      <div className="absolute top-[7rem] left-0 right-0 z-20 px-5">
        <div className="flex gap-1.5 rounded-full bg-card/90 backdrop-blur-sm p-1 shadow-card w-fit mx-auto">
          {timeFilters.map((tf) => (
            <button
              key={tf.id}
              onClick={() => { setTimeFilter(tf.id); setSelectedPin(null); }}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                timeFilter === tf.id
                  ? "gradient-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Map Area */}
      <div className="relative w-full h-[65vh] bg-muted overflow-hidden">
        {/* Fake map grid lines */}
        <div className="absolute inset-0 opacity-[0.07]">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={`h-${i}`} className="absolute left-0 right-0 border-t border-foreground" style={{ top: `${i * 8.5}%` }} />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={`v-${i}`} className="absolute top-0 bottom-0 border-l border-foreground" style={{ left: `${i * 14}%` }} />
          ))}
        </div>

        {/* Fake roads */}
        <div className="absolute top-[30%] left-0 right-0 h-[3px] bg-foreground/10 rounded-full" />
        <div className="absolute top-[55%] left-0 right-0 h-[2px] bg-foreground/8 rounded-full" />
        <div className="absolute left-[40%] top-0 bottom-0 w-[3px] bg-foreground/10 rounded-full" />
        <div className="absolute left-[65%] top-0 bottom-0 w-[2px] bg-foreground/8 rounded-full" />

        {/* Street labels */}
        <span className="absolute top-[28%] left-[5%] text-[9px] text-muted-foreground/60 font-medium">Nguyen Hue</span>
        <span className="absolute top-[53%] left-[10%] text-[9px] text-muted-foreground/60 font-medium">Le Loi</span>
        <span className="absolute top-[10%] left-[38%] text-[9px] text-muted-foreground/60 font-medium rotate-90 origin-left">Hai Ba Trung</span>

        {/* Heat blobs + pins */}
        {filteredRestaurants.map((r) => {
          const pos = toPosition(r.lat, r.lng);
          const isSelected = selectedPin === r.id;
          const heatSize = getHeatSize(r.checkins);

          return (
            <div key={r.id} className="absolute" style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: "translate(-50%, -50%)" }}>
              {/* Heat glow */}
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [getHeatOpacity(r.checkins), getHeatOpacity(r.checkins) * 0.5, getHeatOpacity(r.checkins)] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full ${heatSize}`}
                style={{ background: `radial-gradient(circle, hsl(28, 95%, 62%), hsl(0, 84%, 60%) 60%, transparent 100%)` }}
              />

              {/* Pin */}
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => setSelectedPin(isSelected ? null : r.id)}
                className={`relative z-10 flex items-center justify-center rounded-full shadow-elevated transition-all ${
                  isSelected ? "h-11 w-11 gradient-primary ring-2 ring-primary/30" : "h-8 w-8 bg-card border border-border"
                }`}
              >
                {r.friendsVisited.length > 0 ? (
                  <span className="text-xs font-bold">{r.friendsVisited.length}</span>
                ) : (
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </motion.button>

              {/* Friend avatars ring */}
              {isSelected && r.friendFeedback.length > 0 && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute -top-2 -right-6 flex -space-x-1.5"
                >
                  {r.friendFeedback.slice(0, 3).map((f) => (
                    <img key={f.name} src={f.avatar} alt={f.name} className="h-5 w-5 rounded-full border-2 border-card object-cover" />
                  ))}
                </motion.div>
              )}
            </div>
          );
        })}

        {/* Current user location */}
        <div className="absolute z-10" style={{ left: "50%", top: "45%", transform: "translate(-50%, -50%)" }}>
          <motion.div
            animate={{ scale: [1, 1.6, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -inset-3 rounded-full bg-primary/20"
          />
          <div className="relative h-4 w-4 rounded-full gradient-primary border-2 border-card shadow-glow" />
        </div>
      </div>

      {/* Bottom Panel */}
      <div className="relative z-10 -mt-6 rounded-t-3xl bg-card px-5 pt-5 pb-4 shadow-elevated">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />

        <AnimatePresence mode="wait">
          {selectedRestaurant ? (
            <motion.div
              key={selectedRestaurant.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div
                className="flex gap-3 cursor-pointer"
                onClick={() => navigate(`/restaurant/${selectedRestaurant.id}`)}
              >
                <img src={selectedRestaurant.image} alt={selectedRestaurant.name} className="h-16 w-16 rounded-xl object-cover" />
                <div className="flex-1">
                  <h3 className="font-display text-sm font-semibold">{selectedRestaurant.name}</h3>
                  <p className="text-xs text-muted-foreground">{selectedRestaurant.category} · {selectedRestaurant.distance}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="flex items-center gap-1 text-xs text-secondary font-medium">
                      <Users className="h-3 w-3" /> {selectedRestaurant.checkins} check-ins
                    </span>
                    <span className="text-xs text-muted-foreground">
                      · {selectedRestaurant.friendsVisited.length} friends
                    </span>
                  </div>
                </div>
              </div>

              {/* Friend feedback preview */}
              {selectedRestaurant.friendFeedback.length > 0 && (
                <div className="mt-3 space-y-2">
                  {selectedRestaurant.friendFeedback.slice(0, 2).map((f) => (
                    <div key={f.name} className="flex items-start gap-2 rounded-xl bg-muted p-2.5">
                      <img src={f.avatar} alt={f.name} className="h-7 w-7 rounded-full object-cover mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold">{f.name}</span>
                          <span className="text-[10px] text-muted-foreground">{f.timestamp}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">{f.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="font-display text-sm font-semibold mb-3 flex items-center gap-1.5">
                <Flame className="h-4 w-4 text-secondary" /> Hottest Right Now
              </h2>
              <div className="space-y-2.5">
                {sorted.slice(0, 4).map((r, i) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => setSelectedPin(r.id)}
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full gradient-warm text-xs font-bold text-secondary-foreground">
                      {i + 1}
                    </span>
                    <img src={r.image} alt={r.name} className="h-10 w-10 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold truncate">{r.name}</h4>
                      <p className="text-xs text-muted-foreground">{r.friendsVisited.length} friends · {r.checkins} check-ins</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HeatMapPage;
