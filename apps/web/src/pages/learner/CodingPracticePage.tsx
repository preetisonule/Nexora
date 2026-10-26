import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  LinearProgress,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import { ApiClient } from '../../services/api';
import { PageError } from '../../components/common/PageError';
import { Accent, SectionChip } from '../../components/common/ui';

interface AssignmentSummary {
  id: string;
  moduleId: string;
  title: string;
  difficulty: string;
  testCaseCount: number;
  userStats: { attempted: boolean; bestScore: number | null; passed: boolean } | null;
}

interface ModuleSummary {
  id: string;
  order: number;
  title: string;
  unlocked?: boolean;
}

/** All coding assignments grouped by module, with lock and pass status. */
export const CodingPracticePage: React.FC = () => {
  const [modules, setModules] = useState<ModuleSummary[]>([]);
  const [assignments, setAssignments] = useState<AssignmentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    Promise.all([ApiClient.get<ModuleSummary[]>('/modules'), ApiClient.get<AssignmentSummary[]>('/assignments')])
      .then(([mods, list]) => {
        setModules(mods || []);
        setAssignments(list || []);
      })
      .catch((err) => setLoadError(err.message || 'Could not load assignments.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Skeleton variant="rounded" height={120} sx={{ borderRadius: 5, mb: 3 }} />
        <Skeleton variant="rounded" height={320} sx={{ borderRadius: 5 }} />
      </Container>
    );
  }

  if (loadError) {
    return <PageError message={loadError} backTo="/dashboard" backLabel="Back to Dashboard" />;
  }

  const passed = assignments.filter((a) => a.userStats?.passed).length;
  const percent = assignments.length ? Math.round((passed / assignments.length) * 100) : 0;

  return (
    <Container maxWidth="lg" sx={{ py: 5, pb: 10 }}>
      <Stack spacing={1.5} sx={{ mb: 4 }}>
        <Box><SectionChip label="Coding Practice" /></Box>
        <Typography variant="h4">
          Solve Real <Accent>Go</Accent> Problems
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 640 }}>
          Every assignment runs on a real Go compiler and is graded against test cases. Assignments unlock
          together with their module.
        </Typography>
        <Box sx={{ maxWidth: 420, pt: 1 }}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary">{passed} of {assignments.length} solved</Typography>
            <Typography variant="body2" fontWeight={700} color="primary">{percent}%</Typography>
          </Stack>
          <LinearProgress variant="determinate" value={percent} sx={{ height: 8, borderRadius: 4, mt: 0.5 }} />
        </Box>
      </Stack>

      <Stack spacing={3}>
        {modules.map((mod) => {
          const items = assignments.filter((a) => a.moduleId === mod.id);
          if (!items.length) return null;
          const locked = mod.unlocked === false;
          return (
            <Card key={mod.id} sx={{ opacity: locked ? 0.75 : 1 }}>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <Chip size="small" color="primary" label={`Module ${mod.order}`} />
                  <Typography fontWeight={700}>{mod.title}</Typography>
                  {locked && <Chip size="small" icon={<LockRoundedIcon />} label="Locked" />}
                </Stack>
                <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
                  {items.map((a) => (
                    <Stack
                      key={a.id}
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      spacing={2}
                      sx={{ p: 2, borderRadius: 3, border: 1, borderColor: 'divider' }}
                    >
                      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
                        {a.userStats?.passed ? (
                          <CheckCircleRoundedIcon color="success" />
                        ) : (
                          <CodeRoundedIcon color={locked ? 'disabled' : 'primary'} />
                        )}
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="body2" fontWeight={700} noWrap>{a.title}</Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                            {a.difficulty} · {a.testCaseCount} tests
                            {a.userStats?.bestScore != null ? ` · best ${a.userStats.bestScore}%` : ''}
                          </Typography>
                        </Box>
                      </Stack>
                      <Button
                        component={RouterLink}
                        to={`/learn/go-programming/assignment/${a.id}`}
                        size="small"
                        variant={a.userStats?.passed ? 'outlined' : 'contained'}
                        disabled={locked}
                        sx={{ flexShrink: 0 }}
                      >
                        {a.userStats?.passed ? 'Open' : 'Solve'}
                      </Button>
                    </Stack>
                  ))}
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Stack>
    </Container>
  );
};
