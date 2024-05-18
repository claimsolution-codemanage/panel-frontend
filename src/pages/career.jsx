import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {toast} from 'react-toastify'
import Loader from "../components/Common/loader";
import { viewAllJob } from "../apis";
import { Helmet } from "react-helmet";

export default function Career(){
    const [data,setData] = useState([])
    const [loading,setLoading] = useState(false)
    
    const getAllJob =async()=>{
        setLoading(true)
        try {
          const res = await viewAllJob()
        //   console.log("viewAllJob", res?.data?.data);
          if (res?.data?.success && res?.data?.data) {
            setData([...res?.data?.data])
            setLoading(false)
          }
        } catch (error) {
          if (error && error?.response?.data?.message) {
            toast.error(error?.response?.data?.message)
          } else {
            toast.error("Something went wrong")
          }
        //   console.log("viewAllJob error", error);
        }
      }
    
      useEffect(() => {
            getAllJob()
      }, [])
return(
        <>   
              <Helmet>
        <link rel="canonical" href="http://claimsolution.in/career" />
      </Helmet> 
            {/* Career */}
            <div className="container-fluid color-2  pt-3 pb-3">
                <div className="container-px-5 my-3">
                    <div className="fs-1 fw-bold text-center mb-4 mt-4">Career</div>
                    <div className="row">
                        <div className="col-sm-6 ">
                            <img src="/Images/home/career.jpg" alt="career" className='img-fluid card-shadow' />
                        </div>
                        <div className="col-sm-6">
                            <div className="fs-5">
                            <p className='lh-lg mt-5'> Claimsolution.in is a place where those who are positive about making a difference in the area of insurance claim solutions may find exciting possibilities. Join us in a mission to offer policyholders experiencing issues with fair and reasonable outcomes. Here are some of the reasons why working at Claimsolution.in is a good idea. </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* category */}
            <div className="container-fluid bg-color-3 pt-3 pb-5">
                <div className="container-px-5 mt-5 mb-3">
                    <div className="color-1">
                    <p className='text-center'> Welcome to the Claimsolution.in blog, your go-to resource for insightful content covering a variety of topics related to insurance, claims, industry trends, and valuable tips. Dive into our collection of blogs designed to inform, empower, and keep you up-to-date on the latest developments in the insurance landscape.</p>
                    <div className="row mt-4">
                        <div className="col-12 col-md-4 pt-4">
                        <div className="card h-100 rounded-5 bg-color-4">
                            <div className="card-body bg-color-3">
                            <h5 className="card-title fw-bold text-center"> Mission-Driven Work </h5>
                            <p className="card-text"> Join a team dedicated to making a difference in the lives of policyholders. Claimsolution.in attempts to bridge the gap between policyholders and insurance providers by assuring fairness and quick responses</p>
                            </div>
                        </div>
                        </div>
                        <div className="col-12 col-md-4 pt-4">
                        <div className="card h-100 rounded-5 bg-color-4">
                            <div className="card-body bg-color-3">
                            <h5 className="card-title fw-bold text-center"> Professional Growth </h5>
                            <p className="card-text"> We invest in our team members' growth and development. When you join Claimsolution.in, you will get access to continuing training, skill development programs, and possibilities to enhance your career within the organization.</p>
                            </div>
                        </div>
                        </div>
                        <div className="col-12 col-md-4 pt-4">
                        <div className="card h-100 rounded-5 bg-color-4">
                            <div className="card-body bg-color-3">
                            <h5 className="card-title fw-bold text-center"> Collaborative Culture </h5>
                            <p className="card-text"> Collaboration is the foundation of our success. Discover a workplace that values collaboration, open communication, and the sharing of ideas. Your efforts will be recognized when you collaborate with outstanding professionals working toward a shared goal. </p>
                            </div>
                        </div>
                        </div>
                        <div className="col-12 col-md-4 pt-4">
                        <div className="card h-100 rounded-5 bg-color-4">
                            <div className="card-body bg-color-3">
                            <h5 className="card-title fw-bold text-center"> Commitment to Diversity and Inclusion </h5>
                            <p className="card-text"> Claimsolution.in values inclusion and variety. We are an equal-opportunity employer, providing an atmosphere in which people from many backgrounds and viewpoints can grow.</p>
                            </div>
                        </div>
                        </div>
                        <div className="col-12 col-md-4 pt-4">
                        <div className="card h-100 rounded-5 bg-color-4">
                            <div className="card-body bg-color-3">
                            <h5 className="card-title fw-bold text-center"> Empowerment and Responsibility </h5>
                            <p className="card-text"> At Claimsolution.in, you can take control of your career. We encourage our team members to take ownership of their roles and duties, adding their knowledge to the mission's success. </p>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>

            {/* <div className="container-fluid bg-color-1 pt-3 pb-3">
                <div className="container-px-5 my-3">
                    <div className="row"> 
                        <div className="col-12 col-md-3 pt-4">
                            <div className="card h-100 rounded-5 bg-color-3">
                                <div className="card-body">
                                <h5 className="card-title fw-bold text-center"> Marketing Executive </h5>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-3 pt-4">
                            <div className="card h-100 rounded-5 bg-color-3">
                                <div className="card-body">
                                <h5 className="card-title fw-bold text-center"> Customer Services Executive </h5>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-3 pt-4">
                            <div className="card h-100 rounded-5 bg-color-3">
                                <div className="card-body">
                                <h5 className="card-title fw-bold text-center"> Experience Required 1 year to 3 year </h5>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-3 pt-4">
                            <div className="card h-100 rounded-5 bg-color-3">
                                <div className="card-body">
                                <h5 className="card-title fw-bold text-center"> Experience Required 0 year to 3 year </h5>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p className="text-center my-4"><Link to="#"> Apply Now </Link> 	or     Email us hr@claimsolution.in</p>
                </div>
            </div> */}

            <div className="container-fluid bg-color-1  pt-3 pb-3">
                <div className="container-px-5 my-3">                    
                    {loading ? <Loader/> : 
                     <div className="row py-4">
                        {data?.length>0 ?
                    <div className="col-12 p-0">
                        <div className="color-4 mx-auto">
                            <div className="align-items-center bg-color-1 p-5 rounded-2 row m-0">
                                <div className="border-3 border-primary border-bottom  mb-4">
                                    <h6 className="text-primary text-center h3">All Job</h6>
                                </div>
                                <div className="row">
                                    {data?.map(job=><div className="col-12 col-md-4 h-auto">
                                    <div className=" bg-color-7 rounded-2 shadow p-3 mb-4 h-100">
                                        <div className="d-flex align-items-center justify-content-center gap-2">
                                    <h6 className="fs-4 my-3 text-capitalize text-center text-decoration-underline text-primary">{job?.title}</h6>
        
                                        </div>
                                    <div>
                                        <h6 className="fs-6 fw-semibold text-capitalize mb-0">experience</h6>
                                        <p className="fw-lighter">{job?.experience}</p>
                                    </div>
                                    <div>
                                        <h6 className="fs-6 fw-semibold text-capitalize mb-0">qualification</h6>
                                        <p className="fw-lighter">{job?.qualification}</p>
                                    </div>
                                    <div>
                                        <h6 className="fs-6 fw-semibold text-capitalize mb-0">about</h6>
                                        <p className="fw-lighter">{job?.about}</p>
                                    </div>
                                    <div>
                                        <h6 className="fs-6 fw-semibold text-capitalize mb-0">requirements</h6>
                                        <p className="fw-lighter">{job?.requirements}</p>
                                    </div>
                                    </div>
                                    </div>)} 
                                </div> 
                                <p className="text-center my-4"><Link to="#"> Apply Now </Link> 	or     Email us hr@claimsolution.in</p>                      
                            </div>
                        </div>
                    </div> :
                    <div className="d-flex flex-column align-items-center justify-content-center">
                        <p className="fs-4 color-2  fw-bold">Comming Soon ...</p> 
                        <p>Jobs</p>
                    </div>
                    }
                </div>}
                </div>
            </div>
        </>
    )
}