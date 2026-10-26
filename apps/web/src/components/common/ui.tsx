import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Chip, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';
import { brand } from '../../theme';

/** Nexora logo: yellow book mark + purple word mark. */
export const BrandLogo: React.FC<{ to?: string; light?: boolean; compact?: boolean }> = ({
  to = '/',
  light = false,
  compact = false,
}) => (
  <Stack
    component={RouterLink}
    to={to}
    direction="row"
    alignItems="center"
    spacing={1}
    sx={{ textDecoration: 'none' }}
  >
    <Box
      sx={{
        width: 34,
        height: 34,
        borderRadius: '10px',
        bgcolor: alpha(brand.yellow, 0.18),
        color: brand.yellowDark,
        display: 'grid',
        placeItems: 'center',
        flexShrink: 0,
      }}
    >
      <AutoStoriesRoundedIcon fontSize="small" />
    </Box>
    {!compact && (
      <Typography
        variant="h6"
        sx={{ color: light ? '#fff' : 'primary.main', fontWeight: 800, letterSpacing: '-0.02em' }}
      >
        Nexora
      </Typography>
    )}
  </Stack>
);

/** Purple-coloured word inside a heading, e.g. "Practical <Accent>Skills</Accent>". */
export const Accent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box component="span" sx={{ color: 'primary.main' }}>
    {children}
  </Box>
);

/** Yellow highlighter box behind a word, like "Elevate" in the reference design. */
export const Marker: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box
    component="span"
    sx={{
      color: 'primary.main',
      bgcolor: 'secondary.main',
      borderRadius: '10px',
      px: 1,
      mx: -0.25,
      boxDecorationBreak: 'clone',
      WebkitBoxDecorationBreak: 'clone',
    }}
  >
    {children}
  </Box>
);

/** Small pill label shown above section headings ("Pricing", "Category", ...). */
export const SectionChip: React.FC<{ label: string; onYellow?: boolean }> = ({ label, onYellow }) => (
  <Chip
    label={label}
    size="small"
    sx={{
      bgcolor: onYellow ? '#fff' : (t) => alpha(t.palette.primary.main, 0.1),
      color: 'primary.main',
      fontSize: 12,
      height: 26,
    }}
  />
);
