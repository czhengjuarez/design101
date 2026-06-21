import { useState } from 'react';
import type { DecisionDrill as Drill } from '../data/modules';

interface Props {
  drill: Drill;
}

const OPTIONS: { key: Drill['answer']; label: string }[] = [
  { key: 'ship', label: 'Ship it' },
  { key: 'fix-yourself', label: 'Fix it yourself' },
  { key: 'escalate', label: 'Call a designer' },
];

export default function DecisionDrill({ drill }: Props) {
  const [picked, setPicked] = useState<Drill['answer'] | null>(null);

  return (
    <div className="drill-card">
      <p className="drill-scenario">{drill.scenario}</p>
      <div className="drill-options" role="group" aria-label="Choose your call">
        {OPTIONS.map((opt) => {
          let cls = 'drill-option';
          if (picked) {
            if (opt.key === drill.answer) cls += ' correct';
            else if (opt.key === picked) cls += ' wrong';
          }
          return (
            <button
              key={opt.key}
              type="button"
              className={cls}
              onClick={() => setPicked(opt.key)}
              disabled={picked !== null}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
      {picked && (
        <div className="drill-rationale">
          {picked === drill.answer ? (
            <strong>Correct — </strong>
          ) : (
            <strong>The stronger call is “{OPTIONS.find((o) => o.key === drill.answer)!.label}.” </strong>
          )}
          {drill.rationale}
        </div>
      )}
    </div>
  );
}
