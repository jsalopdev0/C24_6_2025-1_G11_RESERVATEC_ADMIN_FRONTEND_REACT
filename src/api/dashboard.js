import axiosInstance from "./axiosInstance"; // Asegúrate que apunte a tu backend

export const getReservasDelMes = () => axiosInstance.get("/reservas/mes");
export const getReservasDeHoy = () => axiosInstance.get("/reservas/hoy");
export const getReservasMesAnterior = () => axiosInstance.get("/reservas/mes-anterior");
export const getReservasPorEspacioMes = () => axiosInstance.get("/reservas/resumen-mensual");
export const getHorasPorDiaDeporte = () =>
    axiosInstance.get("/reservas/horas-por-dia-todos");
  
// Obtener total por estado y fecha (hoy si no se envía)
export const getReservasPorEstado = (estado, fecha = null) => {
    const params = fecha ? { params: { fecha } } : {};
    return axiosInstance.get(`/reservas/total/${estado}`, params);
  };
  export const getIntentosReserva = () =>
    axiosInstance.get("/reservas/intentos");
  export const getReservasPorEstadoMes = (estado) =>
    axiosInstance.get(`/reservas/total-mes/${estado}`);

  export const getResumenCarreraEspacioMensual = async (anio) => {
    return await axiosInstance.get(`/reservas/resumen-carrera-espacio-mensual`, {
      params: { anio }
    });
  };
  
  export const getReservasCreadasPorAdmin = async () => {
    const response = await axiosInstance.get("/reservas/total-creadas-por-admin");
    return response;
  };