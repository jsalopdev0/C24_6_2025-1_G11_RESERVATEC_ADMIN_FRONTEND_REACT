/* eslint-disable react/prop-types */
import {
  Avatar,
  Box,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { tokens } from "../../../theme";
import { Menu, MenuItem, Sidebar } from "react-pro-sidebar";
import {
  BarChartOutlined,
  CalendarTodayOutlined,
  ContactsOutlined,
  DashboardOutlined,
  DonutLargeOutlined,
  HelpOutlineOutlined,
  MapOutlined,
  MenuOutlined,
  PeopleAltOutlined,
  PersonOutlined,
  ReceiptOutlined,
  TimelineOutlined,
  WavesOutlined,
} from "@mui/icons-material";
import logo from "../../../assets/images/logo.png";
import avatarDefault from "../../../assets/images/avatar.png";
import Item from "./Item";
import { ToggledContext } from "../../../App";
import { getPerfilUsuario } from "../../../api/usuarios";

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { toggled, setToggled } = useContext(ToggledContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const data = await getPerfilUsuario();
        setPerfil({
          name: data.name,
          email: data.email,
          foto: data.foto || avatarDefault,
        });
      } catch (error) {
        console.error("Error al obtener perfil", error);
      }
    };
    fetchPerfil();
  }, []);

  return (
    <Sidebar
      backgroundColor={colors.primary[400]}
      rootStyles={{ border: 0, height: "100%" }}
      collapsed={collapsed}
      onBackdropClick={() => setToggled(false)}
      toggled={toggled}
      breakPoint="md"
      width="260px"
    >
      <Menu
  menuItemStyles={{
    button: {
      ":hover": { background: "transparent" },
      fontSize: "17px",
    },
  }}
>
  <MenuItem
    rootStyles={{
      margin: "10px 0 20px 0",
      color: colors.gray[100],
      fontSize: "17px",
    }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {!collapsed && (
        <Box display="flex" alignItems="center" gap="12px">
          <img
            style={{ width: "42px", height: "42px", borderRadius: "10px" }}
            src={logo}
            alt="ReservaTec logo"
          />
          <Typography
            variant="h4"
            fontWeight="bold"
            textTransform="capitalize"
            sx={{ color: "#00B2E2", fontSize: "22px" }}
          >
            ReservaTec
          </Typography>
        </Box>
      )}
      <IconButton onClick={() => setCollapsed(!collapsed)}>
        <MenuOutlined fontSize="medium" />
      </IconButton>
    </Box>
  </MenuItem>
</Menu>


      {!collapsed && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            mb: "25px",
          }}
        >
          {perfil ? (
            <>
              <Avatar
                alt="avatar"
                src={perfil.foto}
                sx={{ width: "100px", height: "100px" }}
              />
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h5" fontWeight="bold" color={colors.gray[100]} fontSize="18px">
                  {perfil.name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#00B2E2", wordBreak: "break-word", fontSize: "15px" }}
                >
                  {perfil.email}
                </Typography>
              </Box>
            </>
          ) : (
            <>
              <Avatar
                sx={{ width: "100px", height: "100px", bgcolor: colors.blueAccent[500] }}
              />
              <Box sx={{ textAlign: "center", width: "80%" }}>
                <Box
                  sx={{
                    bgcolor: colors.primary[300],
                    height: "24px",
                    borderRadius: "4px",
                    mb: "6px",
                    width: "100%",
                    animation: "pulse 1.5s infinite ease-in-out",
                  }}
                />
                <Box
                  sx={{
                    bgcolor: colors.primary[300],
                    height: "18px",
                    borderRadius: "4px",
                    width: "80%",
                    margin: "0 auto",
                    animation: "pulse 1.5s infinite ease-in-out",
                  }}
                />
              </Box>
            </>
          )}
        </Box>
      )}

      <Box mb={5} pl={collapsed ? undefined : "5%"}>
        <Menu
          menuItemStyles={{
            button: {
              ":hover": {
                color: "#00B2E2",
                background: "transparent",
                transition: ".4s ease",
              },
              fontSize: "17px",
              marginBottom: "10px", // espacio entre ítems
            },
          }}
        >
          <Item title="Dashboard" path="/" icon={<DashboardOutlined fontSize="medium" />} />
        </Menu>

       
        <Menu
          menuItemStyles={{
            button: {
              ":hover": {
                color: "#00B2E2",
                background: "transparent",
              },
              fontSize: "17px",
              marginBottom: "10px",
            },
          }}
        >
          <Item title="Usuarios" path="/usuarios" icon={<ContactsOutlined fontSize="medium" />} />
          <Item title="Reservas" path="/reservas" icon={<ReceiptOutlined fontSize="medium" />} />
          <Item title="Espacios" path="/espacios" icon={<PeopleAltOutlined fontSize="medium" />} />
          <Item title="Notififaciones" path="/notificaciones" icon={<PeopleAltOutlined fontSize="medium" />} />

          <Item title="Fechas Bloqueadas" path="/fechas-bloqueadas" icon={<CalendarTodayOutlined fontSize="medium" />} />
          <Item title="Reservas Calendario" path="/calendario" icon={<CalendarTodayOutlined fontSize="medium" />} />
        </Menu>
      
      </Box>

    </Sidebar>
  );
};

export default SideBar;
