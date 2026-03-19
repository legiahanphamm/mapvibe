import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Flame, Heart, Globe, ChevronRight, X, UserPlus, CalendarDays, Plus } from "lucide-react";
import { userProfile, restaurants } from "@/data/mockData";
import { BarChart, Bar, XAxis, ResponsiveContainer } from "recharts";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

const weekDays = {
  en: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  vi: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
};

const ProfilePage = () => {
  const { lang, setLang, t } = useLanguage();
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const [displayName, setDisplayName] = useState(userProfile.name);
  const [username, setUsername] = useState(userProfile.username);

  const budgetPercent = Math.round((userProfile.monthlySpent / userProfile.monthlyBudget) * 100);
  const favRestaurants = restaurants.filter((r) => userProfile.favoriteRestaurants.includes(r.id));

  const chartData = userProfile.weeklyCheckins.map((val, i) => ({
    day: weekDays[lang][i],
    count: val,
  }));

  return (
    <div className="min-h-screen safe-bottom">
      <div className="px-5 pt-14 pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-display font-bold">{t("profile.title")}</h1>
          <button onClick={() => setShowSettings(true)} className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
            <Settings className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Language Toggle */}
      <div className="px-5 mb-4">
        <div className="flex items-center justify-between rounded-2xl bg-card shadow-card p-4">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{t("profile.language")}</span>
          </div>
          <div className="flex gap-1 rounded-full bg-muted p-1">
            {(["en", "vi"] as Language[]).map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                  lang === l
                    ? "gradient-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground"
                }`}
              >
                {l === "en" ? "🇬🇧 EN" : "🇻🇳 VI"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* User Card - clickable */}
      <div className="px-5">
        <div className="rounded-2xl gradient-card shadow-card p-5 cursor-pointer" onClick={() => navigate("/user-profile")}>
          <div className="flex items-center gap-4">
            <img src={userProfile.avatar} alt={userProfile.name} className="h-16 w-16 rounded-full object-cover ring-2 ring-primary ring-offset-2 ring-offset-background" />
            <div className="flex-1">
              <h2 className="font-display text-lg font-bold">{displayName}</h2>
              <p className="text-sm text-muted-foreground">{username}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="text-center rounded-xl bg-muted p-3">
              <p className="text-xl font-display font-bold">{userProfile.totalCheckins}</p>
              <p className="text-[10px] text-muted-foreground">{t("profile.checkins")}</p>
            </div>
            <div className="text-center rounded-xl bg-muted p-3">
              <p className="text-xl font-display font-bold flex items-center justify-center gap-0.5">
                {userProfile.streak} <Flame className="h-4 w-4 text-secondary" />
              </p>
              <p className="text-[10px] text-muted-foreground">{t("profile.dayStreak")}</p>
            </div>
            <div className="text-center rounded-xl bg-muted p-3">
              <p className="text-xl font-display font-bold">{userProfile.friends.length}</p>
              <p className="text-[10px] text-muted-foreground">{t("profile.friends")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="mt-5 px-5">
        <h2 className="font-display text-sm font-semibold mb-2">{t("profile.badges")}</h2>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {userProfile.badges.map((badge) => (
            <span key={badge} className="flex items-center gap-1 whitespace-nowrap rounded-full bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground">
              {badge}
            </span>
          ))}
        </div>
      </div>

      {/* Weekly Activity */}
      <div className="mt-5 px-5">
        <h2 className="font-display text-sm font-semibold mb-2">{t("profile.thisWeek")}</h2>
        <div className="rounded-2xl bg-card shadow-card p-4">
          <ResponsiveContainer width="100%" height={100}>
            <BarChart data={chartData}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Budget - clickable */}
      <div className="mt-5 px-5">
        <h2 className="font-display text-sm font-semibold mb-2">{t("profile.monthlyBudget")}</h2>
        <div className="rounded-2xl bg-card shadow-card p-4 cursor-pointer" onClick={() => navigate("/budget")}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">{(userProfile.monthlySpent / 1000).toFixed(0)}k / {(userProfile.monthlyBudget / 1000).toFixed(0)}k VND</span>
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">{budgetPercent}%</span>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
          </div>
          <div className="h-2.5 rounded-full bg-muted overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${budgetPercent}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full gradient-primary"
            />
          </div>
        </div>
      </div>

      {/* Favorites */}
      <div className="mt-5 px-5">
        <h2 className="font-display text-sm font-semibold mb-2 flex items-center gap-1">
          <Heart className="h-3.5 w-3.5 text-destructive" /> {t("profile.favorites")}
        </h2>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {favRestaurants.map((r) => (
            <div key={r.id} className="w-[140px] flex-shrink-0">
              <img src={r.image} alt={r.name} className="h-[100px] w-full rounded-xl object-cover" />
              <p className="mt-1.5 text-xs font-semibold truncate">{r.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Friends */}
      <div className="mt-5 px-5">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-display text-sm font-semibold">{t("profile.friends")}</h2>
          <button
            onClick={() => navigate("/friends/add")}
            className="flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
          >
            <Plus className="h-3.5 w-3.5" /> {t("profile.addFriendsButton")}
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {userProfile.friends.map((f) => (
            <div key={f.name} className="flex flex-col items-center">
              <img src={f.avatar} alt={f.name} className="h-12 w-12 rounded-full object-cover" />
              <span className="mt-1 text-[10px] font-medium">{f.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Eating Prefs */}
      <div className="mt-5 px-5 mb-4">
        <h2 className="font-display text-sm font-semibold mb-2">{t("profile.eatingPrefs")}</h2>
        <div className="flex gap-2 flex-wrap">
          {userProfile.eatingPrefs.map((pref) => (
            <span key={pref} className="rounded-full gradient-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">{pref}</span>
          ))}
        </div>
      </div>

      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <button className="absolute inset-0 bg-black/40" onClick={() => setShowSettings(false)} />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="relative w-full max-w-lg rounded-t-3xl bg-card p-5 pb-7 shadow-elevated"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-base font-bold">{t("profile.settingsTitle")}</h3>
              <button onClick={() => setShowSettings(false)} className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-3">
              <p className="mb-1 text-xs font-semibold text-muted-foreground">{t("profile.displayName")}</p>
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full rounded-xl bg-muted px-3 py-2 text-sm outline-none"
              />
            </div>

            <div className="mb-4">
              <p className="mb-1 text-xs font-semibold text-muted-foreground">{t("profile.username")}</p>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value.startsWith("@") ? e.target.value : `@${e.target.value}`)}
                className="w-full rounded-xl bg-muted px-3 py-2 text-sm outline-none"
              />
            </div>

            <button
              onClick={() => setShowSettings(false)}
              className="w-full rounded-xl gradient-primary py-3 text-sm font-semibold text-primary-foreground"
            >
              {t("profile.saveChanges")}
            </button>
            <p className="mt-3 flex items-center justify-center gap-1 text-[11px] text-muted-foreground">
              <UserPlus className="h-3.5 w-3.5" /> {t("profile.editProfile")}
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
