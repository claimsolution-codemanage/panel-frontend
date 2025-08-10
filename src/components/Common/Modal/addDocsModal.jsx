import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useContext, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { IoMdAdd } from 'react-icons/io'
import { docType } from '../../../utils/constant';
import DocumentPreview from '../../DocumentPreview';
import { TiDeleteOutline } from 'react-icons/ti';
import { getFileTypeFromExtension } from '../../../utils/helperFunction';
import { AppContext } from '../../../App';

export default function AddDocsModal({ _id, uploadingDocs,getCaseById, setUploadingDocs, handleCaseDocsUploading, attachementUpload,type }) {
    const appState = useContext(AppContext)
    const docRef = useRef()
    const [data, setData] = useState([])
    const [docInfo,setDocInfo] = useState({isPrivate:false,docName:"",otherDocName:""})
    const [loading, setLoading] = useState({ status: false, code: 0, type: "", message: "" })
    const userDetails = appState?.myAppData?.details
    const hasAccess = userDetails?.role?.toLowerCase()=="admin" || userDetails?.empType?.toLowerCase()=="operation"   

    const handleSumbit = async (e) => {
        e.preventDefault()
        setLoading({ status: true, code: 1, type: "submit", message: "files adding.." })
        try {
            const payload = data?.map(ele=>{
                return {
                        ...ele,
                        docName:docInfo?.otherDocName ? docInfo?.otherDocName : docInfo?.docName,
                        new:true,
                        isPrivate:docInfo?.isPrivate
                }
            }) 
            const res = await handleCaseDocsUploading(_id, {caseDocs:payload})
            if (res?.data?.success) {
                toast.success(res?.data?.message)
                setData([])
                getCaseById && getCaseById()
                setDocInfo({isPrivate:false,docName:"",otherDocName:""})
                setLoading({ status: false, code: 1, type: "submit", message: res?.data?.message })
                setUploadingDocs(false)
            }
        } catch (error) {
            if (error && error?.response?.data?.message) {
                setLoading({ status: false, code: 2, type: "submit", message: error?.response?.data?.message })
            } else {
                setLoading({ status: false, code: 2, type: "submit", message: "Something went wrong" })
            }
        }
        setTimeout(() => {
            setLoading({ status: false, code: 0, type: "", message: "" })
        }, 3000);
    }


    // verify supported docs
    const handleAttachment = async (e) => {
        const files = e.target.files;
    
        if (files && files.length <= 20) {
            const allSelectedFiles = [...files];
            const maxSize = 150 * 1024 * 1024; // 150MB
    
            // Validate file size
            if (allSelectedFiles.some(file => file.size > maxSize)) {
                setLoading({
                    status: false,
                    code: 2,
                    type: "uploading",
                    message: "Files must be less than 150MB",
                });
                return;
            }
    
            // Add fileType to each file
            const processedFiles = allSelectedFiles.map(file => {
                const fileExtension = file?.name?.split(".").pop().toLowerCase();
                file.fileType = getFileTypeFromExtension(fileExtension);
                return file;
            });
    
            // Check if all files have valid fileType
            const isFileSupported = processedFiles.every(file => file.fileType);
    
            if (isFileSupported) {
                uploadAttachmentFile(processedFiles);
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
                message: "Please select up to 5 files",
            });
        }
    };
    
    // upload docs to firebase through backend
    const uploadAttachmentFile = async (files) => {
        setLoading({ status: true, code: 0, type: "uploading", message: "Uploading..." });
    
        try {
            const allForm = files.map(file => {
                const formData = new FormData();
                formData.append("file", file);
                return { formData, type: file.fileType };
            });
    
            const result = await Promise.all(allForm.map(form => attachementUpload(form.type, form.formData)));
    
            const allSuccess = result.every(res => res?.data?.success);
    
            if (allSuccess) {
                setData((prevData) => ([
                    ...prevData,
                    ...result.map((res, ind) => ({
                        docDate: new Date().toLocaleDateString(),
                        docType: allForm[ind]?.type,
                        docFormat: allForm[ind]?.type,
                        docURL: res?.data?.url,
                    }))
                ]));
    
                setLoading({ status: false, code: 1, type: "uploading", message: "Files uploaded successfully." });
    
                setTimeout(() => {
                    setLoading({ status: false, code: 1, type: "", message: "" });
                }, 1000);
            } else {
                setLoading({ status: false, code: 2, type: "uploading", message: "Some files failed to upload." });
            }
        } catch (error) {
            setLoading({
                status: false,
                code: 2,
                type: "uploading",
                message: error?.response?.data?.message || "Something went wrong",
            });
        }
    };
    
    // remove uploaded docs
    const handleRemoveDoc =(doc,ind)=>{
        let updatedList = data?.filter?.((ele,index)=>index!=ind)
        setData(updatedList)
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
                        <h6 className="text-primary text-center fs-3">Add Files</h6>
                    </div>
                    <div className='d-flex flex-column text-primary text-center h6 justify-content-center'>
                        <span>Add upto 20 files with maximum size 150MB</span>
                    </div>
                {hasAccess && type!="docEmp" && <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" checked={docInfo?.isPrivate} onChange={(e)=>setDocInfo({...docInfo,isPrivate:e?.target?.checked})}/>
                <label class="form-check-label" for="private">Private</label>
                </div>}
                    <div className="mb-3 ">
                <label for="docType" className={`form-label`}>Document Type*</label>
                <select className={`form-select `} id="complaintType" name="complaintType" value={docInfo?.docName} onChange={(e)=>setDocInfo({...docInfo,otherDocName:"",docName:e?.target?.value})} aria-label="Default select example">
                <option value="">--Select Document Type</option>
                {docType?.map(type=><option value={type.value}>{type.label}</option>)}
                </select>
                {docInfo?.docName?.toLowerCase()=="other" &&<>
                <input type="text" className="form-control mt-2" placeholder={"Document Name"} value={docInfo?.otherDocName} onChange={(e)=>e?.target?.value?.length<60 && setDocInfo({...docInfo,otherDocName:e?.target?.value})} />
                <p>Document name have maximum 60 characters</p>
                </> }
                </div>
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 p-0 m-0">
                        {data?.map((doc,ind)=><div key={doc?.docURL} className="align-items-center m-2 p-0 bg-color-7 d-flex flex-column justify-content-center rounded-3">
                            <div onClick={()=>handleRemoveDoc(doc,ind)} className='text-danger fs-3 cursor-pointer'><TiDeleteOutline/></div>
                            <div className="d-flex flex-column justify-content-center align-items-center">
                                <DocumentPreview url={doc?.docURL}/>
                            </div>
                            <div className="d-flex align-items-center justify-content-center bg-dark gap-5 w-100 p-2 text-primary">
                                <p className="fs-5 text-break text-capitalize text-center text-wrap">{docInfo?.otherDocName || docInfo?.docName}</p>
                            </div>
                        </div>) 
                        }
                    </div>

             
                    <p className={`text-center ${loading.code == 2 ? 'text-danger' : 'text-success'}`}>{loading?.message}</p>
                   {!data?.length ? <div className="d-flex justify-content-center gap-3 mb-3">
                        <span onClick={() =>{ if(!loading.status){
                            docRef.current.click();
                            docRef.current.value = ""
                        }  }} className="bg-primary d-flex justify-content-center align-items-center text-white" style={{ cursor: 'pointer', height: '2rem', width: '2rem', borderRadius: '2rem' }}><IoMdAdd /></span>
                        <input type="file" ref={docRef} multiple={true} onChange={handleAttachment} name="caseDoc" hidden={true} id="" />
                    </div> : "" }
                </div>

            </Modal.Body>
            <Modal.Footer>
                <div className="d-flex  justify-content-center">
                    <button disabled={loading.status || !data?.length} className={`d-flex align-items-center justify-content-center gap-3 btn btn-primary ${(loading.status && loading.type == "submit") && "disabled"}`} onClick={handleSumbit}>
                        {(loading.status && loading.type == "submit") ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span> : <span>Add</span>}
                    </button>
                </div>
                <Button disabled={loading.status } onClick={() => !loading.status && setUploadingDocs(false)}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}