export const isImage = (filename: string) => {
  const imageExtensions = [".png", ".jpg", ".jpeg", ".gif", ".bmp", ".svg"]
  const fileExtension = filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);

  return imageExtensions.includes("." + fileExtension.toLowerCase());
}