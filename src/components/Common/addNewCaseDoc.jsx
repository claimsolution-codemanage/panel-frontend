import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { IoMdAdd } from 'react-icons/io'
import { v4 as uuidv4 } from 'uuid';
import { FaFilePdf, FaFileImage,FaFileWord } from 'react-icons/fa6'
import { docType } from '../../utils/constant';
import { LuFileAudio } from "react-icons/lu"
import { AppContext } from '../../App';
import { TiDeleteOutline } from "react-icons/ti";
import DocumentPreview from '../DocumentPreview';


export default function AddNewCaseDocsModal({uploadingDocs,setUploadingDocs, handleCaseDocsUploading, attachementUpload }) {
    const appState = useContext(AppContext)
    const [data, setData] = useState({
        docDate: new Date().toLocaleDateString(),
        docName: "",
        docType: "",
        docFormat: "",
        docURL: "",
        isPrivate:false
    })

    const userDetails = appState?.myAppData?.details
    const hasAccess = userDetails?.role?.toLowerCase()=="admin" || userDetails?.empType?.toLowerCase()=="operation"

    // console.log(hasAccess);
    
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
        setOtherDocName("")
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
            const fileName = file.name;
            const maxSize = 150 * 1024 * 1024; // 150MB
            const allowedExtensions = [
                "jpg", "jpeg", "png", "gif", "bmp", 
                "pdf", 
                "mp3", "wav", "ogg", "amr", "aac", 
                "mp4", "avi", 
                "doc", "docx", 
                "xls", "xlsx"
            ];
            const mimeTypes = {
                image: ["image/jpeg", "image/png", "image/gif", "image/bmp"],
                pdf: ["application/pdf"],
                audio: ["audio/mpeg", "audio/wav", "audio/ogg", "audio/amr", "audio/aac"],
                video: ["video/mp4", "video/x-msvideo"],
                word: [
                    "application/msword",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                ],
                excel: [
                    "application/vnd.ms-excel",
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                ],
            };
    
            // Validate file size
            if (file.size > maxSize) {
                setLoading({
                    status: false,
                    code: 2,
                    type: "uploading",
                    message: "File must be less than 150MB",
                });
                return;
            }
    
            // Get file extension and type
            let fileType = file.type || "";
            const fileExtension = fileName.split(".").pop().toLowerCase();
    
            // Determine file type if MIME is missing
            if (!fileType) {
                if (["mp3", "wav", "ogg", "amr", "aac"].includes(fileExtension)) {
                    fileType = "audio";
                } else if (["mp4", "avi"].includes(fileExtension)) {
                    fileType = "video";
                } else if (["doc", "docx"].includes(fileExtension)) {
                    fileType = "word";
                } else if (["xls", "xlsx"].includes(fileExtension)) {
                    fileType = "excel";
                } else if (["jpg", "jpeg", "png", "gif", "bmp"].includes(fileExtension)) {
                    fileType = "image";
                } else if (fileExtension === "pdf") {
                    fileType = "application/pdf";
                }
            }
    
            // Match file type with allowed MIME types
            const isFileSupported =
                mimeTypes.image.includes(fileType) ||
                mimeTypes.pdf.includes(fileType) ||
                mimeTypes.audio.includes(fileType) ||
                mimeTypes.video.includes(fileType) ||
                mimeTypes.word.includes(fileType) ||
                mimeTypes.excel.includes(fileType);
    
            if (isFileSupported) {
                if (mimeTypes.image.includes(fileType)) {
                    uploadAttachmentFile(file, "image");
                } else if (mimeTypes.pdf.includes(fileType)) {
                    uploadAttachmentFile(file, "pdf");
                } else if (mimeTypes.audio.includes(fileType)) {
                    uploadAttachmentFile(file, "audio");
                } else if (mimeTypes.video.includes(fileType)) {
                    uploadAttachmentFile(file, "video");
                } else if (mimeTypes.word.includes(fileType)) {
                    uploadAttachmentFile(file, "word");
                } else if (mimeTypes.excel.includes(fileType)) {
                    uploadAttachmentFile(file, "excel");
                }
            } else if (allowedExtensions.includes(fileExtension)) {
                setLoading({
                    status: false,
                    code: 2,
                    type: "uploading",
                    message: `Unsupported file type for ${fileExtension}. Please upload a valid file.`,
                });
            } else {
                setLoading({
                    status: false,
                    code: 2,
                    type: "uploading",
                    message: "File format not supported. Supported formats: image, audio, pdf, video, Word, Excel.",
                });
            }
        } else {
            setLoading({
                status: false,
                code: 2,
                type: "uploading",
                message: "Please select a file",
            });
        }
    };
        

    const handleRemoveDoc =()=>{
        setData({...data,docURL:null})
    }
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
                        {/* <span>Allowed only image, pdf and audio file</span> */}
                    </div>
                    {hasAccess && <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" checked={data?.isPrivate} onChange={(e)=>setData({...data,isPrivate:e?.target?.checked})}/>
                <label class="form-check-label" for="private">Private</label>
                </div>}
               
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
                    <div className="row row-cols-3 p-0 m-0">
                        {data?.docURL && <div  className="align-items-center p-0 bg-color-7 d-flex flex-column justify-content-center rounded-3">
                            <div onClick={handleRemoveDoc} className='text-danger fs-3 cursor-pointer'><TiDeleteOutline/></div>
                            <div className="d-flex flex-column justify-content-center align-items-center">
                                <DocumentPreview url={data?.docURL}/>
                                {/* <div className="d-flex justify-content-center bg-color-6 align-items-center fs-4 text-white bg-primary" style={{ height: '3rem', width: '3rem', borderRadius: '3rem' }}>
                                    {data?.docType == "image" ? <FaFileImage /> : (data?.docType == "pdf" ? <FaFilePdf /> : (data?.docType=="audio" ? <LuFileAudio /> :<FaFileWord />))}
                                </div> */}
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