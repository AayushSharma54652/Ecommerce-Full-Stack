import React from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Avatar,
  Grid,
  Skeleton,
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  WorkOutline as RoleIcon,
} from "@mui/icons-material";
import { useGetUserProfileQuery } from "../services/api";
import { motion } from "framer-motion";

const Profile: React.FC = () => {
  const { data, isLoading, error } = useGetUserProfileQuery();

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 500,
            p: 4,
          }}
        >
          <Skeleton variant="circular" width={100} height={100} sx={{ mx: "auto" }} />
          <Skeleton variant="text" sx={{ mt: 2, width: "60%", mx: "auto" }} />
          <Skeleton variant="text" sx={{ mt: 1, width: "80%", mx: "auto" }} />
          <Skeleton variant="rectangular" height={120} sx={{ mt: 2, borderRadius: 2 }} />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)",
        }}
      >
        <Alert severity="error" variant="filled">
          Failed to fetch profile data. Please try again.
        </Alert>
      </Box>
    );
  }

  const user = data?.data;
  const { name, email, role } = user || {};

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={10}
          sx={{
            width: "100%",
            maxWidth: 500,
            p: 4,
            borderRadius: 3,
            background: "white",
            boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
          }}
        >
          <Box
            sx={{
              textAlign: "center",
              mb: 4,
            }}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: "primary.main",
                  mx: "auto",
                  mb: 2,
                }}
              >
                <PersonIcon sx={{ fontSize: 60, color: "white" }} />
              </Avatar>
            </motion.div>
            <Typography variant="h4" color="primary" fontWeight="bold">
              My Profile
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {[{ icon: <PersonIcon />, label: "Name", value: name },
              { icon: <EmailIcon />, label: "Email", value: email },
              { icon: <RoleIcon />, label: "Role", value: role }].map((item, index) => (
              <Grid item xs={12} key={index}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      p: 2,
                      bgcolor: "action.hover",
                      borderRadius: 2,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      transition: "all 0.3s",
                      "&:hover": {
                        boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
                      },
                    }}
                  >
                    {item.icon && React.cloneElement(item.icon, {
                      sx: { mr: 2, color: "text.secondary" },
                    })}
                    <Typography variant="body1">
                      <strong>{item.label}:</strong> {item.value || "N/A"}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default Profile;
