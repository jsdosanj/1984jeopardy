import type { Team } from "../types";

type Props = {
  teams: Team[];
  currentPickerTeamName: string;
  sfxEnabled: boolean;
  onToggleSfx: () => void;
  onManualScore: (teamId: number, score: number) => void;
  onUndo: () => void;
  onFinish: () => void;
};

export default function ControlPanel({
  teams,
  currentPickerTeamName,
  sfxEnabled,
  onToggleSfx,
  onManualScore,
  onUndo,
  onFinish
}: Props) {
  return (
    <aside className="panel">
      <h3>Scoreboard</h3>
      <p className="turn-indicator">
        🎯 Current Pick Team: <strong>{currentPickerTeamName}</strong>
      </p>

      <button className="sfx-toggle" onClick={onToggleSfx}>
        {sfxEnabled ? "🔊 Sound: ON" : "🔇 Sound: OFF"}
      </button>

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
