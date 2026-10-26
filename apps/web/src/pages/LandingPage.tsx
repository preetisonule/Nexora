import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  IconButton,
  Paper,
  Stack,
  Typography,
  useTheme as useMuiTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import RocketLaunchRoundedIcon from '@mui/icons-material/RocketLaunchRounded';
import Brightness5RoundedIcon from '@mui/icons-material/Brightness5Rounded';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import FilterVintageRoundedIcon from '@mui/icons-material/FilterVintageRounded';
import AcUnitRoundedIcon from '@mui/icons-material/AcUnitRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import TerminalRoundedIcon from '@mui/icons-material/TerminalRounded';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import LockOpenRoundedIcon from '@mui/icons-material/LockOpenRounded';
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded';
import QuizRoundedIcon from '@mui/icons-material/QuizRounded';
import StorageRoundedIcon from '@mui/icons-material/StorageRounded';
import DataObjectRoundedIcon from '@mui/icons-material/DataObjectRounded';
import HubRoundedIcon from '@mui/icons-material/HubRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import LayersRoundedIcon from '@mui/icons-material/LayersRounded';
import { Accent, Marker, SectionChip } from '../components/common/ui';
import { brand, softSurface } from '../theme';

const heroSnippet = `package main

import "fmt"

func main() {
    messages := make(chan string)
    go func() {
        messages <- "Hello, Go Developer!"
    }()
    fmt.Println(<-messages)
}`;

const techStack = [
  { label: 'Go', icon: <BoltRoundedIcon /> },
  { label: 'React', icon: <HubRoundedIcon /> },
  { label: 'Material UI', icon: <LayersRoundedIcon /> },
  { label: 'Node.js', icon: <DataObjectRoundedIcon /> },
  { label: 'MongoDB', icon: <StorageRoundedIcon /> },
];

const categories = [
  { title: 'Go Foundations', meta: 'Modules 1–3 · 18 Lessons', icon: <Brightness5RoundedIcon /> },
  { title: 'Data & Types', meta: 'Modules 4–5 · 12 Lessons', icon: <GridViewRoundedIcon /> },
  { title: 'Interfaces & Tooling', meta: 'Modules 6–8 · 18 Lessons', icon: <FilterVintageRoundedIcon />, featured: true },
  { title: 'Concurrency & Capstone', meta: 'Modules 9–10 · 12 Lessons', icon: <AcUnitRoundedIcon /> },
];

const values = [
  { title: 'Learn by Doing', desc: 'Every lesson comes with runnable Go examples and practice tasks.', icon: <CodeRoundedIcon /> },
  { title: 'Real Go Compiler', desc: 'Your code runs on a real Go toolchain, graded by hidden test cases.', icon: <TerminalRoundedIcon /> },
  { title: 'Step-by-Step Mastery', desc: 'Modules unlock in order once you pass the quiz and module test.', icon: <LockOpenRoundedIcon /> },
  { title: 'Verified Credentials', desc: 'Earn a certificate with a unique ID that anyone can verify online.', icon: <WorkspacePremiumRoundedIcon /> },
];

const plans = [
  {
    name: 'Visitor',
    desc: 'Explore the platform before creating an account.',
    price: 'Free',
    unit: 'no sign-up',
    features: [
      { text: 'Browse course catalog', ok: true },
      { text: 'View full syllabus', ok: true },
      { text: 'Verify certificates', ok: true },
      { text: 'Coding sandbox', ok: false },
      { text: 'Earn certificate', ok: false },
    ],
    cta: 'Browse Courses',
    to: '/courses',
  },
  {
    name: 'Learner',
    desc: 'Full access for students learning Go from scratch.',
    price: 'Free',
    unit: '/forever',
    best: true,
    features: [
      { text: 'All 10 modules & 60 lessons', ok: true },
      { text: 'Monaco code editor + Go runner', ok: true },
      { text: 'Quizzes & module assessments', ok: true },
      { text: 'Capstone project review', ok: true },
      { text: 'Downloadable certificate', ok: true },
    ],
    cta: 'Get Started Today',
    to: '/register',
  },
  {
    name: 'Admin',
    desc: 'For instructors and staff managing the content.',
    price: 'Staff',
    unit: 'role-based',
    features: [
      { text: 'Manage courses & modules', ok: true },
      { text: 'Lessons, quizzes & assignments', ok: true },
      { text: 'User & role management', ok: true },
      { text: 'Analytics dashboard', ok: true },
      { text: 'Audit logs', ok: true },
    ],
    cta: 'Admin Sign In',
    to: '/login',
  },
];

