import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
  Collapse,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material"

// Icons
import DeleteIcon from "@mui/icons-material/Delete"
import {
  Add as AddIcon,
  FormatAlignLeft as FormatAlignLeftIcon,
  FormatAlignCenter as FormatAlignCenterIcon,
  FormatAlignJustify as FormatAlignJustifyIcon,
  FormatBold as FormatBoldIcon,
  FormatItalic as FormatItalicIcon,
  FormatUnderlined as FormatUnderlinedIcon,
  Add as PlusIcon,
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// הגדרת טיפוסים
interface ExperienceData {
  company: string;
  position: string;
  jobType: string;
  location: string;
  startDate: { month: string; year: string };
  endDate: { month: string; year: string };
  currentJob: boolean;
  experience: string;
  formatting?: TextFormat;
}

interface TextFormat {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  align: string;
}

interface SearchResult {
  type: string;
  text: string;
  profession?: string;
}

interface EmploymentExperienceProps {
  onFormChange?: (data: any) => void;
  onExperienceListChange?: (experiences: ExperienceData[]) => void;
  initialExperiences?: ExperienceData[];
  autoSave?: boolean;
  blockAutoSave?: boolean;
  manualSaveOnly?: boolean;
}

interface HelpText {
  [key: string]: string;
}

const initialExperienceData: ExperienceData = {
  company: "",
  position: "",
  jobType: "",
  location: "",
  startDate: { month: "", year: "" },
  endDate: { month: "", year: "" },
  currentJob: false,
  experience: "",
};

// מילון מקצועות ומשפטים
const professionDescriptions: Record<string, string[]> = {
  "מתכנת/ת": [
    "- תכנון והובלת פרויקטים חדשים, עמידה בלוחות זמנים עמוסים.",
    "- פיתוח ותחזוקת תוכנה בסביבת עבודה דינמית ומהירה.",
    "- מיומן/ת באיתור באגים ופתרון בעיות תוכנה מורכבות.",
    "- עבודה עם טכנולוגיות מתקדמות כגון React, Angular ו-Node.js."
  ],
  "מורה": [
    "- הוראה ופיתוח תכניות לימוד מותאמות אישית לתלמידים.",
    "- ניהול כיתות והובלת פרויקטים חינוכיים.",
    "- יצירת סביבת למידה חיובית ומעודדת."
  ],
  "מנהל/ת": [
    "- ניהול צוות של 10 עובדים והנחייתם להשגת יעדים ארגוניים.",
    "- תכנון והובלת פרויקטים עם עמידה בלוחות זמנים ותקציב.",
    "- פיתוח אסטרטגיות לשיפור יעילות וצמיחה."
  ],
  "מהנדס/ת": [
    "- תכנון והובלת פרויקטים הנדסיים מורכבים.",
    "- אחריות על בדיקות איכות ותחזוקה שוטפת.",
    "- פיתוח פתרונות יצירתיים לאתגרים טכניים."
  ],
  "שיווק ומכירות": [
    "- הובלת אסטרטגיות שיווק ומכירות להגדלת הכנסות החברה.",
    "- ניהול קשרי לקוחות ופיתוח שיתופי פעולה חדשים.",
    "- ניתוח נתוני שוק וזיהוי הזדמנויות עסקיות."
  ]
};

// משפטים כלליים
const generalDescriptions: string[] = [
  "- תכנון והובלת פרויקטים חדשים, עמידה בלוחות זמנים עמוסים.",
  "- מתן תמיכה טכנית ללקוחות, עבודה מול מערכות CRM.",
  "- ניהול צוות והכשרת עובדים חדשים בחברה.",
  "- הובלתי יוזמות לשיפור תהליכי עבודה וייעול המערכת.",
  "- אחראי/ת על ניהול תקציב ומעקב אחר הוצאות.",
  "- ביצוע מחקרי שוק וניתוח מגמות בתחום."
];

// עזרה והסברים על השדות
const helpText: HelpText = {
  main: "בחלק זה תוכל/י להוסיף את הניסיון התעסוקתי שלך. הוסף/י את המשרות האחרונות שלך כשהאחרונה בזמן תופיע ראשונה. מומלץ לכלול 2-3 משרות אחרונות.",
  position: "הכנס/י את התפקיד הרשמי שלך. לדוגמה: 'מנהל/ת פרויקטים', 'מפתח/ת תוכנה'.",
  company: "שם החברה או הארגון בו עבדת.",
  jobType: "סוג המשרה: מלאה, חלקית, פרילנס וכדומה.",
  dates: "תאריכי תחילת וסיום העבודה. סמן/י 'עובד/ת כיום' אם זו משרתך הנוכחית.",
  experience: "תאר/י את עיקרי תפקידך, הישגים משמעותיים והכישורים שפיתחת. אל תהסס/י להשתמש במשפטים המוכנים לנוחיותך."
};

// RTL theme with improved Hebrew support
const theme = createTheme({
  direction: "rtl",
  typography: {
    fontFamily: "'Assistant', 'Segoe UI', 'Tahoma', 'Arial', sans-serif",
  },
  components: {
    MuiInputBase: {
      styleOverrides: {
        input: {
          textAlign: "right",
          direction: "rtl",
          fontFamily: "'Assistant', 'Segoe UI', 'Tahoma', 'Arial', sans-serif",
        },
        multiline: {
          textAlign: "right",
          direction: "rtl",
          fontFamily: "'Assistant', 'Segoe UI', 'Tahoma', 'Arial', sans-serif",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          direction: "rtl",
          "& .MuiInputBase-input": {
            textAlign: "right",
            direction: "rtl",
          },
          "& .MuiInputBase-inputMultiline": {
            textAlign: "right",
            direction: "rtl",
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          textAlign: "right",
          direction: "rtl",
        },
        icon: {
          right: 'auto',
          left: '7px',
        }
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          textAlign: "right",
          direction: "rtl",
          justifyContent: "flex-end",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          right: 0,
          left: "auto",
          transformOrigin: "top right",
          textAlign: "right",
          direction: "rtl",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 0px 0px 1px rgba(0, 0, 0, 0.05)',
          borderRadius: '8px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: '#1976d2',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#1565c0',
          },
        },
        outlined: {
          borderColor: 'rgba(25, 118, 210, 0.5)',
          '&:hover': {
            borderColor: '#1976d2',
            backgroundColor: 'rgba(25, 118, 210, 0.04)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        outlined: {
          borderColor: 'rgba(0, 0, 0, 0.12)',
        },
      },
    },
  },
});

const EmploymentExperience: React.FC<EmploymentExperienceProps> = ({ 
  onExperienceListChange,
  initialExperiences = [],
  autoSave = true,
  blockAutoSave = false,
  manualSaveOnly = false
}) => {
  console.log('🏃‍♂️ EmploymentExperience התחיל עם initialExperiences:', initialExperiences);

  const [experienceData, setExperienceData] = useState<ExperienceData>(initialExperienceData);
  const [showForm, setShowForm] = useState(false);
  const [experiences, setExperiences] = useState<ExperienceData[]>([]);
  const [editingIndex, setEditingIndex] = useState(-1);
  
  // מצב עיצוב טקסט
  const [textFormat, setTextFormat] = useState<TextFormat>({
    bold: false,
    italic: false,
    underline: false,
    align: 'right'
  });
  
  // מצב פופ-אפים
  const [helpAnchorEl, setHelpAnchorEl] = useState<null | HTMLElement>(null);
  const [showSuggestionsBox, setShowSuggestionsBox] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  // 🔧 טעינת נתונים קיימים
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const initialDataLoaded = useRef(false);
  const onExperienceListChangeRef = useRef(onExperienceListChange);

  // עדכון ה-ref כאשר הפונקציה משתנה
  useEffect(() => {
    onExperienceListChangeRef.current = onExperienceListChange;
  }, [onExperienceListChange]);

  // 🔥 טעינת נתונים ראשוניים - רק פעם אחת!
  useEffect(() => {
    console.log('🔄 EmploymentExperience useEffect רץ עם initialExperiences:', initialExperiences);
    
    if (!initialDataLoaded.current) {
      if (initialExperiences && initialExperiences.length > 0) {
        console.log('✅ מעדכן רשימת ניסיון עם נתונים ראשוניים:', initialExperiences);
        setExperiences(initialExperiences);
      }
      
      initialDataLoaded.current = true;
      setIsInitialLoad(false);
    }
  }, [initialExperiences]);

  // useEffect לשליחת נתונים לparent - רק אחרי הטעינה הראשונית
  useEffect(() => {
    if (!isInitialLoad && onExperienceListChangeRef.current && !blockAutoSave && autoSave && !manualSaveOnly) {
      console.log('📤 שולח רשימת ניסיון לparent:', experiences);
      onExperienceListChangeRef.current(experiences);
    }
  }, [experiences, isInitialLoad, blockAutoSave, autoSave, manualSaveOnly]);

  const handleMouseOverHelp = (event: React.MouseEvent<HTMLElement>) => {
    setHelpAnchorEl(event.currentTarget);
  };
  
  const handleMouseOutHelp = () => {
    setHelpAnchorEl(null);
  };
  
  // טיפול בחיפוש
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    const matchingProfessions = Object.keys(professionDescriptions).filter(
      profession => profession.includes(query)
    );
    
    if (matchingProfessions.length > 0) {
      const results: SearchResult[] = [];
      
      matchingProfessions.forEach(profession => {
        results.push({
          type: 'category',
          text: profession
        });
        
        professionDescriptions[profession].forEach((description: string) => {
          results.push({
            type: 'description',
            text: description,
            profession: profession
          });
        });
      });
      
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };
  
  // הוספת משפט לטקסט
  const handleDescriptionClick = (text: string) => {
    const newExperience = experienceData.experience 
      ? experienceData.experience + "\n" + text 
      : text;
    handleChange("experience", newExperience);
  };
  
  // פונקציות עיצוב
  const toggleFormat = (format: keyof TextFormat) => {
    if (format === 'align') return; // align is not boolean
    setTextFormat(prev => ({
      ...prev,
      [format]: !prev[format]
    }));
  };
  
  const setAlignment = (alignment: string) => {
    setTextFormat(prev => ({
      ...prev,
      align: alignment
    }));
  };

  const handleChange = (field: keyof ExperienceData, value: any) => {
    const updatedData = { ...experienceData, [field]: value };
    console.log(`📝 שדה ${field} השתנה ל:`, value);
    setExperienceData(updatedData);
  };

  const handleDateChange = (type: "startDate" | "endDate", field: "month" | "year", value: string) => {
    const updatedData = {
      ...experienceData,
      [type]: { ...experienceData[type], [field]: value },
    };
    setExperienceData(updatedData);
  };

  const handleAddExperience = () => {
    let updatedExperiences: ExperienceData[];
    
    // שומר את העיצוב הנוכחי עם הניסיון
    const experienceWithFormatting = {
      ...experienceData,
      formatting: textFormat // שומר את העיצוב
    };
    
    if (editingIndex >= 0) {
      // Update existing experience
      updatedExperiences = [...experiences];
      updatedExperiences[editingIndex] = experienceWithFormatting;
      setEditingIndex(-1);
    } else {
      // Add new experience
      updatedExperiences = [...experiences, experienceWithFormatting];
    }
    
    console.log('💼 הוסף/עדכן ניסיון:', experienceWithFormatting);
    setExperiences(updatedExperiences);
    
    setExperienceData(initialExperienceData);
    setTextFormat({ bold: false, italic: false, underline: false, align: 'right' }); // איפוס העיצוב
    setShowForm(false);
  };

  const handleCancel = () => {
    setExperienceData(initialExperienceData);
    setShowForm(false);
    setEditingIndex(-1);
  };

  const handleDeleteExperience = (index: number) => {
    const updatedExperiences = experiences.filter((_, i) => i !== index);
    console.log('🗑️ מחק ניסיון:', index);
    setExperiences(updatedExperiences);
  };

  const handleEditExperience = (index: number) => {
    const expToEdit = experiences[index];
    console.log('✏️ ערוך ניסיון:', expToEdit);
    setExperienceData(expToEdit);
    
    // שחזר את העיצוב אם קיים
    if (expToEdit.formatting) {
      setTextFormat(expToEdit.formatting);
    }
    
    setEditingIndex(index);
    setShowForm(true);
  };

  const monthOptions = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"];
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 50 }, (_, i) => String(currentYear - i));

  return (
    <ThemeProvider theme={theme}>
      <div dir="rtl" style={{ 
        textAlign: 'right', 
        direction: 'rtl',
        fontFamily: "'Assistant', 'Segoe UI', 'Tahoma', 'Arial', sans-serif"
      }}>
        <div style={{ 
          padding: '0', 
          maxWidth: '1000px', 
          margin: '16px auto',
          background: '#ffffff',
          fontFamily: 'Arial, sans-serif',
          position: 'relative',
          borderRadius: '8px',
          overflow: 'hidden',
          border: '1px solid #d0d0d0',
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            borderBottom: '1px solid #d0d0d0',
            padding: '12px 16px',
            backgroundColor: '#ffffff'
          }}>
            <div></div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>ניסיון תעסוקתי</h2>
            <div 
              title={helpText.main}
              style={{ 
                cursor: 'help',
                position: 'relative',
                display: 'flex',
                alignItems: 'center'
              }}
              onMouseOver={handleMouseOverHelp}
              onMouseOut={handleMouseOutHelp}
            >
              <svg style={{ width: '18px', height: '18px', fill: '#757575' }} viewBox="0 0 24 24">
                <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" />
              </svg>
              <span style={{ fontSize: '14px', color: '#333', fontWeight: 'bold', marginRight: '6px' }}>ניסיון תעסוקתי</span>
              <div 
                id="employment-tooltip"
                style={{
                  display: Boolean(helpAnchorEl) ? 'block' : 'none',
                  position: 'absolute',
                  top: '25px',
                  right: '-10px',
                  width: '200px',
                  backgroundColor: '#626262',
                  color: '#ffffff',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  fontSize: '13px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                  zIndex: 1000,
                  textAlign: 'right',
                  direction: 'rtl'
                }}
              >
                {helpText.main}
              </div>
            </div>
          </div>
          
          <Collapse in={true}>
            <div style={{ padding: '24px' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'right' }}>
                הוסף/י את הניסיון המקצועי שלך מהשנים האחרונות, כאשר התפקיד האחרון יוצג ראשון
              </Typography>

              {experiences.length > 0 && !showForm && (
                <div style={{ marginBottom: '16px' }}>
                  {experiences.map((exp, index) => (
                    <Paper key={index} variant="outlined" sx={{ p: 2, mb: 2, direction: 'rtl' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <IconButton 
                            size="small" 
                            onClick={() => handleDeleteExperience(index)}
                            sx={{ color: '#ef4444' }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            onClick={() => handleEditExperience(index)}
                            sx={{ color: '#3b82f6' }}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                            </svg>
                          </IconButton>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <Typography variant="subtitle1" component="div" sx={{ fontWeight: 500 }}>
                            {exp.position}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {exp.company}
                          </Typography>
                        </div>
                      </div>
                      {exp.experience && (
                        <Typography 
                          variant="body2" 
                          dangerouslySetInnerHTML={{ 
                            __html: exp.experience.replace(/\n/g, '<br/>') 
                          }} 
                          sx={{ 
                            fontSize: '0.875rem',
                            lineHeight: 1.5,
                            color: '#555',
                            textAlign: 'right',
                            direction: 'rtl',
                            whiteSpace: 'pre-wrap'
                          }}
                        />
                      )}
                    </Paper>
                  ))}
                </div>
              )}

              {!showForm ? (
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  startIcon={<AddIcon />}
                  onClick={() => setShowForm(true)}
                  sx={{ 
                    py: 1, 
                    borderRadius: '4px',
                    borderColor: 'rgba(25, 118, 210, 0.5)',
                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                    '&:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.08)',
                      borderColor: '#1976d2'
                    },
                    '&:focus': {
                      outline: 'none'
                    },
                    direction: 'rtl'
                  }}
                >
                  הוסף ניסיון תעסוקתי
                </Button>
              ) : (
                <Paper variant="outlined" sx={{ p: 3, bgcolor: "rgba(0, 0, 0, 0.02)", direction: 'rtl' }}>
                  <Grid container spacing={3} direction="row">
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="הגדרת תפקיד"
                        variant="standard"
                        value={experienceData.position}
                        onChange={(e) => handleChange("position", e.target.value)}
                        InputProps={{
                          sx: { 
                            textAlign: "right", 
                            direction: "rtl",
                            fontFamily: "'Assistant', 'Segoe UI', 'Tahoma', 'Arial', sans-serif"
                          }
                        }}
                        InputLabelProps={{
                          shrink: true,
                          sx: { 
                            right: 0, 
                            left: 'auto', 
                            transformOrigin: 'top right',
                            textAlign: 'right',
                            direction: 'rtl'
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="חברה"
                        variant="standard"
                        value={experienceData.company}
                        onChange={(e) => handleChange("company", e.target.value)}
                        InputProps={{
                          sx: { 
                            textAlign: "right", 
                            direction: "rtl",
                            fontFamily: "'Assistant', 'Segoe UI', 'Tahoma', 'Arial', sans-serif"
                          }
                        }}
                        InputLabelProps={{
                          shrink: true,
                          sx: { 
                            right: 0, 
                            left: 'auto', 
                            transformOrigin: 'top right',
                            textAlign: 'right',
                            direction: 'rtl'
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="מיקום"
                        variant="standard"
                        value={experienceData.location}
                        onChange={(e) => handleChange("location", e.target.value)}
                        InputProps={{
                          sx: { 
                            textAlign: "right", 
                            direction: "rtl",
                            fontFamily: "'Assistant', 'Segoe UI', 'Tahoma', 'Arial', sans-serif"
                          }
                        }}
                        InputLabelProps={{
                          shrink: true,
                          sx: { 
                            right: 0, 
                            left: 'auto', 
                            transformOrigin: 'top right',
                            textAlign: 'right',
                            direction: 'rtl'
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth variant="standard">
                        <InputLabel 
                          id="job-type-label"
                          sx={{ 
                            right: 0, 
                            left: 'auto', 
                            transformOrigin: 'top right',
                            textAlign: 'right',
                            direction: 'rtl'
                          }}
                        >
                          סוג משרה
                        </InputLabel>
                        <Select
                          labelId="job-type-label"
                          value={experienceData.jobType}
                          onChange={(e) => handleChange("jobType", e.target.value)}
                          label="סוג משרה"
                          sx={{ 
                            textAlign: "right", 
                            direction: "rtl",
                            fontFamily: "'Assistant', 'Segoe UI', 'Tahoma', 'Arial', sans-serif"
                          }}
                        >
                          <MenuItem value="" disabled><em>בחר סוג משרה</em></MenuItem>
                          <MenuItem value="משרה מלאה">משרה מלאה</MenuItem>
                          <MenuItem value="משרה חלקית">משרה חלקית</MenuItem>
                          <MenuItem value="פרילנס">פרילנס</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>

                  <div style={{ marginTop: '24px' }}>
                    <Grid container spacing={3} direction="row">
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" gutterBottom sx={{ textAlign: 'right' }}>
                          תאריך התחלה
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <FormControl fullWidth variant="standard">
                              <InputLabel 
                                id="start-month-label"
                                sx={{ 
                                  right: 0, 
                                  left: 'auto', 
                                  transformOrigin: 'top right',
                                  textAlign: 'right',
                                  direction: 'rtl'
                                }}
                              >
                                חודש
                              </InputLabel>
                              <Select
                                labelId="start-month-label"
                                value={experienceData.startDate.month}
                                onChange={(e) => handleDateChange("startDate", "month", e.target.value as string)}
                                label="חודש"
                                sx={{ 
                                  textAlign: "right", 
                                  direction: "rtl",
                                  fontFamily: "'Assistant', 'Segoe UI', 'Tahoma', 'Arial', sans-serif"
                                }}
                              >
                                <MenuItem value="" disabled><em>בחר חודש</em></MenuItem>
                                {monthOptions.map((month) => (
                                  <MenuItem key={`start-${month}`} value={month}>{month}</MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={6}>
                            <FormControl fullWidth variant="standard">
                              <InputLabel 
                                id="start-year-label"
                                sx={{ 
                                  right: 0, 
                                  left: 'auto', 
                                  transformOrigin: 'top right',
                                  textAlign: 'right',
                                  direction: 'rtl'
                                }}
                              >
                                שנה
                              </InputLabel>
                              <Select
                                labelId="start-year-label"
                                value={experienceData.startDate.year}
                                onChange={(e) => handleDateChange("startDate", "year", e.target.value as string)}
                                label="שנה"
                                sx={{ 
                                  textAlign: "right", 
                                  direction: "rtl",
                                  fontFamily: "'Assistant', 'Segoe UI', 'Tahoma', 'Arial', sans-serif"
                                }}
                              >
                                <MenuItem value="" disabled><em>בחר שנה</em></MenuItem>
                                {yearOptions.map((year) => (
                                  <MenuItem key={`start-${year}`} value={year}>{year}</MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" gutterBottom sx={{ textAlign: 'right' }}>
                          תאריך סיום
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <FormControl fullWidth variant="standard">
                              <InputLabel 
                                id="end-month-label"
                                sx={{ 
                                  right: 0, 
                                  left: 'auto', 
                                  transformOrigin: 'top right',
                                  textAlign: 'right',
                                  direction: 'rtl'
                                }}
                              >
                                חודש
                              </InputLabel>
                              <Select
                                labelId="end-month-label"
                                value={experienceData.endDate.month}
                                onChange={(e) => handleDateChange("endDate", "month", e.target.value as string)}
                                label="חודש"
                                disabled={experienceData.currentJob}
                                sx={{ 
                                  textAlign: "right", 
                                  direction: "rtl",
                                  fontFamily: "'Assistant', 'Segoe UI', 'Tahoma', 'Arial', sans-serif"
                                }}
                              >
                                <MenuItem value="" disabled><em>בחר חודש</em></MenuItem>
                                {monthOptions.map((month) => (
                                  <MenuItem key={`end-${month}`} value={month}>{month}</MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={6}>
                            <FormControl fullWidth variant="standard">
                              <InputLabel 
                                id="end-year-label"
                                sx={{ 
                                  right: 0, 
                                  left: 'auto', 
                                  transformOrigin: 'top right',
                                  textAlign: 'right',
                                  direction: 'rtl'
                                }}
                              >
                                  שנה
                                </InputLabel>
                                <Select
                                  labelId="end-year-label"
                                  value={experienceData.endDate.year}
                                  onChange={(e) => handleDateChange("endDate", "year", e.target.value as string)}
                                  label="שנה"
                                  disabled={experienceData.currentJob}
                                  sx={{ 
                                    textAlign: "right", 
                                    direction: "rtl",
                                    fontFamily: "'Assistant', 'Segoe UI', 'Tahoma', 'Arial', sans-serif"
                                  }}
                                >
                                  <MenuItem value="" disabled><em>בחר שנה</em></MenuItem>
                                  {yearOptions.map((year) => (
                                    <MenuItem key={`end-${year}`} value={year}>{year}</MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </div>

                    <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={experienceData.currentJob}
                            onChange={() => handleChange("currentJob", !experienceData.currentJob)}
                          />
                        }
                        label="עובד/ת כיום"
                        sx={{ direction: 'rtl' }}
                      />
                    </div>

                    <div style={{ marginTop: '24px', marginBottom: '24px', position: 'relative' }}>
                      <Paper variant="outlined" sx={{ mb: 1 }}>
                        <div style={{ display: 'flex', borderBottom: '1px solid #e0e0e0' }}>
                          <Button 
                            size="small" 
                            onClick={() => setShowSuggestionsBox(!showSuggestionsBox)}
                            sx={{ 
                              display: 'flex',
                              alignItems: 'center',
                              borderLeft: 1, 
                              borderColor: "divider", 
                              color: "#2196f3",
                              px: 1,
                              py: 0.5,
                              fontSize: '14px',
                              borderRadius: 0,
                              "&:focus": {
                                outline: "none"
                              }
                            }}
                          >
                            <PlusIcon sx={{ fontSize: '16px', ml: 0.5 }} />
                            משפטים מוכנים עבורך
                          </Button>
                          <div style={{ display: 'flex', marginRight: 'auto' }}>
                            <IconButton 
                              size="small" 
                              sx={{ 
                                borderLeft: 1, 
                                borderColor: "divider", 
                                color: textFormat.align === 'justify' ? '#2196f3' : '#666',
                                "&:focus": {
                                  outline: "none"
                                }
                              }}
                              onClick={() => setAlignment('justify')}
                            >
                              <FormatAlignJustifyIcon fontSize="small" />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              sx={{ 
                                borderLeft: 1, 
                                borderColor: "divider", 
                                color: textFormat.align === 'center' ? '#2196f3' : '#666',
                                "&:focus": {
                                  outline: "none"
                                }
                              }} 
                              onClick={() => setAlignment('center')}
                            >
                              <FormatAlignCenterIcon fontSize="small" />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              sx={{ 
                                borderLeft: 1, 
                                borderColor: "divider", 
                                color: textFormat.align === 'right' ? '#2196f3' : '#666',
                                "&:focus": {
                                  outline: "none"
                                }
                              }}
                              onClick={() => setAlignment('right')}
                            >
                              <FormatAlignLeftIcon fontSize="small" style={{ transform: 'scaleX(-1)' }} />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              sx={{ 
                                borderLeft: 1, 
                                borderColor: "divider", 
                                color: textFormat.bold ? '#2196f3' : '#666',
                                "&:focus": {
                                  outline: "none"
                                }
                              }}
                              onClick={() => toggleFormat('bold')}
                            >
                              <FormatBoldIcon fontSize="small" />
                            </IconButton>
                            <IconButton 
                              size="small"
                              sx={{ 
                                borderLeft: 1, 
                                borderColor: "divider", 
                                color: textFormat.underline ? '#2196f3' : '#666',
                                "&:focus": {
                                  outline: "none"
                                }
                              }}
                              onClick={() => toggleFormat('underline')}
                            >
                              <FormatUnderlinedIcon fontSize="small" />
                            </IconButton>
                            <IconButton 
                              size="small"
                              sx={{ 
                                color: textFormat.italic ? '#2196f3' : '#666',
                                "&:focus": {
                                  outline: "none"
                                }
                              }}
                              onClick={() => toggleFormat('italic')}
                            >
                              <FormatItalicIcon fontSize="small" />
                            </IconButton>
                          </div>
                        </div>
                        <TextField
                          multiline
                          fullWidth
                          placeholder="הוסף כאן ניסיון תעסוקתי..."
                          value={experienceData.experience}
                          onChange={(e) => handleChange("experience", e.target.value)}
                          variant="standard"
                          InputProps={{
                            disableUnderline: true,
                            sx: { 
                              p: 2, 
                              minHeight: 100, 
                              textAlign: textFormat.align as React.CSSProperties['textAlign'],
                              fontWeight: textFormat.bold ? 'bold' : 'normal',
                              fontStyle: textFormat.italic ? 'italic' : 'normal',
                              textDecoration: textFormat.underline ? 'underline' : 'none',
                              direction: 'rtl',
                              whiteSpace: 'pre-wrap',
                              '& textarea': {
                                textAlign: textFormat.align as React.CSSProperties['textAlign'],
                                fontWeight: textFormat.bold ? 'bold' : 'normal',
                                fontStyle: textFormat.italic ? 'italic' : 'normal',
                                textDecoration: textFormat.underline ? 'underline' : 'none',
                                whiteSpace: 'pre-wrap',
                              }
                            }
                          }}
                          inputProps={{
                            style: {
                              textAlign: textFormat.align as React.CSSProperties['textAlign'],
                              fontWeight: textFormat.bold ? 'bold' : 'normal',
                              fontStyle: textFormat.italic ? 'italic' : 'normal',
                              textDecoration: textFormat.underline ? 'underline' : 'none',
                              whiteSpace: 'pre-wrap',
                            }
                          }}
                        />
                      </Paper>
                      
                      {/* פופ-אפ למשפטים מוכנים */}
                      {showSuggestionsBox && (
                        <div style={{
                          position: 'fixed',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: '400px',
                          zIndex: 9999,
                          backgroundColor: '#fff',
                          borderRadius: '8px',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                          border: '1px solid #ddd',
                          maxHeight: '80vh',
                          overflowY: 'auto',
                          direction: 'rtl'
                        }}>
                          <div style={{ 
                            padding: '16px 16px 12px',
                            borderBottom: '1px solid #eee',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                            backgroundColor: '#f5f5f5'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <button 
                                onClick={() => setShowSuggestionsBox(false)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  padding: 0,
                                  display: 'flex',
                                  outline: 'none'
                                }}
                              >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="#666">
                                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                                </svg>
                              </button>
                              <span style={{ fontWeight: 'bold', fontSize: '16px' }}>בחר משפטים מוכנים</span>
                            </div>
                            
                            <div style={{ position: 'relative'
                             }}>
                              <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                placeholder="חפש/י משפטים לפי תפקיד"
                                autoFocus
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  borderRadius: '100px',
                                  backgroundColor: '#f3f3f3',
                                  border: 'none',
                                  outline: 'none',
                                  textAlign: 'right',
                                  direction: 'rtl',
                                  fontSize: '14px'
                                }}
                              />
                              <svg 
                                style={{ 
                                  position: 'absolute', 
                                  left: '12px', 
                                  top: '50%', 
                                  transform: 'translateY(-50%)',
                                  width: '16px',
                                  height: '16px',
                                  fill: '#666'
                                }} 
                                viewBox="0 0 24 24"
                              >
                                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                              </svg>
                            </div>
                          </div>
                          
                          <div>
                            {searchResults.length > 0 ? (
                              <div>
                                {searchResults.map((result, index) => {
                                  if (result.type === 'category') {
                                    return (
                                      <div 
                                        key={`category-${index}`}
                                        style={{ 
                                          padding: '12px 16px', 
                                          backgroundColor: '#f9f9f9',
                                          borderBottom: '1px solid #eee',
                                          fontWeight: 'bold',
                                          textAlign: 'right',
                                          direction: 'rtl'
                                        }}
                                      >
                                        {result.text}
                                      </div>
                                    );
                                  } else {
                                    return (
                                      <div
                                        key={`desc-${index}`}
                                        style={{
                                          borderBottom: '1px solid #eee',
                                          cursor: 'pointer',
                                          display: 'flex',
                                          alignItems: 'flex-start',
                                          padding: '12px 16px',
                                          backgroundColor: 'white',
                                          direction: 'rtl'
                                        }}
                                        onMouseOver={(e) => (e.currentTarget as HTMLDivElement).style.backgroundColor = '#f6f6f6'}
                                        onMouseOut={(e) => (e.currentTarget as HTMLDivElement).style.backgroundColor = 'white'}
                                      >
                                        <button
                                          onClick={() => handleDescriptionClick(result.text)}
                                          style={{
                                            backgroundColor: '#4285f4',
                                            color: 'white',
                                            minWidth: '32px',
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: 0,
                                            marginRight: '12px',
                                            border: 'none',
                                            cursor: 'pointer',
                                            outline: 'none'
                                          }}
                                          onMouseOver={(e) => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#3367d6'}
                                          onMouseOut={(e) => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#4285f4'}
                                        >
                                          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                                            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                                          </svg>
                                        </button>
                                        <div style={{ 
                                          textAlign: 'right', 
                                          flex: 1,
                                          fontSize: '14px',
                                          direction: 'rtl'
                                        }}>
                                          {result.text}
                                        </div>
                                      </div>
                                    );
                                  }
                                })}
                              </div>
                            ) : (
                              <div style={{ 
                                padding: '24px 16px', 
                                textAlign: 'center',
                                color: '#666',
                                fontSize: '14px'
                              }}>
                                {searchQuery.trim() !== '' 
                                  ? 'לא נמצאו תוצאות. נסה/י חיפוש אחר' 
                                  : 'הקלד/י תפקיד לחיפוש משפטים מוכנים'}
                              </div>
                            )}
                            
                            {/* משפטים כלליים */}
                            {searchQuery.trim() === '' && (
                              <div>
                                <div 
                                  style={{ 
                                    padding: '12px 16px', 
                                    backgroundColor: '#f9f9f9',
                                    borderBottom: '1px solid #eee',
                                    borderTop: '1px solid #eee',
                                    fontWeight: 'bold',
                                    textAlign: 'right',
                                    direction: 'rtl'
                                  }}
                                >
                                  משפטים כלליים
                                </div>
                                {generalDescriptions.map((desc, index) => (
                                  <div
                                    key={`general-${index}`}
                                    style={{
                                      borderBottom: '1px solid #eee',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'flex-start',
                                      padding: '12px 16px',
                                      backgroundColor: 'white',
                                      direction: 'rtl'
                                    }}
                                    onMouseOver={(e) => (e.currentTarget as HTMLDivElement).style.backgroundColor = '#f6f6f6'}
                                    onMouseOut={(e) => (e.currentTarget as HTMLDivElement).style.backgroundColor = 'white'}
                                  >
                                    <button
                                      onClick={() => handleDescriptionClick(desc)}
                                      style={{
                                        backgroundColor: '#4285f4',
                                        color: 'white',
                                        minWidth: '32px',
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: 0,
                                        marginRight: '12px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        outline: 'none'
                                      }}
                                      onMouseOver={(e) => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#3367d6'}
                                      onMouseOut={(e) => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#4285f4'}
                                    >
                                      <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                                      </svg>
                                    </button>
                                    <div style={{ 
                                      textAlign: 'right', 
                                      flex: 1,
                                      fontSize: '14px',
                                      direction: 'rtl'
                                    }}>
                                      {desc}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between' }}>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleCancel}
                        sx={{
                          '&:focus': {
                            outline: 'none'
                          }
                        }}
                      >
                        ביטול
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddExperience}
                        disabled={!experienceData.position || !experienceData.company}
                        sx={{
                          '&:focus': {
                            outline: 'none'
                          }
                        }}
                      >
                        {editingIndex >= 0 ? 'עדכן' : 'הוסף'} ניסיון תעסוקתי
                      </Button>
                    </div>
                  </Paper>
                )}
              </div>
            </Collapse>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default EmploymentExperience;