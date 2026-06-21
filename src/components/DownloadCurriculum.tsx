import type { Module, Slide } from '../data/modules';

interface Props {
  module: Module;
}

function slideToMarkdown(slide: Slide): string {
  const lines: string[] = [`## ${slide.title}`];

  if (slide.body) lines.push('', slide.body);

  if (slide.quote) {
    lines.push('', `> ${slide.quote.text}`, `> — *${slide.quote.author}*`);
  }

  if (slide.bullets && slide.bullets.length) {
    lines.push('');
    slide.bullets.forEach((b) => lines.push(`- ${b}`));
  }

  if (slide.highlight) lines.push('', `**${slide.highlight}**`);

  if (slide.split) {
    lines.push('', `**${slide.split.left.label}**`);
    slide.split.left.points.forEach((p) => lines.push(`- ${p}`));
    lines.push('', `**${slide.split.right.label}**`);
    slide.split.right.points.forEach((p) => lines.push(`- ${p}`));
    if (slide.split.footer) lines.push('', `*${slide.split.footer}*`);
  }

  if (slide.link) lines.push('', `[${slide.link.label}](${slide.link.url})`);

  return lines.join('\n');
}

function moduleToMarkdown(mod: Module): string {
  const header = [
    `# Module ${mod.number}: ${mod.title} — ${mod.subtitle}`,
    `**Arc:** ${mod.arc}`,
    '',
    mod.description,
    '',
    '---',
    '',
  ].join('\n');

  const slides = mod.slides
    .map((s) => slideToMarkdown(s))
    .join('\n\n---\n\n');

  const resourceSection = mod.resources.length
    ? [
        '',
        '---',
        '',
        '## Resources',
        ...mod.resources.map((r) => `- [${r.title}](${r.url}) — ${r.description}`),
      ].join('\n')
    : '';

  const bookSection = mod.books.length
    ? [
        '',
        '---',
        '',
        '## Books',
        ...mod.books.map((b) => `- **${b.title}** by ${b.author}${b.note ? ` — ${b.note}` : ''}`),
      ].join('\n')
    : '';

  return header + slides + resourceSection + bookSection;
}

function download(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function DownloadCurriculum({ module: mod }: Props) {
  function handleDownload() {
    const content = moduleToMarkdown(mod);
    const filename = `design101-module-${mod.number}-${mod.id}.md`;
    download(filename, content);
  }

  return (
    <button
      type="button"
      className="btn btn--ghost"
      onClick={handleDownload}
      title="Download this module as a Markdown file"
    >
      ↓ Download curriculum
    </button>
  );
}
