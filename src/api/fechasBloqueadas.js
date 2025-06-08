import axiosInstance from "./axiosInstance";

export const getFechasBloqueadas = async () => {
  const response = await axiosInstance.get("/fechas-bloqueadas");
  return response.data;
};

export const crearFechaBloqueada = async (data) => {
  const response = await axiosInstance.post("/fechas-bloqueadas", data);
  return response.data;
};

export const patchIgnorarFechaBloqueada = async (id, ignorar) => {
  const response = await axiosInstance.patch(
    `/fechas-bloqueadas/${id}/ignorar?ignorar=${ignorar}`
  );
  return response.data;
};

export const actualizarFechaBloqueada = async (id, data) => {
  const response = await axiosInstance.put(`/fechas-bloqueadas/${id}`, data);
  return response.data;
};

