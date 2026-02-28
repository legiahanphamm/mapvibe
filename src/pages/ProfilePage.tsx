import { motion } from "framer-motion";
import { Settings, ChevronRight, MapPin, Flame, Award, Heart } from "lucide-react";
import { userProfile, restaurants } from "@/data/mockData";
import { BarChart, Bar, XAxis, ResponsiveContainer } from "recharts";

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const chartData = userProfile.weeklyCheckins.map((val, i) => ({
  day: weekDays[i],
  count: val,
}));

const ProfilePage = () => {
  const budgetPercent = Math.round((userProfile.monthlySpent / userProfile.monthlyBudget) * 100);
  const favRestaurants = restaurants.filter((r) => userProfile.favoriteRestaurants.includes(r.id));

  return (
    <div className="min-h-screen safe-bottom">
      <div className="px-5 pt-14 pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-display font-bold">Profile</h1>
          <button className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
            <Settings className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* User Card */}
      <div className="px-5">
        <div className="rounded-2xl gradient-card shadow-card p-5">
          <div className="flex items-center gap-4">
            <img src={userProfile.avatar} alt={userProfile.name} className="h-16 w-16 rounded-full object-cover ring-2 ring-primary ring-offset-2 ring-offset-background" />
            <div>
              <h2 className="font-display text-lg font-bold">{userProfile.name}</h2>
              <p className="text-sm text-muted-foreground">{userProfile.username}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="text-center rounded-xl bg-muted p-3">
              <p className="text-xl font-display font-bold">{userProfile.totalCheckins}</p>
              <p className="text-[10px] text-muted-foreground">Check-ins</p>
            </div>
            <div className="text-center rounded-xl bg-muted p-3">
              <p className="text-xl font-display font-bold flex items-center justify-center gap-0.5">
                {userProfile.streak} <Flame className="h-4 w-4 text-secondary" />
              </p>
              <p className="text-[10px] text-muted-foreground">Day Streak</p>
            </div>
            <div className="text-center rounded-xl bg-muted p-3">
              <p className="text-xl font-display font-bold">{userProfile.friends.length}</p>
              <p className="text-[10px] text-muted-foreground">Friends</p>
            </div>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="mt-5 px-5">
        <h2 className="font-display text-sm font-semibold mb-2">Badges</h2>
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
        <h2 className="font-display text-sm font-semibold mb-2">This Week</h2>
        <div className="rounded-2xl bg-card shadow-card p-4">
          <ResponsiveContainer width="100%" height={100}>
            <BarChart data={chartData}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Budget */}
      <div className="mt-5 px-5">
        <h2 className="font-display text-sm font-semibold mb-2">Monthly Budget</h2>
        <div className="rounded-2xl bg-card shadow-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">{(userProfile.monthlySpent / 1000).toFixed(0)}k / {(userProfile.monthlyBudget / 1000).toFixed(0)}k VND</span>
            <span className="text-xs text-muted-foreground">{budgetPercent}%</span>
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
          <Heart className="h-3.5 w-3.5 text-destructive" /> Favorites
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
        <h2 className="font-display text-sm font-semibold mb-2">Friends</h2>
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
        <h2 className="font-display text-sm font-semibold mb-2">Eating Preferences</h2>
        <div className="flex gap-2 flex-wrap">
          {userProfile.eatingPrefs.map((pref) => (
            <span key={pref} className="rounded-full gradient-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">{pref}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
