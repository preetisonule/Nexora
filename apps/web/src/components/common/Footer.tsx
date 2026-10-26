import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Container, Divider, Link, Stack, Typography } from '@mui/material';
import { BrandLogo } from './ui';

const columns = [
  {
    title: 'Curriculum',
    links: [
      { label: 'Go Programming Course', to: '/courses/go-programming' },
      { label: 'All Courses', to: '/courses' },
      { label: 'Learning Path', to: '/courses/go-programming/learning-path' },
      { label: 'Capstone Project', to: '/projects' },
    ],
  },
  {
    title: 'Platform',
    links: [
      { label: 'Dashboard', to: '/dashboard' },
      { label: 'My Certificates', to: '/certificates' },
      { label: 'Verify a Certificate', to: '/verify' },
      { label: 'Account Settings', to: '/settings' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Create Account', to: '/register' },
      { label: 'Sign In', to: '/login' },
      { label: 'Forgot Password', to: '/forgot-password' },
    ],
  },
];

export const Footer: React.FC = () => (
  <Box component="footer" sx={{ bgcolor: '#1A1033', color: 'rgba(255,255,255,0.7)', mt: 'auto' }}>
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box
        sx={{
          display: 'grid',
          gap: 5,
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1.6fr 1fr 1fr 1fr' },
        }}
      >
        <Stack spacing={2}>
          <BrandLogo light />
          <Typography variant="body2" sx={{ maxWidth: 300, lineHeight: 1.8 }}>
            A structured learning platform for mastering the Go programming language with real
            coding practice, assessments and verifiable certificates.
          </Typography>
          <Typography variant="body2" sx={{ color: 'secondary.main', fontWeight: 700 }}>
            Learn. Practice. Build. Prove.
          </Typography>
        </Stack>

        {columns.map((col) => (
          <Stack key={col.title} spacing={1.5}>
            <Typography sx={{ color: '#fff', fontWeight: 700 }}>{col.title}</Typography>
            {col.links.map((l) => (
              <Link
                key={l.to}
                component={RouterLink}
                to={l.to}
                underline="none"
                variant="body2"
                sx={{ color: 'inherit', '&:hover': { color: 'secondary.main' } }}
              >
                {l.label}
              </Link>
            ))}
          </Stack>
        ))}
      </Box>

      <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.1)' }} />

      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1}>
        <Typography variant="caption">© {new Date().getFullYear()} Nexora. College mini project.</Typography>
        <Typography variant="caption">Built with React, Material UI, Node.js, MongoDB &amp; Go</Typography>
      </Stack>
    </Container>
  </Box>
);
