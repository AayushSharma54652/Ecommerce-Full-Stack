import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Alert, 
  Paper, 
  Grid, 
  InputAdornment,
  IconButton,
  MenuItem
} from "@mui/material";
import { 
  Person as PersonIcon, 
  Email as EmailIcon, 
  Lock as LockIcon, 
  Visibility,
  VisibilityOff,
  WorkOutline as RoleIcon
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRegisterUserMutation } from "../services/api";
import { useAppDispatch } from "../store/store";
import { loginStart, registerSuccess, registerFailure } from "../store/reducers/authReducer";

interface SignUpFormInputs {
  name: string;
  email: string;
  role: string;
  password: string;
}

const MotionPaper = motion(Paper);
const MotionTextField = motion(TextField);
const MotionButton = motion(Button);

const SignUp: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormInputs>();
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  const roles = [
    { value: 'CUSTOMER', label: 'Customer' },
    { value: 'ADMIN', label: 'Admin' }
  ];

  const onSubmit: SubmitHandler<SignUpFormInputs> = async (data) => {
    dispatch(loginStart());
    try {
      const response = await registerUser(data).unwrap();
      dispatch(
        registerSuccess({
          user: response.data.user,
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        })
      );
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      
      toast.success('Successfully registered!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err: any) {
      const errorMessage = err.data?.message || "Failed to register";
      dispatch(registerFailure(errorMessage));
      setError(errorMessage);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <Box 
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        padding: 2
      }}
    >
      <MotionPaper 
        elevation={10} 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        sx={{ 
          width: '100%', 
          maxWidth: 500, 
          p: 4, 
          borderRadius: 3,
          backgroundColor: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Typography 
            variant="h4" 
            color="primary" 
            fontWeight="bold"
            textAlign="center"
            sx={{ mb: 3 }}
          >
            Create an Account
          </Typography>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <MotionTextField
                variants={itemVariants}
                fullWidth
                label="Full Name"
                {...register("name", { required: "Name is required" })}
                error={!!errors.name}
                helperText={errors.name?.message}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <MotionTextField
                variants={itemVariants}
                fullWidth
                label="Email"
                {...register("email", { 
                  required: "Email is required", 
                  pattern: { 
                    value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/, 
                    message: "Invalid email format" 
                  }
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <MotionTextField
                variants={itemVariants}
                select
                fullWidth
                label="Role"
                {...register("role", { required: "Role is required" })}
                error={!!errors.role}
                helperText={errors.role?.message}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <RoleIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              >
                {roles.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </MotionTextField>
            </Grid>

            <Grid item xs={12}>
              <MotionTextField
                variants={itemVariants}
                fullWidth
                type={showPassword ? "text" : "password"}
                label="Password"
                {...register("password", { 
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters"
                  }
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <AnimatePresence>
              {error && (
                <Grid item xs={12}>
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Alert severity="error">{error}</Alert>
                  </motion.div>
                </Grid>
              )}
            </AnimatePresence>

            <Grid item xs={12}>
              <MotionButton
                variants={itemVariants}
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                sx={{ 
                  py: 1.5, 
                  fontWeight: 'bold',
                  borderRadius: 2,
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                }}
              >
                {isLoading ? "Signing Up..." : "Sign Up"}
              </MotionButton>
            </Grid>
          </Grid>
        </form>

        <motion.div
          variants={itemVariants}
          style={{ marginTop: 16, textAlign: 'center' }}
        >
          <Typography variant="body2">
            Already have an account?{" "}
            <Button 
              color="primary"
              onClick={() => navigate("/signin")}
              sx={{
                textTransform: 'none',
                fontWeight: 'bold'
              }}
            >
              Sign In
            </Button>
          </Typography>
        </motion.div>
      </MotionPaper>
      <ToastContainer />
    </Box>
  );
};

export default SignUp;