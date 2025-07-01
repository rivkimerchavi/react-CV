import React, { useState, useEffect, useCallback } from 'react';
import { Edit, Trash2, Plus, AlertCircle, Loader, RefreshCw, Sparkles } from 'lucide-react';

interface Resume {
  id: string;
  fileName: string;
  path?: string;
  fileUrl?: string;
  image?: string;
  profileImage?: string;
  createdAt?: string;
}

interface ResumeGalleryProps {
  onEditResume: (resumeData: any) => void;
}

const ResumeGallery: React.FC<ResumeGalleryProps> = ({ onEditResume }) => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [coverLetterLoading, setCoverLetterLoading] = useState<string | null>(null);
  const [coverLetterModal, setCoverLetterModal] = useState<Resume | null>(null);
  const [jobDescription, setJobDescription] = useState<string>('');
  
  // קונפיגורציה
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  // הוספת מפתח OpenAI
  const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
  // פונקציה לקבלת טוקן
  const getAuthToken = useCallback(() => {
    return localStorage.getItem('jwtToken') || 
           localStorage.getItem('token') || 
           localStorage.getItem('authToken') || 
           localStorage.getItem('accessToken');
  }, []);

  // טעינת רשימת קורות החיים
  const loadResumes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getAuthToken();
      if (!token) {
        throw new Error('לא נמצא טוקן התחברות');
      }

      const response = await fetch(`${API_BASE_URL}/resume-file/user-files`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('UNAUTHORIZED');
        }
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      console.log('✅ קורות חיים נטענו:', data);
      setResumes(data || []);
      
    } catch (error: unknown) {
      console.error('❌ שגיאה בטעינת קורות חיים:', error);
      
      if (error instanceof Error && error.message === 'UNAUTHORIZED') {
        setError('בעיית הרשאה - נא להתחבר מחדש');
        localStorage.removeItem('jwtToken');
      } else {
        setError('שגיאה בטעינת קורות החיים');
      }
    } finally {
      setLoading(false);
    }
  }, [getAuthToken, API_BASE_URL]);

  // פונקציה לקבלת נתוני קורות החיים מהשרת
  const getResumeData = async (resumeId: string) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('לא נמצא טוקן התחברות');
      }

      const response = await fetch(`${API_BASE_URL}/resume-file/resumeFile/${resumeId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`שגיאת שרת ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ שגיאה בקבלת נתוני קורות חיים:', error);
      throw error;
    }
  };

  // פונקציה ליצירת מכתב מקדים עם OpenAI
  const generateCoverLetterWithAI = async (resumeData: any, jobDescription: string) => {
    try {
      console.log('🤖 יוצר מכתב מקדים עם OpenAI...');
      
      // הכנת הטקסט עבור ה-AI
      const prompt = `
אתה מומחה לכתיבת מכתבים מקדימים בעברית. צור מכתב מקדים מקצועי ומעוצב יפה על בסיס קורות החיים הבאים ותיאור המשרה.

פרטי המועמד:
${JSON.stringify(resumeData, null, 2)}

תיאור המשרה:
${jobDescription}

הנחיות:
1. כתוב מכתב מקצועי ומנומס בעברית
2. התמקד בהתאמה בין כישורי המועמד לדרישות המשרה
3. השתמש בטון חם ומקצועי
4. אל תכלול פרטים שלא קיימים בקורות החיים
5. אורך המכתב: 2-3 פסקאות
6. התחל ב"לכבוד" וסיים ב"בברכה"
7. אם יש שם במידע האישי, השתמש בו לחתימה

צור מכתב מקדים באיכות גבוהה:`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini', // גרסה חסכונית יותר
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1000,
          temperature: 0.7,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ שגיאת OpenAI:', errorData);
        throw new Error(`שגיאה מ-OpenAI: ${response.status} - ${errorData.error?.message || 'שגיאה לא ידועה'}`);
      }

      const aiResponse = await response.json();
      console.log('✅ תגובה מ-OpenAI:', aiResponse);
      
      const coverLetter = aiResponse.choices[0]?.message?.content;
      
      if (!coverLetter) {
        throw new Error('לא התקבל מכתב מקדים מה-AI');
      }

      return coverLetter;
      
    } catch (error) {
      console.error('❌ שגיאה ב-OpenAI:', error);
      throw error;
    }
  };

  // שמירת המכתב המקדים בשרת
  const saveCoverLetterToServer = async (resumeId: string, coverLetterContent: string, jobDescription: string) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('לא נמצא טוקן התחברות');
      }

      const response = await fetch(`${API_BASE_URL}/cover-letter/save`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeId: resumeId,
          content: coverLetterContent,
          jobDescription: jobDescription,
          createdBy: 'AI-OpenAI',
          metadata: {
            model: 'gpt-4o-mini',
            generatedAt: new Date().toISOString()
          }
        })
      });

      if (!response.ok) {
        throw new Error(`שגיאת שרת ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ שגיאה בשמירת מכתב מקדים:', error);
      throw error;
    }
  };

  // יצירת מכתב מקדים משולב
  const generateCoverLetter = useCallback(async (resumeId: string, resumeFileName: string) => {
    if (!jobDescription.trim()) {
      alert('נא הוסף תיאור משרה');
      return;
    }

    try {
      setCoverLetterLoading(resumeId);
      
      console.log('🚀 מתחיל תהליך יצירת מכתב מקדים...');
      
      // שלב 1: קבלת נתוני קורות החיים
      console.log('📄 קורא נתוני קורות חיים...');
      const resumeData = await getResumeData(resumeId);
      
      // שלב 2: יצירת מכתב מקדים עם AI
      console.log('🤖 יוצר מכתב מקדים עם AI...');
      const coverLetterContent = await generateCoverLetterWithAI(resumeData, jobDescription);
      
      // שלב 3: שמירת המכתב בשרת
      console.log('💾 שומר מכתב מקדים בשרת...');
      await saveCoverLetterToServer(resumeId, coverLetterContent, jobDescription);
      
      console.log('✅ תהליך יצירת מכתב מקדים הושלם בהצלחה!');
      
      // סגירת המודל ורענון
      setCoverLetterModal(null);
      setJobDescription('');
      
      // הצגת המכתב למשתמש
      alert(`✅ מכתב מקדים נוצר בהצלחה עבור "${resumeFileName}"!\n\nהמכתב נשמר במערכת ואתה יכול לצפות בו בעמוד המכתבים המקדימים.`);
      
    } catch (error) {
      console.error('❌ שגיאה ביצירת מכתב מקדים:', error);
      
      let errorMessage = '❌ שגיאה ביצירת מכתב מקדים';
      if (error instanceof Error) {
        if (error.message.includes('OpenAI')) {
          errorMessage = '❌ שגיאה בחיבור ל-AI. נסה שוב מאוחר יותר.';
        } else if (error.message.includes('טוקן')) {
          errorMessage = '❌ בעיית הרשאה. נא התחבר מחדש.';
        } else if (error.message.includes('שרת')) {
          errorMessage = '❌ בעיה בשרת. נסה שוב מאוחר יותר.';
        }
      }
      
      alert(errorMessage);
    } finally {
      setCoverLetterLoading(null);
    }
  }, [getAuthToken, API_BASE_URL, jobDescription]);

  // מחיקת קורות חיים
  const deleteResume = useCallback(async (resumeId: string, fileName: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }

    if (!window.confirm(`האם אתה בטוח שברצונך למחוק את קורות החיים "${fileName}"?`)) {
      return;
    }

    try {
      setDeleteLoading(resumeId);
      
      const token = getAuthToken();
      if (!token) {
        throw new Error('לא נמצא טוקן התחברות');
      }

      const response = await fetch(`${API_BASE_URL}/resume-file/delete/${resumeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`שגיאת שרת ${response.status}`);
      }

      setResumes(prev => prev.filter(resume => resume.id !== resumeId));
      console.log('✅ קורות חיים נמחקו בהצלחה');
      
    } catch (error) {
      console.error('❌ שגיאה במחיקת קורות חיים:', error);
      alert('❌ שגיאה במחיקת קורות החיים');
    } finally {
      setDeleteLoading(null);
    }
  }, [getAuthToken, API_BASE_URL]);

  // עריכת קורות חיים
  const editResume = useCallback(async (resumeId: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }

    try {
      const resumeData = await getResumeData(resumeId);
      
      if (onEditResume) {
        onEditResume(resumeData);
      }
      
    } catch (error) {
      console.error('❌ שגיאה בטעינת נתונים לעריכה:', error);
      alert('❌ שגיאה בטעינת נתונים לעריכה');
    }
  }, [onEditResume]);

  // יצירת קורות חיים חדשים
  const createNewResume = useCallback(() => {
    if (onEditResume) {
      onEditResume(null);
    }
  }, [onEditResume]);

  // פונקציה לקבלת URL של התמונה מ-AWS
  const getImageUrl = useCallback((resume: Resume) => {
    const imageUrl = resume.path || resume.fileUrl || resume.image || resume.profileImage;
    
    if (imageUrl && imageUrl.trim()) {
      if (imageUrl.startsWith('http') || imageUrl.startsWith('//')) {
        return imageUrl;
      }
      
      const awsUrl = `https://rrrrrrreeeee.s3.amazonaws.com/${imageUrl}`;
      return awsUrl;
    }
    
    return null;
  }, []);

  // טעינה ראשונית
  useEffect(() => {
    loadResumes();
  }, [loadResumes]);

  // Loading state
  if (loading) {
    return (
      <div style={{
        fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
        direction: 'rtl',
        backgroundColor: '#f8f9fa',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}>
          <Loader size={40} style={{ animation: 'spin 1s linear infinite', color: '#4285f4' }} />
          <p style={{ fontSize: '16px', color: '#5f6368', margin: 0 }}>טוען קורות חיים...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{
        fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
        direction: 'rtl',
        backgroundColor: '#f8f9fa',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          padding: '40px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <AlertCircle size={40} style={{ color: '#ea4335' }} />
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#202124' }}>שגיאה</h3>
          <p style={{ margin: 0, fontSize: '14px', color: '#5f6368', textAlign: 'center' }}>{error}</p>
          <button 
            onClick={loadResumes}
            style={{
              background: '#4285f4',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <RefreshCw size={16} />
            נסה שוב
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
      direction: 'rtl',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      margin: 0,
      padding: 0
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'white',
        padding: '12px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #e1e5e9',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        {/* Left side - Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{
            fontSize: '18px',
            fontWeight: '500',
            color: '#4285f4'
          }}>
            ResumeBuilder
          </span>
        </div>

        {/* Right side - Logout button only */}
        <button
          onClick={() => {
            if (window.confirm('האם אתה בטוח שברצונך להתנתק?')) {
              localStorage.removeItem('jwtToken');
              localStorage.removeItem('token');
              localStorage.removeItem('authToken');
              localStorage.removeItem('accessToken');
              window.location.href = '/login';
            }
          }}
          style={{
            background: 'none',
            border: '1px solid #4285f4',
            borderRadius: '8px',
            padding: '8px 16px',
            fontSize: '14px',
            color: '#4285f4',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLButtonElement).style.backgroundColor = '#4285f4';
            (e.target as HTMLButtonElement).style.color = 'white';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.backgroundColor = 'transparent';
            (e.target as HTMLButtonElement).style.color = '#4285f4';
          }}
        >
          התנתק/י
        </button>
      </div>

      {/* Main Layout */}
      <div style={{
        display: 'flex',
        minHeight: 'calc(100vh - 60px)',
        backgroundColor: 'rgba(66, 133, 244, 0.05)'
      }}>
        {/* Sidebar */}
        <div style={{
          width: '300px',
          backgroundColor: 'white',
          borderLeft: '1px solid #e1e5e9',
          padding: '24px 20px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Navigation */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{
              backgroundColor: '#e8f0fe',
              color: '#1967d2',
              padding: '10px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              marginBottom: '8px',
              textAlign: 'center'
            }}>
              המסמכים שלי
            </div>

            <div style={{
              backgroundColor: '#f8f9fa',
              color: '#5f6368',
              padding: '10px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '400',
              textAlign: 'center',
              cursor: 'pointer'
            }}>
              מכתבים מקדימים
            </div>
          </div>

          {/* Document count */}
          <div style={{
            fontSize: '13px',
            color: '#80868b',
            textAlign: 'center',
            marginTop: 'auto'
          }}>
            {resumes.length} מסמכים
          </div>
        </div>

        {/* Main Content */}
        <div style={{
          flex: 1,
          padding: '32px',
          backgroundColor: 'transparent'
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px'
          }}>
            <h1 style={{
              fontSize: '32px',
              fontWeight: '400',
              color: '#202124',
              margin: 0
            }}>
              המסמכים שלי
            </h1>
            
            <button 
              onClick={createNewResume}
              style={{
                backgroundColor: '#4285f4',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 32px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                minWidth: '200px'
              }}>
              <Plus size={16} />
              יצירת קו"ח חדשים
            </button>
          </div>

          {/* Documents Grid */}
          {resumes.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '400px',
              color: '#80868b',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '64px', marginBottom: '24px', opacity: 0.3 }}>📄</div>
              <h3 style={{ fontSize: '20px', fontWeight: '400', marginBottom: '8px', color: '#5f6368' }}>
                אין עדיין קורות חיים
              </h3>
              <p style={{ fontSize: '16px', marginBottom: '24px', color: '#80868b' }}>
                צור את קורות החיים הראשונים שלך!
              </p>
              <button 
                onClick={createNewResume}
                style={{
                  background: '#4285f4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Plus size={16} />
                צור עכשיו
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '32px',
              maxWidth: '1200px'
            }}>
              {resumes.map((resume) => {
                const imageUrl = getImageUrl(resume);
                
                return (
                  <div 
                    key={resume.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '16px',
                      position: 'relative'
                    }}
                  >
                    {/* Document Preview */}
                    <div style={{
                      position: 'relative',
                      cursor: 'pointer'
                    }}>
                      {imageUrl ? (
                        <div style={{
                          width: '200px',
                          height: '280px',
                          position: 'relative',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          border: '1px solid #e0e0e0'
                        }}>
                          <img 
                            src={imageUrl}
                            alt={resume.fileName || 'קורות חיים'}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              objectPosition: 'top center',
                              display: 'block'
                            }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                              const placeholder = (e.target as HTMLImageElement).parentNode?.querySelector('.placeholder') as HTMLElement;
                              if (placeholder) placeholder.style.display = 'flex';
                            }}
                          />
                          <div 
                            className="placeholder"
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              display: 'none',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: '#f0f0f0',
                              fontSize: '32px',
                              color: '#999'
                            }}
                          >
                            📄
                          </div>
                        </div>
                      ) : (
                        <div style={{
                          width: '200px',
                          height: '280px',
                          backgroundColor: 'white',
                          border: '1px solid #e0e0e0',
                          borderRadius: '8px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          position: 'relative',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            backgroundColor: '#1e3a8a',
                            height: '60px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: '600'
                          }}>
                            {resume.fileName}
                          </div>
                          
                          <div style={{
                            padding: '16px',
                            height: 'calc(100% - 60px)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px'
                          }}>
                            {[...Array(12)].map((_, i) => (
                              <div key={i} style={{
                                height: '4px',
                                backgroundColor: i % 4 === 0 ? '#3b82f6' : '#e5e7eb',
                                borderRadius: '2px',
                                width: i % 3 === 0 ? '100%' : `${70 + (i * 5) % 30}%`
                              }} />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      marginTop: '20px',
                      opacity: 1,
                      transition: 'opacity 0.2s ease'
                    }}>
                      {/* Edit */}
                      <button
                        onClick={(e) => editResume(resume.id, e)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 12px',
                          border: 'none',
                          backgroundColor: 'transparent',
                          color: '#202124',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          fontSize: '14px',
                          fontWeight: '500',
                          minWidth: '80px'
                        }}
                        onMouseEnter={(e) => {
                          (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(0,0,0,0.05)';
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLButtonElement).style.backgroundColor = 'transparent';
                        }}
                        title="עריכה"
                      >
                        <Edit size={16} style={{ color: '#4285f4' }} />
                        עריכה
                      </button>

                      {/* Delete */}
                      <button
                        onClick={(e) => deleteResume(resume.id, resume.fileName, e)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 12px',
                          border: 'none',
                          backgroundColor: 'transparent',
                          color: '#202124',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          fontSize: '14px',
                          fontWeight: '500',
                          minWidth: '80px'
                        }}
                        onMouseEnter={(e) => {
                          const target = e.target as HTMLButtonElement;
                          if (!target.disabled) {
                            target.style.backgroundColor = 'rgba(0,0,0,0.05)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          const target = e.target as HTMLButtonElement;
                          if (!target.disabled) {
                            target.style.backgroundColor = 'transparent';
                          }
                        }}
                        title="מחיקה"
                        disabled={deleteLoading === resume.id}
                      >
                        {deleteLoading === resume.id ? (
                          <Loader size={16} style={{ animation: 'spin 1s linear infinite', color: '#4285f4' }} />
                        ) : (
                          <Trash2 size={16} style={{ color: '#4285f4' }} />
                        )}
                        מחיקה
                      </button>

                      {/* כפתור מכתב מקדים עם AI */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setCoverLetterModal(resume);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 12px',
                          border: 'none',
                          backgroundColor: 'transparent',
                          color: '#202124',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          fontSize: '14px',
                          fontWeight: '500',
                          minWidth: '80px'
                        }}
                        onMouseEnter={(e) => {
                          (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(0,0,0,0.05)';
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLButtonElement).style.backgroundColor = 'transparent';
                        }}
                        title="יצירת מכתב מקדים עם AI"
                      >
                        <Sparkles size={16} style={{ color: '#4285f4' }} />
                        מכתב AI
                      </button>
                    </div>

                    {/* Document info */}
                    <div style={{
                      position: 'absolute',
                      bottom: '-40px',
                      right: '0',
                      left: '0',
                      textAlign: 'center'
                    }}>
                      <h3 style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#202124',
                        margin: '0 0 4px 0'
                      }}>
                        {resume.fileName || `מסמך #${resume.id}`}
                      </h3>
                      
                      {resume.createdAt && (
                        <div style={{
                          fontSize: '12px',
                          color: '#80868b'
                        }}>
                          עדכון אחרון: {new Date(resume.createdAt).toLocaleDateString('he-IL', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Cover Letter Modal עם AI */}
      {coverLetterModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setCoverLetterModal(null)}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '80vh',
            overflow: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#202124',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Sparkles size={20} style={{ color: '#34a853' }} />
              יצירת מכתב מקדים עם AI עבור "{coverLetterModal.fileName}"
            </div>

            <div style={{
              backgroundColor: '#e8f5e8',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '13px',
              color: '#137333'
            }}>
              🤖 המערכת תשתמש בבינה מלאכותית של OpenAI ליצירת מכתב מקדים מותאם אישית על בסיס קורות החיים שלך ותיאור המשרה
            </div>
            
            <div style={{ marginBottom: '12px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#5f6368',
                marginBottom: '6px'
              }}>
                תיאור המשרה או החברה:
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="הדבק כאן את תיאור המשרה, או כתב פרטים על החברה והתפקיד שאליו אתה מגיש מועמדות...

דוגמה:
- שם החברה: טכנולוגיות XYZ
- תפקיד: מפתח Full Stack
- דרישות: React, Node.js, MySQL
- ניסיון: 2-3 שנים"
                style={{
                  width: '100%',
                  minHeight: '140px',
                  padding: '12px',
                  border: '1px solid #dadce0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => (e.target as HTMLTextAreaElement).style.borderColor = '#4285f4'}
                onBlur={(e) => (e.target as HTMLTextAreaElement).style.borderColor = '#dadce0'}
              />
            </div>

            <div style={{
              display: 'flex',
              gap: '12px',
              marginTop: '16px'
            }}>
              <button
                onClick={() => generateCoverLetter(coverLetterModal.id, coverLetterModal.fileName)}
                disabled={!jobDescription.trim() || coverLetterLoading === coverLetterModal.id}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                  backgroundColor: '#34a853',
                  color: 'white',
                  opacity: !jobDescription.trim() ? 0.5 : 1
                }}
              >
                {coverLetterLoading === coverLetterModal.id ? (
                  <>
                    <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
                    יוצר עם AI...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    צור מכתב עם AI
                  </>
                )}
              </button>
              
              <button
                onClick={() => {
                  setCoverLetterModal(null);
                  setJobDescription('');
                }}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid #dadce0',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  backgroundColor: '#f8f9fa',
                  color: '#5f6368'
                }}
                disabled={coverLetterLoading === coverLetterModal.id}
              >
                ביטול
              </button>
            </div>

            <div style={{
              fontSize: '12px',
              color: '#80868b',
              marginTop: '12px',
              textAlign: 'center'
            }}>
              💡 ככל שתיאור המשרה יהיה מפורט יותר, המכתב יהיה מותאם יותר<br/>
              🤖 המכתב ייוצר באמצעות OpenAI GPT-4 עם הנתונים מקורות החיים שלך
            </div>
          </div>
        </div>
      )}

      {/* CSS for animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `
      }} />
    </div>
  );
};

export default ResumeGallery;