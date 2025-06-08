import {
  Box,
  InputBase,
  Paper,
  useTheme,
  Switch,
  Snackbar,
  Alert,
  Button,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { Header } from "../../components";
import { DataGrid, GridToolbar, esES } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import { tokens } from "../../theme";
import {
  getReservas,
  confirmarAsistencia,
  crearReserva,
} from "../../api/reservas";
import ReservaCreateModal from "./components/ReservaCreateModal";
import { getEspacios } from "../../api/espacios";
import { getUsuarios } from "../../api/usuarios";
import { getHorarios } from "../../api/horarios";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const Reservas = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [horarios, setHorarios] = useState([]);
  const [mostrarSoloHoy, setMostrarSoloHoy] = useState(false);
  const [query, setQuery] = useState("");
  const [openCrearModal, setOpenCrearModal] = useState(false);
  const [espacios, setEspacios] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const queryClient = useQueryClient();

  const {
    data: reservas = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['reservas', query, mostrarSoloHoy, fechaSeleccionada],
    queryFn: async () => {
      const response = await getReservas(query);
      let todas = response.data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      if (mostrarSoloHoy) {
        const hoy = new Date().toLocaleDateString("sv-SE");
        todas = todas.filter(r => r.fecha === hoy);
      } else if (fechaSeleccionada) {
        const seleccion = fechaSeleccionada.toISOString().split("T")[0];
        todas = todas.filter(r => r.fecha === seleccion);
      }
      return todas;
    },
    staleTime: 5 * 60 * 1000, // ❄️ 5 minutos sin recargar
    refetchOnWindowFocus: false, // 🚫 no refetch al volver a la pestaña
    refetchInterval: false, // 🚫 no polling automático
  });

  const fetchAuxData = async () => {
    try {
      const [espRes, usrRes, horRes] = await Promise.all([
        getEspacios(),
        getUsuarios(),
        getHorarios(),
      ]);
      setEspacios(espRes.data);
      setUsuarios(usrRes.data);
      setHorarios(horRes);
    } catch (error) {
      console.error("Error al obtener datos auxiliares", error);
      showSnackbar("Error al obtener datos auxiliares", "error");
    }
  };

  useEffect(() => {
    fetchAuxData();
  }, []);

  const handleSearchChange = (e) => setQuery(e.target.value);

  const handleCrearReserva = async (formData) => {
    try {
      const usuarioSeleccionado = usuarios.find((u) => u.id === formData.usuarioId);
      const payload = {
        usuarioCode: usuarioSeleccionado?.code,
        espacioId: formData.espacioId,
        fecha: formData.fecha,
        horarioId: formData.horarioId,
      };
      await crearReserva(payload);
      showSnackbar("Reserva creada exitosamente");
      refetch(); // 🔁 vuelve a cargar las reservas
      setOpenCrearModal(false);
    } catch (error) {
      const mensaje = error.response?.data?.message || error.message || "Error inesperado al crear la reserva";
      console.error("Error al crear reserva:", mensaje);
      showSnackbar(mensaje, "error");
    }
  };

  const columns = [
    { field: "codigoReserva", headerName: "Código Reserva", flex: 1 },
    { field: "usuarioCode", headerName: "Código Usuario", flex: 1 },
    { field: "usuarioNombre", headerName: "Usuario", flex: 1.4 },
    { field: "espacioNombre", headerName: "Espacio", flex: 1.4 },
    {
      field: "fecha",
      headerName: "Fecha",
      flex: 1,
      valueGetter: (params) => {
        const [year, month, day] = params.row.fecha.split("-");
        return `${day}/${month}/${year}`;
      },
    },
    { field: "horarioInicio", headerName: "Hora Inicio", flex: 0.8 },
    { field: "horarioFin", headerName: "Hora Fin", flex: 0.8 },
    { field: "estado", headerName: "Estado", flex: 1 },
    {
      field: "asistenciaConfirmada",
      headerName: "Asistencia confirmada",
      flex: 1,
      renderCell: (params) => {
        const handleToggle = async () => {
          try {
            const updated = await confirmarAsistencia(params.row.id);
            queryClient.invalidateQueries(['reservas']);
            showSnackbar("Asistencia confirmada correctamente");
          } catch (error) {
            console.error("Error al confirmar asistencia", error);
            showSnackbar("Error al confirmar asistencia", "error");
          }
        };

        return (
          <Switch
            checked={params.value || false}
            onChange={handleToggle}
            size="small"
            color="success"
            disabled={!(["ACTIVA", "CURSO"].includes(params.row.estado)) || params.value}
          />
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Header title="RESERVAS" />

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Paper
          component="form"
          sx={{
            px: 2,
            py: 1,
            width: "100%",
            maxWidth: 400,
            bgcolor: theme.palette.background.paper,
            border: `1px solid ${colors.gray[400]}`,
            borderRadius: "8px",
          }}
        >
          <InputBase
            placeholder="Buscar por usuario, código o espacio..."
            fullWidth
            value={query}
            onChange={handleSearchChange}
            sx={{ fontSize: "16px" }}
          />
        </Paper>

        <Box display="flex" alignItems="center" ml={2} gap={2}>
          <FormControlLabel
            control={
              <Switch
                checked={mostrarSoloHoy}
                onChange={(e) => {
                  setMostrarSoloHoy(e.target.checked);
                  setFechaSeleccionada(null);
                }}
                color="success"
              />
            }
            label="Solo hoy"
          />

          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
            <DatePicker
              label="Filtrar por fecha"
              value={fechaSeleccionada}
              onChange={(newValue) => {
                setFechaSeleccionada(newValue);
                setMostrarSoloHoy(false);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    minWidth: 170,
                    borderRadius: "6px",
                    bgcolor:
                      theme.palette.mode === "dark" ? colors.primary[400] : "white",
                    "& .MuiInputBase-input": {
                      color: theme.palette.text.primary,
                    },
                    "& .MuiInputLabel-root": {
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
            variant="contained"
            onClick={() => setOpenCrearModal(true)}
            startIcon={<Add />}
            sx={{
              bgcolor: colors.blueAccent[700],
              color: "#fcfcfc",
              fontSize: "14px",
              fontWeight: "bold",
              px: 3,
              py: 1.5,
              transition: ".3s ease",
              ":hover": {
                bgcolor: colors.blueAccent[800],
              },
            }}
          >
            Crear reserva
          </Button>
        </Box>
      </Box>

      <Box height="75vh" maxWidth="100%">
        <DataGrid
          rows={reservas}
          columns={columns}
          getRowId={(row) => row.id}
          components={{ Toolbar: GridToolbar }}
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 20,
              },
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
            "& .MuiDataGrid-columnHeaders": {
              fontSize: "18px",
              fontWeight: "bold",
              py: 2,
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              fontSize: "14px",
            },
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

      <ReservaCreateModal
        open={openCrearModal}
        onClose={() => setOpenCrearModal(false)}
        onSubmit={handleCrearReserva}
        espacios={espacios}
        usuarios={usuarios}
        horarios={horarios}
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

export default Reservas;

