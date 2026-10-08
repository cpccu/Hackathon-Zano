"use client";
import { useState } from "react";

export default function UploadField({ name }) {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("");

  async function onChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setStatus("Uploading...");
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
      { method: "POST", body: fd }
    );
    const data = await res.json();
    if (data.secure_url) {
      setUrl(data.secure_url);
      setStatus("Uploaded ✓");
    } else {
      setStatus(data.error?.message || "Upload failed");
    }
  }

  return (
    <div>
      <input type="file" onChange={onChange} className="border border-gray-300 p-2 rounded w-full" />
      <input type="hidden" name={name} value={url} />
      <p className="text-sm text-gray-500 mt-1">{status}</p>
    </div>
  );
}