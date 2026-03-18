import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Share2, Settings, MapPin, Lock } from "lucide-react";
import { userProfile, restaurants } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const badges = [
  { icon: "🔥", label: "Street Pro", unlocked: true, color: "bg-secondary/15" },
  { icon: "🍜", label: "Noodle King", unlocked: true, color: "bg-primary/15" },
  { icon: "🌙", label: "Night Owl", unlocked: true, color: "bg-accent" },
  { icon: "🔒", label: "Locked", unlocked: false, color: "bg-muted" },
];

const checkinHistory = [
  { restaurant: "The Green Patio", note: "Visited for Breakfast", xp: 15, date: "Yesterday", images: [
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop",
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=200&fit=crop",
  ]},
  { restaurant: "Saigon BBQ House", note: "Friday Night Drinks", xp: 25, date: "Mar 12", images: [] },
  { restaurant: "Moonlight Ramen", note: "Date night 💕", xp: 20, date: "Mar 10", images: [
    "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200&h=200&fit=crop",
  ]},
];

const UserProfilePage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"history" | "favs">("history");
  const favRestaurants = restaurants.filter((r) => userProfile.favoriteRestaurants.includes(r.id));

  const level = 12;
  const xpToNext = 550;
  const xpProgress = 65;

  return (
    <div className="min-h-screen safe-bottom">
      {/* Header buttons */}
      <div className="absolute top-14 left-5 right-5 z-20 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center rounded-full bg-card/80 backdrop-blur-sm shadow-card">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex gap-2">
          <button className="flex h-9 w-9 items-center justify-center rounded-full bg-card/80 backdrop-blur-sm shadow-card">
            <Settings className="h-4 w-4 text-muted-foreground" />
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-full bg-card/80 backdrop-blur-sm shadow-card">
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Avatar & Info Card */}
      <div className="pt-20 px-5">
        <div className="rounded-3xl bg-card shadow-card p-6 text-center">
          {/* Avatar with level ring */}
          <div className="relative inline-block">
            <div className="relative">
              <svg width="100" height="100" className="-rotate-90">
                <circle cx="50" cy="50" r="44" stroke="hsl(var(--muted))" strokeWidth="4" fill="none" />
                <circle cx="50" cy="50" r="44" stroke="hsl(var(--primary))" strokeWidth="4" fill="none"
                  strokeLinecap="round" strokeDasharray={2 * Math.PI * 44} strokeDashoffset={2 * Math.PI * 44 * (1 - xpProgress / 100)} />
              </svg>
              <img src={userProfile.avatar} alt={userProfile.name} className="absolute inset-[6px] rounded-full object-cover" />
            </div>
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full gradient-primary px-2.5 py-0.5 text-[10px] font-bold text-primary-foreground shadow-sm">
              LVL {level}
            </span>
          </div>

          <h2 className="font-display text-xl font-bold mt-4">{userProfile.name}</h2>
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
            <MapPin className="h-3 w-3" /> Ho Chi Minh City, VN
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 mt-5">
            <div className="text-center">
              <p className="text-xl font-display font-bold">{userProfile.totalCheckins}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t("userProfile.places")}</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-display font-bold">2.4k</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">XP</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-display font-bold">{badges.filter(b => b.unlocked).length}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t("userProfile.badges")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* XP Progress */}
      <div className="px-5 mt-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold">{t("userProfile.gourmetExplorer")}</span>
          <span className="text-xs text-primary font-medium">{xpToNext} XP {t("userProfile.toLevel")} {level + 1}</span>
        </div>
        <div className="h-2.5 rounded-full bg-muted overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${xpProgress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full rounded-full gradient-primary"
          />
        </div>
      </div>

      {/* Hall of Fame */}
      <div className="px-5 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-base font-bold">{t("userProfile.hallOfFame")}</h3>
          <button className="text-xs font-medium text-primary">{t("userProfile.viewAll")}</button>
        </div>
        <div className="flex gap-3">
          {badges.map((badge, i) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center gap-1.5"
            >
              <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${badge.color} ${
                !badge.unlocked ? "opacity-50 border-2 border-dashed border-border" : ""
              }`}>
                {badge.unlocked ? (
                  <span className="text-2xl">{badge.icon}</span>
                ) : (
                  <Lock className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {badge.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tabs: History / Fav Spots */}
      <div className="px-5 mt-6">
        <div className="flex border-b border-border">
          {(["history", "favs"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 pb-2.5 text-sm font-medium transition-colors relative ${
                activeTab === tab ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {tab === "history" ? t("userProfile.history") : t("userProfile.favSpots")}
              {activeTab === tab && (
                <motion.div layoutId="profile-tab" className="absolute bottom-0 left-0 right-0 h-0.5 gradient-primary rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-5 mt-4 pb-4">
        {activeTab === "history" ? (
          <div className="space-y-4">
            {checkinHistory.map((item, i) => (
              <motion.div
                key={item.restaurant}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex gap-3"
              >
                {/* Timeline dot */}
                <div className="flex flex-col items-center">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                    <span className="text-sm">🍴</span>
                  </div>
                  {i < checkinHistory.length - 1 && <div className="w-0.5 flex-1 bg-border mt-1" />}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold">{item.restaurant}</h4>
                    <span className="text-xs text-muted-foreground">{item.date}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.note} · <span className="text-primary font-medium">+{item.xp} XP</span></p>
                  {item.images.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {item.images.map((img, idx) => (
                        <img key={idx} src={img} alt="" className="h-16 w-20 rounded-xl object-cover" />
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {favRestaurants.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl bg-card shadow-card overflow-hidden cursor-pointer"
                onClick={() => navigate(`/restaurant/${r.id}`)}
              >
                <img src={r.image} alt={r.name} className="h-24 w-full object-cover" />
                <div className="p-3">
                  <h4 className="text-xs font-semibold truncate">{r.name}</h4>
                  <p className="text-[10px] text-muted-foreground">{r.category} · {r.rating}⭐</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
