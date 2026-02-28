import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { restaurants } from "@/data/mockData";
import RestaurantCard from "@/components/RestaurantCard";

const timeFilters = ["Morning", "Afternoon", "Night"] as const;
const areaFilters = ["District 1", "District 3", "Hai Ba Trung", "All Areas"];

const TrendingPage = () => {
  const [timeFilter, setTimeFilter] = useState<string>("Afternoon");
  const [areaFilter, setAreaFilter] = useState("All Areas");

  const sorted = [...restaurants].sort((a, b) => b.checkins - a.checkins);

  return (
    <div className="min-h-screen safe-bottom">
      <div className="px-5 pt-14 pb-4">
        <h1 className="text-2xl font-display font-bold">Trending 🔥</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Most checked-in places right now</p>
      </div>

      {/* Time Filters */}
      <div className="px-5 flex gap-2 mb-3">
        {timeFilters.map((t) => (
          <button
            key={t}
            onClick={() => setTimeFilter(t)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
              timeFilter === t ? "bg-foreground text-background" : "bg-muted text-muted-foreground"
            }`}
          >
            {t === "Morning" ? "🌅 " : t === "Afternoon" ? "☀️ " : "🌙 "}{t}
          </button>
        ))}
      </div>

      {/* Area */}
      <div className="px-5 flex gap-2 overflow-x-auto scrollbar-hide mb-5">
        {areaFilters.map((a) => (
          <button
            key={a}
            onClick={() => setAreaFilter(a)}
            className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition-all ${
              areaFilter === a ? "gradient-primary text-primary-foreground" : "border border-border text-muted-foreground"
            }`}
          >
            {a}
          </button>
        ))}
      </div>

      {/* Top 3 */}
      <div className="px-5 mb-5">
        <h2 className="font-display text-sm font-semibold mb-3">Top 3 Right Now</h2>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {sorted.slice(0, 3).map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="relative"
            >
              <div className="absolute -top-1 -left-1 z-10 flex h-6 w-6 items-center justify-center rounded-full gradient-warm text-xs font-bold text-secondary-foreground">
                {i + 1}
              </div>
              <RestaurantCard restaurant={r} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Full List */}
      <div className="px-5">
        <h2 className="font-display text-sm font-semibold mb-3">All Trending</h2>
        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {sorted.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-3"
              >
                <span className="w-6 text-center text-sm font-bold text-muted-foreground">{i + 1}</span>
                <div className="flex-1">
                  <RestaurantCard restaurant={r} variant="horizontal" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default TrendingPage;
