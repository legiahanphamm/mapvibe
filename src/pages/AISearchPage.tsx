import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUp, Sparkles } from "lucide-react";
import { restaurants } from "@/data/mockData";
import RestaurantCard from "@/components/RestaurantCard";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  restaurants?: typeof restaurants;
}

const suggestedPrompts = [
  "100k budget, near District 1, quiet place",
  "Date night, romantic, under 500k for 2",
  "Study café with fast wifi",
  "Group dinner for 6, Korean BBQ",
];

const AISearchPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hey! 👋 I'm your food AI. Tell me what you're craving — budget, vibe, location — and I'll find the perfect spot!",
    },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (text?: string) => {
    const msg = text || input;
    if (!msg.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: msg };
    
    // Simulate AI response
    const matchedRestaurants = restaurants.slice(0, 3);
    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: `Great taste! 🎯 Here are my top picks based on "${msg}":`,
      restaurants: matchedRestaurants,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    
    setTimeout(() => {
      setMessages((prev) => [...prev, aiMsg]);
    }, 600);
  };

  return (
    <div className="flex min-h-screen flex-col safe-bottom">
      {/* Header */}
      <div className="px-5 pt-14 pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-hero">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold">AI Search</h1>
            <p className="text-[10px] text-muted-foreground">Powered by your taste</p>
          </div>
        </div>
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
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                msg.role === "user"
                  ? "gradient-primary text-primary-foreground rounded-br-md"
                  : "bg-muted rounded-bl-md"
              }`}
            >
              {msg.content}
            </div>
            {msg.restaurants && (
              <div className="mt-3 flex flex-col gap-2">
                {msg.restaurants.map((r) => (
                  <RestaurantCard key={r.id} restaurant={r} variant="horizontal" />
                ))}
              </div>
            )}
          </motion.div>
        ))}

        {/* Suggested prompts - show only at start */}
        {messages.length <= 1 && (
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
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="fixed bottom-[5.5rem] left-0 right-0 px-5 pb-2">
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
