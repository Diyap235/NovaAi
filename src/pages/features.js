import {
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Divider,
  Box,
  Chip,
  LinearProgress,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  Avatar,
  Menu,
  MenuItem
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import SparklesIcon from "@mui/icons-material/AutoAwesome";

export default function Features() {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFeatures, setSelectedFeatures] = useState({
    rewrite: false,
    summarize: false,
    plagiarism: false,
    humanScore: false,
    aiDetect: false,
    grammar: false,
    consistency: false,
    keywords: false,
    reorder: false,
    explain: false,
    titles: false,
    compare: false
  });

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    navigate("/login");
  };

  const features = [
    { id: "rewrite", label: "Core Rewrite Engine", icon: "✏️" },
    { id: "summarize", label: "Text Summarization", icon: "📄" },
    { id: "plagiarism", label: "Plagiarism Risk Check", icon: "🔍" },
    { id: "humanScore", label: "Human-Likeness Scoring", icon: "👤" },
    { id: "aiDetect", label: "AI-Text Pattern Detection", icon: "🤖" },
    { id: "grammar", label: "Grammar Assistance", icon: "✅" },
    { id: "consistency", label: "Consistency Checker", icon: "🔄" },
    { id: "keywords", label: "Keyword Analysis", icon: "🏷️" },
    { id: "reorder", label: "Paragraph Reordering", icon: "↕️" },
    { id: "explain", label: "Explain Changes Feature", icon: "💡" },
    { id: "titles", label: "Title Generation", icon: "📝" },
    { id: "compare", label: "Side-by-Side Comparison", icon: "⚖️" }
  ];

  const handleFeatureToggle = (featureId) => {
    setSelectedFeatures(prev => ({
      ...prev,
      [featureId]: !prev[featureId]
    }));
  };

  const handleRunFeatures = async () => {
    if (!inputText.trim()) {
      alert("Please enter some text to process");
      return;
    }

    const activeFeatures = Object.keys(selectedFeatures).filter(
      key => selectedFeatures[key]
    );

    if (activeFeatures.length === 0) {
      alert("Please select at least one feature");
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const featureNames = activeFeatures
        .map(f => features.find(feat => feat.id === f)?.label)
        .join(", ");
      
      setOutput(
        `✨ Processing complete!\n\nApplied Features: ${featureNames}\n\n` +
        `Original Text:\n"${inputText}"\n\n` +
        `Enhanced Output:\n"${inputText} [Enhanced by NovaAI]"\n\n` +
        `Analysis:\n` +
        `• Human Likeness Score: 94%\n` +
        `• Plagiarism Risk: 2%\n` +
        `• Grammar Score: 98%\n` +
        `• Content Quality: Excellent`
      );
      setLoading(false);
    }, 1500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectedCount = Object.values(selectedFeatures).filter(Boolean).length;

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
        <Box sx={{ mb: 4 }}>
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
            Feature Panel
          </Typography>
          <Typography variant="body1" sx={{ color: "#7f8fa3" }}>
            Select features below and paste your text to start enhancing with AI.
          </Typography>
        </Box>

        {/* Input & Output */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                border: "1px solid #e0e7ff",
                bgcolor: "white",
                background: "rgba(255, 255, 255, 0.8)"
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: "#2c3e50" }}>
                📝 Original Text
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={10}
                placeholder="Paste your text here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                variant="standard"
                disabled={loading}
                sx={{
                  "& .MuiInput-root": {
                    fontSize: "0.95rem",
                    fontFamily: "monospace"
                  }
                }}
              />
              <Box sx={{ mt: 2, color: "#a0aec0", fontSize: "0.875rem" }}>
                {inputText.length} characters
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                border: "1px solid #e0e7ff",
                bgcolor: "white",
                background: "rgba(255, 255, 255, 0.8)",
                display: "flex",
                flexDirection: "column"
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: "#2c3e50" }}>
                  ✨ Enhanced Output
                </Typography>
                {output && (
                  <Button
                    startIcon={<ContentCopyIcon />}
                    size="small"
                    variant="outlined"
                    onClick={handleCopy}
                  >
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                )}
              </Box>
              <TextField
                fullWidth
                multiline
                rows={10}
                value={output}
                readOnly
                variant="standard"
                placeholder="Enhanced text will appear here..."
                sx={{
                  flexGrow: 1,
                  "& .MuiInput-root": {
                    fontSize: "0.95rem",
                    fontFamily: "monospace"
                  }
                }}
              />
              {loading && (
                <Box sx={{ mt: 2 }}>
                  <LinearProgress sx={{ mb: 1 }} />
                  <Typography variant="caption" sx={{ color: "#a0aec0" }}>
                    Processing... This may take a few seconds.
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Feature List */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: "#2c3e50" }}>
              🎯 Select Features
            </Typography>
            <Chip
              label={`${selectedCount} selected`}
              color={selectedCount > 0 ? "primary" : "default"}
              variant="outlined"
              sx={{ color: "#5b67d8", borderColor: "#e0e7ff" }}
            />
          </Box>

          <Grid container spacing={2}>
            {features.map((feature) => (
              <Grid item xs={12} sm={6} md={4} key={feature.id}>
                <Card
                  sx={{
                    cursor: "pointer",
                    border: selectedFeatures[feature.id] ? "1px solid #5b67d8" : "1px solid #e0e7ff",
                    bgcolor: selectedFeatures[feature.id] ? "#f8fafz" : "white",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      boxShadow: "0 2px 8px rgba(91, 103, 216, 0.1)",
                      borderColor: "#d0deff"
                    }
                  }}
                  onClick={() => handleFeatureToggle(feature.id)}
                >
                  <CardContent sx={{ p: 2 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedFeatures[feature.id]}
                          onChange={() => handleFeatureToggle(feature.id)}
                          sx={{
                            color: "#d0deff",
                            "&.Mui-checked": {
                              color: "#5b67d8"
                            }
                          }}
                        />
                      }
                      label={
                        <Typography variant="body2" sx={{ fontWeight: 500, ml: 1, color: "#2c3e50" }}>
                          {feature.icon} {feature.label}
                        </Typography>
                      }
                      sx={{ m: 0, width: "100%" }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Run Button */}
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
          <Button
            variant="contained"
            size="large"
            sx={{
              px: 6,
              py: 2,
              fontSize: "1rem",
              fontWeight: 600,
              background: "linear-gradient(135deg, #5b67d8 0%, #6b5b95 100%)",
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: "0 8px 20px rgba(91, 103, 216, 0.4)"
              }
            }}
            onClick={handleRunFeatures}
            disabled={loading}
          >
            {loading ? "Processing..." : "✨ Run Selected Features"}
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => {
              setInputText("");
              setOutput("");
              setSelectedFeatures(Object.keys(selectedFeatures).reduce((acc, key) => {
                acc[key] = false;
                return acc;
              }, {}));
            }}
            disabled={loading}
          >
            Clear All
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
