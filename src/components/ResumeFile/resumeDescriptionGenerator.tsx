import React, { useState, useEffect, useRef } from 'react';

// הגדרת טיפוסים
interface SearchResult {
 type: 'category' | 'description';
 text: string;
 profession?: string;
}

interface TextFormat {
 bold: boolean;
 italic: boolean;
 underline: boolean;
 align: string;
}

interface ResumeDescriptionGeneratorProps {
 onSummaryChange: (summary: string) => void;
 initialSummary?: string;
 autoSave?: boolean;
 blockAutoSave?: boolean;
 manualSaveOnly?: boolean;
}

// מילון מורחב של מקצועות ומשפטים
const professionDescriptions: Record<string, string[]> = {
 "מתכנת": [
   "מתכנת מחשבים מנוסה מיומן בפיתוח מלא, פיתוח אתרים, הנדסת תוכנה ועיצוב מסדי נתונים.",
   "שליטה גבוהה בשפות תכנות ++C, Java ו-Python. מיומן באיתור באגים ופתרון בעיות תוכנה מורכבות.",
   "מיומן בהובלת פרויקטי פיתוח ויצירת פתרונות חדשניים לבעיות מאתגרות."
 ],
 "מורה": [
   "מורה מיומן עם +15 שנות ניסיון, מומחה בפיתוח תכניות הוראה אישיות והערכת התקדמות התלמידים."
 ],
 "מכירות": [
   "מנהל מכירות מוכח עם +10 שנות ניסיון בתעשיית הטכנולוגיה. מיומן בפיתוח אסטרטגיות מכירה, הובלת צוותים ומתן שירות לקוחות מעולה."
 ],
 "עורך דין": [
   "עורך דין מורשה בעל ניסיון של 8 שנים בתחום המשפט המסחרי והאזרחי.",
   "בקיא בניהול הליכים משפטיים, ניסוח חוזים וייצוג לקוחות בבתי משפט."
 ],
 "רופא": [
   "רופא מומחה עם 12 שנות ניסיון ברפואה פנימית.",
   "מיומנות גבוהה באבחון וטיפול במגוון רחב של מצבים רפואיים."
 ],
 "אדריכל": [
   "אדריכל מוסמך בעל ניסיון של 10 שנים בתכנון מבני מגורים ומבני ציבור.",
   "התמחות בעיצוב פנים ותכנון מרחבים פונקציונליים."
 ],
 "פסיכולוג": [
   "פסיכולוג קליני מוסמך עם התמחות בטיפול קוגניטיבי-התנהגותי.",
   "ניסיון עשיר בעבודה עם מבוגרים ומתבגרים במגוון קשיים נפשיים."
 ],
 "גרפיקאי": [
   "מעצב גרפי יצירתי עם 8 שנות ניסיון בעיצוב מותגים, אתרים וחומרי שיווק.",
   "שליטה מלאה בתוכנות Adobe Creative Suite ויכולת עבודה מול לקוחות מגוונים."
 ],
 "מהנדס": [
   "מהנדס מכונות בעל תואר שני ו-10 שנות ניסיון בתכנון מערכות מכניות מתקדמות.",
   "מומחה בפיתוח פתרונות הנדסיים יעילים וחסכוניים באנרגיה."
 ],
 "חשבונאי": [
   "רואה חשבון מוסמך עם 15 שנות ניסיון בניהול כספים, ביקורת וייעוץ פיננסי.",
   "מומחה בדיני מס ותכנון פיננסי לחברות וארגונים."
 ]
};

