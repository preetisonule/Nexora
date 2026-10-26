import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { BrandLogo } from '../common/ui';

const DRAWER_WIDTH = 260;

const navItems = [
  { label: 'Overview', path: '/admin/dashboard', icon: <SpaceDashboardOutlinedIcon /> },
  { label: 'Courses', path: '/admin/courses', icon: <LibraryBooksOutlinedIcon /> },
  { label: 'Modules', path: '/admin/modules', icon: <AccountTreeOutlinedIcon /> },
  { label: 'Lessons', path: '/admin/lessons', icon: <ArticleOutlinedIcon /> },
  { label: 'Quizzes & Tests', path: '/admin/quizzes', icon: <QuizOutlinedIcon /> },
  { label: 'Assignments', path: '/admin/assignments', icon: <CodeRoundedIcon /> },
  { label: 'User Management', path: '/admin/users', icon: <PeopleAltOutlinedIcon /> },
  { label: 'Project Reviews', path: '/admin/projects', icon: <RateReviewOutlinedIcon /> },
  { label: 'Certificates', path: '/admin/certificates', icon: <WorkspacePremiumOutlinedIcon /> },
  { label: 'Analytics', path: '/admin/analytics', icon: <InsightsOutlinedIcon /> },
  { label: 'Audit Logs', path: '/admin/audit-logs', icon: <HistoryRoundedIcon /> },
];

export const AdminLayout: React.FC = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const go = (path: string) => {
    setMobileOpen(false);
    navigate(path);
  };

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar sx={{ minHeight: 72, gap: 1 }}>
        <BrandLogo to="/admin/dashboard" />
        <Chip label="Admin" size="small" color="secondary" />
      </Toolbar>
      <Divider />
      <List sx={{ px: 1.5, py: 2, flex: 1, overflowY: 'auto' }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.path}
            selected={location.pathname === item.path}
            onClick={() => go(item.path)}
            sx={{ mb: 0.5 }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} slotProps={{ primary: { fontSize: 14, fontWeight: 600 } }} />
          </ListItemButton>
        ))}
      </List>
      <Box sx={{ p: 2 }}>
        <Button fullWidth variant="outlined" startIcon={<ArrowBackRoundedIcon />} onClick={() => go('/dashboard')}>
          Exit to Learner Platform
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: (t) => (t.palette.mode === 'dark' ? 'background.default' : '#F8F6FD') }}>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH } }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, borderRight: 1, borderColor: 'divider' },
        }}
      >
        {drawer}
      </Drawer>

      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <AppBar position="sticky" sx={{ bgcolor: (t) => alpha(t.palette.background.paper, 0.9), backdropFilter: 'blur(10px)', borderBottom: 1, borderColor: 'divider' }}>
          <Toolbar sx={{ minHeight: 72, gap: 2 }}>
            <IconButton onClick={() => setMobileOpen(true)} sx={{ display: { md: 'none' } }} aria-label="Open menu">
              <MenuRoundedIcon />
            </IconButton>
            <Stack direction="row" spacing={1} alignItems="center">
              <VerifiedUserOutlinedIcon color="success" fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                Role: <b style={{ textTransform: 'uppercase' }}>{user?.role}</b>
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ ml: 'auto' }}>
              <IconButton onClick={toggleTheme} aria-label="Toggle theme">
                {theme === 'dark' ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
              </IconButton>
              <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.main', fontSize: 14 }}>
                {user?.name.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="body2" fontWeight={700} lineHeight={1.2}>{user?.name}</Typography>
                <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
              </Box>
            </Stack>
          </Toolbar>
        </AppBar>

        <Box component="main" sx={{ flex: 1, p: { xs: 2, md: 4 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};
