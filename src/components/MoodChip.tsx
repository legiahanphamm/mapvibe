import { motion } from "framer-motion";

interface MoodChipProps {
  emoji: string;
  label: string;
  isSelected?: boolean;
  onClick?: () => void;
}

const MoodChip = ({ emoji, label, isSelected, onClick }: MoodChipProps) => (
  <motion.button
    whileTap={{ scale: 0.92 }}
    onClick={onClick}
    className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
      isSelected
        ? "gradient-primary text-primary-foreground shadow-glow"
        : "bg-muted text-muted-foreground hover:bg-accent"
    }`}
  >
    <span className="text-base">{emoji}</span>
    {label}
  </motion.button>
);

export default MoodChip;
