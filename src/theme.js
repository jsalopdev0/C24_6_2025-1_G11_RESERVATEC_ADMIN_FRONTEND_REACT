import { createTheme } from "@mui/material";
import { useMemo, useState, createContext } from "react";

// Color Design Tokens
export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        gray: {
          100: "#e0e0e0",
          200: "#c2c2c2",
          300: "#a3a3a3",
          400: "#858585",
          500: "#666666",
          600: "#525252",
          700: "#3d3d3d",
          800: "#292929",
          900: "#141414",
        },
        primary: {
          100: "#d0d1d5",
          200: "#a1a4ab",
          300: "#727681",
          400: "#434957",
          500: "#141b2d",
          600: "#101624",
          700: "#0c101b",
          800: "#080b12",
          900: "#040509",
        },
        greenAccent: {
          100: "#ccedf1",
          200: "#99dbe3",
          300: "#66c8d6",
          400: "#33b6c8",
          500: "#00728a",
          600: "#005a6e",
          700: "#004253",
          800: "#002b37",
          900: "#00131c",
        },
        redAccent: {
          100: "#f8dcdb",
          200: "#f1b9b7",
          300: "#e99592",
          400: "#e2726e",
          500: "#db4f4a",
          600: "#af3f3b",
          700: "#832f2c",
          800: "#58201e",
          900: "#2c100f",
        },
        blueAccent: {
          100: "#e0f7fd",
          200: "#b3e8f8",
          300: "#80d8f3",
          400: "#4dc9ee",
          500: "#00b2e2",
          600: "#0090b5",
          700: "#006e88",
          800: "#004c5b",
          900: "#002a2e",
        },
        customAccent: {
          main: "#00B2E2",
        },
      }
    : {
        gray: {
          100: "#141414",
          200: "#292929",
          300: "#3d3d3d",
          400: "#525252",
          500: "#666666",
          600: "#858585",
          700: "#a3a3a3",
          800: "#c2c2c2",
          900: "#e0e0e0",
        },
        primary: {
          100: "#040509",
          200: "#080b12",
          300: "#0c101b",
          400: "#fcfcfc",
          500: "#f2f0f0",
          600: "#434957",
          700: "#727681",
          800: "#a1a4ab",
          900: "#d0d1d5",
        },
        greenAccent: {
          100: "#0f2922",
          200: "#1e5245",
          300: "#2e7c67",
          400: "#3da58a",
          500: "#4cceac",
          600: "#70d8bd",
          700: "#94e2cd",
          800: "#b7ebde",
          900: "#dbf5ee",
        },
        redAccent: {
          100: "#2c100f",
          200: "#58201e",
          300: "#832f2c",
          400: "#af3f3b",
          500: "#db4f4a",
          600: "#e2726e",
          700: "#e99592",
          800: "#f1b9b7",
          900: "#f8dcdb",
        },
        blueAccent: {
          100: "#e0f7fd",
          200: "#b3e8f8",
          300: "#80d8f3",
          400: "#4dc9ee",
          500: "#00b2e2",
          600: "#0090b5",
          700: "#006e88",
          800: "#004c5b",
          900: "#002a2e",
        },
        customAccent: {
          main: "#00B2E2",
        },
        
      }),
});

// Theme Settings
export const themeSettings = (mode) => {
  
  const colors = tokens(mode);

  return {
    palette: {
      mode: mode,
      primary: {
        main: colors.primary[500],
      },
      secondary: {
        main: colors.greenAccent[500],
      },
      neutral: {
        dark: colors.gray[700],
        main: colors.gray[500],
        light: colors.gray[100],
      },
      background: {
        default: colors.primary[500],
      },
      customAccent: colors.customAccent,
    },
    typography: {
      fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
    
    components: {
      MuiDataGrid: {
        styleOverrides: {
          root: {
            border: "none",
            color: mode === "dark" ? "#ffffff" : "#000000",
          },
          columnHeaders: {
            backgroundColor: "#00B2E2",
            color: mode === "dark" ? "#ffffff" : "#000000",
            fontWeight: "bold",
            borderBottom: "none",
          },
          footerContainer: {
            backgroundColor: "#00B2E2",
            color: mode === "dark" ? "#ffffff" : "#000000",
            borderTop: "none",
          },
          toolbarContainer: {
            "& .MuiButton-text": {
              color: mode === "dark" ? "#ffffff" : "#000000",
            },
          },
          cell: {
            borderBottom: "none",
          },
          virtualScroller: {
            backgroundColor: mode === "dark" ? colors.primary[400] : "#ffffff",
          },
          checkboxInput: {
            color: "#00B2E2",
          },
          iconSeparator: {
            color: mode === "dark" ? "#ffffff" : "#000000",
          },
        },
      },
    },
  };
};

// Context & Hook
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  const [mode, setMode] = useState("dark");

  const colorMode = useMemo(() => ({
    toggleColorMode: () =>
      setMode((prev) => (prev === "light" ? "dark" : "light")),
  }), []);

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return [theme, colorMode];
};
