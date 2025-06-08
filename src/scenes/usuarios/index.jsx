import {
  Box,
  InputBase,
  Paper,
  useTheme,
} from "@mui/material";
import { Header } from "../../components";
import { DataGrid, GridToolbar, esES } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { tokens } from "../../theme";
import { getUsuarios } from "../../api/usuarios";

const Usuarios = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState("");

  const fetchUsuarios = async (q = "") => {
    try {
      const response = await getUsuarios(q);
      setRows(response.data);
    } catch (error) {
      console.error("Error al obtener usuarios", error);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchUsuarios(query);
    }, 400); // espera 400ms después de dejar de escribir

    return () => clearTimeout(delayDebounce); // limpia el timeout si se escribe de nuevo
  }, [query]);

  const handleSearchChange = (e) => {
    setQuery(e.target.value); // 🔄 solo cambia el valor, no llama a la API directamente
  };

  const columns = [
    { field: "code", headerName: "Código", flex: 0.6 },
    { field: "name", headerName: "Nombre", flex: 1.2 },
    { field: "email", headerName: "Correo", flex: 1.2 },
    { field: "carrera", headerName: "Carrera", flex: 1.2 },
  ];

  return (
    <Box m="20px">
      <Header title="USUARIOS" />

      {/* 🔍 Barra de búsqueda */}
      <Paper
        component="form"
        sx={{
          mb: 2,
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
          placeholder="Buscar por nombre, código o correo..."
          fullWidth
          value={query}
          onChange={handleSearchChange}
          sx={{ fontSize: "16px" }}
        />
      </Paper>

      <Box height="75vh" maxWidth="100%">
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.code}
          components={{ Toolbar: GridToolbar }}
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 20,
              },
            },
          }}
          pageSizeOptions={[10, 20, 50]} // ✅ agrega esto
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
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.08)",
              },
            },
          }}
        />

      </Box>
    </Box>
  );
};

export default Usuarios;
