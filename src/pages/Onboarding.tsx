import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface OptionConfig {
  icon: string;
  labelKey: string;
  exclusive?: boolean;
}

interface StepConfig {
  titleKey: string;
  subtitleKey: string;
  options: OptionConfig[];
  multiSelect: boolean;
}

const steps: StepConfig[] = [
  {
    titleKey: "onboarding.step1.title",
    subtitleKey: "onboarding.step1.subtitle",
    multiSelect: true,
    options: [
      { icon: "🍜", labelKey: "onboarding.cuisine.vn" },
      { icon: "🍣", labelKey: "onboarding.cuisine.jp" },
      { icon: "🥘", labelKey: "onboarding.cuisine.kr" },
      { icon: "🍕", labelKey: "onboarding.cuisine.it" },
      { icon: "🌮", labelKey: "onboarding.cuisine.mx" },
      { icon: "🍛", labelKey: "onboarding.cuisine.th" },
      { icon: "🥟", labelKey: "onboarding.cuisine.cn" },
      { icon: "🥩", labelKey: "onboarding.cuisine.bbq" },
      { icon: "🧁", labelKey: "onboarding.cuisine.dessert" },
    ],
  },
  {
    titleKey: "onboarding.step2.title",
    subtitleKey: "onboarding.step2.subtitle",
    multiSelect: true,
    options: [
      { icon: "🥜", labelKey: "onboarding.allergy.peanut" },
      { icon: "🦐", labelKey: "onboarding.allergy.seafood" },
      { icon: "🥛", labelKey: "onboarding.allergy.dairy" },
      { icon: "🌾", labelKey: "onboarding.allergy.gluten" },
      { icon: "🥚", labelKey: "onboarding.allergy.egg" },
      { icon: "🫘", labelKey: "onboarding.allergy.soy" },
      { icon: "✅", labelKey: "onboarding.allergy.none", exclusive: true },
    ],
  },
  {
    titleKey: "onboarding.step3.title",
    subtitleKey: "onboarding.step3.subtitle",
    multiSelect: true,
    options: [
      { icon: "🌿", labelKey: "onboarding.vibe.green" },
      { icon: "🕯️", labelKey: "onboarding.vibe.romantic" },
      { icon: "🏙️", labelKey: "onboarding.vibe.rooftop" },
      { icon: "📚", labelKey: "onboarding.vibe.study" },
      { icon: "🎵", labelKey: "onboarding.vibe.live" },
      { icon: "👨‍👩‍👧‍👦", labelKey: "onboarding.vibe.family" },
      { icon: "🎨", labelKey: "onboarding.vibe.art" },
      { icon: "⚡", labelKey: "onboarding.vibe.fast" },
    ],
  },
  {
    titleKey: "onboarding.step4.title",
    subtitleKey: "onboarding.step4.subtitle",
    multiSelect: false,
    options: [
      { icon: "💰", labelKey: "onboarding.budget.low" },
      { icon: "💰💰", labelKey: "onboarding.budget.mid" },
      { icon: "💎", labelKey: "onboarding.budget.high" },
      { icon: "👑", labelKey: "onboarding.budget.premium" },
    ],
  },
];

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -300 : 300, opacity: 0 }),
};

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [selections, setSelections] = useState<Record<number, string[]>>({});

  const step = steps[currentStep];
  const selected = selections[currentStep] || [];
  const optionLabels = useMemo(
    () => step.options.reduce<Record<string, string>>((acc, option) => {
      acc[option.labelKey] = t(option.labelKey);
      return acc;
    }, {}),
    [step.options, t],
  );

  const toggleOption = (option: OptionConfig) => {
    const current = selections[currentStep] || [];

    if (step.multiSelect) {
      if (option.exclusive) {
        setSelections({ ...selections, [currentStep]: [option.labelKey] });
        return;
      }

      const exclusiveKey = step.options.find((item) => item.exclusive)?.labelKey;
      const filtered = exclusiveKey ? current.filter((item) => item !== exclusiveKey) : current;
      setSelections({
        ...selections,
        [currentStep]: filtered.includes(option.labelKey)
          ? filtered.filter((item) => item !== option.labelKey)
          : [...filtered, option.labelKey],
      });
      return;
    }

    setSelections({ ...selections, [currentStep]: [option.labelKey] });
  };

  const next = () => {
    if (currentStep < steps.length - 1) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
      return;
    }

    localStorage.setItem("onboarding-selections", JSON.stringify(selections));
    navigate("/");
  };

  const prev = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto flex flex-col">
      <div className="px-5 pt-12 pb-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prev}
            className={`w-10 h-10 rounded-full bg-secondary flex items-center justify-center transition-opacity ${
              currentStep === 0 ? "opacity-0 pointer-events-none" : ""
            }`}
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>

          <span className="text-sm text-muted-foreground font-medium">
            {currentStep + 1} / {steps.length}
          </span>

          <button
            onClick={() => navigate("/")}
            className="text-sm text-muted-foreground font-medium"
          >
            {t("onboarding.skip")}
          </button>
        </div>

        <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full gradient-warm rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <div className="flex-1 px-5 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <h1 className="text-2xl font-bold font-display text-foreground mb-2 mt-4">
              {t(step.titleKey)}
            </h1>
            <p className="text-sm text-muted-foreground mb-6">{t(step.subtitleKey)}</p>

            <div className="grid grid-cols-2 gap-3">
              {step.options.map((option) => {
                const isSelected = selected.includes(option.labelKey);
                return (
                  <motion.button
                    key={option.labelKey}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleOption(option)}
                    className={`relative flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-elevated"
                        : "border-border bg-card shadow-card"
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 right-2 w-5 h-5 rounded-full gradient-warm flex items-center justify-center"
                      >
                        <Check className="w-3 h-3 text-primary-foreground" />
                      </motion.div>
                    )}
                    <span className="text-3xl">{option.icon}</span>
                    <span className="text-sm font-medium text-foreground text-center">{optionLabels[option.labelKey]}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="px-5 pb-8 pt-4">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={next}
          disabled={selected.length === 0}
          className={`w-full flex items-center justify-center gap-2 rounded-2xl py-4 font-semibold text-sm transition-all ${
            selected.length > 0
              ? "gradient-warm text-primary-foreground shadow-elevated"
              : "bg-secondary text-muted-foreground"
          }`}
        >
          {currentStep === steps.length - 1 ? t("onboarding.finish") : t("onboarding.continue")}
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
};

export default OnboardingPage;