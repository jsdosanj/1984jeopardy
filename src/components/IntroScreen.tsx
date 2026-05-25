type Props = { onStart: () => void };

export default function IntroScreen({ onStart }: Props) {
  return (
    <section className="screen">
      <h1>1984 Jeopardy</h1>
      <p>June and November 1984 Sikh History</p>
      <button onClick={onStart}>Start Game</button>
    </section>
  );
}
