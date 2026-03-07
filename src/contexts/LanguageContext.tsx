import { createContext, useContext, useState, ReactNode } from "react";

export type Language = "en" | "vi";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  // Bottom Nav
  "nav.discover": { en: "Discover", vi: "Khám phá" },
  "nav.feed": { en: "Feed", vi: "Bảng tin" },
  "nav.checkin": { en: "Check-in", vi: "Check-in" },
  "nav.heatmap": { en: "Heat Map", vi: "Bản đồ" },
  "nav.profile": { en: "Profile", vi: "Cá nhân" },

  // Discover
  "discover.title": { en: "Discover", vi: "Khám phá" },
  "discover.search": { en: "Search restaurants, vibes...", vi: "Tìm nhà hàng, không gian..." },
  "discover.whatsYourVibe": { en: "What's your vibe?", vi: "Hôm nay bạn muốn gì?" },
  "discover.trendingNow": { en: "Trending Now 🔥", vi: "Đang hot 🔥" },
  "discover.nearYou": { en: "Near You 📍", vi: "Gần bạn 📍" },
  "discover.seeAll": { en: "See all", vi: "Xem tất cả" },
  "discover.noResults": { en: "No restaurants match your filters", vi: "Không tìm thấy nhà hàng phù hợp" },
  "discover.clearFilters": { en: "Clear all filters", vi: "Xóa bộ lọc" },
  "discover.aiTitle": { en: "Based on your vibe today…", vi: "Dựa trên tâm trạng hôm nay…" },
  "discover.aiSubtitle": { en: "Tell me your mood and I'll find the perfect spot!", vi: "Cho mình biết tâm trạng, mình tìm chỗ cho bạn!" },
  "discover.priceRange": { en: "Price Range", vi: "Mức giá" },
  "discover.vibe": { en: "Vibe", vi: "Không gian" },
  "discover.sentiment": { en: "Sentiment", vi: "Cảm nhận" },
  "discover.found": { en: "found", vi: "tìm thấy" },
  "discover.restaurant": { en: "restaurant", vi: "nhà hàng" },
  "discover.restaurants": { en: "restaurants", vi: "nhà hàng" },

  // Feed
  "feed.title": { en: "Feed", vi: "Bảng tin" },
  "feed.myCheckins": { en: "My Check-ins", vi: "Check-in của tôi" },
  "feed.cooking": { en: "Cooking", vi: "Nấu ăn" },
  "feed.eatOut": { en: "Eat Out", vi: "Ăn ngoài" },
  "feed.dineOut": { en: "Dine Out", vi: "Nhà hàng" },
  "feed.with": { en: "with", vi: "cùng" },

  // Check-in
  "checkin.title": { en: "Check In 📸", vi: "Check In 📸" },
  "checkin.subtitle": { en: "Share your food moment", vi: "Chia sẻ khoảnh khắc ẩm thực" },
  "checkin.tapToCapture": { en: "Tap to capture", vi: "Chạm để chụp" },
  "checkin.takePhoto": { en: "Take a photo of your meal", vi: "Chụp ảnh món ăn của bạn" },
  "checkin.addCaption": { en: "Add a caption... ✨", vi: "Thêm mô tả... ✨" },
  "checkin.addMood": { en: "Add a mood", vi: "Thêm tâm trạng" },
  "checkin.tagFriends": { en: "Tag friends", vi: "Gắn thẻ bạn bè" },
  "checkin.addLocation": { en: "Add location", vi: "Thêm vị trí" },
  "checkin.post": { en: "Post Check-In", vi: "Đăng Check-In" },

  // Heat Map
  "heatmap.title": { en: "Heat Map", vi: "Bản đồ nhiệt" },
  "heatmap.subtitle": { en: "Friends' check-ins near you", vi: "Check-in của bạn bè gần đây" },
  "heatmap.today": { en: "Today", vi: "Hôm nay" },
  "heatmap.thisWeek": { en: "This Week", vi: "Tuần này" },
  "heatmap.allTime": { en: "All Time", vi: "Tất cả" },
  "heatmap.hottest": { en: "Hottest Right Now", vi: "Nóng nhất" },
  "heatmap.checkins": { en: "check-ins", vi: "check-in" },
  "heatmap.friends": { en: "friends", vi: "bạn bè" },

  // Profile
  "profile.title": { en: "Profile", vi: "Cá nhân" },
  "profile.checkins": { en: "Check-ins", vi: "Check-in" },
  "profile.dayStreak": { en: "Day Streak", vi: "Chuỗi ngày" },
  "profile.friends": { en: "Friends", vi: "Bạn bè" },
  "profile.badges": { en: "Badges", vi: "Huy hiệu" },
  "profile.thisWeek": { en: "This Week", vi: "Tuần này" },
  "profile.monthlyBudget": { en: "Monthly Budget", vi: "Ngân sách tháng" },
  "profile.favorites": { en: "Favorites", vi: "Yêu thích" },
  "profile.eatingPrefs": { en: "Eating Preferences", vi: "Sở thích ăn uống" },
  "profile.language": { en: "Language", vi: "Ngôn ngữ" },

  // Restaurant Detail
  "detail.friendsReviews": { en: "Friends' Reviews", vi: "Đánh giá bạn bè" },
  "detail.friendsBeenHere": { en: "Friends who've been here", vi: "Bạn bè đã đến" },
  "detail.popularMenu": { en: "Popular Menu", vi: "Menu phổ biến" },
  "detail.location": { en: "Location", vi: "Vị trí" },
  "detail.checkIn": { en: "Check In", vi: "Check In" },
  "detail.bookTable": { en: "Book Table", vi: "Đặt bàn" },

  // AI Search
  "ai.title": { en: "AI Search", vi: "Tìm kiếm AI" },
  "ai.subtitle": { en: "Price · Vibe · Sentiment aware", vi: "Giá · Không gian · Cảm nhận" },
  "ai.placeholder": { en: "Describe your ideal spot...", vi: "Mô tả quán lý tưởng..." },
  "ai.greeting": {
    en: "Hey! 👋 I'm your food AI. Tell me what you're craving — **budget, vibe, location, food type, spice level** — and I'll find the perfect spot!\n\nYou can also use the quick filters below 👇",
    vi: "Xin chào! 👋 Mình là AI ẩm thực. Cho mình biết bạn muốn gì — **ngân sách, không gian, vị trí, loại đồ ăn, độ cay** — mình sẽ tìm chỗ hoàn hảo!\n\nBạn cũng có thể dùng bộ lọc bên dưới 👇",
  },
  "ai.tryAsking": { en: "Try asking:", vi: "Thử hỏi:" },
  "ai.refine": { en: "Want to refine? Try:", vi: "Muốn tìm thêm? Thử:" },
  "ai.personalizedTitle": { en: "✨ Personalized for you", vi: "✨ Gợi ý cho bạn" },
  "ai.personalizedDesc": { en: "Based on your eating preferences:", vi: "Dựa trên sở thích ăn uống:" },
  "ai.groupTitle": { en: "👥 Group Suggest", vi: "👥 Gợi ý nhóm" },
  "ai.groupDesc": { en: "Find spots everyone will love", vi: "Tìm chỗ cả nhóm thích" },
  "ai.groupPlaceholder": { en: "What does each person want?", vi: "Mỗi người muốn gì?" },
  "ai.addMember": { en: "Add member preference", vi: "Thêm sở thích thành viên" },
  "ai.findForGroup": { en: "Find for group", vi: "Tìm cho nhóm" },
  "ai.modePersonal": { en: "For You", vi: "Cho bạn" },
  "ai.modeGroup": { en: "Group", vi: "Nhóm" },
  "ai.modeSearch": { en: "Search", vi: "Tìm kiếm" },

  // Spin
  "spin.title": { en: "Random Pick 🎰", vi: "Chọn ngẫu nhiên 🎰" },
  "spin.subtitle": { en: "Can't decide? Let the wheel choose for you!", vi: "Không quyết định được? Để vòng quay chọn cho bạn!" },
  "spin.spinning": { en: "Spinning...", vi: "Đang quay..." },
  "spin.spin": { en: "Spin!", vi: "Quay!" },
  "spin.youGot": { en: "🎉 You got:", vi: "🎉 Bạn được:" },
  "spin.shareWithFriends": { en: "Share with friends", vi: "Chia sẻ với bạn bè" },

  // Moods
  "mood.study": { en: "Study", vi: "Học tập" },
  "mood.date": { en: "Date", vi: "Hẹn hò" },
  "mood.group": { en: "Group", vi: "Nhóm" },
  "mood.chill": { en: "Chill", vi: "Chill" },
  "mood.alone": { en: "Alone", vi: "Một mình" },

  // Common
  "common.open": { en: "Open", vi: "Mở cửa" },
  "common.closed": { en: "Closed", vi: "Đóng cửa" },
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: (key: string) => key,
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem("app-language");
    return (saved === "vi" ? "vi" : "en") as Language;
  });

  const handleSetLang = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem("app-language", newLang);
  };

  const t = (key: string): string => {
    return translations[key]?.[lang] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: handleSetLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
