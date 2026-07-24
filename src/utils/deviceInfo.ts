export const getDeviceId = (): string => {
  let id = localStorage.getItem("fitma_device_id");
  if (!id) {
    id = "device-" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem("fitma_device_id", id);
  }
  return id;
};
