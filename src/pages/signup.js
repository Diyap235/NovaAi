import {
  Container,
  TextField,
  Button,
  Typography,
  MenuItem,
  Box,
  Alert,
  Paper,
  Link,
  CircularProgress
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTheme } from "@mui/material/styles";

export default function Signup() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Student"
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = "Valid email is required";
    }
    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSuccessMessage("Account created successfully! Redirecting...");
      setLoading(false);
      setTimeout(() => navigate("/login"), 1500);
    }, 1000);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, #fafbfd 0%, #f5f7fa 50%, #eff2ff 100%)`,
        backgroundAttachment: "fixed",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><defs><pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(91,103,216,0.03)" stroke-width="1"/></pattern></defs><rect width="1200" height="800" fill="url(%23grid)"/></svg>')`,
          backgroundSize: "60px 60px",
          pointerEvents: "none"
        }
      }}
    >
      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            background: "rgba(255, 255, 255, 0.95)",
            border: "1px solid #e0e7ff",
            backdropFilter: "blur(10px)"
          }}
        >
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 700,
              background: "linear-gradient(135deg, #5b67d8 0%, #6b5b95 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 0.5,
              fontSize: "2.5rem"
            }}
          >
            NovaAI
          </Typography>
          <Typography
            variant="body1"
            align="center"
            gutterBottom
            sx={{ color: "#7f8fa3", mb: 3, fontWeight: 500 }}
          >
            Academic Writing Assistant
          </Typography>

          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            error={!!errors.name}
            helperText={errors.name}
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            error={!!errors.email}
            helperText={errors.email}
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            error={!!errors.password}
            helperText={errors.password}
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            disabled={loading}
          />

          <TextField
            select
            fullWidth
            label="Account Type"
            name="role"
            value={formData.role}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            disabled={loading}
          >
            <MenuItem value="Student">Student</MenuItem>
            <MenuItem value="Professional">Professional</MenuItem>
            <MenuItem value="Educator">Educator</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>

          <Button
            fullWidth
            variant="contained"
            size="large"
            sx={{
              mt: 3,
              mb: 2,
              py: 1.5,
              fontSize: "1rem",
              fontWeight: 600,
              background: "linear-gradient(135deg, #5b67d8 0%, #6b5b95 100%)",
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: "0 8px 20px rgba(91, 103, 216, 0.4)"
              }
            }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Create Account"}
          </Button>

          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Typography variant="body2" sx={{ color: "#7f8fa3" }}>
              Already have an account?{" "}
              <Link
                onClick={() => navigate("/login")}
                sx={{
                  cursor: "pointer",
                  fontWeight: 600,
                  color: "#5b67d8",
                  "&:hover": { textDecoration: "underline" }
                }}
              >
                Sign in here
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
