import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Share2, UtensilsCrossed, ChefHat, Store, Users, ChevronRight } from "lucide-react";
import { restaurants, userProfile } from "@/data/mockData";
import { useNavigate } from "react-router-dom";

interface FeedPost {
  id: string;
  user: { name: string; avatar: string };
  image: string;
  caption: string;
  tag: "cooking" | "eatout" | "dineout";
  taggedFriends: string[];
  restaurant?: string;
  vibes: string[];
  timestamp: string;
  likes: number;
  liked: boolean;
}

const tagConfig = {
  cooking: { label: "Cooking with me 👩‍🍳", icon: ChefHat, color: "bg-accent text-accent-foreground" },
  eatout: { label: "Eat Out 🍜", icon: UtensilsCrossed, color: "bg-secondary/20 text-secondary" },
  dineout: { label: "Dine Out 🍷", icon: Store, color: "bg-primary/15 text-primary" },
};

const mockFeed: FeedPost[] = [
  {
    id: "f1",
    user: { name: "Hana", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" },
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=600&fit=crop",
    caption: "Made bún chả at home today! Recipe in bio 🔥",
    tag: "cooking",
    taggedFriends: ["Minh", "Linh"],
    vibes: ["Vietnamese", "Non-spicy", "Homemade"],
    timestamp: "15 min ago",
    likes: 24,
    liked: false,
  },
  {
    id: "f2",
    user: { name: "Minh", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" },
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=600&fit=crop",
    caption: "Study session turned into a matcha party ☕",
    tag: "eatout",
    taggedFriends: ["Hana"],
    restaurant: "The Green Patio",
    vibes: ["Café", "Quiet", "Aesthetic"],
    timestamp: "1h ago",
    likes: 42,
    liked: true,
  },
  {
    id: "f3",
    user: { name: "Linh", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" },
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=600&fit=crop",
    caption: "Wagyu night with the squad 🥩✨ Worth every penny",
    tag: "dineout",
    taggedFriends: ["Tuan", "Duc", "Phuong"],
    restaurant: "Saigon BBQ House",
    vibes: ["BBQ", "Group", "Splurge"],
    timestamp: "3h ago",
    likes: 67,
    liked: false,
  },
  {
    id: "f4",
    user: { name: "Phuong", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop" },
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=600&fit=crop",
    caption: "Tried making ramen from scratch 🍜 nailed it!",
    tag: "cooking",
    taggedFriends: [],
    vibes: ["Japanese", "Umami", "Homemade"],
    timestamp: "5h ago",
    likes: 31,
    liked: false,
  },
  {
    id: "f5",
    user: { name: "Duc", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" },
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&h=600&fit=crop",
    caption: "Sunset views + truffle pasta = perfect evening 🌅",
    tag: "dineout",
    taggedFriends: ["Hana"],
    restaurant: "Sunset Rooftop Bar",
    vibes: ["Italian", "Romantic", "Wine"],
    timestamp: "8h ago",
    likes: 89,
    liked: true,
  },
];

const FeedPage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState(mockFeed);
  const [currentIndex, setCurrentIndex] = useState(0);

  const toggleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
      )
    );
  };

  return (
    <div className="min-h-screen safe-bottom bg-background">
      {/* Header */}
      <div className="px-5 pt-14 pb-3">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-display font-bold">Feed</h1>
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate("/checkin")}
              className="flex items-center gap-1.5 rounded-full gradient-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-glow"
            >
              My Check-ins
              <ChevronRight className="h-3 w-3" />
            </motion.button>
          </div>
        </div>

        {/* Friends stories row */}
        <div className="mt-4 flex gap-3 overflow-x-auto scrollbar-hide pb-1">
          {userProfile.friends.map((friend, i) => (
            <motion.div
              key={friend.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="flex flex-col items-center gap-1 shrink-0"
            >
              <div className="h-14 w-14 rounded-full p-[2px] gradient-primary">
                <img
                  src={friend.avatar}
                  alt={friend.name}
                  className="h-full w-full rounded-full object-cover border-2 border-background"
                />
              </div>
              <span className="text-[10px] font-medium text-muted-foreground">{friend.name}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Locket-style Feed */}
      <div className="px-4 pb-28 space-y-4">
        {posts.map((post, i) => {
          const tagInfo = tagConfig[post.tag];
          const TagIcon = tagInfo.icon;

          return (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-3xl bg-card shadow-card overflow-hidden border border-border"
            >
              {/* User header */}
              <div className="flex items-center gap-2.5 px-4 py-3">
                <img src={post.user.avatar} alt={post.user.name} className="h-9 w-9 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{post.user.name}</span>
                    <span className="text-[10px] text-muted-foreground">{post.timestamp}</span>
                  </div>
                  {post.restaurant && (
                    <p className="text-[11px] text-muted-foreground truncate">at {post.restaurant}</p>
                  )}
                </div>
                <div className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold ${tagInfo.color}`}>
                  <TagIcon className="h-3 w-3" />
                  {post.tag === "cooking" ? "Cooking" : post.tag === "eatout" ? "Eat Out" : "Dine Out"}
                </div>
              </div>

              {/* Image - Locket style square */}
              <div className="relative aspect-square mx-3 rounded-2xl overflow-hidden">
                <img src={post.image} alt={post.caption} className="h-full w-full object-cover" />

                {/* Vibe tags overlay */}
                <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1">
                  {post.vibes.map((v) => (
                    <span key={v} className="rounded-full bg-background/80 backdrop-blur-sm px-2 py-0.5 text-[10px] font-medium text-foreground">
                      {v}
                    </span>
                  ))}
                </div>
              </div>

              {/* Caption & interactions */}
              <div className="px-4 py-3">
                <p className="text-sm">
                  <span className="font-semibold">{post.user.name}</span>{" "}
                  {post.caption}
                </p>

                {/* Tagged friends */}
                {post.taggedFriends.length > 0 && (
                  <div className="flex items-center gap-1 mt-1.5">
                    <Users className="h-3 w-3 text-muted-foreground" />
                    <span className="text-[11px] text-muted-foreground">
                      with {post.taggedFriends.join(", ")}
                    </span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-4 mt-3">
                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    onClick={() => toggleLike(post.id)}
                    className="flex items-center gap-1"
                  >
                    <Heart
                      className={`h-5 w-5 transition-colors ${
                        post.liked ? "fill-destructive text-destructive" : "text-muted-foreground"
                      }`}
                    />
                    <span className="text-xs font-medium text-muted-foreground">{post.likes}</span>
                  </motion.button>
                  <button className="flex items-center gap-1">
                    <MessageCircle className="h-5 w-5 text-muted-foreground" />
                  </button>
                  <button className="flex items-center gap-1 ml-auto">
                    <Share2 className="h-5 w-5 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default FeedPage;
