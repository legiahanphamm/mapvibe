import { Restaurant } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, MapPin } from "lucide-react";

interface RestaurantCardProps {
  restaurant: Restaurant;
  variant?: "horizontal" | "vertical";
}

const RestaurantCard = ({ restaurant, variant = "vertical" }: RestaurantCardProps) => {
  const navigate = useNavigate();

  if (variant === "horizontal") {
    return (
      <motion.div
        whileTap={{ scale: 0.97 }}
        onClick={() => navigate(`/restaurant/${restaurant.id}`)}
        className="flex gap-3 rounded-xl bg-card p-3 shadow-card cursor-pointer"
      >
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="h-20 w-20 rounded-lg object-cover"
        />
        <div className="flex flex-1 flex-col justify-between py-0.5">
          <div>
            <h3 className="font-display text-sm font-semibold leading-tight">{restaurant.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{restaurant.category} · {restaurant.priceRange}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs">
              <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
              {restaurant.rating}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {restaurant.distance}
            </span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      onClick={() => navigate(`/restaurant/${restaurant.id}`)}
      className="w-[200px] flex-shrink-0 cursor-pointer"
    >
      <div className="relative overflow-hidden rounded-2xl">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="h-[140px] w-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/60 to-transparent p-3 pt-8">
          <div className="flex items-center gap-1.5">
            {restaurant.isOpen ? (
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            ) : (
              <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
            )}
            <span className="text-[10px] font-medium text-primary-foreground">
              {restaurant.isOpen ? "Open" : "Closed"}
            </span>
          </div>
        </div>
        <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-card/90 backdrop-blur-sm px-2 py-0.5">
          <Star className="h-3 w-3 fill-secondary text-secondary" />
          <span className="text-xs font-semibold">{restaurant.rating}</span>
        </div>
      </div>
      <div className="mt-2 px-0.5">
        <h3 className="font-display text-sm font-semibold truncate">{restaurant.name}</h3>
        <p className="text-xs text-muted-foreground">{restaurant.category} · {restaurant.distance}</p>
      </div>
    </motion.div>
  );
};

export default RestaurantCard;
