import { useEffect, useState } from "react";
import type { Question, Team } from "../types";

type Props = {
  question: Question;
  teams: Team[];
  activeTeamIndex: number;
  onCorrect: () => void;
  onWrongPass: () => void;
  onSkip: () => void;
  onClose: () => void;
};

export default function QuestionModal({
  question,
  teams,
  activeTeamIndex,
  onCorrect,
  onWrongPass,
  onSkip,
  onClose
}: Props) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [time, setTime] = useState(20);

  useEffect(() => {
    setTime(20);
    const t = setInterval(() => setTime((v) => Math.max(0, v - 1)), 1000);
    return () => clearInterval(t);
  }, [activeTeamIndex, question.id]);

  return (
    <div className="modal">
      <div className="card">
        <h3>{question.category} — {question.points}</h3>
        <p><strong>Current Team:</strong> {teams[activeTeamIndex].name}</p>
        <p className="timer">⏱ {time}s</p>
        <p className="clue">{question.clue}</p>
        {!showAnswer ? (
          <button onClick={() => setShowAnswer(true)}>Reveal Answer</button>
        ) : (
          <p className="answer">{question.answer}</p>
        )}
        <div className="actions">
          <button onClick={onCorrect}>✅ Correct</button>
          <button onClick={onWrongPass}>❌ Wrong / Pass</button>
          <button onClick={onSkip}>⏭ Nobody Got It</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
