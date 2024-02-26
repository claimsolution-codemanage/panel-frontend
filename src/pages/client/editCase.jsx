import { useEffect, useState } from "react"
import { policyType,allState, generalInsuranceList, healthInsuranceList, LifeInsuranceList,otherInsuranceList } from "../../utils/constant"
import { clientAddNewCase } from "../../apis"
import { toast } from 'react-toastify'
import { useNavigate } from "react-router-dom"
import { isNaN, useFormik } from 'formik'
import * as yup from 'yup'
import { FaFilePdf, FaFileImage,FaFileWord } from 'react-icons/fa6'
import { IoArrowBackCircleOutline } from 'react-icons/io5'
import { useRef } from "react"
import { IoMdAdd } from 'react-icons/io'
import { useParams } from "react-router-dom"
import { clientViewCaseById,clientUpdateCaseById } from "../../apis"
import Loader from "../../components/Common/loader"

import { clientAttachementUpload } from "../../apis/upload"


export default function PartnerEditCase() {
    const [uploadAttachement,setUploadAttachement] = useState({status:0,message:""})
    const params = useParams()
    const [uploadedFiles,setUploadedFiles] = useState([])
    const [selectPolicyType, setSelectPolicyType] = useState("")
    const [isUpdatedPolicyType,setIsUpdatePolicyType] = useState(false)
    const [selectComplaintType, setComplaintPolicyType] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadCase,setLoadCase] = useState(false)
    const attachmentRef = useRef()
    const navigate = useNavigate()
    // console.log("params",params?._id);
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
    })

    const handlePolicyType = (e) => {
        const { name, value } = e.target
        setData({ ...data, [name]: value })
        setSelectPolicyType(value)
        if (e.target.value == "Life Insurance") {
            setComplaintPolicyType([...LifeInsuranceList])
        } else if (e.target.value == "General Insurance") {
            setComplaintPolicyType([...generalInsuranceList])
        } else if (e.target.value == "Health Insurance") {
            setComplaintPolicyType([...healthInsuranceList])
        }else{
            setComplaintPolicyType([...otherInsuranceList])
        }

        // console.log(e.target.value);
    }




    const caseDetailsFormik = useFormik({
        initialValues: {
            name: "",
            fatherName: "",
            email: "",
            mobileNo: "",
            policyType: "",
            complaintType: "",
            insuranceCompanyName: "",
            policyNo: "",
            address: "",
            DOB: "",
            pinCode: "",
            claimAmount: "",
            city: "",
            state: "",
            problemStatement: "",
        },
        validationSchema: yup.object().shape({
            name: yup.string().max(50,"Name must have maximum 50 characters"),
            fatherName: yup.string().max(50,"Father's name must have maximum 50 characters"),
            email: yup.string().email("Email must be vaild"),
            mobileNo: yup.string().min(10,"Moblie No must have be 10 digit").max(10,"Moblie No must have be 10 digit").required("Please enter Mobile No."),
            policyType: yup.string(),
            complaintType: yup.string(),
            insuranceCompanyName: yup.string(),
            policyNo: yup.string(),
            address: yup.string(),
            pinCode: yup.string(),
            claimAmount: yup.string().required("Please Enter your Claim Amount"),
            city: yup.string(),
            state: yup.string(),
            problemStatement: yup.string(), 
        }),
        onSubmit: async (values) => {
            const payLoad ={
                name:values?.name,
                fatherName:values?.fatherName,
                email:values?.email,
                mobileNo:values?.mobileNo,
                policyType:values?.policyType,
                insuranceCompanyName:values?.insuranceCompanyName,
                complaintType:values?.complaintType,
                policyNo:values?.policyNo,
                address:values?.address,
                DOB:values?.DOB,
                pinCode:values?.pinCode,
                claimAmount:values?.claimAmount,
                city:values?.city,
                state:values?.state,
                problemStatement:values?.problemStatement,
                caseDocs:uploadedFiles,
            }
            setLoading(true)
            try {
                const res = await clientUpdateCaseById(params?._id,payLoad)
                // console.log("client new case", res?.data);
                if (res?.data?.success && res?.data) {
                    toast.success(res?.data?.message)
                    setLoading(false)
                    navigate(`/client/view case/${params?._id}`)
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

    })

    useEffect(()=>{
        const policyType = caseDetailsFormik?.values?.policyType
        if(isUpdatedPolicyType){
            caseDetailsFormik.setFieldValue("complaintType","")
        }
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
    [caseDetailsFormik?.values?.policyType])

    const handleChange = (e) => {
        const { name, value } = e.target;
        // console.log("name",name,value);
        if(name=="mobileNo"){
            if(!isNaN(Number(value))){
                if(value.length<=10){
                    caseDetailsFormik.setFieldValue(name,value)
                }
                // setData({ ...data, [name]: value })
            }
        }else{
            caseDetailsFormik.setFieldValue(name,value)
            // setData({ ...data, [name]: value })
        }
    }

    const handleOnSubmit = async (e) => {
        e.preventDefault()
        // console.log("data", data);
        setLoading(true)
        try {
            const res = await clientAddNewCase(data)
            // console.log("client new case", res?.data);
            if (res?.data?.success && res?.data) {
                setData({
                    policyType: "",
                    insuranceCompanyName: "",
                    complaintType: "",
                    policyNo: "",
                    claimAmount: "",
                    problemStatement: "",
                })

                toast.success(res?.data?.message)
                setLoading(false)
                if (res?.data?._id) {
                    navigate(`/client/view case/${res?.data?._id}`)
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
            const res = await clientAttachementUpload(type,formData)
            // console.log("partner", res?.data);
            if (res?.data?.success) {
                // console.log("response",res?.data);
                setUploadedFiles([...uploadedFiles,{docFormat:type,docURL:res?.data?.url}])
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

        const getCaseById = async () => {
            setLoadCase(true)
            try {
                const res = await clientViewCaseById(params?._id)
                // console.log("case", res?.data?.data);
                if (res?.data?.success && res?.data?.data) {
                    caseDetailsFormik.setValues(res?.data?.data)
                    setUploadedFiles([...res?.data?.data?.caseDocs])
                    // setData([res?.data?.data])
                    setLoadCase(false)
    
                }
            } catch (error) {
                if (error && error?.response?.data?.message) {
                    toast.error(error?.response?.data?.message)
                    setLoadCase(false)
                } else {
                    toast.error("Something went wrong")
                    setLoadCase(false)
                }
    
                // console.log("case error", error);
            }
        }
    
        useEffect(() => {
            if (params?._id) {
                getCaseById()
            }
        }, [params])

    // console.log("caseformik",caseDetailsFormik);




    return (<>
    {loadCase ? <Loader/> : 
        <div>
            <div className="d-flex justify-content-between bg-color-1 text-primary fs-5 px-4 py-3 shadow">
                <div className="d-flex flex align-items-center gap-3">
                    <IoArrowBackCircleOutline className="fs-3" style={{ cursor: 'pointer' }} onClick={() => navigate(-1)} />
                    <div className="d-flex flex align-items-center gap-1">
                        <span>Edit Case</span>
                    </div>
                </div>
            </div>
            <div className="container-fluid color-4 p-0 bg-color-7">
                <form onSubmit={caseDetailsFormik.handleSubmit} className="contanter">
                    <div className="my-3 p-2 p-md-3 p-md-5">
                        <div className="form bg-color-1 p-3 p-md-5 rounded-2 shadow">
                        <div className="border-3 border-primary border-bottom">
                            <h6 className="text-primary text-center fs-3">Edit Case</h6>
                        </div>
                            <div className="row row-cols-12 row-cols-md-3 mt-4">
                                <div className="mb-3 ">
                                    <label for="name" className={`form-label ${caseDetailsFormik?.touched?.name && caseDetailsFormik?.touched?.name && caseDetailsFormik?.errors?.name && "text-danger"}`}>Policy Holder's/Nominee's Name *</label>
                                    <input type="text" className={`form-control ${caseDetailsFormik?.touched?.name && caseDetailsFormik?.touched?.name && caseDetailsFormik?.errors?.name && "border-danger"}`} id="name" name="name" value={caseDetailsFormik?.values?.name} onChange={handleChange} />
                                    {caseDetailsFormik?.touched?.name && caseDetailsFormik?.errors?.name ? (
                                        <span className="text-danger">{caseDetailsFormik?.errors?.name}</span>
                                    ) : null}
                                </div>
                                <div className="mb-3 ">
                                    <label for="name" className={`form-label ${caseDetailsFormik?.touched?.fatherName && caseDetailsFormik?.touched?.fatherName && caseDetailsFormik?.errors?.fatherName && "text-danger"}`}>Father's Name</label>
                                    <input type="text" className={`form-control ${caseDetailsFormik?.touched?.fatherName && caseDetailsFormik?.touched?.fatherName && caseDetailsFormik?.errors?.fatherName && "border-danger"}`} id="fatherName" name="fatherName" value={caseDetailsFormik?.values?.fatherName} onChange={handleChange} />
                                    {caseDetailsFormik?.touched?.fatherName && caseDetailsFormik?.errors?.fatherName ? (
                                        <span className="text-danger">{caseDetailsFormik?.errors?.fatherName}</span>
                                    ) : null}
                                </div>
                                <div className="mb-3 ">
                                    <label for="name" className={`form-label ${caseDetailsFormik?.touched?.email && caseDetailsFormik?.touched?.email && caseDetailsFormik?.errors?.email && "text-danger"}`}>Policy Holder's Email</label>
                                    <input type="text" className={`form-control ${caseDetailsFormik?.touched?.email && caseDetailsFormik?.touched?.email && caseDetailsFormik?.errors?.email && "border-danger"}`} id="email" name="email" value={caseDetailsFormik?.values?.email} onChange={handleChange} />
                                    {caseDetailsFormik?.touched?.email && caseDetailsFormik?.errors?.email ? (
                                        <span className="text-danger">{caseDetailsFormik?.errors?.email}</span>
                                    ) : null}
                                </div>
                                <div className="mb-3 ">
                                    <label for="name" className={`form-label ${caseDetailsFormik?.touched?.mobileNo && caseDetailsFormik?.touched?.mobileNo && caseDetailsFormik?.errors?.mobileNo && "text-danger"}`}>Policy Holder's Mobile No*</label>
                                    <input type="text" className={`form-control ${caseDetailsFormik?.touched?.mobileNo && caseDetailsFormik?.touched?.mobileNo && caseDetailsFormik?.errors?.mobileNo && "border-danger"}`} id="mobileNo" name="mobileNo" value={caseDetailsFormik?.values?.mobileNo} onChange={handleChange} />
                                    {caseDetailsFormik?.touched?.mobileNo && caseDetailsFormik?.errors?.mobileNo ? (
                                        <span className="text-danger">{caseDetailsFormik?.errors?.mobileNo}</span>
                                    ) : null}
                                </div>
                                <div className="mb-3 ">
                                    <label for="name" className={`form-label ${caseDetailsFormik?.touched?.address && caseDetailsFormik?.touched?.address && caseDetailsFormik?.errors?.address && "text-danger"}`}>Address</label>
                                    <input type="text" className={`form-control ${caseDetailsFormik?.touched?.address && caseDetailsFormik?.touched?.address && caseDetailsFormik?.errors?.address && "border-danger"}`} id="address" name="address" value={caseDetailsFormik?.values?.address} onChange={handleChange} />
                                    {caseDetailsFormik?.touched?.address && caseDetailsFormik?.errors?.address ? (
                                        <span className="text-danger">{caseDetailsFormik?.errors?.address}</span>
                                    ) : null}
                                </div>
                                <div className="mb-3 ">
                                    <label for="name" className={`form-label ${caseDetailsFormik?.touched?.city && caseDetailsFormik?.touched?.city && caseDetailsFormik?.errors?.city && "text-danger"}`}>City or District</label>
                                    <input type="text" className={`form-control ${caseDetailsFormik?.touched?.city && caseDetailsFormik?.touched?.city && caseDetailsFormik?.errors?.city && "border-danger"}`} id="city" name="city" value={caseDetailsFormik?.values?.city} onChange={handleChange} />
                                    {caseDetailsFormik?.touched?.city && caseDetailsFormik?.errors?.city ? (
                                        <span className="text-danger">{caseDetailsFormik?.errors?.city}</span>
                                    ) : null}
                                </div>
                                <div className="mb-3 col-12 col-md-4">
                                    <label for="state" className={`form-label ${caseDetailsFormik?.touched?.state && caseDetailsFormik?.touched?.state && caseDetailsFormik?.errors?.state && "text-danger"}`}>State</label>                                   
                                    <select className={`form-select ${caseDetailsFormik?.touched?.state && caseDetailsFormik?.touched?.state && caseDetailsFormik?.errors?.state && "border-danger"}`} name="state" value={caseDetailsFormik?.values?.state} onChange={handleChange} id="state" aria-label="Default select example">
                                        <option value="">--select state</option>
                                        {allState?.map((state, ind) => <option key={ind} value={state}>{state}</option>)}
                                    </select>
                                    {caseDetailsFormik?.touched?.state && caseDetailsFormik?.errors?.state ? (
                                        <span className="text-danger">{caseDetailsFormik?.errors?.state}</span>
                                    ) : null}
                                </div>
                                <div className="mb-3 ">
                                    <label for="name" className={`form-label ${caseDetailsFormik?.touched?.pinCode && caseDetailsFormik?.touched?.pinCode && caseDetailsFormik?.errors?.pinCode && "text-danger"}`}>PinCode</label>
                                    <input type="text" className={`form-control ${caseDetailsFormik?.touched?.pinCode && caseDetailsFormik?.touched?.pinCode && caseDetailsFormik?.errors?.pinCode && "border-danger"}`} id="pinCode" name="pinCode" value={caseDetailsFormik?.values?.pinCode} onChange={handleChange} />
                                    {caseDetailsFormik?.touched?.pinCode && caseDetailsFormik?.errors?.pinCode ? (
                                        <span className="text-danger">{caseDetailsFormik?.errors?.pinCode}</span>
                                    ) : null}
                                </div>
                                
                                <div className="mb-3 ">
                                    <label for="policyType" className={`form-label ${caseDetailsFormik?.touched?.policyType && caseDetailsFormik?.errors?.policyType && "text-danger"}`}>Policy Type</label>
                                    <select className={`form-select ${caseDetailsFormik?.touched?.policyType && caseDetailsFormik?.errors?.policyType && "border-danger"}`} value={caseDetailsFormik?.values?.policyType} name="policyType" onChange={(e)=>{handleChange(e);setIsUpdatePolicyType(true)}} id="policyType" aria-label="Default select example">
                                        <option value="">--Select Policy Type</option>
                                        {policyType.map((policy, ind) => <option key={ind} value={policy}>{policy}</option>)}
                                    </select>
                                    {caseDetailsFormik?.touched?.policyType && caseDetailsFormik?.errors?.policyType ? (
                                        <span className="text-danger">{caseDetailsFormik?.errors?.policyType}</span>
                                    ) : null}
                                </div>
                                <div className="mb-3 ">
                                    <label for="complaintType" className={`form-label ${caseDetailsFormik?.touched?.complaintType && caseDetailsFormik?.errors?.complaintType && "border-danger"}`}>Complaint Type</label>
                                    <select className={`form-select ${caseDetailsFormik?.touched?.complaintType && caseDetailsFormik?.errors?.complaintType && "border-danger"}`} id="complaintType" name="complaintType" value={caseDetailsFormik?.values?.complaintType} onChange={handleChange} aria-label="Default select example">
                                        <option value="">--Select Complaint Type</option>
                                        {selectComplaintType?.map((complaint, ind) => <option key={complaint} value={complaint}>{complaint}</option>)}
                                    </select>
                                    {caseDetailsFormik?.touched?.complaintType && caseDetailsFormik?.errors?.complaintType ? (
                                        <span className="text-danger">{caseDetailsFormik?.errors?.complaintType}</span>
                                    ) : null}
                                </div>
                                <div className="mb-3 ">
                                    <label for="insuranceCompanyName" className={`form-label ${caseDetailsFormik?.touched?.insuranceCompanyName && caseDetailsFormik?.touched?.insuranceCompanyName && caseDetailsFormik?.errors?.insuranceCompanyName && "text-danger"}`}>Insurance Company Name</label>
                                    <input type="text" className={`form-control ${caseDetailsFormik?.touched?.insuranceCompanyName && caseDetailsFormik?.touched?.insuranceCompanyName && caseDetailsFormik?.errors?.insuranceCompanyName && "border-danger"}`} id="insuranceCompanyName" name="insuranceCompanyName" value={caseDetailsFormik?.values?.insuranceCompanyName} onChange={handleChange} />
                                    {caseDetailsFormik?.touched?.insuranceCompanyName && caseDetailsFormik?.errors?.insuranceCompanyName ? (
                                        <span className="text-danger">{caseDetailsFormik?.errors?.insuranceCompanyName}</span>
                                    ) : null}
                                </div>
                                <div className="mb-3 ">
                                    <label for="policyNo" className={`form-label ${caseDetailsFormik?.touched?.policyNo && caseDetailsFormik?.touched?.policyNo && caseDetailsFormik?.errors?.policyNo && "text-danger"}`}>Policy No</label>
                                    <input type="text" className={`form-control ${caseDetailsFormik?.touched?.policyNo && caseDetailsFormik?.touched?.policyNo && caseDetailsFormik?.errors?.policyNo && "border-danger"}`} id="policyNo" name="policyNo" value={caseDetailsFormik?.values?.policyNo} onChange={handleChange} />
                                    {caseDetailsFormik?.touched?.policyNo && caseDetailsFormik?.errors?.policyNo ? (
                                        <span className="text-danger">{caseDetailsFormik?.errors?.policyNo}</span>
                                    ) : null}
                                </div>
                                <div className="mb-3 ">
                                    <label for="claimAmount" className={`form-label ${caseDetailsFormik?.touched?.claimAmount && caseDetailsFormik?.touched?.claimAmount && caseDetailsFormik?.errors?.claimAmount && "text-danger"}`}>Claim Amount*</label>
                                    <input type="text" className={`form-control ${caseDetailsFormik?.touched?.claimAmount && caseDetailsFormik?.touched?.claimAmount && caseDetailsFormik?.errors?.claimAmount && "border-danger"}`} id="claimAmount" name="claimAmount" value={caseDetailsFormik?.values?.claimAmount} onChange={handleChange} />
                                    {caseDetailsFormik?.touched?.claimAmount && caseDetailsFormik?.errors?.claimAmount ? (
                                        <span className="text-danger">{caseDetailsFormik?.errors?.claimAmount}</span>
                                    ) : null}
                                </div>
                            </div>
                                <div className="row">
                                <div className="mb-3 col-12">
                                    <textarea className={`form-control ${caseDetailsFormik?.touched?.problemStatement && caseDetailsFormik?.errors?.problemStatement && "border-danger"}`} placeholder="Describe problem" name="problemStatement" value={caseDetailsFormik?.values?.problemStatement} onChange={handleChange} rows={5} cols={5} ></textarea>
                                    {caseDetailsFormik?.touched?.problemStatement && caseDetailsFormik?.errors?.problemStatement ? (
                                        <span className="text-danger">{caseDetailsFormik?.errors?.problemStatement}</span>
                                    ) : null}
                                </div>
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
                                                                    {item?.docFormat == "image" ? <FaFileImage /> : (item?.docFormat == "pdf" ? <FaFilePdf /> : <FaFileWord/>)}
                                                                </div>
                                                                    <div>{item?.docFormat}</div>
                                                            </div>
                                                          
                                                        </div>
                                                        )}
                                                    </div>
                                </div>
                            <div className="d-flex  justify-content-center">
                                <button type="submit" aria-disabled={loading} className={loading ? "d-flex align-items-center justify-content-center gap-3 btn btn-primary w-50 disabled" : "d-flex align-items-center justify-content-center gap-3 btn btn-primary w-50 "}>
                                    {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span> : <span>Save </span>}
                                </button>
                            </div>

                        </div>

                    </div>
                </form>
            </div>
        </div>}
    </>)
}