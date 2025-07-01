import { createBrowserRouter } from "react-router-dom";
import Login from "./components/login";
import Register from "./components/register";
import Auth from "./components/auth";
import TemplateList from "./components/templateList";
import TemplateEditor from "./components/templateEditor";
import ResumeGalleryPage from "./components/ResumeFile/ResumeGalleryPage";
import AppLayout from "./components/AppLayout";



export const  myRouter= createBrowserRouter([
{

        path: '/',
        element: <AppLayout />,
        errorElement: <>main error</>,
        children:
         [ { index: true, element:<Auth/>}, 
            {path:'login',element:<Login/>},
            {path:'register',element:<Register/>},
            {path:"auth" ,element:<Auth/>},
            {path:"templateList" ,element:<TemplateList/>},
            {path:"resume-gallery", element:<ResumeGalleryPage/>}, // ⭐ הוסף את זה
            {path:"templateEditor/:name", element:<TemplateEditor/>},
         
         ] 
    }
])