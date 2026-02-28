import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, SlidersHorizontal, Sparkles, ChevronRight } from "lucide-react";
import { restaurants, moods, foodCategories } from "@/data/mockData";
import RestaurantCard from "@/components/RestaurantCard";
import MoodChip from "@/components/MoodChip";
import { useNavigate } from "react-router-dom";

const DiscoverPage = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();

  const filtered = selectedCategory === "All"
    ? restaurants
    : restaurants.filter(r => r.category === selectedCategory);

  return (
    <div className="min-h-screen safe-bottom pb-4">
      {/* Header */}
      <div className="px-5 pt-14 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">📍 District 1, HCMC</p>
            <h1 className="text-2xl font-display font-bold mt-0.5">Discover</h1>
          </div>
          <motion.div
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/spin")}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10"
          >
            <span className="text-lg">🎰</span>
          </motion.div>
        </div>

        {/* Search */}
        <div className="mt-4 flex gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-xl bg-muted px-3.5 py-2.5">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search restaurants, vibes..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <MapPin className="h-4 w-4 text-primary" />
          </div>
          <button className="flex h-[42px] w-[42px] items-center justify-center rounded-xl bg-muted">
            <SlidersHorizontal className="h-4 w-4 text-foreground" />
          </button>
        </div>
      </div>

      {/* Mood Selector */}
      <div className="px-5">
        <h2 className="text-sm font-semibold text-muted-foreground mb-2.5">What's your vibe?</h2>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {moods.map((mood) => (
            <MoodChip
              key={mood.id}
              emoji={mood.emoji}
              label={mood.label}
              isSelected={selectedMood === mood.id}
              onClick={() => setSelectedMood(selectedMood === mood.id ? null : mood.id)}
            />
          ))}
        </div>
      </div>

      {/* AI Suggestion Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mx-5 mt-5 rounded-2xl gradient-hero p-4 cursor-pointer"
        onClick={() => navigate("/ai")}
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground/20">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-sm font-semibold text-primary-foreground">Based on your vibe today…</h3>
            <p className="text-xs text-primary-foreground/80 mt-0.5">
              {selectedMood
                ? `Perfect ${selectedMood} spots picked just for you ✨`
                : "Tell me your mood and I'll find the perfect spot!"}
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-primary-foreground/60 mt-1" />
        </div>
      </motion.div>

      {/* Categories */}
      <div className="mt-5 px-5">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {foodCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Trending Now */}
      <div className="mt-5">
        <div className="flex items-center justify-between px-5 mb-3">
          <h2 className="font-display text-base font-semibold">Trending Now 🔥</h2>
          <button className="text-xs font-medium text-primary">See all</button>
        </div>
        <div className="flex gap-3 overflow-x-auto px-5 scrollbar-hide pb-2">
          <AnimatePresence>
            {filtered.slice(0, 5).map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <RestaurantCard restaurant={r} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Near You */}
      <div className="mt-5 px-5">
        <h2 className="font-display text-base font-semibold mb-3">Near You 📍</h2>
        <div className="flex flex-col gap-3">
          {filtered.slice(0, 4).map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <RestaurantCard restaurant={r} variant="horizontal" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiscoverPage;
