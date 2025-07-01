import React, { useState, useEffect, useRef } from 'react';

// הגדרת טיפוסים
interface Skill {
  name: string;
  level: string;
}

interface LevelOption {
  value: string;
  label: string;
}

interface SkillSectionProps {
  onSkillsChange: (skills: Skill[]) => void;
  initialSkills?: Skill[];
  autoSave?: boolean;
  blockAutoSave?: boolean;
  manualSaveOnly?: boolean;
}

const SkillSection: React.FC<SkillSectionProps> = ({ 
  onSkillsChange, 
  initialSkills = [],
  autoSave = true,
  blockAutoSave = false,
  manualSaveOnly = false
}) => {
  console.log('🏃‍♂️ SkillSection התחיל עם initialSkills:', initialSkills);

  const [skills, setSkills] = useState<Skill[]>([]);
  const [currentSkill, setCurrentSkill] = useState<Skill>({ name: '', level: '' });
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);

  // 🔧 טעינת נתונים קיימים
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const initialDataLoaded = useRef(false);
  const onSkillsChangeRef = useRef(onSkillsChange);

  // עדכון ה-ref כאשר הפונקציה משתנה
  useEffect(() => {
    onSkillsChangeRef.current = onSkillsChange;
  }, [onSkillsChange]);

  // 🔥 טעינת נתונים ראשוניים - רק פעם אחת!
  useEffect(() => {
    console.log('🔄 SkillSection useEffect רץ עם initialSkills:', initialSkills);
    
    if (!initialDataLoaded.current) {
      if (initialSkills && initialSkills.length > 0) {
        console.log('✅ מעדכן רשימת מיומנויות עם נתונים ראשוניים:', initialSkills);
        setSkills(initialSkills);
      }
      
      initialDataLoaded.current = true;
      setIsInitialLoad(false);
    }
  }, [initialSkills]);

  // useEffect לשליחת נתונים לparent - רק אחרי הטעינה הראשונית
  useEffect(() => {
    if (!isInitialLoad && onSkillsChangeRef.current && !blockAutoSave && autoSave && !manualSaveOnly) {
      console.log('📤 שולח רשימת מיומנויות לparent:', skills);
      onSkillsChangeRef.current(skills);
    }
  }, [skills, isInitialLoad, blockAutoSave, autoSave, manualSaveOnly]);

  const handleInputChange = (field: keyof Skill, value: string) => {
    console.log(`📝 מיומנות - שדה ${field} השתנה ל:`, value);
    setCurrentSkill(prev => ({ ...prev, [field]: value }));
  };

  const handleAddSkill = () => {
    if (!currentSkill.name.trim()) return;

    let updatedSkills: Skill[];
    if (editingIndex >= 0) {
      // עדכון מיומנות קיימת
      updatedSkills = [...skills];
      updatedSkills[editingIndex] = currentSkill;
      setEditingIndex(-1);
      console.log('🛠️ עדכן מיומנות:', currentSkill);
    } else {
      // הוספת מיומנות חדשה
      updatedSkills = [...skills, currentSkill];
      console.log('🛠️ הוסף מיומנות:', currentSkill);
    }

    setSkills(updatedSkills);
    setCurrentSkill({ name: '', level: '' });
    setShowForm(false);
  };

  const handleEditSkill = (index: number) => {
    const skillToEdit = skills[index];
    console.log('✏️ ערוך מיומנות:', skillToEdit);
    setCurrentSkill(skillToEdit);
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleDeleteSkill = (index: number) => {
    const updatedSkills = skills.filter((_, i) => i !== index);
    console.log('🗑️ מחק מיומנות:', index);
    setSkills(updatedSkills);
  };

  const handleCancel = () => {
    setCurrentSkill({ name: '', level: '' });
    setShowForm(false);
    setEditingIndex(-1);
  };

  const levelOptions: LevelOption[] = [
    { value: 'גבוהה', label: 'גבוהה' },
    { value: 'בינונית', label: 'בינונית' },
    { value: 'נמוכה', label: 'נמוכה' },
    { value: 'מתחיל', label: 'מתחיל' },
    { value: 'מתקדם', label: 'מתקדם' },
    { value: 'מומחה', label: 'מומחה' }
  ];

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
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>מיומנויות</h2>
        <div 
          title="הוסף מיומנויות טכניות ומקצועיות רלוונטיות לתפקיד"
          style={{ 
            cursor: 'help',
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}
          onMouseOver={() => {
            const tooltip = document.getElementById('skills-tooltip');
            if (tooltip) tooltip.style.display = 'block';
          }}
          onMouseOut={() => {
            const tooltip = document.getElementById('skills-tooltip');
            if (tooltip) tooltip.style.display = 'none';
          }}
        >
          <svg style={{ width: '18px', height: '18px', fill: '#757575' }} viewBox="0 0 24 24">
            <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" />
          </svg>
          <span style={{ fontSize: '14px', color: '#333', fontWeight: 'bold', marginRight: '6px' }}>מיומנויות</span>
          <div 
            id="skills-tooltip"
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
            הוסף מיומנויות טכניות ומקצועיות רלוונטיות לתפקיד
          </div>
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        <p style={{ 
          textAlign: 'right', 
          color: '#666', 
          margin: '0 0 16px 0', 
          fontSize: '14px' 
        }}>
          הוסף מיומנויות טכניות ומקצועיות המתאימות לתחום עבודתך
        </p>

        {/* רשימת מיומנויות קיימות */}
        {skills.length > 0 && !showForm && (
          <div style={{ marginBottom: '16px' }}>
            {skills.map((skill, index) => (
              <div 
                key={index}
                style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  padding: '12px',
                  marginBottom: '8px',
                  backgroundColor: '#f9f9f9',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  direction: 'rtl'
                }}
              >
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleDeleteSkill(index)}
                    style={{
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      outline: 'none'
                    }}
                  >
                    מחק
                  </button>
                  <button
                    onClick={() => handleEditSkill(index)}
                    style={{
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      outline: 'none'
                    }}
                  >
                    ערוך
                  </button>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                    {skill.name}
                  </div>
                  {skill.level && (
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      רמה: {skill.level}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* כפתור הוספת מיומנות או טופס */}
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: 'rgba(25, 118, 210, 0.04)',
              border: '1px solid rgba(25, 118, 210, 0.5)',
              borderRadius: '4px',
              color: '#1976d2',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              outline: 'none'
            }}
            onMouseOver={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(25, 118, 210, 0.08)';
              (e.target as HTMLButtonElement).style.borderColor = '#1976d2';
            }}
            onMouseOut={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(25, 118, 210, 0.04)';
              (e.target as HTMLButtonElement).style.borderColor = 'rgba(25, 118, 210, 0.5)';
            }}
          >
            <svg style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
            הוסף מיומנות
          </button>
        ) : (
          <div style={{ 
            border: '1px solid #e0e0e0', 
            borderRadius: '4px', 
            padding: '16px',
            backgroundColor: 'rgba(0, 0, 0, 0.02)'
          }}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '4px', 
                fontSize: '14px', 
                fontWeight: '500',
                textAlign: 'right'
              }}>
                שם המיומנות
              </label>
              <input
                type="text"
                value={currentSkill.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="לדוגמה: JavaScript, פוטושופ, ניהול פרויקטים"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  fontSize: '14px',
                  outline: 'none',
                  direction: 'rtl',
                  textAlign: 'right'
                }}
                onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = '#3b82f6'}
                onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = '#e0e0e0'}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '4px', 
                fontSize: '14px', 
                fontWeight: '500',
                textAlign: 'right'
              }}>
                רמת מיומנות
              </label>
              <select
                value={currentSkill.level}
                onChange={(e) => handleInputChange('level', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  fontSize: '14px',
                  outline: 'none',
                  direction: 'rtl',
                  textAlign: 'right',
                  backgroundColor: 'white'
                }}
                onFocus={(e) => (e.target as HTMLSelectElement).style.borderColor = '#3b82f6'}
                onBlur={(e) => (e.target as HTMLSelectElement).style.borderColor = '#e0e0e0'}
              >
                <option value="">בחר רמת מיומנות</option>
                {levelOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
              <button
                onClick={handleCancel}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  color: '#374151',
                  fontSize: '14px',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                ביטול
              </button>
              <button
                onClick={handleAddSkill}
                disabled={!currentSkill.name.trim()}
                style={{
                  padding: '8px 16px',
                  backgroundColor: currentSkill.name.trim() ? '#4caf50' : '#ccc',
                  border: 'none',
                  borderRadius: '4px',
                  color: 'white',
                  fontSize: '14px',
                  cursor: currentSkill.name.trim() ? 'pointer' : 'not-allowed',
                  outline: 'none'
                }}
              >
                {editingIndex >= 0 ? 'עדכן' : 'הוסף'} מיומנות
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillSection;