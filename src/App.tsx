import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import BottomNav from "@/components/BottomNav";
import DiscoverPage from "@/pages/DiscoverPage";
import FeedPage from "@/pages/FeedPage";
import AISearchPage from "@/pages/AISearchPage";
import CheckInPage from "@/pages/CheckInPage";
import HeatMapPage from "@/pages/TrendingPage";
import ProfilePage from "@/pages/ProfilePage";
import BudgetPage from "@/pages/BudgetPage";
import AddBudgetPage from "@/pages/AddBudgetPage";
import UserProfilePage from "@/pages/UserProfilePage";
import RestaurantDetailPage from "@/pages/RestaurantDetailPage";
import SpinPage from "@/pages/SpinPage";
import LoginPage from "@/pages/LoginPage";
import OnboardingPage from "@/pages/Onboarding";
import AddFriendsPage from "@/pages/AddFriendsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="mx-auto max-w-lg min-h-screen bg-background relative">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/discover" element={<DiscoverPage />} />
              <Route path="/ai" element={<AISearchPage />} />
              <Route path="/feed" element={<FeedPage />} />
              <Route path="/checkin" element={<CheckInPage />} />
              <Route path="/trending" element={<HeatMapPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/budget" element={<BudgetPage />} />
              <Route path="/add-budget" element={<AddBudgetPage />} />
              <Route path="/user-profile" element={<UserProfilePage />} />
              <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />
              <Route path="/spin" element={<SpinPage />} />
              <Route path="/friends/add" element={<AddFriendsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <BottomNav />
          </div>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
