import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Box,
    Typography,
    Switch,
    FormControlLabel,
    Checkbox,
    ListItemText,
    useMediaQuery,
    useTheme,
    Snackbar,
    Alert,
  } from "@mui/material";
  import { useState, useEffect } from "react";
  import { getEspacios } from "../../../api/espacios";
  import { getHorarios } from "../../../api/horarios";
  import { crearFechaBloqueada } from "../../../api/fechasBloqueadas";
  import dayjs from "dayjs";
  import { tokens } from "../../../theme";
  
  const TIPO_BLOQUEO = ["FERIADO", "VACACIONES", "EVENTO", "MANTENIMIENTO", "OTRO"];
  const today = dayjs().format("YYYY-MM-DD");
  const nextYear = dayjs().add(1, "year").format("YYYY-MM-DD");
  
  const FechaBloqueadaCreateModal = ({ open, onClose, onCreated }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  
    const [espacios, setEspacios] = useState([]);
    const [horarios, setHorarios] = useState([]);
    const [form, setForm] = useState({
      fechaInicio: today,
      fechaFin: today,
      tipoBloqueo: "",
      motivo: "",
      espacios: [],
      horarios: [],
      todosEspacios: false,
      todosHorarios: false,
    });
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  
    const handleSnackbar = (msg, severity = "success") => {
      setSnackbar({ open: true, message: msg, severity });
    };
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleSubmit = async () => {
      const {
        fechaInicio,
        fechaFin,
        motivo,
        tipoBloqueo,
        todosEspacios,
        todosHorarios,
        espacios,
        horarios,
      } = form;
  
      if (!fechaInicio || !fechaFin || !motivo || !tipoBloqueo) {
        handleSnackbar("Completa todos los campos obligatorios", "error");
        return;
      }
  
      if (!todosEspacios && espacios.length === 0) {
        handleSnackbar("Selecciona al menos un espacio o activa 'Todos los espacios'", "error");
        return;
      }
  
      if (!todosHorarios && horarios.length === 0) {
        handleSnackbar("Selecciona al menos un horario o activa 'Todos los horarios'", "error");
        return;
      }
  
      try {
        // Si aplica a todos, se crea solo uno
        if (todosEspacios && todosHorarios) {
          const payload = {
            fechaInicio,
            fechaFin,
            motivo,
            tipoBloqueo,
            aplicaATodosLosEspacios: true,
            aplicaATodosLosHorarios: true,
            espacio: null,
            horario: null,
          };
          await crearFechaBloqueada(payload);
        } else {
          const espaciosFinal = todosEspacios ? [null] : espacios;
          const horariosFinal = todosHorarios ? [null] : horarios;
  
          for (const espacioId of espaciosFinal) {
            for (const horarioId of horariosFinal) {
              const payload = {
                fechaInicio,
                fechaFin,
                motivo,
                tipoBloqueo,
                aplicaATodosLosEspacios: todosEspacios,
                aplicaATodosLosHorarios: todosHorarios,
                espacio: espacioId ? { id: espacioId } : null,
                horario: horarioId ? { id: horarioId } : null,
              };
              await crearFechaBloqueada(payload);
            }
          }
        }
  
        handleSnackbar("Fecha(s) bloqueada(s) creada(s) correctamente");
        onCreated();
        handleClose();
      } catch (error) {
        handleSnackbar("Error al crear el bloqueo", "error");
        console.error(error);
      }
    };
  
    const handleClose = () => {
      setForm({
        fechaInicio: today,
        fechaFin: today,
        tipoBloqueo: "",
        motivo: "",
        espacios: [],
        horarios: [],
        todosEspacios: false,
        todosHorarios: false,
      });
      onClose();
    };
  
    useEffect(() => {
      if (open) {
        getEspacios().then((res) => setEspacios(res.data));
        getHorarios().then((res) => setHorarios(res));
      }
    }, [open]);
  
    const textFieldStyles = {
      "& label.Mui-focused": { color: colors.blueAccent[700] },
      "& .MuiOutlinedInput-root.Mui-focused fieldset": { borderColor: colors.blueAccent[700] },
    };
  
    return (
      <Dialog open={open} onClose={handleClose} fullScreen={fullScreen} fullWidth maxWidth="sm">
        <DialogTitle>Crear bloqueo de fechas</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField type="date" label="Fecha de inicio" name="fechaInicio" value={form.fechaInicio} onChange={handleChange} InputLabelProps={{ shrink: true }} sx={textFieldStyles} />
            <TextField type="date" label="Fecha de fin" name="fechaFin" value={form.fechaFin} onChange={handleChange} InputLabelProps={{ shrink: true }} sx={textFieldStyles} />
            <TextField select label="Tipo de bloqueo" name="tipoBloqueo" value={form.tipoBloqueo} onChange={handleChange} sx={textFieldStyles}>
              {TIPO_BLOQUEO.map((t) => (
                <MenuItem key={t} value={t}>{t}</MenuItem>
              ))}
            </TextField>
            <TextField label="Motivo" name="motivo" value={form.motivo} onChange={handleChange} sx={textFieldStyles} />
  
            <FormControl fullWidth>
              <InputLabel>Espacios</InputLabel>
              <Select
                multiple
                value={form.todosEspacios ? [] : form.espacios}
                onChange={(e) => setForm((prev) => ({ ...prev, espacios: e.target.value }))}
                renderValue={() => form.todosEspacios ? "Todos los espacios" : `${form.espacios.length} seleccionados`}
                disabled={form.todosEspacios}
                sx={textFieldStyles}
              >
                {espacios.map((espacio) => (
                  <MenuItem key={espacio.id} value={espacio.id}>
                    <Checkbox checked={form.espacios.includes(espacio.id)} />
                    <ListItemText primary={espacio.nombre} />
                  </MenuItem>
                ))}
              </Select>
              <FormControlLabel
                control={<Switch checked={form.todosEspacios} onChange={() => setForm((prev) => ({ ...prev, todosEspacios: !prev.todosEspacios, espacios: [] }))} />}
                label="Aplicar a todos los espacios"
              />
            </FormControl>
  
            <FormControl fullWidth>
              <InputLabel>Horarios</InputLabel>
              <Select
                multiple
                value={form.todosHorarios ? [] : form.horarios}
                onChange={(e) => setForm((prev) => ({ ...prev, horarios: e.target.value }))}
                renderValue={() => form.todosHorarios ? "Todos los horarios" : `${form.horarios.length} seleccionados`}
                disabled={form.todosHorarios}
                sx={textFieldStyles}
              >
                {horarios.map((h) => (
                  <MenuItem key={h.id} value={h.id}>
                    <Checkbox checked={form.horarios.includes(h.id)} />
                    <ListItemText primary={`${h.horaInicio} - ${h.horaFin}`} />
                  </MenuItem>
                ))}
              </Select>
              <FormControlLabel
                control={<Switch checked={form.todosHorarios} onChange={() => setForm((prev) => ({ ...prev, todosHorarios: !prev.todosHorarios, horarios: [] }))} />}
                label="Aplicar a todos los horarios"
              />
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">Cancelar</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{ bgcolor: colors.blueAccent[700], color: "#fcfcfc", fontWeight: "bold", px: 3, ":hover": { bgcolor: colors.blueAccent[800] } }}
          >
            Crear
          </Button>
        </DialogActions>
        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}>
          <Alert severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Dialog>
    );
  };
  
  export default FechaBloqueadaCreateModal;