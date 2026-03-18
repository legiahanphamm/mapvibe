import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MoreVertical, Tag, BookOpen, Camera, MapPin, Users, Send, Heart } from "lucide-react";
import { moods } from "@/data/mockData";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

type CheckInMode = "restaurant" | "cooking" | "vibe";

const reactions = [
  { id: "chefs-kiss", label: "CHEF'S KISS", emoji: "💋" },
  { id: "fire", label: "FIRE", emoji: "🔥" },
  { id: "yummy", label: "YUMMY", emoji: "😋" },
  { id: "love", label: "LOVE IT", emoji: "❤️" },
];

const CheckInPage = () => {
  const [caption, setCaption] = useState("");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [photo, setPhoto] = useState(false);
  const [mode, setMode] = useState<CheckInMode>("restaurant");
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const { t } = useLanguage();
  const navigate = useNavigate();

  const modes: { id: CheckInMode; label: string; labelVi: string }[] = [
    { id: "restaurant", label: "RESTAURANT", labelVi: "NHÀ HÀNG" },
    { id: "cooking", label: "HOME COOKING", labelVi: "NẤU ĂN" },
    { id: "vibe", label: "VIBE ONLY", labelVi: "KHÔNG GIAN" },
  ];

  const getModeTitle = () => {
    if (mode === "cooking") return t("checkin.modeCooking");
    if (mode === "vibe") return t("checkin.modeVibe");
    return t("checkin.modeRestaurant");
  };

  const getModeSubtitle = () => {
    if (mode === "cooking") return "MAPVIBE KITCHEN MODE";
    if (mode === "vibe") return "MAPVIBE VIBE MODE";
    return "MAPVIBE CHECK-IN";
  };

  return (
    <div className="min-h-screen bg-black text-white safe-bottom flex flex-col">
      {/* Header */}
      <div className="px-5 pt-14 pb-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
          <ArrowLeft className="h-5 w-5 text-white" />
        </button>
        <div className="text-center">
          <h1 className="text-sm font-bold tracking-widest text-primary uppercase">{getModeTitle()}</h1>
          <p className="text-[10px] text-white/50 tracking-wider mt-0.5">{getModeSubtitle()}</p>
        </div>
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
          <MoreVertical className="h-5 w-5 text-white" />
        </button>
      </div>

      {/* Photo Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-4">
        <motion.div
          whileTap={{ scale: 0.98 }}
          onClick={() => setPhoto(!photo)}
          className="relative w-full max-w-[320px] aspect-square rounded-3xl overflow-hidden border-2 border-primary/30"
        >
          {/* Corner brackets */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-white/30 rounded-tl-lg z-10" />
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-white/30 rounded-tr-lg z-10" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-white/30 rounded-bl-lg z-10" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-white/30 rounded-br-lg z-10" />

          {photo ? (
            <>
              <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=600&fit=crop"
                alt="Food"
                className="h-full w-full object-cover"
              />
              {/* Reaction overlay */}
              <AnimatePresence>
                {selectedReaction && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center"
                  >
                    <div className="w-16 h-16 rounded-full border-2 border-primary flex items-center justify-center bg-primary/20 backdrop-blur-sm">
                      <Heart className="h-7 w-7 text-primary fill-primary" />
                    </div>
                    <span className="mt-2 px-3 py-1 rounded-full bg-primary text-xs font-bold text-primary-foreground tracking-wider">
                      {reactions.find(r => r.id === selectedReaction)?.label}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <div className="h-full w-full bg-white/5 flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-3">
                <Camera className="h-7 w-7 text-white/40" />
              </div>
              <p className="text-sm text-white/40">{t("checkin.tapToCapture")}</p>
            </div>
          )}
        </motion.div>

        {/* Reactions */}
        {photo && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-2 mt-4"
          >
            {reactions.map(r => (
              <button
                key={r.id}
                onClick={() => setSelectedReaction(selectedReaction === r.id ? null : r.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedReaction === r.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-white/10 text-white/60"
                }`}
              >
                {r.emoji} {r.label}
              </button>
            ))}
          </motion.div>
        )}

        {/* Mode-specific actions */}
        <div className="flex gap-3 mt-5 w-full max-w-[320px]">
          {mode === "cooking" && (
            <>
              <button className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm text-white/70">
                <Tag className="h-4 w-4" /> {t("checkin.tagIngredients")}
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm text-white/70">
                <BookOpen className="h-4 w-4" /> {t("checkin.shareRecipe")}
              </button>
            </>
          )}
          {mode === "restaurant" && (
            <>
              <button className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm text-white/70">
                <MapPin className="h-4 w-4" /> {t("checkin.addLocation")}
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm text-white/70">
                <Users className="h-4 w-4" /> {t("checkin.tagFriends")}
              </button>
            </>
          )}
          {mode === "vibe" && (
            <div className="flex gap-2 flex-wrap w-full">
              {moods.map(mood => (
                <button
                  key={mood.id}
                  onClick={() => setSelectedMood(selectedMood === mood.id ? null : mood.id)}
                  className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                    selectedMood === mood.id ? "bg-primary text-primary-foreground" : "bg-white/10 text-white/60"
                  }`}
                >
                  {mood.emoji} {t(`mood.${mood.id}`)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Caption */}
        <div className="w-full max-w-[320px] mt-4">
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder={t("checkin.addCaption")}
            className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white outline-none resize-none h-16 placeholder:text-white/30"
          />
        </div>
      </div>

      {/* Bottom: Capture button + mode selector */}
      <div className="pb-8 pt-4 bg-gradient-to-t from-black/80 to-transparent">
        {/* Capture / Post button */}
        <div className="flex justify-center mb-5">
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="w-[72px] h-[72px] rounded-full bg-primary flex items-center justify-center shadow-glow ring-4 ring-white/20"
          >
            {photo ? <Send className="h-7 w-7 text-primary-foreground" /> : <Camera className="h-7 w-7 text-primary-foreground" />}
          </motion.button>
        </div>

        {/* Mode tabs */}
        <div className="flex justify-center gap-6">
          {modes.map(m => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className="flex flex-col items-center gap-1"
            >
              <span className={`text-[11px] font-bold tracking-wider transition-colors ${
                mode === m.id ? "text-primary" : "text-white/40"
              }`}>
                {m.label}
              </span>
              {mode === m.id && (
                <motion.div layoutId="mode-dot" className="w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CheckInPage;
