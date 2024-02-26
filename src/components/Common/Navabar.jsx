import { Link } from 'react-router-dom'
import '../../assets/css/navber.css'
export default function Navbar2(){
    function languageTranslator(){
        new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
    }
    return(
        <>
            <div className="bg-color-4 container-fluid d-md-block d-none py-2">
                <div className="container m-0">
                    <ul className="row align-items-center color-1 m-0 p-0">
                        <li className='col-12 col-md-3 text-center'><img src="/Images/icons/social-media-icon/email.png" width={40} className="bg-color-1 rounded-circle text-info" /> help@claimsolution.in</li>
                        <li className='col-4 col-md-2 text-center'><img src="/Images/icons/social-media-icon/phone.png" width={40} className="fs-5 p-1 rounded-circle text-info" /> 9205530811</li>
                        <li className='col-4 col-md-2 text-center'><img src="/Images/icons/social-media-icon/telephone.png" width={40} className="fs-5 p-1 rounded-circle text-info" /> 011 49858616</li>
                        <li className='col-4 col-md-2 text-center'><img src="/Images/icons/social-media-icon/whatsapp.png" width={40} className="fs-5 p-1 text-info" /> 9717282825</li>
                        <li className='col-12 col-md-3 text-center' onClick={languageTranslator}><div  className='d-flex gap-3 text-center align-items-center justify-content-between'><i  className="bi bi-translate h4 px-3  cursor-pointer"></i><div id="google_translate_element" className='btn-close-white'></div></div></li>
                    </ul>
                </div>
            </div>
            <nav className="navbar border-bottom border-3 navbar-expand-lg bg-body-tertiary bg-color-1 sticky-top p-0 ">
                <div className="container-fluid">
                    {/* <a className="navbar-brand" href="#">Navbar</a> */}
                    <Link to="/" className="nav__logo">
                        <img src="/Images/icons/company-logo.png" height={70} alt="Company logo" loading="lazy" />
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse flex-grow-0 " id="navbarSupportedContent">
                        <ul className="navbar-nav d-flex gap-2 me-auto mb-2 mb-lg-0">
                            <li className="nav-item">  
                                <Link to="/" className="nav__link  fw-bold" >
                                    Home
                                </Link>
                            </li>
                {/*=============== DROPDOWN 1 ===============*/}
                            <li className="nav-item dropdown">
                            <a className="nav__link dropdown-toggle fw-bold" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                               Services
                            </a>
                                <ul className="dropdown-menu">
                                    <li>
                                        <Link to="/Health-insurance-claim-solution" className="dropdown__link bg-color-1">
                                            Health insurance claim solution
                                        </Link>
                                    </li>
                                    <li>                   
                                        <Link to="/Motor-Insurance-Claim-Solution" className="dropdown__link bg-color-1">
                                            Motor insurance claim solution
                                        </Link>
                                    </li>
                                    {/* <li><hr className="dropdown-divider" /></li> */}
                                    <li>
                                        <Link to="/Death-Claim-Solution" className="dropdown__link bg-color-1">
                                            Death claim solution
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/Any-Insurance-Claim-Solution" className="dropdown__link bg-color-1">
                                            Any insurance claim solution
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                            <li className="nav-item">  
                                <Link to="/about-us" className="nav__link  fw-bold" >
                                    About Us
                                </Link>
                            </li>
                {/*=============== DROPDOWN 1 ===============*/}
                            {/* <li className="nav-item dropdown">
                            <a className="nav__link dropdown-toggle fw-bold" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Users
                            </a>
                                <ul className="dropdown-menu">
                                    <li>
                                        <Link to="/partner/signin" className="dropdown__link bg-color-1">
                                            Parter
                                        </Link>
                                    </li>
                                    <li>                   
                                        <Link to="/client/signup" className="dropdown__link bg-color-1">
                                            Client
                                        </Link>
                                    </li>
                                </ul>
                            </li> */}
                            <li className="nav-item">
                                <Link to="/partnership" className=" fw-bold nav__link">
                                PartnerShip
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/blogs" target='_blank'  className=" fw-bold nav__link">
                                Blogs
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/career" className=" fw-bold nav__link">
                                Career
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/contact-us" className=" fw-bold nav__link">
                                Contact Us
                                </Link>
                            </li>
                            {/* <li className="nav-item">
                                <Link to="/employee/signin" className=" fw-bold nav__link">
                                Employee
                                </Link>
                            </li> */}
                            <Link to="/client/signin" target='_blank'>
                                <li className="nav-item btn bg-color-4 text-white d-flex gap-2">
                                    <i className='bi bi-box-arrow-in-right'></i>
                                    Login
                                </li>
                            </Link>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}