import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Star, MapPin, Clock, Users, Heart, Share2, CalendarCheck, MessageCircle } from "lucide-react";
import { restaurants } from "@/data/mockData";

const RestaurantDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const restaurant = restaurants.find((r) => r.id === id);

  if (!restaurant) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Restaurant not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-8">
      {/* Hero Image */}
      <div className="relative h-[280px]">
        <img src={restaurant.image} alt={restaurant.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="absolute top-12 left-4 right-4 flex items-center justify-between">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full glass"
          >
            <ArrowLeft className="h-4 w-4" />
          </motion.button>
          <div className="flex gap-2">
            <button className="flex h-9 w-9 items-center justify-center rounded-full glass">
              <Heart className="h-4 w-4" />
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-full glass">
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 -mt-8 relative z-10">
        <div className="rounded-2xl bg-card p-5 shadow-elevated">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-display text-xl font-bold">{restaurant.name}</h1>
              <p className="text-sm text-muted-foreground mt-0.5">{restaurant.category} · {restaurant.priceRange}</p>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-secondary/10 px-2.5 py-1">
              <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
              <span className="text-sm font-semibold">{restaurant.rating}</span>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {restaurant.vibes.map((vibe) => (
              <span key={vibe} className="rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
                {vibe}
              </span>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" /> {restaurant.distance}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> {restaurant.openHours}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" /> {restaurant.checkins} check-ins
            </span>
          </div>
        </div>

        {/* Friends' Feedback */}
        {restaurant.friendFeedback.length > 0 && (
          <div className="mt-4">
            <h2 className="font-display text-sm font-semibold mb-3 flex items-center gap-1.5">
              <MessageCircle className="h-4 w-4 text-primary" />
              Friends' Reviews
            </h2>
            <div className="space-y-3">
              {restaurant.friendFeedback.map((feedback) => (
                <motion.div
                  key={feedback.name}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl bg-card p-4 shadow-card"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={feedback.avatar}
                      alt={feedback.name}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">{feedback.name}</span>
                        <span className="text-[10px] text-muted-foreground">{feedback.timestamp}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < Math.floor(feedback.rating)
                                ? "fill-secondary text-secondary"
                                : "text-border"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-foreground/80 mt-2.5">{feedback.comment}</p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {feedback.vibes.map((vibe) => (
                      <span
                        key={vibe}
                        className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-medium text-muted-foreground"
                      >
                        {vibe}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Friends who visited */}
        {restaurant.friendsVisited.length > 0 && (
          <div className="mt-4">
            <h2 className="font-display text-sm font-semibold mb-2">Friends who've been here</h2>
            <div className="flex items-center gap-2">
              {restaurant.friendsVisited.map((friend) => (
                <div key={friend} className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5">
                  <div className="h-5 w-5 rounded-full gradient-primary flex items-center justify-center">
                    <span className="text-[9px] font-bold text-primary-foreground">{friend[0]}</span>
                  </div>
                  <span className="text-xs font-medium">{friend}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Menu */}
        <div className="mt-5">
          <h2 className="font-display text-sm font-semibold mb-2">Popular Menu</h2>
          <div className="space-y-2">
            {restaurant.menu.map((item) => (
              <div key={item.name} className="flex items-center justify-between rounded-xl bg-muted px-4 py-3">
                <span className="text-sm">{item.name}</span>
                <span className="text-sm font-semibold text-primary">{item.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Map Preview */}
        <div className="mt-5">
          <h2 className="font-display text-sm font-semibold mb-2">Location</h2>
          <div className="h-[140px] rounded-2xl bg-muted flex items-center justify-center overflow-hidden">
            <div className="text-center">
              <MapPin className="h-6 w-6 text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">{restaurant.address}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 flex gap-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/checkin")}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl gradient-primary py-3.5 text-sm font-semibold text-primary-foreground"
          >
            <CalendarCheck className="h-4 w-4" />
            Check In
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl border-2 border-primary py-3.5 text-sm font-semibold text-primary"
          >
            Book Table
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetailPage;
