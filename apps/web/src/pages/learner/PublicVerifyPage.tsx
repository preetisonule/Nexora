import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import GppBadRoundedIcon from '@mui/icons-material/GppBadRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import { ApiClient } from '../../services/api';

interface VerifiedCertificate {
  certificateId: string;
  learnerName: string;
  courseTitle: string;
  courseLevel: string;
  issueDate: string;
  status: 'valid' | 'revoked';
  revocationReason?: string;
}

/**
 * Public certificate check. `/verify` shows a lookup form, `/verify/:certificateId` shows the result.
 */
export const PublicVerifyPage: React.FC = () => {
  const { certificateId } = useParams<{ certificateId?: string }>();
  const navigate = useNavigate();
  const [query, setQuery] = useState(certificateId || '');
  const [cert, setCert] = useState<VerifiedCertificate | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setQuery(certificateId || '');
    setCert(null);
    setNotFound(false);
    if (!certificateId) return;

    setLoading(true);
    // ApiClient returns the certificate itself; validity comes from its status field
    ApiClient.get<VerifiedCertificate>(`/certificates/${encodeURIComponent(certificateId)}/verify`)
      .then((data) => (data ? setCert(data) : setNotFound(true)))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [certificateId]);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const id = query.trim().toUpperCase();
    if (id) navigate(`/verify/${encodeURIComponent(id)}`);
  };

  const isValid = cert?.status === 'valid';

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 5, md: 8 } }}>
      <Stack spacing={1} alignItems="center" textAlign="center" sx={{ mb: 4 }}>
        <WorkspacePremiumOutlinedIcon sx={{ fontSize: 48, color: 'primary.main' }} />
        <Typography variant="h4">Verify a Certificate</Typography>
        <Typography color="text.secondary">
          Enter the certificate ID printed on a Nexora certificate (for example COMPILO-GO-2026-1A2B3C4D).
        </Typography>
      </Stack>

      <Card>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Stack component="form" direction={{ xs: 'column', sm: 'row' }} spacing={1.5} onSubmit={handleLookup}>
            <TextField
              placeholder="Certificate ID"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              slotProps={{
                input: {
                  sx: { fontFamily: 'JetBrains Mono, monospace' },
                  startAdornment: <InputAdornment position="start"><SearchRoundedIcon fontSize="small" /></InputAdornment>,
                },
              }}
            />
            <Button type="submit" variant="contained" disabled={!query.trim()} sx={{ flexShrink: 0 }}>
              Verify
            </Button>
          </Stack>

          {loading && (
            <Stack alignItems="center" sx={{ py: 5 }}>
              <CircularProgress />
            </Stack>
          )}

          {!loading && notFound && (
            <Alert severity="error" icon={<GppBadRoundedIcon />} sx={{ mt: 3, borderRadius: 3 }}>
              No certificate with ID <b>{certificateId}</b> exists. Check the ID and try again.
            </Alert>
          )}

          {!loading && cert && (
            <Box sx={{ mt: 3 }}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                {isValid ? (
                  <VerifiedRoundedIcon color="success" sx={{ fontSize: 40 }} />
                ) : (
                  <GppBadRoundedIcon color="error" sx={{ fontSize: 40 }} />
                )}
                <Box>
                  <Typography variant="h6">{isValid ? 'Verified Credential' : 'Certificate Revoked'}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    {cert.certificateId}
                  </Typography>
                </Box>
              </Stack>

              {!isValid && (
                <Alert severity="warning" sx={{ mb: 2, borderRadius: 3 }}>
                  This certificate is no longer valid.{cert.revocationReason ? ` Reason: ${cert.revocationReason}` : ''}
                </Alert>
              )}

              <Divider />
              {[
                ['Recipient', cert.learnerName],
                ['Course', cert.courseTitle],
                ['Level', cert.courseLevel],
                ['Issue date', new Date(cert.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })],
              ].map(([label, value]) => (
                <Stack key={label} direction="row" justifyContent="space-between" spacing={2} sx={{ py: 1.25, borderBottom: 1, borderColor: 'divider' }}>
                  <Typography variant="body2" color="text.secondary">{label}</Typography>
                  <Typography variant="body2" fontWeight={700} textAlign="right">{value}</Typography>
                </Stack>
              ))}
              <Stack direction="row" justifyContent="space-between" sx={{ py: 1.25 }}>
                <Typography variant="body2" color="text.secondary">Status</Typography>
                <Chip size="small" label={isValid ? 'Valid' : 'Revoked'} color={isValid ? 'success' : 'error'} />
              </Stack>
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};
