import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePasswordSchema, ChangePasswordInput, updateProfileSchema, UpdateProfileInput } from '@compilo/shared';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { ApiClient } from '../../services/api';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';

const SectionTitle: React.FC<{ icon: React.ReactNode; title: string; subtitle: string }> = ({ icon, title, subtitle }) => (
  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
    <Box sx={{ color: 'primary.main', display: 'flex' }}>{icon}</Box>
    <Box>
      <Typography variant="h6" lineHeight={1.2}>{title}</Typography>
      <Typography variant="body2" color="text.secondary">{subtitle}</Typography>
    </Box>
  </Stack>
);

export const SettingsPage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { success, error } = useToast();

  const profileForm = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name: user?.name || '' },
  });
  const passwordForm = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '' },
  });

  useEffect(() => {
    if (user) profileForm.reset({ name: user.name });
  }, [user?.name]);

  const saveProfile = async (data: UpdateProfileInput) => {
    try {
      await ApiClient.patch('/auth/me', data);
      await refreshUser();
      success('Profile updated.');
    } catch (err: any) {
      error(err.message || 'Could not update profile');
    }
  };

  const savePassword = async (data: ChangePasswordInput) => {
    try {
      await ApiClient.post('/auth/change-password', data);
      passwordForm.reset();
      success('Password changed. Use the new password next time you sign in.');
    } catch (err: any) {
      error(err.message || 'Could not change password');
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4, pb: 10 }}>
      <Breadcrumbs items={[{ label: 'Settings' }]} />
      <Typography variant="h4" sx={{ mt: 2 }}>Account Settings</Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Manage your profile, password and appearance.
      </Typography>

      <Stack spacing={3}>
        <Card>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <SectionTitle icon={<PersonOutlineRoundedIcon />} title="Profile" subtitle="Your name appears on certificates." />
            <Stack component="form" spacing={2.5} onSubmit={profileForm.handleSubmit(saveProfile)} noValidate>
              <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
                <TextField
                  label="Full Name"
                  {...profileForm.register('name')}
                  error={!!profileForm.formState.errors.name}
                  helperText={profileForm.formState.errors.name?.message}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
                <TextField
                  label="Email Address"
                  value={user?.email || ''}
                  disabled
                  helperText="Email cannot be changed"
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2" color="text.secondary">Role:</Typography>
                <Chip size="small" color="primary" label={user?.role} sx={{ textTransform: 'capitalize' }} />
              </Stack>
              <Box>
                <Button type="submit" variant="contained" disabled={profileForm.formState.isSubmitting}>
                  {profileForm.formState.isSubmitting ? 'Saving...' : 'Save Profile'}
                </Button>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <SectionTitle icon={<LockOutlinedIcon />} title="Change Password" subtitle="At least 8 characters, 1 uppercase letter and 1 number." />
            <Stack component="form" spacing={2.5} onSubmit={passwordForm.handleSubmit(savePassword)} noValidate>
              <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
                <TextField
                  label="Current Password"
                  type="password"
                  autoComplete="current-password"
                  {...passwordForm.register('currentPassword')}
                  error={!!passwordForm.formState.errors.currentPassword}
                  helperText={passwordForm.formState.errors.currentPassword?.message}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
                <TextField
                  label="New Password"
                  type="password"
                  autoComplete="new-password"
                  {...passwordForm.register('newPassword')}
                  error={!!passwordForm.formState.errors.newPassword}
                  helperText={passwordForm.formState.errors.newPassword?.message}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Box>
              <Box>
                <Button type="submit" variant="contained" disabled={passwordForm.formState.isSubmitting}>
                  {passwordForm.formState.isSubmitting ? 'Updating...' : 'Update Password'}
                </Button>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <SectionTitle icon={<PaletteOutlinedIcon />} title="Appearance" subtitle="Your choice is saved in this browser." />
            <Divider sx={{ mb: 2 }} />
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography>Currently using <b>{theme}</b> mode</Typography>
              <Button
                variant="outlined"
                onClick={toggleTheme}
                startIcon={theme === 'dark' ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
              >
                Switch to {theme === 'dark' ? 'Light' : 'Dark'}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
};
