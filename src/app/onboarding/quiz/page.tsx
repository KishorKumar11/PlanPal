"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { quizQuestions } from "@/lib/quiz-data";
import { Archetype } from "@/lib/archetypes";
import { TraitScores } from "@/lib/types";
import QuizQuestion from "@/components/QuizQuestion";
import QuizProgress from "@/components/QuizProgress";
import ArchetypeReveal from "@/components/ArchetypeReveal";

interface Answer {
  questionId: string;
  optionIndex: number;
}

type QuizState = "quiz" | "loading" | "reveal";

export default function QuizPage() {
  const router = useRouter();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [state, setState] = useState<QuizState>("quiz");
  const [result, setResult] = useState<{ archetype: Archetype; traitScores: TraitScores } | null>(null);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(false);
  }, [currentIdx, state]);

  const loadingMessages = [
    "Analysing your vibes…",
    "Matching your personality…",
    "Consulting the cosmos…",
    "Discovering your archetype…",
  ];

  const handleAnswer = async (optionIndex: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    const answer: Answer = { questionId: quizQuestions[currentIdx].id, optionIndex };
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentIdx < quizQuestions.length - 1) {
      setCurrentIdx((i) => i + 1);
      return;
    }

    setState("loading");
    let msgIdx = 0;
    setLoadingMsg(loadingMessages[0]);
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % loadingMessages.length;
      setLoadingMsg(loadingMessages[msgIdx]);
    }, 900);

    const res = await fetch("/api/quiz/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: newAnswers }),
    });

    clearInterval(interval);

    if (!res.ok) {
      router.push("/auth/signin");
      return;
    }

    const data = await res.json();
    setResult(data);
    setState("reveal");
  };

  if (state === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-vibe mx-auto mb-6 animate-pulse" />
          <p className="text-text-dim text-lg">{loadingMsg}</p>
        </div>
      </main>
    );
  }

  if (state === "reveal" && result) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 py-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(124,58,237,0.1)_0%,_transparent_70%)]" />
        <div className="relative w-full max-w-lg">
          <ArchetypeReveal archetype={result.archetype} traitScores={result.traitScores} />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(124,58,237,0.1)_0%,_transparent_60%)]" />
      <div className="relative w-full max-w-2xl">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold gradient-text mb-2">Find Your Archetype</h1>
          <p className="text-text-dim text-sm">10 questions. No wrong answers.</p>
        </div>

        <div className="mb-8">
          <QuizProgress current={currentIdx + 1} total={quizQuestions.length} />
        </div>

        {quizQuestions[currentIdx] && (
          <QuizQuestion
            question={quizQuestions[currentIdx]}
            questionIndex={currentIdx}
            onAnswer={handleAnswer}
          />
        )}
      </div>
    </main>
  );
}
