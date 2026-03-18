import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Sparkles, SlidersHorizontal, X, Users, User, Search } from "lucide-react";
import { restaurants, Restaurant, userProfile } from "@/data/mockData";
import RestaurantCard from "@/components/RestaurantCard";
import ReactMarkdown from "react-markdown";
import { useLanguage } from "@/contexts/LanguageContext";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  restaurants?: Restaurant[];
  isTyping?: boolean;
}

type AIMode = "search" | "personal" | "group";

interface GroupMember {
  id: string;
  name: string;
  preferences: string;
}

const suggestedPrompts = {
  en: [
    "100k budget, near District 1, quiet place",
    "Date night, romantic, under 500k for 2",
    "Study café with fast wifi",
    "Group dinner for 6, Korean BBQ",
    "Non-spicy food, aesthetic vibes",
    "Best street food under 50k",
  ],
  vi: [
    "Ngân sách 100k, gần Quận 1, yên tĩnh",
    "Hẹn hò lãng mạn, dưới 500k cho 2 người",
    "Quán café học bài, wifi nhanh",
    "Ăn nhóm 6 người, BBQ Hàn Quốc",
    "Đồ ăn không cay, không gian đẹp",
    "Ăn vặt ngon dưới 50k",
  ],
};

const quickFilters = [
  { label: "Budget", labelVi: "Ngân sách", icon: "💰", options: ["Under 50k", "50k-100k", "100k-300k", "300k+"] },
  { label: "Vibe", labelVi: "Không gian", icon: "✨", options: ["Quiet", "Romantic", "Lively", "Aesthetic", "Cozy"] },
  { label: "Sentiment", labelVi: "Cảm nhận", icon: "🎯", options: ["Non-spicy", "Spicy", "Sweet", "Authentic", "Instagrammable"] },
];

function scoreRestaurant(r: Restaurant, query: string): number {
  const q = query.toLowerCase();
  let score = 0;

  if (r.name.toLowerCase().includes(q)) score += 10;
  if (r.category.toLowerCase().includes(q)) score += 8;

  const categoryKeywords: Record<string, string[]> = {
    "Café": ["café", "cafe", "coffee", "study", "wifi", "cà phê", "học bài"],
    "BBQ": ["bbq", "grill", "meat", "korean bbq", "nướng", "thịt"],
    "Japanese": ["japanese", "ramen", "sushi", "gyoza", "nhật", "mì"],
    "Vietnamese": ["vietnamese", "pho", "bun", "local", "việt", "phở", "bún"],
    "Italian": ["italian", "pasta", "wine", "pizza", "ý"],
    "Korean": ["korean", "bibimbap", "kimchi", "soju", "hàn"],
    "Street Food": ["street", "cheap", "budget", "local", "vỉa hè", "ăn vặt", "rẻ"],
    "Dessert": ["dessert", "sweet", "ice cream", "gelato", "tráng miệng", "ngọt"],
    "Thai": ["thai", "pad thai", "curry", "thái"],
  };

  for (const [cat, keywords] of Object.entries(categoryKeywords)) {
    if (r.category === cat && keywords.some(kw => q.includes(kw))) score += 6;
  }

  r.vibes.forEach(v => { if (q.includes(v.toLowerCase())) score += 5; });
  r.friendFeedback.forEach(fb => {
    fb.vibes.forEach(v => { if (q.includes(v.toLowerCase())) score += 3; });
  });

  const budgetMatch = q.match(/(\d+)k/);
  if (budgetMatch) {
    const budget = parseInt(budgetMatch[1]) * 1000;
    const avgPrice = r.menu.reduce((sum, item) => sum + parseInt(item.price.replace("k", "")) * 1000, 0) / r.menu.length;
    if (avgPrice <= budget) score += 4;
  }

  if (q.includes("cheap") || q.includes("budget") || q.includes("rẻ") || q.includes("ngân sách")) {
    if (r.priceRange === "$") score += 5;
    if (r.priceRange === "$$") score += 2;
  }
  if (q.includes("fancy") || q.includes("luxury") || q.includes("sang")) {
    if (r.priceRange === "$$$$") score += 5;
    if (r.priceRange === "$$$") score += 3;
  }

  if (q.includes("date") || q.includes("romantic") || q.includes("hẹn hò") || q.includes("lãng mạn")) {
    if (r.vibes.some(v => ["Romantic", "Aesthetic", "Date Night", "Cozy"].includes(v))) score += 5;
  }
  if (q.includes("study") || q.includes("work") || q.includes("học") || q.includes("làm việc")) {
    if (r.vibes.some(v => ["Quiet", "Study-Friendly"].includes(v))) score += 5;
  }
  if (q.includes("group") || q.includes("friends") || q.includes("nhóm") || q.includes("bạn bè")) {
    if (r.vibes.some(v => ["Group-Friendly", "Lively", "Fun"].includes(v))) score += 5;
  }
  if (q.includes("quiet") || q.includes("chill") || q.includes("yên tĩnh")) {
    if (r.vibes.some(v => ["Quiet", "Cozy"].includes(v))) score += 5;
  }
  if (q.includes("non-spicy") || q.includes("not spicy") || q.includes("không cay")) {
    if (r.friendFeedback.some(fb => fb.vibes.some(v => v.toLowerCase().includes("non-spicy")))) score += 6;
  }
  if (q.includes("near") || q.includes("close") || q.includes("gần")) {
    const dist = parseFloat(r.distance);
    if (dist < 1) score += 4;
    if (dist < 0.5) score += 3;
  }

  score += r.rating;
  return score;
}

