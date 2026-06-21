import { useState, useEffect, useCallback } from 'react';
import type { Slide } from '../data/modules';

interface SlideDeckProps {
  slides: Slide[];
}

export default function SlideDeck({ slides }: SlideDeckProps) {
  const [index, setIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const safeIndex = Math.min(index, slides.length - 1);
  const slide = slides[safeIndex];

  const prev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);
  const next = useCallback(() => setIndex((i) => Math.min(slides.length - 1, i + 1)), [slides.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape' && fullscreen) setFullscreen(false);
      if (e.key === 'f' && !fullscreen) setFullscreen(true);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [prev, next, fullscreen]);

  useEffect(() => { setIndex(0); }, [slides]);

  return (
    <div className={`slide-deck${fullscreen ? ' fullscreen' : ''}`}>
      <button
        className="slide-fullscreen-btn"
        onClick={() => setFullscreen((f) => !f)}
        title={fullscreen ? 'Exit fullscreen (Esc)' : 'Fullscreen (F)'}
        aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      >
        {fullscreen ? '✕' : '⛶'}
      </button>

      <div className={`slide-container${slide.titleSlide ? ' slide-title' : ''}`} role="region" aria-label="Slide content">
        <h2>{slide.title}</h2>

        {slide.quote && (
          <blockquote className="slide-quote">
            <p>{slide.quote.text}</p>
            <cite>— {slide.quote.author}</cite>
          </blockquote>
        )}

        {slide.body && <p className={slide.titleSlide ? 'slide-subtitle' : 'slide-body'}>{slide.body}</p>}

        {slide.image && <img src={slide.image} alt="" className="slide-image" loading="lazy" />}

        {slide.split && (
          <>
            <div className="slide-split">
              <div className="slide-split-side slide-split-side--left">
                <p className="slide-split-label">{slide.split.left.label}</p>
                <ul className="slide-split-points">
                  {slide.split.left.points.map((pt, i) => <li key={i}>{pt}</li>)}
                </ul>
              </div>
              <div className="slide-split-side slide-split-side--right">
                <p className="slide-split-label">{slide.split.right.label}</p>
                <ul className="slide-split-points">
                  {slide.split.right.points.map((pt, i) => <li key={i}>{pt}</li>)}
                </ul>
              </div>
            </div>
            {slide.split.footer && <p className="slide-split-footer">{slide.split.footer}</p>}
          </>
        )}

        {slide.bullets && (
          <ul>
            {slide.bullets.map((b, i) => <li key={i}>{b}</li>)}
          </ul>
        )}

        {slide.highlight && <div className="slide-highlight">{slide.highlight}</div>}

        {slide.link && (
          <a href={slide.link.url} target="_blank" rel="noopener noreferrer" className="slide-link-btn">
            {slide.link.label}
          </a>
        )}
      </div>

      <div className="slide-controls">
        <button onClick={prev} disabled={safeIndex === 0} aria-label="Previous slide">←</button>
        <span className="slide-counter">{safeIndex + 1} / {slides.length}</span>
        <button onClick={next} disabled={safeIndex === slides.length - 1} aria-label="Next slide">→</button>
      </div>
    </div>
  );
}
