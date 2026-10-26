import { alpha, createTheme } from '@mui/material/styles';

// Design tokens inspired by the "Eduvance" education template:
// vivid purple as the main brand colour, warm yellow as the accent.
export const brand = {
  purple: '#7C3AED',
  purpleDark: '#5B21B6',
  purpleLight: '#A78BFA',
  lavender: '#F3EEFF',
  yellow: '#FFC727',
  yellowDark: '#F5B400',
  ink: '#1E1B2E',
  muted: '#6B6880',
  pink: '#FF5DA2',
  green: '#22C55E',
};

export const buildTheme = (mode: 'light' | 'dark') => {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: brand.purple,
        dark: brand.purpleDark,
        light: brand.purpleLight,
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: brand.yellow,
        dark: brand.yellowDark,
        contrastText: brand.ink,
      },
      background: {
        default: isDark ? '#100C1C' : '#FFFFFF',
        paper: isDark ? '#1A1529' : '#FFFFFF',
      },
      text: {
        primary: isDark ? '#F4F1FB' : brand.ink,
        secondary: isDark ? '#A9A4BC' : brand.muted,
      },
      divider: isDark ? 'rgba(255,255,255,0.08)' : '#ECE8F5',
    },
    shape: { borderRadius: 14 },
    typography: {
      fontFamily: '"Plus Jakarta Sans", "Inter", system-ui, sans-serif',
      h1: { fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15 },
      h2: { fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2 },
      h3: { fontWeight: 700, letterSpacing: '-0.01em' },
      h4: { fontWeight: 700 },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 700 },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    components: {
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: { borderRadius: 999, paddingInline: 20 },
          sizeLarge: { paddingBlock: 12, paddingInline: 28, fontSize: '0.95rem' },
        },
      },
      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 20,
            border: `1px solid ${theme.palette.divider}`,
          }),
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 600, borderRadius: 999 },
        },
      },
      MuiAppBar: {
        defaultProps: { elevation: 0, color: 'inherit' },
      },
      MuiTextField: {
        defaultProps: { size: 'small', fullWidth: true },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: { borderRadius: 12 },
        },
      },
      MuiAccordion: {
        defaultProps: { elevation: 0, disableGutters: true },
        styleOverrides: {
          root: ({ theme }) => ({
            borderBottom: `1px solid ${theme.palette.divider}`,
            background: 'transparent',
            '&::before': { display: 'none' },
          }),
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 12,
            '&.Mui-selected': {
              backgroundColor: alpha(theme.palette.primary.main, isDark ? 0.2 : 0.1),
              color: theme.palette.primary.main,
              '& .MuiListItemIcon-root': { color: theme.palette.primary.main },
            },
          }),
        },
      },
    },
  });
};

// Soft lavender surface that also works in dark mode.
export const softSurface = (mode: 'light' | 'dark') =>
  mode === 'dark' ? alpha(brand.purple, 0.14) : brand.lavender;
