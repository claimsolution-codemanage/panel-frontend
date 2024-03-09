import '../../assets/css/styles.css'
import { Link } from 'react-router-dom'

export default function Footer(){
    return(<>
    
       
        {/* footer */}
        {/* Remove the container if you want to extend the Footer to full width. */}
        <div className="container-fluid p-0 bottom-0 bg-color-4 color-1">
          <footer className="text-center text-lg-start ">
            {/* Grid container */}
            <div className="container-px-5">
              {/*Grid row*/}
              <div className="row py-5 m-0">
                {/*Grid column*/}
                {/*Grid column*/}
                <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
                  <h5 className="text-uppercase mb-4">Quick links</h5>
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <Link to="/about-us" className="color-1">
                        About Us
                      </Link>
                    </li>
                    <li className="mb-2">
                      <Link to="/career" className="color-1">
                        Career
                      </Link>
                    </li>
                    <li className="mb-2">
                      <Link to="/partner/signin" target='_blank' className="color-1">
                        Partner Portal
                      </Link>
                    </li>
                    <li className="mb-2">
                      <Link to="/contact-us" className="color-1">
                        Contact Us
                      </Link>
                    </li>
                    <li className="mb-2">
                      <Link to="/blogs" target='_blank' className="color-1">
                        Blogs
                      </Link>
                    </li>
                    <li className="mb-2">
                      <Link to="/employee/signin" target='_blank' className="color-1">
                        Team Panel
                      </Link>
                    </li>
                    <li className="mb-2">
                      <Link to="/client/signin" target='_blank' className="color-1">
                        Policy Holder Login
                      </Link>
                    </li>
             
                  </ul>
                </div>
                {/*Grid column*/}
                {/*Grid column*/}
                <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
                  <h5 className="text-uppercase mb-4">Services</h5>
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <Link to="/Health-insurance-claim-solution" className="color-1">
                        Health Insurance Claim Solution
                      </Link>
                    </li>
                    <li className="mb-2">
                      <Link to="/Motor-Insurance-Claim-Solution" className="color-1">
                        Motor Insurance Claim Solution
                      </Link>
                    </li>
                    <li className="mb-2">
                      <Link to="/Life-Insurance-Claim-Solution" className="color-1">
                      Life Insurance Claim Solution
                      </Link>
                    </li>
                    <li className="mb-2">
                      <Link to="/General-Insurance-Claim-Solution" className="color-1">
                      General Insurance Claim Solution
                      </Link>
                    </li>
                    {/* <li className="mb-2">
                      <Link to="/career" className="color-1">
                        Career / Job
                      </Link>
                    </li> */}
                  </ul>
                </div>
                {/*Grid column*/}
                {/*Grid column*/}
                <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
                  <h5 className="text-uppercase mb-4">Legal</h5>
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <Link to="/policy" className="color-1">
                        Privacy Policy
                      </Link>
                    </li>
                    <li className="mb-2">
                      <Link to="/terms-and-condition" className="color-1">
                        Terms & Condition
                      </Link>
                    </li>
                    {/* <li className="mb-2">
                      <Link to="/policy" className="color-1">
                        Disclaimer
                      </Link>
                    </li> */}
                    <li className="mb-2">
                      <Link to="/feedback" className="color-1">
                        Feedback
                      </Link>
                    </li>
                  </ul>
                </div>
                {/*Grid column*/}
                {/*Grid column*/}
                <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
                  <div
                    className="w-75 shadow-1-strong d-flex align-items-center justify-content-center mb-2 mx-auto"
                    style={{height: 100 }}
                  >
                    <img
                      src="/Images/icons/company-logo-2.png"
                      height={70}
                      alt=""
                      loading="lazy"
                    />
                  </div>
                  <p className="text-center color mb-0">
                    We ensure justice for all, supporting those with insurance claims and legal battles.
                  </p>
                  <ul className="list-unstyled d-flex flex-row justify-content-center gap-1">
                    <li className='bg-color-1 shadow-lg social-link'>
                      <a className="text-light px-2 fs-4" target='_blank' href="https://www.facebook.com/Claimsolution.in/followers">
                        <i className="bi bi-facebook text-primary fs-5" />
                      </a>
                    </li>
                    <li className='bg-color-1 shadow-lg social-link'>
                      <a className="text-light px-2 fs-4" target='_blank' href="https://www.instagram.com/claimsolutionindia/">
                        <i className="bi bi-instagram text-danger fs-5" />
                      </a>
                    </li>
                    <li className='bg-color-1 shadow-lg social-link'>
                      <a className="text-light px-2 fs-4" target='_blank' href="https://www.youtube.com/@ClaimSolutionindia">
                        <i className="bi bi-youtube text-danger fs-5" />
                      </a>
                    </li>
                    <li className='bg-color-1 shadow-lg social-link'>
                      <a className="text-light px-2 fs-4" target='_blank' href="https://twitter.com/ClaimSlution">
                      <i class="bi bi-twitter text-primary fs-5"></i>                      
                      </a>
                    </li>
                    <li className='bg-color-1 shadow-lg social-link'>
                      <a className="text-light px-2 fs-4" target='_blank' href="#!">
                      <i class="bi bi-linkedin text-primary fs-5"></i>            
                      </a>
                    </li>
                   

                  
                  </ul>
                </div>
              </div>
              {/*Grid row*/}
            </div>
            {/* Grid container */}
            {/* Copyright */}
            <div
              className="d-flex gap-1  justify-content-center text-center p-3"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
            >
              <p> © {new Date().getFullYear()} Copyright</p> 
              <a className="nav-items" href="https://ClaimSolution.in/">
                ClaimSolution.in
              </a>
            </div>
            {/* Copyright */}
          </footer>
        </div>
        {/* End of .container */}
    </>)
}