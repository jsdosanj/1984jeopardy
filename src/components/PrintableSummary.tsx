import type { Team } from "../types";

type Props = { teams: Team[]; onBack: () => void };

export default function PrintableSummary({ teams, onBack }: Props) {
  return (
    <section className="screen print">
      <h2>Printable Summary</h2>
      <p>1984 Jeopardy — June and November 1984 Sikh History</p>
      <table>
        <thead>
          <tr><th>Team</th><th>Score</th></tr>
        </thead>
        <tbody>
          {teams.map((t) => (
            <tr key={t.id}><td>{t.name}</td><td>{t.score}</td></tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => window.print()}>Print</button>
      <button onClick={onBack}>Back</button>
    </section>
  );
}
