import { Route, Routes } from 'react-router-dom'
import { createContext, useEffect, useState } from 'react'
import { getToken, getJwtDecode } from './utils/helperFunction'
import Error from './pages/Error'
import TermsAndCondition from './pages/termsAndConditions'
import PartnerAgreement from './pages/agreements/partner'
import ClientAgreement from './pages/agreements/client'


import { partnerRoutes } from './Routes/partner'
import { adminRoutes } from './Routes/admin'
import { employeeRoutes } from './Routes/employee'
import { clientRoutes } from './Routes/client'


// for client routes
import ClientSignIn from './pages/client/signin'


// import template
import PanelTemplate from './template/PanelTemplate'

export const AppContext = createContext("")
import { useLocation } from 'react-router-dom'

export default function App() {
  const location = useLocation();
  const [myAppData, setMyAppData] = useState({ isLogin: false, details: "", authDetails: null })


  useEffect(() => {
    const token = getToken()
    // console.log("token",token);
    if (token) {
      const details = getJwtDecode(token)
      setMyAppData({ isLogin: true, details: details, authDetails: null })
    }
  }, [])

  useEffect(() => {
    // Scroll to the top of the page when the route changes
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // console.log("myapp",myAppData);



  return (<>

    <AppContext.Provider value={{ myAppData, setMyAppData }}>
      {/* <Navbar/> */}
      <Routes>
        <Route path='/' element={<PanelTemplate><ClientSignIn /></PanelTemplate>} />
        <Route path='/terms-and-condition' element={<TermsAndCondition />} />
        <Route path='/partner/service-agreement' element={<><PartnerAgreement /></>} />
        <Route path='/client/service-agreement' element={<><ClientAgreement /></>} />
        <Route path='*' element={<Error />} />
        {...employeeRoutes}
        {...partnerRoutes}
        {...adminRoutes}
        {...clientRoutes}
      </Routes>
      {/* <Footer/> */}
    </AppContext.Provider>

  </>)
}