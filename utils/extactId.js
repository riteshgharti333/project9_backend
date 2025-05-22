export const extractPublicId = (url) => {
  const parts = url.split('/');
  const filename = parts[parts.length - 1];
  return `sm_project/service_images/${filename.split('.')[0]}`;
};