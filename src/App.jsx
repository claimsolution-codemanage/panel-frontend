import {Route,Routes} from 'react-router-dom'
import { createContext, useEffect, useState } from 'react'
import { getToken,getJwtDecode } from './utils/helperFunction'

import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Error from './pages/Error'
import Health_Insurance from './pages/Services/Health_Insurance'
import Any_Insurance_Claim_Solution from './pages/Services/Any_Insurance_Claim_Solution'
import Death_Claim_Solution from './pages/Services/Death_Claim_Solution'
import Motor_Insurance_Claim_Solution from './pages/Services/Motor_Insurance_Claim_Solution'
// import Navbar from './components/Common/Navabar'
import Blogs from './pages/blogs'
import ViewBlogs from './pages/BlogSection/ViewBlogs'
import Career from './pages/career'
import Patnership from './pages/Patnership'
import Policy from './pages/policy'
import Login from './pages/login'
import Feedback from './pages/Feedback'

import TermsAndCondition from './pages/termsAndConditions'
import PartnerAgreement from './pages/agreements/partner'
import ClientAgreement from './pages/agreements/client'


import {partnerRoutes} from './Routes/partner'
import { adminRoutes } from './Routes/admin'
import { employeeRoutes } from './Routes/employee'
import { clientRoutes } from './Routes/client'


// for client routes
import ClientSignIn from './pages/client/signin'


// import template
import PublicTemplate from './template/publicTemplate'
import PanelTemplate from './template/PanelTemplate'
import BlogTemplate from './template/blogTemplate'

export const AppContext = createContext("")
import { useLocation } from 'react-router-dom'

export default function App(){
  const location = useLocation();
  const [myAppData,setMyAppData] = useState({isLogin:false,details:""})


  useEffect(()=>{
    const token = getToken()
    // console.log("token",token);
    if(token){
        const details = getJwtDecode(token)
        setMyAppData({isLogin:true,details:details})
    }
  },[])

  useEffect(() => {
    // Scroll to the top of the page when the route changes
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // console.log("myapp",myAppData);

  
  
  return(<>
    
   <AppContext.Provider value={{myAppData,setMyAppData}}>
  {/* <Navbar/> */}
  <Routes>
    {/* <Route path='/' element={<PublicTemplate><Home/></PublicTemplate>}/> */}
    {/* <Route path='/about-us' element={<PublicTemplate><About/></PublicTemplate>}/> */}
    {/* <Route path='/contact-us' element={<PublicTemplate><Contact/></PublicTemplate>}/> */}
    {/* <Route path='/Health-insurance-claim-solution' element={<PublicTemplate><Health_Insurance/></PublicTemplate>}/> */}
    {/* <Route path='/General-Insurance-Claim-Solution' element={<PublicTemplate><Any_Insurance_Claim_Solution/></PublicTemplate>}/> */}
    {/* <Route path='/Life-Insurance-Claim-Solution' element={<PublicTemplate><Death_Claim_Solution/></PublicTemplate> }/> */}
    {/* <Route path='/Motor-Insurance-Claim-Solution' element={<PublicTemplate><Motor_Insurance_Claim_Solution/></PublicTemplate>}/> */}
    {/* <Route path='/blogs' element={<BlogTemplate><Blogs/></BlogTemplate>}/> */}
    {/* <Route path='/blog/:topic' element={<BlogTemplate><ViewBlogs/></BlogTemplate>}/> */}
    {/* <Route path='/career' element={<PublicTemplate><Career/></PublicTemplate>} /> */}
    {/* <Route path='/partnership' element={<PublicTemplate><Patnership/></PublicTemplate>} /> */}
    {/* <Route path='/policy' element={<PublicTemplate><Policy/></PublicTemplate>} /> */}
    {/* <Route path='/feedback' element={<PublicTemplate><Feedback/></PublicTemplate>}/> */}
    {/* <Route path='/terms-and-condition' element={<PublicTemplate><TermsAndCondition/></PublicTemplate>}/>
    <Route path='/partner/service agreement' element={<PublicTemplate><PartnerAgreement/></PublicTemplate>}/>
    <Route path='/client/service agreement' element={<PublicTemplate><ClientAgreement/></PublicTemplate>}/> */}

    <Route path='/' element={<PanelTemplate><ClientSignIn/></PanelTemplate>}/>
    <Route path='/terms-and-condition' element={<TermsAndCondition/>}/>
    <Route path='/partner/service agreement' element={<><PartnerAgreement/></>}/>
    <Route path='/client/service agreement' element={<><ClientAgreement/></>}/>
    <Route path='*' element={<Error/>}/>
  {...employeeRoutes}
  {...partnerRoutes}
  {...adminRoutes}
  {...clientRoutes}
  </Routes>
  {/* <Footer/> */}
  </AppContext.Provider>

  </>)
}