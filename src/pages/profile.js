import {
  Container,
  Typography,
  Box,
  Paper,
  AppBar,
  Toolbar,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Chip,
  Card,
  CardContent,
  Button
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SparklesIcon from "@mui/icons-material/AutoAwesome";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import BadgeIcon from "@mui/icons-material/Badge";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function Profile() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    navigate("/login");
  };

  // Mock user data
  const user = {
    name: "John Doe",
    email: "john.doe@university.edu",
    role: "Student",
    joinDate: "January 15, 2026"
  };

  return (
    <Box sx={{ bgcolor: "#fafbfd", minHeight: "100vh" }}>
      <AppBar
        position="static"
        sx={{
          background: "#ffffff",
          color: "#2c3e50",
          border: "1px solid #e0e7ff",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)"
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
              background: "linear-gradient(135deg, #5b67d8 0%, #6b5b95 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
            onClick={() => navigate("/dashboard")}
          >
            <SparklesIcon /> NovaAI
          </Typography>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Avatar
              sx={{
                cursor: "pointer",
                background: "linear-gradient(135deg, #5b67d8 0%, #6b5b95 100%)"
              }}
              onClick={handleMenuOpen}
            >
              {user.name.charAt(0)}
            </Avatar>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={() => { navigate("/dashboard"); handleMenuClose(); }}>
                Dashboard
              </MenuItem>
              <MenuItem onClick={() => { navigate("/features"); handleMenuClose(); }}>
                Features
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ py: 4 }}>
        {/* Back Button */}
        <Button
          startIcon={<ArrowBackIcon />}
          sx={{
            mb: 3,
            color: "#5b67d8",
            fontWeight: 600,
            "&:hover": {
              bgcolor: "transparent"
            }
          }}
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </Button>

        {/* Profile Header Card */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            background: "linear-gradient(135deg, rgba(91, 103, 216, 0.05) 0%, rgba(107, 91, 149, 0.05) 100%)",
            border: "1px solid #e0e7ff",
            textAlign: "center",
            mb: 4
          }}
        >
          <Avatar
            sx={{
              width: 100,
              height: 100,
              mx: "auto",
              mb: 2,
              background: "linear-gradient(135deg, #5b67d8 0%, #6b5b95 100%)",
              fontSize: "2.5rem",
              fontWeight: 700
            }}
          >
            {user.name.charAt(0)}
          </Avatar>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#2c3e50",
              mb: 1
            }}
          >
            {user.name}
          </Typography>

          <Chip
            label={user.role}
            variant="outlined"
            sx={{
              borderColor: "#5b67d8",
              color: "#5b67d8",
              fontWeight: 600,
              height: 32
            }}
          />

          <Typography
            variant="body2"
            sx={{
              color: "#7f8fa3",
              mt: 2,
              fontSize: "0.875rem"
            }}
          >
            Member since {user.joinDate}
          </Typography>
        </Paper>

        {/* Profile Information */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 2,
            color: "#2c3e50"
          }}
        >
          Account Information
        </Typography>

        {/* Email Card */}
        <Card
          sx={{
            mb: 2,
            border: "1px solid #e0e7ff",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
            "&:hover": {
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
              borderColor: "#d0deff"
            },
            transition: "all 0.3s ease"
          }}
        >
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, p: 2.5 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 48,
                height: 48,
                borderRadius: "10px",
                background: "linear-gradient(135deg, rgba(91, 103, 216, 0.15) 0%, rgba(107, 91, 149, 0.15) 100%)"
              }}
            >
              <EmailIcon sx={{ color: "#5b67d8", fontSize: 24 }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" sx={{ color: "#a0aec0", display: "block", mb: 0.5 }}>
                Email Address
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500, color: "#2c3e50" }}>
                {user.email}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Role Card */}
        <Card
          sx={{
            mb: 2,
            border: "1px solid #e0e7ff",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
            "&:hover": {
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
              borderColor: "#d0deff"
            },
            transition: "all 0.3s ease"
          }}
        >
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, p: 2.5 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 48,
                height: 48,
                borderRadius: "10px",
                background: "linear-gradient(135deg, rgba(107, 91, 149, 0.15) 0%, rgba(160, 174, 192, 0.15) 100%)"
              }}
            >
              <BadgeIcon sx={{ color: "#6b5b95", fontSize: 24 }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" sx={{ color: "#a0aec0", display: "block", mb: 0.5 }}>
                Account Type
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500, color: "#2c3e50" }}>
                {user.role}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Name Card */}
        <Card
          sx={{
            mb: 4,
            border: "1px solid #e0e7ff",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
            "&:hover": {
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
              borderColor: "#d0deff"
            },
            transition: "all 0.3s ease"
          }}
        >
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, p: 2.5 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 48,
                height: 48,
                borderRadius: "10px",
                background: "linear-gradient(135deg, rgba(160, 174, 192, 0.15) 0%, rgba(127, 143, 163, 0.15) 100%)"
              }}
            >
              <PersonIcon sx={{ color: "#7f8fa3", fontSize: 24 }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" sx={{ color: "#a0aec0", display: "block", mb: 0.5 }}>
                Full Name
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500, color: "#2c3e50" }}>
                {user.name}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Info Box */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 2,
            background: "linear-gradient(135deg, rgba(91, 103, 216, 0.05) 0%, rgba(107, 91, 149, 0.05) 100%)",
            border: "1px solid #e0e7ff",
            textAlign: "center"
          }}
        >
          <Typography variant="body2" sx={{ color: "#7f8fa3", lineHeight: 1.6 }}>
            This is a read-only view of your profile information. 
            For account settings and changes, please contact support.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
