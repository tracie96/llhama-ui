import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  CircularProgress,
  Button,
  IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowBack, Refresh, People, CheckCircle, Cancel } from '@mui/icons-material';
import { authService, User } from '../services/auth';
import { useAuth } from '../contexts/AuthContext';

const Users: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, authLoading, navigate]);

  const fetchUsers = useCallback(async () => {
    const token = authService.getToken();
    if (!token || !isAuthenticated) {
      setError('No authentication token found. Please log in.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await authService.getUsers(token);
      
      if (response.status === 'success') {
        setUsers(response.data.users);
        setTotalCount(response.data.total_count);
      } else {
        setError(response.message || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while fetching users');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchUsers();
    }
  }, [isAuthenticated, authLoading, fetchUsers]);

  const handleUserAction = async (userId: number, action: 'activate' | 'deactivate') => {
    const token = authService.getToken();
    if (!token) return;

    setActionLoading(userId);
    try {
      if (action === 'activate') {
        await authService.activateUser(token, userId);
      } else {
        await authService.deactivateUser(token, userId);
      }
      
      // Refresh users list after successful action
      await fetchUsers();
    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
      setError(error instanceof Error ? error.message : `Failed to ${action} user`);
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Show loading while checking authentication or fetching data
  if (authLoading || loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <People sx={{ fontSize: 32, mr: 1, color: 'primary.main' }} />
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Users
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton onClick={fetchUsers} disabled={loading}>
          <Refresh />
        </IconButton>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <Card elevation={2}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" component="h2">
              Registered Users ({totalCount})
            </Typography>
          </Box>

          <TableContainer component={Paper} elevation={1}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'primary.main' }}>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>ID</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Username</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Email</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Created At</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Last Login</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {user.username}
                      </Typography>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.is_active ? 'Active' : 'Inactive'}
                        color={user.is_active ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(user.created_at)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(user.last_login)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {user.is_active ? (
                          <IconButton
                            size="small"
                            onClick={() => handleUserAction(user.id, 'deactivate')}
                            disabled={actionLoading === user.id}
                            color="error"
                            title="Deactivate user"
                          >
                            {actionLoading === user.id ? (
                              <CircularProgress size={16} />
                            ) : (
                              <Cancel />
                            )}
                          </IconButton>
                        ) : (
                          <IconButton
                            size="small"
                            onClick={() => handleUserAction(user.id, 'activate')}
                            disabled={actionLoading === user.id}
                            color="success"
                            title="Activate user"
                          >
                            {actionLoading === user.id ? (
                              <CircularProgress size={16} />
                            ) : (
                              <CheckCircle />
                            )}
                          </IconButton>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {users.length === 0 && !error && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                No users found
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Users;
