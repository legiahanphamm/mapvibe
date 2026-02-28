import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import DiscoverPage from "@/pages/DiscoverPage";
import AISearchPage from "@/pages/AISearchPage";
import CheckInPage from "@/pages/CheckInPage";
import TrendingPage from "@/pages/TrendingPage";
import ProfilePage from "@/pages/ProfilePage";
import RestaurantDetailPage from "@/pages/RestaurantDetailPage";
import SpinPage from "@/pages/SpinPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="mx-auto max-w-lg min-h-screen bg-background relative">
          <Routes>
            <Route path="/" element={<DiscoverPage />} />
            <Route path="/ai" element={<AISearchPage />} />
            <Route path="/checkin" element={<CheckInPage />} />
            <Route path="/trending" element={<TrendingPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />
            <Route path="/spin" element={<SpinPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BottomNav />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
