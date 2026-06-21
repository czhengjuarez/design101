import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Post {
  id: string;
  title: string;
  description: string;
  name: string | null;
  contact: string | null;
  hasImage: boolean;
  submitted_at: string;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
  return `${Math.floor(months / 12)} year${Math.floor(months / 12) > 1 ? 's' : ''} ago`;
}

function isEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export default function Community() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/community')
      .then((r) => r.json())
      .then((d) => { setPosts(d.posts || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="community-header">
        <div>
          <span className="badge badge--brand">Community</span>
          <h1 style={{ marginTop: 'var(--of-space-4)', fontSize: 'var(--of-text-3xl)', marginBottom: 'var(--of-space-3)' }}>
            Teaching non-designers design
          </h1>
          <p style={{ color: 'var(--of-fg-muted)', fontSize: 'var(--of-text-lg)', maxWidth: '60ch', lineHeight: 'var(--of-leading-relaxed)' }}>
            A space for anyone who has taught — or is teaching — design craft to non-designers.
            Share what you tried, what clicked, what you'd do differently.
          </p>
        </div>
        <Link to="/share" className="btn btn--brand" style={{ flexShrink: 0, alignSelf: 'flex-start', marginTop: 'var(--of-space-2)' }}>
          + Share yours
        </Link>
      </div>

      {loading && (
        <p style={{ color: 'var(--of-fg-subtle)', marginTop: 'var(--of-space-8)' }}>Loading posts…</p>
      )}

      {!loading && posts.length === 0 && (
        <div className="community-empty">
          <p style={{ fontSize: 'var(--of-text-2xl)', marginBottom: 'var(--of-space-4)' }}>🌱</p>
          <p style={{ fontSize: 'var(--of-text-lg)', fontWeight: 600, marginBottom: 'var(--of-space-2)' }}>Nothing here yet.</p>
          <p style={{ color: 'var(--of-fg-muted)', marginBottom: 'var(--of-space-6)' }}>
            Be the first to share what happened when you taught design to non-designers.
          </p>
          <Link to="/share" className="btn btn--brand">Share your experience</Link>
        </div>
      )}

      {!loading && posts.length > 0 && (
        <div className="community-grid">
          {posts.map((post) => {
            const isOpen = expanded === post.id;
            return (
              <article key={post.id} className={`community-card${isOpen ? ' community-card--open' : ''}`}>
                {post.hasImage && (
                  <div className="community-card-image-wrap">
                    <img
                      src={`/api/community/${post.id}/image`}
                      alt={post.title}
                      className="community-card-image"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="community-card-body">
                  <h3 className="community-card-title">{post.title}</h3>
                  <p className={`community-card-desc${isOpen ? ' community-card-desc--open' : ''}`}>
                    {post.description}
                  </p>
                  {post.description.length > 220 && (
                    <button
                      type="button"
                      className="community-card-toggle"
                      onClick={() => setExpanded(isOpen ? null : post.id)}
                    >
                      {isOpen ? 'Show less' : 'Read more'}
                    </button>
                  )}
                  <div className="community-card-footer">
                    <div className="community-card-author">
                      {post.name && <span className="community-card-name">{post.name}</span>}
                      {post.contact && (
                        isEmail(post.contact)
                          ? <a href={`mailto:${post.contact}`} className="community-card-contact">Get in touch ↗</a>
                          : <a href={post.contact} target="_blank" rel="noopener noreferrer" className="community-card-contact">Visit ↗</a>
                      )}
                    </div>
                    <span className="community-card-date">{timeAgo(post.submitted_at)}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
