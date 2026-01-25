import {
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Box,
  Card,
  CardContent,
  CardActions,
  Chip,
  AppBar,
  Toolbar,
  Avatar,
  Menu,
  MenuItem
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import SparklesIcon from "@mui/icons-material/AutoAwesome";
import SaveIcon from "@mui/icons-material/Save";
import SettingsIcon from "@mui/icons-material/Settings";

export default function Dashboard() {
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
              {/* Avatar initial handled by user context */}
            </Avatar>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={() => { navigate("/profile"); handleMenuClose(); }}>Profile</MenuItem>
              <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            fontWeight: 700,
            background: "linear-gradient(135deg, #5b67d8 0%, #6b5b95 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 1,
            fontSize: "2.5rem"
          }}
        >
          Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: "#7f8fa3", mb: 4 }}>
          Here's an overview of your AI writing tools.
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: 6
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <SparklesIcon sx={{ color: "#5b67d8", fontSize: 28 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: "#2c3e50" }}>
                  Total Rewrites
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: "#5b67d8", mb: 1 }}>
                42
              </Typography>
              <Chip label="This month" variant="outlined" size="small" sx={{ borderColor: "#e0e7ff", color: "#5b67d8" }} />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: 6
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <SaveIcon sx={{ color: "#6b5b95", fontSize: 28 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: "#2c3e50" }}>
                  Saved Drafts
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: "#6b5b95", mb: 1 }}>
                18
              </Typography>
              <Chip label="Recently used" variant="outlined" size="small" sx={{ borderColor: "#e0e7ff", color: "#6b5b95" }} />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: 6
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <SettingsIcon sx={{ color: "#7f8fa3", fontSize: 28 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: "#2c3e50" }}>
                  Features Used
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: "#7f8fa3", mb: 1 }}>
                9/12
              </Typography>
              <Chip label="Advanced mode active" variant="outlined" size="small" sx={{ borderColor: "#e0e7ff", color: "#7f8fa3" }} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: 600, mb: 3, color: "#2c3e50" }}
        >
          Quick Actions
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                background: "linear-gradient(135deg, rgba(91, 103, 216, 0.05) 0%, rgba(107, 91, 149, 0.05) 100%)",
                border: "1px solid #e0e7ff",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: "#5b67d8",
                  boxShadow: "0 4px 12px rgba(91, 103, 216, 0.1)"
                }
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: "#2c3e50" }}>
                  AI Writing Features
                </Typography>
                <Typography variant="body2" sx={{ color: "#7f8fa3", mb: 2 }}>
                  Rewrite, analyze, and improve text using advanced AI algorithms.
                </Typography>
                <Typography variant="caption" sx={{ color: "#a0aec0" }}>
                  Access 12+ writing tools including rewriting, summarization, and plagiarism detection.
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  sx={{
                    background: "linear-gradient(135deg, #5b67d8 0%, #6b5b95 100%)"
                  }}
                  onClick={() => navigate("/features")}
                >
                  Open Feature Panel
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              sx={{
                background: "linear-gradient(135deg, rgba(107, 91, 149, 0.05) 0%, rgba(160, 174, 192, 0.05) 100%)",
                border: "1px solid #e0e7ff",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: "#6b5b95",
                  boxShadow: "0 4px 12px rgba(107, 91, 149, 0.1)"
                }
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: "#2c3e50" }}>
                   Recent Drafts
                </Typography>
                <Typography variant="body2" sx={{ color: "#7f8fa3", mb: 2 }}>
                  View and manage your previously saved text documents.
                </Typography>
                <Typography variant="caption" sx={{ color: "#a0aec0" }}>
                  Access all your saved work with full editing and analysis capabilities.
                </Typography>
              </CardContent>
              <CardActions>
                <Button variant="outlined">View Drafts</Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>

        <Paper
          sx={{
            mt: 4,
            p: 3,
            background: "linear-gradient(135deg, #5b67d8 0%, #6b5b95 100%)",
            color: "white",
            textAlign: "center",
            borderRadius: 2
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
             Premium Features Unlocked
          </Typography>
          <Typography variant="body2">
            You now have access to all advanced AI writing tools. Start using them to enhance your content today!
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
