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
  IconButton
} from "@mui/material";
import { 
  Person as PersonIcon, 
  Email as EmailIcon, 
  Lock as LockIcon, 
  Visibility,
  VisibilityOff 
} from "@mui/icons-material";
import { useRegisterUserMutation } from "../services/api";
import { useAppDispatch } from "../store/store";
import { loginStart, registerSuccess, registerFailure } from "../store/reducers/authReducer";

interface SignUpFormInputs {
  name: string;
  email: string;
  role: string;
  password: string;
}

const SignUp: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormInputs>();
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit: SubmitHandler<SignUpFormInputs> = async (data) => {
    dispatch(loginStart());
    try {
      const response = await registerUser(data).unwrap();
      dispatch(registerSuccess({
        user: response.data.user,
        accessToken: response.data.accessToken,
      }));
      localStorage.setItem("accessToken", response.data.accessToken);
      navigate("/");
    } catch (err: any) {
      dispatch(registerFailure(err.data?.message || "Failed to register"));
      setError(err.data?.message || "Failed to register");
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
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
        <Typography 
          variant="h4" 
          align="center" 
          color="primary" 
          fontWeight="bold" 
          gutterBottom
        >
          Create an Account
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
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
              <TextField
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
              <TextField
                fullWidth
                label="Role"
                {...register("role", { required: "Role is required" })}
                error={!!errors.role}
                helperText={errors.role?.message}
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
              <TextField
                fullWidth
                type={showPassword ? "text" : "password"}
                label="Password"
                {...register("password", { required: "Password is required" })}
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

            {error && (
              <Grid item xs={12}>
                <Alert severity="error">{error}</Alert>
              </Grid>
            )}

            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={isLoading}
                sx={{ 
                  py: 1.5, 
                  fontWeight: 'bold',
                  borderRadius: 2,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)'
                  }
                }}
              >
                {isLoading ? "Signing Up..." : "Sign Up"}
              </Button>
            </Grid>
          </Grid>
        </form>

        <Typography 
          variant="body2" 
          align="center" 
          sx={{ mt: 2, color: 'text.secondary' }}
        >
          Already have an account? 
          <Button 
            color="primary" 
            onClick={() => navigate("/signin")}
            sx={{ ml: 1, textTransform: 'none' }}
          >
            Sign In
          </Button>
        </Typography>
      </Paper>
    </Box>
  );
};

export default SignUp;