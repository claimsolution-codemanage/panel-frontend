import "react-image-upload/dist/index.css";
import React, { useEffect, useState } from 'react';
import { getPartnerBankingDetails } from "../../apis";
import { toast } from 'react-toastify'
import { useNavigate } from "react-router-dom";
import { LuPcCase } from 'react-icons/lu'
import { CiEdit } from 'react-icons/ci'
import { IoArrowBackCircleOutline } from 'react-icons/io5'
import Loader from "../../components/Common/loader";
import { API_BASE_IMG } from "../../apis/upload";

export default function BankDetails() {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [data, setData] = useState({
        bankName: "",
        bankAccountNo: "",
        bankBranchName: "",
        gstNo: "",
        panNo: "",
        cancelledChequeImg: "",
        gstCopyImg: "",
    })


    useEffect(() => {
        async function fetch() {
            setLoading(true)
            try {
                const res = await getPartnerBankingDetails()
                // console.log("bankingDetails", res?.data?.data?.bankingDetails);
                if (res?.data?.success && res?.data?.data?.bankingDetails) {
                    setData({ ...res?.data?.data?.bankingDetails })
                    setLoading(false)
                }
            } catch (error) {
                if (error && error?.response?.data?.message) {
                    toast.error(error?.response?.data?.message)
                } else {
                    toast.error("Something went wrong")
                }
                // console.log("bankingDetails error", error);
            }
        } fetch()
    }, [])

    return (<>
        {loading ? <Loader /> :
            <div>
                <div className="d-flex justify-content-between bg-color-1 text-primary fs-5 px-4 py-3 shadow">
                    <div className="d-flex flex align-items-center gap-3">
                        {/* <IoArrowBackCircleOutline className="fs-3" onClick={() => navigate('/partner/dashboard')} style={{ cursor: "pointer" }} /> */}
                        <div className="d-flex flex align-items-center gap-1">
                            <span>Banking Details</span>
                            {/* <span><LuPcCase /></span> */}
                        </div>
                    </div>

                    {/* <div className="d-flex gap-1 badge bg-primary mb-1" onClick={() => navigate("/partner/edit banking details")} style={{ cursor: "pointer" }}>
                        <span><CiEdit /></span>
                        <span>Edit</span>
                    </div> */}

                </div>
                <div className="m-2 m-md-5">
                    <div className="container-fluid color-4 p-0">
                        <div className=" color-4 bg-color-7">
                            <div className="">
                                <div className="bg-color-1 my-5 p-3 p-md-5 rounded-2 shadow">
                                    <div className="border-3 border-primary border-bottom py-2">
                                    <div className="d-flex gap-5 justify-content-between">
                                    <h6 className="text-primary text-center fs-3">Banking Details</h6>
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="d-flex gap-1 btn btn-primary mb-1" onClick={() => navigate("/partner/edit banking details")} style={{ cursor: "pointer" }}>
                                                    <span><CiEdit /></span>
                                                    <span>Edit/ Fill</span>
                                                </div>
                                            </div>
                                        </div>
                                     
                                    </div>
                                    <div className="m-0 row p-md-5">
                                        <div className="mb-3 d-flex align-items-center gap-3 col-12 col-md-4 text-break">
                                            <h6 className="fw-bold">Bank Name</h6>
                                            <p className=" h6 text-capitalize">{data.bankName}</p>
                                        </div>
                                        <div className="mb-3 d-flex align-items-center gap-3 col-12 col-md-4 text-break">
                                            <h6 className="fw-bold">Bank Account No</h6>
                                            <p className=" h6 text-capitalize">{data.bankAccountNo}</p>
                                        </div>
                                        <div className="mb-3 d-flex align-items-center gap-3 col-12 col-md-4 text-break">
                                            <h6 className="fw-bold">Bank Branch Name</h6>
                                            <p className=" h6 text-capitalize">{data.bankBranchName}</p>
                                        </div>
                                        <div className="mb-3 d-flex align-items-center gap-3 col-12 col-md-4 text-break">
                                            <h6 className="fw-bold">GST No</h6>
                                            <p className=" h6 text-capitalize">{data.gstNo}</p>
                                        </div>
                                        <div className="mb-3 d-flex align-items-center gap-3 col-12 col-md-4 text-break">
                                            <h6 className="fw-bold">PAN NO</h6>
                                            <p className=" h6 text-capitalize">{data.panNo}</p>
                                        </div>
                                        <div className="mb-3 d-flex align-items-center gap-3 col-12 col-md-4 text-break">
                                            <h6 className="fw-bold">IFSC CODE</h6>
                                            <p className=" h6 text-capitalize">{data.ifscCode}</p>
                                        </div>
                                        <div className="mb-3 d-flex align-items-center gap-3 col-12 col-md-4 text-break">
                                            <h6 className="fw-bold">UPI ID/NO.</h6>
                                            <p className=" h6 text-capitalize">{data.upiId}</p>
                                        </div>

                                    </div>
                                    <div className="mb-3 d-flex flex-column">
                                        <label for="chequeImg" className="form-label">Cancelled Cheque:</label>
                                        {<img style={{ height: 250 }} className="border rounded-2" src={data.cancelledChequeImg ? `${API_BASE_IMG}/${data.cancelledChequeImg}` : "/Images/home/cancel-cheque.jpg"} alt="gstcopyImg" />}
                                    </div>

                                    <div className="mb-3 d-flex flex-column">
                                        <label for="gstImg" className="form-label">GST Copy</label>
                                        {<img style={{ height: 250 }} className="border rounded-2" src={data.gstCopyImg ? `${API_BASE_IMG}/${data.gstCopyImg}` : "/Images/home/gst-copy.jpg"} alt="gstcopyImg" />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
    </>)
}