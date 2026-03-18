import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, SlidersHorizontal, Sparkles, ChevronRight, X, DollarSign, Heart, Smile } from "lucide-react";
import { restaurants, moods, foodCategories } from "@/data/mockData";
import RestaurantCard from "@/components/RestaurantCard";
import MoodChip from "@/components/MoodChip";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const priceOptions = ["$", "$$", "$$$", "$$$$"];

const vibeOptions = [
  "Quiet", "Romantic", "Aesthetic", "Lively", "Cozy", "Group-Friendly", "Study-Friendly", "Date Night", "Local", "Fun"
];

const sentimentOptions = [
  { label: "Non-spicy", emoji: "🌿" },
  { label: "Spicy", emoji: "🌶️" },
  { label: "Sweet", emoji: "🍰" },
  { label: "Authentic", emoji: "✨" },
  { label: "Instagrammable", emoji: "📸" },
  { label: "Budget-friendly", emoji: "💰" },
];

const locationOptions = [
  { id: "d1", labelKey: "discover.location.d1" },
  { id: "thuduc", labelKey: "discover.location.thuduc" },
  { id: "d3", labelKey: "discover.location.d3" },
  { id: "bt", labelKey: "discover.location.bt" },
];

const DiscoverPage = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [selectedSentiments, setSelectedSentiments] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("d1");
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationNotice, setLocationNotice] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const toggleArray = (arr: string[], item: string) =>
    arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item];

  const activeFilterCount = selectedPrices.length + selectedVibes.length + selectedSentiments.length;
  const selectedLocationLabel = t(locationOptions.find((location) => location.id === selectedLocation)?.labelKey || "discover.location.d1");

  const requestLocationAccess = () => {
    if (!navigator.geolocation) {
      setLocationNotice("discover.locationNotSupported");
      return;
    }

    setIsLocating(true);
    setLocationNotice(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        if (latitude > 10.79) {
          setSelectedLocation("thuduc");
        } else if (latitude > 10.78) {
          setSelectedLocation("d3");
        } else if (longitude > 106.71) {
          setSelectedLocation("bt");
        } else {
          setSelectedLocation("d1");
        }

        setShowLocationPicker(false);
        setIsLocating(false);
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setLocationNotice("discover.locationDenied");
        } else {
          setLocationNotice("discover.locationFallback");
        }
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  };

  const filtered = useMemo(() => {
    let result = restaurants;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.vibes.some(v => v.toLowerCase().includes(q)) ||
        r.address.toLowerCase().includes(q)
      );
    }
    if (selectedCategory !== "All") result = result.filter(r => r.category === selectedCategory);
    if (selectedPrices.length > 0) result = result.filter(r => selectedPrices.includes(r.priceRange));
    if (selectedVibes.length > 0) result = result.filter(r => r.vibes.some(v => selectedVibes.some(sv => v.toLowerCase().includes(sv.toLowerCase()))));
    if (selectedSentiments.length > 0) result = result.filter(r => r.friendFeedback.some(fb => fb.vibes.some(v => selectedSentiments.some(s => v.toLowerCase().includes(s.toLowerCase())))));
    if (selectedMood) {
      const moodVibeMap: Record<string, string[]> = {
        study: ["quiet", "study-friendly", "café"],
        date: ["romantic", "date night", "aesthetic", "cozy"],
        group: ["group-friendly", "lively", "fun"],
        chill: ["quiet", "cozy", "aesthetic"],
        alone: ["quiet", "cozy", "study-friendly"],
      };
      const matchVibes = moodVibeMap[selectedMood] || [];
      if (matchVibes.length > 0) result = result.filter(r => r.vibes.some(v => matchVibes.some(mv => v.toLowerCase().includes(mv))));
    }
    return result;
  }, [searchQuery, selectedCategory, selectedPrices, selectedVibes, selectedSentiments, selectedMood]);

  const clearFilters = () => { setSelectedPrices([]); setSelectedVibes([]); setSelectedSentiments([]); };

  return (
    <div className="min-h-screen safe-bottom pb-4">
      <div className="px-5 pt-14 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowLocationPicker((prev) => !prev)}
                className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-1"
              >
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-medium text-muted-foreground">{selectedLocationLabel}</span>
              </button>
              <button
                onClick={() => setShowLocationPicker((prev) => !prev)}
                className="text-[11px] font-semibold text-primary"
              >
                {t("discover.changeLocation")}
              </button>
            </div>
            <h1 className="text-2xl font-display font-bold mt-0.5">{t("discover.title")}</h1>
          </div>
          <div className="flex items-center gap-2">
            <img src="/mapvibe-logo.svg" alt="MapVibe logo" className="h-10 w-10 rounded-full object-cover shadow-card" />
            <motion.div whileTap={{ scale: 0.9 }} onClick={() => navigate("/spin")} className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10">
              <span className="text-lg">🎰</span>
            </motion.div>
          </div>
        </div>

        <AnimatePresence>
          {showLocationPicker && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-3 rounded-2xl bg-card p-3 shadow-card"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-muted-foreground">{t("discover.currentLocation")}</p>
                <button
                  onClick={requestLocationAccess}
                  disabled={isLocating}
                  className="text-xs font-semibold text-primary disabled:opacity-60"
                >
                  {isLocating ? t("discover.detectingLocation") : t("discover.useMyLocation")}
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {locationOptions.map((location) => (
                  <button
                    key={location.id}
                    onClick={() => {
                      setSelectedLocation(location.id);
                      setShowLocationPicker(false);
                      setLocationNotice(null);
                    }}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                      selectedLocation === location.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {t(location.labelKey)}
                  </button>
                ))}
              </div>
              {locationNotice && (
                <p className="mt-2 text-xs text-muted-foreground">{t(locationNotice)}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-4 flex gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-xl bg-muted px-3.5 py-2.5">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("discover.search")}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")}><X className="h-3.5 w-3.5 text-muted-foreground" /></button>
            )}
            <button onClick={requestLocationAccess} disabled={isLocating}>
              <MapPin className={`h-4 w-4 ${isLocating ? "text-muted-foreground" : "text-primary"}`} />
            </button>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowFilters(!showFilters)}
            className={`relative flex h-[42px] w-[42px] items-center justify-center rounded-xl transition-colors ${
              showFilters || activeFilterCount > 0 ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-secondary-foreground">
                {activeFilterCount}
              </span>
            )}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden border-b border-border">
            <div className="px-5 pb-4 space-y-4">
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <DollarSign className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-semibold text-muted-foreground">{t("discover.priceRange")}</span>
                </div>
                <div className="flex gap-2">
                  {priceOptions.map(price => (
                    <motion.button key={price} whileTap={{ scale: 0.92 }} onClick={() => setSelectedPrices(toggleArray(selectedPrices, price))}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${selectedPrices.includes(price) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                      {price}
                    </motion.button>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Heart className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-semibold text-muted-foreground">{t("discover.vibe")}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {vibeOptions.map(vibe => (
                    <motion.button key={vibe} whileTap={{ scale: 0.92 }} onClick={() => setSelectedVibes(toggleArray(selectedVibes, vibe))}
                      className={`rounded-full px-3 py-1.5 text-[11px] font-medium transition-all ${selectedVibes.includes(vibe) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                      {vibe}
                    </motion.button>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Smile className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-semibold text-muted-foreground">{t("discover.sentiment")}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {sentimentOptions.map(s => (
                    <motion.button key={s.label} whileTap={{ scale: 0.92 }} onClick={() => setSelectedSentiments(toggleArray(selectedSentiments, s.label))}
                      className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-medium transition-all ${selectedSentiments.includes(s.label) ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground"}`}>
                      <span>{s.emoji}</span>{s.label}
                    </motion.button>
                  ))}
                </div>
              </div>
              {activeFilterCount > 0 && (
                <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={clearFilters} className="text-xs font-medium text-destructive">
                  {t("discover.clearFilters")}
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-5 mt-1">
        <h2 className="text-sm font-semibold text-muted-foreground mb-2.5">{t("discover.whatsYourVibe")}</h2>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {moods.map(mood => (
            <MoodChip key={mood.id} emoji={mood.emoji} label={t(`mood.${mood.id}`)} isSelected={selectedMood === mood.id} onClick={() => setSelectedMood(selectedMood === mood.id ? null : mood.id)} />
          ))}
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mx-5 mt-5 rounded-2xl gradient-hero p-4 cursor-pointer" onClick={() => navigate("/ai")}>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground/20">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-sm font-semibold text-primary-foreground">{t("discover.aiTitle")}</h3>
            <p className="text-xs text-primary-foreground/80 mt-0.5">
              {selectedMood ? `${t("discover.aiSubtitle")} ✨` : t("discover.aiSubtitle")}
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-primary-foreground/60 mt-1" />
        </div>
      </motion.div>

      <div className="mt-5 px-5">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {foodCategories.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${selectedCategory === cat ? "bg-foreground text-background" : "bg-muted text-muted-foreground"}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {(activeFilterCount > 0 || searchQuery || selectedMood) && (
        <div className="px-5 mt-3">
          <p className="text-xs text-muted-foreground">
            {filtered.length} {filtered.length !== 1 ? t("discover.restaurants") : t("discover.restaurant")} {t("discover.found")}
          </p>
        </div>
      )}

      <div className="mt-5">
        <div className="flex items-center justify-between px-5 mb-3">
          <h2 className="font-display text-base font-semibold">{t("discover.trendingNow")}</h2>
          <button className="text-xs font-medium text-primary">{t("discover.seeAll")}</button>
        </div>
        <div className="flex gap-3 overflow-x-auto px-5 scrollbar-hide pb-2">
          <AnimatePresence>
            {filtered.slice(0, 5).map((r, i) => (
              <motion.div key={r.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <RestaurantCard restaurant={r} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-5 px-5">
        <h2 className="font-display text-base font-semibold mb-3">{t("discover.nearYou")}</h2>
        {filtered.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-3xl mb-2">🍽️</p>
            <p className="text-sm text-muted-foreground">{t("discover.noResults")}</p>
            <button onClick={clearFilters} className="mt-2 text-xs font-medium text-primary">{t("discover.clearFilters")}</button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.slice(0, 4).map((r, i) => (
              <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <RestaurantCard restaurant={r} variant="horizontal" />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscoverPage;
