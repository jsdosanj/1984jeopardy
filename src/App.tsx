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
import type {
  ActionLog,
  GamePhase,
  MissedQuestionRecord,
  Question,
  Team,
  TiebreakerState
} from "./types";

const ATTEMPT_TIME = 20;

export default function App() {
  const [phase, setPhase] = useState<GamePhase>("intro");
  const [teamCount, setTeamCount] = useState(2);
  const [teams, setTeams] = useState<Team[]>([]);
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);

  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [activeTeamIndex, setActiveTeamIndex] = useState(0);
  const [pickerTeamIndex, setPickerTeamIndex] = useState(0);
  const [attemptsOnQuestion, setAttemptsOnQuestion] = useState(0);

  const [questionTimeLeft, setQuestionTimeLeft] = useState(ATTEMPT_TIME);
  const [questionAnswerRevealed, setQuestionAnswerRevealed] = useState(false);

  const [sfxEnabled, setSfxEnabled] = useState(true);

  const [history, setHistory] = useState<ActionLog[]>([]);
  const [missedQuestions, setMissedQuestions] = useState<MissedQuestionRecord[]>([]);

  const [tiebreaker, setTiebreaker] = useState<TiebreakerState>({
    tiedTeamIds: [],
    question: null,
    activeTiebreakerTeamId: null,
    revealAnswer: false,
    coinFlipWinnerTeamId: null
  });

  const allUsed = useMemo(() => questions.every((q) => q.used), [questions]);

  const play = (fn: () => void) => {
    if (sfxEnabled) fn();
  };

  const updateQuestionUsed = (questionId: string, used: boolean) => {
    setQuestions((prev) => prev.map((q) => (q.id === questionId ? { ...q, used } : q)));
  };

  const startFromIntro = () => setPhase("teamSetup");

  const startRules = () => {
    const t = makeTeams(teamCount);
    setTeams(t);
    setPickerTeamIndex(0);
    setActiveTeamIndex(0);
    setPhase("rules");
  };

  const pickQuestion = (q: Question) => {
    play(sfx.select);
    setCurrentQuestion(q);
    setAttemptsOnQuestion(0);
    setActiveTeamIndex(pickerTeamIndex);
    setQuestionTimeLeft(ATTEMPT_TIME);
    setQuestionAnswerRevealed(false);
    setPhase("question");
  };

  const closeQuestionPreserveState = () => {
    // Keep state, host can reopen by re-clicking same tile.
    // To support this, we do NOT mark used and simply return to board.
    setPhase("board");
  };

  const markQuestionUsed = (questionId: string) => {
    updateQuestionUsed(questionId, true);
    setHistory((h) => [...h, { type: "used", questionId }]);
  };

  const movePickerToNextFromOriginalStarter = () => {
    const nextPicker = teams.length > 0 ? nextTeam(pickerTeamIndex, teams.length) : 0;
    const prevPicker = pickerTeamIndex;
    setPickerTeamIndex(nextPicker);
    setHistory((h) => [
      ...h,
      {
        type: "skip",
        questionId: currentQuestion?.id ?? "unknown",
        previousPickerTeamIndex: prevPicker,
        newPickerTeamIndex: nextPicker
      }
    ]);
  };

  const finalizeQuestionAfterResult = (result: "correct" | "all-missed" | "skip") => {
    if (!currentQuestion) return;

    markQuestionUsed(currentQuestion.id);

    // Next question should be picked by next team after original starter.
    movePickerToNextFromOriginalStarter();

    setCurrentQuestion(null);
    setAttemptsOnQuestion(0);
    setQuestionTimeLeft(ATTEMPT_TIME);
    setQuestionAnswerRevealed(false);

    const postAllUsed = questions
      .map((q) => (q.id === currentQuestion.id ? { ...q, used: true } : q))
      .every((q) => q.used);

    if (postAllUsed) {
      setPhase("final");
    } else {
      setPhase("board");
    }
  };

  const handleCorrect = () => {
    if (!currentQuestion) return;

    play(sfx.correct);

    const currentTeam = teams[activeTeamIndex];
    const delta = currentQuestion.points;

    setTeams((prev) =>
      prev.map((t) => (t.id === currentTeam.id ? { ...t, score: t.score + delta } : t))
    );

    setHistory((h) => [
      ...h,
      { type: "score", teamId: currentTeam.id, delta, questionId: currentQuestion.id }
    ]);

    if (currentQuestion.points === 500) {
      confetti({ particleCount: 180, spread: 90 });
    }

    finalizeQuestionAfterResult("correct");
  };

  const handleWrongPass = (reason: "manual" | "timeout" = "manual") => {
    if (!currentQuestion) return;

    play(sfx.wrong);

    // Track missed question for tiebreaker pool
    const currentTeam = teams[activeTeamIndex];
    if (currentTeam) {
      setMissedQuestions((prev) => [...prev, { question: currentQuestion, teamId: currentTeam.id }]);
    }

    const prevActive = activeTeamIndex;
    const prevAttempts = attemptsOnQuestion;
    const prevTimeLeft = questionTimeLeft;

    // 1-team mode => immediate no-points / used
    if (teams.length === 1) {
      finalizeQuestionAfterResult("all-missed");
      return;
    }

    // No re-attempt on same clue cycle: max one attempt per team
    const nextAttempts = attemptsOnQuestion + 1;

    if (nextAttempts >= teams.length) {
      finalizeQuestionAfterResult("all-missed");
      return;
    }

    const nextActive = nextTeam(activeTeamIndex, teams.length);
    setActiveTeamIndex(nextActive);
    setAttemptsOnQuestion(nextAttempts);
    setQuestionTimeLeft(ATTEMPT_TIME); // reset timer each pass
    setQuestionAnswerRevealed(questionAnswerRevealed);

    setHistory((h) => [
      ...h,
      {
        type: "wrong-pass",
        previousActiveTeamIndex: prevActive,
        previousAttemptsOnQuestion: prevAttempts,
        previousTimeLeft: prevTimeLeft
      }
    ]);

    if (reason === "timeout") {
      // no extra action needed; just pass
    }
  };

  const handleSkip = () => {
    if (!currentQuestion) return;
    finalizeQuestionAfterResult("skip");
  };

  const handleManualScore = (teamId: number, newScore: number) => {
    setTeams((prev) => {
      const team = prev.find((x) => x.id === teamId);
      if (!team) return prev;

      setHistory((h) => [
        ...h,
        { type: "manual-score", teamId, oldScore: team.score, newScore: newScore }
      ]);

      return prev.map((x) => (x.id === teamId ? { ...x, score: newScore } : x));
    });
  };

  const handleUndo = () => {
    const last = history[history.length - 1];
    if (!last) return;
    setHistory((h) => h.slice(0, -1));

    switch (last.type) {
      case "score":
        setTeams((prev) =>
          prev.map((t) => (t.id === last.teamId ? { ...t, score: t.score - last.delta } : t))
        );
        // revert used state for that question if needed
        updateQuestionUsed(last.questionId, false);
        break;

      case "used":
        updateQuestionUsed(last.questionId, false);
        break;

      case "manual-score":
        setTeams((prev) =>
          prev.map((t) => (t.id === last.teamId ? { ...t, score: last.oldScore } : t))
        );
        break;

      case "wrong-pass":
        setActiveTeamIndex(last.previousActiveTeamIndex);
        setAttemptsOnQuestion(last.previousAttemptsOnQuestion);
        setQuestionTimeLeft(last.previousTimeLeft);
        break;

      case "skip":
        setPickerTeamIndex(last.previousPickerTeamIndex);
        updateQuestionUsed(last.questionId, false);
        break;

      default:
        break;
    }
  };

  const startTiebreakerIfNeeded = () => {
    if (teams.length === 0) {
      setPhase("final");
      return;
    }

    const sorted = [...teams].sort((a, b) => b.score - a.score);
    const topScore = sorted[0]?.score ?? 0;
    const tied = sorted.filter((t) => t.score === topScore);

    if (tied.length <= 1) {
      setPhase("final");
      return;
    }

    const tiedIds = tied.map((t) => t.id);

    // pool: missed questions by tied teams
    const pool = missedQuestions.filter((m) => tiedIds.includes(m.teamId)).map((m) => m.question);

    if (pool.length === 0) {
      // fallback: random unused or any question
      const anyQ = questions[Math.floor(Math.random() * questions.length)] ?? null;
      if (!anyQ) {
        setPhase("final");
        return;
      }
      const coinFlipWinner = tiedIds[Math.floor(Math.random() * tiedIds.length)];
      play(sfx.coinFlip);
      setTiebreaker({
        tiedTeamIds: tiedIds,
        question: anyQ,
        activeTiebreakerTeamId: coinFlipWinner,
        revealAnswer: false,
        coinFlipWinnerTeamId: coinFlipWinner
      });
      setPhase("tiebreaker");
      return;
    }

    const randomQuestion = pool[Math.floor(Math.random() * pool.length)];
    const coinFlipWinner = tiedIds[Math.floor(Math.random() * tiedIds.length)];
    play(sfx.coinFlip);

    setTiebreaker({
      tiedTeamIds: tiedIds,
      question: randomQuestion,
      activeTiebreakerTeamId: coinFlipWinner,
      revealAnswer: false,
      coinFlipWinnerTeamId: coinFlipWinner
    });
    setPhase("tiebreaker");
  };

  const resolveTiebreaker = (isCorrect: boolean) => {
    const q = tiebreaker.question;
    const teamId = tiebreaker.activeTiebreakerTeamId;
    if (!q || teamId == null) {
      setPhase("final");
      return;
    }

    const delta = q.points * 2;

    setTeams((prev) =>
      prev.map((t) => {
        if (t.id !== teamId) return t;
        return { ...t, score: t.score + (isCorrect ? delta : -delta) };
      })
    );

    // recompute winner or continue tiebreaker if still tie
    setTimeout(() => {
      const latest = [...teams].map((t) => {
        if (t.id !== teamId) return t;
        return { ...t, score: t.score + (isCorrect ? delta : -delta) };
      });

      const sorted = latest.sort((a, b) => b.score - a.score);
      const top = sorted[0]?.score ?? 0;
      const tiedAgain = sorted.filter((t) => t.score === top);

      if (tiedAgain.length > 1) {
        const tiedIds = tiedAgain.map((t) => t.id);
        const pool = missedQuestions
          .filter((m) => tiedIds.includes(m.teamId))
          .map((m) => m.question);
        const randomQuestion =
          pool[Math.floor(Math.random() * Math.max(pool.length, 1))] ??
          questions[Math.floor(Math.random() * questions.length)] ??
          null;

        if (!randomQuestion) {
          setPhase("final");
          return;
        }

        const coinFlipWinner = tiedIds[Math.floor(Math.random() * tiedIds.length)];
        play(sfx.coinFlip);
        setTiebreaker({
          tiedTeamIds: tiedIds,
          question: randomQuestion,
          activeTiebreakerTeamId: coinFlipWinner,
          revealAnswer: false,
          coinFlipWinnerTeamId: coinFlipWinner
        });
        setPhase("tiebreaker");
      } else {
        setPhase("final");
      }
    }, 0);
  };

  const restart = () => {
    setPhase("intro");
    setTeamCount(2);
    setTeams([]);
    setQuestions(initialQuestions.map((q) => ({ ...q, used: false })));
    setCurrentQuestion(null);
    setActiveTeamIndex(0);
    setPickerTeamIndex(0);
    setAttemptsOnQuestion(0);
    setQuestionTimeLeft(ATTEMPT_TIME);
    setQuestionAnswerRevealed(false);
    setHistory([]);
    setMissedQuestions([]);
    setTiebreaker({
      tiedTeamIds: [],
      question: null,
      activeTiebreakerTeamId: null,
      revealAnswer: false,
      coinFlipWinnerTeamId: null
    });
    setSfxEnabled(true);
  };

  return (
    <main>
      {phase === "intro" && <IntroScreen onStart={startFromIntro} />}

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
          <ControlPanel
            teams={teams}
            currentPickerTeamName={teams[pickerTeamIndex]?.name ?? "Team"}
            sfxEnabled={sfxEnabled}
            onToggleSfx={() => setSfxEnabled((v) => !v)}
            onManualScore={handleManualScore}
            onUndo={handleUndo}
            onFinish={startTiebreakerIfNeeded}
          />
        </div>
      )}

      {phase === "question" && currentQuestion && (
        <QuestionModal
          question={currentQuestion}
          teams={teams}
          activeTeamIndex={activeTeamIndex}
          initialTime={questionTimeLeft}
          initialShowAnswer={questionAnswerRevealed}
          onTimeUpdate={setQuestionTimeLeft}
          onRevealUpdate={setQuestionAnswerRevealed}
          onCorrect={handleCorrect}
          onWrongPass={handleWrongPass}
          onSkip={handleSkip}
          onClose={closeQuestionPreserveState}
        />
      )}

      {phase === "tiebreaker" && tiebreaker.question && tiebreaker.activeTiebreakerTeamId != null && (
        <div className="modal">
          <div className="card">
            <h3>🔥 Double-or-Nothing Tiebreaker</h3>
            <p>
              Coin flip winner starts:{" "}
              <strong>{teams.find((t) => t.id === tiebreaker.coinFlipWinnerTeamId)?.name}</strong>
            </p>
            <p>
              Active team:{" "}
              <strong>{teams.find((t) => t.id === tiebreaker.activeTiebreakerTeamId)?.name}</strong>
            </p>
            <p className="clue">{tiebreaker.question.clue}</p>
            {!tiebreaker.revealAnswer ? (
              <button
                onClick={() =>
                  setTiebreaker((prev) => ({
                    ...prev,
                    revealAnswer: true
                  }))
                }
              >
                Reveal Answer
              </button>
            ) : (
              <p className="answer">{tiebreaker.question.answer}</p>
            )}

            <div className="actions">
              <button onClick={() => resolveTiebreaker(true)}>✅ Correct (+2x)</button>
              <button onClick={() => resolveTiebreaker(false)}>❌ Wrong (-2x)</button>
            </div>
          </div>
        </div>
      )}

      {phase === "final" && (
        <FinalScoreboard teams={teams} onPrintable={() => setPhase("printable")} onRestart={restart} />
      )}

      {phase === "printable" && <PrintableSummary teams={teams} onBack={() => setPhase("final")} />}
    </main>
  );
}
