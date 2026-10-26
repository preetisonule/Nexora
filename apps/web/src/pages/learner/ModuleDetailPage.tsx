import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  LinearProgress,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { ApiClient } from '../../services/api';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { PageError } from '../../components/common/PageError';

interface QuizSummary {
  id: string;
  title: string;
  isModuleTest: boolean;
  passingScore: number;
  maxAttempts: number;
  questionCount: number;
  timeLimitMinutes?: number;
  userStats: { attemptsUsed: number; bestScore: number | null; passed: boolean } | null;
}

interface AssignmentSummary {
  id: string;
  title: string;
  difficulty: string;
  testCaseCount: number;
  userStats: { attempted: boolean; bestScore: number | null; passed: boolean } | null;
}

const StatusChip: React.FC<{ passed?: boolean; score?: number | null }> = ({ passed, score }) =>
  passed ? (
    <Chip size="small" color="success" icon={<CheckCircleRoundedIcon />} label={score != null ? `Passed · ${score}%` : 'Passed'} />
  ) : score != null ? (
    <Chip size="small" color="warning" variant="outlined" label={`Best ${score}%`} />
  ) : (
    <Chip size="small" variant="outlined" label="Not started" />
  );

export const ModuleDetailPage: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const [moduleData, setModuleData] = useState<any>(null);
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
  const [assignments, setAssignments] = useState<AssignmentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    const fetchModule = async () => {
      setLoading(true);
      setLoadError('');
      try {
        const [mod, quizzesData, assignmentsData] = await Promise.all([
          ApiClient.get<any>(`/modules/${moduleId}`),
          ApiClient.get<QuizSummary[]>(`/quizzes?moduleId=${moduleId}`),
          ApiClient.get<AssignmentSummary[]>(`/assignments?moduleId=${moduleId}`),
        ]);
        setModuleData(mod);
        setQuizzes(quizzesData || []);
        setAssignments(assignmentsData || []);
      } catch (err: any) {
        setLoadError(err.message || 'Could not load this module.');
      } finally {
        setLoading(false);
      }
    };

    fetchModule();
  }, [moduleId]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Skeleton variant="rounded" height={180} sx={{ borderRadius: 5, mb: 3 }} />
        <Skeleton variant="rounded" height={320} sx={{ borderRadius: 5 }} />
      </Container>
    );
  }

  if (loadError || !moduleData) {
    return <PageError message={loadError || 'Module not found.'} backTo="/courses/go-programming/learning-path" backLabel="Back to Learning Path" />;
  }

  const isUnlocked = moduleData.unlocked !== false;
  const isCompleted = moduleData.completed === true;
  const completedIds = new Set<string>(moduleData.completedLessonIds || []);
  const lessons: any[] = moduleData.lessons || [];
  const lessonsDone = lessons.filter((l) => completedIds.has(l.id)).length;
  const conceptQuizzes = quizzes.filter((q) => !q.isModuleTest);
  const moduleTests = quizzes.filter((q) => q.isModuleTest);
  const assignmentsDone = assignments.filter((a) => a.userStats?.passed).length;
  const quizzesDone = quizzes.filter((q) => q.userStats?.passed).length;
  const totalSteps = lessons.length + quizzes.length + assignments.length;
  const doneSteps = lessonsDone + quizzesDone + assignmentsDone;
  const percent = totalSteps ? Math.round((doneSteps / totalSteps) * 100) : 0;

  const quizCard = (q: QuizSummary) => (
    <Stack key={q.id} direction="row" alignItems="center" justifyContent="space-between" spacing={2} sx={{ py: 1 }}>
      <Box sx={{ minWidth: 0 }}>
        <Typography fontWeight={600} variant="body2">{q.title}</Typography>
        <Typography variant="caption" color="text.secondary">
          {q.questionCount} questions · pass {q.passingScore}% · {q.userStats ? `${q.userStats.attemptsUsed}/${q.maxAttempts} attempts used` : `${q.maxAttempts} attempts`}
          {q.timeLimitMinutes ? ` · ${q.timeLimitMinutes} min` : ''}
        </Typography>
      </Box>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ flexShrink: 0 }}>
        <StatusChip passed={q.userStats?.passed} score={q.userStats?.bestScore} />
        <Button
          component={RouterLink}
          to={`/learn/go-programming/assessment/${q.id}`}
          size="small"
          variant={q.userStats?.passed ? 'outlined' : 'contained'}
          disabled={!isUnlocked}
        >
          {q.userStats?.passed ? 'Review' : 'Start'}
        </Button>
      </Stack>
    </Stack>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4, pb: 10 }}>
      <Breadcrumbs
        items={[
          { label: 'Courses', path: '/courses' },
          { label: 'Go Programming', path: '/courses/go-programming' },
          { label: `Module ${moduleData.order}` },
        ]}
      />

      {!isUnlocked && (
        <Alert severity="warning" icon={<LockRoundedIcon />} sx={{ mt: 2, borderRadius: 3 }}>
          This module is locked. Finish all lessons, quizzes, coding assignments and the module test of the
          previous module to unlock it.
        </Alert>
      )}

      <Card sx={{ mt: 2 }}>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Stack direction="row" flexWrap="wrap" gap={1} alignItems="center" sx={{ mb: 2 }}>
            <Chip label={`Module ${moduleData.order} of 10`} color="primary" size="small" />
            <Chip icon={<AccessTimeRoundedIcon />} label={moduleData.estimatedDuration} size="small" variant="outlined" />
            {isCompleted ? (
              <Chip icon={<CheckCircleRoundedIcon />} label="Completed" color="success" size="small" />
            ) : isUnlocked ? (
              <Chip label="In progress" color="secondary" size="small" />
            ) : (
              <Chip icon={<LockRoundedIcon />} label="Locked" size="small" />
            )}
          </Stack>
          <Typography variant="h4" sx={{ fontSize: { xs: 24, md: 32 } }}>{moduleData.title}</Typography>
          <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 760 }}>{moduleData.description}</Typography>

          <Box sx={{ mt: 3 }}>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                {doneSteps} of {totalSteps} steps done
              </Typography>
              <Typography variant="body2" fontWeight={700} color="primary">{percent}%</Typography>
            </Stack>
            <LinearProgress variant="determinate" value={percent} sx={{ height: 8, borderRadius: 4 }} />
          </Box>

          {moduleData.objectives?.length > 0 && (
            <Box sx={{ display: 'grid', gap: 1, mt: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
              {moduleData.objectives.map((obj: string, i: number) => (
                <Stack key={i} direction="row" spacing={1}>
                  <CheckCircleRoundedIcon sx={{ fontSize: 18, color: 'primary.main', mt: '2px' }} />
                  <Typography variant="body2" color="text.secondary">{obj}</Typography>
                </Stack>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

      <Box sx={{ display: 'grid', gap: 3, mt: 3, gridTemplateColumns: { xs: 'minmax(0,1fr)', lg: 'minmax(0,1.4fr) minmax(0,1fr)' } }}>
        {/* Step 1: lessons */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">1. Lessons</Typography>
              <Chip size="small" label={`${lessonsDone}/${lessons.length} done`} color={lessonsDone === lessons.length && lessons.length > 0 ? 'success' : 'default'} />
            </Stack>
            <List sx={{ mt: 1 }}>
              {lessons.map((les) => {
                const done = completedIds.has(les.id);
                return (
                  <ListItemButton
                    key={les.id}
                    component={RouterLink}
                    to={`/learn/go-programming/lesson/${les.id}`}
                    disabled={!isUnlocked}
                    sx={{ mb: 0.5, border: 1, borderColor: 'divider' }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {done ? <CheckCircleRoundedIcon color="success" /> : <RadioButtonUncheckedRoundedIcon color="disabled" />}
                    </ListItemIcon>
                    <ListItemText
                      primary={`${les.order}. ${les.title}`}
                      secondary={les.estimatedDuration}
                      slotProps={{ primary: { fontWeight: 600, fontSize: 14 } }}
                    />
                    <ArrowForwardRoundedIcon fontSize="small" color="action" />
                  </ListItemButton>
                );
              })}
            </List>
          </CardContent>
        </Card>

        <Stack spacing={3}>
          {/* Step 2: concept quiz */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <QuizOutlinedIcon color="primary" />
                <Typography variant="h6">2. Concept Quiz</Typography>
              </Stack>
              {conceptQuizzes.length ? conceptQuizzes.map(quizCard) : (
                <Typography variant="body2" color="text.secondary">No quiz for this module.</Typography>
              )}
            </CardContent>
          </Card>

          {/* Step 3: coding assignments */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <CodeRoundedIcon color="primary" />
                <Typography variant="h6">3. Coding Assignments</Typography>
              </Stack>
              {assignments.length ? (
                assignments.map((a) => (
                  <Stack key={a.id} direction="row" alignItems="center" justifyContent="space-between" spacing={2} sx={{ py: 1 }}>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography fontWeight={600} variant="body2">{a.title}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                        {a.difficulty} · {a.testCaseCount} test cases
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ flexShrink: 0 }}>
                      <StatusChip passed={a.userStats?.passed} score={a.userStats?.bestScore} />
                      <Button
                        component={RouterLink}
                        to={`/learn/go-programming/assignment/${a.id}`}
                        size="small"
                        variant={a.userStats?.passed ? 'outlined' : 'contained'}
                        disabled={!isUnlocked}
                      >
                        {a.userStats?.passed ? 'Open' : 'Solve'}
                      </Button>
                    </Stack>
                  </Stack>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">No coding assignments for this module.</Typography>
              )}
            </CardContent>
          </Card>

          {/* Step 4: module test */}
          <Card sx={{ bgcolor: 'primary.main', color: '#fff', border: 'none' }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <AssignmentTurnedInOutlinedIcon sx={{ color: 'secondary.main' }} />
                <Typography variant="h6">4. Module Test</Typography>
              </Stack>
              <Typography variant="body2" sx={{ opacity: 0.85, mb: 1 }}>
                Score at least 70% to complete this module and unlock the next one.
              </Typography>
              {moduleTests.length ? (
                moduleTests.map((q) => (
                  <Stack key={q.id} direction="row" alignItems="center" justifyContent="space-between" spacing={2} sx={{ py: 1 }}>
                    <Typography variant="caption" sx={{ opacity: 0.85 }}>
                      {q.questionCount} questions · {q.userStats ? `${q.userStats.attemptsUsed}/${q.maxAttempts}` : q.maxAttempts} attempts
                      {q.userStats?.bestScore != null ? ` · best ${q.userStats.bestScore}%` : ''}
                    </Typography>
                    <Button
                      component={RouterLink}
                      to={`/learn/go-programming/assessment/${q.id}`}
                      variant="contained"
                      color="secondary"
                      size="small"
                      disabled={!isUnlocked}
                      startIcon={q.userStats?.passed ? <CheckCircleRoundedIcon /> : undefined}
                    >
                      {q.userStats?.passed ? 'Passed — Review' : 'Start Test'}
                    </Button>
                  </Stack>
                ))
              ) : (
                <Typography variant="body2">No module test configured.</Typography>
              )}
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </Container>
  );
};