const steps = [
  { title: 'Create Your Account', desc: 'Register for free and Module 1 is unlocked instantly.', icon: <PersonAddAlt1RoundedIcon /> },
  { title: 'Study the Lessons', desc: 'Read concepts, run examples and check your understanding.', icon: <MenuBookRoundedIcon /> },
  { title: 'Code & Get Assessed', desc: 'Solve coding assignments and score 70%+ on quizzes and tests.', icon: <QuizRoundedIcon /> },
  { title: 'Earn Your Certificate', desc: 'Submit the capstone project and claim a verifiable certificate.', icon: <WorkspacePremiumRoundedIcon /> },
];

const posts = [
  { tag: 'Learning Tips', title: 'How to Think in Go When You Come From Python or Java', date: 'Module 1', color: '#C4B5FD' },
  { tag: 'Concurrency', title: 'Goroutines and Channels Explained Simply', date: 'Module 9', color: '#FDE68A' },
  { tag: 'Best Practice', title: 'Idiomatic Error Handling in Go', date: 'Module 7', color: '#FBCFE8' },
  { tag: 'Testing', title: 'Writing Table-Driven Tests', date: 'Module 10', color: '#BBF7D0' },
  { tag: 'Design', title: 'Interfaces and Composition Over Inheritance', date: 'Module 6', color: '#BAE6FD' },
];

const faqs = [
  {
    q: 'Do I get a certificate after completing the course?',
    a: 'Yes. Complete all 10 modules, pass every quiz and module test with at least 70%, and submit the CLI Task Manager capstone project. You then receive a certificate with a unique ID and a public verification page.',
  },
  {
    q: 'Can I learn at my own pace?',
    a: 'Absolutely. Your progress is saved automatically, so you can stop at any time and continue exactly where you left off from the dashboard.',
  },
  {
    q: 'How does code execution work?',
    a: 'You write code in the built-in Monaco editor. The backend compiles and runs it with a real Go toolchain inside a time-limited sandbox, then checks the output against visible and hidden test cases.',
  },
  {
    q: 'What do I need to know before starting?',
    a: 'Basic programming knowledge in any language (Python, Java, JavaScript, C) is enough. Go syntax, pointers and concurrency are taught from the ground up.',
  },
  {
    q: 'How do modules unlock?',
    a: 'Module 1 is open immediately. Each next module unlocks once you finish the lessons, pass the quizzes and coding assignments, and clear the module assessment.',
  },
];

const SectionHeading: React.FC<{ chip: string; children: React.ReactNode; sub?: string; center?: boolean }> = ({
  chip,
  children,
  sub,
  center = true,
}) => (
  <Stack spacing={1.5} alignItems={center ? 'center' : 'flex-start'} textAlign={center ? 'center' : 'left'} sx={{ mb: 6 }}>
    <SectionChip label={chip} />
    <Typography variant="h3" sx={{ fontSize: { xs: 30, md: 40 }, maxWidth: 640 }}>
      {children}
    </Typography>
    {sub && (
      <Typography color="text.secondary" sx={{ maxWidth: 560 }}>
        {sub}
      </Typography>
    )}
  </Stack>
);

