import React, { useContext } from "react";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { Navbar, SideBar } from "./scenes";
import { Outlet } from "react-router-dom";

export const ToggledContext = React.createContext(null);

function App() {
  const [theme, colorMode] = useMode();
  const [toggled, setToggled] = React.useState(false);
  const values = { toggled, setToggled };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToggledContext.Provider value={values}>
          <Box
            sx={{
              display: "flex",
              height: "100vh",
              width: "100vw",
              overflow: "hidden", // Evita scroll lateral en toda la app
            }}
          >
            <SideBar />
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                height: "100%",
                overflow: "hidden",
              }}
            >
              <Navbar />
              <Box
                sx={{
                  flexGrow: 1,
                  overflowY: "auto",
                  overflowX: "hidden",
                  px: 2,
                  pt: 1,
                }}
              >
                <Outlet />
              </Box>
            </Box>
          </Box>
        </ToggledContext.Provider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
