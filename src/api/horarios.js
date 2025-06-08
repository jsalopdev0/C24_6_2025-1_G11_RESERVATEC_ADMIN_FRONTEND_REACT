import axiosInstance from "./axiosInstance";

// Obtiene todos los horarios disponibles
export const getHorarios = async () => {
  const response = await axiosInstance.get("/horarios");
  return response.data;
};

// Obtiene los IDs de horarios ya ocupados para un espacio y fecha específicos
export const getHorariosOcupados = async (espacioId, fecha) => {
  const response = await axiosInstance.get("/reservas/horarios-ocupados", {
    params: {
      espacioId,
      fecha,
    },
  });
  return response.data;
};
