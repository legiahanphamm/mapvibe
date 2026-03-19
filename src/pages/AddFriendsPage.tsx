import { useMemo, useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const friendDirectory = [
  { id: "f-1", name: "Trang Le", username: "@trangle", phone: "0901234567", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" },
  { id: "f-2", name: "Kien Tran", username: "@kientran", phone: "0988123123", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" },
  { id: "f-3", name: "Nhi Nguyen", username: "@nhinguyen", phone: "0911002200", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" },
  { id: "f-4", name: "Bao Tran", username: "@baotran", phone: "0933011122", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop" },
];

const AddFriendsPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [invited, setInvited] = useState<string[]>([]);

  const filteredFriends = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return friendDirectory;
    return friendDirectory.filter((friend) => `${friend.name} ${friend.username} ${friend.phone}`.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="min-h-screen safe-bottom bg-background">
      <div className="px-5 pt-14 pb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h1 className="text-xl font-display font-bold">{t("friends.title")}</h1>
      </div>

      <div className="px-5">
        <div className="flex items-center gap-2 rounded-xl bg-muted px-3.5 py-2.5 mb-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("friends.searchPlaceholder")}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        <h2 className="text-sm font-semibold text-muted-foreground mb-2">{t("friends.suggested")}</h2>
        <div className="space-y-2">
          {filteredFriends.map((friend) => {
            const isInvited = invited.includes(friend.id);
            return (
              <div key={friend.id} className="flex items-center justify-between rounded-2xl bg-card p-3 shadow-card">
                <div className="flex items-center gap-2.5">
                  <img src={friend.avatar} alt={friend.name} className="h-10 w-10 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-semibold">{friend.name}</p>
                    <p className="text-xs text-muted-foreground">{friend.username} · {friend.phone}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (!isInvited) {
                      setInvited((prev) => [...prev, friend.id]);
                    }
                  }}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${isInvited ? "bg-primary/10 text-primary" : "gradient-primary text-primary-foreground"}`}
                >
                  {isInvited ? t("friends.invited") : t("friends.invite")}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AddFriendsPage;
