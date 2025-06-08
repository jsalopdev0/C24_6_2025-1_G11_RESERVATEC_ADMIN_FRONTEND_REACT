import {
  Box,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Header,
  StatBox,
  BarChart,
} from "../../components";
import {
  DownloadOutlined,
  EventNote,
  Today,
  CheckCircleOutline,
  CancelOutlined,
  HourglassBottom,
  PictureAsPdf,
} from "@mui/icons-material";
import {
  getReservasDelMes,
  getReservasDeHoy,
  getReservasMesAnterior,
  getReservasPorEspacioMes,
  getReservasPorEstado,
  getIntentosReserva,
  getReservasPorEstadoMes,
  getResumenCarreraEspacioMensual,
  getReservasCreadasPorAdmin,
} from "../../api/dashboard";
import { tokens } from "../../theme";
import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import CarreraEspacioTable from "../../components/CarreraEspacioTable";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ✅ ¡Así debe ser!
import { useQuery, useQueries } from "@tanstack/react-query";

function Dashboard() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isXlDevices = useMediaQuery("(min-width: 1260px)");
  const isMdDevices = useMediaQuery("(min-width: 724px)");
  const isXsDevices = useMediaQuery("(max-width: 436px)");

  const chartRef = useRef(null);
  const tableRef = useRef(null);

  const [tablaCarreraEspacio, setTablaCarreraEspacio] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [reservasCreadasPorAdmin, setReservasCreadasPorAdmin] = useState(0);

  const [reservasMes, setReservasMes] = useState(0);
  const [reservasHoy, setReservasHoy] = useState(0);
  const [reservasMesAnterior, setReservasMesAnterior] = useState(0);
  const [reservasActivas, setReservasActivas] = useState(0);
  const [reservasCompletadas, setReservasCompletadas] = useState(0);
  const [reservasCanceladas, setReservasCanceladas] = useState(0);
  const [reservasCurso, setReservasCurso] = useState(0);
  const [reservasMesActivas, setReservasMesActivas] = useState(0);
  const [reservasMesCompletadas, setReservasMesCompletadas] = useState(0);
  const [reservasMesCanceladas, setReservasMesCanceladas] = useState(0);
  const [reservasMesCurso, setReservasMesCurso] = useState(0);
  const [intentosReserva, setIntentosReserva] = useState(0);

  const incrementoMes =
    reservasMesAnterior > 0
      ? (((reservasMes - reservasMesAnterior) / reservasMesAnterior) * 100).toFixed(1) + "%"
      : "N/A";

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          resMes,
          resMesAnt,
          resHoy,
          resBar,
          resActivas,
          resCompletadas,
          resCanceladas,
          resCurso,
          resActivasMes,
          resCompletadasMes,
          resCanceladasMes,
          resCursoMes,
          resIntentos,
          resCarreraEspacio,
          resCreadasPorAdmin,
        ] = await Promise.all([
          getReservasDelMes(),
          getReservasMesAnterior(),
          getReservasDeHoy(),
          getReservasPorEspacioMes(),
          getReservasPorEstado("ACTIVA"),
          getReservasPorEstado("COMPLETADA"),
          getReservasPorEstado("CANCELADA"),
          getReservasPorEstado("CURSO"),
          getReservasPorEstadoMes("ACTIVA"),
          getReservasPorEstadoMes("COMPLETADA"),
          getReservasPorEstadoMes("CANCELADA"),
          getReservasPorEstadoMes("CURSO"),
          getIntentosReserva(),
          getResumenCarreraEspacioMensual(new Date().getFullYear()),
          getReservasCreadasPorAdmin(),
        ]);

        setReservasMes(resMes.data);
        setReservasMesAnterior(resMesAnt.data);
        setReservasHoy(resHoy.data);
        setBarChartData(resBar.data);
        setReservasActivas(resActivas.data);
        setReservasCompletadas(resCompletadas.data);
        setReservasCanceladas(resCanceladas.data);
        setReservasCurso(resCurso.data);
        setReservasMesActivas(resActivasMes.data);
        setReservasMesCompletadas(resCompletadasMes.data);
        setReservasMesCanceladas(resCanceladasMes.data);
        setReservasMesCurso(resCursoMes.data);
        setIntentosReserva(resIntentos.data);
        setTablaCarreraEspacio(resCarreraEspacio.data);
        setReservasCreadasPorAdmin(resCreadasPorAdmin.data);
      } catch (error) {
        console.error("❌ Error al cargar datos del dashboard:", error);
      }
    };

    fetchDashboardData();
  }, []);

  const exportGraficoPDF = async () => {
    const doc = new jsPDF("landscape", "mm", "a4");

    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current, { backgroundColor: "#fff" });
      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = 250;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      doc.addImage(imgData, "PNG", 15, 20, pdfWidth, pdfHeight);
      doc.save("grafico-reservas.pdf");
    }
  };

  const exportTablaCarreraPDF = () => {
    const doc = new jsPDF("landscape", "mm", "a4");

    const resumen = {};
    const espaciosSet = new Set();

    tablaCarreraEspacio.forEach(({ carrera, espacio, cantidad }) => {
      espaciosSet.add(espacio);
      if (!resumen[carrera]) resumen[carrera] = {};
      resumen[carrera][espacio] = (resumen[carrera][espacio] || 0) + cantidad;
    });

    const espacios = Array.from(espaciosSet).sort();
    const filas = [];
    const totalesPorColumna = {};
    let totalGeneral = 0;

    for (const carrera in resumen) {
      let totalCarrera = 0;
      const fila = [carrera];
      espacios.forEach((esp) => {
        const val = resumen[carrera][esp] || 0;
        fila.push(val);
        totalCarrera += val;
        totalesPorColumna[esp] = (totalesPorColumna[esp] || 0) + val;
      });
      fila.push(totalCarrera);
      totalGeneral += totalCarrera;
      filas.push(fila);
    }

    const filaTotal = ["Total"];
    espacios.forEach((esp) => filaTotal.push(totalesPorColumna[esp] || 0));
    filaTotal.push(totalGeneral);
    filas.push(filaTotal);

    const head = ["Carrera", ...espacios, "Total"];

    autoTable(doc, {
      startY: 20,
      head: [head],
      body: filas,
      styles: {
        fontSize: 8,
        halign: "center",
        lineWidth: 0.3,
        lineColor: [0, 0, 0],
      },
      headStyles: {
        fontStyle: "bold",
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        lineWidth: 0.3,
      },
      alternateRowStyles: {
        fillColor: [255, 255, 255],
      },
      theme: "grid",
      margin: { left: 15, right: 15 },
    });

    doc.save("tabla-reservas-carrera.pdf");
  };

  const exportIndicadoresPDF = () => {
    const doc = new jsPDF();

    const reservasUsuarios = reservasMes - reservasCreadasPorAdmin;

    const head = [["Indicador", "Valor"]];
    const body = [
      ["Reservas del Mes", reservasMes],
      ["Reservas Creadas por Admin Mes", reservasCreadasPorAdmin],
      ["Reservas Creadas por Usuarios", reservasUsuarios],
      ["Completadas Mes", reservasMesCompletadas],
      ["Canceladas Mes", reservasMesCanceladas],
      ["Intentos de Reserva Mes", intentosReserva],
    ];

    autoTable(doc, {
      head,
      body,
      styles: {
        fontSize: 10,
        halign: "center",
        lineWidth: 0.3,
        lineColor: [0, 0, 0],
      },
      bodyStyles: {
        halign: "right",
      },
      columnStyles: {
        0: { halign: "left" },
        1: { halign: "center" },
      },
      headStyles: {
        fontStyle: "bold",
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
      },
      theme: "grid",
      margin: { top: 20, left: 30, right: 30 },
    });

    doc.save("reporte-indicadores-mes.pdf");
  };




  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center" gap={2}>
        <Header title="DASHBOARD" subtitle="Bienvenido al panel de reservas" />
        <Box display="flex" gap={1}>
          <Button
            onClick={exportGraficoPDF}
            variant="contained"
            sx={{
              bgcolor: colors.blueAccent[700],
              color: "#fff",
              fontWeight: "bold",
              px: 2,
              ":hover": { bgcolor: colors.blueAccent[800] },
            }}
            startIcon={<DownloadOutlined />}
          >
            Exportar Gráfico
          </Button>

          <Button
            onClick={exportTablaCarreraPDF}
            variant="contained"
            sx={{
              bgcolor: colors.blueAccent[700],
              color: "#fff",
              fontWeight: "bold",
              px: 2,
              ":hover": { bgcolor: colors.blueAccent[800] },
            }}
            startIcon={<DownloadOutlined />}
          >
            Exportar Tabla Carrera
          </Button>

          <Button
            onClick={exportIndicadoresPDF}
            variant="contained"
            sx={{
              bgcolor: colors.blueAccent[700],
              color: "#fff",
              fontWeight: "bold",
              px: 2,
              ":hover": { bgcolor: colors.blueAccent[800] },
            }}
            startIcon={<PictureAsPdf />}
          >
            Exportar Indicadores
          </Button>
        </Box>

      </Box>

      <Box
        display="grid"
        gridTemplateColumns={
          isXlDevices ? "repeat(12, 1fr)" : isMdDevices ? "repeat(6, 1fr)" : "repeat(3, 1fr)"
        }
        gridAutoRows="140px"
        gap="20px"
      >
        {[
          { title: reservasMes, subtitle: "Reservas del Mes", icon: <EventNote sx={{ fontSize: 80, color: "#00B2E2" }} /> },
          { title: reservasCreadasPorAdmin, subtitle: "Reservas Creadas por Admin Mes", icon: <CheckCircleOutline sx={{ fontSize: 80, color: "#00B2E2" }} /> },
          { title: reservasMesCompletadas, subtitle: "Completadas Mes", icon: <CheckCircleOutline sx={{ fontSize: 80, color: "#4CAF50" }} /> },
          { title: reservasMesCanceladas, subtitle: "Canceladas Mes", icon: <CancelOutlined sx={{ fontSize: 80, color: "#F44336" }} /> },
          { title: reservasActivas, subtitle: "Activas Hoy", icon: <HourglassBottom sx={{ fontSize: 80, color: "#2196F3" }} /> },
          { title: reservasCurso, subtitle: "En Curso", icon: <Today sx={{ fontSize: 80, color: "#FF9800" }} /> },
          { title: reservasCompletadas, subtitle: "Completadas Hoy", icon: <CheckCircleOutline sx={{ fontSize: 80, color: "#4CAF50" }} /> },
          { title: reservasCanceladas, subtitle: "Canceladas Hoy", icon: <CancelOutlined sx={{ fontSize: 80, color: "#F44336" }} /> },
          { title: reservasHoy, subtitle: "Reservas de Hoy", icon: <Today sx={{ fontSize: 80, color: "#00B2E2" }} /> },
          { title: intentosReserva, subtitle: "Intentos de Reserva Mes", icon: <HourglassBottom sx={{ fontSize: 80, color: "#FF9800" }} /> },


        ].map((item, i) => (
          <Box key={i} gridColumn="span 3">
            <StatBox title={item.title} subtitle={item.subtitle} icon={item.icon} />
          </Box>
        ))}

        {/* Gráfico de Barras */}
        <Box
          gridColumn={isXlDevices ? "span 12" : isMdDevices ? "span 6" : "span 3"}
          gridRow="span 4"
          backgroundColor={colors.primary[400]}
        >
          <Typography variant="h5" fontWeight="600" sx={{ p: "30px 30px 0 30px" }}>
            Reservas por Espacio (Mes Actual)
          </Typography>
          <Box
            ref={chartRef}
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="500px"
            mt="-20px"
          >
            <BarChart isDashboard={true} data={barChartData} isExport={true} />
          </Box>
        </Box>

        {/* Tabla por carrera y espacio */}
        <Box
          ref={tableRef}
          gridColumn={isXlDevices ? "span 12" : isMdDevices ? "span 6" : "span 3"}
          gridRow="span 4"
        >
          <CarreraEspacioTable data={tablaCarreraEspacio} />
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;
