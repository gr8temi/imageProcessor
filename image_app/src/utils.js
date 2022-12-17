export const extractNameFromUrl = (url) => {
  try {
    return new URL(url).pathname.split("/").pop();
  } catch (e) {
    return e;
  }
};
