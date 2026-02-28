import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Compass, Sparkles, Camera, TrendingUp, User } from "lucide-react";

const tabs = [
  { path: "/", icon: Compass, label: "Discover" },
  { path: "/ai", icon: Sparkles, label: "AI" },
  { path: "/checkin", icon: Camera, label: "Check-in" },
  { path: "/trending", icon: TrendingUp, label: "Trending" },
  { path: "/profile", icon: User, label: "Profile" },
];

const BottomNav = () => {
  const location = useLocation();

  // Hide on restaurant detail page
  if (location.pathname.startsWith("/restaurant/")) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 pb-[env(safe-area-inset-bottom,8px)] pt-2">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              className="relative flex flex-col items-center gap-0.5 px-3 py-1.5"
            >
              {isActive && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute -top-1 h-0.5 w-8 rounded-full gradient-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <motion.div
                animate={{ scale: isActive ? 1.15 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                {tab.path === "/checkin" ? (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-primary shadow-glow -mt-4">
                    <Icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                ) : (
                  <Icon
                    className={`h-5 w-5 transition-colors ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                )}
              </motion.div>
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                } ${tab.path === "/checkin" ? "mt-1" : ""}`}
              >
                {tab.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
