import './Services.css'
import { Link } from 'react-router-dom'
import { Helmet } from "react-helmet";
export default function Health_Insurance(){
    return(
        <>
        <Helmet>
        <link rel="canonical" href="http://claimsolution.in/Health-insurance-claim-solution" />
      </Helmet>
            {/*=============== first intro ===============*/}
            <div className="container-fluid">
                <div className="container-px-5 mt-4 mb-3 ">
                    <div className="row">
                        <div className="col-sm-6">
                            <img src="Images/home-img/Health-Insurance.png" className="img-fluid w-100 card-shadow" alt="Health-Insurance" />
                        </div>
                        <div className="col-sm-6">
                            <div className="h1 fw-bold p-2 mt-5 color-2">Your health is your wealth, and we're here to protect it.</div>
                            <Link to="/client/signup">
                                <div className="bg-color-4 btn m-1 px-3 py-2 mt-3 rounded-3 color-1"> Register Complaint </div>
                            </Link>
                            <Link to="tel: 9205530811">
                                <div className="bg-color-4 btn m-1 px-3 py-2 mt-3 rounded-3 color-1"> 9205530811 </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/*=============== first paragraph ===============*/}
            <div className="container-fluid mt-4  py-5">
                <div className="container-px-5 pb-4 pt-5">
                    <div className="row">
                        <div className="h2 fw-bold color-2 text-center">Health Insurance Claim Solution</div>
                        <p className='text-center py-4 fs-5'>We understand that dealing with health insurance claims may be a complicated or even stressful process. Our Health Insurance Claim Solution is designed to offer you experienced support as you get the medical treatment you need. Here are some of the reasons why you should put your health insurance claims in our hands</p>
                    </div>
                </div>
            </div>

            {/*=============== How We Can Assist You ===============*/}
            <div className="container-fluid pt-4 pb-4 bg-color-9">
                <div className="container-px-5">
                    <div className="row">
                        <div className="text-center h2 fw-bold color-2">How We Can Assist You</div>
                        <div className="row row-cols-1 row-cols-md-4 g-3">
                            <div className="col">
                                <div className="border-0 card shadow h-100">
                                <img src="/Images/service/h-expert-guidance.png" className="card-img-top card-image" alt="Rejected" />
                                <div className="bg-color-1 border border-bottom-0 border-end-0 border-start-0 card-body cardView">
                                    <h5 className="card-title fw-bold">Expert Guidance </h5>
                                    <p className="card-text"> Our team of experts is made of professionals who are experts in health insurance policies and claim procedures. We provide expert advice to help you efficiently discuss the complicated details as well as specifics of health insurance claims. </p>
                                </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="border-0 card shadow h-100">
                                <img src="/Images/service/h-timely-resolution.png" className="card-img-top card-image" alt="Claims Documentation" />
                                <div className="bg-color-1 border border-bottom-0 border-end-0 border-start-0 card-body cardView">
                                    <h5 className="card-title fw-bold">Timely Resolution </h5>
                                    <p className="card-text">We understand the importance of having quick claim settlement, especially for health-related problems. Our efficient systems ensure that your health insurance claim is processed quickly, making it possible for you to spend your time staying healthy. </p>
                                </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="border-0 card shadow h-100">
                                <img src="/Images/service/h-advocacy-for-your-health.png" className="card-img-top card-image" alt="Negotiation and Advocacy" />
                                <div className="bg-color-1 border border-bottom-0 border-end-0 border-start-0 card-body cardView">
                                    <h5 className="card-title fw-bold"> Advocacy for Your Health </h5>
                                    <p className="card-text">Your health is our top card-image priority. We will act as an advocate when faced with unfair claim denials or challenges, searching to ensure that your health insurance claim gets managed properly and in according with the terms and conditions of your policy. </p>
                                </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="border-0 card shadow h-100">
                                <img src="/Images/service/h-clear-communication.png" className="card-img-top card-image" alt="Peace of Mind" />
                                <div className="bg-color-1 border border-bottom-0 border-end-0 border-start-0 card-body cardView">
                                    <h5 className="card-title fw-bold">Clear Communication </h5>
                                    <p className="card-text">It has to be important to understand the details of your health insurance claim. Across the process, we maintain a clear and open conversation, keeping you updated on the status of your claim and taking care of any issues you may have. </p>
                                </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="border-0 card shadow h-100">
                                <img src="/Images/service/h-personalized-assistance.png" className="card-img-top card-image" alt="Peace of Mind" />
                                <div className="bg-color-1 border border-bottom-0 border-end-0 border-start-0 card-body cardView">
                                    <h5 className="card-title fw-bold">Personalized Assistance</h5>
                                    <p className="card-text">Every health insurance claim is different. We provide particular guidance that is targeted to your unique needs, ensuring that you receive the most benefits and coverage given under your health insurance policy. </p>
                                </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="border-0 card shadow h-100">
                                <img src="/Images/service/h-compassionate-support.png" className="card-img-top card-image p-3" alt="Peace of Mind" />
                                <div className="bg-color-1 border border-bottom-0 border-end-0 border-start-0 card-body cardView">
                                    <h5 className="card-title fw-bold"> Compassionate Support</h5>
                                    <p className="card-text">Dealing with health problems may be stressful. Our team provides supportive assistance, guiding you with respect and understanding through the whole health insurance claim procedure. </p>
                                </div>
                                </div>
                            </div>
                        </div>
                        <p className='mt-5 text-center'>Claimsolution.in is here to be your trusted partner in health insurance claim solutions, if you're struggling with claim denials, require clarity on policy coverage, or need support with documentation. Feel the comfort of knowing that a dedicated team is working hard to protect how well you're doing.</p>
                        <p className='fw-bold text-center'>Your health is your wealth, and we're here to protect it.</p>
                    </div>
                </div>
            </div>
        </>
    )
}