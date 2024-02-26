import { Navbar } from "../components/blogSection/Navbar"
import { Footer } from "../components/blogSection/Footer"
import { BlogRight } from "../components/blogSection/blogRight"

export default function BlogTemplate({children}){
    return(<>
       <div className="container-fluid p-0 m-0">
        <Navbar/>
         <div className='conatiner'>
            <div className="row">
                <div className="d-sm-none d-md-block col-md-1 "></div>
                <div className="col-md-7 col-sm-12">
                {children}
                </div>
                <div className="col-md-3 col-sm-12">
                <BlogRight/>   
                </div>
                <div className="d-sm-none d-md-block col-md-1"></div>
            </div>
         </div>
         <Footer/>
            </div>
    </>)
}