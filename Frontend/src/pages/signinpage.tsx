import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Alert, 
  Paper, 
  InputAdornment,
  IconButton
} from "@mui/material";
import { 
  Email as EmailIcon, 
  Lock as PasswordIcon, 
  Visibility, 
  VisibilityOff 
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLoginUserMutation } from "../services/api";
import { useAppDispatch } from "../store/store";
import { 
  loginStart, 
  loginSuccess, 
  loginFailure 
} from "../store/reducers/authReducer";

interface SignInFormInputs {
  email: string;
  password: string;
}

const MotionPaper = motion(Paper);
const MotionTextField = motion(TextField);
const MotionButton = motion(Button);

const SignIn: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<SignInFormInputs>();
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [error, setError] = React.useState<string | null>(null);

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

  const onSubmit: SubmitHandler<SignInFormInputs> = async (data) => {
    dispatch(loginStart());
    try {
      const response = await loginUser(data).unwrap();
      const { user, accessToken, refreshToken } = response.data;
  
      dispatch(loginSuccess({ user, accessToken, refreshToken }));
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
  
      toast.success('Successfully logged in!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Delay navigation to show the success toast
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err: any) {
      const errorMessage = err.data?.message || "Failed to login";
      dispatch(loginFailure(errorMessage));
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
          maxWidth: 400, 
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
            Sign In
          </Typography>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <MotionTextField
            variants={itemVariants}
            fullWidth
            label="Email"
            {...register("email", { 
              required: "Email is required",
              pattern: { 
                value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/,
                message: "Invalid email format" 
              }
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
            sx={{ mb: 2 }}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <MotionTextField
            variants={itemVariants}
            fullWidth
            type={showPassword ? "text" : "password"}
            label="Password"
            {...register("password", { required: "Password is required" })}
            error={!!errors.password}
            helperText={errors.password?.message}
            sx={{ mb: 2 }}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PasswordIcon color="action" />
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

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
              </motion.div>
            )}
          </AnimatePresence>

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
            {isLoading ? "Signing In..." : "Sign In"}
          </MotionButton>

          <motion.div
            variants={itemVariants}
            style={{ 
              marginTop: 16, 
              textAlign: 'center' 
            }}
          >
            <Typography variant="body2">
              Don't have an account? {" "}
              <Button 
                color="primary"
                onClick={() => navigate("/signup")}
                sx={{
                  textTransform: 'none',
                  fontWeight: 'bold'
                }}
              >
                Sign Up
              </Button>
            </Typography>
          </motion.div>
        </form>
      </MotionPaper>
      <ToastContainer />
    </Box>
  );
};

export default SignIn;