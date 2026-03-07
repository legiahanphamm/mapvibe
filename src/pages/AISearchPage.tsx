import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Sparkles, SlidersHorizontal, X } from "lucide-react";
import { restaurants, Restaurant } from "@/data/mockData";
import RestaurantCard from "@/components/RestaurantCard";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  restaurants?: Restaurant[];
  isTyping?: boolean;
}

const suggestedPrompts = [
  "100k budget, near District 1, quiet place",
  "Date night, romantic, under 500k for 2",
  "Study café with fast wifi",
  "Group dinner for 6, Korean BBQ",
  "Non-spicy food, aesthetic vibes",
  "Best street food under 50k",
];

const quickFilters = [
  { label: "Budget", icon: "💰", options: ["Under 50k", "50k-100k", "100k-300k", "300k+"] },
  { label: "Vibe", icon: "✨", options: ["Quiet", "Romantic", "Lively", "Aesthetic", "Cozy"] },
  { label: "Sentiment", icon: "🎯", options: ["Non-spicy", "Spicy", "Sweet", "Authentic", "Instagrammable"] },
];

function scoreRestaurant(r: Restaurant, query: string): number {
  const q = query.toLowerCase();
  let score = 0;

  // Name match
  if (r.name.toLowerCase().includes(q)) score += 10;

  // Category match
  if (r.category.toLowerCase().includes(q)) score += 8;
  const categoryKeywords: Record<string, string[]> = {
    "Café": ["café", "cafe", "coffee", "study", "wifi"],
    "BBQ": ["bbq", "grill", "meat", "korean bbq"],
    "Japanese": ["japanese", "ramen", "sushi", "gyoza"],
    "Vietnamese": ["vietnamese", "pho", "bun", "local"],
    "Italian": ["italian", "pasta", "wine", "pizza"],
    "Korean": ["korean", "bibimbap", "kimchi", "soju"],
    "Street Food": ["street", "cheap", "budget", "local"],
    "Dessert": ["dessert", "sweet", "ice cream", "gelato"],
    "Thai": ["thai", "pad thai", "curry"],
  };
  for (const [cat, keywords] of Object.entries(categoryKeywords)) {
    if (r.category === cat && keywords.some(kw => q.includes(kw))) score += 6;
  }

  // Vibe match
  r.vibes.forEach(v => {
    if (q.includes(v.toLowerCase())) score += 5;
  });

  // Friend feedback vibe match
  r.friendFeedback.forEach(fb => {
    fb.vibes.forEach(v => {
      if (q.includes(v.toLowerCase())) score += 3;
    });
  });

  // Budget keywords
  const budgetMatch = q.match(/(\d+)k/);
  if (budgetMatch) {
    const budget = parseInt(budgetMatch[1]) * 1000;
    const avgPrice = r.menu.reduce((sum, item) => {
      const p = parseInt(item.price.replace("k", "")) * 1000;
      return sum + p;
    }, 0) / r.menu.length;
    if (avgPrice <= budget) score += 4;
  }

  // Price range keywords
  if (q.includes("cheap") || q.includes("budget")) {
    if (r.priceRange === "$") score += 5;
    if (r.priceRange === "$$") score += 2;
  }
  if (q.includes("fancy") || q.includes("luxury") || q.includes("upscale")) {
    if (r.priceRange === "$$$$") score += 5;
    if (r.priceRange === "$$$") score += 3;
  }

  // Mood keywords
  if (q.includes("date") || q.includes("romantic")) {
    if (r.vibes.some(v => ["Romantic", "Aesthetic", "Date Night", "Cozy"].includes(v))) score += 5;
  }
  if (q.includes("study") || q.includes("work")) {
    if (r.vibes.some(v => ["Quiet", "Study-Friendly"].includes(v))) score += 5;
  }
  if (q.includes("group") || q.includes("friends")) {
    if (r.vibes.some(v => ["Group-Friendly", "Lively", "Fun"].includes(v))) score += 5;
  }
  if (q.includes("quiet") || q.includes("chill") || q.includes("alone")) {
    if (r.vibes.some(v => ["Quiet", "Cozy"].includes(v))) score += 5;
  }

  // Spice sensitivity
  if (q.includes("non-spicy") || q.includes("not spicy") || q.includes("mild")) {
    if (r.friendFeedback.some(fb => fb.vibes.some(v => v.toLowerCase().includes("non-spicy")))) score += 6;
  }
  if (q.includes("spicy")) {
    if (r.friendFeedback.some(fb => fb.vibes.some(v => v.toLowerCase() === "spicy" || v.toLowerCase().includes("slightly spicy")))) score += 5;
  }

  // Distance keywords
  if (q.includes("near") || q.includes("close")) {
    const dist = parseFloat(r.distance);
    if (dist < 1) score += 4;
    if (dist < 0.5) score += 3;
  }

  // Rating boost
  score += r.rating;

  return score;
}

