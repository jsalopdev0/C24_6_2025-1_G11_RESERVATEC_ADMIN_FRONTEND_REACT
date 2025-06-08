import axiosInstance from './axiosInstance';

export const validarAdmin = (userData) => {
  return axiosInstance.post('/admin/validar', userData);
};
