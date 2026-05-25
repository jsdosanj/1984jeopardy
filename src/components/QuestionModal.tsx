import { useEffect, useRef, useState } from "react";
import type { Question, Team } from "../types";

type Props = {
  question: Question;
  teams: Team[];
  activeTeamIndex: number;
  initialTime?: number;
  initialShowAnswer?: boolean;
  onTimeUpdate?: (time: number) => void;
  onRevealUpdate?: (revealed: boolean) => void;
  onCorrect: () => void;
  onWrongPass: (reason?: "manual" | "timeout") => void;
  onSkip: () => void;
  onClose: () => void;
};

export default function QuestionModal({
  question,
  teams,
  activeTeamIndex,
  initialTime = 20,
  initialShowAnswer = false,
  onTimeUpdate,
  onRevealUpdate,
  onCorrect,
  onWrongPass,
  onSkip,
  onClose
}: Props) {
  const [showAnswer, setShowAnswer] = useState(initialShowAnswer);
  const [time, setTime] = useState(initialTime);
  const timeoutFiredRef = useRef(false);

  useEffect(() => {
    setShowAnswer(initialShowAnswer);
  }, [initialShowAnswer, question.id]);

  useEffect(() => {
    setTime(initialTime);
    timeoutFiredRef.current = false;
  }, [initialTime, activeTeamIndex, question.id]);

  useEffect(() => {
    const t = setInterval(() => {
      setTime((v) => Math.max(0, v - 1));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    onTimeUpdate?.(time);
    if (time === 0 && !timeoutFiredRef.current) {
      timeoutFiredRef.current = true;
      onWrongPass("timeout");
    }
  }, [time, onWrongPass, onTimeUpdate]);

  const reveal = () => {
    setShowAnswer(true);
    onRevealUpdate?.(true);
  };

  return (
    <div className="modal">
      <div className="card">
        <h3>
          {question.category} — {question.points}
        </h3>
        <p>
          <strong>Current Team:</strong> {teams[activeTeamIndex]?.name ?? "Team"}
        </p>
        <p className="timer">⏱ {time}s</p>
        <p className="clue">{question.clue}</p>

        {!showAnswer ? (
          <button onClick={reveal}>Reveal Answer</button>
        ) : (
          <p className="answer">{question.answer}</p>
        )}

        <div className="actions">
          <button onClick={onCorrect}>✅ Correct</button>
          <button onClick={() => onWrongPass("manual")}>❌ Wrong / Pass</button>
          <button onClick={onSkip}>⏭ Nobody Got It</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
