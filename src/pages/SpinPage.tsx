import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Share2, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { restaurants } from "@/data/mockData";
import RestaurantCard from "@/components/RestaurantCard";
import { useLanguage } from "@/contexts/LanguageContext";

const SpinPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<typeof restaurants[0] | null>(null);
  const [rotation, setRotation] = useState(0);

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setResult(null);
    const newRotation = rotation + 1440 + Math.random() * 720;
    setRotation(newRotation);
    setTimeout(() => {
      const idx = Math.floor(Math.random() * restaurants.length);
      setResult(restaurants[idx]);
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
