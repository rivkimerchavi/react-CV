import { useEffect, useState } from "react";
import axios from "axios";

type ResumeFile = {
  id: number;
  fileName: string;
  s3Url: string; // ודא שזו השדה שמחזיר URL מלא לתמונה
};

const ResumeImagesGallery = () => {
  const [files, setFiles] = useState<ResumeFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await axios.get("/resume-file/user-files", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"), // שים כאן את הטוקן אם יש
          },
        });
        setFiles(res.data);
      } catch (err) {
        setError("שגיאה בשליפת קבצים");
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  if (loading) return <div>טוען תמונות...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
      {files.map((file) => (
        <div key={file.id} className="rounded shadow-lg overflow-hidden">
          <img
            src={file.s3Url}
            alt={file.fileName}
            className="w-full h-auto object-cover"
          />
          <div className="text-center p-2">{file.fileName}</div>
        </div>
      ))}
    </div>
  );
};

export default ResumeImagesGallery;
