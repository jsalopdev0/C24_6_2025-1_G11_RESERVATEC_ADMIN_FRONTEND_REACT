import axiosInstance from "./axiosInstance";

export const getUsuarios = async (q = "") => {
  const response = await axiosInstance.get("/usuarios", {
    params: q ? { q } : {},
  });
  return response;
};

export const getPerfilUsuario = async () => {
// ✅
const response = await axiosInstance.get("/usuarios/perfil");
  return response.data;
};
