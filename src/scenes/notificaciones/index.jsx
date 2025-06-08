import {
  Box,
  Paper,
  useTheme,
  Button,
  Snackbar,
  Alert,
  TextField,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Add, Edit } from "@mui/icons-material";
import { Header } from "../../components";
import { DataGrid, GridToolbar, esES } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import { tokens } from "../../theme";
import {
  getTodasLasNotificaciones,
  cambiarEstadoNotificacion,
} from "../../api/notificaciones";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";
import NotificacionCreateModal from "./components/NotificacionCreateModal";
import Switch from "@mui/material/Switch";

const Notificaciones = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [notificaciones, setNotificaciones] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [openCrearModal, setOpenCrearModal] = useState(false);
  const [notificacionEditando, setNotificacionEditando] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchNotificaciones = async () => {
    try {
      const res = await getTodasLasNotificaciones();
      let filtradas = res;

      if (fechaSeleccionada) {
        const seleccion = fechaSeleccionada.toISOString().split("T")[0];
        filtradas = filtradas.filter(n => n.fechaCreacion.startsWith(seleccion));
      }

      filtradas.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));
      setNotificaciones(filtradas);
    } catch (err) {
      console.error("Error al obtener notificaciones", err);
      showSnackbar("Error al obtener notificaciones", "error");
    }
  };

  useEffect(() => {
    fetchNotificaciones();
  }, [fechaSeleccionada]);

  const handleEstadoToggle = async (id, estadoActual) => {
    try {
      await cambiarEstadoNotificacion(id, !estadoActual);
      showSnackbar("Estado actualizado");
      fetchNotificaciones();
    } catch (err) {
      console.error("Error al cambiar estado", err);
      showSnackbar("Error al cambiar estado", "error");
    }
  };

  const columns = [
    {
      field: "contenido",
      headerName: "Contenido",
      flex: 3,
    },
    {
      field: "fechaCreacion",
      headerName: "Fecha",
      flex: 1.2,
      valueGetter: (params) => {
        const fecha = new Date(params.row.fechaCreacion);
        return fecha.toLocaleDateString("es-PE");
      },
    },
    {
      field: "activo",
      headerName: "Activo",
      flex: 1,
      renderCell: (params) => (
        <Switch
          checked={params.value}
          onChange={() => handleEstadoToggle(params.row.id, params.value)}
          size="small"
          color="success"
        />
      ),
    },
    {
      field: "acciones",
      headerName: "Acciones",
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        const isDark = theme.palette.mode === "dark";
        const color = isDark ? "#FFFFFF" : "#000000";

        return (
          <Tooltip title="Editar">
            <IconButton
              onClick={() => {
                setNotificacionEditando(params.row);
                setOpenCrearModal(true);
              }}
              sx={{ color }}
            >
              <Edit />
            </IconButton>
          </Tooltip>
        );
      }

    },
  ];

  return (
    <Box m="20px">
      <Header title="NOTIFICACIONES" />

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box display="flex" alignItems="center" gap={2}>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
            <DatePicker
              label="Filtrar por fecha"
              value={fechaSeleccionada}
              onChange={(newValue) => setFechaSeleccionada(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    minWidth: 170,
                    borderRadius: "6px",
                    bgcolor: theme.palette.mode === "dark" ? colors.primary[400] : "white",
                    "& .MuiInputBase-input": {
                      color: theme.palette.text.primary,
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: colors.gray[400],
                    },
                  }}
                />
              )}
            />
          </LocalizationProvider>

          <Button
            variant="outlined"
            onClick={() => setFechaSeleccionada(null)}
            sx={{
              fontWeight: "bold",
              color: theme.palette.mode === "dark" ? "white" : "inherit",
              borderColor: theme.palette.mode === "dark" ? "white" : undefined,
            }}
          >
            Limpiar filtros
          </Button>
        </Box>

        <Button
          variant="contained"
          onClick={() => {
            setNotificacionEditando(null);
            setOpenCrearModal(true);
          }}
          startIcon={<Add />}
          sx={{
            bgcolor: colors.blueAccent[700],
            color: "#fcfcfc",
            fontSize: "14px",
            fontWeight: "bold",
            px: 3,
            py: 1.5,
            ":hover": { bgcolor: colors.blueAccent[800] },
          }}
        >
          Crear notificación
        </Button>
      </Box>

      <Box height="75vh">
        <DataGrid
          rows={notificaciones}
          columns={columns}
          getRowId={(row) => row.id}
          components={{ Toolbar: GridToolbar }}
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 20 },
            },
          }}
          pageSizeOptions={[10, 20, 50]}
          checkboxSelection
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? "even-row" : ""
          }
          sx={{
            fontSize: "16px",
            "& .MuiDataGrid-cell": { py: 2 },
            "& .MuiDataGrid-columnHeaders": { fontSize: "18px", fontWeight: "bold", py: 2 },
            "& .MuiDataGrid-row": {
              boxShadow: "inset 0 -1px 0 rgba(255,255,255,0.08)",
              transition: "background-color 0.2s ease",
            },
            "& .even-row": {
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.04)"
                  : "rgba(0,0,0,0.03)",
              ":hover": {
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.08)",
              },
            },
          }}
        />
      </Box>

      <NotificacionCreateModal
        open={openCrearModal}
        onClose={() => {
          setOpenCrearModal(false);
          setNotificacionEditando(null);
        }}
        onSuccess={() => {
          setOpenCrearModal(false);
          setNotificacionEditando(null);
          fetchNotificaciones();
          showSnackbar("Notificación guardada correctamente");
        }}
        notificacion={notificacionEditando}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Notificaciones;
