import React from 'react';
import { Box, Typography } from '@mui/material';

const NEWLINE = String.fromCharCode(10);

/** Renders **bold** and `code` inside one line of text. */
const renderInline = (text: string, keyPrefix: string): React.ReactNode[] =>
  text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) => {
    const key = `${keyPrefix}-${i}`;
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return <strong key={key}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <Box
          key={key}
          component="code"
          sx={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.85em',
            px: 0.75,
            py: 0.25,
            borderRadius: 1,
            bgcolor: 'action.hover',
            color: 'primary.main',
            fontVariantLigatures: 'none',
          }}
        >
          {part.slice(1, -1)}
        </Box>
      );
    }
    return part;
  });

/**
 * Minimal Markdown renderer for lesson text: #/##/### headings, "-" and "1." lists,
 * paragraphs, **bold** and `inline code`. Lesson content only uses these features.
 */
export const SimpleMarkdown: React.FC<{ text: string }> = ({ text }) => {
  const lines = (text || '').replace(/\r\n/g, '\n').split('\n');
  const blocks: React.ReactNode[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  let paragraph: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length) {
      const key = `p-${blocks.length}`;
      blocks.push(
        <Typography key={key} sx={{ mb: 1.5, lineHeight: 1.8 }}>
          {paragraph.map((line, i) => (
            <React.Fragment key={i}>
              {i > 0 && <br />}
              {renderInline(line, `${key}-${i}`)}
            </React.Fragment>
          ))}
        </Typography>
      );
      paragraph = [];
    }
  };

  const flushList = () => {
    if (list) {
      const key = `l-${blocks.length}`;
      blocks.push(
        <Box key={key} component={list.ordered ? 'ol' : 'ul'} sx={{ pl: 3, mb: 1.5, '& li': { mb: 0.75, lineHeight: 1.7 } }}>
          {list.items.map((item, i) => (
            <li key={i}>{renderInline(item, `${key}-${i}`)}</li>
          ))}
        </Box>
      );
      list = null;
    }
  };

  let codeLines: string[] | null = null;

  const pushCodeBlock = (code: string) => {
    blocks.push(
      <Box
        key={`c-${blocks.length}`}
        component="pre"
        sx={{
          m: 0,
          mb: 1.5,
          p: 2,
          borderRadius: 2,
          bgcolor: '#17122B',
          color: '#E9E4FF',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 13,
          lineHeight: 1.7,
          overflowX: 'auto',
          fontVariantLigatures: 'none',
        }}
      >
        {code}
      </Box>
    );
  };

  for (const raw of lines) {
    const line = raw.trimEnd();

    // A backtick (or ``` fence) opened on one line and closed on a later line is a code block
    if (codeLines) {
      if (/^\s*```\s*$/.test(line) || (line.endsWith('`') && !line.endsWith('``'))) {
        const last = line.replace(/`+\s*$/, '');
        if (last.trim()) codeLines.push(last);
        pushCodeBlock(codeLines.join(NEWLINE));
        codeLines = null;
      } else {
        codeLines.push(line);
      }
      continue;
    }
    const fence = line.match(/^\s*```\w*\s*$/);
    const openTick = line.match(/^\s*`([^`]*)$/);
    if (fence || openTick) {
      flushParagraph();
      flushList();
      codeLines = openTick && openTick[1].trim() ? [openTick[1]] : [];
      continue;
    }

    const heading = line.match(/^(#{1,4})\s+(.*)$/);
    const bullet = line.match(/^\s*[-*]\s+(.*)$/);
    const numbered = line.match(/^\s*\d+[.)]\s+(.*)$/);

    if (!line.trim()) {
      flushParagraph();
      flushList();
    } else if (heading) {
      flushParagraph();
      flushList();
      blocks.push(
        <Typography key={`h-${blocks.length}`} variant="h6" sx={{ mt: 2.5, mb: 1, fontSize: heading[1].length <= 2 ? 20 : 17 }}>
          {renderInline(heading[2].replace(/:$/, ''), `h-${blocks.length}`)}
        </Typography>
      );
    } else if (bullet || numbered) {
      flushParagraph();
      const ordered = !!numbered;
      if (list && list.ordered !== ordered) flushList();
      if (!list) list = { ordered, items: [] };
      list.items.push((numbered ? numbered[1] : bullet![1]).trim());
    } else {
      flushList();
      paragraph.push(line);
    }
  }
  if (codeLines) pushCodeBlock(codeLines.join(NEWLINE));
  flushParagraph();
  flushList();

  return <Box>{blocks}</Box>;
};
