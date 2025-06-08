import {
  Box,
  Card,
  Typography,
  useTheme,
  Button,
  Chip,
  Stack,
  Switch,
  Divider
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { tokens } from "../../theme";
import { Header } from "../../components";
import {
  getFechasBloqueadas,
  patchIgnorarFechaBloqueada,
} from "../../api/fechasBloqueadas";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import esLocale from "@fullcalendar/core/locales/es";
import FechaBloqueadaCreateModal from "./components/FechaBloqueadaCreateModal";
import dayjs from "dayjs";
import _ from "lodash";

const tipoBloqueoColors = {
  FERIADO: "#f44336",
  VACACIONES: "#ff9800",
  EVENTO: "#4caf50",
  MANTENIMIENTO: "#2196f3",
  OTRO: "#9e9e9e",
};

const FechasBloqueadas = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [fechas, setFechas] = useState([]);
  const [openCrearModal, setOpenCrearModal] = useState(false);
  const [detallesSeleccionados, setDetallesSeleccionados] = useState([]);

  const fetchFechas = async () => {
    try {
      const data = await getFechasBloqueadas();
      setFechas(data);
    } catch (error) {
      console.error("Error al obtener fechas bloqueadas", error);
    }
  };

  useEffect(() => {
    fetchFechas();
  }, []);

  const eventos = Object.values(
    _.groupBy(fechas, (f) =>
      `${f.fechaInicio}_${f.fechaFin}_${f.espacio?.id ?? "todos"}_${f.tipoBloqueo}_${f.motivo}_${f.aplicaATodosLosHorarios}`
    )
  ).map((grupo) => {
    const f = grupo[0];
    const baseNombre = f.aplicaATodosLosEspacios
      ? "Todos los espacios"
      : f.espacio?.nombre ?? "Sin espacio";

    const horariosOrdenados = [...grupo]
      .filter((g) => g.horario?.horaInicio && g.horario?.horaFin)
      .sort((a, b) => a.horario.horaInicio.localeCompare(b.horario.horaInicio));

    const rangoHorario = f.aplicaATodosLosHorarios
      ? "Todo el día"
      : horariosOrdenados
          .map((g) => `${g.horario.horaInicio} - ${g.horario.horaFin}`)
          .join(", ");

    return {
      id: f.id,
      title: `${f.motivo}\nEspacio: ${baseNombre}\nHorario: ${rangoHorario || "No definido"}`,
      start: f.fechaInicio,
      end: dayjs(f.fechaFin).add(1, "day").format("YYYY-MM-DD"),
      backgroundColor: tipoBloqueoColors[f.tipoBloqueo] || "#9e9e9e",
      borderColor: "transparent",
      textColor: "#fff",
      allDay: true,
      raw: grupo,
    };
  });

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb="20px">
        <Header title="FECHAS BLOQUEADAS" />
        <Button
          variant="contained"
          onClick={() => setOpenCrearModal(true)}
          startIcon={<Add />}
          sx={{
            bgcolor: colors.blueAccent[700],
            color: "#fcfcfc",
            fontSize: "14px",
            fontWeight: "bold",
            p: "10px 20px",
            mt: "18px",
            transition: ".3s ease",
            ":hover": { bgcolor: colors.blueAccent[800] },
          }}
        >
          Crear bloqueo
        </Button>
      </Box>

      {/* Leyenda */}
      <Card sx={{ backgroundColor: colors.primary[400], borderRadius: "12px", boxShadow: 3, p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Leyenda de tipos de bloqueo
        </Typography>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          {Object.entries(tipoBloqueoColors).map(([tipo, color]) => (
            <Chip key={tipo} label={tipo} sx={{ bgcolor: color, color: "#fff", fontWeight: "bold" }} />
          ))}
        </Stack>
      </Card>

      <Box
  display="flex"
  gap={2}
  flexDirection={{ xs: "column", md: "row" }}
  sx={{ height: "80vh" }} // 🔥 fuerza que todo el contenedor mida 80vh
>
  {/* Calendario */}
  <Card
    sx={{
      flex: 3,
      backgroundColor: colors.primary[400],
      borderRadius: "12px",
      boxShadow: 3,
      p: 2,
      height: "100%", // 👈 necesario para que llene el 80vh del contenedor
    }}
  >
    <Typography variant="body1" mb={2}>
      Visualiza aquí los feriados o bloqueos por tipo y espacio.
    </Typography>
    <FullCalendar
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      events={eventos}
      height="100%" // 👈 importante: se ajusta al alto del card
      locale={esLocale}
      eventClick={(info) => {
        const grupo = info.event.extendedProps?.raw ?? [];
        setDetallesSeleccionados(grupo);
      }}
      eventContent={(arg) => (
        <div
          style={{
            whiteSpace: "pre-line",
            fontSize: "1.1em",
            padding: "6px 8px",
            lineHeight: "1.6em",
            fontWeight: 500,
            minHeight: "3.5em",
          }}
        >
          {arg.event.title}
        </div>
      )}
      headerToolbar={{ left: "prev,next today", center: "title", right: "" }}
      buttonText={{ today: "Hoy" }}
    />
  </Card>

  {/* Lista lateral */}
  <Card
    sx={{
      flex: 2,
      backgroundColor: colors.primary[400],
      borderRadius: "12px",
      boxShadow: 3,
      p: 2,
      height: "100%", // 👈 llena el alto disponible
      overflowY: "auto",
    }}
  >
    <Typography variant="h6" gutterBottom>
      Detalles del evento seleccionado
    </Typography>
    <Divider sx={{ mb: 2 }} />
    {detallesSeleccionados.length === 0 ? (
      <Typography variant="body2" color="text.secondary">
        Haz clic en un evento del calendario para ver sus detalles.
      </Typography>
    ) : (
      <Stack spacing={2}>
        {detallesSeleccionados.map((f) => (
          <Box
            key={f.id}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            p={1}
            border="1px solid"
            borderColor={theme.palette.divider}
            borderRadius="8px"
          >
            <Box>
              <Typography fontWeight="bold">{f.motivo}</Typography>
              <Typography variant="body2">
                {f.tipoBloqueo} | {f.fechaInicio} → {f.fechaFin}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Espacio: {f.aplicaATodosLosEspacios ? "Todos" : f.espacio?.nombre ?? "N/A"}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2">Ignorar</Typography>
              <Switch
                checked={f.ignorar}
                onChange={async () => {
                  try {
                    const nuevoEstado = !f.ignorar;
                    await patchIgnorarFechaBloqueada(f.id, nuevoEstado);
                    setDetallesSeleccionados((prev) =>
                      prev.map((item) =>
                        item.id === f.id ? { ...item, ignorar: nuevoEstado } : item
                      )
                    );
                  } catch (error) {
                    console.error("Error al cambiar estado", error);
                  }
                }}
              />
            </Stack>
          </Box>
        ))}
      </Stack>
    )}
  </Card>
</Box>


      <FechaBloqueadaCreateModal
        open={openCrearModal}
        onClose={() => setOpenCrearModal(false)}
        onCreated={fetchFechas}
      />
    </Box>
  );
};

export default FechasBloqueadas;