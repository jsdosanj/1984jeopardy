import type { Team } from "../types";

type Props = {
  teams: Team[];
  onPrintable: () => void;
  onRestart: () => void;
};

export default function FinalScoreboard({ teams, onPrintable, onRestart }: Props) {
  const sorted = [...teams].sort((a, b) => b.score - a.score);

  return (
    <section className="screen">
      <h2>Final Scoreboard</h2>
      <ol>
        {sorted.map((t) => (
          <li key={t.id}>{t.name}: {t.score}</li>
        ))}
      </ol>
      <button onClick={onPrintable}>View Printable Summary</button>
      <button onClick={onRestart}>Play Again</button>
    </section>
  );
}
