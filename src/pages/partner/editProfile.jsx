import { allState } from "../../utils/constant"
import "react-image-upload/dist/index.css";
import ImageUploader from "react-image-upload";
import { useState,useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getPartnerProfile } from "../../apis";
import { formatDateToISO } from "../../utils/helperFunction";
import {BsCameraFill} from 'react-icons/bs'
import { imageUpload,updatePartnerProfile } from "../../apis";
import {toast} from 'react-toastify'
import { partnerType } from "../../utils/constant";
import { LuPcCase } from 'react-icons/lu'
import { CiEdit } from 'react-icons/ci'
import { IoArrowBackCircleOutline } from 'react-icons/io5'
import Loader from "../../components/Common/loader";
import { storage } from '../../utils/firebase'
import {ref,uploadBytes,getDownloadURL} from 'firebase/storage'
import { v4 as uuidv4 } from 'uuid';
import { partnerImageUpload } from "../../apis/upload";
import { validateUploadFile } from "../../utils/helperFunction";
import { API_BASE_IMG } from "../../apis/upload";
import { checkPhoneNo,checkNumber } from "../../utils/helperFunction";

export default function EditProfile() {
    const [data,setData] =useState({
        profilePhoto: "",
        consultantName: "",
        consultantCode: "",
        associateWithUs: "",
        primaryEmail: "",
        alternateEmail: "",
        primaryMobileNo: "",
        alternateMobileNo: "",
        whatsupNo: "",
        panNo: "",
        aadhaarNo: "",
        dob: "",
        gender: "",
        businessName: "",
        companyName: "",
        natureOfBusiness: "",
        designation: "",
        areaOfOperation: "",
        workAssociation:"",
        state: "",
        district: "",
        city: "",
        pinCode: "",
        about: ""

    })
    const imgRef = useRef()
    const [loading,setLoading] = useState(true)
    const [uploadPhoto,setUploadPhoto] = useState({status:0, loading:false,message:""})
    const navigate = useNavigate()

    // const handleUploadFile = (file)=>{
    //     setUploadPhoto({ status: 1, loading: true, message: "uploading..." })
    // //  console.log("loading",data);
    //     const fileRef = ref(storage,`detailsImg/${uuidv4()}`)
    // uploadBytes(fileRef,file).then(snapshot=>{
    //     getDownloadURL(snapshot.ref).then(url=>{
    //         console.log("URL",url);
    //         setData((data)=> ({ ...data, profilePhoto: url }))
    //         setUploadPhoto({ status: 1, loading: false, message: "uploaded" })
    //         setTimeout(() => {
    //             setUploadPhoto({ status: 0, loading: false, message: "" })
    //         }, 3000);
    //     })
    // }).catch(error=>{
    //     // docRef.current = ""
    //     console.log("error",error);
    //     setUploadPhoto({ status: 0, loading: false, message: "Failed to upload file" })
    //     // setLoading({status:false,code:2,type:"uploading",message:"Failed to upload file"})
    // }) }


    useEffect(()=>{
       async function fetch(){
        setLoading(true)
        try {
            const res = await getPartnerProfile()
            // console.log("partner",res?.data?.data?.profile);
            if(res?.data?.success && res?.data?.data?.profile){

                setData({...res?.data?.data?.profile})
                setLoading(false)
                
            }
    } catch (error) {
                if(error && error?.response?.data?.message){
                    toast.error(error?.response?.data?.message)
                }else{
                    toast.error("Something went wrong")
                }
            // console.log("profile error",error);
        }
       }fetch() 
    },[])
    // console.log(data);

    const handleImage =(e)=>{
        imgRef.current.click()
    }

  

    // const handleImgOnchange = async(e)=>{
    //     setUploadPhoto({status:0, loading:true,message:""})
    //     const file = e.target.files[0];
    //     if (file) {
    //         // Check the file type
    //         const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    //         if (!allowedTypes.includes(file.type)) {
    //         setUploadPhoto({status:0, loading:false,message:"Image must be jpeg, jpg, or png"})
    //           return;
    //         }
    //         // Check the file size (1MB = 1024 * 1024 bytes)
    //         const maxSize = 100 * 1000; // 100kB
    //         if (file.size > maxSize) {
    //         setUploadPhoto({status:0, loading:false,message:"Image size must be less than 100KB"})
    //           return;
    //         }
    //         handleUploadFile(file)
    // }else{
    //     setUploadPhoto({status:0, loading:false,message:"Image not select"})
    // }}

    const handleUploadFile = async (file) => {
        try {

            // console.log("files efs", file);
            setUploadPhoto({ status: 1, loading: true, message: "uploading..." })
            const res = await partnerImageUpload(file)
            // setData((data) => ({ ...data, profilePhoto: res?.data?.url }))
            setData((data)=> ({ ...data, profilePhoto: res?.data?.url }))
            setUploadPhoto({ status: 1, loading: false, message: "uploaded" })
            setTimeout(() => {
                setUploadPhoto({ status: 0, loading: false, message: "" })
            }, 3000);
        } catch (error) {
            // console.log("upload error:", error);
            setUploadPhoto({ status: 0, loading: false, message: "Failed to upload file" })
        }
    }

    const handleImgOnchange = async (e) => {
        setUploadPhoto({ status: 0, loading: true, message: "" })
        const result = validateUploadFile(e.target.files, 5, "image")
        if (!result?.success) {
            setUploadPhoto({ status: 0, loading: false, message: result?.message })
        } else {
            // console.log("result?.file", result?.file);
            handleUploadFile(result?.file)
        }
    }



    const handleOnchange =(e)=>{
        const {name,value} = e.target;
        setData({...data,[name]:value})
    }

    const handleOnsubmit = async(e)=>{
        e.preventDefault()
        // console.log("data",data);
        setLoading(true)
        try {
            const res = await updatePartnerProfile(data)
            // console.log("partner",res?.data);
            if(res?.data?.success && res?.data){
                // setData([res?.data?.data?.profile])
                toast.success(res?.data?.message)
                setLoading(false)
                navigate("/partner/profile")
            }
    } catch (error) {
                if(error && error?.response?.data?.message){
                    toast.error(error?.response?.data?.message)
                    setLoading(false)
                }else{
                    toast.error("Something went wrong")
                    setLoading(false)

                }
        }
    }

    return (<>
     {loading?<Loader/> :
    <div>
                    <div className="d-flex justify-content-between bg-color-1 text-primary fs-5 px-4 py-3 shadow">
                    <div className="d-flex flex align-items-center gap-3">
                        <IoArrowBackCircleOutline className="fs-3" onClick={()=>navigate('/partner/profile')} style={{ cursor: "pointer" }} />
                        <div className="d-flex flex align-items-center gap-1">
                            <span>Edit Profile</span>
                            {/* <span><LuPcCase /></span> */}
                        </div>
                    </div>

                    <div className="">
                        {/* <p className="badge bg-primary mb-1">{data[0]?.isActive ? "Active" : "Unactive"}</p> */}
                    </div>

                </div>
        <div className="m-2 m-md-5">
            <div className="container-fluid color-4 p-0">
                <div>
               
                        {/* <div className="d-flex flex-column  align-items-center justify-content-center my-5">
                        <div className="d-flex align-items-center justify-content-center  bg-color-2" style={{ height: 150, width: 150,borderRadius:150,cursor:"pointer"}} onClick={handleImage}>
                          {data.profilePhoto ? <img src={`${import.meta.env.VITE_API_BASE_IMG}/${data.profilePhoto}`} alt="profileImg"  style={{ height: 150, width: 150,borderRadius:150,cursor:"pointer"}} /> : <BsCameraFill className="h2 text-white " />}   
                        <input type="file" name="profilePhoto" ref={imgRef} id="profilePhoto" hidden={true} onChange={handleImgOnchange}/>
                        </div>
                         {uploadPhoto.message && <span className={uploadPhoto.status==1 ? "text-success" : "text-danger"}>{uploadPhoto.message}</span>} 
                        </div> */}

                        <div className="align-items-center bg-color-1 rounded-2 row shadow m-0">
                                            <div className="col-12 col-md-2 align-items-center badge bg-primary px-4 py-3 d-flex flex-column gap-1">
                                                <div className="d-flex flex-column  align-items-center justify-content-center">
                                                    <div className="d-flex align-items-center justify-content-center  bg-color-2" style={{ height: 150, width: 150, borderRadius: 150, cursor: "pointer" }} onClick={handleImage}>
                                                        {data.profilePhoto ? <img src={`${API_BASE_IMG}/${data.profilePhoto}`} alt="profileImg" style={{ height: 150, width: 150, borderRadius: 150, cursor: "pointer" }} /> : <BsCameraFill className="h2 text-white " />}
                                                        <input type="file" name="profilePhoto" ref={imgRef} id="profilePhoto" hidden={true} onChange={handleImgOnchange} />
                                                    </div>
                                                    {uploadPhoto.message && <span className={uploadPhoto.status == 1 ? "text-success" : "text-danger"}>{uploadPhoto.message}</span>}
                                                </div>
                                                {/* <h5 className="mb-1 text-capitalize text-white">{data?.consultantName}</h5> */}
                                            </div>
                                            <div className="col-12 col-md-10">
                                                <h5 className="mt-3">About</h5>
                                                <div className="mb-3 col-12 w-75">
                                                    {/* <label for="mobileNo." className="form-label">About you</label> */}
                                                    <textarea class="form-control w-100" name="about" value={data.about} onChange={handleOnchange} placeholder="About yourself" rows={5} cols={5} ></textarea>
                                                </div>
                                            </div>

                                        </div>

                        
                        <div className="bg-color-1 my-5 p-3 p-md-5 rounded-2 shadow">
                                        <div className="border-3 border-primary border-bottom py-2">
                                            <h6 className="text-primary text-center fs-3">Profile Details</h6>
                                        </div>
                    <div className="m-0 row p-md-5">
                        <div className="mb-3 col-12 col-md-4">
                            <label for="name" className="form-label">Name*</label>
                            <input type="text" className="form-control" id="consultantName" name="consultantName" value={data.consultantName} disabled={true}
                            //  onChange={handleOnchange}
                              aria-describedby="consultantName" />
                        </div>
                        <div className="mb-3 col-12 col-md-4">
                            <label for="consultantCode" className="form-label">Consultant Code</label>
                            <input type="text" name="consultantCode" value={data.consultantCode} disabled={true}  className="form-control" id="consultantCode" aria-describedby="consultantCode" />
                        </div>
                        <div className="mb-3 col-12 col-md-4">
                            <label for="associateWithUs" className="form-label">Associate with us</label>
                            <input type="date" name="associateWithUs" value={data.associateWithUs ? formatDateToISO(data.associateWithUs) : '' } disabled={true} className="form-control" id="associateWithUs" aria-describedby="associateWithUs" />
                        </div>
                        <div className="mb-3 col-12 col-md-4">
                            <label for="primaryEmail" className="form-label">Primary Email Id</label>
                            <input type="email"  name="primaryEmail" value={data.primaryEmail} disabled={true}  className="form-control" id="primaryEmail" aria-describedby="primaryEmail" />
                        </div>
                        <div className="mb-3 col-12 col-md-4">
                            <label for="alternateEmail" className="form-label">Alternative Email Id</label>
                            <input type="email" name="alternateEmail" value={data.alternateEmail} onChange={handleOnchange} className="form-control" id="alternateEmail" aria-describedby="alternateEmail" />
                        </div>
                        <div className="mb-3 col-12 col-md-4">
                            <label for="primaryMobileNo" className="form-label">Primary Mobile No</label>
                            <input type="number" name="primaryMobileNo" value={data.primaryMobileNo}  disabled={true} className="form-control" id="primaryMobileNo" aria-describedby="primaryMobileNo" />
                        </div>
                     
                     
                        <div className="mb-3 col-12 col-md-4">
                            <label for="alternateMobileNo" className="form-label">Alternative Mobile No</label>
                            <input type="te;" name="alternateMobileNo" value={data.alternateMobileNo} onChange={(e)=>checkPhoneNo(e?.target?.value) && handleOnchange(e)} className="form-control" id="alternateMobileNo" aria-describedby="alternateMobileNo" />
                        </div>
                        <div className="mb-3 col-12 col-md-4">
                            <label for="whatsupNo" className="form-label">Whatsapp No</label>
                            <input type="tel" name="whatsupNo" value={data.whatsupNo} onChange={(e)=>checkPhoneNo(e?.target?.value) && handleOnchange(e)} className="form-control" id="whatsupNo" aria-describedby="whatsupNo" />
                        </div>
                        <div className="mb-3 col-12 col-md-4">
                            <label for="dob" className="form-label">DOB</label>
                            <input type="date" name="dob" value={data.dob ? formatDateToISO(data.dob) : ''} onChange={handleOnchange} className="form-control" id="dob" aria-describedby="dob" />
                        </div>
                        <div className="mb-3 col-12 col-md-4">
                            <label for="panNo" className="form-label">PAN No</label>
                            <input type="text" name="panNo" value={data.panNo} onChange={handleOnchange} className="form-control" id="panNo" aria-describedby="panNo" />
                        </div>
                        <div className="mb-3 col-12 col-md-4">
                            <label for="aadhaarNo" className="form-label">Aadhaar No</label>
                            <input type="text" name="aadhaarNo" value={data.aadhaarNo} onChange={(e)=>checkNumber(e) && handleOnchange(e)} className="form-control" id="aadhaarNo" aria-describedby="aadhaarNo" />
                        </div>

                        <div className="mb-3 col-12 col-md-4">
                            <label for="gender" className="form-label">Gender</label>
                            <select className="form-select" name="gender" value={data.gender} onChange={handleOnchange} id="gender" aria-label="Default select example">
                                <option value="">--select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        {/* <div className="mb-3 col-12 col-md-4">
                            <label for="businessName" className="form-label">Bussiness Name </label>
                            <input type="text" name="businessName" value={data.businessName} onChange={handleOnchange} className="form-control" id="businessName" aria-describedby="businessName" />
                        </div>
                        <div className="mb-3 col-12 col-md-4">
                            <label for="companyName" className="form-label">Company Name </label>
                            <input type="text" name="companyName" value={data.companyName} onChange={handleOnchange} className="form-control" id="companyName" aria-describedby="companyName" />
                        </div>
                        <div className="mb-3 col-12 col-md-4">
                            <label for="natureOfBusiness" className="form-label">Nature of Bussiness</label>
                            <input type="text" name="natureOfBusiness" value={data.natureOfBusiness} onChange={handleOnchange} className="form-control" id="natureOfBusiness" aria-describedby="natureOfBusiness" />
                        </div> */}
                        {/* <div className="mb-3 col-12 col-md-4">
                            <label for="designation" className="form-label">Designation</label>
                            <input type="text" name="designation" value={data.designation} onChange={handleOnchange} className="form-control" id="designation" aria-describedby="designation" />
                        </div> */}
                        <div className="mb-3 col-12 col-md-4">
                            <label for="areaOfOperation" className="form-label">Area of Operation</label>
                            <input type="text" name="areaOfOperation" value={data.areaOfOperation} onChange={handleOnchange} className="form-control" id="areaOfOperation" aria-describedby="areaOfOperation" />
                        </div>
                        <div className="mb-3 col-12 col-md-4">
                        <label for="areaOfOperation" className="form-label">Work Association</label>
                            <select className="form-select" name="workAssociation" value={data.workAssociation} onChange={handleOnchange} aria-label="Default select example">
                                <option>--select Partner Type</option>
                                {partnerType?.map(partner=><option key={partner} value={partner}>{partner}</option>)}
                            </select>
                        </div>
                 
                        <div className="mb-3 col-12 col-md-4">
                            <label for="district" className="form-label">District</label>
                            <input type="text" name="district" value={data.district} onChange={handleOnchange} className="form-control" id="district" aria-describedby="district" />
                        </div>
                        <div className="mb-3 col-12 col-md-4">
                            <label for="city" className="form-label">City</label>
                            <input type="text" name="city" value={data.city} onChange={handleOnchange} className="form-control" id="city" aria-describedby="city" />
                        </div>
                        <div className="mb-3 col-12 col-md-4">
                            <label for="state" className="form-label">State</label>
                            <select className="form-select" name="state" value={data.state} onChange={handleOnchange} id="state" aria-label="Default select example">
                                <option value="">--select state</option>
                                {allState?.map((state, ind) => <option key={ind} value={state}>{state}</option>)}
                            </select>
                        </div>
                        <div className="mb-3 col-12 col-md-4">
                            <label for="pinCode" className="form-label">Pincode</label>
                            <input type="text" name="pinCode" value={data.pinCode} onChange={(e)=>checkNumber(e) && handleOnchange(e)} className="form-control" id="pinCode" aria-describedby="pinCode" />
                        </div>
                        {/* <div className="mb-3 col-12">
                          
                            <textarea class="form-control" name="about" value={data.about} onChange={handleOnchange} placeholder="About yourself" rows={5} cols={5} ></textarea>
                        </div> */}
                        <div className="d-flex  justify-content-center">
                        <div aria-disabled={loading || uploadPhoto.loading} className={loading||uploadPhoto.loading ? "d-flex align-items-center justify-content-center gap-3 btn btn-primary w-50 disabled" : "d-flex align-items-center justify-content-center gap-3 btn btn-primary w-50 "} onClick={handleOnsubmit}>
                         {loading ? <span className="spinner-border spinner-border-sm"  role="status" aria-hidden={true}></span> : <span>Save </span>} 
                            
                        </div>
                        </div>

                    </div>
                    </div>

                </div>
            </div>
        </div>
    </div>}
    </>)
}