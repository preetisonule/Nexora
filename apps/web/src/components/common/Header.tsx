import React, { useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { BrandLogo } from './ui';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Courses', path: '/courses' },
  { label: 'Learning Path', path: '/courses/go-programming/learning-path' },
  { label: 'Certificates', path: '/certificates' },
];

export const Header: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    setMenuAnchor(null);
    await logout();
    navigate('/login');
  };

  const go = (path: string) => {
    setMenuAnchor(null);
    setDrawerOpen(false);
    navigate(path);
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: (t) => alpha(t.palette.background.default, 0.85),
        backdropFilter: 'blur(12px)',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: 72, gap: 2 }}>
          <BrandLogo />

          {/* Desktop navigation (pill style like the reference) */}
          <Stack direction="row" spacing={0.5} sx={{ mx: 'auto', display: { xs: 'none', md: 'flex' } }}>
            {navLinks.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Button
                  key={link.path}
                  component={RouterLink}
                  to={link.path}
                  size="small"
                  sx={{
                    color: active ? 'primary.main' : 'text.secondary',
                    bgcolor: active ? (t) => alpha(t.palette.primary.main, 0.1) : 'transparent',
                    fontWeight: active ? 700 : 500,
                  }}
                >
                  {link.label}
                </Button>
              );
            })}
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center" sx={{ ml: { xs: 'auto', md: 0 } }}>
            <IconButton onClick={toggleTheme} aria-label="Toggle theme" size="small">
              {theme === 'dark' ? <LightModeOutlinedIcon fontSize="small" /> : <DarkModeOutlinedIcon fontSize="small" />}
            </IconButton>

            {isAuthenticated ? (
              <>
                <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)} size="small">
                  <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.main', fontSize: 14 }}>
                    {user?.name.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={menuAnchor}
                  open={Boolean(menuAnchor)}
                  onClose={() => setMenuAnchor(null)}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  slotProps={{ paper: { sx: { width: 230, mt: 1, borderRadius: 3 } } }}
                >
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography fontWeight={700} noWrap>{user?.name}</Typography>
                    <Typography variant="caption" color="text.secondary" noWrap component="p">
                      {user?.email}
                    </Typography>
                  </Box>
                  <Divider />
                  <MenuItem onClick={() => go('/dashboard')}>
                    <ListItemIcon><DashboardOutlinedIcon fontSize="small" /></ListItemIcon>
                    Dashboard
                  </MenuItem>
                  {isAdmin && (
                    <MenuItem onClick={() => go('/admin/dashboard')}>
                      <ListItemIcon><AdminPanelSettingsOutlinedIcon fontSize="small" /></ListItemIcon>
                      Admin Console
                    </MenuItem>
                  )}
                  <MenuItem onClick={() => go('/settings')}>
                    <ListItemIcon><SettingsOutlinedIcon fontSize="small" /></ListItemIcon>
                    Account Settings
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                    <ListItemIcon><LogoutRoundedIcon fontSize="small" color="error" /></ListItemIcon>
                    Sign Out
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  component={RouterLink}
                  to="/login"
                  color="inherit"
                  sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
                >
                  Sign In
                </Button>
                <Button component={RouterLink} to="/register" variant="contained" color="secondary">
                  Get Started
                </Button>
              </>
            )}

            <IconButton
              onClick={() => setDrawerOpen(true)}
              sx={{ display: { md: 'none' } }}
              aria-label="Open menu"
            >
              <MenuRoundedIcon />
            </IconButton>
          </Stack>
        </Toolbar>
      </Container>

      {/* Mobile drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 260, p: 2 }}>
          <BrandLogo />
          <List sx={{ mt: 2 }}>
            {navLinks.map((link) => (
              <ListItemButton
                key={link.path}
                selected={location.pathname === link.path}
                onClick={() => go(link.path)}
              >
                <ListItemText primary={link.label} />
              </ListItemButton>
            ))}
            {isAuthenticated && (
              <ListItemButton onClick={() => go('/dashboard')}>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            )}
            {!isAuthenticated && (
              <ListItemButton onClick={() => go('/login')}>
                <ListItemText primary="Sign In" />
              </ListItemButton>
            )}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};
