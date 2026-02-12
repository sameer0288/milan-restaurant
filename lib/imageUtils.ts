import imageCompression from "browser-image-compression";

export const compressImage = async (file: File): Promise<File> => {
    const options = {
        maxSizeMB: 0.5, // Max 500KB
        maxWidthOrHeight: 1200,
        useWebWorker: true,
    };
    try {
        const compressedFile = await imageCompression(file, options);
        return compressedFile;
    } catch (error) {
        console.error("Image compression failed:", error);
        return file; // Fallback to original
    }
};
