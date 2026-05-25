import confetti from "canvas-confetti";
import { useMemo, useState } from "react";
import IntroScreen from "./components/IntroScreen";
import TeamSetupScreen from "./components/TeamSetupScreen";
import RulesScreen from "./components/RulesScreen";
import ProgressScreen from "./components/ProgressScreen";
import GameBoard from "./components/GameBoard";
import QuestionModal from "./components/QuestionModal";
import ControlPanel from "./components/ControlPanel";
import FinalScoreboard from "./components/FinalScoreboard";
import PrintableSummary from "./components/PrintableSummary";
import { categories, initialQuestions } from "./data/gameData";
import { sfx } from "./utils/audio";
import { makeTeams, nextTeam } from "./utils/gameLogic";
import type { ActionLog, GamePhase, Question, Team } from "./types";

export default function App() {
  const [phase, setPhase] = useState<GamePhase>("intro");
  const [teamCount, setTeamCount] = useState(2);
  const [teams, setTeams] = useState<Team[]>([]);
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [activeTeamIndex, setActiveTeamIndex] = useState(0);
  const [attemptsOnQuestion, setAttemptsOnQuestion] = useState(0);
  const [history, setHistory] = useState<ActionLog[]>([]);

  const allUsed = useMemo(() => questions.every((q) => q.used), [questions]);

  const goToSetup = () => setPhase("teamSetup");
  const startRules = () => {
    setTeams(makeTeams(teamCount));
    setPhase("rules");
  };

  const pickQuestion = (q: Question) => {
    sfx.select();
    setCurrentQuestion(q);
    setAttemptsOnQuestion(0);
    setPhase("question");
  };

  const markUsed = (qId: string) => {
    setQuestions((prev) => prev.map((q) => (q.id === qId ? { ...q, used: true } : q)));
    setHistory((h) => [...h, { type: "used", questionId: qId }]);
  };

  const onCorrect = () => {
    if (!currentQuestion) return;
    sfx.correct();
    setTeams((prev) =>
      prev.map((t, i) => i === activeTeamIndex ? { ...t, score: t.score + currentQuestion.points } : t)
    );
    setHistory((h) => [
      ...h,
      { type: "score", teamId: teams[activeTeamIndex].id, delta: currentQuestion.points, questionId: currentQuestion.id }
    ]);
    if (currentQuestion.points === 500) confetti({ particleCount: 180, spread: 90 });
    markUsed(currentQuestion.id);
    setCurrentQuestion(null);
    setPhase(allUsed ? "final" : "board");
  };

  const onWrongPass = () => {
    sfx.wrong();
    if (!currentQuestion) return;
    const next = nextTeam(activeTeamIndex, teams.length);
    const nextAttempts = attemptsOnQuestion + 1;
    if (nextAttempts >= teams.length) {
      markUsed(currentQuestion.id);
      setCurrentQuestion(null);
      setPhase(allUsed ? "final" : "board");
      return;
    }
    setAttemptsOnQuestion(nextAttempts);
    setActiveTeamIndex(next);
  };

  const onSkip = () => {
    if (!currentQuestion) return;
    markUsed(currentQuestion.id);
    setCurrentQuestion(null);
    setPhase(allUsed ? "final" : "board");
  };

  const onManualScore = (teamId: number, score: number) => {
    setTeams((prev) => {
      const t = prev.find((x) => x.id === teamId);
      if (!t) return prev;
      setHistory((h) => [...h, { type: "manual-score", teamId, oldScore: t.score, newScore: score }]);
      return prev.map((x) => (x.id === teamId ? { ...x, score } : x));
    });
  };

  const onUndo = () => {
    const last = history[history.length - 1];
    if (!last) return;
    setHistory((h) => h.slice(0, -1));

    if (last.type === "score") {
      setTeams((prev) => prev.map((t) => (t.id === last.teamId ? { ...t, score: t.score - last.delta } : t)));
      setQuestions((prev) => prev.map((q) => (q.id === last.questionId ? { ...q, used: false } : q)));
    } else if (last.type === "used") {
      setQuestions((prev) => prev.map((q) => (q.id === last.questionId ? { ...q, used: false } : q)));
    } else if (last.type === "manual-score") {
      setTeams((prev) => prev.map((t) => (t.id === last.teamId ? { ...t, score: last.oldScore } : t)));
    }
  };

  const restart = () => {
    setPhase("intro");
    setTeams([]);
    setQuestions(initialQuestions.map((q) => ({ ...q, used: false })));
    setCurrentQuestion(null);
    setActiveTeamIndex(0);
    setAttemptsOnQuestion(0);
    setHistory([]);
  };

  return (
    <main>
      {phase === "intro" && <IntroScreen onStart={goToSetup} />}
      {phase === "teamSetup" && (
        <TeamSetupScreen teamCount={teamCount} setTeamCount={setTeamCount} onNext={startRules} />
      )}
      {phase === "rules" && <RulesScreen onNext={() => setPhase("progress1")} />}
      {phase === "progress1" && <ProgressScreen title="Section 1 Complete" onNext={() => setPhase("progress2")} />}
      {phase === "progress2" && <ProgressScreen title="Section 2 Complete" onNext={() => setPhase("progress3")} />}
      {phase === "progress3" && <ProgressScreen title="Game Ready" onNext={() => setPhase("board")} />}

      {phase === "board" && (
        <div className="layout">
          <GameBoard categories={categories} questions={questions} onPick={pickQuestion} />
          <ControlPanel teams={teams} onManualScore={onManualScore} onUndo={onUndo} onFinish={() => setPhase("final")} />
        </div>
      )}

      {phase === "question" && currentQuestion && (
        <QuestionModal
          question={currentQuestion}
          teams={teams}
          activeTeamIndex={activeTeamIndex}
          onCorrect={onCorrect}
          onWrongPass={onWrongPass}
          onSkip={onSkip}
          onClose={() => setPhase("board")}
        />
      )}

      {phase === "final" && (
        <FinalScoreboard teams={teams} onPrintable={() => setPhase("printable")} onRestart={restart} />
      )}
      {phase === "printable" && <PrintableSummary teams={teams} onBack={() => setPhase("final")} />}
    </main>
  );
}
