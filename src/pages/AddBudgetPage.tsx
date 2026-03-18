import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Utensils, Coffee, IceCream, ShoppingBag, Plus, Minus, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { restaurants } from "@/data/mockData";

const categories = [
  { id: "meal", icon: Utensils, label: "Meal", labelVi: "Bữa ăn", emoji: "🍽️" },
  { id: "coffee", icon: Coffee, label: "Coffee", labelVi: "Cà phê", emoji: "☕" },
  { id: "dessert", icon: IceCream, label: "Dessert", labelVi: "Tráng miệng", emoji: "🍰" },
  { id: "groceries", icon: ShoppingBag, label: "Groceries", labelVi: "Đi chợ", emoji: "🛒" },
];

const quickAmounts = [25, 50, 100, 150, 200, 350];

const AddBudgetPage = () => {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const [amount, setAmount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("meal");
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const adjustAmount = (delta: number) => {
    setAmount(prev => Math.max(0, prev + delta));
  };

  const handleSubmit = () => {
    if (amount <= 0) return;
    setSubmitted(true);
    setTimeout(() => navigate("/budget"), 1500);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mb-4"
        >
          <Check className="h-10 w-10 text-primary-foreground" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg font-display font-bold"
        >
          {t("addBudget.saved")}
        </motion.p>
        <p className="text-sm text-muted-foreground mt-1">{amount}k VND · {categories.find(c => c.id === selectedCategory)?.emoji}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen safe-bottom">
      {/* Header */}
      <div className="px-5 pt-14 pb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="font-display text-lg font-bold">{t("addBudget.title")}</h1>
          <p className="text-xs text-muted-foreground">{t("addBudget.subtitle")}</p>
        </div>
      </div>

      <div className="px-5 space-y-6">
        {/* Amount Input */}
        <div className="rounded-2xl bg-card shadow-card p-6 text-center">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-3">{t("addBudget.amount")}</p>
          <div className="flex items-center justify-center gap-4">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => adjustAmount(-25)}
              className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
            >
              <Minus className="h-4 w-4" />
            </motion.button>
            <div className="min-w-[140px]">
              <span className="text-4xl font-display font-bold">{amount}k</span>
              <span className="text-sm text-muted-foreground ml-1">VND</span>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => adjustAmount(25)}
              className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
            >
              <Plus className="h-4 w-4" />
            </motion.button>
          </div>

          {/* Quick amounts */}
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            {quickAmounts.map(q => (
              <button
                key={q}
                onClick={() => setAmount(q)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  amount === q ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {q}k
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">{t("addBudget.category")}</p>
          <div className="grid grid-cols-4 gap-2">
            {categories.map(cat => {
              const Icon = cat.icon;
              return (
                <motion.button
                  key={cat.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex flex-col items-center gap-1.5 rounded-2xl p-3 transition-all ${
                    selectedCategory === cat.id
                      ? "gradient-primary text-primary-foreground shadow-glow"
                      : "bg-card shadow-card"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-[10px] font-semibold">{lang === "vi" ? cat.labelVi : cat.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Restaurant (optional) */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">{t("addBudget.where")}</p>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {restaurants.slice(0, 5).map(r => (
              <button
                key={r.id}
                onClick={() => setSelectedRestaurant(selectedRestaurant === r.id ? null : r.id)}
                className={`flex-shrink-0 flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                  selectedRestaurant === r.id
                    ? "gradient-primary text-primary-foreground"
                    : "bg-card shadow-card text-foreground"
                }`}
              >
                <img src={r.image} alt={r.name} className="w-7 h-7 rounded-lg object-cover" />
                {r.name}
              </button>
            ))}
          </div>
        </div>

        {/* Note */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">{t("addBudget.note")}</p>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t("addBudget.notePlaceholder")}
            className="w-full rounded-xl bg-muted px-4 py-3 text-sm outline-none resize-none h-16 placeholder:text-muted-foreground"
          />
        </div>

        {/* Submit */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          className={`w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all ${
            amount > 0 ? "gradient-primary text-primary-foreground shadow-glow" : "bg-muted text-muted-foreground"
          }`}
        >
          <Check className="h-4 w-4" /> {t("addBudget.save")}
        </motion.button>
      </div>
    </div>
  );
};

export default AddBudgetPage;
