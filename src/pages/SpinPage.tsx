import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Share2, RotateCcw, Search, Users, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { restaurants } from "@/data/mockData";
import RestaurantCard from "@/components/RestaurantCard";
import { useLanguage } from "@/contexts/LanguageContext";

const priceOptions = ["$", "$$", "$$$", "$$$$"];
const vibeOptions = ["Quiet", "Romantic", "Aesthetic", "Lively", "Cozy", "Group-Friendly", "Study-Friendly", "Date Night", "Local", "Fun"];
const tasteOptions = ["Non-spicy", "Spicy", "Sweet", "Authentic", "Instagrammable", "Budget-friendly"];

const vibeLabelKeys: Record<string, string> = {
  "Quiet": "spin.vibe.quiet",
  "Romantic": "spin.vibe.romantic",
  "Aesthetic": "spin.vibe.aesthetic",
  "Lively": "spin.vibe.lively",
  "Cozy": "spin.vibe.cozy",
  "Group-Friendly": "spin.vibe.group",
  "Study-Friendly": "spin.vibe.study",
  "Date Night": "spin.vibe.date",
  "Local": "spin.vibe.local",
  "Fun": "spin.vibe.fun",
};

const tasteLabelKeys: Record<string, string> = {
  "Non-spicy": "spin.taste.nonspicy",
  "Spicy": "spin.taste.spicy",
  "Sweet": "spin.taste.sweet",
  "Authentic": "spin.taste.authentic",
  "Instagrammable": "spin.taste.insta",
  "Budget-friendly": "spin.taste.budget",
};

const SpinPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<typeof restaurants[0] | null>(null);
  const [rotation, setRotation] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [selectedTastes, setSelectedTastes] = useState<string[]>([]);
  const [groupSize, setGroupSize] = useState(2);
  const [memberNeeds, setMemberNeeds] = useState<string[]>([""]);

  const toggleArray = (arr: string[], item: string) => arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];

  const matchedRestaurants = useMemo(() => {
    const q = keyword.trim().toLowerCase();

    const pool = restaurants
      .map((restaurant) => {
        let score = 0;

        if (q) {
          const haystack = `${restaurant.name} ${restaurant.category} ${restaurant.address} ${restaurant.vibes.join(" ")}`.toLowerCase();
          if (haystack.includes(q)) score += 7;
        }

        if (selectedPrices.length > 0) {
          if (selectedPrices.includes(restaurant.priceRange)) score += 4;
          else score -= 4;
        }

        if (selectedVibes.length > 0) {
          const vibeMatch = selectedVibes.some((v) => restaurant.vibes.some((rv) => rv.toLowerCase().includes(v.toLowerCase())));
          if (vibeMatch) score += 4;
          else score -= 2;
        }

        if (selectedTastes.length > 0) {
          const tasteMatch = selectedTastes.some((taste) =>
            restaurant.friendFeedback.some((feedback) => feedback.vibes.some((vibe) => vibe.toLowerCase().includes(taste.toLowerCase())))
          );
          if (tasteMatch) score += 4;
          else score -= 2;
        }

        const activeNeeds = memberNeeds.map((need) => need.trim().toLowerCase()).filter(Boolean);
        if (activeNeeds.length > 0) {
          activeNeeds.forEach((need) => {
            const needText = `${restaurant.name} ${restaurant.category} ${restaurant.vibes.join(" ")} ${restaurant.menu.map((item) => item.name).join(" ")}`.toLowerCase();
            if (needText.includes(need)) score += 3;
          });
        }

        score += restaurant.rating;
        return { restaurant, score };
      })
      .sort((a, b) => b.score - a.score)
      .filter((item) => item.score > 0)
      .map((item) => item.restaurant);

    return pool.length > 0 ? pool : restaurants;
  }, [keyword, selectedPrices, selectedVibes, selectedTastes, memberNeeds]);

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setResult(null);
    const newRotation = rotation + 1440 + Math.random() * 720;
    setRotation(newRotation);
    setTimeout(() => {
      const idx = Math.floor(Math.random() * matchedRestaurants.length);
      setResult(matchedRestaurants[idx]);
      setIsSpinning(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center safe-bottom">
      <div className="w-full px-5 pt-14 pb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h1 className="text-xl font-display font-bold">{t("spin.title")}</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-5 w-full">
        <p className="text-sm text-muted-foreground mb-8 text-center">{t("spin.subtitle")}</p>

        <div className="w-full max-w-md rounded-2xl bg-card p-3 shadow-card mb-6 space-y-3">
          <div>
            <p className="mb-1 text-[11px] font-semibold text-muted-foreground">{t("spin.keyword")}</p>
            <div className="flex items-center gap-2 rounded-xl bg-muted px-3 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder={t("spin.keywordPlaceholder")}
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div>
            <p className="mb-1 text-[11px] font-semibold text-muted-foreground">{t("spin.filters")}</p>
            <div className="mb-2 flex flex-wrap gap-1.5">
              {priceOptions.map((price) => (
                <button
                  key={price}
                  onClick={() => setSelectedPrices(toggleArray(selectedPrices, price))}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${selectedPrices.includes(price) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                >
                  {price}
                </button>
              ))}
            </div>
            <div className="mb-2 flex flex-wrap gap-1.5">
              {vibeOptions.slice(0, 6).map((vibe) => (
                <button
                  key={vibe}
                  onClick={() => setSelectedVibes(toggleArray(selectedVibes, vibe))}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${selectedVibes.includes(vibe) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                >
                  {t(vibeLabelKeys[vibe] || vibe)}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {tasteOptions.slice(0, 5).map((taste) => (
                <button
                  key={taste}
                  onClick={() => setSelectedTastes(toggleArray(selectedTastes, taste))}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${selectedTastes.includes(taste) ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground"}`}
                >
                  {t(tasteLabelKeys[taste] || taste)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-1 flex items-center gap-2">
              <Users className="h-3.5 w-3.5 text-primary" />
              <p className="text-[11px] font-semibold text-muted-foreground">{t("spin.groupDining")}</p>
            </div>
            <div className="mb-2 flex items-center justify-between rounded-xl bg-muted px-3 py-2">
              <span className="text-xs font-medium">{t("spin.groupSize")}</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setGroupSize((prev) => Math.max(2, prev - 1))} className="h-6 w-6 rounded-full bg-card text-sm font-bold">-</button>
                <span className="text-sm font-semibold">{groupSize}</span>
                <button onClick={() => setGroupSize((prev) => Math.min(20, prev + 1))} className="h-6 w-6 rounded-full bg-card text-sm font-bold">+</button>
              </div>
            </div>

            <div className="space-y-1.5">
              {memberNeeds.map((need, index) => (
                <input
                  key={`need-${index}`}
                  value={need}
                  onChange={(e) => setMemberNeeds((prev) => prev.map((item, i) => i === index ? e.target.value : item))}
                  placeholder={`${t("spin.groupNeed")} #${index + 1}`}
                  className="w-full rounded-xl bg-muted px-3 py-2 text-xs outline-none placeholder:text-muted-foreground"
                />
              ))}
              <button
                onClick={() => setMemberNeeds((prev) => [...prev, ""])}
                className="flex items-center gap-1 text-xs font-medium text-primary"
              >
                <Plus className="h-3.5 w-3.5" /> {t("spin.addRequirement")}
              </button>
            </div>
          </div>
        </div>

        <div className="relative mb-8">
          <motion.div
            animate={{ rotate: rotation }}
            transition={{ duration: 3, ease: [0.17, 0.67, 0.12, 0.99] }}
            className="h-52 w-52 rounded-full border-4 border-primary flex items-center justify-center"
            style={{
              background: `conic-gradient(
                hsl(152, 55%, 42%) 0deg, hsl(28, 95%, 62%) 45deg,
                hsl(152, 55%, 52%) 90deg, hsl(28, 85%, 55%) 135deg,
                hsl(152, 45%, 48%) 180deg, hsl(40, 95%, 60%) 225deg,
                hsl(152, 55%, 42%) 270deg, hsl(28, 95%, 62%) 315deg,
                hsl(152, 55%, 42%) 360deg
              )`,
            }}
          >
            <div className="h-16 w-16 rounded-full bg-card shadow-elevated flex items-center justify-center">
              <span className="text-2xl">{isSpinning ? "🌀" : "🍜"}</span>
            </div>
          </motion.div>
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[16px] border-l-transparent border-r-transparent border-t-primary" />
        </div>

        <motion.button whileTap={{ scale: 0.95 }} onClick={spin} disabled={isSpinning}
          className="gradient-hero text-primary-foreground px-8 py-3.5 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-glow">
          <RotateCcw className={`h-4 w-4 ${isSpinning ? "animate-spin" : ""}`} />
          {isSpinning ? t("spin.spinning") : t("spin.spin")}
        </motion.button>

        {matchedRestaurants.length === 0 && (
          <p className="mt-2 text-xs text-destructive">{t("spin.noMatch")}</p>
        )}

        {result && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="mt-8 w-full max-w-sm">
            <p className="text-center text-sm font-semibold text-primary mb-3">{t("spin.youGot")}</p>
            <RestaurantCard restaurant={result} variant="horizontal" />
            <button className="mt-3 mx-auto flex items-center gap-1.5 text-xs text-muted-foreground">
              <Share2 className="h-3.5 w-3.5" /> {t("spin.shareWithFriends")}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SpinPage;
