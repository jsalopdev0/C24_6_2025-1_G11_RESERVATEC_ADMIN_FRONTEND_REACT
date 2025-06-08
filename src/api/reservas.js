import axiosInstance from "./axiosInstance";

export const getReservas = async (q = "") => {
  const response = await axiosInstance.get("/reservas", {
    params: q ? { q, _: Date.now() } : { _: Date.now() },
  });
  return response;
};

export const confirmarAsistencia = async (id) => {
  const response = await axiosInstance.post(`/reservas/${id}/confirmar-asistencia`);
  return response.data;
};

export const crearReserva = async (data) => {
    const response = await axiosInstance.post("/reservas", data);
    return response.data;
  };



  export const getReservasCalendario = async () => {
    const response = await axiosInstance.get("/reservas/calendario");
    return response.data;
  };


  
  