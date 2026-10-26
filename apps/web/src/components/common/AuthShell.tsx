import React from 'react';
import { Box, Card, Container, Stack, Typography } from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { brand } from '../../theme';

const highlights = [
  '10 structured modules, 60 lessons',
  'Real Go compiler in your browser',
  'Quizzes, assignments & capstone project',
  'Verifiable certificate of completion',
];

/** Two-panel card used by Login, Register and Forgot Password pages. */
export const AuthShell: React.FC<{ title: string; subtitle: string; children: React.ReactNode }> = ({
  title,
  subtitle,
  children,
}) => (
  <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
    <Card sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1.1fr' }, overflow: 'hidden' }}>
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          bgcolor: 'primary.main',
          color: '#fff',
          p: 5,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'absolute', top: -60, right: -60, width: 180, height: 180, borderRadius: '50%', border: `6px solid ${brand.yellow}`, opacity: 0.6 }} />
        <Box>
          <AutoAwesomeIcon sx={{ color: 'secondary.main', fontSize: 36 }} />
          <Typography variant="h4" sx={{ mt: 2, lineHeight: 1.25 }}>
            Learn Go the <Box component="span" sx={{ color: 'secondary.main' }}>practical</Box> way.
          </Typography>
        </Box>
        <Stack spacing={1.5} sx={{ mt: 4, position: 'relative' }}>
          {highlights.map((h) => (
            <Stack key={h} direction="row" spacing={1} alignItems="center">
              <CheckCircleRoundedIcon sx={{ color: 'secondary.main', fontSize: 20 }} />
              <Typography variant="body2">{h}</Typography>
            </Stack>
          ))}
        </Stack>
      </Box>

      <Box sx={{ p: { xs: 3, sm: 5 } }}>
        <Typography variant="h4" sx={{ fontSize: 28 }}>{title}</Typography>
        <Typography color="text.secondary" variant="body2" sx={{ mt: 1, mb: 4 }}>{subtitle}</Typography>
        {children}
      </Box>
    </Card>
  </Container>
);
