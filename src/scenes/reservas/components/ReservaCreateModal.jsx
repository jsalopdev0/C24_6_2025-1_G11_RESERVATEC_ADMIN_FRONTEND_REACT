import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    MenuItem,
    useTheme,
    useMediaQuery,
    Box,
} from "@mui/material";
import { useEffect, useState } from "react";
import { tokens } from "../../../theme";
import { getHorariosOcupados } from "../../../api/horarios";
import { Autocomplete } from "@mui/material";

const ReservaCreateModal = ({
    open,
    onClose,
    onSubmit,
    espacios = [],
    usuarios = [],
    horarios = [],
}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const [form, setForm] = useState({
        usuarioId: "",
        espacioId: "",
        fecha: "",
        horarioId: "",
    });

    const [horariosOcupados, setHorariosOcupados] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        if (!Object.values(form).every(Boolean)) return;
        onSubmit(form);
        handleClose();
    };

    const handleClose = () => {
        setForm({
            usuarioId: "",
            espacioId: "",
            fecha: "",
            horarioId: "",
        });
        setHorariosOcupados([]);
        onClose();
    };

    useEffect(() => {
        if (form.fecha && form.espacioId) {
            const fetchOcupados = async () => {
                try {
                    const ocupados = await getHorariosOcupados(form.espacioId, form.fecha);
                    setHorariosOcupados(ocupados);
                } catch (err) {
                    console.error("Error al obtener horarios ocupados", err);
                }
            };
            fetchOcupados();
        }
    }, [form.fecha, form.espacioId]);

    useEffect(() => {
        if (!open) handleClose();
    }, [open]);

    return (
        <Dialog open={open} onClose={handleClose} fullScreen={fullScreen} fullWidth maxWidth="sm">
            <DialogTitle>Crear nueva reserva</DialogTitle>
            <DialogContent>
                <Box display="flex" flexDirection="column" gap={2} mt={1}>
                    <Autocomplete
                        options={usuarios}
                        getOptionLabel={(option) => `${option.code} - ${option.name}`}
                        value={usuarios.find((u) => u.id === form.usuarioId) || null}
                        onChange={(e, newValue) => {
                            setForm((prev) => ({ ...prev, usuarioId: newValue ? newValue.id : "" }));
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Usuario"
                                fullWidth
                                sx={{
                                    "& label.Mui-focused": {
                                        color: colors.blueAccent[700],
                                    },
                                    "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                                        borderColor: colors.blueAccent[700],
                                    },
                                }}
                            />
                        )}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                    />

                    <TextField
                        select
                        name="espacioId"
                        label="Espacio"
                        value={form.espacioId}
                        onChange={handleChange}
                        fullWidth
                        sx={{
                            "& label.Mui-focused": {
                                color: colors.blueAccent[700],
                            },
                            "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                                borderColor: colors.blueAccent[700],
                            },
                        }}
                    >
                        {espacios.map((e) => (
                            <MenuItem key={e.id} value={e.id}>
                                {e.nombre}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        type="date"
                        name="fecha"
                        label="Fecha"
                        value={form.fecha}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{
                            min: new Date().toISOString().split("T")[0],
                            max: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split("T")[0],
                        }}

                        fullWidth
                        sx={{
                            "& label.Mui-focused": {
                                color: colors.blueAccent[700],
                            },
                            "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                                borderColor: colors.blueAccent[700],
                            },
                        }}
                    />

                    <TextField
                        select
                        name="horarioId"
                        label="Horario"
                        value={form.horarioId}
                        onChange={handleChange}
                        fullWidth
                        sx={{
                            "& label.Mui-focused": {
                                color: colors.blueAccent[700],
                            },
                            "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                                borderColor: colors.blueAccent[700],
                            },
                        }}
                    >
                        {horarios.map((h) => (
                            <MenuItem key={h.id} value={h.id} disabled={horariosOcupados.includes(h.id)}>
                                {h.horaInicio} - {h.horaFin}
                            </MenuItem>
                        ))}
                    </TextField>

                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="inherit">
                    Cancelar
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={!Object.values(form).every(Boolean)}
                    sx={{
                        bgcolor: colors.blueAccent[700],
                        color: "#fcfcfc",
                        fontWeight: "bold",
                        px: 3,
                        ":hover": { bgcolor: colors.blueAccent[800] },
                    }}
                >
                    Crear
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ReservaCreateModal;
