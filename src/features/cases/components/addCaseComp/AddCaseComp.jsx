import { useEffect, useState } from "react"
import { policyType} from "../../../../utils/constant"
import { toast } from 'react-toastify'
import { useNavigate } from "react-router-dom"
import { isNaN, useFormik } from 'formik'
import * as yup from 'yup'
import { allState } from "../../../../utils/constant"
import { IoMdAdd } from 'react-icons/io'
import { checkNumber, checkPhoneNo } from '../../../../utils/helperFunction'
import { MdOutlineCancel } from "react-icons/md";
import AddNewCaseDocsModal from "../../../../components/Common/Modal/addNewCaseDoc"
import DocumentPreview from "../../../../components/DocumentPreview"
import TextEditor from "../../../../components/TextEditor"


export default function AddCaseComp({ addCase, uploadAttachment, successUrl,role }) {
    const [uploadedFiles, setUploadedFiles] = useState([])
    const [others, setOthers] = useState({ policy: "", complaint: "" })
    const [uploadingDocs, setUploadingDocs] = useState(false)
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    

    const caseDetailsFormik = useFormik({
        initialValues: {
            clientName: "",
            clientEmail: "",
            clientMobileNo: "",
            partnerEmail: "",
            partnerCode: "",
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
            clientName: yup.string().when('clientEmail',(value)=>{if(value[0]){
                return yup.string().max(50, "Client name must have maximum 50 characters").required("Please client enter name")
            }}),
            clientEmail: yup.string().email("Client email must be valid"),
            clientMobileNo: yup.string().when('clientEmail',(value)=>{if(value[0]){
                return yup.string().min(10, "Client moblie no must have be 10 digit").max(10, "Client moblie no must have be 10 digit").required("Please enter client mobile no")
            }}),
            partnerEmail: yup.string().email("Partner email must be vaild"),
            partnerCode: yup.string(),
            name: yup.string().max(50, "Name must have maximum 50 characters").required("Please enter name"),
            fatherName: yup.string().max(50, "Father's name must have maximum 50 characters"),
            email: yup.string().email("Email must be vaild"),
            mobileNo: yup.string().min(10, "Moblie No must have be 10 digit").max(10, "Moblie No must have be 10 digit").required("Please enter Mobile No."),
            policyType: yup.string(),
            complaintType: yup.string(),
            insuranceCompanyName: yup.string(),
            policyNo: yup.string(),
            address: yup.string(),
            DOB: yup.string(),
            pinCode: yup.string(),
            claimAmount: yup.string().required("Please Enter your Claim Amount"),
            city: yup.string(),
            state: yup.string(),
            problemStatement: yup.string(),
        }),
        onSubmit: async (values) => {
            let payLoad = {
                ...values,
                policyType: values.policyType?.toLowerCase() != "other" ? values.policyType : others.policy,
                complaintType: values.complaintType?.toLowerCase() != "other" ? values.complaintType : others.complaint,
                caseDocs: uploadedFiles
            }
            if(role?.toLowerCase()!="sale"){
            delete payLoad?.partnerCode
            delete payLoad?.partnerEmail
            delete payLoad?.clientEmail
            delete payLoad?.clientName
            delete payLoad?.clientMobileNo

            }
            setLoading(true)
            try {
                const res = await addCase(payLoad)
                if (res?.data?.success && res?.data?.data) {
                    toast.success(res?.data?.message)
                    setLoading(false)
                    if (res?.data?.data?._id) {
                        navigate(`${successUrl}${res?.data?.data?._id}`)
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

    })

    useEffect(() => {
        if(caseDetailsFormik?.values?.policyType?.toLowerCase() == "other" || caseDetailsFormik?.values?.complaintType?.toLowerCase() == "other"){
            if(caseDetailsFormik?.values?.policyType?.toLowerCase() == "other"){
                if (!others.policy) {
                    setError(true)
                } else {
                    setError(false)
                }
            }
            if(caseDetailsFormik?.values?.complaintType?.toLowerCase() == "other"){
                if (!others.complaint) {
                  setError(true)
                } else {
                    if(caseDetailsFormik?.values?.policyType?.toLowerCase() == "other"){
                        !others.policy ? setError(true) : setError(false)
                    }else{
                        setError(false)
                    }
                }
            }
            
        }else{
            setError(false)
        }
        
    }, [others, caseDetailsFormik?.values])

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name == "mobileNo" || name=="clientMobileNo") {
            if (!isNaN(Number(value))) {
                if (value.length <= 10) {
                    caseDetailsFormik.setFieldValue(name, value)
                }
            }
        } else {
            caseDetailsFormik.setFieldValue(name, value)
        }
    }

    const handleCaseDocsUploading = (payload) => {
        setUploadedFiles([...uploadedFiles, ...payload?.map(ele=>{return {...ele,new:true}})])
    }

    const handleRemoveDoc =(id)=>{
        const filterDoc = uploadedFiles.filter((item,ind)=>ind!=id)
        setUploadedFiles(filterDoc)
    }

    return (<>
        <div>
            <div className="d-flex justify-content-between bg-color-1 text-primary fs-5 px-4 py-3 shadow">
                <div className="d-flex flex align-items-center gap-3">
                    {/* <IoArrowBackCircleOutline className="fs-3" style={{ cursor: 'pointer' }} onClick={() => navigate("/client/dashboard")} /> */}
                    <div className="d-flex flex align-items-center gap-1">
                        <span>Add New Case</span>
                    </div>
                </div>
            </div>
            <div className="container-fluid color-4 p-0 bg-color-7">
                <form onSubmit={caseDetailsFormik.handleSubmit} className="contanter">
                    <div className="my-3 p-3 p-md-5">
                        <div className="form bg-color-1 p-3 p-md-5 rounded-2 shadow">
                            <div className="border-3 border-primary border-bottom">
                                <h6 className="text-primary text-center fs-3">Add New Case</h6>
                            </div>
                            {role?.toLowerCase()=="sale" && <>
                            <div className="h4 mt-4">Client Details</div>
                            <div className="row row-cols-md-3 row-cols-1">
                                <div className="mb-3 ">
                                    <label htmlFor="clientName" className={`form-label ${caseDetailsFormik?.touched?.clientName && caseDetailsFormik?.touched?.clientName && caseDetailsFormik?.errors?.clientName && "text-danger"}`}>Name</label>
                                    <input type="text" className={`form-control ${caseDetailsFormik?.touched?.clientName && caseDetailsFormik?.touched?.clientName && caseDetailsFormik?.errors?.clientName && "border-danger"}`} id="clientName" name="clientName" value={caseDetailsFormik?.values?.clientName} onChange={handleChange} />
                                    {caseDetailsFormik?.touched?.clientName && caseDetailsFormik?.errors?.clientName ? (
                                        <span className="text-danger">{caseDetailsFormik?.errors?.clientName}</span>
                                    ) : null}
                                </div>
                                <div className="mb-3 ">
                                    <label htmlFor="clientEmail" className={`form-label ${caseDetailsFormik?.touched?.clientEmail && caseDetailsFormik?.touched?.clientEmail && caseDetailsFormik?.errors?.clientEmail && "text-danger"}`}>Email</label>
                                    <input type="text" className={`form-control ${caseDetailsFormik?.touched?.clientEmail && caseDetailsFormik?.touched?.clientEmail && caseDetailsFormik?.errors?.clientEmail && "border-danger"}`} id="clientEmail" name="clientEmail" value={caseDetailsFormik?.values?.clientEmail} onChange={handleChange} />
                                    {caseDetailsFormik?.touched?.clientEmail && caseDetailsFormik?.errors?.clientEmail ? (
                                        <span className="text-danger">{caseDetailsFormik?.errors?.clientEmail}</span>
                                    ) : null}
                                </div>
                                <div className="mb-3 ">
                                    <label htmlFor="clientMobileNo" className={`form-label ${caseDetailsFormik?.touched?.clientMobileNo && caseDetailsFormik?.touched?.clientMobileNo && caseDetailsFormik?.errors?.clientMobileNo && "text-danger"}`}>Mobile No</label>
                                    <input type="text" className={`form-control ${caseDetailsFormik?.touched?.clientMobileNo && caseDetailsFormik?.touched?.clientMobileNo && caseDetailsFormik?.errors?.clientMobileNo && "border-danger"}`} id="clientMobileNo" name="clientMobileNo" value={caseDetailsFormik?.values?.clientMobileNo} onChange={handleChange} />
                                    {caseDetailsFormik?.touched?.clientMobileNo && caseDetailsFormik?.errors?.clientMobileNo ? (
                                        <span className="text-danger">{caseDetailsFormik?.errors?.clientMobileNo}</span>
                                    ) : null}
                                </div>
                            </div>
                            <div className="h4 mt-4">Partner Details</div>
                            <div className="row row-cols-md-3 row-cols-1">
                                <div className="mb-3 ">
                                    <label htmlFor="partnerEmail" className={`form-label ${caseDetailsFormik?.touched?.partnerEmail && caseDetailsFormik?.touched?.partnerEmail && caseDetailsFormik?.errors?.partnerEmail && "text-danger"}`}>Email</label>
                                    <input type="text" className={`form-control ${caseDetailsFormik?.touched?.partnerEmail && caseDetailsFormik?.touched?.partnerEmail && caseDetailsFormik?.errors?.partnerEmail && "border-danger"}`} id="partnerEmail" name="partnerEmail" value={caseDetailsFormik?.values?.partnerEmail} onChange={handleChange} />
                                    {caseDetailsFormik?.touched?.partnerEmail && caseDetailsFormik?.errors?.partnerEmail ? (
                                        <span className="text-danger">{caseDetailsFormik?.errors?.partnerEmail}</span>
                                    ) : null}
                                </div>
                                <div className="mb-3 ">
                                    <label htmlFor="partnerCode" className={`form-label ${caseDetailsFormik?.touched?.partnerCode && caseDetailsFormik?.touched?.partnerCode && caseDetailsFormik?.errors?.partnerCode && "text-danger"}`}>Consultant Code</label>
                                    <input type="text" className={`form-control ${caseDetailsFormik?.touched?.partnerCode && caseDetailsFormik?.touched?.partnerCode && caseDetailsFormik?.errors?.partnerCode && "border-danger"}`} id="partnerCode" name="partnerCode" value={caseDetailsFormik?.values?.partnerCode} onChange={handleChange} />
                                    {caseDetailsFormik?.touched?.partnerCode && caseDetailsFormik?.errors?.partnerCode ? (
                                        <span className="text-danger">{caseDetailsFormik?.errors?.partnerCode}</span>
                                    ) : null}
                                </div>
                            </div>
                            </>}
                            <div className="h4 mt-4">Policy Holder's Details</div>
                            <div className="row row-cols-12 row-cols-md-3">
                                <div className="mb-3 ">
                                    <label htmlFor="name" className={`form-label ${caseDetailsFormik?.touched?.name && caseDetailsFormik?.touched?.name && caseDetailsFormik?.errors?.name && "text-danger"}`}>Name *</label>
                                    <input type="text" className={`form-control ${caseDetailsFormik?.touched?.name && caseDetailsFormik?.touched?.name && caseDetailsFormik?.errors?.name && "border-danger"}`} id="name" name="name" value={caseDetailsFormik?.values?.name} onChange={handleChange} />
                                    {caseDetailsFormik?.touched?.name && caseDetailsFormik?.errors?.name ? (
                                        <span className="text-danger">{caseDetailsFormik?.errors?.name}</span>
                                    ) : null}
                                </div>
                                <div className="mb-3 ">
                                    <label htmlFor="name" className={`form-label ${caseDetailsFormik?.touched?.fatherName && caseDetailsFormik?.touched?.fatherName && caseDetailsFormik?.errors?.fatherName && "text-danger"}`}>Father's Name</label>
                                    <input type="text" className={`form-control ${caseDetailsFormik?.touched?.fatherName && caseDetailsFormik?.touched?.fatherName && caseDetailsFormik?.errors?.fatherName && "border-danger"}`} id="fatherName" name="fatherName" value={caseDetailsFormik?.values?.fatherName} onChange={handleChange} />
                                    {caseDetailsFormik?.touched?.fatherName && caseDetailsFormik?.errors?.fatherName ? (
                                        <span className="text-danger">{caseDetailsFormik?.errors?.fatherName}</span>
                                    ) : null}
                                </div>
                                <div className="mb-3 ">
                                    <label htmlFor="name" className={`form-label ${caseDetailsFormik?.touched?.email && caseDetailsFormik?.touched?.email && caseDetailsFormik?.errors?.email && "text-danger"}`}>Email</label>
                                    <input type="text" className={`form-control ${caseDetailsFormik?.touched?.email && caseDetailsFormik?.touched?.email && caseDetailsFormik?.errors?.email && "border-danger"}`} id="email" name="email" value={caseDetailsFormik?.values?.email} onChange={handleChange} />
                                    {caseDetailsFormik?.touched?.email && caseDetailsFormik?.errors?.email ? (
                                        <span className="text-danger">{caseDetailsFormik?.errors?.email}</span>
                                    ) : null}
                                </div>
                                <div className="mb-3 ">
                                    <label htmlFor="name" className={`form-label ${caseDetailsFormik?.touched?.mobileNo && caseDetailsFormik?.touched?.mobileNo && caseDetailsFormik?.errors?.mobileNo && "text-danger"}`}>Mobile No*</label>
                                    <input type="text" className={`form-control ${caseDetailsFormik?.touched?.mobileNo && caseDetailsFormik?.touched?.mobileNo && caseDetailsFormik?.errors?.mobileNo && "border-danger"}`} id="mobileNo" name="mobileNo" value={caseDetailsFormik?.values?.mobileNo} onChange={handleChange} />
                                    {caseDetailsFormik?.touched?.mobileNo && caseDetailsFormik?.errors?.mobileNo ? (
                                        <span className="text-danger">{caseDetailsFormik?.errors?.mobileNo}</span>
                                    ) : null}
                                </div>
                                <div className="mb-3 ">
                                    <label htmlFor="name" className={`form-label ${caseDetailsFormik?.touched?.DOB && caseDetailsFormik?.touched?.DOB && caseDetailsFormik?.errors?.DOB && "text-danger"}`}>DOB</label>
                                    <input type="date" className={`form-control ${caseDetailsFormik?.touched?.DOB && caseDetailsFormik?.touched?.DOB && caseDetailsFormik?.errors?.DOB && "border-danger"}`} id="DOB" name="DOB" value={caseDetailsFormik?.values?.DOB} onChange={handleChange} />
                                    {caseDetailsFormik?.touched?.DOB && caseDetailsFormik?.errors?.DOB ? (
                                        <span className="text-danger">{caseDetailsFormik?.errors?.DOB}</span>
                                    ) : null}
                                </div>
                                <div className="mb-3 ">
                                    <label htmlFor="insuranceCompanyName" className={`form-label ${caseDetailsFormik?.touched?.insuranceCompanyName && caseDetailsFormik?.touched?.insuranceCompanyName && caseDetailsFormik?.errors?.insuranceCompanyName && "text-danger"}`}>Insurance Company Name</label>
                                    <input type="text" className={`form-control ${caseDetailsFormik?.touched?.insuranceCompanyName && caseDetailsFormik?.touched?.insuranceCompanyName && caseDetailsFormik?.errors?.insuranceCompanyName && "border-danger"}`} id="insuranceCompanyName" name="insuranceCompanyName" value={caseDetailsFormik?.values?.insuranceCompanyName} onChange={handleChange} />
                                    {caseDetailsFormik?.touched?.insuranceCompanyName && caseDetailsFormik?.errors?.insuranceCompanyName ? (
                                        <span className="text-danger">{caseDetailsFormik?.errors?.insuranceCompanyName}</span>
                                    ) : null}
                                </div>
                                <div className="mb-3 ">
                                    <label htmlFor="policyNo" className={`form-label ${caseDetailsFormik?.touched?.policyNo && caseDetailsFormik?.touched?.policyNo && caseDetailsFormik?.errors?.policyNo && "text-danger"}`}>Policy No</label>
                                    <input type="text" className={`form-control ${caseDetailsFormik?.touched?.policyNo && caseDetailsFormik?.touched?.policyNo && caseDetailsFormik?.errors?.policyNo && "border-danger"}`} id="policyNo" name="policyNo" value={caseDetailsFormik?.values?.policyNo} onChange={handleChange} />
                                    {caseDetailsFormik?.touched?.policyNo && caseDetailsFormik?.errors?.policyNo ? (
                                        <span className="text-danger">{caseDetailsFormik?.errors?.policyNo}</span>
                                    ) : null}
                                </div>
                                <div className="mb-3 ">
                                    <label htmlFor="policyType" className={`form-label ${caseDetailsFormik?.touched?.policyType && caseDetailsFormik?.errors?.policyType && "text-danger"}`}>Policy Type</label>
                                    <select className={`form-select ${caseDetailsFormik?.touched?.policyType && caseDetailsFormik?.errors?.policyType && "border-danger"}`} value={caseDetailsFormik?.values?.policyType} name="policyType" onChange={handleChange} id="policyType" aria-label="Default select example">
                                        <option value="">--Select Policy Type</option>
                                        {policyType.map((policy, ind) => <option key={ind} value={policy}>{policy}</option>)}
                                    </select>
                                    {caseDetailsFormik?.touched?.policyType && caseDetailsFormik?.errors?.policyType ? (
                                        <span className="text-danger">{caseDetailsFormik?.errors?.policyType}</span>
                                    ) : null}
                                </div>
                                {caseDetailsFormik?.values?.policyType?.toLowerCase() == "other" && <div className="mb-3 ">
                                    <label htmlFor="otherPolicyType" className={`form-label`}>Other Policy Type*</label>
                                    <input type="text" className={`form-control`} id="otherPolicyType" name="otherPolicyType" value={others?.policy} onChange={(e) => setOthers({ ...others, policy: e?.target?.value })} />
                                    {caseDetailsFormik?.values?.policyType?.toLowerCase() == "other" && !others?.policy && error ? (
                                        <span className="text-danger">Other policy type required</span>
                                    ) : null}
                                </div>}
                                <div className="mb-3 ">
                                    <label htmlFor="complaintType" className={`form-label ${caseDetailsFormik?.touched?.complaintType && caseDetailsFormik?.errors?.complaintType && "border-danger"}`}>Complaint Type</label>
                                    <select className={`form-select ${caseDetailsFormik?.touched?.complaintType && caseDetailsFormik?.errors?.complaintType && "border-danger"}`} id="complaintType" name="complaintType" value={caseDetailsFormik?.values?.complaintType} onChange={handleChange} aria-label="Default select example">
                                        <option value="">--Select Complaint Type</option>
                                        <option value="Claim Rejection">Claim Rejection</option>
                                        <option value="Claim-Short Payment">Claim-Short Payment</option>
                                        <option value="Policy Cancel">Policy Cancel</option>
                                        <option value="Misselling & Fraud Case">Misselling & Fraud Case</option>
                                        <option value="Other">Other</option>
                                        {/* {selectComplaintType?.map((complaint, ind) => <option key={complaint} value={complaint}>{complaint}</option>)} */}
                                    </select>
                                    {caseDetailsFormik?.touched?.complaintType && caseDetailsFormik?.errors?.complaintType ? (
                                        <span className="text-danger">{caseDetailsFormik?.errors?.complaintType}</span>
                                    ) : null}
                                </div>
                                {caseDetailsFormik?.values?.complaintType?.toLowerCase() == "other" && <div className="mb-3 ">
                                    <label htmlFor="othercomplaintType" className={`form-label`}>Other Complaint Type*</label>
                                    <input type="text" className={`form-control`} id="otherPolicyType" name="otherPolicyType" value={others?.complaint} onChange={(e) => setOthers({ ...others, complaint: e?.target?.value })} />
                                    {caseDetailsFormik?.values?.complaintType?.toLowerCase() == "other" && !others?.complaint && error ? (
                                        <span className="text-danger">Other complaint type required</span>
                                    ) : null}
                                </div>}

                                <div className="mb-3 ">
                                    <label htmlFor="claimAmount" className={`form-label ${caseDetailsFormik?.touched?.claimAmount && caseDetailsFormik?.touched?.claimAmount && caseDetailsFormik?.errors?.claimAmount && "text-danger"}`}>Claim Amount*</label>
                                    <input type="text" className={`form-control ${caseDetailsFormik?.touched?.claimAmount && caseDetailsFormik?.touched?.claimAmount && caseDetailsFormik?.errors?.claimAmount && "border-danger"}`} id="claimAmount" name="claimAmount" value={caseDetailsFormik?.values?.claimAmount} onChange={(e) => checkNumber(e) && handleChange(e)} />
                                    {caseDetailsFormik?.touched?.claimAmount && caseDetailsFormik?.errors?.claimAmount ? (
                                        <span className="text-danger">{caseDetailsFormik?.errors?.claimAmount}</span>
                                    ) : null}
                                </div>
                                <div className="mb-3 ">
                                    <label htmlFor="name" className={`form-label ${caseDetailsFormik?.touched?.address && caseDetailsFormik?.touched?.address && caseDetailsFormik?.errors?.address && "text-danger"}`}>Address</label>
                                    <input type="text" className={`form-control ${caseDetailsFormik?.touched?.address && caseDetailsFormik?.touched?.address && caseDetailsFormik?.errors?.address && "border-danger"}`} id="address" name="address" value={caseDetailsFormik?.values?.address} onChange={handleChange} />
                                    {caseDetailsFormik?.touched?.address && caseDetailsFormik?.errors?.address ? (
                                        <span className="text-danger">{caseDetailsFormik?.errors?.address}</span>
                                    ) : null}
                                </div>
                                <div className="mb-3 ">
                                    <label htmlFor="name" className={`form-label ${caseDetailsFormik?.touched?.city && caseDetailsFormik?.touched?.city && caseDetailsFormik?.errors?.city && "text-danger"}`}>City</label>
                                    <input type="text" className={`form-control ${caseDetailsFormik?.touched?.city && caseDetailsFormik?.touched?.city && caseDetailsFormik?.errors?.city && "border-danger"}`} id="city" name="city" value={caseDetailsFormik?.values?.city} onChange={handleChange} />
                                    {caseDetailsFormik?.touched?.city && caseDetailsFormik?.errors?.city ? (
                                        <span className="text-danger">{caseDetailsFormik?.errors?.city}</span>
                                    ) : null}
                                </div>
                                <div className="mb-3 col-12 col-md-4">
                                    <label htmlFor="state" className={`form-label ${caseDetailsFormik?.touched?.state && caseDetailsFormik?.touched?.state && caseDetailsFormik?.errors?.state && "text-danger"}`}>State</label>
                                    <select className={`form-select ${caseDetailsFormik?.touched?.state && caseDetailsFormik?.touched?.state && caseDetailsFormik?.errors?.state && "border-danger"}`} name="state" value={caseDetailsFormik?.values?.state} onChange={handleChange} id="state" aria-label="Default select example">
                                        <option value="">--select state</option>
                                        {allState?.map((state, ind) => <option key={ind} value={state}>{state}</option>)}
                                    </select>
                                    {caseDetailsFormik?.touched?.state && caseDetailsFormik?.errors?.state ? (
                                        <span className="text-danger">{caseDetailsFormik?.errors?.state}</span>
                                    ) : null}
                                </div>
                                <div className="mb-3 ">
                                    <label htmlFor="name" className={`form-label ${caseDetailsFormik?.touched?.pinCode && caseDetailsFormik?.touched?.pinCode && caseDetailsFormik?.errors?.pinCode && "text-danger"}`}>PinCode</label>
                                    <input type="text" className={`form-control ${caseDetailsFormik?.touched?.pinCode && caseDetailsFormik?.touched?.pinCode && caseDetailsFormik?.errors?.pinCode && "border-danger"}`} id="pinCode" name="pinCode" value={caseDetailsFormik?.values?.pinCode} onChange={(e) => checkPhoneNo(e?.target?.value,6) && handleChange(e)} />
                                    {caseDetailsFormik?.touched?.pinCode && caseDetailsFormik?.errors?.pinCode ? (
                                        <span className="text-danger">{caseDetailsFormik?.errors?.pinCode}</span>
                                    ) : null}
                                </div>

                            </div>
                            <div className="row">
                                <div className="mb-3 col-12">
                                    <TextEditor value={caseDetailsFormik?.values?.problemStatement} handleOnChange={(val)=>caseDetailsFormik?.setFieldValue("problemStatement",val)}/>
                                    {/* <textarea className={`form-control ${caseDetailsFormik?.touched?.problemStatement && caseDetailsFormik?.errors?.problemStatement && "border-danger"}`} placeholder="Describe problem" name="problemStatement" value={caseDetailsFormik?.values?.problemStatement} onChange={handleChange} rows={5} cols={5} ></textarea> */}
                                    {caseDetailsFormik?.touched?.problemStatement && caseDetailsFormik?.errors?.problemStatement ? (
                                        <span className="text-danger">{caseDetailsFormik?.errors?.problemStatement}</span>
                                    ) : null}
                                </div>
                            </div>
                            <div className="mb-5">
                                <div>
                                    <div className="d-flex gap-3 justify-content-center text-primary text-center fs-4">
                                        <span>Document</span>
                                        <span onClick={() => setUploadingDocs(true)} className="bg-primary d-flex justify-content-center align-items-center text-white" style={{ cursor: 'pointer', height: '2rem', width: '2rem', borderRadius: '2rem' }}><IoMdAdd /></span>
                                    </div>
                                </div>
                                <div className="row row-cols-1 row-cols-md-4  align-items-center">
                                    {uploadedFiles.map((item,ind) => <div className="p-2">
                                    <div className="align-items-center bg-color-7 d-flex flex-column justify-content-center w-100 rounded-3">
                                        <div onClick={()=>handleRemoveDoc(ind)}  className="text-danger fs-5 cursor-pointer"><MdOutlineCancel/></div>
                                        <div className="d-flex flex-column justify-content-center align-items-center">
                                        <DocumentPreview url={ item?.docURL} />
                                        </div>
                                        <div className="d-flex align-items-center justify-content-center bg-dark gap-5 w-100 p-2 text-primary">
                                            <p className="fs-5 text-break text-capitalize text-center text-wrap">{item?.docName}</p>
                                        </div>
                                    </div>
                                    </div> 
                                    )}
                                </div>
                            </div>
                            <div className="d-flex  justify-content-center">
                                <button type="submit" aria-disabled={loading} disabled={error} className={loading ? "d-flex align-items-center justify-content-center gap-3 btn btn-primary w-50 disabled" : "d-flex align-items-center justify-content-center gap-3 btn btn-primary w-50 "}>
                                    {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span> : <span>Submit </span>}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <AddNewCaseDocsModal uploadingDocs={uploadingDocs} setUploadingDocs={setUploadingDocs} handleCaseDocsUploading={handleCaseDocsUploading} attachementUpload={uploadAttachment} />
        </div>
    </>)
}