import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Star, MapPin, Clock, Users, Heart, Share2, CalendarCheck, MessageCircle, X, Check, Navigation } from "lucide-react";
import { restaurants } from "@/data/mockData";
import { useLanguage } from "@/contexts/LanguageContext";

const RestaurantDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const restaurant = restaurants.find((r) => r.id === id);
  const [showBookingSheet, setShowBookingSheet] = useState(false);
  const [selectedDate, setSelectedDate] = useState("Today");
  const [selectedTime, setSelectedTime] = useState("19:00");
  const [guestCount, setGuestCount] = useState(2);
  const [seating, setSeating] = useState<"indoor" | "outdoor">("indoor");
  const [occasion, setOccasion] = useState<"none" | "birthday" | "date" | "business">("none");
  const [bookingNote, setBookingNote] = useState("");
  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  const dateOptions = ["Today", "Tomorrow", "Fri, Mar 20", "Sat, Mar 21"];
  const timeOptions = ["17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30"];

  const canBook = guestCount > 0 && selectedDate.length > 0 && selectedTime.length > 0;
  const estimatedSpend = useMemo(() => {
    const perGuest = restaurant?.priceRange === "$$$$"
      ? 500
      : restaurant?.priceRange === "$$$"
      ? 320
      : restaurant?.priceRange === "$$"
      ? 180
      : 90;
    return perGuest * guestCount;
  }, [guestCount, restaurant?.priceRange]);

  const handleBookTable = () => {
    if (!canBook) return;
    setBookingSubmitted(true);
    window.setTimeout(() => {
      setShowBookingSheet(false);
      setBookingSubmitted(false);
    }, 1600);
  };

  const handleGetDirections = () => {
    const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(restaurant.name)}/@${restaurant.lat},${restaurant.lng},15z`;
    window.open(mapsUrl, '_blank');
  };

  if (!restaurant) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Restaurant not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-8">
      <div className="relative h-[280px]">
        <img src={restaurant.image} alt={restaurant.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="absolute top-12 left-4 right-4 flex items-center justify-between">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center rounded-full glass">
            <ArrowLeft className="h-4 w-4" />
          </motion.button>
          <div className="flex gap-2">
            <button className="flex h-9 w-9 items-center justify-center rounded-full glass"><Heart className="h-4 w-4" /></button>
            <button className="flex h-9 w-9 items-center justify-center rounded-full glass"><Share2 className="h-4 w-4" /></button>
          </div>
        </div>
      </div>

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
            {restaurant.vibes.map(vibe => (
              <span key={vibe} className="rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">{vibe}</span>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {restaurant.distance}</span>
            <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {restaurant.openHours}</span>
            <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> {restaurant.checkins} {t("heatmap.checkins")}</span>
          </div>
        </div>

        {restaurant.friendFeedback.length > 0 && (
          <div className="mt-4">
            <h2 className="font-display text-sm font-semibold mb-3 flex items-center gap-1.5">
              <MessageCircle className="h-4 w-4 text-primary" />{t("detail.friendsReviews")}
            </h2>
            <div className="space-y-3">
              {restaurant.friendFeedback.map(feedback => (
                <motion.div key={feedback.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-card p-4 shadow-card overflow-hidden">
                  {/* Review Image if available */}
                  {feedback.reviewImage && (
                    <img src={feedback.reviewImage} alt={`${feedback.name}'s review`} className="w-full h-32 object-cover rounded-lg mb-3" />
                  )}
                  
                  <div className="flex items-center gap-2.5">
                    <img src={feedback.avatar} alt={feedback.name} className="h-9 w-9 rounded-full object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-sm font-semibold truncate">{feedback.name}</span>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">{feedback.timestamp}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-3 w-3 ${i < Math.floor(feedback.rating) ? "fill-secondary text-secondary" : "text-border"}`} />
                        ))}
                        <span className="text-[10px] text-muted-foreground ml-1">{feedback.rating}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-foreground/80 mt-2.5">{feedback.comment}</p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {feedback.vibes.map(vibe => (
                      <span key={vibe} className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-medium text-muted-foreground">{vibe}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {restaurant.friendsVisited.length > 0 && (
          <div className="mt-4">
            <h2 className="font-display text-sm font-semibold mb-2">{t("detail.friendsBeenHere")}</h2>
            <div className="flex items-center gap-2">
              {restaurant.friendsVisited.map(friend => (
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

        <div className="mt-5">
          <h2 className="font-display text-sm font-semibold mb-2">{t("detail.popularMenu")}</h2>
          <div className="space-y-2">
            {restaurant.menu.map(item => (
              <div key={item.name} className="flex items-center justify-between rounded-xl bg-muted px-4 py-3">
                <span className="text-sm">{item.name}</span>
                <span className="text-sm font-semibold text-primary">{item.price}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <h2 className="font-display text-sm font-semibold mb-2">{t("detail.location")}</h2>
          <div className="h-[140px] rounded-2xl bg-muted flex items-center justify-center overflow-hidden">
            <div className="text-center">
              <MapPin className="h-6 w-6 text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">{restaurant.address}</p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => navigate("/checkin")}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl gradient-primary py-3.5 text-sm font-semibold text-primary-foreground">
            <CalendarCheck className="h-4 w-4" />{t("detail.checkIn")}
          </motion.button>
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => setShowBookingSheet(true)}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl border-2 border-primary py-3.5 text-sm font-semibold text-primary">
            {t("detail.bookTable")}
          </motion.button>
        </div>

        <motion.button whileTap={{ scale: 0.97 }} onClick={handleGetDirections}
          className="w-full mt-3 flex items-center justify-center gap-2 rounded-xl bg-secondary/10 py-3.5 text-sm font-semibold text-secondary hover:bg-secondary/20 transition-colors">
          <Navigation className="h-4 w-4" />{t("nav.getDirections")}
        </motion.button>
      </div>

      {showBookingSheet && (
        <div className="fixed inset-0 z-50 flex items-end">
          <button
            aria-label="Close"
            className="absolute inset-0 bg-black/40"
            onClick={() => {
              setShowBookingSheet(false);
              setBookingSubmitted(false);
            }}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="relative w-full rounded-t-3xl bg-card p-5 pb-7 shadow-elevated"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-display text-base font-bold">{t("detail.bookTable")}</h3>
                <p className="text-xs text-muted-foreground">{t("booking.reservationConfirmed")} {restaurant.name}</p>
              </div>
              <button
                onClick={() => {
                  setShowBookingSheet(false);
                  setBookingSubmitted(false);
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {bookingSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl bg-primary/10 px-4 py-6 text-center"
              >
                <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-full gradient-primary">
                  <Check className="h-5 w-5 text-primary-foreground" />
                </div>
                <p className="font-display text-sm font-semibold">{t("booking.reservationConfirmed")}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {selectedDate} at {selectedTime} for {guestCount} {guestCount === 1 ? t("booking.guest") : t("booking.guests")}
                </p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("booking.date")}</p>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {dateOptions.map((date) => (
                      <button
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                          selectedDate === date
                            ? "gradient-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {date}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("booking.time")}</p>
                  <div className="grid grid-cols-4 gap-2">
                    {timeOptions.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`rounded-xl px-2 py-2 text-xs font-medium transition-all ${
                          selectedTime === time
                            ? "gradient-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("booking.date")}</p>
                  <div className="flex items-center justify-between rounded-xl bg-muted px-3 py-2">
                    <span className="text-sm font-medium">{t("booking.partySize")}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setGuestCount((prev) => Math.max(1, prev - 1))}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-background text-sm font-bold"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-sm font-semibold">{guestCount}</span>
                      <button
                        onClick={() => setGuestCount((prev) => Math.min(12, prev + 1))}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-background text-sm font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("booking.seating")}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSeating("indoor")}
                      className={`rounded-xl px-3 py-2 text-sm font-medium transition-all ${
                        seating === "indoor" ? "gradient-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      {t("booking.indoor")}
                    </button>
                    <button
                      onClick={() => setSeating("outdoor")}
                      className={`rounded-xl px-3 py-2 text-sm font-medium transition-all ${
                        seating === "outdoor" ? "gradient-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      {t("booking.outdoor")}
                    </button>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("booking.occasion")}</p>
                  <select
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value as "none" | "birthday" | "date" | "business")}
                    className="w-full rounded-xl bg-muted px-3 py-2 text-sm outline-none"
                  >
                    <option value="none">{t("booking.occasion")}</option>
                    <option value="birthday">Birthday</option>
                    <option value="date">Date night</option>
                    <option value="business">Business meal</option>
                  </select>
                </div>

                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("booking.notes")}</p>
                  <textarea
                    value={bookingNote}
                    onChange={(e) => setBookingNote(e.target.value)}
                    placeholder="Allergies, wheelchair access, cake, etc."
                    className="h-16 w-full resize-none rounded-xl bg-muted px-3 py-2 text-sm outline-none"
                  />
                </div>

                <div className="rounded-xl bg-primary/10 px-3 py-2 text-xs text-foreground/80">
                  {t("booking.estimatedSpend")}: <span className="font-semibold">{estimatedSpend}k VND</span>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  disabled={!canBook}
                  onClick={handleBookTable}
                  className={`w-full rounded-xl py-3 text-sm font-semibold transition-all ${
                    canBook ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {t("booking.confirmBooking")}
                </motion.button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetailPage;
