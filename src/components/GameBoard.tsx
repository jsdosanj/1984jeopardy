import type { Question } from "../types";

type Props = {
  categories: string[];
  questions: Question[];
  onPick: (q: Question) => void;
};

export default function GameBoard({ categories, questions, onPick }: Props) {
  return (
    <div className="board">
      {categories.map((cat) => (
        <div key={cat} className="col">
          <div className="cat">{cat}</div>
          {[100, 200, 300, 400, 500].map((p) => {
            const q = questions.find((x) => x.category === cat && x.points === p)!;
            return (
              <button key={q.id} className="tile" disabled={q.used} onClick={() => onPick(q)}>
                {q.used ? "—" : p}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
