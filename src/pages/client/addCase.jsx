import { useEffect, useState } from "react"
import { generalInsuranceList, healthInsuranceList, LifeInsuranceList,otherInsuranceList } from "../../utils/constant"
import { clientAddNewCase } from "../../apis"
import { toast } from 'react-toastify'
import { useNavigate } from "react-router-dom"
import { isNaN, useFormik } from 'formik'
import * as yup from 'yup'
import { clientAttachementUpload } from "../../apis/upload"
import { useRef } from "react"
import AddCaseComp from "../../components/Reuse/AddCaseComp"

export default function ClientNewCase() {
    const [uploadAttachement,setUploadAttachement] = useState({status:0,message:""})
    const [uploadedFiles,setUploadedFiles] = useState([])
    const [uploadingDocs,setUploadingDocs] = useState(false)
    const [selectPolicyType, setSelectPolicyType] = useState("")
    const [selectComplaintType, setComplaintPolicyType] = useState([])
    const [loading, setLoading] = useState(false)
    const attachmentRef = useRef()
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
            DOB: yup.string(),
            pinCode: yup.string(),
            claimAmount: yup.string().required("Please Enter your Claim Amount"),
            city: yup.string(),
            state: yup.string(),
            problemStatement: yup.string(), 
        }),
        onSubmit: async (values) => {
            let payLoad = { ...values,caseDocs:uploadedFiles }
            // console.log("formik values",values,payLoad);
            // return
            setLoading(true)
            try {
                const res = await clientAddNewCase(payLoad)
                // console.log("client new case", res?.data);
                if (res?.data?.success && res?.data) {
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

    })

    useEffect(()=>{
        const policyType = caseDetailsFormik?.values?.policyType
        caseDetailsFormik.setFieldValue("complaintType","")
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
    
    const handleCaseDocsUploading =(payload)=>{
        setUploadedFiles([...uploadedFiles,payload])
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

    // console.log("caseformik",caseDetailsFormik?.errors);




    return (<>
        <div>
            <AddCaseComp addCase={clientAddNewCase} uploadAttachment={clientAttachementUpload} successUrl={"/client/view case/"} role="client"/>
        </div>
    </>)
}