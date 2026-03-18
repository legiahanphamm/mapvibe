import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Compass, Rss, Camera, Flame, User } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const BottomNav = () => {
  const location = useLocation();
  const { t } = useLanguage();

  const tabs = [
    { path: "/", icon: Compass, labelKey: "nav.discover" },
    { path: "/feed", icon: Rss, labelKey: "nav.feed" },
    { path: "/checkin", icon: Camera, labelKey: "nav.checkin" },
    { path: "/trending", icon: Flame, labelKey: "nav.heatmap" },
    { path: "/profile", icon: User, labelKey: "nav.profile" },
  ];

  if (location.pathname.startsWith("/restaurant/") || location.pathname === "/onboarding") return null;

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
                {t(tab.labelKey)}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
