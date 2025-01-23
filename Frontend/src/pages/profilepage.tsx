import React from "react";
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Alert, 
  Paper, 
  Avatar, 
  Grid 
} from "@mui/material";
import { 
  Person as PersonIcon, 
  Email as EmailIcon, 
  WorkOutline as RoleIcon 
} from "@mui/icons-material";
import { useGetUserProfileQuery } from "../services/api";

const Profile: React.FC = () => {
  const { data, isLoading, error } = useGetUserProfileQuery();

  if (isLoading) {
    return (
      <Box 
        sx={{ 
          minHeight: '100vh', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
        }}
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box 
        sx={{ 
          minHeight: '100vh', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
        }}
      >
        <Alert severity="error">Failed to fetch profile data. Please try again.</Alert>
      </Box>
    );
  }

  const user = data?.data;
  const { name, email, role } = user || {};

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }}
    >
      <Paper 
        elevation={10} 
        sx={{ 
          width: '100%', 
          maxWidth: 500, 
          p: 4, 
          borderRadius: 3,
          backgroundColor: 'rgba(255,255,255,0.9)'
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            mb: 3 
          }}
        >
          <Avatar 
            sx={{ 
              width: 100, 
              height: 100, 
              mb: 2, 
              bgcolor: 'primary.main' 
            }}
          >
            <PersonIcon sx={{ fontSize: 60 }} />
          </Avatar>
          <Typography 
            variant="h4" 
            color="primary" 
            fontWeight="bold"
          >
            My Profile
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                p: 2, 
                bgcolor: 'action.hover', 
                borderRadius: 2 
              }}
            >
              <PersonIcon sx={{ mr: 2, color: 'text.secondary' }} />
              <Typography variant="body1">
                <strong>Name:</strong> {name || "N/A"}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                p: 2, 
                bgcolor: 'action.hover', 
                borderRadius: 2 
              }}
            >
              <EmailIcon sx={{ mr: 2, color: 'text.secondary' }} />
              <Typography variant="body1">
                <strong>Email:</strong> {email || "N/A"}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                p: 2, 
                bgcolor: 'action.hover', 
                borderRadius: 2 
              }}
            >
              <RoleIcon sx={{ mr: 2, color: 'text.secondary' }} />
              <Typography variant="body1">
                <strong>Role:</strong> {role || "N/A"}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Profile;