function generateAIResponse(query: string, matched: Restaurant[]): string {
  const q = query.toLowerCase();

  if (matched.length === 0) {
    return "Hmm, I couldn't find an exact match 😅 Try adjusting your filters or describe what you're looking for differently!\n\nHere are some things I can help with:\n- **Budget**: \"under 100k\", \"cheap eats\"\n- **Vibe**: \"quiet\", \"romantic\", \"group-friendly\"\n- **Food type**: \"Korean\", \"Vietnamese\", \"café\"\n- **Sentiment**: \"non-spicy\", \"authentic\", \"instagrammable\"";
  }

  let intro = "";

  if (q.includes("date") || q.includes("romantic")) {
    intro = "Aww, planning something special? 💕 Here are the most romantic spots I found:";
  } else if (q.includes("study") || q.includes("wifi") || q.includes("work")) {
    intro = "Productivity mode activated! 📚 These spots have great wifi and a chill atmosphere:";
  } else if (q.includes("group") || q.includes("friends") || q.includes("party")) {
    intro = "Squad goals! 👥 These places are perfect for groups:";
  } else if (q.includes("cheap") || q.includes("budget") || q.match(/\d+k/)) {
    intro = "Smart choice, saving while eating well! 💰 Here are budget-friendly picks:";
  } else if (q.includes("spicy")) {
    intro = "Bringing the heat! 🌶️ Check out these spots:";
  } else if (q.includes("non-spicy") || q.includes("mild")) {
    intro = "No worries, keeping it mild! 🌿 These places have great non-spicy options:";
  } else if (q.includes("aesthetic") || q.includes("instagram") || q.includes("photo")) {
    intro = "Camera ready? 📸 These places are absolutely gorgeous:";
  } else {
    intro = `Great taste! 🎯 Based on **"${query}"**, here are my top picks:`;
  }

  const details = matched.map((r, i) =>
    `${i + 1}. **${r.name}** — ${r.category} · ${r.priceRange} · ${r.distance}\n   _${r.vibes.join(", ")}_`
  ).join("\n");

  const friendNote = matched.some(r => r.friendFeedback.length > 0)
    ? "\n\n💬 *Some of your friends have been to these places — check their reviews!*"
    : "";

  return `${intro}\n\n${details}${friendNote}`;
}

function getFollowUpPrompts(query: string): string[] {
  const q = query.toLowerCase();
  const prompts: string[] = [];

  if (!q.includes("budget") && !q.match(/\d+k/)) prompts.push("Same but under 100k budget");
  if (!q.includes("quiet") && !q.includes("romantic")) prompts.push("Something more romantic & quiet");
  if (!q.includes("group")) prompts.push("Good for a group of 5+");
  if (!q.includes("non-spicy")) prompts.push("Only non-spicy options please");
  if (!q.includes("near")) prompts.push("Closer to me, within 1km");
  if (!q.includes("aesthetic")) prompts.push("Most Instagrammable spot?");

  return prompts.slice(0, 3);
}

const AISearchPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hey! 👋 I'm your food AI. Tell me what you're craving — **budget, vibe, location, food type, spice level** — and I'll find the perfect spot!\n\nYou can also use the quick filters below 👇",
    },
  ]);
  const [input, setInput] = useState("");
  const [activeQuickFilters, setActiveQuickFilters] = useState<string[]>([]);
  const [showQuickFilters, setShowQuickFilters] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (text?: string) => {
    const filterContext = activeQuickFilters.length > 0
      ? ` [Filters: ${activeQuickFilters.join(", ")}]`
      : "";
    const msg = (text || input) + filterContext;
    if (!msg.trim()) return;

    const displayMsg = text || input;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: displayMsg };

    // Score and sort restaurants
    const scored = restaurants
      .map(r => ({ restaurant: r, score: scoreRestaurant(r, msg) }))
      .sort((a, b) => b.score - a.score);

    const topMatches = scored.slice(0, 3).filter(s => s.score > 3).map(s => s.restaurant);
    const fallback = topMatches.length === 0 ? scored.slice(0, 2).map(s => s.restaurant) : topMatches;
    const matchedRestaurants = fallback;

    const aiContent = generateAIResponse(displayMsg, matchedRestaurants);
    const followUps = getFollowUpPrompts(msg);

    // Typing indicator
    const typingMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "",
      isTyping: true,
    };

    const aiMsg: Message = {
      id: (Date.now() + 2).toString(),
      role: "assistant",
      content: aiContent,
      restaurants: matchedRestaurants,
    };

    setMessages((prev) => [...prev, userMsg, typingMsg]);
    setInput("");
    setActiveQuickFilters([]);

    setTimeout(() => {
      setMessages((prev) => {
        const withoutTyping = prev.filter(m => !m.isTyping);
        return [...withoutTyping, aiMsg];
      });

      // Add follow-up prompts as a separate message
      if (followUps.length > 0) {
        setTimeout(() => {
          setMessages((prev) => [...prev, {
            id: (Date.now() + 3).toString(),
            role: "assistant",
            content: "Want to refine? Try:",
          }]);
        }, 300);
      }
    }, 800);
  };

  const toggleQuickFilter = (option: string) => {
    setActiveQuickFilters(prev =>
      prev.includes(option) ? prev.filter(f => f !== option) : [...prev, option]
    );
  };

  const latestFollowUps = (() => {
    const lastUserMsg = [...messages].reverse().find(m => m.role === "user");
    if (!lastUserMsg) return [];
    return getFollowUpPrompts(lastUserMsg.content);
  })();

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
              <h1 className="font-display text-lg font-bold">AI Search</h1>
              <p className="text-[10px] text-muted-foreground">Price · Vibe · Sentiment aware</p>
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
                    {group.icon} {group.label}
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
                    {activeQuickFilters.map((f) => (
                      <span
                        key={f}
                        className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary"
                      >
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
        {messages.map((msg) => (
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
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                    msg.role === "user"
                      ? "gradient-primary text-primary-foreground rounded-br-md"
                      : "bg-muted rounded-bl-md"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <div className="prose prose-sm prose-neutral dark:prose-invert max-w-none [&>p]:m-0 [&>ol]:my-1 [&>ul]:my-1">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
                {msg.restaurants && (
                  <div className="mt-3 flex flex-col gap-2">
                    {msg.restaurants.map((r) => (
                      <RestaurantCard key={r.id} restaurant={r} variant="horizontal" />
                    ))}
                  </div>
                )}
              </>
            )}
          </motion.div>
        ))}

        {/* Suggested / Follow-up prompts */}
        {messages.length <= 1 ? (
          <div className="mt-4">
            <p className="text-xs font-medium text-muted-foreground mb-2">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map((prompt) => (
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
        ) : messages.length > 2 && latestFollowUps.length > 0 && (
          <div className="mt-1 mb-2">
            <div className="flex flex-wrap gap-1.5">
              {latestFollowUps.map((prompt) => (
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
      <div className="fixed bottom-[5.5rem] left-0 right-0 px-5 pb-2">
        {activeQuickFilters.length > 0 && (
          <div className="flex gap-1 mb-2 flex-wrap">
            {activeQuickFilters.map((f) => (
              <span key={f} className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary font-medium">
                {f}
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2 rounded-2xl bg-card shadow-elevated px-4 py-2 border border-border">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Describe your ideal spot..."
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
    </div>
  );
};

export default AISearchPage;