function generateAIResponse(query: string, matched: Restaurant[], lang: "en" | "vi"): string {
  const q = query.toLowerCase();

  if (matched.length === 0) {
    return lang === "vi"
      ? "Hmm, mình không tìm thấy kết quả phù hợp 😅 Thử điều chỉnh bộ lọc hoặc mô tả khác nhé!"
      : "Hmm, I couldn't find an exact match 😅 Try adjusting your filters or describe what you're looking for differently!";
  }

  const intros: Record<string, Record<string, string>> = {
    date: { en: "Aww, planning something special? 💕 Here are the most romantic spots:", vi: "Ôi, đang lên kế hoạch gì đặc biệt hả? 💕 Đây là những chỗ lãng mạn nhất:" },
    study: { en: "Productivity mode activated! 📚 Great wifi and chill atmosphere:", vi: "Chế độ học bài ON! 📚 Wifi tốt, không gian yên tĩnh:" },
    group: { en: "Squad goals! 👥 Perfect for groups:", vi: "Đi nhóm! 👥 Hoàn hảo cho cả hội:" },
    budget: { en: "Smart choice, saving while eating well! 💰", vi: "Lựa chọn thông minh, tiết kiệm mà vẫn ngon! 💰" },
    spicy: { en: "Bringing the heat! 🌶️", vi: "Cay nóng lên! 🌶️" },
    nonspicy: { en: "Keeping it mild! 🌿", vi: "Không cay, yên tâm! 🌿" },
    aesthetic: { en: "Camera ready? 📸 These places are gorgeous:", vi: "Sẵn sàng chụp ảnh? 📸 Mấy chỗ này đẹp lắm:" },
  };

  let intro = lang === "vi"
    ? `Tuyệt vời! 🎯 Dựa trên **"${query}"**, đây là gợi ý:`
    : `Great taste! 🎯 Based on **"${query}"**, here are my top picks:`;

  for (const [key, triggers] of [
    ["date", ["date", "romantic", "hẹn hò", "lãng mạn"]],
    ["study", ["study", "wifi", "work", "học"]],
    ["group", ["group", "friends", "nhóm"]],
    ["budget", ["cheap", "budget", "rẻ"]],
    ["spicy", ["spicy"]],
    ["nonspicy", ["non-spicy", "không cay"]],
    ["aesthetic", ["aesthetic", "instagram", "đẹp"]],
  ] as [string, string[]][]) {
    if (triggers.some(t => q.includes(t))) {
      intro = intros[key]?.[lang] || intro;
      break;
    }
  }

  const details = matched.map((r, i) =>
    `${i + 1}. **${r.name}** — ${r.category} · ${r.priceRange} · ${r.distance}\n   _${r.vibes.join(", ")}_`
  ).join("\n");

  const friendNote = matched.some(r => r.friendFeedback.length > 0)
    ? lang === "vi"
      ? "\n\n💬 *Bạn bè đã đến mấy chỗ này — xem đánh giá của họ!*"
      : "\n\n💬 *Some of your friends have been to these places — check their reviews!*"
    : "";

  return `${intro}\n\n${details}${friendNote}`;
}

