/* eslint-disable react-refresh/only-export-components */
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
  "discover.title": { en: "What’s the move for food today?", vi: "Hôm nay ăn gì cho \"vibe\"?" },
  "discover.search": { en: "Search restaurants, vibes...", vi: "Tìm nhà hàng, không gian..." },
  "discover.whatsYourVibe": { en: "What's your vibe?", vi: "Hôm nay bạn muốn gì?" },
  "discover.trendingNow": { en: "Trending Now 🔥", vi: "Đang hot 🔥" },
  "discover.nearYou": { en: "Near You 📍", vi: "Gần bạn 📍" },
  "discover.seeAll": { en: "See all", vi: "Xem tất cả" },
  "discover.noResults": { en: "No restaurants match your filters", vi: "Không tìm thấy nhà hàng phù hợp" },
  "discover.clearFilters": { en: "Clear all filters", vi: "Xóa bộ lọc" },
  "discover.aiTitle": { en: "Based on your vibe today…", vi: "Dựa trên tâm trạng hôm nay…" },
  "discover.aiSubtitle": { en: "Tell me your mood and I'll find the perfect spot!", vi: "Cho mình biết tâm trạng, mình tìm chỗ cho bạn!" },
  "discover.changeLocation": { en: "Change", vi: "Đổi" },
  "discover.useMyLocation": { en: "Use my location", vi: "Dùng vị trí của tôi" },
  "discover.detectingLocation": { en: "Detecting location...", vi: "Đang xác định vị trí..." },
  "discover.locationNotSupported": { en: "Location is not supported on this device", vi: "Thiết bị không hỗ trợ vị trí" },
  "discover.locationDenied": { en: "Location access denied. Please allow permission.", vi: "Bạn đã từ chối quyền vị trí. Vui lòng cấp quyền." },
  "discover.locationFallback": { en: "Could not detect location. You can choose manually.", vi: "Không thể xác định vị trí. Bạn có thể chọn thủ công." },
  "discover.currentLocation": { en: "Current area", vi: "Khu vực hiện tại" },
  "discover.location.d1": { en: "District 1, HCMC", vi: "Quận 1, TP.HCM" },
  "discover.location.thuduc": { en: "Thu Duc, HCMC", vi: "Thủ Đức, TP.HCM" },
  "discover.location.d3": { en: "District 3, HCMC", vi: "Quận 3, TP.HCM" },
  "discover.location.bt": { en: "Binh Thanh, HCMC", vi: "Bình Thạnh, TP.HCM" },
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
  "heatmap.liveCheckin": { en: "Live Check-in", vi: "Check-in realtime" },
  "heatmap.viewRestaurant": { en: "View Restaurant", vi: "Xem quán" },
  "heatmap.storyHint": { en: "Tap left/right to switch story", vi: "Chạm trái/phải để chuyển story" },

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
  "spin.keyword": { en: "Keyword", vi: "Từ khóa" },
  "spin.keywordPlaceholder": { en: "Type food, area, vibe...", vi: "Nhập món, khu vực, vibe..." },
  "spin.filters": { en: "Filters", vi: "Bộ lọc" },
  "spin.groupDining": { en: "Group dining", vi: "Đi ăn nhóm" },
  "spin.groupSize": { en: "Group size", vi: "Số người" },
  "spin.groupNeed": { en: "Member requirement", vi: "Yêu cầu thành viên" },
  "spin.addRequirement": { en: "Add member requirement", vi: "Thêm yêu cầu thành viên" },
  "spin.noMatch": { en: "No match with current filters. Try wider options.", vi: "Không có quán phù hợp bộ lọc hiện tại. Hãy nới rộng lựa chọn." },
  "spin.vibe.quiet": { en: "Quiet", vi: "Yên tĩnh" },
  "spin.vibe.romantic": { en: "Romantic", vi: "Lãng mạn" },
  "spin.vibe.aesthetic": { en: "Aesthetic", vi: "Đẹp" },
  "spin.vibe.lively": { en: "Lively", vi: "Sôi động" },
  "spin.vibe.cozy": { en: "Cozy", vi: "Ấm cúng" },
  "spin.vibe.group": { en: "Group-Friendly", vi: "Hợp nhóm" },
  "spin.vibe.study": { en: "Study-Friendly", vi: "Hợp học tập" },
  "spin.vibe.date": { en: "Date Night", vi: "Hẹn hò" },
  "spin.vibe.local": { en: "Local", vi: "Bản địa" },
  "spin.vibe.fun": { en: "Fun", vi: "Vui" },
  "spin.taste.nonspicy": { en: "Non-spicy", vi: "Không cay" },
  "spin.taste.spicy": { en: "Spicy", vi: "Cay" },
  "spin.taste.sweet": { en: "Sweet", vi: "Ngọt" },
  "spin.taste.authentic": { en: "Authentic", vi: "Chuẩn vị" },
  "spin.taste.insta": { en: "Instagrammable", vi: "Lên hình đẹp" },
  "spin.taste.budget": { en: "Budget-friendly", vi: "Tiết kiệm" },

  "profile.settingsTitle": { en: "Settings", vi: "Cài đặt" },
  "profile.editProfile": { en: "Edit profile", vi: "Chỉnh hồ sơ" },
  "profile.displayName": { en: "Display name", vi: "Tên hiển thị" },
  "profile.username": { en: "Username", vi: "Tên người dùng" },
  "profile.saveChanges": { en: "Save changes", vi: "Lưu thay đổi" },
  "profile.findFriends": { en: "Find friends", vi: "Tìm bạn bè" },
  "profile.searchFriendPlaceholder": { en: "Search by phone or username", vi: "Tìm theo số điện thoại hoặc username" },
  "profile.addFriend": { en: "Add friend", vi: "Kết bạn" },
  "profile.added": { en: "Added", vi: "Đã thêm" },
  "profile.addFriendsButton": { en: "Add Friends", vi: "Thêm bạn bè" },
  "profile.calendar": { en: "Calendar", vi: "Calendar" },
  "profile.anniversaries": { en: "Anniversaries", vi: "Kỉ niệm" },
  "profile.checkinHistory": { en: "Check-in History", vi: "Lịch sử check-in" },

  "friends.title": { en: "Add Friends", vi: "Thêm bạn bè" },
  "friends.searchPlaceholder": { en: "Search by phone or username", vi: "Tìm theo số điện thoại hoặc username" },
  "friends.suggested": { en: "Suggested Friends", vi: "Gợi ý bạn bè" },
  "friends.invite": { en: "Invite", vi: "Kết bạn" },
  "friends.invited": { en: "Invited", vi: "Đã mời" },

  "heatmap.back": { en: "Back", vi: "Trở về" },
  "heatmap.footprints": { en: "Footprints", vi: "Dấu chân" },
  "heatmap.favorites": { en: "Favorites", vi: "Yêu thích" },
  "heatmap.historyTitle": { en: "Check-in history", vi: "Lịch sử check-in" },
  "heatmap.friendView": { en: "Friend view", vi: "Xem theo bạn" },
  "heatmap.me": { en: "Me", vi: "Tôi" },
  "heatmap.privateJournal": { en: "Private journal", vi: "Nhật ký riêng tư" },
  "heatmap.photos": { en: "Photos", vi: "Ảnh" },
  "heatmap.noHistory": { en: "No history yet", vi: "Chưa có lịch sử" },
  "heatmap.allUsers": { en: "All", vi: "Tất cả" },
  "heatmap.withWho": { en: "With", vi: "Đi cùng" },
  "heatmap.visits": { en: "visits", vi: "lần ghé" },
  "heatmap.note": { en: "Note", vi: "Ghi chú" },
  "heatmap.messagePlaceholder": { en: "Send message...", vi: "Nhắn tin..." },
  "heatmap.mock.meCaption1": { en: "Morning coffee and planning sprint tasks.", vi: "Cà phê sáng và lên kế hoạch sprint." },
  "heatmap.mock.meCaption2": { en: "Late ramen run after work.", vi: "Ăn ramen muộn sau giờ làm." },
  "heatmap.mock.meJournal1": { en: "Kept things simple today. Needed a quiet place to reset.", vi: "Hôm nay mình cần một nơi yên tĩnh để reset." },
  "heatmap.mock.meJournal2": { en: "Great broth. Felt better after this meal.", vi: "Nước dùng rất ngon, ăn xong thấy đỡ mệt hơn." },
  "heatmap.mock.time1": { en: "2h ago", vi: "2 giờ trước" },
  "heatmap.mock.time2": { en: "Yesterday", vi: "Hôm qua" },

  // Moods
  "mood.study": { en: "Study", vi: "Học tập" },
  "mood.date": { en: "Date", vi: "Hẹn hò" },
  "mood.group": { en: "Group", vi: "Nhóm" },
  "mood.chill": { en: "Chill", vi: "Chill" },
  "mood.alone": { en: "Alone", vi: "Một mình" },

  // Heat Map
  "heatmap.searchPlaceholder": { en: "Where should we eat?", vi: "Hôm nay ăn gì?" },

  // Budget
  "budget.title": { en: "Food Budget", vi: "Ngân sách ăn uống" },
  "budget.spent": { en: "Spent", vi: "Đã chi" },
  "budget.alert": { en: "Spending alert: Near limit", vi: "Cảnh báo: Gần giới hạn" },
  "budget.monthlyProgress": { en: "Monthly Progress", vi: "Tiến độ tháng" },
  "budget.daysLeft": { en: "Days Left", vi: "Ngày còn lại" },
  "budget.remaining": { en: "remaining", vi: "còn lại" },
  "budget.days": { en: "Days", vi: "Ngày" },
  "budget.recentEats": { en: "Recent Eats", vi: "Gần đây" },
  "budget.viewAll": { en: "View All", vi: "Xem tất cả" },

  // User Profile
  "userProfile.places": { en: "Places", vi: "Địa điểm" },
  "userProfile.badges": { en: "Badges", vi: "Huy hiệu" },
  "userProfile.gourmetExplorer": { en: "Gourmet Explorer", vi: "Nhà thám hiểm ẩm thực" },
  "userProfile.toLevel": { en: "to Level", vi: "đến Level" },
  "userProfile.hallOfFame": { en: "Hall of Fame", vi: "Vinh danh" },
  "userProfile.viewAll": { en: "View All", vi: "Xem tất cả" },
  "userProfile.history": { en: "History", vi: "Lịch sử" },
  "userProfile.favSpots": { en: "Fav Spots", vi: "Yêu thích" },

  // Check-in modes
  "checkin.modeRestaurant": { en: "RESTAURANT", vi: "NHÀ HÀNG" },
  "checkin.modeCooking": { en: "HOME COOKING", vi: "NẤU ĂN" },
  "checkin.modeVibe": { en: "VIBE ONLY", vi: "KHÔNG GIAN" },
  "checkin.tagIngredients": { en: "Tag Ingredients", vi: "Gắn nguyên liệu" },
  "checkin.shareRecipe": { en: "Share Recipe", vi: "Chia sẻ công thức" },

  // Add Budget
  "addBudget.title": { en: "Add Expense", vi: "Thêm chi tiêu" },
  "addBudget.subtitle": { en: "Log your meal spending", vi: "Ghi lại chi tiêu bữa ăn" },
  "addBudget.amount": { en: "Amount", vi: "Số tiền" },
  "addBudget.category": { en: "Category", vi: "Danh mục" },
  "addBudget.where": { en: "Where did you eat?", vi: "Bạn ăn ở đâu?" },
  "addBudget.note": { en: "Note", vi: "Ghi chú" },
  "addBudget.notePlaceholder": { en: "What did you have? 🍜", vi: "Bạn ăn gì? 🍜" },
  "addBudget.save": { en: "Save Expense", vi: "Lưu chi tiêu" },
  "addBudget.saved": { en: "Expense Saved! ✅", vi: "Đã lưu! ✅" },
  "budget.addExpense": { en: "Add Expense", vi: "Thêm chi tiêu" },

  // Common
  "common.open": { en: "Open", vi: "Mở cửa" },
  "common.closed": { en: "Closed", vi: "Đóng cửa" },

  // Login/Auth
  "login.title": { en: "Welcome to MapVibe", vi: "Chào mừng đến MapVibe" },
  "login.subtitle": { en: "Discover restaurants with your vibe", vi: "Khám phá nhà hàng theo tâm trạng" },
  "login.email": { en: "Email", vi: "Email" },
  "login.emailPlaceholder": { en: "Enter your email", vi: "Nhập email của bạn" },
  "login.password": { en: "Password", vi: "Mật khẩu" },
  "login.passwordPlaceholder": { en: "Enter your password", vi: "Nhập mật khẩu" },
  "login.signIn": { en: "Sign In", vi: "Đăng nhập" },
  "login.signUp": { en: "Sign Up", vi: "Đăng ký" },
  "login.noAccount": { en: "Don't have an account?", vi: "Chưa có tài khoản?" },
  "login.alreadyHaveAccount": { en: "Already have an account?", vi: "Đã có tài khoản?" },
  "login.signUpSubtitle": { en: "Create your profile to start exploring", vi: "Tạo hồ sơ để bắt đầu khám phá" },
  "login.name": { en: "Full Name", vi: "Họ và tên" },
  "login.namePlaceholder": { en: "Enter your full name", vi: "Nhập họ và tên" },
  "login.signingIn": { en: "Signing in...", vi: "Đang đăng nhập..." },
  "login.signedIn": { en: "Welcome back! ✅", vi: "Chào mừng trở lại! ✅" },
  "login.demoMode": { en: "Demo Mode", vi: "Chế độ demo" },
  "login.useDemo": { en: "Use Demo Credentials", vi: "Dùng tài khoản demo" },

  // Onboarding
  "onboarding.skip": { en: "Skip", vi: "Bỏ qua" },
  "onboarding.continue": { en: "Continue", vi: "Tiếp tục" },
  "onboarding.finish": { en: "Finish", vi: "Hoàn tất" },

  "onboarding.step1.title": { en: "What cuisine do you like?", vi: "Bạn thích ẩm thực nào?" },
  "onboarding.step1.subtitle": { en: "Pick cuisines you enjoy the most", vi: "Chọn các loại ẩm thực yêu thích của bạn" },
  "onboarding.cuisine.vn": { en: "Vietnamese", vi: "Việt Nam" },
  "onboarding.cuisine.jp": { en: "Japanese", vi: "Nhật Bản" },
  "onboarding.cuisine.kr": { en: "Korean", vi: "Hàn Quốc" },
  "onboarding.cuisine.it": { en: "Italian", vi: "Ý" },
  "onboarding.cuisine.mx": { en: "Mexican", vi: "Mexico" },
  "onboarding.cuisine.th": { en: "Thai", vi: "Thái Lan" },
  "onboarding.cuisine.cn": { en: "Chinese", vi: "Trung Hoa" },
  "onboarding.cuisine.bbq": { en: "BBQ / Grilled", vi: "BBQ / Nướng" },
  "onboarding.cuisine.dessert": { en: "Bakery & Dessert", vi: "Bánh & Dessert" },

  "onboarding.step2.title": { en: "Any allergies?", vi: "Bạn có dị ứng gì không?" },
  "onboarding.step2.subtitle": { en: "We will hide dishes that do not fit you", vi: "Chúng tôi sẽ lọc bỏ những món không phù hợp" },
  "onboarding.allergy.peanut": { en: "Peanuts", vi: "Đậu phộng" },
  "onboarding.allergy.seafood": { en: "Seafood", vi: "Hải sản" },
  "onboarding.allergy.dairy": { en: "Dairy / Lactose", vi: "Sữa / Lactose" },
  "onboarding.allergy.gluten": { en: "Gluten", vi: "Gluten" },
  "onboarding.allergy.egg": { en: "Eggs", vi: "Trứng" },
  "onboarding.allergy.soy": { en: "Soy", vi: "Đậu nành" },
  "onboarding.allergy.none": { en: "None", vi: "Không có" },

  "onboarding.step3.title": { en: "What restaurant vibe do you prefer?", vi: "Vibe quán bạn thích?" },
  "onboarding.step3.subtitle": { en: "Help us understand your style", vi: "Giúp chúng tôi hiểu gu thẩm mỹ của bạn" },
  "onboarding.vibe.green": { en: "Green & Natural", vi: "Xanh & Tự nhiên" },
  "onboarding.vibe.romantic": { en: "Romantic", vi: "Lãng mạn" },
  "onboarding.vibe.rooftop": { en: "Rooftop / Nice View", vi: "Rooftop / View đẹp" },
  "onboarding.vibe.study": { en: "Quiet / Study", vi: "Yên tĩnh / Học tập" },
  "onboarding.vibe.live": { en: "Live Music", vi: "Nhạc sống" },
  "onboarding.vibe.family": { en: "Family Friendly", vi: "Gia đình" },
  "onboarding.vibe.art": { en: "Artistic / Creative", vi: "Nghệ thuật / Sáng tạo" },
  "onboarding.vibe.fast": { en: "Fast & Convenient", vi: "Nhanh & Tiện" },

  "onboarding.step4.title": { en: "Your daily budget?", vi: "Ngân sách thường ngày?" },
  "onboarding.step4.subtitle": { en: "So recommendations fit your budget", vi: "Để gợi ý phù hợp với túi tiền" },
  "onboarding.budget.low": { en: "Under 50K", vi: "Dưới 50K" },
  "onboarding.budget.mid": { en: "50K - 150K", vi: "50K - 150K" },
  "onboarding.budget.high": { en: "150K - 500K", vi: "150K - 500K" },
  "onboarding.budget.premium": { en: "Above 500K", vi: "Trên 500K" },

  // Restaurant Reviews
  "restaurant.reviews": { en: "Reviews", vi: "Đánh giá" },
  "restaurant.allReviews": { en: "All Reviews", vi: "Tất cả đánh giá" },
  "restaurant.noReviews": { en: "No reviews yet", vi: "Chưa có đánh giá" },
  "restaurant.writeReview": { en: "Write a Review", vi: "Viết đánh giá" },
  "restaurant.rating": { en: "Rating", vi: "Đánh giá" },
  "restaurant.outOf5": { en: "out of 5", vi: "trên 5" },
  "restaurant.verified": { en: "Verified Check-in", vi: "Check-in đã xác minh" },
  "restaurant.helpful": { en: "Helpful", vi: "Hữu ích" },
  "restaurant.helpful_one": { en: "1 found this helpful", vi: "1 người thấy hữu ích" },
  "restaurant.helpful_many": { en: "found this helpful", vi: "người thấy hữu ích" },

  // Directions/Navigation
  "nav.getDirections": { en: "Get Directions", vi: "Chỉ đường" },
  "nav.openMaps": { en: "Open in Maps", vi: "Mở trong Maps" },
  "nav.shareLocation": { en: "Share Location", vi: "Chia sẻ vị trí" },
  "nav.location_copied": { en: "Location copied to clipboard", vi: "Vị trí đã được sao chép" },

  // Booking
  "booking.reservationConfirmed": { en: "Reservation Confirmed", vi: "Đặt bàn thành công" },
  "booking.guests": { en: "guests", vi: "khách" },
  "booking.guest": { en: "guest", vi: "khách" },
  "booking.estimatedSpend": { en: "Estimated Spend", vi: "Chi tiêu dự kiến" },
  "booking.seating": { en: "Seating", vi: "Chỗ ngồi" },
  "booking.occasion": { en: "Occasion", vi: "Dịp" },
  "booking.notes": { en: "Special Requests", vi: "Yêu cầu đặc biệt" },
  "booking.date": { en: "Date", vi: "Ngày" },
  "booking.time": { en: "Time", vi: "Giờ" },
  "booking.partySize": { en: "Party Size", vi: "Số lượng khách" },
  "booking.indoor": { en: "Indoor", vi: "Trong nhà" },
  "booking.outdoor": { en: "Outdoor", vi: "Ngoài trời" },
  "booking.confirmBooking": { en: "Confirm Booking", vi: "Xác nhận đặt bàn" },
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
