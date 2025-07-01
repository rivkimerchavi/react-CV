import React, { useState, useEffect, useRef } from 'react';

// הגדרת טיפוסים
interface FormData {
  position: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  country: string;
  citizenship: string;
  licenseType: string;
  birthDate: string;
  idNumber: string;
}

interface FormDataWithImage extends FormData {
  image: string | null;
}

interface PersonalDetailsFormProps {
  onFormChange: (data: FormDataWithImage) => void;
  initialData?: Partial<FormDataWithImage>;
  autoSave?: boolean;
  blockAutoSave?: boolean;
  manualSaveOnly?: boolean;
}

const PersonalDetailsForm: React.FC<PersonalDetailsFormProps> = ({ onFormChange, initialData }) => {
  console.log('🏃‍♂️ PersonalDetailsForm התחיל עם initialData:', initialData);
  
  const [formData, setFormData] = useState<FormData>({
    position: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    address: '',
    country: '',
    citizenship: '',
    licenseType: '',
    birthDate: '',
    idNumber: '',
  });

  const [image, setImage] = useState<string | null>(null);
  const [showAdditionalDetails, setShowAdditionalDetails] = useState(false);
  
  // 🚨 הוספת flag למניעת לולאה
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const initialDataLoaded = useRef(false);

  // 🔥 השתמש ב-useRef למניעת לולאות אינסופיות
  const onFormChangeRef = useRef(onFormChange);
  
  useEffect(() => {
    onFormChangeRef.current = onFormChange;
  }, [onFormChange]);

  // 🔧 useEffect לטעינת initialData - רק פעם אחת!
  useEffect(() => {
    console.log('🔄 PersonalDetailsForm useEffect רץ עם initialData:', initialData);
    
    if (initialData && Object.keys(initialData).length > 0 && !initialDataLoaded.current) {
      console.log('✅ מעדכן טופס עם נתונים ראשוניים (פעם ראשונה):', initialData);
      
      // עדכון formData עם הנתונים הקיימים
      setFormData(prevData => ({
        ...prevData,
        ...initialData
      }));
      
      // אם יש תמונה בנתונים הקיימים
      if (initialData.image) {
        console.log('🖼️ מעדכן תמונה:', initialData.image);
        setImage(initialData.image);
      }
      
      // סימון שהנתונים נטענו
      initialDataLoaded.current = true;
      setIsInitialLoad(false);
    }
  }, [initialData]);

  // useEffect נפרד לשליחה לparent - רק אחרי הטעינה הראשונית
  useEffect(() => {
    // 🚨 רק אחרי שהטעינה הראשונית הסתיימה
    if (!isInitialLoad && onFormChangeRef.current) {
      console.log('📤 שולח נתונים לparent:', { ...formData, image });
      onFormChangeRef.current({ ...formData, image });
    }
  }, [formData, image, isInitialLoad]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(`📝 שדה ${name} השתנה ל: ${value}`);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log('📸 תמונה חדשה נטענה');
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>פרטים אישיים</h2>
        <div 
          title="כאן אפשר להכניס הסבר כללי על הפרטים האישיים."
          style={{ 
            cursor: 'help',
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}
          onMouseOver={() => {
            const tooltip = document.getElementById('personal-details-tooltip');
            if (tooltip) tooltip.style.display = 'block';
          }}
          onMouseOut={() => {
            const tooltip = document.getElementById('personal-details-tooltip');
            if (tooltip) tooltip.style.display = 'none';
          }}
        >
          <svg style={{ width: '20px', height: '20px', fill: '#757575', marginRight: '6px' }} viewBox="0 0 24 24">
            <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" />
          </svg>
          <span style={{ fontSize: '14px', color: '#333', fontWeight: 'bold' }}>פרטים אישיים</span>
          <div 
            id="personal-details-tooltip"
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
            כאן אפשר להכניס הסבר כללי על הפרטים האישיים.
          </div>
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        <div style={{ 
          display: 'flex',
          flexDirection: 'row',
          gap: '16px',
          marginBottom: '24px' 
        }}>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            width: '50%'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: '#f5f5f5',
              border: '1px solid #e0e0e0',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              {image ? (
                <img 
                  src={image} 
                  alt="תמונת פרופיל" 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover' 
                  }} 
                />
              ) : (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                    stroke="#666"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                    stroke="#666"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <label style={{ 
              color: '#2196f3', 
              cursor: 'pointer',
              fontSize: '14px',
              textAlign: 'center'
            }}>
              העלאת תמונה
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </div>
          <div style={{ 
            width: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'flex-end',
            marginTop: '24px'
          }}>
            <div 
              title="הכנס את תפקידך הנוכחי או המבוקש."
              style={{ 
                cursor: 'help',
                marginRight: '8px'
              }}
            >
              <svg style={{ width: '16px', height: '16px', fill: '#757575' }} viewBox="0 0 24 24">
                <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" />
              </svg>
            </div>
            <input
              type="text"
              name="position"
              placeholder="הגדרת תפקיד"
              value={formData.position}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '8px 0',
                border: 'none',
                borderBottom: '1px solid #e0e0e0',
                direction: 'rtl',
                textAlign: 'right',
                outline: 'none',
                fontSize: '14px'
              }}
            />
          </div>
        </div>

        <div style={{ 
          display: 'flex',
          flexDirection: 'row',
          gap: '16px',
          marginBottom: '24px' 
        }}>
          <div style={{ width: '50%' }}>
            <input
              type="text"
              name="lastName"
              placeholder="שם משפחה"
              value={formData.lastName}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '8px 0',
                border: 'none',
                borderBottom: '1px solid #e0e0e0',
                direction: 'rtl',
                textAlign: 'right',
                outline: 'none',
                fontSize: '14px'
              }}
            />
          </div>
          <div style={{ width: '50%' }}>
            <input
              type="text"
              name="firstName"
              placeholder="שם פרטי"
              value={formData.firstName}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '8px 0',
                border: 'none',
                borderBottom: '1px solid #e0e0e0',
                direction: 'rtl',
                textAlign: 'right',
                outline: 'none',
                fontSize: '14px'
              }}
            />
          </div>
        </div>

        <div style={{ 
          display: 'flex',
          flexDirection: 'row',
          gap: '16px',
          marginBottom: '24px' 
        }}>
          <div style={{ width: '50%' }}>
            <input
              type="email"
              name="email"
              placeholder="אימייל"
              value={formData.email}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '8px 0',
                border: 'none',
                borderBottom: '1px solid #e0e0e0',
                direction: 'rtl',
                textAlign: 'right',
                outline: 'none',
                fontSize: '14px'
              }}
            />
          </div>
          <div style={{ width: '50%' }}>
            <input
              type="text"
              name="phone"
              placeholder="טלפון נייד"
              value={formData.phone}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '8px 0',
                border: 'none',
                borderBottom: '1px solid #e0e0e0',
                direction: 'rtl',
                textAlign: 'right',
                outline: 'none',
                fontSize: '14px'
              }}
            />
          </div>
        </div>

        {showAdditionalDetails && (
          <div style={{ 
            marginTop: '16px', 
            paddingTop: '16px' 
          }}>
            <div style={{ 
              display: 'flex',
              flexDirection: 'row',
              gap: '16px',
              marginBottom: '24px' 
            }}>
              <div style={{ width: '50%' }}>
                <input
                  type="text"
                  name="address"
                  placeholder="כתובת"
                  value={formData.address}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '8px 0',
                    border: 'none',
                    borderBottom: '1px solid #e0e0e0',
                    direction: 'rtl',
                    textAlign: 'right',
                    outline: 'none',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div style={{ width: '50%' }}>
                <input
                  type="text"
                  name="city"
                  placeholder="עיר"
                  value={formData.city}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '8px 0',
                    border: 'none',
                    borderBottom: '1px solid #e0e0e0',
                    direction: 'rtl',
                    textAlign: 'right',
                    outline: 'none',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            <div style={{ 
              display: 'flex',
              flexDirection: 'row',
              gap: '16px',
              marginBottom: '24px' 
            }}>
              <div style={{ width: '50%' }}>
                <input
                  type="text"
                  name="citizenship"
                  placeholder="אזרחות"
                  value={formData.citizenship}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '8px 0',
                    border: 'none',
                    borderBottom: '1px solid #e0e0e0',
                    direction: 'rtl',
                    textAlign: 'right',
                    outline: 'none',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div style={{ width: '50%' }}>
                <input
                  type="text"
                  name="country"
                  placeholder="מדינה"
                  value={formData.country}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '8px 0',
                    border: 'none',
                    borderBottom: '1px solid #e0e0e0',
                    direction: 'rtl',
                    textAlign: 'right',
                    outline: 'none',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            <div style={{ 
              display: 'flex',
              flexDirection: 'row',
              gap: '16px',
              marginBottom: '24px' 
            }}>
              <div style={{ width: '50%' }}>
                <input
                  type="date"
                  name="birthDate"
                  placeholder="תאריך לידה"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '8px 0',
                    border: 'none',
                    borderBottom: '1px solid #e0e0e0',
                    textAlign: 'right',
                    outline: 'none',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div style={{ width: '50%' }}>
                <input
                  type="text"
                  name="idNumber"
                  placeholder="תעודת זהות"
                  value={formData.idNumber}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '8px 0',
                    border: 'none',
                    borderBottom: '1px solid #e0e0e0',
                    direction: 'rtl',
                    textAlign: 'right',
                    outline: 'none',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            <div>
              <input
                type="text"
                name="licenseType"
                placeholder="סוג רישיון נהיגה"
                value={formData.licenseType}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '8px 0',
                  border: 'none',
                  borderBottom: '1px solid #e0e0e0',
                  direction: 'rtl',
                  textAlign: 'right',
                  outline: 'none',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>
        )}

        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          marginTop: '24px' 
        }}>
          <button
            onClick={() => setShowAdditionalDetails(!showAdditionalDetails)}
            style={{ 
              display: 'flex',
              alignItems: 'center',
              background: 'none',
              border: 'none',
              color: '#2196f3',
              padding: '0',
              cursor: 'pointer',
              fontSize: '14px',
              outline: 'none'
            }}
          >
            {showAdditionalDetails ? 'פחות פרטים' : 'פרטים נוספים'}
            <svg 
              style={{ width: '20px', height: '20px', fill: '#2196f3', marginRight: '4px' }} 
              viewBox="0 0 24 24"
            >
              {showAdditionalDetails ? (
                <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
              ) : (
                <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
              )}
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetailsForm;