import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Typography,
  useTheme,
  Box,
} from "@mui/material";
import { useEffect, useState } from "react";
import { crearNotificacion, editarNotificacion } from "../../../api/notificaciones";

const NotificacionCreateModal = ({ open, onClose, onSuccess, notificacion }) => {
  const theme = useTheme();
  const [contenido, setContenido] = useState("");
  const [activo, setActivo] = useState(true);

  useEffect(() => {
    if (notificacion) {
      setContenido(notificacion.contenido ?? "");
      setActivo(notificacion.activo ?? true);
    } else {
      setContenido("");
      setActivo(true);
    }
  }, [notificacion]);

  const handleSubmit = async () => {
    const payload = { contenido: contenido.trim(), activo };
    try {
      if (notificacion?.id) {
        await editarNotificacion(notificacion.id, payload);
      } else {
        await crearNotificacion(payload.contenido); // usa solo contenido al crear
      }
      onSuccess();
    } catch (err) {
      console.error("❌ Error al guardar notificación:", err);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {notificacion ? "Editar notificación" : "Crear nueva notificación"}
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Contenido"
          fullWidth
          multiline
          rows={4}
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          margin="normal"
          autoFocus
        />

        <FormControlLabel
          control={
            <Switch
              checked={activo}
              onChange={(e) => setActivo(e.target.checked)}
              color="primary"
            />
          }
          label="¿Activa?"
        />

        <Box mt={2}>
          <Typography variant="body2" color={theme.palette.text.secondary}>
            ℹ️ La fecha se asigna automáticamente al crear la notificación.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!contenido.trim()}
        >
          {notificacion ? "Guardar cambios" : "Crear"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NotificacionCreateModal;
