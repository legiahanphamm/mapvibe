import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { t, lang, setLang } = useLanguage();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (isSignUp) {
      setIsLoading(false);
      navigate("/onboarding", {
        state: {
          name,
          email,
        },
      });
      return;
    }
    
    setIsLoading(false);
    setSubmitted(true);
    
    setTimeout(() => {
      navigate("/");
    }, 1800);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-5">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mb-4"
        >
          <MapPin className="h-10 w-10 text-primary-foreground" />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-display text-xl font-bold text-center"
        >
          {t("login.signedIn")}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-muted-foreground mt-2 text-center"
        >
          {t("login.subtitle")}
        </motion.p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="px-5 pt-12 pb-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/mapvibe.png" alt="MapVibe logo" className="h-8 w-8 rounded-full object-cover shadow-card" />
          <span className="font-display text-lg font-bold">MapVibe</span>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => setLang("en")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              lang === "en"
                ? "gradient-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLang("vi")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              lang === "vi"
                ? "gradient-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            VI
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 flex flex-col justify-center pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <img src="/mapvibe.png" alt="MapVibe logo" className="h-20 w-20 rounded-2xl object-cover shadow-elevated mb-5" />
          <h1 className="font-display text-3xl font-bold mb-2">{t("login.title")}</h1>
          <p className="text-muted-foreground">{t("login.subtitle")}</p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {isSignUp && (
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
                {t("login.name")}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("login.namePlaceholder")}
                required
                className="w-full rounded-xl bg-card border-2 border-transparent px-4 py-3 text-sm outline-none transition-all focus:border-primary"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
              {t("login.email")}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("login.emailPlaceholder")}
              required
              className="w-full rounded-xl bg-card border-2 border-transparent px-4 py-3 text-sm outline-none transition-all focus:border-primary"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
              {t("login.password")}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("login.passwordPlaceholder")}
              required
              className="w-full rounded-xl bg-card border-2 border-transparent px-4 py-3 text-sm outline-none transition-all focus:border-primary"
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl gradient-primary py-3.5 text-sm font-semibold text-primary-foreground transition-all disabled:opacity-70 mt-6"
          >
            {isLoading ? t("login.signingIn") : (isSignUp ? t("login.signUp") : t("login.signIn"))}
            {!isLoading && <ArrowRight className="h-4 w-4" />}
          </motion.button>
        </motion.form>

        {/* Toggle Sign Up */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-muted-foreground">
            {isSignUp ? t("login.alreadyHaveAccount") : t("login.noAccount")}
          </p>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setEmail("");
              setPassword("");
              setName("");
            }}
            className="mt-2 text-sm font-semibold text-primary hover:underline transition-all"
          >
            {isSignUp ? t("login.signIn") : t("login.signUp")}
          </button>
        </motion.div>

        {/* Demo Login */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 pt-6 border-t border-border"
        >
          <p className="text-xs text-muted-foreground text-center mb-3">{t("login.demoMode")}</p>
          <button
            type="button"
            onClick={() => {
              setEmail("demo@mapvibe.com");
              setPassword("demo123");
            }}
            className="w-full rounded-xl border-2 border-primary/30 py-3 text-sm font-semibold text-primary transition-all hover:bg-primary/5"
          >
            {t("login.useDemo")}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
