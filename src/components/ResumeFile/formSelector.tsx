import React, { useState, useEffect, useRef } from "react"
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
  Collapse,
  Fade,
  Grow,
  Chip,
  Tooltip,
  useTheme,
} from "@mui/material"

// Icons
import SchoolIcon from "@mui/icons-material/School"
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech"
import MenuBookIcon from "@mui/icons-material/MenuBook"
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism"
import LinkIcon from "@mui/icons-material/Link"
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions"
import RecommendIcon from "@mui/icons-material/Recommend"
import FormatQuoteIcon from "@mui/icons-material/FormatQuote"
import DeleteIcon from "@mui/icons-material/Delete"
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"

// הגדרת טיפוסים
interface FormSelectorProps {
  onFormDataChange: (formType: string, data: string[][]) => void;
  initialData?: Record<string, string[][]>;
  autoSave?: boolean;
  blockAutoSave?: boolean;
  manualSaveOnly?: boolean;
}

interface FormButton {
  key: string;
  label: string;
  icon: React.ReactElement;
}

interface FormContentProps {
  formType: string;
  initialData: string[][];
  onDataChange: (formType: string, data: string[][]) => void;
}

interface DynamicFormProps {
  title: string;
  fields: string[];
  formType: string;
  initialData: string[][];
  onDataChange: (formType: string, data: string[][]) => void;
}

