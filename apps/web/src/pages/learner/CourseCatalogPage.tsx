import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { ApiClient } from '../../services/api';
import { ICourse, ICourseProgress } from '@compilo/shared';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Container,
  InputAdornment,
  LinearProgress,
  MenuItem,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { Accent, SectionChip } from '../../components/common/ui';

export const CourseCatalogPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [progress, setProgress] = useState<ICourseProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedLevel, setSelectedLevel] = useState('ALL');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cList, prog] = await Promise.all([
          ApiClient.get<ICourse[]>('/courses'),
          ApiClient.get<ICourseProgress>('/progress/me').catch(() => null),
        ]);
        setCourses(cList || []);
        setProgress(prog);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLevel =
      selectedLevel === 'ALL' ||
      course.level.toLowerCase().includes(selectedLevel.toLowerCase());

    return matchesSearch && matchesLevel;
  });

  return (
    <Container maxWidth="lg" sx={{ py: 5, pb: 10 }}>
      <Stack spacing={1.5} sx={{ mb: 4 }}>
        <Box><SectionChip label="Course Catalog" /></Box>
        <Typography variant="h4">
          Curriculum &amp; <Accent>Courses</Accent>
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 620 }}>
          Explore structured programming pathways with verified completion milestones.
        </Typography>
      </Stack>

      <Card sx={{ p: 2, mb: 4 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            placeholder="Search courses by title, keywords, or topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            slotProps={{
              input: { startAdornment: <InputAdornment position="start"><SearchRoundedIcon fontSize="small" /></InputAdornment> },
            }}
          />
          <TextField
            select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            sx={{ minWidth: 220 }}
            fullWidth={false}
          >
            <MenuItem value="ALL">All Levels</MenuItem>
            <MenuItem value="Beginner">Beginner</MenuItem>
            <MenuItem value="Intermediate">Intermediate</MenuItem>
            <MenuItem value="Advanced">Advanced</MenuItem>
          </TextField>
        </Stack>
      </Card>

      {loading ? (
        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: 'repeat(3, 1fr)' } }}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rounded" height={320} sx={{ borderRadius: 5 }} />
          ))}
        </Box>
      ) : filteredCourses.length === 0 ? (
        <Card sx={{ p: 6, textAlign: 'center' }}>
          <MenuBookOutlinedIcon sx={{ fontSize: 40, color: 'text.disabled' }} />
          <Typography variant="h6" sx={{ mt: 1 }}>No courses found</Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Try adjusting your search or reset the level filter.
          </Typography>
          <Button
            variant="outlined"
            onClick={() => {
              setSearchTerm('');
              setSelectedLevel('ALL');
            }}
          >
            Reset Filters
          </Button>
        </Card>
      ) : (
        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: 'repeat(3, 1fr)' } }}>
          {filteredCourses.map((course) => {
            const isEnrolled = !!progress?.enrolled;
            const progressPercent = progress?.overallPercentage || 0;

            return (
              <Card key={course.id} sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ height: 8, bgcolor: 'primary.main' }} />
                <CardContent sx={{ p: 3, flex: 1 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Chip label={course.level} size="small" color="secondary" />
                    <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: 'text.secondary' }}>
                      <AccessTimeRoundedIcon sx={{ fontSize: 16 }} />
                      <Typography variant="caption">{course.estimatedDuration}</Typography>
                    </Stack>
                  </Stack>

                  <Typography variant="h6" sx={{ lineHeight: 1.3 }}>{course.title}</Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                  >
                    {course.description}
                  </Typography>

                  {isEnrolled && (
                    <Box sx={{ mt: 2 }}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="caption" color="text.secondary">Your Progress</Typography>
                        <Typography variant="caption" fontWeight={700} color="primary">{progressPercent}%</Typography>
                      </Stack>
                      <LinearProgress variant="determinate" value={progressPercent} sx={{ height: 8, borderRadius: 4, mt: 0.5 }} />
                    </Box>
                  )}

                  <Stack spacing={1} sx={{ mt: 2.5 }}>
                    {course.learningObjectives?.slice(0, 3).map((obj, i) => (
                      <Stack key={i} direction="row" spacing={1} alignItems="flex-start">
                        <CheckCircleRoundedIcon sx={{ fontSize: 18, color: 'primary.main', mt: '1px' }} />
                        <Typography variant="body2" color="text.secondary">{obj}</Typography>
                      </Stack>
                    ))}
                  </Stack>
                </CardContent>

                <CardActions sx={{ px: 3, pb: 3, justifyContent: 'space-between' }}>
                  <Stack direction="row" spacing={2} sx={{ color: 'text.secondary' }}>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <MenuBookOutlinedIcon sx={{ fontSize: 16 }} />
                      <Typography variant="caption">{course.moduleCount || 10} Modules</Typography>
                    </Stack>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <WorkspacePremiumOutlinedIcon sx={{ fontSize: 16 }} />
                      <Typography variant="caption">Certified</Typography>
                    </Stack>
                  </Stack>
                  <Button
                    component={RouterLink}
                    to={`/courses/${course.slug}`}
                    variant="contained"
                    size="small"
                    endIcon={<ArrowForwardRoundedIcon />}
                  >
                    {isEnrolled ? 'Continue' : 'View Course'}
                  </Button>
                </CardActions>
              </Card>
            );
          })}
        </Box>
      )}
    </Container>
  );
};
