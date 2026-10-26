import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button, InputAdornment, Stack, TextField } from '@mui/material';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { ApiClient } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { AuthShell } from '../../components/common/AuthShell';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [submitting, setSubmitting] = useState(false);
  const { success, error } = useToast();

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res: any = await ApiClient.post('/auth/forgot-password', { email });
      success('Reset token generated. Please enter your new password.');
      if (res?.resetToken) {
        setToken(res.resetToken);
      }
      setStep('reset');
    } catch (err: any) {
      error(err.message || 'Failed to request password reset');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await ApiClient.post('/auth/reset-password', { token, newPassword });
      success('Password reset successfully! You can now sign in.');
      setStep('request');
      setEmail('');
      setNewPassword('');
    } catch (err: any) {
      error(err.message || 'Failed to reset password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title={step === 'request' ? 'Reset Password' : 'Set New Password'}
      subtitle={
        step === 'request'
          ? 'Enter your account email to receive a password reset token.'
          : 'Enter the reset token and choose a new password.'
      }
    >
      {step === 'request' ? (
        <Stack component="form" spacing={2.5} onSubmit={handleRequest}>
          <TextField
            label="Account Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            slotProps={{
              inputLabel: { shrink: true },
              input: { startAdornment: <InputAdornment position="start"><MailOutlineRoundedIcon fontSize="small" /></InputAdornment> },
            }}
          />
          <Button type="submit" variant="contained" size="large" disabled={submitting}>
            {submitting ? 'Generating Token...' : 'Send Reset Instructions'}
          </Button>
        </Stack>
      ) : (
        <Stack component="form" spacing={2.5} onSubmit={handleReset}>
          <TextField
            label="Reset Token"
            required
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Paste token"
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                sx: { fontFamily: 'JetBrains Mono, monospace' },
                startAdornment: <InputAdornment position="start"><KeyRoundedIcon fontSize="small" /></InputAdornment>,
              },
            }}
          />
          <TextField
            label="New Password"
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="At least 8 chars, 1 uppercase, 1 number"
            slotProps={{
              inputLabel: { shrink: true },
              input: { startAdornment: <InputAdornment position="start"><LockOutlinedIcon fontSize="small" /></InputAdornment> },
            }}
          />
          <Button type="submit" variant="contained" size="large" disabled={submitting}>
            {submitting ? 'Updating Password...' : 'Save New Password'}
          </Button>
        </Stack>
      )}

      <Button component={RouterLink} to="/login" startIcon={<ArrowBackRoundedIcon />} sx={{ mt: 2 }} fullWidth>
        Back to Sign In
      </Button>
    </AuthShell>
  );
};
