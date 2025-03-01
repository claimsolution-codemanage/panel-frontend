import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Loader from '../Common/loader'
import { IoArrowBackCircleOutline } from 'react-icons/io5'

export default function EmployeeProfile({ _id, getProfile }) {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        async function fetch() {
            setLoading(true)
            if (_id) {
                try {
                    const res = await getProfile(_id)
                    if (res?.data?.success && res?.data?.data) {
                        setData(res?.data?.data)
                        setLoading(false)
                    }
                } catch (error) {
                    console.log("error", error);
                    if (error && error?.response?.data?.message) {
                        toast.error(error?.response?.data?.message)
                        // setLoading(false)
                    } else {
                        toast.error("Something went wrong")
                        // setLoading(false)
                    }
                }
            }
        } fetch()
    }, [_id])
    return (
        <>
            {loading ? <Loader /> :
                <div>
                    <div className="d-flex justify-content-between bg-color-1 text-primary fs-5 px-4 py-3 shadow">
                        <div className="d-flex flex align-items-center gap-3">
                            <IoArrowBackCircleOutline className="fs-3" onClick={() => navigate(-1)} style={{ cursor: "pointer" }} />
                            <div className="d-flex flex align-items-center gap-1">
                                <span>View Profile</span>
                            </div>
                        </div>
                    </div>
                    <div className="m-2 m-md-5">
                        <div className="container-fluid color-4 p-0">
                            <div className='row row-cols-12 row-cols-md-3 align-item-center justify-content-center'>
                                <div className="bg-color-1 my-5 p-3 p-md-5 rounded-2 shadow">
                                    <div className="border-3 border-primary border-bottom">
                                        <div className="d-flex gap-5 justify-content-between">
                                            <h6 className="text-primary text-center fs-3">Profile Details</h6>

                                        </div>
                                    </div>
                                    <div className="row row-cols-12">
                                            <div className="align-items-center justify-content-center my-3 d-flex flex-column">
                                                <div className="d-flex align-items-center justify-content-center">
                                                    <img src={data?.profileImg || "/Images/home/profile.jpg"} alt="profileImg" style={{ height: 150, width: 150, borderRadius: 150, cursor: "pointer" }} />
                                                </div>
                                            </div>
                                 
                                        <div className="mb-2 d-flex align-items-center gap-3">
                                            <h6 className="fw-bold">Name</h6>
                                            <p className=" h6 text-capitalize text-break">{data?.fullName}</p>
                                        </div>
                                        
                                        <div className="mb-2 d-flex align-items-center gap-3">
                                            <h6 className="fw-bold">Emp ID</h6>
                                            <p className=" h6 text-capitalize text-break">{data?.empId}</p>
                                        </div>
                                        <div className="mb-2 d-flex align-items-center gap-3">
                                            <h6 className="fw-bold">Branch</h6>
                                            <p className=" h6 text-capitalize text-break">{data?.branchId}</p>
                                        </div>
                                        <div className="mb-2 d-flex align-items-center gap-3">
                                            <h6 className="fw-bold">Department</h6>
                                            <p className=" h6 text-capitalize text-break">{data?.type}</p>
                                        </div>
                                        <div className="mb-2 d-flex align-items-center gap-3">
                                            <h6 className="fw-bold">Designation</h6>
                                            <p className=" h6 text-capitalize text-break">{data?.designation}</p>
                                        </div>
                                        <div className="mb-2 d-flex align-items-center gap-3">
                                            <h6 className="fw-bold">Email</h6>
                                            <p className=" h6  text-break">{data?.email}</p>
                                        </div>
                                        <div className="mb-2 d-flex align-items-center gap-3">
                                            <h6 className="fw-bold">Mobile No</h6>
                                            <p className=" h6 text-capitalize text-break">{data?.mobileNo}</p>
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>}
        </>
    )
}
