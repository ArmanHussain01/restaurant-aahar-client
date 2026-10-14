const upload_preset = "rastFood";
const cloud_name = "i1opfbpn";
const api_url = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`;

export const uploadImageToCloudinary = async (file) => {
  if (!file) return null;

  try {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", upload_preset);
    data.append("cloud_name", cloud_name);

    const res = await fetch(api_url, {
      method: "POST",
      body: data,
    });

    const fileData = await res.json();

    if (!res.ok) {
      throw new Error(fileData.error?.message || "Failed to upload image");
    }

    return fileData.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw error;
  }
};