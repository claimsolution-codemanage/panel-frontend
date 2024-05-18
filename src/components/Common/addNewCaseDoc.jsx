import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { IoMdAdd } from 'react-icons/io'
import { v4 as uuidv4 } from 'uuid';
import { FaFilePdf, FaFileImage } from 'react-icons/fa6'
import { docType } from '../../utils/constant';

export default function AddNewCaseDocsModal({uploadingDocs,setUploadingDocs, handleCaseDocsUploading, attachementUpload }) {
    const [data, setData] = useState({
        docDate: new Date().toLocaleDateString(),
        docName: "",
        docType: "",
        docFormat: "",
        docURL: ""
    })
    const [otherDocName,setOtherDocName] = useState("")
    const docRef = useRef()
    const [loading, setLoading] = useState({ status: false, code: 0, type: "", message: "" })
    const navigate = useNavigate()
    const [uploadFileName, setUploadFileName] = useState(null)

    const handleSumbit = async (e) => {
        e.preventDefault()
        const payload ={
            ...data,
            docName:otherDocName ? otherDocName : data?.docName
        }
        setUploadFileName(null)
        handleCaseDocsUploading(payload)
        setData({
            docDate: new Date().toLocaleDateString(),
            docName: "",
            docType: "",
            docFormat: "",
            docURL: ""
        })
        setUploadingDocs(false)
    }

    const uploadAttachmentFile = async (file, type) => {
        setLoading({ status: true, code: 0, type: "uploading", message: "uploading..." })
        try {
            const formData = new FormData()
            formData.append("file", file)
            const res = await attachementUpload(type, formData)
            // console.log("partner", res?.data);
            if (res?.data?.success) {
                // console.log("response", res?.data);
                // setUploadedFiles([...uploadedFiles,{fileType:type,url:res?.data?.url}])
                setData((prevData) => ({ ...prevData, docType: type, docFormat: type, docURL: res?.data?.url }))
                // toast.success(res?.data?.message)
                setLoading({ status: false, code: 1, type: "uploading", message: res?.data?.message })
                // setUploadAttachement({ status: 1, message: res?.data?.message });
                setTimeout(() => {
                    setLoading({ status: false, code: 1, type: "", message: "" });
                }, 1000);

            }
        } catch (error) {
            // console.log("error", error);
            if (error && error?.response?.data?.message) {
                // toast.error(error?.response?.data?.message)
                // setUploadAttachement({ status: 2, message: error?.response?.data?.message });
                setLoading({ status: false, code: 2, type: "uploading", message: error?.response?.data?.message })
                // setLoading(false)
            } else {
                // toast.error("Something went wrong")
                setLoading({ status: false, code: 2, type: "uploading", message: "Something went wrong" })

                // setUploadAttachement({ status: 2, message: "Something went wrong" });
                // setLoading(false)
            }
        }
    }


    const handleAttachment = async (e) => {
        const files = e.target.files;

        if (files && files.length > 0) {
            const file = files[0];
            const fileType = file?.type;
            const maxSize = 150 * 1024 * 1024;
            if (file.size > maxSize) {
            setLoading({ status: false, code: 2, type: "uploading", message: "File must be less than 150Mb" })
            return
            }


            if (fileType.includes("image")) {
                // setLoading({status:true,code:0,type:"uploading",message:"uploading..."})
                uploadAttachmentFile(file, "image")

                // console.log("Processing image file");
            } else if (fileType.includes("pdf")) {
                // setLoading({status:true,code:0,type:"uploading",message:"uploading..."})
                uploadAttachmentFile(file, "pdf")
                // Process PDF file
                // console.log("Processing PDF file");
            } else if (fileType == "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                setLoading({ status: false, code: 2, type: "uploading", message: "File must be image, pdf file" })
                // uploadAttachmentFile(file, "word")
                
                // console.log("Processing Word file");
            } else {
                setLoading({ status: false, code: 2, type: "uploading", message: "File must be image, pdf file" })
                // Unsupported file type
                // setUploadAttachement({ status: 2, message: "File must be image, pdf or word file" });
            }
        } else {
            setLoading({ status: false, code: 2, type: "uploading", message: "Please select a file" })
            // setUploadAttachement({ status: 2, message: "Please select a file" });
        }
    };

    // console.log("data", data);

    return (
        <Modal
            show={uploadingDocs}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Body className='color-4'>
                <div className='p-3'>
                    <div className="border-3 border-primary border-bottom mb-5">
                        <h6 className="text-primary text-center fs-3">Add File</h6>
                    </div>
                    <div className='d-flex flex-column text-primary text-center h6 justify-content-center'>
                        <span>Add one file at a time</span>
                        <span>Allowed only image and pdf file</span>
                    </div>
                    <div className="mb-3 ">
                <label htmlFor="docType" className={`form-label`}>Document Type*</label>
                <select className={`form-select `} id="complaintType" name="complaintType" value={data?.docName} onChange={(e)=>setData({...data,docName:e?.target?.value})} aria-label="Default select example">
                <option value="">--Select Document Type</option>
                {docType?.map(type=><option key={type?.value} value={type.value}>{type.label}</option>)}
                </select>
                {data?.docName?.toLowerCase()=="other" &&<>
                <input type="text" className="form-control mt-2" placeholder={"Document Name"} value={otherDocName} onChange={(e)=>e?.target?.value?.length<60 && setOtherDocName(e?.target?.value)} />
                <p>Document name have maximum 60 characters</p>
                </> }
                </div>
                    <div className="d-flex  gap-5 px-5  align-items-center">
                        {data?.docURL && <div  className="align-items-center bg-color-7 d-flex flex-column justify-content-center w-25 rounded-3">
                            <div className="d-flex flex-column p-4 justify-content-center align-items-center">
                                <div className="d-flex justify-content-center bg-color-6 align-items-center fs-4 text-white bg-primary" style={{ height: '3rem', width: '3rem', borderRadius: '3rem' }}>
                                    {data?.docType == "image" ? <FaFileImage /> : <FaFilePdf />}
                                </div>
                            </div>
                            <div className="d-flex align-items-center justify-content-center bg-dark gap-5 w-100 p-2 text-primary">
                                <p className="fs-5 text-break text-capitalize text-center text-wrap">{data?.docName}</p>
                            </div>
                        </div>
                        }
                    </div>

                    <p className={`text-center ${loading.code == 2 ? 'text-danger' : 'text-success'}`}>{loading?.message}</p>
                   {!data?.docURL && data?.docName  && (data?.docName?.toLowerCase()!="other" || otherDocName)  && <div className="d-flex justify-content-center gap-3 mb-3">
                        {/* <input type="text" name="docName" className="form-control w-50" max={15} value={data.docName} disabled={loading.status} onChange={hangleOnchange} placeholder='Document Name' /> */}
                        <span onClick={() => !loading.status && docRef.current.click()} className="bg-primary d-flex justify-content-center align-items-center text-white" style={{ cursor: 'pointer', height: '2rem', width: '2rem', borderRadius: '2rem' }}><IoMdAdd /></span>
                        <input type="file" ref={docRef} onChange={handleAttachment} name="caseDoc" hidden={true} id="" />
                    </div> }
                    <p className='text-center'>{uploadFileName}</p>

                </div>

            </Modal.Body>
            <Modal.Footer>
                <div className="d-flex  justify-content-center">
                    <button disabled={loading.status || !data?.docURL} className={`d-flex align-items-center justify-content-center gap-3 btn btn-primary ${(loading.status && loading.type == "submit") && "disabled"}`} onClick={handleSumbit}>
                        {(loading.status && loading.type == "submit") ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span> : <span>Add</span>}
                    </button>
                </div>
                <Button disabled={loading.status } onClick={() => !loading.status && setUploadingDocs(false)}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}