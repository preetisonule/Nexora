import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Link,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import { ApiClient } from '../../services/api';
import { useToast } from '../../context/ToastContext';

interface ProjectSubmission {
  id: string;
  learnerName: string;
  learnerEmail: string;
  repositoryUrl?: string;
  documentationText: string;
  testInstructions: string;
  status: 'pending' | 'approved' | 'rejected';
  score?: number;
  reviewNotes?: string;
  submittedAt?: string;
  reviewedAt?: string;
}

const statusColor = { pending: 'warning', approved: 'success', rejected: 'error' } as const;

/** Admin review queue for capstone (final project) submissions. Approval is required for certificates. */
export const AdminProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<ProjectSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'pending' | 'all'>('pending');
  const [reviewing, setReviewing] = useState<ProjectSubmission | null>(null);
  const [score, setScore] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const { success, error } = useToast();

  const load = () => {
    setLoading(true);
    ApiClient.get<ProjectSubmission[]>('/projects')
      .then((data) => setProjects(data || []))
      .catch((err) => error(err.message || 'Could not load submissions'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const openReview = (p: ProjectSubmission) => {
    setReviewing(p);
    setScore(p.score != null ? String(p.score) : '');
    setNotes(p.reviewNotes || '');
  };

  const submitReview = async (status: 'approved' | 'rejected') => {
    if (!reviewing) return;
    const numericScore = score.trim() === '' ? undefined : Number(score);
    if (numericScore !== undefined && (Number.isNaN(numericScore) || numericScore < 0 || numericScore > 100)) {
      error('Score must be between 0 and 100.');
      return;
    }
    if (status === 'rejected' && !notes.trim()) {
      error('Please add review notes so the learner knows what to fix.');
      return;
    }
    setSaving(true);
    try {
      await ApiClient.patch(`/projects/${reviewing.id}/review`, { status, score: numericScore, reviewNotes: notes.trim() });
      success(`Project ${status}.`);
      setReviewing(null);
      load();
    } catch (err: any) {
      error(err.message || 'Review failed');
    } finally {
      setSaving(false);
    }
  };

  const pendingCount = projects.filter((p) => p.status === 'pending').length;
  const shown = tab === 'pending' ? projects.filter((p) => p.status === 'pending') : projects;

  return (
    <Box>
      <Typography variant="h4" sx={{ fontSize: 28 }}>Project Reviews</Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Approve capstone submissions. Learners can claim their certificate only after approval.
      </Typography>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab value="pending" label={`Pending (${pendingCount})`} />
        <Tab value="all" label={`All (${projects.length})`} />
      </Tabs>

      {loading ? (
        <Stack spacing={2}>
          {[1, 2].map((i) => <Skeleton key={i} variant="rounded" height={140} sx={{ borderRadius: 5 }} />)}
        </Stack>
      ) : shown.length === 0 ? (
        <Card sx={{ p: 5, textAlign: 'center' }}>
          <RateReviewOutlinedIcon sx={{ fontSize: 40, color: 'text.disabled' }} />
          <Typography sx={{ mt: 1 }} color="text.secondary">
            {tab === 'pending' ? 'No submissions waiting for review.' : 'No project submissions yet.'}
          </Typography>
        </Card>
      ) : (
        <Stack spacing={2}>
          {shown.map((p) => (
            <Card key={p.id}>
              <CardContent sx={{ p: 3 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
                  <Box sx={{ minWidth: 0 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography fontWeight={700}>{p.learnerName}</Typography>
                      <Chip size="small" color={statusColor[p.status]} label={p.status} sx={{ textTransform: 'capitalize' }} />
                      {p.score != null && <Chip size="small" variant="outlined" label={`${p.score}%`} />}
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                      {p.learnerEmail} · submitted {p.submittedAt ? new Date(p.submittedAt).toLocaleString() : '—'}
                    </Typography>
                    {p.repositoryUrl && (
                      <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 1 }}>
                        <GitHubIcon sx={{ fontSize: 16 }} />
                        <Link href={p.repositoryUrl} target="_blank" rel="noopener noreferrer" variant="body2" sx={{ wordBreak: 'break-all' }}>
                          {p.repositoryUrl}
                        </Link>
                      </Stack>
                    )}
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, whiteSpace: 'pre-wrap', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {p.documentationText}
                    </Typography>
                  </Box>
                  <Box sx={{ flexShrink: 0 }}>
                    <Button variant={p.status === 'pending' ? 'contained' : 'outlined'} onClick={() => openReview(p)}>
                      {p.status === 'pending' ? 'Review' : 'Edit Review'}
                    </Button>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      <Dialog open={!!reviewing} onClose={() => setReviewing(null)} fullWidth maxWidth="sm">
        <DialogTitle>Review: {reviewing?.learnerName}</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle2" sx={{ mt: 1 }}>Documentation</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>
            {reviewing?.documentationText}
          </Typography>
          <Typography variant="subtitle2">How to test</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap', mb: 3 }}>
            {reviewing?.testInstructions}
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="Score (0–100, optional)"
              type="number"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              slotProps={{ htmlInput: { min: 0, max: 100 } }}
            />
            <TextField
              label="Review notes"
              multiline
              minRows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Feedback shown to the learner"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setReviewing(null)} color="inherit">Cancel</Button>
          <Button onClick={() => submitReview('rejected')} color="error" variant="outlined" disabled={saving}>
            Reject
          </Button>
          <Button onClick={() => submitReview('approved')} color="success" variant="contained" disabled={saving}>
            Approve
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
