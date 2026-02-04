export const getImageUrl = (imagePath: string) => {
    // If the path already includes 'uploads/', remove it to avoid duplication
    const cleanPath = imagePath.startsWith("uploads/")
      ? imagePath.substring(8)
      : imagePath;
    return `http://localhost:5000/uploads/${cleanPath}`;
  };