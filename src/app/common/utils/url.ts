export const getHostUrl = () => {
  const origin = window.location.href;
  const match = /(http:\/\/[a-z0-9.]+)[^:]/.exec(origin);
  return match[0];
};
