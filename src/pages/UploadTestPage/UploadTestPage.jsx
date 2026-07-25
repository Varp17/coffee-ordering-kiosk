import { useState } from "react";

export default function UploadTest() {
  const [file, setFile] = useState(null);
  const [folder, setFolder] = useState("products");
  const [result, setResult] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      setResult("Please select a file first.");
      return;
    }

    setLoading(true);
    setResult("Uploading...");
    setImageUrl("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const apiUrl = import.meta.env.VITE_API_URL 
      ? `${import.meta.env.VITE_API_URL}/upload/s3`
      : "http://localhost:3000/api/v1/upload/s3";

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));

      const returnedPath = data?.data?.url || data?.url;
      if (returnedPath) {
        const fullUrl = returnedPath.startsWith("http")
          ? returnedPath
          : `http://localhost:3000${returnedPath}`;
        setImageUrl(fullUrl);
      }
    } catch (err) {
      setResult(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 40, maxWidth: 700, margin: "40px auto", background: "#1F2A44", borderRadius: 16, color: "#fff", fontFamily: "sans-serif" }}>
      <h2 style={{ color: "#C67C4E", marginTop: 0 }}>CHILLD Coffee — Upload Test</h2>
      <p style={{ color: "#CBD5E1" }}>
        Test multipart/form-data upload to <code>POST /api/v1/upload/s3</code>.
      </p>

      <div style={{ margin: "20px 0" }}>
        <label style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}>Select Destination Folder:</label>
        <select 
          value={folder} 
          onChange={(e) => setFolder(e.target.value)}
          style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #334155", background: "#0F172A", color: "#fff", width: "100%", fontSize: 16 }}
        >
          <option value="products">products</option>
          <option value="recipes">recipes</option>
        </select>
      </div>

      <div style={{ margin: "20px 0" }}>
        <label style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}>Choose Image File:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          style={{ padding: 10, background: "#0F172A", borderRadius: 8, border: "1px solid #334155", color: "#fff", width: "100%" }}
        />
      </div>

      <button 
        onClick={handleUpload}
        disabled={loading}
        style={{
          padding: "12px 24px",
          background: loading ? "#64748B" : "#1844AB",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          fontWeight: "bold",
          fontSize: 16,
          cursor: loading ? "not-allowed" : "pointer"
        }}
      >
        {loading ? "Uploading..." : "Upload Image"}
      </button>

      {imageUrl && (
        <div style={{ marginTop: 24, padding: 16, background: "#0F172A", borderRadius: 12, border: "1px solid #334155" }}>
          <h4 style={{ margin: "0 0 10px 0", color: "#3D9B6B" }}>✓ Image Uploaded & Serving Successfully:</h4>
          <a 
            href={imageUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: "#38BDF8", wordBreak: "break-all", display: "inline-block", marginBottom: 12 }}
          >
            {imageUrl} ↗
          </a>
          <div style={{ marginTop: 10 }}>
            <img 
              src={imageUrl} 
              alt="Uploaded preview" 
              style={{ maxWidth: "100%", maxHeight: 250, borderRadius: 8, border: "2px solid #C67C4E", objectFit: "contain" }} 
            />
          </div>
        </div>
      )}

      <div style={{ marginTop: 24 }}>
        <h4 style={{ margin: "0 0 8px 0", color: "#94A3B8" }}>JSON API Response:</h4>
        <pre style={{ padding: 16, background: "#0F172A", borderRadius: 8, overflowX: "auto", border: "1px solid #334155", color: "#38BDF8" }}>
          {result || "// API response will appear here after upload"}
        </pre>
      </div>
    </div>
  );
}
