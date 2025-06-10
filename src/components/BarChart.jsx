import { ResponsiveBar } from "@nivo/bar";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";

const BarChart = ({ isDashboard = false, data = [] }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isDark = theme.palette.mode === "dark";

  const palette = [
    colors.blueAccent[500],
    colors.greenAccent[500],
    colors.redAccent[500],
    colors.blueAccent[300],
    colors.greenAccent[300],
    colors.redAccent[300],
    colors.blueAccent[700],
    colors.greenAccent[700],
    colors.redAccent[700],
    colors.customAccent.main,
  ];

  const formattedData = (data || [])
    .filter(
      (item) =>
        item &&
        typeof item.espacio === "string" &&
        typeof item.cantidad === "number" &&
        !isNaN(item.cantidad)
    )
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 10)
    .map((item, index) => ({
      espacio:
        item.espacio.length > 20
          ? item.espacio.slice(0, 20) + "..."
          : item.espacio,
      reservas: item.cantidad,
      color: palette[index % palette.length],
    }));

  const maxReservas =
    formattedData.length > 0
      ? Math.max(...formattedData.map((d) => d.reservas))
      : 0;

  if (formattedData.length === 0) {
    return (
      <div style={{ padding: "20px", color: colors.gray[100] }}>
        No hay datos disponibles para mostrar el gráfico.
      </div>
    );
  }

  return (
    <ResponsiveBar
      data={formattedData}
      keys={["reservas"]}
      indexBy="espacio"
      margin={{ top: 50, right: 30, bottom: 100, left: 80 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={({ data }) => data.color}
      borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 10,
        tickRotation: -25,
        legend: "Espacios",
        legendPosition: "middle",
        legendOffset: 90, // ← MÁS ABAJO
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 10,
        tickRotation: 0,
        legend: "Reservas",
        legendPosition: "middle",
        legendOffset: -60,
        tickValues: Array.from(
          { length: Math.ceil(maxReservas / 5) + 1 },
          (_, i) => i * 5
        ),
      }}
      enableLabel={true}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{
        from: "color",
        modifiers: [["brighter", 2]],
      }}
      tooltip={({ id, value, color, indexValue }) => (
        <div
          style={{
            padding: 12,
            background: isDark ? "#1a1a1a" : "#fff",
            color: isDark ? "#fff" : "#111",
            border: `1px solid ${color}`,
            borderRadius: 4,
            fontSize: 14,
          }}
        >
          <strong>{indexValue}</strong>: {value} reservas
        </div>
      )}
      theme={{
        axis: {
          domain: { line: { stroke: colors.gray[100] } },
          ticks: {
            line: { stroke: colors.gray[100], strokeWidth: 1 },
            text: { fill: colors.gray[100], fontSize: 14 },
          },
          legend: {
            text: { fill: colors.gray[100], fontSize: 16, fontWeight: 600 },
          },
        },
        labels: {
          text: { fill: colors.gray[100], fontSize: 14 },
        },
        tooltip: {
          container: {
            background: isDark ? "#1a1a1a" : "#fff",
            color: isDark ? "#fff" : "#111",
            fontSize: 14,
          },
        },
      }}
    />
  );
};

export default BarChart;
