type Props = { onNext: () => void };

export default function RulesScreen({ onNext }: Props) {
  return (
    <section className="screen">
      <h2>Rules</h2>
      <ul>
        <li>Pick a category and point value.</li>
        <li>Clue appears first. Reveal answer after discussion.</li>
        <li>20-second timer per attempt.</li>
        <li>Correct answer = full points.</li>
        <li>Wrong answer = no penalty, pass to next team.</li>
        <li>If all teams miss, no one gets points.</li>
      </ul>
      <button onClick={onNext}>Enter Game</button>
    </section>
  );
}
