import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  Typography,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { getEspacios, crearEspacio, editarEspacio } from "../../api/espacios";
import { tokens } from "../../theme";
import { Header } from "../../components";
import EspacioModal from "./components/EspacioModal";
import EspacioEditarModal from "./components/EspacioEditarModal";

const Espacios = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMdDevices = useMediaQuery("(min-width:768px)");
  const [espacios, setEspacios] = useState([]);
  const [openCrearModal, setOpenCrearModal] = useState(false);
  const [espacioSeleccionado, setEspacioSeleccionado] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchEspacios = async () => {
    try {
      const response = await getEspacios();
      setEspacios(response.data);
    } catch (error) {
      console.error("Error al obtener espacios", error);
      showSnackbar("Error al cargar espacios", "error");
    }
  };


  useEffect(() => {
    fetchEspacios();
  }, []);

  const handleCrearEspacio = async (data) => {
    try {
      const response = await crearEspacio(data);
      if (response?.status === 201 || response?.status === 200) {
        showSnackbar("Espacio creado correctamente");
        fetchEspacios();
      }
    } catch (error) {
      console.error("Error al crear espacio:", error);
      showSnackbar("Error al crear espacio", "error");
    } finally {
      setOpenCrearModal(false);
    }
  };

  const handleEditarEspacio = async (data) => {
    try {
      const response = await editarEspacio(data.id, data);
      if (response?.status === 200) {
        showSnackbar("Espacio actualizado correctamente");
        fetchEspacios();
      }
    } catch (error) {
      console.error("Error al editar espacio:", error);
      showSnackbar("Error al editar espacio", "error");
    } finally {
      setEspacioSeleccionado(null);
    }
  };

  return (
    <Box m="20px">
      {/* Título y botón */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb="20px">
        <Header title="ESPACIOS" />
        <Button
          variant="contained"
          onClick={() => setOpenCrearModal(true)}
          startIcon={<Add />}
          sx={{
            bgcolor: colors.blueAccent[700],
            color: "#fcfcfc",
            fontSize: isMdDevices ? "14px" : "10px",
            fontWeight: "bold",
            p: "10px 20px",
            mt: "18px",
            transition: ".3s ease",
            ":hover": {
              bgcolor: colors.blueAccent[800],
            },
          }}
        >
          Crear espacio
        </Button>
      </Box>

      <Grid container spacing={3}>
        {espacios.map((espacio) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={espacio.id}>
            <Card
              sx={{
                backgroundColor: colors.primary[400],
                borderRadius: "12px",
                boxShadow: 3,
              }}
            >
              <CardActionArea onClick={() => setEspacioSeleccionado(espacio)}>
                <CardMedia
                  component="img"
                  height="160"
                  image={espacio.foto}
                  alt={espacio.nombre}
                />
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {espacio.nombre}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Aforo: {espacio.aforo}
                  </Typography>
                  <Chip
                    label={espacio.activo ? "Activo" : "Inactivo"}
                    size="small"
                    sx={{
                      mt: 1,
                      backgroundColor: espacio.activo
                        ? colors.greenAccent[500]
                        : colors.redAccent[400],
                      color: "white",
                      fontWeight: "bold",
                    }}
                  />
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      <EspacioModal
        open={openCrearModal}
        onClose={() => setOpenCrearModal(false)}
        onSubmit={handleCrearEspacio}
      />

      <EspacioEditarModal
        open={!!espacioSeleccionado}
        onClose={() => setEspacioSeleccionado(null)}
        onSubmit={handleEditarEspacio}
        espacio={espacioSeleccionado}
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

export default Espacios;
