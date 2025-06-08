import React from "react";
import {
  Box,
  useTheme,
} from "@mui/material";
import { DataGrid, esES } from "@mui/x-data-grid";
import { tokens } from "../theme";

const CarreraEspacioTable = ({ data = [] }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const transformarData = (data) => {
    const carreras = [...new Set(data.map(d => d.carrera))];
    const espacios = [...new Set(data.map(d => d.espacio))];

    const filas = carreras.map(carrera => {
      const fila = { carrera };
      let total = 0;

      espacios.forEach(espacio => {
        const registro = data.find(d => d.carrera === carrera && d.espacio === espacio);
        const cantidad = registro ? registro.cantidad : 0;
        fila[espacio] = cantidad;
        total += cantidad;
      });

      fila.total = total;
      return fila;
    });

    return { filas, espacios };
  };

  const { filas, espacios } = transformarData(data);

  const columns = [
    { field: "carrera", headerName: "Carrera", flex: 1.5 },
    ...espacios.map((espacio) => ({
      field: espacio,
      headerName: espacio,
      type: "number",
      flex: 1,
      headerAlign: "center",
      align: "center",
    })),
    {
      field: "total",
      headerName: "Total",
      type: "number",
      flex: 0.6,
      headerAlign: "center",
      align: "center",
    },
  ];

  const rows = filas.map((row, index) => ({ id: index, ...row }));

  return (
    <Box height="700px" maxWidth="100%">
      <DataGrid
        rows={rows}
        columns={columns}
        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 15,
            },
          },
        }}
        pageSizeOptions={[10, 15, 20, 50]}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "even-row" : ""
        }
        sx={{
          fontSize: "15px",
          backgroundColor: colors.primary[400],
          borderRadius: 0,
          p: 2,
          "& .MuiDataGrid-cell": { py: 2 },
          "& .MuiDataGrid-columnHeaders": {
            fontSize: "17px",
            fontWeight: "bold",
            py: 2,
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
  );
};

export default CarreraEspacioTable;
