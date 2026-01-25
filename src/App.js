import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Signup from "./pages/signup";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Features from "./pages/features";
import Profile from "./pages/profile";

const theme = createTheme({
  palette: {
    primary: {
      main: "#5b67d8",
      light: "#eff2ff",
      dark: "#3d4a9e"
    },
    secondary: {
      main: "#6b5b95",
      light: "#f5f3fa",
      dark: "#4a3f66"
    },
    text: {
      primary: "#2c3e50",
      secondary: "#7f8fa3"
    },
    background: {
      default: "#fafbfd",
      paper: "#ffffff"
    }
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "-apple-system", "BlinkMacSystemFont", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: "2.75rem",
      letterSpacing: "-0.8px",
      lineHeight: 1.2,
      color: "#1a202c"
    },
    h2: {
      fontWeight: 700,
      fontSize: "2.25rem",
      letterSpacing: "-0.5px",
      lineHeight: 1.3,
      color: "#2c3e50"
    },
    h3: {
      fontWeight: 700,
      fontSize: "1.875rem",
      letterSpacing: "-0.3px",
      lineHeight: 1.4,
      color: "#2c3e50"
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.5rem",
      letterSpacing: "-0.2px",
      lineHeight: 1.4,
      color: "#2c3e50"
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.25rem",
      letterSpacing: "0px",
      lineHeight: 1.5,
      color: "#2c3e50"
    },
    h6: {
      fontWeight: 600,
      fontSize: "1rem",
      letterSpacing: "0px",
      lineHeight: 1.5,
      color: "#2c3e50"
    },
    body1: {
      fontSize: "0.95rem",
      lineHeight: 1.7,
      color: "#2c3e50",
      letterSpacing: "0.3px"
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.6,
      color: "#7f8fa3",
      letterSpacing: "0.2px"
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
      letterSpacing: "0.3px",
      fontSize: "0.95rem"
    },
    caption: {
      fontSize: "0.8rem",
      lineHeight: 1.5,
      color: "#a0aec0"
    }
  },
  shape: {
    borderRadius: 12
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "10px 24px",
          fontSize: "0.95rem",
          textTransform: "none",
          fontWeight: 600,
          border: "none",
          transition: "all 0.2s ease"
        },
        contained: {
          boxShadow: "0 2px 8px rgba(91, 103, 216, 0.25)",
          "&:hover": {
            boxShadow: "0 4px 16px rgba(91, 103, 216, 0.35)"
          }
        },
        outlined: {
          borderColor: "#e0e7ff",
          color: "#5b67d8",
          "&:hover": {
            borderColor: "#5b67d8",
            backgroundColor: "#eff2ff"
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#ffffff",
          backgroundClip: "padding-box"
        },
        elevation0: {
          boxShadow: "none"
        },
        elevation1: {
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)"
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            backgroundColor: "#f8fafc",
            border: "1px solid #e0e7ff",
            transition: "all 0.2s ease",
            "& fieldset": {
              borderColor: "#e0e7ff"
            },
            "&:hover fieldset": {
              borderColor: "#d0deff"
            },
            "&.Mui-focused fieldset": {
              borderColor: "#5b67d8",
              borderWidth: "1.5px"
            }
          },
          "& .MuiOutlinedInput-input": {
            fontSize: "0.95rem"
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
          border: "1px solid #f0f4ff",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            borderColor: "#e0e7ff"
          }
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#ffffff",
          backgroundImage: "linear-gradient(135deg, #fafbfd 0%, #f5f7fa 100%)"
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontSize: "0.8rem",
          fontWeight: 500,
          height: 28
        },
        outlined: {
          borderColor: "#e0e7ff",
          color: "#5b67d8"
        }
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: "0.95rem",
          color: "#2c3e50",
          "&:hover": {
            backgroundColor: "#eff2ff"
          },
          "&.Mui-selected": {
            backgroundColor: "#eff2ff",
            color: "#5b67d8"
          }
        }
      }
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/features" element={<Features />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
