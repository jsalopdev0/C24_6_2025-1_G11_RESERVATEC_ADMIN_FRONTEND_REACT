import axiosInstance from "./axiosInstance";

export const getEspacios = () => axiosInstance.get("/espacios");
export const crearEspacio = (data) => axiosInstance.post("/espacios", data);
export const editarEspacio = (id, data) => axiosInstance.put(`/espacios/${id}`, data);
