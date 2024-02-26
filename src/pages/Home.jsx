import { Link } from 'react-router-dom'
import * as yup from 'yup'
import { useFormik } from 'formik';
import { addComplaint } from '../apis';
import { toast } from 'react-toastify'
import CountUp from 'react-countup';
import ScrollTrigger from 'react-scroll-trigger';

import { useEffect, useState } from 'react'
export default function Home() {
  const [showPopUpForm, setShowPopUpForm] = useState(true)
  const [loading, setLoading] = useState(false)
  const [isScrollCount, setIsScrollCount] = useState(false)


  const complaintFormik = useFormik({
    initialValues: {
      name: "",
      email: "",
      mobileNo: "",
      claim_type: "",
      complaint_type: "",
      complaint_brief: "",
    },
    validationSchema: yup.object().shape({
      name: yup.string().min(3, "Name must have 3 characters").required("Please enter your name"),
      email: yup.string().email("Must be vaild email").required("Please enter your email"),
      mobileNo: yup.string().required("Please enter mobileNo"),
      claim_type: yup.string(),
      complaint_type: yup.string(),
      complaint_brief: yup.string(),

    }),
    onSubmit: async (values) => {
      try {
        setLoading(true)
        const res = await addComplaint(values)
        if (res?.status == 200 && res?.data?.success) {
          complaintFormik.resetForm()
          setShowPopUpForm(false)
          toast.success(res?.data?.message)
          setLoading(false)
        }
      } catch (error) {
        if (error && error?.response?.data?.message) {
          toast.error(error?.response?.data?.message)
        } else {
          // console.log("add complaint error", error);
          toast.error("Failed to add reference")
        }
        // console.log("Failed to add reference error", error);
        setLoading(false)
      }
    }
  })

  const handlePhoneChange = (e) => {
    const { name, value } = e.target;
    if (!isNaN(Number(value))) {
      if (value.length <= 10) {
        complaintFormik.setFieldValue('mobileNo', value)
      }
    }
  }


  return (
    <>

      {/* <!--popup form Start--> */}
      <div id="myModal" className={`modal ${showPopUpForm && "show"} fade popup-right-side-form`} tabindex="-1" aria-labelledby="exampleModalLabel" aria-modal="true" role="dialog" style={{ display: showPopUpForm && "block" }}>
        <div className="modal-dialog modal-md float-end w-100">
          <div className="modal-content">
            <div className="container-fluid">
              <div className="row shadow-1-strong border border-2 bg-primary border-white rounded-2 p-0">
                <div className="col-md-12 ">
                  <form onSubmit={complaintFormik.handleSubmit}>
                    <div>
                      <button type="button" onClick={() => setShowPopUpForm(!showPopUpForm)} className="btn-close popup-close-btn float-start color-2" data-bs-dismiss="modal" aria-label="Close"></button>
                      <p className="h4 mt-2 my-3 fw-bold text-center py-3 pt-5 color-1">Enquiry Form</p>
                    </div>
                    <div className="my-3">
                      <input type="text" name='name' value={complaintFormik?.values?.name} onChange={complaintFormik?.handleChange} className={`form-control ${complaintFormik?.touched?.name && complaintFormik?.touched?.name && complaintFormik?.errors?.name && "text-danger"}`} id="exampleInputName1" aria-describedby="NameHelp" placeholder="Name*" required="" />
                      {complaintFormik?.touched?.name && complaintFormik?.errors?.name ? (
                        <span className="text-danger">{complaintFormik?.errors?.name}</span>
                      ) : null}
                    </div>
                    <div className="my-3">
                      <input type="email" name='email' value={complaintFormik?.values?.email} onChange={complaintFormik?.handleChange} placeholder="Email Id*" className={`form-control ${complaintFormik?.touched?.email && complaintFormik?.touched?.email && complaintFormik?.errors?.email && "text-danger"}`} id="exampleInputPhoneno1" required="" />
                      {complaintFormik?.touched?.email && complaintFormik?.errors?.email ? (
                        <span className="text-danger">{complaintFormik?.errors?.email}</span>
                      ) : null}
                    </div>
                    <div className="my-3">
                      <input type="text" name='mobileNo' value={complaintFormik?.values?.mobileNo} onChange={(e) => handlePhoneChange(e)} placeholder="Mobile No*" className={`form-control ${complaintFormik?.touched?.mobileNo && complaintFormik?.touched?.mobileNo && complaintFormik?.errors?.mobileNo && "text-danger"}`} id="exampleInputPhoneno1" />
                      {complaintFormik?.touched?.mobileNo && complaintFormik?.errors?.mobileNo ? (
                        <span className="text-danger">{complaintFormik?.errors?.mobileNo}</span>
                      ) : null}
                    </div>
                    <select className={`form-select my-3 ${complaintFormik?.touched?.name && complaintFormik?.touched?.name && complaintFormik?.errors?.name && "text-danger"}`} type="text" name='claim_type' value={complaintFormik?.values?.claim_type} onChange={complaintFormik?.handleChange} aria-label="Default select example" required="">
                      <option selected=""> Type of Claim </option>
                      <option>Health </option>
                      <option>Motor </option>
                      <option>Death </option>
                      <option>ANY Claim </option>
                    </select>
                    {complaintFormik?.touched?.claim_type && complaintFormik?.errors?.claim_type ? (
                      <span className="text-danger">{complaintFormik?.errors?.claim_type}</span>
                    ) : null}
                    <select className={`form-select my-3 ${complaintFormik?.touched?.name && complaintFormik?.touched?.name && complaintFormik?.errors?.name && "text-danger"}`} name='complaint_type' value={complaintFormik?.values?.complaint_type} onChange={complaintFormik?.handleChange} type="text" aria-label="Default select example" required="">
                      <option selected=""> Type of Complaint </option>
                      <option>Claim Rejection </option>
                      <option>Claim - Short Payment </option>
                      <option>Policy Cancel </option>
                      <option>Misselling & Fraud Sales </option>
                      <option>Any Other </option>
                    </select>
                    {complaintFormik?.touched?.complaint_type && complaintFormik?.errors?.complaint_type ? (
                      <span className="text-danger">{complaintFormik?.errors?.complaint_type}</span>
                    ) : null}
                    <div className={`form-floating ${complaintFormik?.touched?.name && complaintFormik?.touched?.name && complaintFormik?.errors?.name && "text-danger"}`}>
                      <textarea class="form-control" name='complaint_brief' value={complaintFormik?.values?.complaint_brief} onChange={complaintFormik?.handleChange} placeholder="Leave a comment here" id="floatingTextarea"></textarea>
                      <label for="floatingTextarea">Brief Your Complaint </label>
                    </div>
                    {complaintFormik?.touched?.complaint_brief && complaintFormik?.errors?.complaint_brief ? (
                      <span className="text-danger">{complaintFormik?.errors?.complaint_brief}</span>
                    ) : null}
                    <div className="d-flex  justify-content-center">
                      <button type="submit" aria-disabled={loading} className={loading ? "d-flex align-items-center justify-content-center gap-3 btn bg-color-5 color-1 my-3 form-control disabled" : "d-flex align-items-center justify-content-center gap-3 btn bg-color-2 color-1 my-3 form-control"}>
                        {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span> : <span>Submit</span>}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!--popup form End-->s */}

      {/* Welcome to claimsolutions.in */}
      <div className="container-fluid">
        <div className="container-px-5d card-h-90">
          <div className="align-items-center h-100 row px-md-5">
            <div className="col-sm-6">
              <div>
                <p className="fs-1 fw-bold">Welcome to claimsolutions.in </p>
                <p className='h5'> At Claimsolution.in, we specialize in providing comprehensive solutions for policyholders facing unjustified insurance claim rejections or policy cancellations. Our mission is to assist individuals throughout India in resolving disputes and resurrecting terminated policies.</p>
                <Link to="/client/signup">
                  <div className="bg-color-4 btn m-1 p-3 color-1 mt-3 rounded-4">
                    Register Complaint
                  </div>
                </Link>
                {/* <div className="bg-color-2 btn m-1 p-3 mt-3 rounded-5">
                      <Link to="tel: 9205530811" className="color-1">9205530811</Link>
                    </div> */}
              </div>
            </div>
            <div className="col-sm-6">
              <div className="">
                <div id="carouselExampleAutoplaying" className="carousel slide" data-bs-ride="carousel">
                  <div className="carousel-inner">
                    <div className="carousel-item active">
                      <img src="/Images/home/1.png" className="d-block w-100" alt="..." />
                    </div>
                    <div className="carousel-item">
                      <img src="/Images/home/2.png" className="d-block w-100" alt="..." />
                    </div>
                  </div>
                </div>
                {/* <img src="/Images/home/ClaimSolution-banner.png" alt="" className="img-fluid w-100 card-shadow" /> */}

                {/* <div className="col-sm-6">
                    <img src="/Images/home-img/demo2.png" alt="" className="img-fluid w-100 card-shadow" />
                  </div>
                  <div className="col-sm-6">
                    <img src="/Images/home-img/demo1.png" alt="" className="img-fluid w-100 card-shadow" />
                  </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Services */}
      <div className="container-fluid bg-color-9 color-1 pb-3 pt-5">

        <div className="container-px-5">
          <div className="text-center fw-bold fs-1 color-1">Our Services</div>
          <div className="text-center py-3 w-100 d-flex align-items-center justify-content-center">
            <p className='w-75 color-2'>
              We empower individuals to demand justice and hold those who wronged or mistreated them accountable. Explore the range of services we offer to take action and fight for your rights.
            </p>
          </div>
          <center>
            <ul className="accordion-button badge border-bottom border-2 border-white btn-group-vertical nav nav-pills" id="pills-tab" role="tablist">
              <li className="m-0 nav-item " role="presentation">
                <button className="nav-link w-100 active " id="pills-health-tab" data-bs-toggle="pill" data-bs-target="#pills-health" type="button" role="tab" aria-controls="pills-health" aria-selected="true">
                  <img src="/Images/icons/healthcare.png" alt="" className='btn-icon' />
                  <br />Health insurance claim solution
                </button>
              </li>
              <li className="m-0 nav-item " role="presentation">
                <button className="nav-link w-100" id="pills-motor-tab" data-bs-toggle="pill" data-bs-target="#pills-motor" type="button" role="tab" aria-controls="pills-motor" aria-selected="false">
                  <img src="/Images/icons/car-insurance.png" alt="" className='btn-icon' />
                  <br />Motor insurance claim solution
                </button>
              </li>
              <li className="m-0 nav-item " role="presentation">
                <button className="nav-link w-100" id="pills-death-tab" data-bs-toggle="pill" data-bs-target="#pills-death" type="button" role="tab" aria-controls="pills-death" aria-selected="false">
                  <img src="/Images/icons/life-insurance.png" alt="" className='btn-icon' />
                  <br />Death claim solution
                </button>
              </li>
              <li className="m-0 p-0 nav-item " role="presentation">
                <button className="nav-link w-100" id="pills-insurance-tab" data-bs-toggle="pill" data-bs-target="#pills-insurance" type="button" role="tab" aria-controls="pills-insurance" aria-selected="false">
                  <img src="/Images/icons/insurance.png" alt="" className='btn-icon' />
                  <br />Any insurance claim solution
                </button>
              </li>
            </ul>
          </center>
          <div className="tab-content mt-5" id="pills-tabContent">
            <div className="active alert fade show tab-pane" id="pills-health" role="tabpanel" aria-labelledby="pills-health-tab" tabindex="0">

              <div className="row">
                <div className="col-12 col-md-6">
                  <img src="Images/home-img/Health-Insurance.png" alt="" className="w-100 rounded-4" />
                </div>
                <div className="col-12 col-md-6">
                  <h2 className='pt-4 pb-2 color-1'>Health Insurance Claim Solution</h2>
                  <p className='color-2 fs-5'>Health Claim Solution: In India, health and mediclaim insurance claims can be rejected for various reasons. Some common rejection reasons include misrepresentation or non-disclosure, exclusions, waiting periods, sub-limits, and more. Claimsolution.in has a team of experienced Health Claim experts who can help you get your rejected health claim approved through the proper channels. Register your complaint today to get the compensation you deserve.</p>
                  <Link to="/Health-insurance-claim-solution" className="bg-color-4 btn rounded-2 color-1">Know more </Link>
                </div>
              </div>
            </div>
            <div className="alert fade show tab-pane" id="pills-motor" role="tabpanel" aria-labelledby="pills-motor-tab" tabindex="0">
              <div className="row">
                <div className="col-12 col-md-6">
                  <img src="Images/home-img/Motor-Insurance-Claim-Solution.png" alt="" className="w-100 rounded-4" />
                </div>
                <div className="col-12 col-md-6">
                  <h2 className='pt-4 pb-2 color-1'>Motor Insurance Claim Solution</h2>
                  <p className='color-2 fs-5'> Motor Claim Solution: Motor or car insurance claims in India can be rejected for reasons such as non-disclosure, driving without a valid license, and policy lapses. Our experienced Motor Claim experts can help you navigate the process and get your rejected motor or car insurance claim approved. Register your complaint today for a solution.</p>
                  <Link to="/Health-insurance-claim-solution" className="bg-color-4 btn rounded-2 color-1">Know more </Link>
                </div>
              </div>
            </div>
            <div className="alert fade show tab-pane" id="pills-death" role="tabpanel" aria-labelledby="pills-death-tab" tabindex="0">
              <div className="row">
                <div className="col-12 col-md-6">
                  <img src="Images/home-img/Death-Claim-Solution.png" alt="" className="w-100 rounded-4" />
                </div>
                <div className="col-12 col-md-6">
                  <h2 className='pt-4 pb-2 color-1'>Death Claim Solution</h2>
                  <p className='color-2 fs-5'>Death or Accident Claim Solution: Death or accident insurance claims can be rejected for various reasons, including non-disclosure, policy lapses, exclusions, and more. Our Death or Accident Claim experts are here to assist you in getting your rejected claims approved through the proper channels. Register your complaint today to ensure you receive the compensation you deserve.</p>
                  <Link to="/Death-Claim-Solution" className="bg-color-4 btn rounded-2 color-1">Know more </Link>
                </div>
              </div>
            </div>
            <div className="alert fade show tab-pane" id="pills-insurance" role="tabpanel" aria-labelledby="pills-insurance-tab" tabindex="0">
              <div className="row">
                <div className="col-12 col-md-6">
                  <img src="Images/home-img/Any-Insurance-Claim-Solution.png" alt="" className="w-100 rounded-4" />
                </div>
                <div className="col-12 col-md-6">
                  <h2 className='pt-4 pb-2 color-1'>Any Insurance Claim Solution</h2>
                  <p className='color-2 fs-5'> Any Insurance Claim Solution: Insurance claims can be rejected for a wide range of reasons, including non-disclosure, policy lapses, and non-cooperation. Our expert team can help you navigate these challenges and get your insurance claim approved. Register your complaint today to get the support you need.</p>
                  <Link to="/Any-Insurance-Claim-Solution" className="bg-color-4 btn rounded-2 color-1">Know more </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Our Achievements */}
      <div className="container-fluid py-md-5 py-5" id="bg-image" onLoad={() => { console.log("scroll up!") }}>
        <div className="container-px-5 my-md-5">
          <div className="row">
            <div className="color-1 fw-bold h1 mb-md-5 pb-md-3 text-center">Our Achievement</div>
            <div className="col-6 col-md-3">
              <div className="bg-transparent border-0 box-shadow-2 card p-4 shadow">
                {/* <img src="" alt="" />
                <div className="color-1 fs-3 text-center">demo</div> */}
                <div>
                  <ScrollTrigger onEnter={() => setIsScrollCount(true)} onExit={() => setIsScrollCount(false)}>
                    <p class="color-1 h1 fw-bold text-center js-count-up">
                      {isScrollCount && <CountUp
                        start={0}
                        delay={0}
                        end={2300}
                        duration={3}
                        suffix='+'
                      // separator=" "
                      // decimals={0}
                      // decimal=","
                      ></CountUp>}
                    </p>
                  </ScrollTrigger>
                  <p class="text-warning fs-5 text-center">Resolved: Insurance</p>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="bg-transparent border-0 box-shadow-2 card p-4 shadow">
                {/* <img src="" alt="" />
                <div className="color-1 fs-3 text-center">demo</div> */}
                <div>
                   <ScrollTrigger onEnter={() => setIsScrollCount(true)} onExit={() => setIsScrollCount(false)}>
                    <p class="color-1 h1 text-center js-count-up fw-bold" data-value="2500">
                      {isScrollCount && <CountUp
                        start={0}
                        delay={0}
                        end={19}
                        duration={3}
                        suffix=' Cr+'
                      // separator=" "
                      // decimals={0}
                      // decimal=","
                      ></CountUp>}
                    </p>
                  </ScrollTrigger>
                  <p class="text-warning fs-5 text-center">Worth: Claims</p>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="bg-transparent border-0 box-shadow-2 card p-4 shadow">
                {/* <img src="" alt="" />
                <div className="color-1 fs-3 text-center">demo</div> */}
                <div>
                   <ScrollTrigger onEnter={() => setIsScrollCount(true)} onExit={() => setIsScrollCount(false)}>
                    <p class="color-1 h1 fw-bold text-center js-count-up" data-value="2500">
                      {isScrollCount && <CountUp
                        start={0}
                        delay={0}
                        end={2065}
                        duration={3}
                        suffix='+'
                      // separator=" "
                      // decimals={0}
                      // decimal=","
                      ></CountUp>}
                    </p>
                  </ScrollTrigger>
                  <p class="text-warning fs-5 text-center">Happy: Customers</p>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="bg-transparent border-0 box-shadow-2 card p-4 shadow">
                {/* <img src="" alt="" />
                <div className="color-1 fs-3 text-center">demo</div> */}
                <div>
                   <ScrollTrigger onEnter={() => setIsScrollCount(true)} onExit={() => setIsScrollCount(false)}>
                    <p class="h1 fw-bold color-1 text-center js-count-up" data-value="2500">
                      {isScrollCount && <CountUp
                        start={0}
                        delay={0}
                        end={1000}
                        duration={3}
                        suffix='+'
                      // separator=" "
                      // decimals={0}
                      // decimal=","
                      ></CountUp>}
                    </p>
                  </ScrollTrigger>
                  <p class="text-warning fs-5 text-center">Strong: Network</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose us */}
      <div className="container-fluid pt-5 pb-5">
        <div className="container-px-5">
          <h2 className="fw-bold text-center mb-3">Why Choose Us</h2>
          <p className='pb-3 h5 text-center'>For multiple convincing reasons, Claimsolution.in stands out as the right partner in insurance claim solutions</p>
          <div id="carouselExampleIndicators" className="carousel slide pb-5" data-bs-ride="true">
            <div className="carousel-indicators">
              <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
              <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
            </div>
            <div className="carousel-inner">
              <div className="carousel-item active" data-bs-interval="5000">
                <div className="row row-cols-1 row-cols-md-3 g-3">
                  <div className="col">
                    <div className="card h-100">
                      <img src="/Images/home/Insurance-Claim-Resolution.png" className="card-img-top" alt="Insurance-Claim-Resolution" />
                      <div className="card-body bg-color-4 color-1">
                        <h5 className="card-title fw-bold">Expertise</h5>
                        <p className="card-text">Benefit from our team's extensive knowledge and experience in navigating the complexities of insurance claims. Our extensive experience provides an effective and efficient solution personalized to your specific requirements. </p>
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="card h-100">
                      <img src="/Images/home/Support-for-Victims-of-Sexual-Harassment.png" className="card-img-top" alt="Insurance-Claim-Resolution" />
                      <div className="card-body bg-color-4 color-1">
                        <h5 className="card-title fw-bold"> Advocacy for Your Rights </h5>
                        <p className="card-text">We are your advocates fighting for justice when insurance companies deny claims or break down policies without reason. Our primary concerns are the rights you have and comfort. </p>
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="card h-100">
                      <img src="/Images/home/Farmers-Crop-Insurance-Advocate.png" className="card-img-top" alt="Insurance-Claim-Resolution" />
                      <div className="card-body bg-color-4 color-1">
                        <h5 className="card-title fw-bold">Transparency</h5>
                        <p className="card-text">Throughout your claim resolution journey, you will encounter a straightforward and open communication procedure. We believe in keeping you informed at all times to create trust and confidence. <br /><br /></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="carousel-item" data-bs-interval="5000">
                <div className="row row-cols-1 row-cols-md-3 g-3">
                  <div className="col">
                    <div className="card h-100">
                      <img src="/Images/home/Protecting-Women's-Rights.png" className="card-img-top" alt="Insurance-Claim-Resolution" />
                      <div className="card-body bg-color-4 color-1">
                        <h5 className="card-title fw-bold"> Client-Centric Approach </h5>
                        <p className="card-text">Our major objective is your pleasure. Because we take a client-centric approach, we personalize our services to your unique needs, offering a happy and comforting experience during times of difficulty. </p>
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="card h-100">
                      <img src="/Images/home/Legal-Aid-for-the-Less-Privileged.png" className="card-img-top" alt="Insurance-Claim-Resolution" />
                      <div className="card-body bg-color-4 color-1">
                        <h5 className="card-title fw-bold"> Unwavering Support </h5>
                        <p className="card-text">Insurance claim problems might be intimidating, but you don't have to go through them alone. Claimsolution.in is dedicated to delivering unwavering help, leading you from start to end with empathy and professionalism. </p>
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="card h-100">
                      <img src="/Images/home/Stolen-Car.png" className="card-img-top" alt="Insurance-Claim-Resolution" />
                      <div className="card-body bg-color-4 color-1">
                        <h5 className="card-title fw-bold">Nationwide Accessibility</h5>
                        <p className="card-text">Our services are available throughout India, ensuring that individuals and partners have access to them. Claimsolution.in is ready to assist you wherever you are, delivering our dedication to justice and fairness to policyholders across the country.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>
        <p className='fs-5 text-center m-0'>Choose Claimsolution.in if you want a dependable partner that is committed to fairness, transparency, and your overall pleasure when it comes to negotiating the complexity of insurance claims .</p>
      </div>

      {/* Our Commitment to You */}
      <div className="container-fluid bg-color-3 pt-3 bt-3">
        <div className="container-px-5">
          <div className="row">
            <h2 className="fw-bold text-center color-1 mt-4 mb-3">Our Commitment to You</h2>
            <div className="col-sm-12">
              <p className='text-center pb-3 h5'>Our desire to providing you with honesty, openness, and quality drives our commitment at Claimsolution.in. We realize the difficulties that come with dealing with insurance claims, and we are here to help you every step of the way. </p>
            </div>
            <div className="row mt-4">
              <div className="col-12 col-md-6 pb-4 ">
                <div className="row p-0 m-0 h-100 rounded-4 bg-color-1 shadow align-items-center">
                  <div className="border border-bottom-0 border-end border-start-0 border-top-0 col-12 col-md-6 m-0 p-0">
                    <img src="/Images/home-img/transparency.png" alt="img-fluid" className=" rounded-4 rounded-end w-100" />
                  </div>
                  <div className='col-12 col-md-6'>
                    <div className="">
                      <h5 className="fw-bold text-center color-2"> Transparency </h5>
                      <p className=""> We believe in transparency and open communication. Our methods are open and honest so you will be informed and empowered along the trip. You can rely on us to give simple and honest advice, making the insurance claim procedure as transparent as possible. </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6 pb-4">
                <div className="row p-0 m-0 h-100 rounded-4 bg-color-1 shadow align-items-center">
                  <div className="border border-bottom-0 border-end border-start-0 border-top-0 col-12 col-md-6 m-0 p-0">
                    <img src="/Images/home-img/advocacy.png" alt="img-fluid" className=" rounded-4 rounded-end w-100" />
                  </div>
                  <div className="col-12 col-md-6">
                    <h5 className="card-title fw-bold text-center color-2"> Advocacy </h5>
                    <p className="card-text"> Your rights are important. We act as your fighters when insurance companies unfairly reject claims or terminate policies without a valid explanation. We are dedicated to fighting for your rights and ensuring that insurance companies treat you fairly. </p>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6 pb-4">
                <div className="row p-0 m-0 h-100 rounded-4 bg-color-1 shadow align-items-center">
                  <div className="border border-bottom-0 border-end border-start-0 border-top-0 col-12 col-md-6 m-0 p-0">
                    <img src="/Images/home-img/expertise.png" alt="img-fluid" className=" rounded-4 rounded-end w-100" />
                  </div>
                  <div className="col-12 col-md-6">
                    <h5 className="card-title fw-bold text-center color-2"> Expertise </h5>
                    <p className="card-text"> We contribute experience to each case by assembling a team of skilled specialists. Because we understand insurance claim processes, we can negotiate complications and strive toward the best possible conclusion for you. You can count on our knowledge to help you navigate the often complex world of insurance claims. </p>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6 pb-4">
                <div className="row p-0 m-0 h-100 rounded-4 bg-color-1 shadow align-items-center">
                  <div className="border border-bottom-0 border-end border-start-0 border-top-0 col-12 col-md-6 m-0 p-0">
                    <img src="/Images/home-img/client-centric-approach.png" alt="img-fluid" className=" rounded-4 rounded-end w-100" />
                  </div>
                  <div className="col-12 col-md-6">
                    <h5 className="card-title fw-bold text-center color-2"> Client-Centric Approach </h5>
                    <p className="card-text"> Our mission is centered on your happiness. We approach each case with a client-centered perspective, adapting our services to your specific requirements. Our objective is not just to resolve claims, but also to offer you a good and comforting experience during a difficult time.</p>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6 pb-4">
                <div className="row p-0 m-0 h-100 rounded-4 bg-color-1 shadow align-items-center">
                  <div className="border border-bottom-0 border-end border-start-0 border-top-0 col-12 col-md-6 m-0 p-0">
                    <img src="/Images/home-img/support.png" alt="img-fluid" className=" rounded-4 rounded-end w-100" />
                  </div>
                  <div className="col-12 col-md-6">
                    <h5 className="card-title fw-bold text-center color-2"> Support </h5>
                    <p className="card-text"> We are here to help you every step of the way. Whether you are a policyholder seeking assistance with a claim or a partner working with us, we are committed to delivering steadfast support. Our top concerns are your pleasure and peace of mind. </p>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="col-sm-6">
                <img src="/Images/home/our-Commitment.png" alt="" className='img-fluid'/>
              </div> */}
            <p className='h5 text-center mb-5'>Claimsolution.in is more than simply a service; it is a pledge to fairness, justice, and your well-being. Allow us to be your committed partner in negotiating the complexity of insurance claims, and let our dedication serve as the foundation of your experience with us. </p>
          </div>
        </div>
      </div>
    </>
  )
}