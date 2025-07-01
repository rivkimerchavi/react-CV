import React from "react";
import { Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import resumeImage from "../assets/images/2.png";

const Auth: React.FC = () => {
  const navigate = useNavigate();

  // 🔥 בדיקה אם המשתמש כבר מחובר
  React.useEffect(() => {
    // בדיקת טוקן בלוקל סטורג' - אותם הטוקנים שמשתמשים ב-ResumeGallery
    const jwtToken = localStorage.getItem('jwtToken');
    const token = localStorage.getItem('token');
    const authToken = localStorage.getItem('authToken');
    const accessToken = localStorage.getItem('accessToken');
    
    // הדפסה לקונסול לבדיקה
    console.log('🔍 בדיקת טוקנים בAuth:');
    console.log('jwtToken:', jwtToken);
    console.log('token:', token);
    console.log('authToken:', authToken);
    console.log('accessToken:', accessToken);
    
    // תיקון: אם יש token אבל אין jwtToken, נעתיק את הטוקן לשדה הנכון
    if (token && !jwtToken) {
      console.log('🔧 מעתיק token ל-jwtToken...');
      localStorage.setItem('jwtToken', token);
    }
    
    // בדיקה אם יש טוקן ושהוא לא ריק
    const isLoggedIn = (jwtToken && jwtToken.trim() !== '') || 
                      (token && token.trim() !== '') || 
                      (authToken && authToken.trim() !== '') || 
                      (accessToken && accessToken.trim() !== '');
    
    console.log('✅ האם מחובר?', isLoggedIn);
    
    // if (isLoggedIn) {
    //   console.log('🔄 מעביר לגלריית רזומה...');
    //   // העברה לגלריית הרזומה אם המשתמש כבר מחובר
    //   // עיכוב קטן כדי לוודא שהטוקן נשמר בלוקל סטורג'
    //   setTimeout(() => {
    //     navigate('/resume-gallery');
    //   }, 100);
    //   return;
    // } else {
    //   console.log('❌ לא מחובר - נשאר בדף Auth');
    // }
   }, [navigate]);

  // 🚫 מניעת גלילה גלובלית
  React.useEffect(() => {
    // חסימת גלילה על body
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    // ניקוי בעת unmount
    return () => {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    };
  }, []);

  return (
    <Box 
      sx={{ 
        height: "100vh",
        width: "100vw",
        bgcolor: "#f5f9ff",
        overflow: "hidden",
        position: "fixed",
        top: 0,
        left: 0,
        display: "flex",
        flexDirection: "column",
        margin: 0,
        padding: 0
      }}
    >
      {/* שורה עליונה - כפתורים ולוגו */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 2,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          width: "100%",
          boxSizing: "border-box"
        }}
      >
        {/* כפתורים בצד שמאל */}
        <Box
          sx={{
            display: "flex",
            gap: 1.5
          }}
        >
          <Button
            variant="outlined"
            onClick={() => navigate("/login")}
            sx={{
              color: "#0085FF",
              borderColor: "#0085FF",
              borderRadius: "10px",
              fontWeight: 600,
              padding: "8px 16px",
              textTransform: "none",
              bgcolor: "#fff",
              fontSize: "14px",
              minWidth: "100px",
              "&:hover": { 
                bgcolor: "#f0f8ff",
                borderColor: "#006edc"
              },
            }}
          >
            התחברות
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate("/register")}
            sx={{
              bgcolor: "#0085FF",
              color: "#fff",
              borderRadius: "10px",
              fontWeight: 600,
              padding: "8px 16px",
              textTransform: "none",
              fontSize: "14px",
              minWidth: "100px",
              "&:hover": { 
                bgcolor: "#006edc"
              },
            }}
          >
            הרשמה
          </Button>
        </Box>

        {/* לוגו בצד ימין */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1
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
              borderRadius: "10px",
              background: "linear-gradient(135deg, #0085FF, #00bcd4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 3px 8px rgba(0, 133, 255, 0.3)"
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
      </Box>

      {/* אזור תוכן מרכזי */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "center",
          padding: 2,
          gap: 3,
          height: "100%",
          overflow: "hidden",
          boxSizing: "border-box"
        }}
      >
        {/* צד שמאל - תמונה */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flex: { xs: "0 0 auto", md: "1" },
            maxWidth: { xs: "100%", md: "45%" },
            width: "100%"
          }}
        >
          <Box
            component="img"
            src={resumeImage}
            alt="Resume"
            sx={{
              width: { xs: "50%", md: "70%" },
              maxWidth: "300px",
              height: "auto",
              objectFit: "contain"
            }}
          />
        </Box>

        {/* צד ימין - טקסט בלבד */}
        <Box
          sx={{
            textAlign: "right",
            direction: "rtl",
            flex: { xs: "0 0 auto", md: "1" },
            maxWidth: { xs: "100%", md: "55%" },
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-end",
            padding: 3
          }}
        >
          {/* כותרת קטנה עליונה */}
          <Typography 
            variant="subtitle1"
            sx={{
              fontSize: "16px",
              fontWeight: 400,
              color: "#666666",
              fontFamily: "Arial, sans-serif",
              textAlign: "right",
              direction: "rtl",
              mb: 2,
              width: "100%"
            }}
          >
            קורות חיים בקלות ובמהירות
          </Typography>

          <Typography 
            variant="h1"
            sx={{
              fontSize: { xs: "28px", md: "40px" },
              fontWeight: 700,
              lineHeight: 1.3,
              color: "#000000",
              fontFamily: "Arial, sans-serif",
              textAlign: "right",
              direction: "rtl",
              width: "100%",
              mb: 3
            }}
          >
            לוקח רק 5 שניות לעבור על קורות החיים שלך, כתב/י אותם היטב.
          </Typography>
          
          <Typography 
            variant="body1"
            sx={{
              fontSize: { xs: "16px", md: "18px" },
              lineHeight: 1.6,
              color: "#333333",
              fontFamily: "Arial, sans-serif",
              fontWeight: 400,
              textAlign: "right",
              direction: "rtl",
              width: "100%"
            }}
          >
            כתיבת קורות חיים מעולים לא הייתה קלה יותר. נסה/י עכשיו ויהיו לך קורות חיים מעוצבים תוך מספר דקות - בדיוק כפי שמגייסים מחפשים. למה את/ה מחכה?
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Auth;