function generateGroupResponse(members: GroupMember[], matched: Restaurant[], lang: "en" | "vi"): string {
  if (matched.length === 0) {
    return lang === "vi"
      ? "Không tìm thấy chỗ nào phù hợp cho cả nhóm 😅 Thử điều chỉnh sở thích nhé!"
      : "Couldn't find a spot that works for everyone 😅 Try adjusting preferences!";
  }

  const header = lang === "vi"
    ? `🎯 **Gợi ý cho nhóm ${members.length} người:**\n\n`
    : `🎯 **Group suggestion for ${members.length} people:**\n\n`;

  const memberSummary = members.map(m =>
    `- **${m.name}**: ${m.preferences}`
  ).join("\n");

  const picks = matched.map((r, i) =>
    `${i + 1}. **${r.name}** — ${r.category} · ${r.priceRange} · ${r.distance}\n   _${r.vibes.join(", ")}_`
  ).join("\n");

  const whyText = lang === "vi"
    ? "\n\n✅ Những chỗ này phù hợp nhất với sở thích của cả nhóm!"
    : "\n\n✅ These spots best match everyone's preferences!";

  return `${header}${memberSummary}\n\n---\n\n${picks}${whyText}`;
}

function getFollowUpPrompts(query: string, lang: "en" | "vi"): string[] {
  const q = query.toLowerCase();
  const prompts: string[] = [];

  const items = lang === "vi" ? [
    [!q.match(/\d+k/), "Dưới 100k thôi"],
    [!q.includes("romantic") && !q.includes("lãng mạn"), "Lãng mạn & yên tĩnh hơn"],
    [!q.includes("group") && !q.includes("nhóm"), "Phù hợp nhóm 5+ người"],
    [!q.includes("non-spicy") && !q.includes("không cay"), "Chỉ đồ không cay"],
    [!q.includes("near") && !q.includes("gần"), "Gần hơn, trong 1km"],
    [!q.includes("aesthetic") && !q.includes("đẹp"), "Chỗ nào đẹp nhất?"],
  ] : [
    [!q.match(/\d+k/), "Same but under 100k budget"],
    [!q.includes("romantic"), "Something more romantic & quiet"],
    [!q.includes("group"), "Good for a group of 5+"],
    [!q.includes("non-spicy"), "Only non-spicy options please"],
    [!q.includes("near"), "Closer to me, within 1km"],
    [!q.includes("aesthetic"), "Most Instagrammable spot?"],
  ];

  for (const [cond, prompt] of items) {
    if (cond) prompts.push(prompt as string);
    if (prompts.length >= 3) break;
  }
  return prompts;
}

function getPersonalizedSuggestions(lang: "en" | "vi"): string[] {
  const prefs = userProfile.eatingPrefs;
  const favIds = userProfile.favoriteRestaurants;
  const favRestaurants = restaurants.filter(r => favIds.includes(r.id));
  const favCategories = [...new Set(favRestaurants.map(r => r.category))];
  const favVibes = [...new Set(favRestaurants.flatMap(r => r.vibes))].slice(0, 3);

  if (lang === "vi") {
    return [
      prefs.length > 0 ? `Quán ${prefs[0]} ngon gần đây` : "Quán ngon gần đây",
      favVibes.length > 0 ? `Chỗ ${favVibes[0].toLowerCase()} cho tối nay` : "Chỗ yên tĩnh tối nay",
      favCategories.length > 0 ? `${favCategories[0]} mới, giống quán yêu thích` : "Thử quán mới",
      `Ngân sách dưới ${Math.round(userProfile.monthlyBudget / userProfile.weeklyCheckins.reduce((a, b) => a + b, 0) / 1000)}k/bữa`,
    ].slice(0, 4);
  }

  return [
    prefs.length > 0 ? `Best ${prefs[0]} spot nearby` : "Best spot nearby",
    favVibes.length > 0 ? `${favVibes[0]} place for tonight` : "Quiet place for tonight",
    favCategories.length > 0 ? `New ${favCategories[0]}, similar to my favorites` : "Try something new",
    `Budget under ${Math.round(userProfile.monthlyBudget / userProfile.weeklyCheckins.reduce((a, b) => a + b, 0) / 1000)}k/meal`,
  ].slice(0, 4);
}

