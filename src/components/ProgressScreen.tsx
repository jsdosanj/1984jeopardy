type Props = { title: string; onNext: () => void };

export default function ProgressScreen({ title, onNext }: Props) {
  return (
    <section className="screen">
      <h2>{title}</h2>
      <p>Loading next section...</p>
      <button onClick={onNext}>Continue</button>
    </section>
  );
}
