import { Link } from "react-router-dom"
export default function Patnership() {
    return (
        <>
            {/* PARTNER para */}
            <div className="container-fluid py-5 color-2">
                <div className="container-px-5">
                    <div className="fs-1 text-center fw-bold">PARTNERSHIP</div>
                    <div className="text-center fs-6">Joining up with Claimsolution.in as a partner opens the door to an effective and collaborative experience. You play an important role as a partner in providing exceptional services and support to policyholders across India. Here's how you can become a valuable Claimsolution.in partner.</div>
                </div>
            </div>

            {/* about para */}
            <div className="container-fluid bg-color-1 py-5">
                <div className="container-px-5">
                    <div className="row row-cols-1 row-cols-md-4 g-3">
                        <div className="">
                            <div className="card h-100 rounded-5 card-shadow">
                                <div className="card-body">
                                    <h5 className="card-title fw-bold text-center">Partner Login </h5>
                                    <p className="card-text">Visit the Partner Login page to gain access to our exclusive partner site. As a registered partner, you will have exclusive access to resources, tools, and information that will help you better support policyholders.</p>
                                </div>
                            </div>
                        </div>
                        <div className="">
                            <div className="card h-100 rounded-5 card-shadow">
                                <div className="card-body">
                                    <h5 className="card-title fw-bold text-center"> Collaborative Opportunities </h5>
                                    <p className="card-text">Investigate collaboration options that match your experience and business objectives. There are many ways to partner with Claimsolution.in, whether you are an individual professional, an insurance agency, an advocate,  or a connected service provider.</p>
                                </div>
                            </div>
                        </div>
                        <div className="">
                            <div className="card h-100 rounded-5 card-shadow">
                                <div className="card-body">
                                    <h5 className="card-title fw-bold text-center">  Registration Process </h5>
                                    <p className="card-text">Not a partner yet? Signing up is easy. Navigate to our Partner Signup page, where you can provide essential details about your business or services. Once registered, you'll gain access to the partner portal and be ready to embark on a collaborative partnership.</p>
                                </div>
                            </div>
                        </div>
                        <div className="">
                            <div className="card h-100 rounded-5 card-shadow">
                                <div className="card-body">
                                    <h5 className="card-title fw-bold text-center"> Training and Support </h5>
                                    <p className="card-text">Stay up to date on industry trends, claim procedures, and best practices by taking advantage of training programs and continuing assistance. Our mission is to provide our partners with the information and resources they need to succeed.</p>
                                </div>
                            </div>
                        </div>
                        <div className="">
                            <div className="card h-100 rounded-5 card-shadow">
                                <div className="card-body">
                                    <h5 className="card-title fw-bold text-center">  Partner Benefits </h5>
                                    <p className="card-text">Enjoy exclusive partner benefits, including priority support, co-marketing opportunities, and access to a network of like-minded professionals. As a Claimsolution.in partner, your success is our success.</p>
                                </div>
                            </div>
                        </div>
                        <div className="">
                            <div className="card h-100 rounded-5 card-shadow">
                                <div className="card-body">
                                    <h5 className="card-title fw-bold text-center"> Nationwide Reach </h5>
                                    <p className="card-text">Our services are available across India, allowing partners to serve policyholders across the country. Claimsolution.in guarantees that our collective efforts have a large and important impact, no matter where you are.</p>
                                </div>
                            </div>
                        </div>
                        <div className="">
                            <div className="card h-100 rounded-5 card-shadow">
                                <div className="card-body">
                                    <h5 className="card-title fw-bold">  Collaborate for Impact </h5>
                                    <p className="card-text text-center">Work with Claimsolution.in to make a difference in the lives of policyholders. Whether you work in insurance, legal support, medical support, or a similar industry, there is a place for you in our network of partners dedicated to achieving justice and fairness in insurance claims.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="container-fluid bg-color-1 py-5">
                <div className="container-px-5">
                    <div className="row">
                    <div className="">
                            <div className=" h-100">
                                <p className="">
                                    <p className="card-text text-center fs-5">Are you ready to go on this partnership journey with us? Visit our Partner Signup page to take the first step toward becoming a trusted Claimsolution.in partner. We can make a difference in the world of insurance claim solutions if we work together.</p>
                                     <div className="d-flex align-items-center justify-content-center">
                                         <button className="color-1 btn bg-color-3 "><Link to="/partner/signin" target='_blank' className="color-1">Click to Join</Link></button>
                                        </div> 
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}