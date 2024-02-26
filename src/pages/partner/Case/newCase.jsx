import { useState } from "react"
import { policyType, generalInsuranceList, healthInsuranceList, LifeInsuranceList,otherInsuranceList } from "../../../utils/constant"
import { addNewCasePartner } from "../../../apis"
import { toast } from 'react-toastify'
import { LuPcCase } from 'react-icons/lu'
import { CiEdit } from 'react-icons/ci'
import { IoArrowBackCircleOutline } from 'react-icons/io5'
import { useNavigate } from "react-router-dom"
import { insuranceCompany, allState } from "../../../utils/constant"
import { IoMdAdd } from 'react-icons/io'
import { useRef } from "react"
import { partnerAttachementUpload } from "../../../apis/upload"
import { FaFilePdf, FaFileImage,FaFileWord } from 'react-icons/fa6'
import { useEffect } from "react"
import { checkNumber,checkPhoneNo } from "../../../utils/helperFunction"





export default function NewCase() {
    const [uploadAttachement,setUploadAttachement] = useState({status:0,message:""})
    const [selectPolicyType, setSelectPolicyType] = useState("")
    const [uploadedFiles,setUploadedFiles] = useState([])
    const [selectComplaintType, setComplaintPolicyType] = useState([])
    const attachmentRef = useRef()
    const [loading, setLoading] = useState(false)
    const [selectedInsurance, setSelectedInsurance] = useState("")
    const navigate = useNavigate()
    const [data, setData] = useState({
        name: "",
        fatherName: "",
        email: "",
        mobileNo: "",
        policyType: "",
        insuranceCompanyName: "",
        complaintType: "",
        policyNo: "",
        address: "",
        DOB: "",
        pinCode: "",
        claimAmount: "",
        city: "",
        state: "",
        problemStatement: "",
    })

    const handlePolicyType = (e) => {
        const { name, value } = e.target
        setData({ ...data, [name]: value })
        // setSelectPolicyType(value)
        // if (e.target.value == "Life Insurance") {
        //     setComplaintPolicyType([...LifeInsuranceList])
        // } else if (e.target.value == "General Insurance") {
        //     setComplaintPolicyType([...generalInsuranceList])
        // } else if (e.target.value == "Health Insurance") {
        //     setComplaintPolicyType([...healthInsuranceList])
        // }else{
        //     setComplaintPolicyType([...otherInsuranceList])
        // }

        // console.log(e.target.value);
    }

    useEffect(()=>{
        setData({ ...data,complaintType:""})
        const policyType = data.policyType
        if (policyType == "Life Insurance") {
            setComplaintPolicyType([...LifeInsuranceList])
        } else if (policyType == "General Insurance") {
            setComplaintPolicyType([...generalInsuranceList])
        } else if (policyType == "Health Insurance") {
            setComplaintPolicyType([...healthInsuranceList])
        }else{
            setComplaintPolicyType([...otherInsuranceList])
        }
    },
    [data.policyType])

    const handleOnchange = (e) => {
        const { name, value } = e.target;
        if (name == "mobileNo") {
            if (value.length <= 10) {
                setData({ ...data, [name]: value })
            }
        } else {
            setData({ ...data, [name]: value })
        }
    }

    const handleOnSubmit = async (e) => {
        e.preventDefault()
        // console.log("data", data);
        let payLoad = { ...data,caseDocs:uploadedFiles }
        // let payLoad = {}
        // if (data?.insuranceCompanyName == "Other") {
        //     payLoad = { ...data, insuranceCompanyName: selectedInsurance,caseDocs:uploadedFiles }
        // } else {
        //     payLoad = { ...data,caseDocs:uploadedFiles }
        // }
        setLoading(true)
        // console.log("payload",payLoad);
        // return
        try {
            const res = await addNewCasePartner(payLoad)
            // console.log("partner", res?.data);
            if (res?.data?.success && res?.data) {
                setData({
                    name: "", fatherName: "", email: "", mobileNo: "", policyType: "",
                    insuranceCompanyName: "", complaintType: "", policyNo: "", address: "", DOB: "",
                    pinCode: "", claimAmount: "", city: "", state: "", problemStatement: "",
                })

                toast.success(res?.data?.message)
                setLoading(false)
                if (res?.data?.data?._id) {
                    navigate(`/partner/view case/${res?.data?.data?._id}`)
                }
            }
        } catch (error) {
            if (error && error?.response?.data?.message) {
                toast.error(error?.response?.data?.message)
                setLoading(false)
            } else {
                toast.error("Something went wrong")
                setLoading(false)
            }
        }
    }

 const uploadAttachmentFile =async(file,type)=>{
    try {
        const formData = new FormData()
        formData.append("attachment",file)
        const res = await partnerAttachementUpload(type,formData)
        // console.log("partner", res?.data);
        if (res?.data?.success) {
            // console.log("response",res?.data);
            setUploadedFiles([...uploadedFiles,{fileType:type,url:res?.data?.url}])
            // toast.success(res?.data?.message)
            setUploadAttachement({ status: 1, message: res?.data?.message });
            setTimeout(() => {
                setUploadAttachement({ status: 0, message: "" });
            }, 1000);
            
        }
    } catch (error) {
        // console.log("error",error);
        if (error && error?.response?.data?.message) {
            // toast.error(error?.response?.data?.message)
            setUploadAttachement({ status: 2, message: error?.response?.data?.message });
            // setLoading(false)
        } else {
            // toast.error("Something went wrong")
            setUploadAttachement({ status: 2, message: "Something went wrong" });
            // setLoading(false)
        }
    }
 }


const handleAttachment = async() => {
        const files = attachmentRef?.current?.files;
    
        if (files && files.length > 0) {
            const file = files[0];
            const fileType = file?.type;
    
            if (fileType.includes("image")) {
                setUploadAttachement({ status: 1, message: "Uploading..." });
                uploadAttachmentFile(file,"image")

                // console.log("Processing image file");
            } else if (fileType.includes("pdf")) {
                setUploadAttachement({ status: 1, message: "Uploading..." });
                uploadAttachmentFile(file,"pdf")
                // Process PDF file
                // console.log("Processing PDF file");
            } else if (fileType=="application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                setUploadAttachement({ status: 1, message: "Uploading..." });
                uploadAttachmentFile(file,"word")
                // Process Word file
                // console.log("Processing Word file");
            } else {
                // Unsupported file type
                setUploadAttachement({ status: 2, message: "File must be image, pdf or word file" });
            }
        } else {
            setUploadAttachement({ status: 2, message: "Please select a file" });
        }
    };
    
// console.log("uploadAttachment", uploadAttachement);



    // console.log(selectedInsurance,"selected Insurance comp",data?.insuranceCompanyName);

    return (<>
        <div className="d-flex justify-content-between bg-color-1 text-primary fs-5 px-4 py-3 shadow">
            <div className="d-flex flex align-items-center gap-3">
                {/* <IoArrowBackCircleOutline className="fs-3" onClick={() => navigate('/partner/dashboard')} style={{ cursor: "pointer" }} /> */}
                <div className="d-flex flex align-items-center gap-1">
                    <span>Add New Case</span>
                    {/* <span><LuPcCase /></span> */}
                </div>
            </div>

            {/* <div className="d-flex gap-1 badge bg-primary mb-1" onClick={()=>navigate("/partner/edit banking details")} style={{cursor:"pointer"}}>
                <span><CiEdit/></span>
                <span>Edit</span>
            </div> */}

        </div>
        <div className="m-2 m-md-5">
            <div className="container-fluid color-4 p-0">
                <div className="color-4 bg-color-7">
                    <div className="bg-color-1 my-5 p-3 p-md-5 rounded-2 shadow">
                        <div className="border-3 border-primary border-bottom py-2">
                            <h6 className="text-primary text-center fs-3">Add New Case</h6>
                        </div>
                        <div className="form p-2 p-md-5">
                            <div className="h4">Policy Holder's Details</div>
                            <div className="row row-cols-md-3 row-cols-1">
                                <div className="mb-3">
                                    <label for="name" className="form-label">Name*</label>
                                    <input type="text" className="form-control" id="name" name="name" value={data.name} onChange={handleOnchange} />
                                    {/* <div id="nameHelp" className="form-text text-danger">We'll never share your email with anyone else.</div> */}
                                </div>
                                <div className="mb-3">
                                    <label for="fatherName" className="form-label">Father's Name</label>
                                    <input type="text" className="form-control" id="fatherName" name="fatherName" value={data.fatherName} onChange={handleOnchange} />
                                </div>
                                <div className="mb-3">
                                    <label for="email" className="form-label">Email</label>
                                    <input type="email" className="form-control" id="email" name="email" value={data.email} onChange={handleOnchange} />
                                </div>
                                <div className="mb-3">
                                    <label for="mobileNo." className="form-label">Mobile No*</label>
                                    <input type="text" className="form-control" id="mobileNo." name="mobileNo" value={data.mobileNo} onChange={(e)=>checkPhoneNo(e?.target?.value) && handleOnchange(e)} />
                                </div>
                                <div className="mb-3">
                                    <label for="DOB" className="form-label">DOB</label>
                                    <input type="date" className="form-control" id="DOB" name="DOB" value={data.DOB} onChange={handleOnchange} />
                                </div>
                                <div className="mb-3">
                                    <label for="policyNo" className="form-label">Insurance Company Name</label>
                                    <input type="text" className="form-control"value={data?.insuranceCompanyName} name="insuranceCompanyName" onChange={handleOnchange} />
                                </div>
                                <div className="mb-3">
                                    <label for="policyNo" className="form-label">Policy No</label>
                                    <input type="text" className="form-control" id="policyNo" name="policyNo" value={data.policyNo} onChange={handleOnchange} />
                                </div>
                                <div className="mb-3">
                                    <label for="policyType" className="form-label">Policy Type</label>
                                    <select className="form-select" value={data.policyType} name="policyType" onChange={handleOnchange} id="policyType" aria-label="Default select example">
                                        <option value="">--Select Policy Type</option>
                                        {policyType.map((policy, ind) => <option key={ind} value={policy}>{policy}</option>)}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label for="complaintType" className="form-label">Complaint Type</label>
                                    <select className="form-select" id="complaintType" name="complaintType" value={data.complaintType} onChange={handleOnchange} aria-label="Default select example">
                                        <option value="">--Select Complaint Type</option>
                                        <option value="Claim Rejection">Claim Rejection</option>
                                        <option value="Claim-Short Payment">Claim-Short Payment</option>
                                        <option value="Policy Cancel">Policy Cancel</option>
                                        <option value="Misselling & Fraud Case">Misselling & Fraud Case</option>
                                        <option value="Other">Other</option>
                                        {/* {selectComplaintType?.map((complaint, ind) => <option key={complaint} value={complaint}>{complaint}</option>)} */}
                                    </select>
                                </div>
                       
                                {/* <div className="mb-3">
                                    <label for="insuranceCompanyName" className="form-label">Insurance Company Name</label>
                                    <select className="form-select" value={data?.insuranceCompanyName} name="insuranceCompanyName" onChange={handleOnchange}>
                                        <option value="">--Select Insurance Company</option>
                                        {insuranceCompany.map((company, ind) => <option key={ind} value={company}>{company}</option>)}
                                    </select>
                                </div> */}
                              
                            
                                <div className="mb-3">
                                    <label for="claimAmount" className="form-label">Claim Amount*</label>
                                    <input type="tel" className="form-control" id="claimAmount" name="claimAmount" value={data.claimAmount} onChange={(e)=>checkNumber(e) && handleOnchange(e)} />
                                </div>
                        
                                {/* {data?.insuranceCompanyName == "Other" && <div className="mb-3">
                                    <label for="selectedInsurance" className="form-label">Your Insurance Company</label>
                                    <input type="text" className="form-control" id="selectedInsurance" name="insuranceCompanyName" value={selectedInsurance} onChange={(e) => setSelectedInsurance(e?.target?.value)} />
                                </div>} */}
                                <div className="mb-3">
                                    <label for="address" className="form-label">Address</label>
                                    <input type="text" className="form-control" id="address" name="address" value={data.address} onChange={handleOnchange} />
                                </div>
                                <div className="mb-3">
                                    <label for="city" className="form-label">City</label>
                                    <input type="text" className="form-control" id="city" name="city" value={data.city} onChange={handleOnchange} />
                                </div>
                                <div className="mb-3">
                                    <label for="state" className="form-label">State</label>
                                    {/* <input type="text" className="form-control" id="state"  name="state" value={data.state} onChange={handleOnchange} /> */}
                                    <select className="form-select" name="state" value={data.state} onChange={handleOnchange} id="state" aria-label="Default select example">
                                        <option value="">--select state</option>
                                        {allState?.map((state, ind) => <option key={ind} value={state}>{state}</option>)}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label for="pinCode" className="form-label">Pin code</label>
                                    <input type="text" className="form-control" id="pinCode" name="pinCode" value={data.pinCode} onChange={(e)=>checkNumber(e) && handleOnchange(e)} />
                                </div>
              
                            </div>
             
                            <div className="row">
                            

                                <div className="mb-3 col-12">
                                    <textarea class="form-control" placeholder="Description" name="problemStatement" value={data.problemStatement} onChange={handleOnchange} rows={5} cols={5} ></textarea>
                                </div>

                                <div className="mb-5">
                                    <div>
                                    <div className="d-flex gap-3 justify-content-center text-primary text-center fs-4">
                                        <span>Document</span>
                                        <div>
                                            <span onClick={()=>attachmentRef?.current?.click()}  className="bg-primary d-flex justify-content-center align-items-center text-white" style={{ cursor: 'pointer', height: '2rem', width: '2rem', borderRadius: '2rem' }}><IoMdAdd /></span>
                                            <input type="file"  ref={attachmentRef} style={{display:"none"}} onChange={handleAttachment}  name="" id="" />
                                        </div>
                                    </div>
                                      {uploadAttachement.message=1 ? <p className="text-sucess text-center">{uploadAttachement.message}</p> : <p className="text-danger text-center">{uploadAttachement.message}</p> }  
                                    </div>
                                    <div className="d-flex  gap-5 px-5  align-items-center">
                                                        {uploadedFiles.map(item => <div  className="align-items-center bg-color-7 d-flex flex-column justify-content-center w-25 rounded-3">
                                                            <div className="d-flex flex-column p-4 justify-content-center align-items-center">
                                                                <div className="d-flex justify-content-center bg-color-6 align-items-center fs-4 text-white bg-primary" style={{ height: '3rem', width: '3rem', borderRadius: '3rem' }}>
                                                                    {item?.fileType == "image" ? <FaFileImage /> : (item?.fileType == "pdf" ? <FaFilePdf /> : <FaFileWord/>)}
                                                                    {/* {item?.docType == "image" ? <FaFileImage /> :(item?.docType == "pdf" ? <FaFilePdf /> : <FaFileWord/>)} */}
                                                                </div>
                                                            </div>
                                                          
                                                        </div>
                                                        )}
                                                    </div>
                                </div>
                            </div>
                            <div className="d-flex  justify-content-center">
                                <div aria-disabled={loading} className={loading ? "d-flex align-items-center justify-content-center gap-3 btn btn-primary w-50 disabled" : "d-flex align-items-center justify-content-center gap-3 btn btn-primary w-50 "} onClick={handleOnSubmit}>
                                    {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span> : <span>Add New Case </span>}

                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}