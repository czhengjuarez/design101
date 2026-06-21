import { useState } from 'react';
import type { CritiqueExercise as Exercise } from '../data/modules';

interface Props {
  exercise: Exercise;
  index: number;
}

export default function CritiqueExercise({ exercise, index }: Props) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="critique-card">
      <div className="critique-figure">
        {exercise.image ? (
          <img src={exercise.image} alt="UI to critique" loading="lazy" />
        ) : (
          <div className="placeholder">
            Exercise {index + 1} — use a real screen from your own product.
          </div>
        )}
      </div>
      <div className="critique-body">
        <p className="critique-prompt">{exercise.prompt}</p>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => setRevealed((r) => !r)}
          aria-expanded={revealed}
        >
          {revealed ? 'Hide what to look for' : 'Reveal what to look for'}
        </button>
        {revealed && (
          <div className="critique-issues">
            {exercise.issues.map((issue, i) => (
              <div className="critique-issue" key={i}>
                <span className="label">{issue.label}</span>
                <span className="note">{issue.note}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
