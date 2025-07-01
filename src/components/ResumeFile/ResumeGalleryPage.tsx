
import { useNavigate } from 'react-router-dom';
import ResumeGallery from './ResumeGallery';

const ResumeGalleryPage = () => {
  const navigate = useNavigate();

  const handleEditResume = (resumeData:any) => {
    if (resumeData) {
      // עריכת קורות חיים קיימים - העבר את הנתונים
      console.log('🔄 מעבר לעריכת קורות חיים קיימים:', resumeData);
      navigate('/templateEditor/edit', { 
        state: {
          resumeData: resumeData,
          isEditing: true
        }
      });
    } else {
      // יצירת קורות חיים חדשים - העבר לבחירת תבנית
      console.log('🆕 מעבר ליצירת קורות חיים חדשים');
      navigate('/templateList'); // או לדף בחירת התבנית
    }
  };

  return (
    <ResumeGallery 
      onEditResume={handleEditResume}
    />
  );
};

export default ResumeGalleryPage;
