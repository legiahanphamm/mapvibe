import { motion } from "framer-motion";
import { ArrowLeft, Settings, AlertTriangle } from "lucide-react";
import { userProfile } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const recentEats = [
  { name: "Saigon BBQ House", time: "Today, 2:30 PM", amount: 350000, tag: "CHEAT MEAL", emoji: "🍖", color: "bg-secondary/15 text-secondary" },
  { name: "The Green Patio", time: "Yesterday, 9:15 AM", amount: 55000, tag: "DAILY", emoji: "☕", color: "bg-primary/15 text-primary" },
  { name: "Gelato Paradiso", time: "Mar 15, 4:00 PM", amount: 120000, tag: "DESSERT", emoji: "🍰", color: "bg-pink-100 text-pink-600" },
  { name: "Phở Thìn Legacy", time: "Mar 14, 11:20 AM", amount: 55000, tag: "DAILY", emoji: "🍜", color: "bg-primary/15 text-primary" },
];

const BudgetPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const spent = userProfile.monthlySpent;
  const budget = userProfile.monthlyBudget;
  const remaining = budget - spent;
  const percent = Math.round((spent / budget) * 100);
  const isNearLimit = percent >= 75;

  // SVG circle math
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="min-h-screen safe-bottom">
      {/* Header */}
      <div className="px-5 pt-14 pb-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h1 className="font-display text-lg font-bold">{t("budget.title")}</h1>
        <button className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
          <Settings className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Circular Progress */}
      <div className="flex flex-col items-center py-6">
        <div className="relative">
          <svg width="220" height="220" className="-rotate-90">
            {/* Background circle */}
            <circle
              cx="110" cy="110" r={radius}
              stroke="hsl(var(--muted))"
              strokeWidth="12"
              fill="none"
            />
            {/* Progress circle */}
            <motion.circle
              cx="110" cy="110" r={radius}
              stroke="hsl(var(--primary))"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{t("budget.spent")}</span>
            <span className="text-3xl font-display font-bold mt-1">{(spent / 1000).toFixed(0)}k</span>
            <span className="text-xs text-primary font-medium mt-0.5">{percent}% of {(budget / 1000).toFixed(0)}k VND</span>
          </div>
        </div>

        {/* Alert */}
        {isNearLimit && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2"
          >
            <AlertTriangle className="h-3.5 w-3.5 text-secondary" />
            <span className="text-xs font-semibold text-secondary uppercase tracking-wide">{t("budget.alert")}</span>
          </motion.div>
        )}
      </div>

      {/* Monthly Progress Card */}
      <div className="px-5 mb-6">
        <div className="rounded-2xl bg-card shadow-card p-5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-muted-foreground">{t("budget.monthlyProgress")}</span>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">{t("budget.daysLeft")}</span>
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xl font-display font-bold">{(remaining / 1000).toFixed(0)}k {t("budget.remaining")}</span>
            <span className="text-xl font-display font-bold">6 {t("budget.days")}</span>
          </div>
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full gradient-primary"
            />
          </div>
        </div>
      </div>

      {/* Recent Eats */}
      <div className="px-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-base font-bold">{t("budget.recentEats")}</h2>
          <button className="text-xs font-medium text-primary">{t("budget.viewAll")}</button>
        </div>
        <div className="space-y-3">
          {recentEats.map((eat, i) => (
            <motion.div
              key={eat.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-3 rounded-2xl bg-card shadow-card p-4"
            >
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${eat.color.split(" ")[0]}`}>
                <span className="text-lg">{eat.emoji}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold truncate">{eat.name}</h4>
                <p className="text-xs text-muted-foreground">{eat.time}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">-{(eat.amount / 1000).toFixed(0)}k</p>
                <p className={`text-[10px] font-semibold uppercase tracking-wider ${eat.color.split(" ")[1]}`}>{eat.tag}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BudgetPage;
