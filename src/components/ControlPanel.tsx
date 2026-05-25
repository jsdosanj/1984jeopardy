import type { Team } from "../types";

type Props = {
  teams: Team[];
  onManualScore: (teamId: number, score: number) => void;
  onUndo: () => void;
  onFinish: () => void;
};

export default function ControlPanel({ teams, onManualScore, onUndo, onFinish }: Props) {
  return (
    <aside className="panel">
      <h3>Scoreboard</h3>
      {teams.map((t) => (
        <div key={t.id} className="score-row">
          <span>{t.name}</span>
          <strong>{t.score}</strong>
          <input
            type="number"
            defaultValue={t.score}
            onBlur={(e) => onManualScore(t.id, Number(e.target.value))}
          />
        </div>
      ))}
      <button onClick={onUndo}>↩ Undo Last Action</button>
      <button onClick={onFinish}>Finish Game</button>
    </aside>
  );
}
