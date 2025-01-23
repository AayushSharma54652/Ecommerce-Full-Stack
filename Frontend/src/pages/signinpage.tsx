import React from "react";
import { 
  useForm, 
  SubmitHandler 
} from "react-hook-form";
import { 
  useNavigate 
} from "react-router-dom";
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

const SignIn: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<SignInFormInputs>();
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit: SubmitHandler<SignInFormInputs> = async (data) => {
    dispatch(loginStart());
    try {
      const response = await loginUser(data).unwrap();
      const { user, accessToken } = response.data;
      dispatch(loginSuccess({ user, accessToken }));
      localStorage.setItem("accessToken", accessToken);
      navigate("/");
    } catch (err: any) {
      dispatch(loginFailure(err.data?.message || "Failed to login"));
      setError(err.data?.message || "Failed to login");
    }
  };

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
          maxWidth: 400, 
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
          <Typography 
            variant="h4" 
            color="primary" 
            fontWeight="bold"
          >
            Sign In
          </Typography>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
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

          <TextField
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

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

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
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>

          <Box 
            sx={{ 
              mt: 2, 
              textAlign: 'center' 
            }}
          >
            <Typography variant="body2">
              Don't have an account? {" "}
              <Button 
                color="primary"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </Button>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default SignIn;