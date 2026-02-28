import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Users, Smile, MapPin, Send } from "lucide-react";
import { moods } from "@/data/mockData";

const CheckInPage = () => {
  const [caption, setCaption] = useState("");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [photo, setPhoto] = useState(false);

  return (
    <div className="min-h-screen safe-bottom">
      <div className="px-5 pt-14 pb-4">
        <h1 className="text-2xl font-display font-bold">Check In 📸</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Share your food moment</p>
      </div>

      <div className="px-5">
        {/* Photo Capture Area */}
        <motion.div
          whileTap={{ scale: 0.98 }}
          onClick={() => setPhoto(!photo)}
          className={`relative h-[280px] rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-all ${
            photo ? "border-primary" : "border-border"
          }`}
        >
          {photo ? (
            <img
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop"
              alt="Food"
              className="h-full w-full object-cover rounded-2xl"
            />
          ) : (
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-3">
                <Camera className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Tap to capture</p>
              <p className="text-xs text-muted-foreground mt-0.5">Take a photo of your meal</p>
            </div>
          )}
          {photo && (
            <div className="absolute bottom-3 right-3 rounded-full bg-card/90 backdrop-blur-sm px-3 py-1 text-xs font-medium">
              📍 The Green Patio · Now
            </div>
          )}
        </motion.div>

        {/* Caption */}
        <div className="mt-4">
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Add a caption... ✨"
            className="w-full rounded-xl bg-muted px-4 py-3 text-sm outline-none resize-none h-20 placeholder:text-muted-foreground"
          />
        </div>

        {/* Mood Tag */}
        <div className="mt-3">
          <p className="text-xs font-medium text-muted-foreground mb-2">Add a mood</p>
          <div className="flex gap-2 flex-wrap">
            {moods.map((mood) => (
              <button
                key={mood.id}
                onClick={() => setSelectedMood(selectedMood === mood.id ? null : mood.id)}
                className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                  selectedMood === mood.id
                    ? "gradient-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {mood.emoji} {mood.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tag Friends */}
        <div className="mt-4">
          <button className="flex items-center gap-2 rounded-xl bg-muted px-4 py-3 w-full text-sm text-muted-foreground">
            <Users className="h-4 w-4" /> Tag friends
          </button>
        </div>

        {/* Location */}
        <div className="mt-3">
          <button className="flex items-center gap-2 rounded-xl bg-muted px-4 py-3 w-full text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" /> Add location
          </button>
        </div>

        {/* Submit */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          className={`mt-5 w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all ${
            photo
              ? "gradient-primary text-primary-foreground shadow-glow"
              : "bg-muted text-muted-foreground"
          }`}
        >
          <Send className="h-4 w-4" />
          Post Check-In
        </motion.button>
      </div>
    </div>
  );
};

export default CheckInPage;
