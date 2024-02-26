// import style from './about.module.css'
// import { Link } from "react-router-dom"
export default function About() {
  return (
    <>

      {/* First part */}
      <div className="container-fluid mb-3 pt-5">
        <div className="container-px-5">
          <div className="row align-items-center">
            <div className="col-sm-6">
              <div className="fw-bold h1 mt-5 p-2">
                <p>About Us - Empowering Justice and Legal Resolution</p>
                <p className='h5'> Welcome to Claimsolution.in, the trusted advisor you need to understand the complex world of insurance claims. We are dedicated to offering complete answers and unwavering assistance to customers who are experiencing difficulty with their insurance claims. Here's a quick rundown of who we are: </p>
              </div>
            </div>
            <div className="col-sm-6">
              <img src="Images/about-us/empowering-justice-and-legal-resolution.png" alt="" className="img-fluid w-100 mb-3" />
            </div>
          </div>
        </div>
      </div>

      {/* Our Mission and Values */}
      <div className="container-fluid bg-color-9 py-5">
        <div className="container-px-5">
          <div className="row row-cols-1 row-cols-md-4 g-3">
            <div className="">
              <div className="card h-100 rounded-5 bg-color-1 color-2 card-zoom-in-out-box">
              <img className="card-img-top" src="Images/about-us/our-mission.png" alt="Our Mission"/>
                <div className="card-body">
                  <h5 className="card-title fw-bold text-center"> Our Mission </h5>
                  <p className="card-text">The mission we have at Claimsolution.in is simple: we want to connect the gap between policyholders and insurance providers. Our purpose is to provide individuals who have been targeted by unfair claim denials or policy cancellations with fair treatment and fast resolution. </p>
                </div>
              </div>
            </div>
            <div className="">
              <div className="card h-100 rounded-5 bg-color-1 color-2 card-zoom-in-out-box card-zoom-in-out-box">
              <img className="card-img-top" src="Images/about-us/our-values.png" alt="Our Values"/>
                <div className="card-body">
                  <h5 className="card-title fw-bold text-center"> Our Values </h5>
                  <p className="card-text">Our service is built on transparency, honesty, and devotion. In every engagement, we stress open communication and respect the highest ethical standards. Every part of our work is guided by our dedication to justice. </p>
                </div>
              </div>
            </div>
            <div className="">
              <div className="card h-100 rounded-5 bg-color-1 color-2 card-zoom-in-out-box">
              <img className="card-img-top" src="Images/about-us/expertise-and-experience.png" alt="Expertise and Experience"/>
                <div className="card-body">
                  <h5 className="card-title fw-bold text-center"> Expertise and Experience </h5>
                  <p className="card-text">Our team is made up of specialists who have a great deal with insurance claim processes. We handle difficulties with an in-depth knowledge of the industry to give effective solutions suited to the specific demands of each situation.</p>
                </div>
              </div>
            </div>
            <div className="">
              <div className="card h-100 rounded-5 bg-color-1 color-2 card-zoom-in-out-box">
              <img className="card-img-top" src="Images/about-us/advocacy-for-your-rights.png" alt="Advocacy for Your Rights"/>
                <div className="card-body">
                  <h5 className="card-title fw-bold text-center"> Advocacy for Your Rights </h5>
                  <p className="card-text"> We step in as support for your rights when insurance companies unjustly reject claims or cancel policies without a valid explanation. Our objective is to provide each policyholder with fair treatment and a just settlement.</p>
                </div>
              </div>
            </div>
            <div className="">
              <div className="card h-100 rounded-5 bg-color-1 color-2 card-zoom-in-out-box">
              <img className="card-img-top" src="Images/about-us/client-centric-approach.png" alt="Client-Centric Approach"/>
                <div className="card-body">
                  <h5 className="card-title fw-bold text-center"> Client-Centric Approach </h5>
                  <p className="card-text">Our primary focus is your pleasure. We take a client-centric approach, adapting our services to your individual requirements. We specialize on creating solutions that prioritize your well-being, whether you're an individual policyholder or a collaborative partner. </p>
                </div>
              </div>
            </div>
            <div className="">
              <div className="card h-100 rounded-5 bg-color-1 color-2 card-zoom-in-out-box">
              <img className="card-img-top" src="Images/about-us/nationwide-presence.png" alt="Nationwide Presence"/>
                <div className="card-body">
                  <h5 className="card-title fw-bold text-center"> Nationwide Presence </h5>
                  <p className="card-text"> Our services are available across India and are based in  Delhi. Claimsolution.in is here to assist you wherever you are, delivering our dedication to justice and fairness to policyholders nationwide. </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* Why Choose Claimsolution */}
      <div className="container-fluid bg-color-1 py-5">
        <div className="container-px-5">
          <div className="row">
            <div className="col-sm-6">
              <img src="/Images/home/Claim-your-justice.png" alt="Claim-your-justice" className="img-fluid" />
            </div>
            <div className="col-sm-6">
              <div className="fw-bold h4 mt-5 color-2"> Why Choose Claimsolution </div>
              <ul class=" list-unstyled">
                <li class="mb-2"> Expertise in insurance claim processes</li>
                <li class="mb-2"> Advocacy for your rights</li>
                <li class="mb-2"> Transparent and ethical approach </li>
                <li class="mb-2"> Client-centric services </li>
                <li class="mb-2"> Nationwide accessibility </li>
              </ul>
              <p className="mt-3 fw-bold text-center">Claimsolution.in as your insurance claim solution partner. Trust us to be your guide on the way to just and equitable insurance claim resolutions.</p>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}