const ResumeDescriptionGenerator: React.FC<ResumeDescriptionGeneratorProps> = ({ 
 onSummaryChange, 
 initialSummary = '', 
 autoSave = true, 
 blockAutoSave = false, 
 manualSaveOnly = false 
}) => {
 console.log('🏃‍♂️ ResumeDescriptionGenerator התחיל עם initialSummary:', initialSummary);
 
 const [summary, setSummary] = useState('');
 const [searchQuery, setSearchQuery] = useState('');
 const [showSuggestionsBox, setShowSuggestionsBox] = useState(false);
 const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
 const [textFormat, setTextFormat] = useState<TextFormat>({
   bold: false,
   italic: false,
   underline: false,
   align: 'right'
 });
 
 // 🔧 פתרון הלולאה האינסופית
 const [isInitialLoad, setIsInitialLoad] = useState(true);
 const initialDataLoaded = useRef(false);
 const onSummaryChangeRef = useRef(onSummaryChange);

 // עדכון ה-ref כאשר הפונקציה משתנה
 useEffect(() => {
   onSummaryChangeRef.current = onSummaryChange;
 }, [onSummaryChange]);

 // 🔥 טעינת נתונים קיימים - רק פעם אחת!
 useEffect(() => {
   console.log('🔄 ResumeDescriptionGenerator useEffect רץ עם initialSummary:', initialSummary);
   
   if (!initialDataLoaded.current) {
     // טוען נתונים ראשוניים אם יש
     if (initialSummary) {
       console.log('✅ מעדכן תקציר עם נתונים ראשוניים:', initialSummary);
       setSummary(initialSummary);
     }
     
     initialDataLoaded.current = true;
     setIsInitialLoad(false);
   }
 }, [initialSummary]);

 // useEffect לשליחת נתונים לparent - רק אחרי הטעינה הראשונית
 useEffect(() => {
   // 🚨 רק אחרי שהטעינה הראשונית הסתיימה ורק אם לא חסום
   if (!isInitialLoad && onSummaryChangeRef.current && !blockAutoSave && autoSave && !manualSaveOnly) {
     console.log('📤 שולח תקציר לparent:', summary);
     onSummaryChangeRef.current(summary);
   }
 }, [summary, isInitialLoad, blockAutoSave, autoSave, manualSaveOnly]);

 const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
   const newSummary = e.target.value;
   console.log('📝 תקציר השתנה ל:', newSummary);
   setSummary(newSummary);
 };

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

 // הוספת משפט לתקציר הקיים (במקום להחליף)
 const handleDescriptionClick = (text: string) => {
   const newSummary = summary ? 
                      (summary.endsWith('.') || summary.endsWith('!') || summary.endsWith('?') ? 
                      `${summary} ${text}` : 
                      `${summary}. ${text}`) :
                      text;
   
   setSummary(newSummary);
 };

 // פונקציות לכפתורי עיצוב טקסט
 const toggleFormat = (format: keyof TextFormat) => {
   setTextFormat(prev => ({
     ...prev,
     [format]: !prev[format]
   }));
 };

 // פונקציה לשינוי יישור טקסט
 const setAlignment = (alignment: string) => {
   setTextFormat(prev => ({
     ...prev,
     align: alignment
   }));
 };

 // פונקציה לטיפול ב-Enter ושבירת שורות
 const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
   if (e.key === 'Enter') {
     // אל תמנע את ברירת המחדל - תן לו לעבוד כרגיל
     // זה יגרום לירידת שורה
   }
 };

 return (
   <div style={{ 
     padding: '0', 
     maxWidth: '1000px', 
     margin: '16px auto',
     background: 'rgba(255, 255, 255, 1)',
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
       <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>תקציר</h2>
       <div 
         title="תקציר הוא סעיף המציג את הכישורים והניסיון העיקריים שלך באופן תמציתי"
         style={{ 
           cursor: 'help',
           position: 'relative',
           display: 'flex',
           alignItems: 'center'
         }}
         onMouseOver={() => {
           const tooltip = document.getElementById('custom-tooltip');
           if (tooltip) tooltip.style.display = 'block';
         }}
         onMouseOut={() => {
           const tooltip = document.getElementById('custom-tooltip');
           if (tooltip) tooltip.style.display = 'none';
         }}
       >
         <svg style={{ width: '20px', height: '20px', fill: '#757575', marginRight: '6px' }} viewBox="0 0 24 24">
           <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" />
         </svg>
         <span style={{ fontSize: '14px', color: '#333', fontWeight: 'bold' }}>תקציר</span>
         <div 
           id="custom-tooltip"
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
           תקציר הוא סעיף המציג את הכישורים והניסיון העיקריים שלך באופן תמציתי
         </div>
       </div>
     </div>

     <div style={{ padding: '24px' }}>
       <p style={{ 
         textAlign: 'right', 
         color: '#000000', 
         margin: '0 0 16px 0', 
         fontSize: '14px' 
       }}>
         תיאור קצר המפרט את הניסיון המקצועי שלך
       </p>

       <div style={{ 
         position: 'relative',
         border: '1px solid #d0d0d0', 
         borderRadius: '4px',
         overflow: 'hidden',
         boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
       }}>
         <div style={{ 
           display: 'flex',
           backgroundColor: '#f5f5f5',
           padding: '8px 12px',
           borderBottom: '1px solid #e0e0e0',
         }}>
             <button 
             onClick={() => setShowSuggestionsBox(!showSuggestionsBox)}
             style={{ 
               display: 'flex',
               alignItems: 'center',
               background: 'none',
               border: 'none',
               color: '#2196f3',
               padding: '0',
               cursor: 'pointer',
               fontSize: '14px',
               marginRight: 'auto',
               outline: 'none',
               position: 'relative'
             }}
           >
             <svg style={{ width: '16px', height: '16px', fill: '#2196f3', marginRight: '4px' }} viewBox="0 0 24 24">
               <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
             </svg>
             משפטים מוכנים עבורך
           </button>

           <div style={{ display: 'flex' }}>
             <button 
               onClick={() => toggleFormat('bold')}
               style={{ 
                 background: 'none', 
                 border: 'none', 
                 cursor: 'pointer', 
                 padding: '0 4px',
                 color: textFormat.bold ? '#2196f3' : '#666',
                 outline: 'none'
               }}
             >
               <svg viewBox="0 0 24 24" style={{ width: '18px', height: '18px', fill: 'currentColor' }}>
                 <path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z" />
               </svg>
             </button>
             <button 
               onClick={() => toggleFormat('italic')}
               style={{ 
                 background: 'none', 
                 border: 'none', 
                 cursor: 'pointer', 
                 padding: '0 4px',
                 color: textFormat.italic ? '#2196f3' : '#666',
                 outline: 'none'
               }}
             >
               <svg viewBox="0 0 24 24" style={{ width: '18px', height: '18px', fill: 'currentColor' }}>
                 <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4h-8z" />
               </svg>
             </button>
             <button 
               onClick={() => toggleFormat('underline')}
               style={{ 
                 background: 'none', 
                 border: 'none', 
                 cursor: 'pointer', 
                 padding: '0 4px',
                 color: textFormat.underline ? '#2196f3' : '#666',
                 outline: 'none'
               }}
             >
               <svg viewBox="0 0 24 24" style={{ width: '18px', height: '18px', fill: 'currentColor' }}>
                 <path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z" />
               </svg>
             </button>
             <button 
               onClick={() => setAlignment('right')}
               style={{ 
                 background: 'none', 
                 border: 'none', 
                 cursor: 'pointer', 
                 padding: '0 4px',
                 color: textFormat.align === 'right' ? '#2196f3' : '#666',
                 outline: 'none'
               }}
             >
               <svg viewBox="0 0 24 24" style={{ width: '18px', height: '18px', fill: 'currentColor' }}>
                 <path d="M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12v-2H9v2zM3 5v2h18V5H3z" />
               </svg>
             </button>
             <button 
               onClick={() => setAlignment('center')}
               style={{ 
                 background: 'none', 
                 border: 'none', 
                 cursor: 'pointer', 
                 padding: '0 4px',
                 color: textFormat.align === 'center' ? '#2196f3' : '#666',
                 outline: 'none'
               }}
             >
               <svg viewBox="0 0 24 24" style={{ width: '18px', height: '18px', fill: 'currentColor' }}>
                 <path d="M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7H7zM3 3v2h18V3H3z" />
               </svg>
             </button>
             <button 
               onClick={() => setAlignment('justify')}
               style={{ 
                 background: 'none', 
                 border: 'none', 
                 cursor: 'pointer', 
                 padding: '0 4px',
                 color: textFormat.align === 'justify' ? '#2196f3' : '#666',
                 outline: 'none'
               }}
             >
               <svg viewBox="0 0 24 24" style={{ width: '18px', height: '18px', fill: 'currentColor' }}>
                 <path d="M3 21h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18V7H3v2zm0-6v2h18V3H3z" />
               </svg>
             </button>
           </div>
         </div>

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
             boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
             border: '1px solid #d0d0d0',
             maxHeight: '80vh',
             overflowY: 'auto',
             outline: 'none'
           }}>
             <div style={{ 
               padding: '16px 16px 12px',
               borderBottom: '1px solid #e0e0e0',
               display: 'flex',
               flexDirection: 'column',
               gap: '12px',
               backgroundColor: '#f5f5f5'
             }}>
               <div style={{
                 display: 'flex',
                 justifyContent: 'space-between',
                 alignItems: 'center'
               }}>
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
               
               <div style={{ position: 'relative' }}>
                 <input
                   type="text"
                   value={searchQuery}
                   onChange={handleSearchChange}
                   placeholder="חפש/י משפטים לפי תפקיד"
                   autoFocus
                   style={{
                     padding: '10px 12px',
                     width: '100%',
                     borderRadius: '4px',
                     border: '1px solid #e0e0e0',
                     outline: 'none',
                     fontSize: '14px',
                     direction: 'rtl',
                     textAlign: 'right',
                     backgroundColor: '#ffffff'
                   }}
                 />
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
                             backgroundColor: '#f5f5f5',
                             borderBottom: '1px solid #e0e0e0',
                             fontWeight: 'bold',
                             textAlign: 'right',
                             direction: 'rtl',
                             color: '#000000'
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
                             borderBottom: '1px solid #e0e0e0',
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
                               border: 'none',
                               width: '32px',
                               height: '32px',
                               borderRadius: '50%',
                               display: 'flex',
                               alignItems: 'center',
                               justifyContent: 'center',
                               cursor: 'pointer',
                               flexShrink: 0,
                               marginLeft: '12px',
                               outline: 'none'
                             }}
                           >
                             <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                               <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                             </svg>
                           </button>
                           <div style={{ 
                             textAlign: 'right', 
                             flex: 1,
                             fontSize: '14px',
                             color: '#000000'
                           }}>
                             {result.text}
                           </div>
                         </div>
                       );
                     }
                   })}
                 </div>
               ) : searchQuery.trim() !== '' ? (
                 <div style={{ 
                   padding: '24px 16px',
                   textAlign: 'center',
                   color: '#000000',
                   fontSize: '14px'
                 }}>
                   לא נמצאו תוצאות
                 </div>
               ) : (
                 <div>
                   {Object.entries(professionDescriptions).slice(0, 3).map(([profession, descriptions]) => (
                     <div key={profession} style={{ 
                       padding: '16px',
                       borderBottom: '1px solid #e0e0e0',
                       textAlign: 'right',
                       direction: 'rtl'
                     }}>
                       <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#000000' }}>{profession}</div>
                       <div style={{ 
                         display: 'flex',
                         justifyContent: 'space-between',
                         alignItems: 'center'
                       }}>
                         <button
                           onClick={() => handleDescriptionClick(descriptions[0])}
                           style={{
                             backgroundColor: '#4285f4',
                             color: 'white',
                             border: 'none',
                             width: '32px',
                             height: '32px',
                             borderRadius: '50%',
                             display: 'flex',
                             alignItems: 'center',
                             justifyContent: 'center',
                             cursor: 'pointer',
                             flexShrink: 0,
                             marginLeft: '12px',
                             outline: 'none'
                           }}
                         >
                           <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                             <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                           </svg>
                         </button>
                         <p style={{ margin: 0, fontSize: '14px', flex: 1, textAlign: 'right', color: '#000000' }}>
                           {descriptions[0]}
                         </p>
                       </div>
                     </div>
                   ))}
                 </div>
               )}
             </div>
           </div>
         )}

         <textarea
           value={summary}
           onChange={handleChange}
           onKeyDown={handleKeyDown}
           placeholder="לדוגמה: מהנדס מנוסה בעל +10 שנות ניסיון, מחפש משרה מלאה ומאתגרת..."
           style={{
             width: '100%',
             minHeight: '150px',
             padding: '16px',
             fontSize: '14px',
             border: 'none',
             borderTop: '1px solid #e0e0e0',
             color: '#333',
             resize: 'none',
             outline: 'none',
             fontFamily: 'inherit',
             direction: 'rtl',
             textAlign: textFormat.align as React.CSSProperties['textAlign'],
             fontWeight: textFormat.bold ? 'bold' : 'normal',
             fontStyle: textFormat.italic ? 'italic' : 'normal',
             textDecoration: textFormat.underline ? 'underline' : 'none',
             whiteSpace: 'pre-wrap', // משמר שבירות שורות ורווחים
             lineHeight: '1.5' // שיפור קריאות
           }}
         />
       </div>
     </div>
   </div>
 );
};

export default ResumeDescriptionGenerator;