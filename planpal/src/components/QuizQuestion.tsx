"use client";

import { motion, AnimatePresence } from "framer-motion";
import { QuizQuestion as QuizQuestionType } from "@/lib/quiz-data";
import GlowCard from "./GlowCard";

interface QuizQuestionProps {
  question: QuizQuestionType;
  questionIndex: number;
  onAnswer: (optionIndex: number) => void;
}

export default function QuizQuestion({ question, questionIndex, onAnswer }: QuizQuestionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={questionIndex}
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -60 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="w-full"
      >
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-text-bright mb-8 leading-snug">
          {question.question}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {question.options.map((option, i) => (
            <GlowCard
              key={i}
              onClick={() => onAnswer(i)}
              className="p-4 sm:p-5"
            >
              <p className="text-text-bright text-sm sm:text-base leading-relaxed">
                {option.text}
              </p>
            </GlowCard>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
