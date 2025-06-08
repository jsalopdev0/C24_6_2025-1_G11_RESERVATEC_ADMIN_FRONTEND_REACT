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
  } from "@mui/material";
  import { useState, useEffect, useRef } from "react";
  import { tokens } from "../../../theme";
  
  const EspacioModal = ({ open, onClose, onSubmit }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const inputRef = useRef(null);
  
    const [form, setForm] = useState({
      nombre: "",
      aforo: "",
      foto: "",
    });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleSubmit = () => {
      if (!form.nombre || !form.aforo || !form.foto) return;
      onSubmit({
        nombre: form.nombre,
        aforo: parseInt(form.aforo),
        foto: form.foto,
      });
      handleClose();
    };
  
    const handleClose = () => {
      setForm({ nombre: "", aforo: "", foto: "" });
      onClose();
    };
  
    useEffect(() => {
      if (!open) {
        setForm({ nombre: "", aforo: "", foto: "" });
      }
    }, [open]);
  
    useEffect(() => {
      if (open && inputRef.current) {
        setTimeout(() => inputRef.current.focus(), 10);
      }
    }, [open]);
  
    useEffect(() => {
      const root = document.getElementById("root");
      if (open && root?.getAttribute("aria-hidden") === "true") {
        root.removeAttribute("aria-hidden");
      }
    }, [open]);
  
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen={fullScreen}
        fullWidth
        maxWidth="sm"
        disableEnforceFocus
        disableAutoFocus
        disableRestoreFocus
      >
        <DialogTitle>Crear nuevo espacio</DialogTitle>
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
                "& label.Mui-focused": {
                  color: colors.blueAccent[700],
                },
                "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                  borderColor: colors.blueAccent[700],
                },
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
                "& label.Mui-focused": {
                  color: colors.blueAccent[700],
                },
                "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                  borderColor: colors.blueAccent[700],
                },
              }}
            />
            <TextField
              label="URL de la imagen"
              name="foto"
              value={form.foto}
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
            />
  
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
              ":hover": {
                bgcolor: colors.blueAccent[800],
              },
            }}
            disabled={!form.nombre || !form.aforo || !form.foto}
          >
            Crear
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default EspacioModal;
  