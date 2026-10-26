import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterInput } from '@compilo/shared';
import { Button, Chip, InputAdornment, Link, Stack, TextField, Typography } from '@mui/material';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { useAuth } from '../../context/AuthContext';
import { AuthShell } from '../../components/common/AuthShell';

export const RegisterPage: React.FC = () => {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const passwordVal = watch('password', '');
  const rules = [
    { label: '8+ chars', ok: passwordVal.length >= 8 },
    { label: '1 uppercase', ok: /[A-Z]/.test(passwordVal) },
    { label: '1 number', ok: /[0-9]/.test(passwordVal) },
  ];

  const onSubmit = async (data: RegisterInput) => {
    setSubmitting(true);
    try {
      await registerAuth(data);
      navigate('/dashboard');
    } catch {
      // Handled in AuthContext
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell title="Create an Account" subtitle="Start mastering Go with hands-on coding and a certified path.">
      <Stack component="form" spacing={2.5} onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          label="Full Name"
          placeholder="Ada Lovelace"
          {...register('name')}
          error={!!errors.name}
          helperText={errors.name?.message}
          slotProps={{
            inputLabel: { shrink: true },
            input: { startAdornment: <InputAdornment position="start"><PersonOutlineRoundedIcon fontSize="small" /></InputAdornment> },
          }}
        />
        <TextField
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
          slotProps={{
            inputLabel: { shrink: true },
            input: { startAdornment: <InputAdornment position="start"><MailOutlineRoundedIcon fontSize="small" /></InputAdornment> },
          }}
        />
        <TextField
          label="Password"
          type="password"
          placeholder="At least 8 characters"
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message}
          slotProps={{
            inputLabel: { shrink: true },
            input: { startAdornment: <InputAdornment position="start"><LockOutlinedIcon fontSize="small" /></InputAdornment> },
          }}
        />

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {rules.map((r) => (
            <Chip
              key={r.label}
              size="small"
              icon={<CheckCircleRoundedIcon />}
              label={r.label}
              color={r.ok ? 'success' : 'default'}
              variant={r.ok ? 'filled' : 'outlined'}
            />
          ))}
        </Stack>

        <Button type="submit" variant="contained" size="large" disabled={submitting}>
          {submitting ? 'Creating account...' : 'Create Account'}
        </Button>

        <Typography variant="body2" color="text.secondary" textAlign="center">
          Already have an account?{' '}
          <Link component={RouterLink} to="/login" fontWeight={700}>Sign In</Link>
        </Typography>
      </Stack>
    </AuthShell>
  );
};
