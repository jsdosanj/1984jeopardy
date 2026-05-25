type Props = {
  teamCount: number;
  setTeamCount: (v: number) => void;
  onNext: () => void;
};

export default function TeamSetupScreen({ teamCount, setTeamCount, onNext }: Props) {
  return (
    <section className="screen">
      <h2>Team Setup</h2>
      <p>Select number of teams (2–4)</p>
      <div className="team-options">
        {[2, 3, 4].map((n) => (
          <button
            key={n}
            className={teamCount === n ? "selected" : ""}
            onClick={() => setTeamCount(n)}
          >
            {n} Teams
          </button>
        ))}
      </div>
      <button onClick={onNext}>Continue</button>
    </section>
  );
}
