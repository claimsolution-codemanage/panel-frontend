import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { adminCreateOrUpdateStatment,empOpCreateOrUpdateStatment } from '../../apis';





export default function CreateOrUpdateStatmentModal({show,hide,type,partnerId,empId,data}) {
    const [loading,setLoading] = useState(false)
   console.log("type",type);
   


let initialValues={
    empId:"",
    partnerId:"",
    caseLogin:new Date(),
    policyHolder:"",
    fileNo:"",
    policyNo: "",
    insuranceCompanyName: "",
    claimAmount: "",
    approvedAmt:"",
    constultancyFee:"",
    TDS:"",
    modeOfLogin:"",
    payableAmt:"",
    utrDetails:"",
    fileUrl: "",
}

const formik = useFormik({
    initialValues:initialValues,
    validationSchema:Yup.object().shape({
        empId:Yup.string(),
        partnerId:Yup.string(),
        caseLogin:Yup.string().required("Case login is required"),
        policyHolder:Yup.string().required("Policy holder name is required"),
        fileNo:Yup.string().required("File no is required"),
        policyNo:Yup.string().required("Policy no is required"),
        insuranceCompanyName:Yup.string().required("Insurance company name is required"),
        claimAmount:Yup.number().required("Claim amount is required"),
        approvedAmt:Yup.number().required("Approved amount is required"),
        constultancyFee:Yup.number().required("Constultancy fee is required"),
        TDS:Yup.string().required("TDS is required"),
        modeOfLogin:Yup.string().required("Mode of login is required"),
        payableAmt:Yup.number().required("Payable amount is required"),
        utrDetails:Yup.string().required("UTR details is required"),
        fileUrl:Yup.string(),
    }),
    onSubmit:async(values)=>{
        try {
            setLoading(true)
            let payload = {
                ...values,
                caseLogin:new Date(values?.caseLogin).getTime(),
                partnerId:partnerId || "",
                empId:empId || "",
            }
            let res ={}
            if(type=="admin"){
                res = await adminCreateOrUpdateStatment(payload)
            }else{
            res = await empOpCreateOrUpdateStatment(payload)
            }
            if(res?.status==200){
                setLoading(false)
                formik.setValues(initialValues)
                hide()
            toast.success(res?.data?.message)
            }
        } catch (error) {
        if (error && error?.response?.data?.message) {
        toast.error(error?.response?.data?.message)
      } else {
        toast.error("Something went wrong")
      }
      setLoading(false)
        }
        
    }
})


useEffect(()=>{
    if(data?._id){
        formik.setValues({
            _id:data?._id,
            empId:data?.empId || "",
            partnerId:data?.partnerId || "",
            caseLogin:data?.caseLogin ? new Date(data?.caseLogin) : new Date(),
            policyHolder:data?.policyHolder || "",
            fileNo:data?.fileNo ||"",
            policyNo:data?.policyNo || "",
            insuranceCompanyName:data?.insuranceCompanyName || "",
            claimAmount:data?.claimAmount || "",
            approvedAmt:data?.approvedAmt || "",
            constultancyFee:data?.constultancyFee ||"",
            TDS:data?.TDS || "",
            modeOfLogin:data?.modeOfLogin || "",
            payableAmt:data?.payableAmt || "",
            utrDetails:data?.utrDetails || "",
            fileUrl:data?.fileUrl || "",
        })
    }else{
        formik.setValues(initialValues)
    }
},[data])

const checkNumber=(e)=>{
  const {value} = e?.target
  if(!isNaN(value)){
    formik.handleChange(e)
  }else{
    if(value?.inclues(' ')){
    formik.handleChange(e)
    }
  }
}

console.log("formik",formik,data);


    return (
        <Modal
            show={show}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Body className='color-4'>
                <div className='p-3'>
                    <div className="border-3 border-primary border-bottom">
                        <h6 className="text-primary text-center fs-3">Statement</h6>
                    </div>
    
                </div>
                <div className=''>
                <form onSubmit={formik.handleSubmit} className='row row-cols-2 row-cols-1 p-2'>
                <div className="form-group">
                  <label for="caseLogin" className="col-form-label">Case login date:</label>
                  <div className='w-100'>
                    <DatePicker className='form-control w-100' id='caseLogin' selected={formik.values?.caseLogin} dateFormat={"dd-MM-YYYY"} onChange={(date) => formik.setFieldValue("caseLogin",date)}/>
                  </div>
                  <p className='text-danger'>{formik.touched?.caseLogin && formik.errors?.caseLogin}</p>
                </div>
              <div className="form-group ">
                  <label for="policyHolder" className="col-form-label">Policyholder Name:</label>
                  <input type="text" name='policyHolder' value={formik.values?.policyHolder} onChange={formik.handleChange} className={`form-control ${formik.errors?.policyHolder && formik.touched?.policyHolder && "border-danger"}`}  />
                    <p className='text-danger'>{formik.touched?.policyHolder && formik.errors?.policyHolder}</p>
                </div>
                <div className="form-group ">
                  <label for="fileNo" className="col-form-label">File No:</label>
                  <input type="text" name='fileNo' value={formik.values?.fileNo} onChange={checkNumber} className={`form-control ${formik.errors?.fileNo && formik.touched?.fileNo && "border-danger"}`}  />
                    <p className='text-danger'>{formik.touched?.fileNo && formik.errors?.fileNo}</p>
                </div>
                <div className="form-group ">
                  <label for="policyNo" className="col-form-label">Policy No:</label>
                  <input type="text" name='policyNo' value={formik.values?.policyNo} onChange={formik.handleChange} className={`form-control ${formik.errors?.policyNo && formik.touched?.policyNo && "border-danger"}`}  />
                    <p className='text-danger'>{formik.touched?.policyNo && formik.errors?.policyNo}</p>
                </div>
                <div className="form-group ">
                  <label for="insuranceCompanyName" className="col-form-label">Insurance company name:</label>
                  <input type="text" name='insuranceCompanyName' value={formik.values?.insuranceCompanyName} onChange={formik.handleChange} className={`form-control ${formik.errors?.insuranceCompanyName && formik.touched?.insuranceCompanyName && "border-danger"}`}  />
                    <p className='text-danger'>{formik.touched?.insuranceCompanyName && formik.errors?.insuranceCompanyName}</p>
                </div>
                <div className="form-group ">
                  <label for="claimAmount" className="col-form-label">Claim amount:</label>
                  <input type="text" name='claimAmount' value={formik.values?.claimAmount} onChange={checkNumber} className={`form-control ${formik.errors?.claimAmount && formik.touched?.claimAmount && "border-danger"}`}  />
                    <p className='text-danger'>{formik.touched?.claimAmount && formik.errors?.claimAmount}</p>
                </div>
                <div className="form-group ">
                  <label for="approvedAmt" className="col-form-label">Total claim approved amount:</label>
                  <input type="text" name='approvedAmt' value={formik.values?.approvedAmt} onChange={checkNumber} className={`form-control ${formik.errors?.approvedAmt && formik.touched?.approvedAmt && "border-danger"}`}  />
                    <p className='text-danger'>{formik.touched?.approvedAmt && formik.errors?.approvedAmt}</p>
                </div>
                <div className="form-group ">
                  <label for="constultancyFee" className="col-form-label">Consultancy fee :</label>
                  <input type="text" name='constultancyFee' value={formik.values?.constultancyFee} onChange={checkNumber} className={`form-control ${formik.errors?.constultancyFee && formik.touched?.constultancyFee && "border-danger"}`}  />
                    <p className='text-danger'>{formik.touched?.constultancyFee && formik.errors?.constultancyFee}</p>
                </div>
                <div className="form-group ">
                  <label for="TDS" className="col-form-label">TDS:</label>
                  <input type="text" name='TDS' value={formik.values?.TDS} onChange={formik.handleChange} className={`form-control ${formik.errors?.TDS && formik.touched?.TDS && "border-danger"}`}  />
                    <p className='text-danger'>{formik.touched?.TDS && formik.errors?.TDS}</p>
                </div>
                <div className="form-group ">
                  <label for="modeOfLogin" className="col-form-label">Mode of login:</label>
                  <input type="text" name='modeOfLogin' value={formik.values?.modeOfLogin} onChange={formik.handleChange} className={`form-control ${formik.errors?.modeOfLogin && formik.touched?.modeOfLogin && "border-danger"}`}  />
                    <p className='text-danger'>{formik.touched?.modeOfLogin && formik.errors?.modeOfLogin}</p>
                </div>
                <div className="form-group ">
                  <label for="payableAmt" className="col-form-label">Net amount payable:</label>
                  <input type="text" name='payableAmt' value={formik.values?.payableAmt} onChange={checkNumber} className={`form-control ${formik.errors?.payableAmt && formik.touched?.payableAmt && "border-danger"}`}  />
                    <p className='text-danger'>{formik.touched?.payableAmt && formik.errors?.payableAmt}</p>
                </div>
                <div className="form-group ">
                  <label for="utrDetails" className="col-form-label">UTR details:</label>
                  <input type="text" name='utrDetails' value={formik.values?.utrDetails} onChange={formik.handleChange} className={`form-control ${formik.errors?.utrDetails && formik.touched?.utrDetails && "border-danger"}`}  />
                    <p className='text-danger'>{formik.touched?.utrDetails && formik.errors?.utrDetails}</p>
                </div>
              </form>

                </div>

            </Modal.Body>
            <Modal.Footer>
                <div className="d-flex  justify-content-center">
                    <Button disabled={loading} className={`d-flex align-items-center justify-content-center gap-3 btn btn-primary ${loading && "disabled"}`} onClick={formik.handleSubmit}>
                        {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span> : <span>Save</span>}
                    </Button>
                </div>
                <Button className={`${loading && "disabled"}}`} onClick={()=>!loading &&  hide()}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}