import axiosInstance from './axiosInstance';

// Listar notificaciones activas (para usuarios y admin)
export const getNotificacionesActivas = async () => {
  const response = await axiosInstance.get('/notificaciones/activas');
  return response.data;
};

// Listar todas las notificaciones (solo admin)
export const getTodasLasNotificaciones = async () => {
  const response = await axiosInstance.get('/notificaciones');
  return response.data;
};

// Crear una nueva notificación (solo admin)
export const crearNotificacion = async (contenido) => {
  const response = await axiosInstance.post('/notificaciones', { contenido });
  return response.data;
};

// Editar una notificación existente (solo admin)
export const editarNotificacion = async (id, datos) => {
  const response = await axiosInstance.put(`/notificaciones/${id}`, datos);
  return response.data;
};

// Cambiar estado (activar/desactivar) de una notificación (solo admin)
export const cambiarEstadoNotificacion = async (id, activo) => {
  await axiosInstance.put(`/notificaciones/${id}/estado?activo=${activo}`);
};
