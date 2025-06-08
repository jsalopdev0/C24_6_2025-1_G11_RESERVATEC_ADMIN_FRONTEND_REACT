import {
  Box,
  IconButton,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
} from "@mui/material";
import { tokens, ColorModeContext } from "../../../theme";
import { useContext, useState } from "react";
import {
  DarkModeOutlined,
  LightModeOutlined,
  MenuOutlined,
  NotificationsOutlined,
  PersonOutlined,
  SettingsOutlined,
} from "@mui/icons-material";
import { ToggledContext } from "../../../App";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const { toggled, setToggled } = useContext(ToggledContext);
  const isMdDevices = useMediaQuery("(max-width:768px)");
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleCloseMenu();
    localStorage.removeItem("auth");
    sessionStorage.setItem("logout_done", "1");
    navigate("/login");
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" p={2}>
      {/* Botón del menú lateral para móviles */}
      <IconButton
        sx={{ display: isMdDevices ? "flex" : "none" }}
        onClick={() => setToggled(!toggled)}
      >
        <MenuOutlined />
      </IconButton>

      {/* Espaciador para mantener los íconos alineados a la derecha */}
      <Box sx={{ flexGrow: 1 }} />

      {/* Íconos del lado derecho */}
      <Box>
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? <LightModeOutlined /> : <DarkModeOutlined />}
        </IconButton>

        <IconButton onClick={handleProfileClick}>
          <PersonOutlined />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={isMenuOpen}
          onClose={handleCloseMenu}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Navbar;