import { useState, useEffect, useRef } from "react";
import {
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Collapse,
  IconButton,
  Paper,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Edit as EditIcon
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// RTL theme with proper Hebrew support
const theme = createTheme({
  direction: "rtl",
  typography: {
    fontFamily: "'Assistant', 'Roboto', 'Helvetica', 'Arial', sans-serif",
  },
  components: {
    MuiInputBase: {
      styleOverrides: {
        input: {
          textAlign: "right",
          direction: "rtl",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-input': {
            textAlign: 'right',
            direction: 'rtl',
          },
          '& .MuiInputBase-inputMultiline': {
            textAlign: 'right',
            direction: 'rtl',
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

interface EducationData {
  institution: string;
  field: string;
  startDate: { month: string; year: string };
  endDate: { month: string; year: string };
  currentlyStudying: boolean;
  description: string;
}

interface TestData {
  name: string;
  score: string;
}

const initialEducationData: EducationData = {
  institution: "",
  field: "",
  startDate: { month: "", year: "" },
  endDate: { month: "", year: "" },
  currentlyStudying: false,
  description: ""
};

const initialTestData: TestData = {
  name: "",
  score: ""
};

// עזרה והסברים על השדות
const helpText = {
  main: "הוסף את השכלתך הפורמלית והלא פורמלית. תארים אקדמיים, הכשרות מקצועיות ותעודות נוספות.",
  institution: "שם המוסד האקדמי או הלימודי שבו למדת.",
  field: "תחום הלימודים או שם התואר/תעודה שקיבלת.",
  dates: "תאריכי תחילת וסיום הלימודים. סמן 'לומד/ת כיום' אם עדיין לומד/ת במוסד זה.",
  description: "פרט/י על הלימודים, הישגים מיוחדים, ממוצע ציונים או פרויקטים בולטים.",
  tests: "הוסף/י מבחני מיון שביצעת כגון פסיכומטרי, GMAT, TOEFL או בחינות הסמכה מקצועיות."
};

const monthOptions = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"];
const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 50 }, (_, i) => String(currentYear - i));

export default function EducationAndTestSection({
  onEducationUpdate,
  onTestUpdate,
  initialEducation = [],
  initialTests = [],
  autoSave = true,
  blockAutoSave = false,
  manualSaveOnly = false
}: {
  onEducationUpdate?: (educationList: EducationData[]) => void;
  onTestUpdate?: (testList: TestData[]) => void;
  initialEducation?: EducationData[];
  initialTests?: TestData[];
  autoSave?: boolean;
  blockAutoSave?: boolean;
  manualSaveOnly?: boolean;
}) {
  console.log('🏃‍♂️ EducationAndTestSection התחיל עם:', { initialEducation, initialTests });

  const [educationData, setEducationData] = useState<EducationData>(initialEducationData);
  const [testData, setTestData] = useState<TestData>(initialTestData);
  
  const [educationList, setEducationList] = useState<EducationData[]>([]);
  const [testList, setTestList] = useState<TestData[]>([]);
  
  const [isEducationExpanded] = useState(true);
  const [isTestExpanded] = useState(true);
  
  const [showEducationForm, setShowEducationForm] = useState(false);
  const [showTestForm, setShowTestForm] = useState(false);
  
  const [editingEduIndex, setEditingEduIndex] = useState(-1);
  const [editingTestIndex, setEditingTestIndex] = useState(-1);

  // 🔧 טעינת נתונים קיימים
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const initialDataLoaded = useRef(false);
  const onEducationUpdateRef = useRef(onEducationUpdate);
  const onTestUpdateRef = useRef(onTestUpdate);

  // עדכון ה-refs כאשר הפונקציות משתנות
  useEffect(() => {
    onEducationUpdateRef.current = onEducationUpdate;
    onTestUpdateRef.current = onTestUpdate;
  }, [onEducationUpdate, onTestUpdate]);

  // 🔥 טעינת נתונים ראשוניים - רק פעם אחת!
  useEffect(() => {
    console.log('🔄 EducationAndTestSection useEffect רץ עם:', { initialEducation, initialTests });
    
    if (!initialDataLoaded.current) {
      if (initialEducation && initialEducation.length > 0) {
        console.log('✅ מעדכן רשימת השכלה עם נתונים ראשוניים:', initialEducation);
        setEducationList(initialEducation);
      }
      
      if (initialTests && initialTests.length > 0) {
        console.log('✅ מעדכן רשימת מבחנים עם נתונים ראשוניים:', initialTests);
        setTestList(initialTests);
      }
      
      initialDataLoaded.current = true;
      setIsInitialLoad(false);
    }
  }, [initialEducation, initialTests]);

  // useEffect לשליחת נתונים לparent - רק אחרי הטעינה הראשונית
  useEffect(() => {
    if (!isInitialLoad && onEducationUpdateRef.current && !blockAutoSave && autoSave && !manualSaveOnly) {
      console.log('📤 שולח רשימת השכלה לparent:', educationList);
      onEducationUpdateRef.current(educationList);
    }
  }, [educationList, isInitialLoad, blockAutoSave, autoSave, manualSaveOnly]);

  useEffect(() => {
    if (!isInitialLoad && onTestUpdateRef.current && !blockAutoSave && autoSave && !manualSaveOnly) {
      console.log('📤 שולח רשימת מבחנים לparent:', testList);
      onTestUpdateRef.current(testList);
    }
  }, [testList, isInitialLoad, blockAutoSave, autoSave, manualSaveOnly]);

  const handleEducationChange = (field: keyof EducationData, value: any) => {
    console.log(`📝 השכלה - שדה ${field} השתנה ל:`, value);
    setEducationData({ ...educationData, [field]: value });
  };

  const handleTestChange = (field: keyof TestData, value: any) => {
    console.log(`📝 מבחן - שדה ${field} השתנה ל:`, value);
    setTestData({ ...testData, [field]: value });
  };
  
  const handleDateChange = (type: "startDate" | "endDate", field: "month" | "year", value: string) => {
    const updatedData = {
      ...educationData,
      [type]: { ...educationData[type], [field]: value },
    };
    setEducationData(updatedData);
  };

  const handleAddEducation = () => {
    let updatedEducationList;
    
    if (editingEduIndex >= 0) {
      // Update existing education
      updatedEducationList = [...educationList];
      updatedEducationList[editingEduIndex] = educationData;
      setEditingEduIndex(-1);
      console.log('📚 עדכן השכלה:', educationData);
    } else {
      // Add new education
      updatedEducationList = [...educationList, educationData];
      console.log('📚 הוסף השכלה:', educationData);
    }
    
    setEducationList(updatedEducationList);
    setEducationData(initialEducationData);
    setShowEducationForm(false);
  };

  const handleAddTest = () => {
    let updatedTestList;
    
    if (editingTestIndex >= 0) {
      // Update existing test
      updatedTestList = [...testList];
      updatedTestList[editingTestIndex] = testData;
      setEditingTestIndex(-1);
      console.log('📊 עדכן מבחן:', testData);
    } else {
      // Add new test
      updatedTestList = [...testList, testData];
      console.log('📊 הוסף מבחן:', testData);
    }
    
    setTestList(updatedTestList);
    setTestData(initialTestData);
    setShowTestForm(false);
  };

  const handleDeleteEducation = (index: number) => {
    const updatedList = educationList.filter((_, i) => i !== index);
    console.log('🗑️ מחק השכלה:', index);
    setEducationList(updatedList);
  };

  const handleDeleteTest = (index: number) => {
    const updatedList = testList.filter((_, i) => i !== index);
    console.log('🗑️ מחק מבחן:', index);
    setTestList(updatedList);
  };
  
  const handleEditEducation = (index: number) => {
    const eduToEdit = educationList[index];
    console.log('✏️ ערוך השכלה:', eduToEdit);
    setEducationData(eduToEdit);
    setEditingEduIndex(index);
    setShowEducationForm(true);
  };
  
  const handleEditTest = (index: number) => {
    const testToEdit = testList[index];
    console.log('✏️ ערוך מבחן:', testToEdit);
    setTestData(testToEdit);
    setEditingTestIndex(index);
    setShowTestForm(true);
  };
  
  const handleCancelEducation = () => {
    setEducationData(initialEducationData);
    setShowEducationForm(false);
    setEditingEduIndex(-1);
  };
  
  const handleCancelTest = () => {
    setTestData(initialTestData);
    setShowTestForm(false);
    setEditingTestIndex(-1);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box dir="rtl" sx={{ fontFamily: "'Assistant', 'Roboto', 'Helvetica', 'Arial', sans-serif" }}>
        {/* השכלה */}
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
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>השכלה</h2>
            <div 
              title={helpText.main}
              style={{ 
                cursor: 'help',
                position: 'relative',
                display: 'flex',
                alignItems: 'center'
              }}
              onMouseOver={() => {
                const tooltip = document.getElementById('education-tooltip');
                if (tooltip) tooltip.style.display = 'block';
              }}
              onMouseOut={() => {
                const tooltip = document.getElementById('education-tooltip');
                if (tooltip) tooltip.style.display = 'none';
              }}
            >
              <svg style={{ width: '18px', height: '18px', fill: '#757575' }} viewBox="0 0 24 24">
                <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" />
              </svg>
              <span style={{ fontSize: '14px', color: '#333', fontWeight: 'bold', marginRight: '6px' }}>השכלה</span>
              <div 
                id="education-tooltip"
                style={{
                  display: 'none',
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
          
          <Collapse in={isEducationExpanded}>
            <div style={{ padding: '24px' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'right' }}>
                במידה וקיימת השכלה רלוונטית, ניתן לציין אותה בצירוף השיוך הלימודי
              </Typography>

              {educationList.length > 0 && !showEducationForm && (
                <Box>
                  {educationList.map((edu, index) => (
                    <Paper 
                      key={index}
                      variant="outlined" 
                      sx={{ p: 2, mb: 2 }}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Box display="flex">
                          <IconButton size="small" onClick={() => handleDeleteEducation(index)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleEditEducation(index)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Box>
                        <Box textAlign="right">
                          <Typography variant="subtitle1" component="div" sx={{ fontWeight: 500 }}>
                            {edu.institution} - {edu.field}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {edu.startDate.month} {edu.startDate.year} - {edu.currentlyStudying ? 'לומד/ת כיום' : `${edu.endDate.month} ${edu.endDate.year}`}
                          </Typography>
                        </Box>
                      </Box>
                      {edu.description && (
                        <Typography 
                          variant="body2" 
                          dangerouslySetInnerHTML={{ 
                            __html: edu.description.replace(/\n/g, '<br/>') 
                          }} 
                          align="right"
                          sx={{ 
                            fontSize: '0.875rem',
                            lineHeight: 1.5,
                            color: '#555',
                            whiteSpace: 'pre-wrap'
                          }}
                        />
                      )}
                    </Paper>
                  ))}
                </Box>
              )}

              {!showEducationForm ? (
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  startIcon={<AddIcon />}
                  onClick={() => setShowEducationForm(true)}
                  sx={{ 
                    py: 1,
                    textAlign: "right", 
                    direction: "rtl", 
                    borderRadius: '4px',
                    borderColor: 'rgba(25, 118, 210, 0.5)',
                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                    '&:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.08)',
                      borderColor: '#1976d2'
                    }
                  }}
                >
                  הוסף השכלה
                </Button>
              ) : (
                <Paper variant="outlined" sx={{ p: 3, bgcolor: "rgba(0, 0, 0, 0.02)" }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="מוסד לימודים"
                        variant="standard"
                        value={educationData.institution}
                        onChange={(e) => handleEducationChange("institution", e.target.value)}
                        sx={{
                          '& .MuiInputBase-input': {
                            textAlign: 'right',
                            direction: 'rtl',
                          }
                        }}
                        InputLabelProps={{
                          shrink: true
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="תואר"
                        variant="standard"
                        value={educationData.field}
                        onChange={(e) => handleEducationChange("field", e.target.value)}
                        sx={{
                          '& .MuiInputBase-input': {
                            textAlign: 'right',
                            direction: 'rtl',
                          }
                        }}
                        InputLabelProps={{
                          shrink: true
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Box mt={3}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" gutterBottom sx={{ textAlign: 'right' }}>
                          תאריך התחלה
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <FormControl fullWidth variant="standard">
                              <InputLabel id="start-month-label">חודש</InputLabel>
                              <Select
                                labelId="start-month-label"
                                value={educationData.startDate.month}
                                onChange={(e) => handleDateChange("startDate", "month", e.target.value as string)}
                                label="חודש"
                                sx={{
                                  '& .MuiSelect-select': {
                                    textAlign: 'right',
                                    direction: 'rtl',
                                  }
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
                              <InputLabel id="start-year-label">שנה</InputLabel>
                              <Select
                                labelId="start-year-label"
                                value={educationData.startDate.year}
                                onChange={(e) => handleDateChange("startDate", "year", e.target.value as string)}
                                label="שנה"
                                sx={{
                                  '& .MuiSelect-select': {
                                    textAlign: 'right',
                                    direction: 'rtl',
                                  }
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
                              <InputLabel id="end-month-label">חודש</InputLabel>
                              <Select
                                labelId="end-month-label"
                                value={educationData.endDate.month}
                                onChange={(e) => handleDateChange("endDate", "month", e.target.value as string)}
                                label="חודש"
                                disabled={educationData.currentlyStudying}
                                sx={{
                                  '& .MuiSelect-select': {
                                    textAlign: 'right',
                                    direction: 'rtl',
                                  }
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
                              <InputLabel id="end-year-label">שנה</InputLabel>
                              <Select
                                labelId="end-year-label"
                                value={educationData.endDate.year}
                                onChange={(e) => handleDateChange("endDate", "year", e.target.value as string)}
                                label="שנה"
                                disabled={educationData.currentlyStudying}
                                sx={{
                                  '& .MuiSelect-select': {
                                    textAlign: 'right',
                                    direction: 'rtl',
                                  }
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
                  </Box>

                  <Box mt={2} display="flex" justifyContent="flex-end">
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={educationData.currentlyStudying}
                          onChange={() => handleEducationChange("currentlyStudying", !educationData.currentlyStudying)}
                        />
                      }
                      label="לומד/ת כיום"
                    />
                  </Box>
                  
                  <Box mt={3}>
                    <TextField
                      fullWidth
                      label="פירוט והישגים"
                      multiline
                      rows={3}
                      variant="outlined"
                      placeholder="הסבר לגבי מחקר אקדמי, פרויקטים, הישגים יוצאי דופן..."
                      value={educationData.description}
                      onChange={(e) => handleEducationChange("description", e.target.value)}
                      sx={{
                        '& .MuiInputBase-input': {
                          textAlign: 'right',
                          direction: 'rtl',
                          whiteSpace: 'pre-wrap'
                        },
                        '& .MuiInputBase-inputMultiline': {
                          textAlign: 'right',
                          direction: 'rtl',
                          whiteSpace: 'pre-wrap'
                        }
                      }}
                      InputLabelProps={{
                        shrink: true
                      }}
                      inputProps={{
                        style: {
                          whiteSpace: 'pre-wrap'
                        }
                      }}
                    />
                  </Box>

                  <Box mt={3} display="flex" justifyContent="space-between">
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={handleCancelEducation}
                    >
                      ביטול
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAddEducation}
                      disabled={!educationData.institution || !educationData.field}
                    >
                      {editingEduIndex >= 0 ? 'עדכן' : 'הוסף'} השכלה
                    </Button>
                  </Box>
                </Paper>
              )}
            </div>
          </Collapse>
        </div>

        {/* מבחנים */}
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
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>מבחנים</h2>
            <div 
              title={helpText.tests}
              style={{ 
                cursor: 'help',
                position: 'relative',
                display: 'flex',
                alignItems: 'center'
              }}
              onMouseOver={() => {
                const tooltip = document.getElementById('tests-tooltip');
                if (tooltip) tooltip.style.display = 'block';
              }}
              onMouseOut={() => {
                const tooltip = document.getElementById('tests-tooltip');
                if (tooltip) tooltip.style.display = 'none';
              }}
            >
              <svg style={{ width: '18px', height: '18px', fill: '#757575' }} viewBox="0 0 24 24">
                <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" />
              </svg>
              <span style={{ fontSize: '14px', color: '#333', fontWeight: 'bold', marginRight: '6px' }}>מבחנים</span>
              <div 
                id="tests-tooltip"
                style={{
                  display: 'none',
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
                {helpText.tests}
              </div>
            </div>
          </div>
          
          <Collapse in={isTestExpanded}>
            <div style={{ padding: '24px' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'right' }}>
                הוסף מבחני מיון שביצעת כגון פסיכומטרי, GMAT, TOEFL או בחינות הסמכה מקצועיות
              </Typography>

              {testList.length > 0 && !showTestForm && (
                <Box>
                  {testList.map((test, index) => (
                    <Paper 
                      key={index}
                      variant="outlined" 
                      sx={{ p: 2, mb: 2 }}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex">
                          <IconButton size="small" onClick={() => handleDeleteTest(index)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleEditTest(index)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Box>
                        <Box textAlign="right">
                          <Typography variant="subtitle1" component="div" sx={{ fontWeight: 500 }}>
                            {test.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            ציון: {test.score}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              )}

              {!showTestForm ? (
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  startIcon={<AddIcon />}
                  onClick={() => setShowTestForm(true)}
                  sx={{ 
                    py: 1, 
                    borderRadius: '4px',
                    borderColor: 'rgba(25, 118, 210, 0.5)',
                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                    '&:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.08)',
                      borderColor: '#1976d2'
                    }
                  }}
                >
                  הוסף מבחן
                </Button>
              ) : (
                <Paper variant="outlined" sx={{ p: 3, bgcolor: "rgba(0, 0, 0, 0.02)" }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="שם המבחן"
                        variant="standard"
                        value={testData.name}
                        onChange={(e) => handleTestChange("name", e.target.value)}
                        sx={{
                          '& .MuiInputBase-input': {
                            textAlign: 'right',
                            direction: 'rtl',
                          }
                        }}
                        InputLabelProps={{
                          shrink: true
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="ציון"
                        variant="standard"
                        value={testData.score}
                        onChange={(e) => handleTestChange("score", e.target.value)}
                        sx={{
                          '& .MuiInputBase-input': {
                            textAlign: 'right',
                            direction: 'rtl',
                          }
                        }}
                        InputLabelProps={{
                          shrink: true
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Box mt={3} display="flex" justifyContent="space-between">
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={handleCancelTest}
                    >
                      ביטול
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAddTest}
                      disabled={!testData.name || !testData.score}
                    >
                      {editingTestIndex >= 0 ? 'עדכן' : 'הוסף'} מבחן
                    </Button>
                  </Box>
                </Paper>
              )}
            </div>
          </Collapse>
        </div>
      </Box>
    </ThemeProvider>
  );
}