export default function FormSelector({
  onFormDataChange,
  initialData = {},
  autoSave = true,
  blockAutoSave = false,
  manualSaveOnly = false
}: FormSelectorProps) {
  console.log('🏃‍♂️ FormSelector התחיל עם initialData:', initialData);

  const [formValues, setFormValues] = useState<Record<string, string[][]>>({})
  const [activeForm, setActiveForm] = useState<string | null>(null)
  const [allFormData, setAllFormData] = useState<Record<string, string[][]>>({})
  const [formCounts, setFormCounts] = useState<Record<string, number>>({})
  const theme = useTheme()

  // 🔧 טעינת נתונים קיימים
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const initialDataLoaded = useRef(false);
  const onFormDataChangeRef = useRef(onFormDataChange);

  // עדכון ה-ref כאשר הפונקציה משתנה
  useEffect(() => {
    onFormDataChangeRef.current = onFormDataChange;
  }, [onFormDataChange]);

  // 🔥 טעינת נתונים ראשוניים - רק פעם אחת!
  useEffect(() => {
    console.log('🔄 FormSelector useEffect רץ עם initialData:', initialData);
    
    if (!initialDataLoaded.current) {
      if (initialData && Object.keys(initialData).length > 0) {
        console.log('✅ מעדכן נתונים נוספים עם נתונים ראשוניים:', initialData);
        setFormValues(initialData);
        setAllFormData(initialData);
        
        // עדכון מונים
        const counts: Record<string, number> = {};
        Object.entries(initialData).forEach(([key, data]) => {
          counts[key] = data ? data.length : 0;
        });
        setFormCounts(counts);
      }
      
      initialDataLoaded.current = true;
      setIsInitialLoad(false);
    }
  }, [initialData]);

  const handleFormChange = (formType: string, data: string[][]) => {
    const existing = formValues[formType] || []

    // איחוד עם סינון כפילויות
    const merged = [...existing, ...data].filter(
      (item, index, self) => index === self.findIndex((other) => JSON.stringify(other) === JSON.stringify(item)),
    )

    const updated = { ...formValues, [formType]: merged }
    console.log(`📝 ${formType} השתנה ל:`, merged);
    
    setFormValues(updated)
    setAllFormData(updated)
    
    // שליחה לparent רק אם לא חסום
    if (!isInitialLoad && onFormDataChangeRef.current && !blockAutoSave && autoSave && !manualSaveOnly) {
      console.log(`📤 שולח ${formType} לparent:`, merged);
      onFormDataChangeRef.current(formType, merged);
    }

    // Update counts
    setFormCounts((prev) => ({
      ...prev,
      [formType]: merged.length,
    }))
  }

  const handleButtonClick = (form: string) => {
    setActiveForm((prev) => (prev === form ? null : form))
  }

  const formButtons: FormButton[] = [
    { key: "Shafot", label: "שפות", icon: <SchoolIcon /> },
    { key: "SherutTzvaee", label: "שירות צבאי", icon: <MilitaryTechIcon /> },
    { key: "Korsim", label: "קורסים", icon: <MenuBookIcon /> },
    { key: "Etandvuyot", label: "התנדבויות", icon: <VolunteerActivismIcon /> },
    { key: "Kishurim", label: "קישורים", icon: <LinkIcon /> },
    { key: "Tahbivim", label: "תחביבים", icon: <EmojiEmotionsIcon /> },
    { key: "Mamlitsim", label: "ממליצים", icon: <RecommendIcon /> },
    { key: "Motamishit", label: "מוטיבציה אישית", icon: <FormatQuoteIcon /> },
  ]

  return (
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
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>פרטים נוספים</h2>
        <div 
          title="הוסף פרטים נוספים כמו שפות, שירות צבאי, קורסים והתנדבויות"
          style={{ 
            cursor: 'help',
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}
          onMouseOver={() => {
            const tooltip = document.getElementById('form-selector-tooltip');
            if (tooltip) tooltip.style.display = 'block';
          }}
          onMouseOut={() => {
            const tooltip = document.getElementById('form-selector-tooltip');
            if (tooltip) tooltip.style.display = 'none';
          }}
        >
          <svg style={{ width: '18px', height: '18px', fill: '#757575' }} viewBox="0 0 24 24">
            <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" />
          </svg>
          <span style={{ fontSize: '14px', color: '#333', fontWeight: 'bold', marginRight: '6px' }}>פרטים נוספים</span>
          <div 
            id="form-selector-tooltip"
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
            הוסף פרטים נוספים כמו שפות, שירות צבאי, קורסים והתנדבויות
          </div>
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            fontWeight: 600,
            textAlign: "right",
            mb: 2,
            color: theme.palette.primary.main,
            fontSize: '16px'
          }}
        >
          בחר קטגוריה להוספת פרטים
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={2}>
          {formButtons.map(({ key, label, icon }) => {
            const count = formCounts[key] || 0
            return (
              <Grid item xs={12} sm={6} md={4} key={key}>
                <Box
                  sx={{
                    transition: "transform 0.2s ease",
                    "&:hover": {
                      transform: "scale(1.02)",
                    },
                    "&:active": {
                      transform: "scale(0.98)",
                    },
                  }}
                >
                  <Button
                    fullWidth
                    variant={activeForm === key ? "contained" : "outlined"}
                    color="primary"
                    startIcon={icon}
                    onClick={() => handleButtonClick(key)}
                    sx={{
                      p: 1.5,
                      justifyContent: "flex-start",
                      borderRadius: 2,
                      position: "relative",
                      overflow: "hidden",
                      transition: "all 0.2s ease",
                      boxShadow: activeForm === key ? 3 : 0,
                      "&:hover": {
                        boxShadow: 2,
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                      {label}
                      {count > 0 && (
                        <Chip
                          size="small"
                          label={count}
                          color="primary"
                          sx={{
                            ml: 1,
                            fontWeight: "bold",
                            backgroundColor: theme.palette.primary.light,
                          }}
                        />
                      )}
                    </Box>
                  </Button>
                </Box>
              </Grid>
            )
          })}
        </Grid>

        <Collapse in={activeForm !== null}>
          <Box sx={{ mt: 4 }}>
            {activeForm && (
              <Fade in={true}>
                <div>
                  <FormContent
                    formType={activeForm}
                    initialData={allFormData[activeForm] || []}
                    onDataChange={handleFormChange}
                  />
                </div>
              </Fade>
            )}
          </Box>
        </Collapse>
      </div>
    </div>
  )
}

// ----------- קומפוננטה להצגת טופס בהתאם לסוג -----------

const FormContent: React.FC<FormContentProps> = ({
  formType,
  initialData,
  onDataChange,
}) => {
  const formFields: Record<string, string[]> = {
    Shafot: ["שם השפה", "רמת השפה"],
    SherutTzvaee: ["יחידה", "תפקיד"],
    Korsim: ["שם הקורס", "מוסד לימוד", "שנה"],
    Etandvuyot: ["שם הארגון", "תפקיד", "שנה"],
    Kishurim: ["כותרת קישור", "כתובת קישור"],
    Tahbivim: ["שם התחביב"],
    Mamlitsim: ["שם", "תפקיד", "אימייל", "טלפון"],
    Motamishit: ["כותרת", "תוכן"],
  }

  if (!formFields[formType]) return null

  const formTitles: Record<string, string> = {
    Shafot: "שפות",
    SherutTzvaee: "שירות צבאי",
    Korsim: "קורסים",
    Etandvuyot: "התנדבויות",
    Kishurim: "קישורים",
    Tahbivim: "תחביבים",
    Mamlitsim: "ממליצים",
    Motamishit: "מוטיבציה אישית",
  }

  const formTitle = formTitles[formType] || formType

  return (
    <DynamicForm
      title={`הוסף ${formTitle}`}
      fields={formFields[formType]}
      formType={formType}
      initialData={initialData}
      onDataChange={onDataChange}
    />
  )
}

// ----------- קומפוננטה של טופס דינמי -----------

const DynamicForm: React.FC<DynamicFormProps> = ({
  title,
  fields,
  formType,
  initialData,
  onDataChange,
}) => {
  const [entries, setEntries] = useState<string[][]>(initialData.length > 0 ? initialData : [fields.map(() => "")])
  const [successMessage, setSuccessMessage] = useState<boolean>(false)
  const theme = useTheme()

  // 🔧 עדכון entries כאשר initialData משתנה
  useEffect(() => {
    if (initialData.length > 0) {
      console.log(`🔄 DynamicForm ${formType} עודכן עם initialData:`, initialData);
      setEntries(initialData);
    }
  }, [initialData, formType]);

  const updateEntries = (newEntries: string[][]) => {
    console.log(`📝 DynamicForm ${formType} - עדכון entries:`, newEntries);
    setEntries(newEntries)
    onDataChange(formType, newEntries)
  }

  const handleChange = (index: number, fieldIndex: number, value: string) => {
    const updated = [...entries]
    updated[index][fieldIndex] = value
    updateEntries(updated)
  }

  const handleAdd = () => {
    updateEntries([...entries, fields.map(() => "")])
  }

  const handleRemove = (index: number) => {
    updateEntries(entries.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    // Filter out empty entries
    const filteredEntries = entries.filter((entry) => entry.some((field) => field.trim() !== ""))

    if (filteredEntries.length > 0) {
      updateEntries(filteredEntries)
      setSuccessMessage(true)

      setTimeout(() => {
        setSuccessMessage(false)
      }, 3000)
    }
  }

  const isEntryEmpty = (entry: string[]) => {
    return entry.every((field) => field.trim() === "")
  }

  return (
    <Paper
      sx={{
        p: 3,
        mt: 2,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        position: "relative",
      }}
      elevation={2}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
          {title}
        </Typography>

        <Fade in={successMessage}>
          <Chip
            icon={<CheckCircleIcon />}
            label="נשמר בהצלחה"
            color="success"
            variant="outlined"
            sx={{ fontWeight: "medium" }}
          />
        </Fade>
      </Box>

      {entries.map((entry, idx) => (
        <Grow key={idx} in={true} style={{ transformOrigin: "0 0 0" }} timeout={300 + idx * 100}>
          <Paper
            sx={{
              mb: 3,
              p: 3,
              borderRadius: 2,
              border: "1px solid",
              borderColor: isEntryEmpty(entry) ? theme.palette.divider : theme.palette.primary.light,
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              },
            }}
            elevation={1}
          >
            <Grid container spacing={2}>
              {entry.map((val, i) => (
                <Grid item xs={12} md={fields.length > 2 ? 6 : 12} key={i}>
                  <TextField
                    fullWidth
                    label={fields[i]}
                    value={val}
                    onChange={(e) => handleChange(idx, i, e.target.value)}
                    variant="outlined"
                    sx={{
                      mb: 1,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                    InputProps={{
                      sx: { direction: "rtl" },
                    }}
                    InputLabelProps={{
                      sx: {
                        direction: "rtl",
                        right: 14,
                        left: "auto",
                      },
                    }}
                  />
                </Grid>
              ))}
            </Grid>

            <Box textAlign="left" sx={{ mt: 1 }}>
              <Tooltip title="מחק">
                <IconButton
                  onClick={() => handleRemove(idx)}
                  color="error"
                  sx={{
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "rgba(211, 47, 47, 0.1)",
                    },
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Paper>
        </Grow>
      ))}

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button
          variant="outlined"
          onClick={handleAdd}
          startIcon={<AddCircleOutlineIcon />}
          sx={{
            borderRadius: 2,
            px: 3,
          }}
        >
          הוסף {title.replace("הוסף ", "")}
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{
            borderRadius: 2,
            px: 4,
          }}
        >
          שמור
        </Button>
      </Box>
    </Paper>
  )
}