type Props = {
  teamCount: number;
  setTeamCount: (v: number) => void;
  onNext: () => void;
};

export default function TeamSetupScreen({ teamCount, setTeamCount, onNext }: Props) {
  return (
    <section className="screen">
      <h2>Team Setup</h2>
      <p>Select number of teams (1–6)</p>

      <div className="select-wrap">
        <label htmlFor="teamCount">Number of teams</label>
        <select
          id="teamCount"
          value={teamCount}
          onChange={(e) => setTeamCount(Number(e.target.value))}
        >
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? "Team" : "Teams"}
            </option>
          ))}
        </select>
      </div>

      <p className="muted">
        Team names are auto-generated (Team 1, Team 2, ...).
      </p>

      <button onClick={onNext}>Continue</button>
    </section>
  );
}
