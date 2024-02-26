// import Navbar from "../components/Common/Navabar"
import Navbar from "../components/Common/Navabar"
import Footer from "../components/Common/Footer"

export default function PublicTemplate({children}){
    return(<>
       <div className="container-fluid p-0 m-0">
         <Navbar/>
         <div className=''>
         {children}
         </div>
         <Footer/>
            </div>
    </>)
}