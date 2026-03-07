import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Users, MapPin, Send } from "lucide-react";
import { moods } from "@/data/mockData";
import { useLanguage } from "@/contexts/LanguageContext";

const CheckInPage = () => {
  const [caption, setCaption] = useState("");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [photo, setPhoto] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="min-h-screen safe-bottom">
      <div className="px-5 pt-14 pb-4">
        <h1 className="text-2xl font-display font-bold">{t("checkin.title")}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{t("checkin.subtitle")}</p>
      </div>

      <div className="px-5">
        <motion.div
          whileTap={{ scale: 0.98 }}
          onClick={() => setPhoto(!photo)}
          className={`relative h-[280px] rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-all ${photo ? "border-primary" : "border-border"}`}
        >
          {photo ? (
            <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop" alt="Food" className="h-full w-full object-cover rounded-2xl" />
          ) : (
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-3">
                <Camera className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">{t("checkin.tapToCapture")}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t("checkin.takePhoto")}</p>
            </div>
          )}
          {photo && (
            <div className="absolute bottom-3 right-3 rounded-full bg-card/90 backdrop-blur-sm px-3 py-1 text-xs font-medium">
              📍 The Green Patio · Now
            </div>
          )}
        </motion.div>

        <div className="mt-4">
          <textarea value={caption} onChange={(e) => setCaption(e.target.value)} placeholder={t("checkin.addCaption")}
            className="w-full rounded-xl bg-muted px-4 py-3 text-sm outline-none resize-none h-20 placeholder:text-muted-foreground" />
        </div>

        <div className="mt-3">
          <p className="text-xs font-medium text-muted-foreground mb-2">{t("checkin.addMood")}</p>
          <div className="flex gap-2 flex-wrap">
            {moods.map(mood => (
              <button key={mood.id} onClick={() => setSelectedMood(selectedMood === mood.id ? null : mood.id)}
                className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                  selectedMood === mood.id ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                {mood.emoji} {t(`mood.${mood.id}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <button className="flex items-center gap-2 rounded-xl bg-muted px-4 py-3 w-full text-sm text-muted-foreground">
            <Users className="h-4 w-4" /> {t("checkin.tagFriends")}
          </button>
        </div>

        <div className="mt-3">
          <button className="flex items-center gap-2 rounded-xl bg-muted px-4 py-3 w-full text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" /> {t("checkin.addLocation")}
          </button>
        </div>

        <motion.button whileTap={{ scale: 0.97 }}
          className={`mt-5 w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all ${
            photo ? "gradient-primary text-primary-foreground shadow-glow" : "bg-muted text-muted-foreground"
          }`}>
          <Send className="h-4 w-4" />{t("checkin.post")}
        </motion.button>
      </div>
    </div>
  );
};

export default CheckInPage;