const AISearchPage = () => {
  const { lang, t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "assistant", content: t("ai.greeting") },
  ]);
  const [input, setInput] = useState("");
  const [activeQuickFilters, setActiveQuickFilters] = useState<string[]>([]);
  const [showQuickFilters, setShowQuickFilters] = useState(false);
  const [aiMode, setAiMode] = useState<AIMode>("search");
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([
    { id: "1", name: lang === "vi" ? "Tôi" : "Me", preferences: "" },
    { id: "2", name: lang === "vi" ? "Bạn 1" : "Friend 1", preferences: "" },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Reset greeting when language changes
  useEffect(() => {
    setMessages([{ id: "1", role: "assistant", content: t("ai.greeting") }]);
  }, [lang]);

  const handleSend = (text?: string) => {
    const filterContext = activeQuickFilters.length > 0
      ? ` [Filters: ${activeQuickFilters.join(", ")}]`
      : "";
    const msg = (text || input) + filterContext;
    if (!msg.trim()) return;

    const displayMsg = text || input;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: displayMsg };

    const scored = restaurants
      .map(r => ({ restaurant: r, score: scoreRestaurant(r, msg) }))
      .sort((a, b) => b.score - a.score);

    const topMatches = scored.slice(0, 3).filter(s => s.score > 3).map(s => s.restaurant);
    const fallback = topMatches.length === 0 ? scored.slice(0, 2).map(s => s.restaurant) : topMatches;

    const aiContent = generateAIResponse(displayMsg, fallback, lang);

    const typingMsg: Message = { id: (Date.now() + 1).toString(), role: "assistant", content: "", isTyping: true };
    const aiMsg: Message = { id: (Date.now() + 2).toString(), role: "assistant", content: aiContent, restaurants: fallback };

    setMessages(prev => [...prev, userMsg, typingMsg]);
    setInput("");
    setActiveQuickFilters([]);

    setTimeout(() => {
      setMessages(prev => [...prev.filter(m => !m.isTyping), aiMsg]);
    }, 800);
  };

  const handleGroupSearch = () => {
    const filledMembers = groupMembers.filter(m => m.preferences.trim());
    if (filledMembers.length === 0) return;

    const combinedQuery = filledMembers.map(m => m.preferences).join(" ");
    const userContent = filledMembers.map(m => `**${m.name}**: ${m.preferences}`).join("\n");

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: `👥 ${lang === "vi" ? "Tìm cho nhóm" : "Group search"}:\n${userContent}`,
    };

    // Score by intersection of all members' preferences
    const scored = restaurants.map(r => {
      let totalScore = 0;
      filledMembers.forEach(m => { totalScore += scoreRestaurant(r, m.preferences); });
      return { restaurant: r, score: totalScore / filledMembers.length };
    }).sort((a, b) => b.score - a.score);

    const topMatches = scored.slice(0, 3).filter(s => s.score > 3).map(s => s.restaurant);
    const fallback = topMatches.length === 0 ? scored.slice(0, 2).map(s => s.restaurant) : topMatches;

    const aiContent = generateGroupResponse(filledMembers, fallback, lang);
    const typingMsg: Message = { id: (Date.now() + 1).toString(), role: "assistant", content: "", isTyping: true };
    const aiMsg: Message = { id: (Date.now() + 2).toString(), role: "assistant", content: aiContent, restaurants: fallback };

    setMessages(prev => [...prev, userMsg, typingMsg]);

    setTimeout(() => {
      setMessages(prev => [...prev.filter(m => !m.isTyping), aiMsg]);
    }, 1000);
  };

  const toggleQuickFilter = (option: string) => {
    setActiveQuickFilters(prev =>
      prev.includes(option) ? prev.filter(f => f !== option) : [...prev, option]
    );
  };

  const addGroupMember = () => {
    const num = groupMembers.length;
    setGroupMembers(prev => [...prev, {
      id: Date.now().toString(),
      name: lang === "vi" ? `Bạn ${num}` : `Friend ${num}`,
      preferences: "",
    }]);
  };

  const removeGroupMember = (id: string) => {
    if (groupMembers.length <= 2) return;
    setGroupMembers(prev => prev.filter(m => m.id !== id));
  };

  const latestFollowUps = (() => {
    const lastUserMsg = [...messages].reverse().find(m => m.role === "user");
    if (!lastUserMsg) return [];
    return getFollowUpPrompts(lastUserMsg.content, lang);
  })();

  const personalizedSuggestions = getPersonalizedSuggestions(lang);

  return (
    <div className="flex min-h-screen flex-col safe-bottom">
      {/* Header */}
      <div className="px-5 pt-14 pb-3 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-hero">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold">{t("ai.title")}</h1>
              <p className="text-[10px] text-muted-foreground">{t("ai.subtitle")}</p>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowQuickFilters(!showQuickFilters)}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
              showQuickFilters || activeQuickFilters.length > 0 ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
          </motion.button>
        </div>

        {/* Mode Tabs */}
        <div className="flex gap-1.5 mt-3 rounded-full bg-muted p-1 w-fit">
          {(["search", "personal", "group"] as AIMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => setAiMode(mode)}
              className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-medium transition-all ${
                aiMode === mode
                  ? "gradient-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              {mode === "search" && <Search className="h-3 w-3" />}
              {mode === "personal" && <User className="h-3 w-3" />}
              {mode === "group" && <Users className="h-3 w-3" />}
              {t(`ai.mode${mode.charAt(0).toUpperCase() + mode.slice(1)}` as any)}
            </button>
          ))}
        </div>

        {/* Quick Filters */}
        <AnimatePresence>
          {showQuickFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mt-3"
            >
              {quickFilters.map((group) => (
                <div key={group.label} className="mb-2">
                  <p className="text-[10px] font-semibold text-muted-foreground mb-1">
                    {group.icon} {lang === "vi" ? group.labelVi : group.label}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {group.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => toggleQuickFilter(opt)}
                        className={`rounded-full px-2.5 py-1 text-[10px] font-medium transition-all ${
                          activeQuickFilters.includes(opt)
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              {activeQuickFilters.length > 0 && (
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-[10px] text-muted-foreground">Active:</p>
                  <div className="flex flex-wrap gap-1">
                    {activeQuickFilters.map(f => (
                      <span key={f} className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary">
                        {f}
                        <X className="h-2.5 w-2.5 cursor-pointer" onClick={() => toggleQuickFilter(f)} />
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 pb-36">
        {messages.map(msg => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-4 ${msg.role === "user" ? "flex justify-end" : ""}`}
          >
            {msg.isTyping ? (
              <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-muted px-4 py-3">
                <div className="flex gap-1.5">
                  <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="h-2 w-2 rounded-full bg-muted-foreground" />
                  <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="h-2 w-2 rounded-full bg-muted-foreground" />
                  <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="h-2 w-2 rounded-full bg-muted-foreground" />
                </div>
              </div>
            ) : (
              <>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                  msg.role === "user"
                    ? "gradient-primary text-primary-foreground rounded-br-md"
                    : "bg-muted rounded-bl-md"
                }`}>
                  {msg.role === "assistant" ? (
                    <div className="prose prose-sm prose-neutral dark:prose-invert max-w-none [&>p]:m-0 [&>ol]:my-1 [&>ul]:my-1">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <div className="whitespace-pre-line">{msg.content}</div>
                  )}
                </div>
                {msg.restaurants && (
                  <div className="mt-3 flex flex-col gap-2">
                    {msg.restaurants.map(r => (
                      <RestaurantCard key={r.id} restaurant={r} variant="horizontal" />
                    ))}
                  </div>
                )}
              </>
            )}
          </motion.div>
        ))}

        {/* Initial state content by mode */}
        {messages.length <= 1 && aiMode === "search" && (
          <div className="mt-4">
            <p className="text-xs font-medium text-muted-foreground mb-2">{t("ai.tryAsking")}</p>
            <div className="flex flex-wrap gap-2">
              {(suggestedPrompts[lang] || suggestedPrompts.en).map(prompt => (
                <motion.button
                  key={prompt}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSend(prompt)}
                  className="rounded-full border border-border px-3 py-1.5 text-xs text-foreground hover:bg-muted transition-colors"
                >
                  {prompt}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {messages.length <= 1 && aiMode === "personal" && (
          <div className="mt-4">
            <div className="rounded-2xl bg-accent/50 p-4 mb-4">
              <p className="text-xs font-semibold text-accent-foreground mb-1">{t("ai.personalizedTitle")}</p>
              <p className="text-[11px] text-muted-foreground mb-2">{t("ai.personalizedDesc")}</p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {userProfile.eatingPrefs.map(p => (
                  <span key={p} className="rounded-full gradient-primary px-2.5 py-1 text-[10px] font-medium text-primary-foreground">{p}</span>
                ))}
              </div>
            </div>
            <p className="text-xs font-medium text-muted-foreground mb-2">{t("ai.tryAsking")}</p>
            <div className="flex flex-wrap gap-2">
              {personalizedSuggestions.map(prompt => (
                <motion.button
                  key={prompt}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSend(prompt)}
                  className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs text-primary hover:bg-primary/10 transition-colors"
                >
                  ✨ {prompt}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {messages.length <= 1 && aiMode === "group" && (
          <div className="mt-4">
            <div className="rounded-2xl bg-accent/50 p-4">
              <p className="text-xs font-semibold text-accent-foreground mb-1">{t("ai.groupTitle")}</p>
              <p className="text-[11px] text-muted-foreground mb-3">{t("ai.groupDesc")}</p>

              <div className="space-y-2">
                {groupMembers.map((member, i) => (
                  <div key={member.id} className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                      {i === 0 ? <User className="h-3.5 w-3.5" /> : <span className="text-[10px] font-bold">{i}</span>}
                    </div>
                    <input
                      type="text"
                      value={member.preferences}
                      onChange={e => setGroupMembers(prev =>
                        prev.map(m => m.id === member.id ? { ...m, preferences: e.target.value } : m)
                      )}
                      placeholder={`${member.name}: ${t("ai.groupPlaceholder")}`}
                      className="flex-1 rounded-xl bg-muted px-3 py-2 text-xs outline-none placeholder:text-muted-foreground"
                    />
                    {groupMembers.length > 2 && i > 0 && (
                      <button onClick={() => removeGroupMember(member.id)}>
                        <X className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mt-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={addGroupMember}
                  className="flex-1 rounded-xl border border-dashed border-border py-2 text-xs text-muted-foreground hover:bg-muted transition-colors"
                >
                  + {t("ai.addMember")}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGroupSearch}
                  className="flex-1 rounded-xl gradient-primary py-2 text-xs font-semibold text-primary-foreground"
                >
                  {t("ai.findForGroup")}
                </motion.button>
              </div>
            </div>
          </div>
        )}

        {/* Follow-up prompts */}
        {messages.length > 2 && latestFollowUps.length > 0 && (
          <div className="mt-1 mb-2">
            <div className="flex flex-wrap gap-1.5">
              {latestFollowUps.map(prompt => (
                <motion.button
                  key={prompt}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSend(prompt)}
                  className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-[11px] text-primary hover:bg-primary/10 transition-colors"
                >
                  {prompt}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {aiMode !== "group" && (
        <div className="fixed bottom-[5.5rem] left-1/2 z-40 w-full max-w-lg -translate-x-1/2 px-5 pb-2">
          {activeQuickFilters.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1">
              {activeQuickFilters.map(f => (
                <span key={f} className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary font-medium">{f}</span>
              ))}
            </div>
          )}
          <div className="flex items-center gap-2 rounded-2xl bg-card shadow-elevated px-4 py-2 border border-border">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
              placeholder={t("ai.placeholder")}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => handleSend()}
              className="flex h-8 w-8 items-center justify-center rounded-full gradient-primary"
            >
              <ArrowUp className="h-4 w-4 text-primary-foreground" />
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AISearchPage;
