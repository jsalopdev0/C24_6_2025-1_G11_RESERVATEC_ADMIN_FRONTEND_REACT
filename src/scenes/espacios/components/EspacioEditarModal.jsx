import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    useMediaQuery,
    useTheme,
    Box,
    Typography,
    FormControlLabel,
    Switch,
  } from "@mui/material";
  import { useState, useEffect, useRef } from "react";
  import { tokens } from "../../../theme";
  
  const EspacioEditarModal = ({ open, onClose, onSubmit, espacio, fallbackFocusRef }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const inputRef = useRef(null);
  
    const [form, setForm] = useState({
      nombre: "",
      aforo: "",
      foto: "",
      activo: true,
    });
  
    useEffect(() => {
      if (open && espacio) {
        setForm({
          nombre: espacio.nombre || "",
          aforo: espacio.aforo || "",
          foto: espacio.foto || "",
          activo: espacio.activo ?? true,
        });
      }
    }, [open, espacio]);
  
    useEffect(() => {
      if (!open && fallbackFocusRef?.current) {
        setTimeout(() => fallbackFocusRef.current.focus(), 50);
      }
    }, [open, fallbackFocusRef]);
  
    // Solución warning aria-hidden
    useEffect(() => {
      const root = document.getElementById("root");
      if (open && root?.getAttribute("aria-hidden") === "true") {
        root.removeAttribute("aria-hidden");
      }
    }, [open]);
  
    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      const newValue = type === "checkbox" ? checked : value;
      setForm((prev) => ({ ...prev, [name]: newValue }));
    };
  
    const handleSubmit = () => {
      if (!form.nombre || !form.aforo || !form.foto) return;
      onSubmit({
        ...espacio,
        ...form,
        aforo: parseInt(form.aforo),
        activo: form.activo,
      });
      onClose();
    };
  
    const handleClose = () => {
      setForm({ nombre: "", aforo: "", foto: "", activo: true });
      onClose();
    };
  
    return (
      <Dialog open={open} onClose={handleClose} fullScreen={fullScreen} fullWidth maxWidth="sm">
        <DialogTitle>Editar espacio</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              inputRef={inputRef}
              label="Nombre del espacio"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              fullWidth
              sx={{
                "& label.Mui-focused": { color: colors.blueAccent[700] },
                "& .MuiOutlinedInput-root.Mui-focused fieldset": { borderColor: colors.blueAccent[700] },
              }}
            />
            <TextField
              label="Aforo"
              name="aforo"
              type="number"
              value={form.aforo}
              onChange={handleChange}
              fullWidth
              sx={{
                "& label.Mui-focused": { color: colors.blueAccent[700] },
                "& .MuiOutlinedInput-root.Mui-focused fieldset": { borderColor: colors.blueAccent[700] },
              }}
            />
            <TextField
              label="URL de la imagen"
              name="foto"
              value={form.foto}
              onChange={handleChange}
              fullWidth
              sx={{
                "& label.Mui-focused": { color: colors.blueAccent[700] },
                "& .MuiOutlinedInput-root.Mui-focused fieldset": { borderColor: colors.blueAccent[700] },
              }}
            />
  
            {/* Switch de activo/inactivo */}
            <FormControlLabel
              control={
                <Switch
                  checked={form.activo}
                  onChange={handleChange}
                  name="activo"
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": {
                      color: colors.blueAccent[700],
                    },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      backgroundColor: colors.blueAccent[700],
                    },
                  }}
                />
              }
              label={
                <Typography sx={{ color: colors.blueAccent[700], fontWeight: "bold" }}>
                  {form.activo ? "Activo" : "Inactivo"}
                </Typography>
              }
            />
  
            {/* Vista previa */}
            {form.foto && (
              <Box mt={2}>
                <Typography variant="body2" color="textSecondary" mb={1}>
                  Vista previa:
                </Typography>
                <Box
                  component="img"
                  src={form.foto}
                  alt="Vista previa"
                  sx={{ maxWidth: "100%", maxHeight: 200, borderRadius: 2 }}
                />
              </Box>
            )}
          </Box>
        </DialogContent>
  
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              bgcolor: colors.blueAccent[700],
              color: "#fcfcfc",
              fontWeight: "bold",
              px: 3,
              ":hover": { bgcolor: colors.blueAccent[800] },
            }}
            disabled={!form.nombre || !form.aforo || !form.foto}
          >
            Guardar cambios
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default EspacioEditarModal;
  