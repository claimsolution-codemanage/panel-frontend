import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { IoMdAdd } from 'react-icons/io'
import { FaFilePdf, FaFileImage } from 'react-icons/fa6'
import { docType } from '../utils/constant';
import { FaFileWord } from 'react-icons/fa';
import { LuFileAudio } from 'react-icons/lu';
import DocumentPreview from './DocumentPreview';
import { TiDeleteOutline } from 'react-icons/ti';

export default function AddDocsModal({ _id, uploadingDocs, setUploadingDocs, handleCaseDocsUploading, attachementUpload }) {
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



    const hangleOnchange = (e) => {
        const { name, value } = e.target;
        if (name == "docName") {
            if (value.length < 25) {
                setData((data) => ({ ...data, [name]: value }))
                setLoading({ status: false, code: 0, type: "", message: "" })
            }

        }
    }

    const handleSumbit = async (e) => {
        e.preventDefault()
        setLoading({ status: true, code: 1, type: "submit", message: "file add.." })
        try {
            const payload ={
                ...data,
                docName:otherDocName ? otherDocName : data?.docName
            }
            const res = await handleCaseDocsUploading(_id, payload)
            if (res?.data?.success) {
                toast.success(res?.data?.message)
                setData({
                    docDate: new Date().toLocaleDateString(),
                    docName: "",
                    docType: "",
                    docFormat: "",
                    docURL: ""
                })
                setLoading({ status: false, code: 1, type: "submit", message: res?.data?.message })
                setUploadingDocs(false)
                setUploadFileName(null)
                setTimeout(() => {
                    setLoading({ status: false, code: 0, type: "", message: "" })
                }, 3000);
            }
        } catch (error) {

            setUploadFileName(null)
            if (error && error?.response?.data?.message) {
                setLoading({ status: false, code: 2, type: "submit", message: error?.response?.data?.message })
                // toast.error(error?.response?.data?.message)
            } else {
                // toast.error("Something went wrong")
                setLoading({ status: false, code: 2, type: "submit", message: "Something went wrong" })
            }
            setUploadFileName("")
            // console.log("adminChangeCaseStatus error", error);
            setTimeout(() => {
                setLoading({ status: false, code: 0, type: "", message: "" })
            }, 3000);
        }

    }

    // const handleUploadFile = (file) => {
    //     setLoading({ status: true, code: 0, type: "uploading", message: "uploading..." })
    //     //  console.log("loading",data);
    //     const fileRef = ref(storage, `case-files/${uuidv4()}`)
    //     uploadBytes(fileRef, file).then(snapshot => {
    //         getDownloadURL(snapshot.ref).then(url => {
    //             // console.log("URL", url);
    //             setData((prevData) => ({ ...prevData, docURL: url }))
    //             setLoading({ status: false, code: 1, type: "uploading", message: "uploaded" })
    //         })
    //     }).catch(error => {
    //         docRef.current = ""
    //         // console.log("error", error);
    //         setLoading({ status: false, code: 2, type: "uploading", message: "Failed to upload file" })
    //     }
    //     )
    // }

    // const handleDocOnChange = async (e) => {
    //     const file = e.target.files;
    //     if (file.length != 0) {
    //         if (file?.length == 1) {
    //             const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    //             if (!allowedTypes.includes(file[0].type)) {
    //                 setLoading({ status: false, code: 2, type: "selecting", message: "file must be jpeg, jpg, png or pdf" })
    //                 return;
    //             }
    //             if (file[0].type == 'application/pdf') {
    //                 const maxSize = 5 * 1024 * 1024; // 1MB
    //                 if (file[0].size > maxSize) {
    //                     setLoading({ status: false, code: 2, type: "selecting", message: "Pdf size must be less than 5MB" })
    //                     return;
    //                 }
    //                 setData((data) => ({ ...data, docType: "pdf", docFormat: file[0].type }))
    //                 setUploadFileName(file[0].name)
    //                 handleUploadFile(file[0])
    //             } else {
    //                 const maxSize = 1024 * 1024; //1024 * 1024 1MB
    //                 if (file[0].size > maxSize) {
    //                     setLoading({ status: false, code: 2, type: "selecting", message: "Image size must be less than 1MB" })
    //                     return;
    //                 }
    //                 setData((data) => ({ ...data, docType: "image", docFormat: file[0].type }))
    //                 // setData({...data,docType:"image",docFormat:file[0].type})
    //                 setUploadFileName(file[0].name)
    //                 handleUploadFile(file[0])
    //             }
    //         } else {
    //             setLoading({ status: false, code: 2, type: "selecting", message: "Allowed one file at a time" })
    //         }
    //     } else {
    //         setLoading({ status: false, code: 2, type: "selecting", message: "File not selected" })
    //     }
    // }



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
                    fileType = "pdf";
                }
            }
            // Match file type with allowed MIME types
            const isFileSupported = fileType
            if (isFileSupported) {
                uploadAttachmentFile(file, fileType);
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
                        {/* <span>Allowed only image, audio and pdf file</span> */}
                    </div>
                    <div className="mb-3 ">
                <label for="docType" className={`form-label`}>Document Type*</label>
                <select className={`form-select `} id="complaintType" name="complaintType" value={data?.docName} onChange={(e)=>setData({...data,docName:e?.target?.value})} aria-label="Default select example">
                <option value="">--Select Document Type</option>
                {docType?.map(type=><option value={type.value}>{type.label}</option>)}
                </select>
                {data?.docName?.toLowerCase()=="other" &&<>
                <input type="text" className="form-control mt-2" placeholder={"Document Name"} value={otherDocName} onChange={(e)=>e?.target?.value?.length<60 && setOtherDocName(e?.target?.value)} />
                <p>Document name have maximum 60 characters</p>
                </> }
                </div>
                    <div className="row row-cols-3 p-0 m-0">
                        {data?.docURL && <div  className="p-0 align-items-center bg-color-7 d-flex flex-column justify-content-center rounded-3">
                            <div onClick={handleRemoveDoc} className='text-danger fs-3 cursor-pointer'><TiDeleteOutline/></div>
                            <div className="d-flex flex-column justify-content-center align-items-center">
                            <DocumentPreview url={data?.docURL}/>
                                {/* <div className="d-flex justify-content-center bg-color-6 align-items-center fs-4 text-white bg-primary" style={{ height: '3rem', width: '3rem', borderRadius: '3rem' }}>
                                    {data?.docType == "image" ? <FaFileImage /> : (data?.docType=="pdf" ? <FaFilePdf /> : (data?.docType=="audio" ? <LuFileAudio /> : <FaFileWord/>)) }
                                </div> */}
                            </div>
                            <div className="d-flex align-items-center justify-content-center bg-dark gap-5 w-100 p-2 text-primary">
                                <p className="text-center text-wrap fs-5 text-capitalize">{data?.docName}</p>
                            </div>
                        </div>
                        }
                    </div>

                    <p className={`text-center ${loading.code == 2 ? 'text-danger' : 'text-success'}`}>{loading?.message}</p>
                   {!data?.docURL && data?.docName && (data?.docName?.toLowerCase()!="other" || otherDocName)  && <div className="d-flex justify-content-center gap-3 mb-3">
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