export const LandingPage: React.FC = () => {
  const muiTheme = useMuiTheme();
  const mode = muiTheme.palette.mode;

  return (
    <Box sx={{ overflowX: 'hidden' }}>
      {/* 1. HERO */}
      <Container maxWidth="lg" sx={{ pt: { xs: 6, md: 10 }, pb: 8 }}>
        <Box sx={{ display: 'grid', gap: 6, alignItems: 'center', gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(0, 1.05fr) minmax(0, 1fr)' } }}>
          <Stack spacing={3}>
            <Box><SectionChip label="Best Go Learning Platform" /></Box>
            <Typography variant="h1" sx={{ fontSize: { xs: 34, sm: 52, md: 60 } }}>
              <Marker>Master</Marker> Your Future With{' '}
              <AutoAwesomeIcon sx={{ color: 'secondary.main', fontSize: 36, verticalAlign: 'middle' }} />{' '}
              Practical <Accent>Go Skills</Accent>
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 480, fontSize: 17, lineHeight: 1.7 }}>
              Structured lessons, hands-on coding challenges on a real Go compiler, and a verified
              certificate — designed to fit your schedule.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button component={RouterLink} to="/register" variant="contained" color="secondary" size="large">
                Get Started Today
              </Button>
              <Button component={RouterLink} to="/courses/go-programming" variant="outlined" size="large">
                Explore Curriculum
              </Button>
            </Stack>
            <Stack direction="row" spacing={{ xs: 3, sm: 6 }} sx={{ pt: 2 }}>
              {[
                { n: '10+', l: 'Structured Modules' },
                { n: '60', l: 'Lessons Available' },
                { n: '50+', l: 'Coding Challenges' },
              ].map((s) => (
                <Box key={s.l}>
                  <Typography sx={{ fontSize: { xs: 28, md: 36 }, fontWeight: 700 }}>{s.n}</Typography>
                  <Typography variant="body2" color="text.secondary">{s.l}</Typography>
                </Box>
              ))}
            </Stack>
          </Stack>

          {/* Hero visual: lavender panel with code card and floating badges */}
          <Box sx={{ position: 'relative', px: { xs: 1, sm: 4 }, py: 4 }}>
            <Box
              sx={{
                position: 'absolute',
                inset: { xs: '0 0 0 0', sm: '0 0 0 40px' },
                borderRadius: '32px',
                bgcolor: softSurface(mode),
              }}
            />
            <Paper
              elevation={0}
              sx={{
                position: 'relative',
                mt: 6,
                mx: { xs: 1, sm: 4 },
                bgcolor: '#17122B',
                color: '#E9E4FF',
                borderRadius: 4,
                overflow: 'hidden',
                boxShadow: '0 24px 60px rgba(76, 29, 149, 0.25)',
              }}
            >
              <Stack direction="row" spacing={0.75} alignItems="center" sx={{ px: 2, py: 1.25, bgcolor: 'rgba(255,255,255,0.05)' }}>
                {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
                  <Box key={c} sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: c }} />
                ))}
                <Typography variant="caption" sx={{ ml: 1.5, fontFamily: 'JetBrains Mono, monospace', opacity: 0.6 }}>
                  main.go
                </Typography>
              </Stack>
              <Box
                component="pre"
                sx={{ m: 0, p: 2.5, fontFamily: 'JetBrains Mono, monospace', fontSize: 13, lineHeight: 1.7, color: '#C4B5FD', overflowX: 'auto', fontVariantLigatures: 'none' }}
              >
                {heroSnippet}
              </Box>
              <Box sx={{ px: 2.5, py: 1.5, borderTop: '1px solid rgba(255,255,255,0.08)', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>
                <Box component="span" sx={{ color: brand.yellow }}>$ go run main.go</Box>
                <br />
                Hello, Go Developer!
              </Box>
            </Paper>

            {/* Satisfaction gauge */}
            <Paper
              sx={{ position: 'absolute', top: 0, left: { xs: 8, sm: 0 }, p: 1.5, borderRadius: 3, textAlign: 'center', boxShadow: 3 }}
            >
              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress variant="determinate" value={90} size={56} thickness={5} color="secondary" />
                <Typography sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 14 }}>
                  90%
                </Typography>
              </Box>
              <Typography variant="caption" display="block" color="text.secondary">Pass Rate</Typography>
            </Paper>

            {/* Video badge */}
            <Box
              sx={{
                position: 'absolute', top: 16, right: 8, width: 44, height: 44, borderRadius: '50%',
                bgcolor: alpha(brand.pink, 0.15), color: brand.pink, display: 'grid', placeItems: 'center',
              }}
            >
              <VideocamRoundedIcon />
            </Box>

            {/* Learners card */}
            <Paper sx={{ position: 'absolute', bottom: -12, right: { xs: 8, sm: 0 }, p: 1.5, borderRadius: 3, boxShadow: 3, maxWidth: 200 }}>
              <AvatarGroup max={4} sx={{ justifyContent: 'flex-end', '& .MuiAvatar-root': { width: 30, height: 30, fontSize: 12 } }}>
                <Avatar sx={{ bgcolor: brand.purple }}>A</Avatar>
                <Avatar sx={{ bgcolor: brand.yellowDark }}>R</Avatar>
                <Avatar sx={{ bgcolor: brand.pink }}>S</Avatar>
                <Avatar sx={{ bgcolor: brand.green }}>K</Avatar>
              </AvatarGroup>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.75 }}>
                Students across the college are learning Go here
              </Typography>
            </Paper>
          </Box>
        </Box>
      </Container>

      {/* 2. TECH STACK STRIP (logo row) */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack direction="row" flexWrap="wrap" justifyContent="space-around" gap={3} sx={{ color: 'text.disabled' }}>
          {techStack.map((t) => (
            <Stack key={t.label} direction="row" spacing={1} alignItems="center">
              {t.icon}
              <Typography fontWeight={700} color="inherit">{t.label}</Typography>
            </Stack>
          ))}
        </Stack>
      </Container>

      {/* 3. CATEGORIES (yellow block) */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            bgcolor: 'secondary.main',
            borderRadius: '32px',
            p: { xs: 3, md: 6 },
          }}
        >
          {/* Decorative rings */}
          <Box sx={{ position: 'absolute', top: -60, right: 40, width: 160, height: 160, borderRadius: '50%', border: `6px solid ${brand.purple}`, opacity: 0.7 }} />
          <Box sx={{ position: 'absolute', top: 20, right: -50, width: 120, height: 120, borderRadius: '50%', border: `6px solid ${brand.purple}`, opacity: 0.7 }} />

          <Stack spacing={1.5} sx={{ mb: 5, position: 'relative' }}>
            <Box><SectionChip label="Category" onYellow /></Box>
            <Typography variant="h3" sx={{ fontSize: { xs: 28, md: 40 }, color: brand.ink, maxWidth: 520 }}>
              Professionally <Accent>Aligned</Accent> <Accent>Learning</Accent> Categories
            </Typography>
          </Stack>

          <Box sx={{ display: 'grid', gap: 2.5, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' } }}>
            {categories.map((c) => (
              <Card
                key={c.title}
                component={RouterLink}
                to="/courses/go-programming"
                sx={{
                  textDecoration: 'none',
                  border: 'none',
                  bgcolor: c.featured ? 'primary.main' : 'background.paper',
                  color: c.featured ? '#fff' : 'text.primary',
                  transition: 'transform .2s',
                  '&:hover': { transform: 'translateY(-4px)' },
                }}
              >
                <CardContent sx={{ p: 3, minHeight: 190, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" sx={{ lineHeight: 1.3 }}>{c.title}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.75, mt: 1 }}>{c.meta}</Typography>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mt: 'auto', pt: 3 }}>
                    <IconButton
                      size="small"
                      sx={{
                        border: 1,
                        borderColor: c.featured ? 'rgba(255,255,255,0.5)' : 'divider',
                        color: 'inherit',
                      }}
                    >
                      <ChevronRightRoundedIcon fontSize="small" />
                    </IconButton>
                    <Box sx={{ color: c.featured ? 'secondary.main' : 'primary.main', '& svg': { fontSize: 56 } }}>
                      {c.icon}
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      </Container>

      {/* 4. ABOUT */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 }, position: 'relative' }}>
        <Box
          sx={{
            display: { xs: 'none', md: 'grid' }, position: 'absolute', left: 24, top: 60, width: 110, height: 120,
            borderRadius: '24px', bgcolor: '#FBCFE8', transform: 'rotate(-10deg)', placeItems: 'center', color: brand.pink,
          }}
        >
          <SchoolRoundedIcon sx={{ fontSize: 56 }} />
        </Box>
        <Box
          sx={{
            display: { xs: 'none', md: 'grid' }, position: 'absolute', right: 24, bottom: 60, width: 110, height: 120,
            borderRadius: '24px', bgcolor: '#BBF7D0', transform: 'rotate(10deg)', placeItems: 'center', color: '#15803D',
          }}
        >
          <TerminalRoundedIcon sx={{ fontSize: 56 }} />
        </Box>
        <AutoAwesomeIcon sx={{ display: { xs: 'none', md: 'block' }, position: 'absolute', right: 160, top: 70, color: brand.purpleLight, fontSize: 40 }} />
        <AutoAwesomeIcon sx={{ display: { xs: 'none', md: 'block' }, position: 'absolute', left: 170, bottom: 60, color: brand.green, fontSize: 32 }} />

        <Stack spacing={2} alignItems="center" textAlign="center" sx={{ maxWidth: 640, mx: 'auto' }}>
          <SectionChip label="About Us" />
          <Typography variant="h3" sx={{ fontSize: { xs: 30, md: 40 } }}>
            <Accent>Gateway</Accent> To Personal And Professional <Accent>Growth</Accent>
          </Typography>
          <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
            We believe practice is the foundation of real skill. Nexora connects students with a
            carefully structured Go curriculum, a real compiler in the browser and instant feedback —
            helping you move from your first <code>fmt.Println</code> to building concurrent programs.
          </Typography>
        </Stack>
      </Container>

      {/* 5. WHAT WE STAND FOR */}
      <Container maxWidth="lg" sx={{ pb: { xs: 8, md: 12 } }}>
        <Box sx={{ display: 'grid', gap: 6, alignItems: 'center', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
          <Box
            sx={{
              borderRadius: '32px',
              bgcolor: softSurface(mode),
              minHeight: 340,
              display: 'grid',
              placeItems: 'center',
              position: 'relative',
            }}
          >
            <Box sx={{ width: 150, height: 150, borderRadius: '40px', bgcolor: 'primary.main', color: '#fff', display: 'grid', placeItems: 'center', transform: 'rotate(-8deg)' }}>
              <MenuBookRoundedIcon sx={{ fontSize: 80 }} />
            </Box>
            <Box sx={{ position: 'absolute', bottom: 40, right: 60, width: 90, height: 90, borderRadius: '28px', bgcolor: 'secondary.main', color: brand.ink, display: 'grid', placeItems: 'center', transform: 'rotate(12deg)' }}>
              <CodeRoundedIcon sx={{ fontSize: 44 }} />
            </Box>
          </Box>
          <Box>
            <SectionChip label="Our Value" />
            <Typography variant="h3" sx={{ fontSize: { xs: 30, md: 40 }, mt: 1.5, mb: 4 }}>
              What We <Accent>Stand</Accent> For
            </Typography>
            <Stack spacing={3}>
              {values.map((v) => (
                <Stack key={v.title} direction="row" spacing={2}>
                  <Avatar sx={{ bgcolor: (t) => alpha(t.palette.primary.main, 0.1), color: 'primary.main', width: 48, height: 48 }}>
                    {v.icon}
                  </Avatar>
                  <Box>
                    <Typography fontWeight={700}>{v.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{v.desc}</Typography>
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Box>
        </Box>
      </Container>

      {/* 6. ACCESS PLANS (pricing style) */}
      <Box sx={{ bgcolor: softSurface(mode), py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <SectionHeading chip="Access" sub="Nexora is free for students. Pick the role that fits how you use the platform.">
            <Accent>Choose</Accent> What Works For <Accent>You</Accent>
          </SectionHeading>
          <Box sx={{ display: 'grid', gap: 3, alignItems: 'center', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' } }}>
            {plans.map((p) => (
              <Card
                key={p.name}
                sx={{
                  bgcolor: p.best ? 'primary.main' : 'background.paper',
                  color: p.best ? '#fff' : 'text.primary',
                  border: p.best ? 'none' : undefined,
                  py: p.best ? 2 : 0,
                  boxShadow: p.best ? '0 24px 50px rgba(124,58,237,0.35)' : 'none',
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  {p.best && (
                    <Chip
                      icon={<RocketLaunchRoundedIcon />}
                      label="Best Choice"
                      size="small"
                      sx={{ bgcolor: '#fff', color: 'primary.main', mb: 2, '& .MuiChip-icon': { color: 'primary.main' } }}
                    />
                  )}
                  <Typography variant="h6">{p.name}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.75, mt: 0.5, minHeight: 40 }}>{p.desc}</Typography>
                  <Stack direction="row" alignItems="baseline" spacing={1} sx={{ my: 3 }}>
                    <Typography sx={{ fontSize: 40, fontWeight: 800 }}>{p.price}</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.7 }}>{p.unit}</Typography>
                  </Stack>
                  <Stack spacing={1.5} sx={{ mb: 4 }}>
                    {p.features.map((f) => (
                      <Stack key={f.text} direction="row" spacing={1} alignItems="center">
                        {f.ok ? (
                          <CheckCircleRoundedIcon sx={{ color: 'secondary.main', fontSize: 20 }} />
                        ) : (
                          <CancelRoundedIcon sx={{ color: 'text.disabled', fontSize: 20 }} />
                        )}
                        <Typography
                          variant="body2"
                          sx={{ textDecoration: f.ok ? 'none' : 'line-through', opacity: f.ok ? 1 : 0.6 }}
                        >
                          {f.text}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                  <Button
                    component={RouterLink}
                    to={p.to}
                    fullWidth
                    variant={p.best ? 'contained' : 'outlined'}
                    sx={p.best ? { bgcolor: '#fff', color: 'primary.main', '&:hover': { bgcolor: '#F3EEFF' } } : undefined}
                  >
                    {p.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      {/* 7. HOW IT WORKS */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <SectionHeading chip="How It Works">
          Your <Accent>Learning Journey</Accent> In 4 Simple Steps
        </SectionHeading>
        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' } }}>
          {steps.map((s, i) => (
            <Card key={s.title} sx={{ position: 'relative', overflow: 'visible' }}>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                  <Avatar sx={{ bgcolor: i % 2 ? 'secondary.main' : 'primary.main', color: i % 2 ? brand.ink : '#fff', width: 52, height: 52 }}>
                    {s.icon}
                  </Avatar>
                  <Typography sx={{ fontSize: 36, fontWeight: 800, color: (t) => alpha(t.palette.primary.main, 0.15) }}>
                    0{i + 1}
                  </Typography>
                </Stack>
                <Typography fontWeight={700} sx={{ mb: 1 }}>{s.title}</Typography>
                <Typography variant="body2" color="text.secondary">{s.desc}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      {/* 8. INSIGHTS (blog style) */}
      <Container maxWidth="lg" sx={{ pb: { xs: 8, md: 12 } }}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={3} sx={{ mb: 5 }}>
          <Box>
            <SectionChip label="Blog" />
            <Typography variant="h3" sx={{ fontSize: { xs: 30, md: 40 }, mt: 1.5 }}>
              <Accent>Insights</Accent> &amp; Ideas
              <br />
              From <Accent>Nexora</Accent>
            </Typography>
          </Box>
          <Stack spacing={2} sx={{ maxWidth: 360 }}>
            <Typography color="text.secondary">
              Key topics from the curriculum — practical tips and patterns every Go learner should know.
            </Typography>
            <Box>
              <Button component={RouterLink} to="/courses/go-programming" variant="contained" color="secondary" size="small">
                View More
              </Button>
            </Box>
          </Stack>
        </Stack>

        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1.2fr 1fr' } }}>
          <PostCard post={posts[0]} large />
          <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
            {posts.slice(1).map((p) => (
              <PostCard key={p.title} post={p} />
            ))}
          </Box>
        </Box>
      </Container>

      {/* 9. FAQ */}
      <Container maxWidth="lg" sx={{ pb: { xs: 8, md: 12 } }}>
        <Box sx={{ display: 'grid', gap: 6, gridTemplateColumns: { xs: '1fr', md: '1fr 1.4fr' } }}>
          <Box>
            <SectionChip label="FAQ's" />
            <Typography variant="h3" sx={{ fontSize: { xs: 30, md: 40 }, mt: 1.5 }}>
              <Accent>Frequently</Accent> Asked <Accent>Questions</Accent>
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 2 }}>
              Everything you need to know about learning Go on Nexora.
            </Typography>
          </Box>
          <Box>
            {faqs.map((f, i) => (
              <Accordion key={f.q} defaultExpanded={i === 0}>
                <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
                  <Typography fontWeight={600} sx={{ color: 'primary.main' }}>Q: {f.q}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>A: {f.a}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Box>
      </Container>

      {/* 10. CALL TO ACTION */}
      <Container maxWidth="lg" sx={{ pb: { xs: 8, md: 12 } }}>
        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            bgcolor: 'primary.main',
            color: '#fff',
            borderRadius: '32px',
            p: { xs: 4, md: 8 },
            textAlign: 'center',
          }}
        >
          <Box sx={{ position: 'absolute', bottom: -70, left: -40, width: 180, height: 180, borderRadius: '50%', border: `6px solid ${brand.yellow}`, opacity: 0.6 }} />
          <Typography variant="h3" sx={{ fontSize: { xs: 28, md: 40 }, position: 'relative' }}>
            Start Your Go Journey Today
          </Typography>
          <Typography sx={{ opacity: 0.85, mt: 2, mb: 4, maxWidth: 520, mx: 'auto', position: 'relative' }}>
            Module 1 is unlocked and waiting. Write your first Go program in the browser within minutes.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="center" sx={{ position: 'relative' }}>
            <Button component={RouterLink} to="/register" variant="contained" color="secondary" size="large">
              Create Free Account
            </Button>
            <Button
              component={RouterLink}
              to="/login"
              variant="outlined"
              size="large"
              sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.5)', '&:hover': { borderColor: '#fff' } }}
            >
              Sign In
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

const PostCard: React.FC<{ post: (typeof posts)[number]; large?: boolean }> = ({ post, large }) => (
  <Card
    component={RouterLink}
    to="/courses/go-programming"
    sx={{ textDecoration: 'none', border: 'none', bgcolor: 'transparent', '&:hover .post-img': { transform: 'scale(1.03)' } }}
  >
    <Box sx={{ borderRadius: '20px', overflow: 'hidden' }}>
      <Box
        className="post-img"
        sx={{
          height: large ? 260 : 120,
          bgcolor: post.color,
          display: 'grid',
          placeItems: 'center',
          transition: 'transform .3s',
          color: 'rgba(30,27,46,0.55)',
          '& svg': { fontSize: large ? 90 : 48 },
        }}
      >
        <CodeRoundedIcon />
      </Box>
    </Box>
    <Box sx={{ pt: 1.5 }}>
      <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600 }}>{post.tag}</Typography>
      <Typography fontWeight={700} sx={{ fontSize: large ? 18 : 14, color: 'text.primary', mt: 0.5 }}>{post.title}</Typography>
      <Typography variant="caption" color="text.secondary">{post.date}</Typography>
    </Box>
  </Card>
);
