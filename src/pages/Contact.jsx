import { Helmet } from "react-helmet";

export default function Contact() {
  return (
    <>
          <Helmet>
        <link rel="canonical" href="http://claimsolution.in/contact-us" />
      </Helmet>
      {/* Contact Us */}
      <div className="container-fluid pt-3 pb-5 color-2">
        <div className=" mt-3">
          <div className="px-5">
          <div className="h1 fw-bold text-center">Contact Us</div>
          <div className="fs-5 text-center py-4">If you have any questions, need support, or want to get in touch with Claimsolution.in, we're here to help. Please feel free to contact us using the following information</div>
          </div>
          <div className="row p-5 align-items-center bg-color-9">
            <div className="col-sm-6">
              <div className="mapouter ">
                <div className="gmap_canvas card-shadow">
                  <iframe class="gmap_iframe" width="100%" frameborder="0" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?width=500&amp;height=300&amp;hl=en&amp;q=Bhavishya Apartment, Nai Basti Road, Deoli, South Delhi - 110080, India&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"></iframe>
                  <a target="_blank" href="https://connectionsgame.org/">Connections Unlimited</a>
                </div>
              </div>
            </div>
            <div className="col-sm-6">
              <div className="">
                <p className='lh-lg mt-5'>
                  {/* <i class="bi bi-tag"></i> claimsolution.in <br /> */}
                  <div className="d-flex gap-2">
                  <i class="bi bi-building fs-5"></i>
                  Adakiya Consultancy Services Pvt. Ltd, <br />
                  150, Bhavishya Apartment in Nai Basti Road Deoli,
                  Nai Basti Road, Deoli, South Delhi - 110080, India
                  </div>

                  <div className="d-flex gap-2">
                  <i class="bi bi-envelope fs-5"></i>
                  help@claimsolution.in
                  </div>
                  <div className="d-flex gap-2">
                  <i class="bi bi-telephone fs-5"></i>
                  +91 9205530811
                  </div>
                  <div className="d-flex gap-2">
                  <i class="bi bi-whatsapp fs-5"></i>
                  
                  +91 9717282825
                  </div>  
                  {/* <i class="bi bi-link-45deg"></i> www.claimsolution.in <br /> */}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid pt-3 pb-5">
        <div className="container-px-5 mt-3">
          <div className="row text-center">
            <p>Monday to Friday, 10:00 a.m. to 6:00 p.m. (IST).</p>
            <p>While you are a policyholder looking for help, a potential partner wishing to cooperate, or have general questions, the team at Claimsolution.in is here to help. We appreciate your feedback and inquiries and promise to respond quickly and effectively.</p>
            <p>Contact us right away to allow us to be your trusted companion as you understand the complicated process of insurance claims.</p>
          </div>
                          
          <ul className="list-unstyled d-flex flex-row justify-content-center my-3 gap-3">
                    <li className="social-link shadow-lg">
                      <a className="text-light px-2 fs-4" target="_blank" href="https://www.facebook.com/Claimsolution.in/followers">
                        <i className="bi bi-facebook text-primary" />
                      </a>
                    </li>
                    <li className="social-link shadow-lg">
                      <a className="text-light px-2 fs-4" target="_blank" href="https://www.instagram.com/claimsolutionindia/">
                        <i className="bi bi-instagram color-5" />
                      </a>
                    </li>
                    <li className="social-link shadow-lg ">
                      <a className="text-light px-2 fs-4" target="_blank" href="https://www.youtube.com/@ClaimSolutionindia">
                        <i className="bi bi-youtube color-5" />
                      </a>
                    </li>
                    <li className="social-link shadow-lg">
                      <a className="text-light px-2 fs-4" target="_blank" href="#!">
                        <i className="bi bi-whatsapp color-6" />
                      </a>
                    </li>
                    <li className="social-link shadow-lg">
                      <a className="text-light px-2 fs-4" target="_blank" href="https://twitter.com/ClaimSlution">
                        <i className="bi bi-twitter text-primary" />
                      </a>
                    </li>
                    <li className="social-link shadow-lg">
                      <a className="text-light px-2 fs-4" target="_blank" href="#!">
                        <i className="bi bi-linkedin text-primary" />
                      </a>
                    </li>
                  </ul>
        </div>
      </div>
    </>
  )
}