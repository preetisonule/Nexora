import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Stack, Typography } from '@mui/material';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';

/** Shown instead of an endless loading skeleton when a page's data cannot be loaded. */
export const PageError: React.FC<{ message: string; backTo: string; backLabel: string }> = ({
  message,
  backTo,
  backLabel,
}) => {
  const isLocked = /locked/i.test(message);
  return (
    <Stack alignItems="center" justifyContent="center" textAlign="center" spacing={2} sx={{ minHeight: '60vh', p: 3 }}>
      {isLocked ? (
        <LockRoundedIcon sx={{ fontSize: 56, color: 'secondary.main' }} />
      ) : (
        <ErrorOutlineRoundedIcon sx={{ fontSize: 56, color: 'error.main' }} />
      )}
      <Typography variant="h5">{isLocked ? 'This content is locked' : 'Something went wrong'}</Typography>
      <Typography color="text.secondary" sx={{ maxWidth: 480 }}>{message}</Typography>
      <Button component={RouterLink} to={backTo} variant="contained">
        {backLabel}
      </Button>
    </Stack>
  );
};
