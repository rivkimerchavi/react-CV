import axios from 'axios';
import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Login: React.FC = () => {
  const [loginError, setLoginError] = useState('');
  const { control, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    setLoginError('');
    console.log(data);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/User/login`, {
        email: data.email,
        password: data.password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("jwtToken", response.data.token);
      }
      
      console.log("Login successfully", response.data);
      navigate("/templateList");
      
    } catch (error: any) {
      console.error("Login failed", error);
      
      if (error.response?.data?.message) {
        setLoginError(error.response.data.message);
      } else if (error.response?.status === 401) {
        setLoginError("אימייל או סיסמה שגויים. אנא נסה שוב.");
      } else if (error.response?.status === 404) {
        setLoginError("משתמש לא נמצא. אנא בדוק את האימייל שלך.");
      } else {
        setLoginError("התחברות נכשלה. אנא נסה שוב.");
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "white",
        display: "flex",
        fontFamily: "Arial, sans-serif",
        position: "relative"
      }}
    >
      {/* לוגו הכי בפינה של כל העמוד */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          gap: 1,
          zIndex: 1000,
          padding: "10px"
        }}
      >
        <Typography 
          variant="h6"
          sx={{
            fontWeight: 700,
            background: "linear-gradient(45deg, #0085FF, #00bcd4)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontSize: "18px"
          }}
        >
          ResumeBuilder
        </Typography>
        <Box
          sx={{
            width: "35px",
            height: "35px",
            borderRadius: "8px",
            background: "linear-gradient(135deg, #0085FF, #00bcd4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Typography
            sx={{
              fontSize: "16px",
              color: "white",
              fontWeight: "bold"
            }}
          >
            📄
          </Typography>
        </Box>
      </Box>

      {/* צד שמאל - תמונה */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "flex" },
          alignItems: "center",
          justifyContent: "flex-start",
          backgroundColor: "white",
          paddingLeft: "40px"
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "450px",
            height: "320px"
          }}
        >
          {/* עיגולים דקורטיביים ברקע */}
          <Box sx={{ 
            position: "absolute", 
            top: "20px", 
            right: "30px", 
            width: "100px", 
            height: "100px", 
            borderRadius: "50%", 
            background: "linear-gradient(135deg, rgba(0, 133, 255, 0.08), rgba(0, 188, 212, 0.08))",
            filter: "blur(1px)"
          }} />
          
          <Box sx={{ 
            position: "absolute", 
            bottom: "40px", 
            left: "20px", 
            width: "70px", 
            height: "70px", 
            borderRadius: "50%", 
            background: "linear-gradient(135deg, rgba(255, 107, 157, 0.08), rgba(255, 182, 193, 0.08))",
            filter: "blur(1px)"
          }} />

          {/* מסך מחשב עם צורה חופשית יותר */}
          <Box
            sx={{
              position: "absolute",
              top: "60px",
              left: "80px",
              width: "280px",
              height: "160px",
              background: "linear-gradient(145deg, #2c3e50, #34495e)",
              borderRadius: "16px 16px 8px 8px",
              transform: "rotate(-2deg)",
              boxShadow: "0 15px 35px rgba(0,0,0,0.2), 0 5px 15px rgba(0,0,0,0.1)",
              border: "2px solid #34495e"
            }}
          >
            {/* מסך פנימי */}
            <Box
              sx={{
                width: "260px",
                height: "140px",
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
                position: "absolute",
                top: "10px",
                left: "10px",
                overflow: "hidden"
              }}
            >
              {/* תוכן המסך - ממשק קורות חיים */}
              <Box sx={{ padding: "12px" }}>
                {/* כותרת */}
                <Box sx={{ 
                  width: "150px", 
                  height: "8px", 
                  backgroundColor: "#0085FF", 
                  borderRadius: "4px",
                  marginBottom: "12px"
                }} />
                
                {/* תמונת פרופיל עגולה */}
                <Box sx={{ 
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  width: "40px", 
                  height: "40px", 
                  borderRadius: "50%", 
                  background: "linear-gradient(135deg, #0085FF, #00bcd4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "14px"
                }}>
                  👤
                </Box>
                
                {/* קווי טקסט */}
                <Box sx={{ marginTop: "8px" }}>
                  <Box sx={{ width: "180px", height: "3px", backgroundColor: "#333", marginBottom: "6px", borderRadius: "2px" }} />
                  <Box sx={{ width: "120px", height: "2px", backgroundColor: "#888", marginBottom: "4px", borderRadius: "1px" }} />
                  <Box sx={{ width: "160px", height: "2px", backgroundColor: "#888", marginBottom: "4px", borderRadius: "1px" }} />
                  <Box sx={{ width: "90px", height: "2px", backgroundColor: "#888", marginBottom: "8px", borderRadius: "1px" }} />
                  
                  {/* סקילים */}
                  <Box sx={{ display: "flex", gap: "4px", marginTop: "8px" }}>
                    <Box sx={{ width: "30px", height: "6px", backgroundColor: "#28a745", borderRadius: "3px" }} />
                    <Box sx={{ width: "25px", height: "6px", backgroundColor: "#17a2b8", borderRadius: "3px" }} />
                    <Box sx={{ width: "35px", height: "6px", backgroundColor: "#ffc107", borderRadius: "3px" }} />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
          
          {/* בסיס המחשב - צורה אורגנית יותר */}
          <Box
            sx={{
              position: "absolute",
              bottom: "60px",
              left: "70px",
              width: "300px",
              height: "6px",
              background: "linear-gradient(135deg, #2c3e50, #34495e)",
              borderRadius: "20px",
              transform: "rotate(-2deg)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
            }}
          />
          
          {/* מקלדת קטנה */}
          <Box
            sx={{
              position: "absolute",
              bottom: "40px",
              left: "120px",
              width: "80px",
              height: "20px",
              background: "linear-gradient(135deg, #ecf0f1, #bdc3c7)",
              borderRadius: "4px",
              transform: "rotate(-1deg)",
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
            }}
          />
          
          {/* עכבר */}
          <Box
            sx={{
              position: "absolute",
              bottom: "35px",
              right: "140px",
              width: "15px",
              height: "25px",
              background: "linear-gradient(135deg, #ecf0f1, #bdc3c7)",
              borderRadius: "8px 8px 4px 4px",
              transform: "rotate(15deg)",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
            }}
          />

          {/* אלמנטים מעופפים */}
          <Box sx={{ 
            position: "absolute", 
            top: "30px", 
            left: "50px", 
            fontSize: "16px",
            opacity: 0.6,
            transform: "rotate(-15deg)"
          }}>
            📊
          </Box>
          
          <Box sx={{ 
            position: "absolute", 
            top: "180px", 
            right: "40px", 
            fontSize: "14px",
            opacity: 0.6,
            transform: "rotate(20deg)"
          }}>
            ✨
          </Box>
        </Box>
      </Box>

      {/* צד ימין - טופס */}
      <Box
        sx={{
          flex: { xs: 1, md: 0.6 },
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          backgroundColor: "white",
          position: "relative"
        }}
      >
        {/* תוכן הטופס */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 3
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: "400px",
              textAlign: "right",
              direction: "rtl"
            }}
          >
            {/* כותרת */}
            <Typography 
              variant="h4" 
              sx={{
                fontWeight: 700,
                color: "#0085FF",
                mb: 1,
                fontSize: "32px",
                textAlign: "right"
              }}
            >
              התחברות
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
              {/* שדה אימייל */}
              <Controller
                name="email"
                control={control}
                defaultValue=""
                rules={{
                  required: "אימייל הוא שדה חובה",
                  pattern: {
                    value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "כתובת אימייל לא תקינה",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    placeholder="אימייל"
                    type="email"
                    variant="standard"
                    fullWidth
                    margin="normal"
                    error={!!errors.email}
                    helperText={errors.email?.message as string || ""}
                    sx={{
                      mb: 3,
                      direction: 'rtl',
                      '& .MuiInput-underline:before': {
                        borderBottomColor: '#e0e0e0',
                      },
                      '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                        borderBottomColor: '#0085FF',
                      },
                      '& .MuiInput-underline:after': {
                        borderBottomColor: '#0085FF',
                      },
                      '& .MuiInput-input': {
                        textAlign: 'right',
                        direction: 'rtl',
                        fontFamily: 'Arial, sans-serif',
                        fontSize: '16px',
                        padding: '10px 0'
                      }
                    }}
                  />
                )}
              />

              <Controller
                name="password"
                control={control}
                defaultValue=""
                rules={{
                  required: "סיסמה היא שדה חובה",
                  minLength: {
                    value: 6,
                    message: "הסיסמה חייבת להכיל לפחות 6 תווים",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    placeholder="סיסמה"
                    type="password"
                    variant="standard"
                    fullWidth
                    margin="normal"
                    error={!!errors.password}
                    helperText={errors.password?.message as string || ""}
                    sx={{
                      mb: 4,
                      direction: 'rtl',
                      '& .MuiInput-underline:before': {
                        borderBottomColor: '#e0e0e0',
                      },
                      '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                        borderBottomColor: '#0085FF',
                      },
                      '& .MuiInput-underline:after': {
                        borderBottomColor: '#0085FF',
                      },
                      '& .MuiInput-input': {
                        textAlign: 'right',
                        direction: 'rtl',
                        fontFamily: 'Arial, sans-serif',
                        fontSize: '16px',
                        padding: '10px 0'
                      }
                    }}
                  />
                )}
              />

              {loginError && (
                <Typography color="error" variant="body2" align="center" sx={{ mb: 2 }}>
                  {loginError}
                </Typography>
              )}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  py: 1.5,
                  borderRadius: "8px",
                  backgroundColor: "#0085FF",
                  fontSize: "16px",
                  fontWeight: 600,
                  textTransform: "none",
                  '&:hover': {
                    backgroundColor: "#006edc"
                  }
                }}
              >
               המשך-
              </Button>
            </form>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;