import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Template {
  id?: string;
  code: number;
  name: string;
  pdFpath: string; // מכיל קישור לתמונה (JPEG/PNG)
  filePath: string;
}

const TemplateList: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStartIndex, setCurrentStartIndex] = useState(0);
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const templatesPerPage = 4;

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/Template `);
        const data = Array.isArray(response.data) ? response.data : response.data?.$values;
        if (Array.isArray(data)) {
          setTemplates(data);
        } else {
          throw new Error("Invalid data format");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || "Failed to load templates");
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  const handleTemplateClick = (name: string) => {
    navigate(`/templateEditor/${name}`);
  };

  const handlePrev = () => {
    setCurrentStartIndex(prev =>
      prev > 0 ? prev - templatesPerPage : Math.max(0, templates.length - templatesPerPage)
    );
  };

  const handleNext = () => {
    setCurrentStartIndex(prev =>
      prev + templatesPerPage < templates.length ? prev + templatesPerPage : 0
    );
  };

  const visibleTemplates = templates.slice(currentStartIndex, currentStartIndex + templatesPerPage);

  return (
    <div style={{
      direction: 'rtl',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '40px 20px',
      fontFamily: "'Assistant', Arial, sans-serif"
    }}>
      <h1 style={{
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '50px',
        textAlign: 'center',
        fontSize: '28px'
      }}>
        מהו העיצוב המועדף עליך?
      </h1>

      {loading ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #007bff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '20px'
          }} />
          <p style={{ fontSize: '18px', color: '#666' }}>טוען תבניות...</p>
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#d32f2f', fontSize: '18px' }}>
          <h3 style={{ margin: '0 0 16px 0' }}>שגיאה בטעינת התבניות</h3>
          <p style={{ margin: 0 }}>{error}</p>
        </div>
      ) : templates.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#666' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px', color: '#ccc' }}>📄</div>
          <h3 style={{ margin: 0 }}>לא נמצאו תבניות</h3>
        </div>
      ) : (
        <div style={{
          position: "relative",
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto"
        }}>
          {/* חץ שמאלה */}
          <button
            onClick={handlePrev}
            style={{
              position: "absolute",
              left: '-60px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 100,
              backgroundColor: "#007bff",
              color: "white",
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
            }}
          >
            &#8249;
          </button>

          {/* תבניות */}
          <div style={{
            display: "flex",
            gap: '30px',
            justifyContent: 'center',
            alignItems: 'flex-start',
            padding: '20px 0',
            flexWrap: 'wrap'
          }}>
            {visibleTemplates.map((template, index) => (
              <div
                key={template.id || `template-${currentStartIndex + index}`}
                onClick={() => handleTemplateClick(template.name)}
                style={{
                  width: "250px",
                  height: "350px",
                  cursor: "pointer",
                  borderRadius: "8px",
                  overflow: "hidden",
                  backgroundColor: "white",
                  border: "1px solid #ddd",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  transition: "all 0.3s ease",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                }}
              >
                <div style={{
                  width: "100%",
                  height: "280px",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#f9f9f9"
                }}>
                  <img
                    src={template.pdFpath}
                    alt={template.name}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain"
                    }}
                  />
                </div>

                <div style={{
                  height: "70px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "white",
                  borderTop: "1px solid #eee"
                }}>
                  <h3 style={{
                    fontWeight: "600",
                    fontSize: '16px',
                    fontFamily: "'Assistant', Arial, sans-serif",
                    margin: 0,
                    color: "#333",
                    textAlign: "center"
                  }}>
                    {template.name}
                  </h3>
                </div>

                <div style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "#007bff",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "25px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  opacity: 0,
                  transition: "opacity 0.3s ease",
                  pointerEvents: "none",
                  whiteSpace: "nowrap"
                }}
                  className="select-button"
                >
                  בחירת עיצוב
                </div>
              </div>
            ))}
          </div>

          {/* חץ ימינה */}
          <button
            onClick={handleNext}
            style={{
              position: "absolute",
              right: '-60px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 100,
              backgroundColor: "#007bff",
              color: "white",
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
            }}
          >
            &#8250;
          </button>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          div:hover .select-button {
            opacity: 1 !important;
          }
        `
      }} />
    </div>
  );
};

export default TemplateList;
