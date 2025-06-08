import {
    Box,
    Card,
    List,
    ListItem,
    ListItemText,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import esLocale from "@fullcalendar/core/locales/es";
import { tokens } from "../../theme";
import { getReservasCalendario } from "../../api/reservas";
import { formatDate } from "@fullcalendar/core";

const ReservasCalendario = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isMdDevices = useMediaQuery("(max-width:920px)");
    const [eventos, setEventos] = useState([]);
    const [eventosDelDia, setEventosDelDia] = useState([]);

    useEffect(() => {
        const fetch = async () => {
            const data = await getReservasCalendario();
            const eventosTransformados = data.map((r) => {
                let backgroundColor;
                switch (r.estado) {
                    case "ACTIVA":
                        backgroundColor = "#2196f3"; // Azul
                        break;
                    case "CANCELADA":
                        backgroundColor = "#f44336"; // Rojo
                        break;
                    case "COMPLETADA":
                        backgroundColor = "#4caf50"; // Verde
                        break;
                    case "CURSO":
                        backgroundColor = "#ff9800"; // Amarillo
                        break;
                    default:
                        backgroundColor = "#9e9e9e"; // Gris
                }

                return {
                    id: r.id,
                    title: `(${r.codigoReserva})`,
                    start: `${r.fecha}T${r.horaInicio}`,
                    end: `${r.fecha}T${r.horaFin}`,
                    extendedProps: {
                        fecha: r.fecha,
                        estado: r.estado,
                        usuario: r.usuarioCode,
                        codigo: r.codigoReserva,
                        espacioNombre: r.espacioNombre,
                    },
                    backgroundColor,
                    borderColor: "transparent",
                    textColor: "#fff",
                };
            });
            setEventos(eventosTransformados);
        };
        fetch();
    }, []);

    const handleDateClick = (info) => {
        const reservas = eventos.filter((e) => e.extendedProps.fecha === info.dateStr);

        const agrupadas = reservas.reduce((acc, curr) => {
            const key = curr.extendedProps.espacioNombre;
            if (!acc[key]) acc[key] = [];
            acc[key].push(curr);
            return acc;
        }, {});

        for (const key in agrupadas) {
            agrupadas[key].sort((a, b) => new Date(a.start) - new Date(b.start));
        }

        setEventosDelDia(agrupadas);
    };

    return (
        <Box m="20px">
            <Typography variant="h4" mb={2}>
                Calendario de Reservas
            </Typography>

            <Box display="flex" flexDirection={isMdDevices ? "column" : "row"} gap={2}>
                {/* Panel lateral */}
                <Box
                    flex={isMdDevices ? "1" : "3"}
                    bgcolor={colors.primary[400]}
                    p="15px"
                    borderRadius="4px"
                    minWidth={isMdDevices ? "100%" : "300px"}
                >
                    <Typography variant="h5" mb={2}>
                        Reservas del día seleccionado
                    </Typography>

                    {/* Leyenda con nuevos colores */}
                    <Box display="flex" flexDirection="column" mb={2} gap={1}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Box width="20px" height="20px" bgcolor="#2196f3" borderRadius="4px" />
                            <Typography variant="body2">Reserva Activa</Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Box width="20px" height="20px" bgcolor="#f44336" borderRadius="4px" />
                            <Typography variant="body2">Reserva Cancelada</Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Box width="20px" height="20px" bgcolor="#4caf50" borderRadius="4px" />
                            <Typography variant="body2">Reserva Completada</Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Box width="20px" height="20px" bgcolor="#ff9800" borderRadius="4px" />
                            <Typography variant="body2">Reserva en Curso</Typography>
                        </Box>
                    </Box>

                    {/* Lista agrupada por espacio */}
                    {Object.keys(eventosDelDia).length > 0 ? (
                        Object.entries(eventosDelDia).map(([espacio, reservas]) => (
                            <Box key={espacio} mb={2}>
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                    {espacio}
                                </Typography>
                                <List>
                                    {reservas.map((event) => (
                                        <ListItem
                                            key={event.id}
                                            sx={{
                                                bgcolor: event.backgroundColor,
                                                mb: 1,
                                                borderRadius: "4px",
                                            }}
                                        >
                                            <ListItemText
                                                primary={`Código: ${event.extendedProps.codigo} - Usuario: ${event.extendedProps.usuario}`}
                                                secondary={
                                                    <Typography>
                                                        {formatDate(event.start, {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                            hour12: false,
                                                        })}{" "}
                                                        -{" "}
                                                        {formatDate(event.end, {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                            hour12: false,
                                                        })}
                                                    </Typography>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        ))
                    ) : (
                        <Typography variant="body2" color="textSecondary">
                            No hay reservas.
                        </Typography>
                    )}
                </Box>

                {/* Calendario */}
                <Card
                    sx={{
                        flex: isMdDevices ? "1" : "6",
                        backgroundColor: colors.primary[400],
                        p: 2,
                    }}
                >
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                        initialView="dayGridMonth"
                        locale={esLocale}
                        height="80vh"
                        slotMinTime="07:00:00"
                        slotMaxTime="22:00:00"
                        allDaySlot={false}
                        events={eventos}
                        eventDisplay="block"
                        eventOverlap={true}
                        eventContent={(arg) => (
                            <div style={{ fontSize: "0.75rem", padding: "2px" }}>
                                {arg.event.title}
                            </div>
                        )}
                        headerToolbar={{
                            left: "prev,next today",
                            center: "title",
                            right: "dayGridMonth",
                        }}
                        dateClick={handleDateClick}
                    />
                </Card>
            </Box>
        </Box>
    );
};

export default ReservasCalendario;