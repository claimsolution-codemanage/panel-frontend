import React, { useEffect, useState } from 'react'
import DocumentPreview from '../../DocumentPreview'
import { getCheckStorage } from '../../../utils/helperFunction'
import { FaFileWord } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import { IoArrowBackCircleOutline, IoFolder } from 'react-icons/io5'
import { IoMdAdd } from 'react-icons/io'
import AddDocsModal from '../../addDocsModal'
import ConfirmationModal from '../confirmationModal'
import SetStatusOfProfile from '../setStatusModal'
import { toast } from 'react-toastify'
import { CiLock } from 'react-icons/ci'

export default function DocumentSection({ role, data, getCaseById, attachementUpload, addCaseDoc,deleteDoc,setCaseDocStatus }) {
    const [uploadingDocs, setUploadingDocs] = useState(false)
    const [folderInfo, setFolderInfo] = useState({})
    const [fileInfo, setFileInfo] = useState({ type: null, list: [] })
    const [changeisActiveStatus, setChangeIsActiveStatus] = useState({ show: false, details: {} })
    const [deleteCaseDoc, setDeleteCaseDoc] = useState({ status: false, id: null })
    


    useEffect(() => {
        let caseDocs = data?.[0]?.caseDocs
        if (Array.isArray(caseDocs)) {
            let folder = {}
            caseDocs?.forEach(ele => {
                let type = ele?.name?.toLowerCase() || "other"
                if (folder[type]) {
                    folder[type] = [...folder[type], ele]
                } else {
                    folder[type] = [ele]
                }
            })
            setFolderInfo(folder)
        }
    }, [data])


    const handleChanges = async (_id, status) => {
        try {
            const res = await setCaseDocStatus(_id, status)
            if (res?.data?.success) {
                setChangeIsActiveStatus({ show: false, details: {} })
                toast.success(res?.data?.message)
                if(getCaseById){
                    getCaseById()
                }

            }
        } catch (error) {
            if (error && error?.response?.data?.message) {
                toast.error(error?.response?.data?.message)
            } else {
                toast.error("Something went wrong")
            }
            // console.log("allAdminCase isActive error", error);
        }
    }



    const handleShareDocument = (type, data) => {
        const docUrl = getCheckStorage(data?.url)
        if (!docUrl) return
        if (type == "whatsapp") {
            const message = `Document share from ClaimSolution. Check out this document: ${data?.name || "document"}\n${docUrl}`;
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
            window.open(whatsappUrl, "_blank");
        } else if (type == "email") {
            const subject = `Document share from ClaimSolution`;
            const body = `Hi,\n\nCheck out this document: ${data?.name || "document"}\n\nPlease find the document link below:\n${docUrl}\n\nRegards\nClaimSolution`
            const emailUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
            window.open(emailUrl, "_blank");
        }
    }

    return (
        <div>
            <div className="bg-color-1 my-5 p-3 p-md-5 rounded-2 shadow">
                <div className="border-3 border-primary border-bottom py-2 mb-5">
                    <div className="d-flex gap-3 justify-content-center text-primary text-center fs-4">
                        {fileInfo?.type && <IoArrowBackCircleOutline className="fs-3" onClick={() => setFileInfo({ type: null, list: [] })} style={{ cursor: "pointer" }} />}
                        <span className="text-capitalize">{fileInfo?.type || "Document List"}</span>
                        {(role?.toLowerCase() == "client" || role?.toLowerCase() == "partner") && <div>
                            <span onClick={() => setUploadingDocs(true)} className="bg-primary d-flex justify-content-center align-items-center text-white" style={{ cursor: 'pointer', height: '2rem', width: '2rem', borderRadius: '2rem' }}><IoMdAdd /></span>
                        </div>}
                    </div></div>
                <div className="row row-cols-1 row-cols-md-4 align-items-center">

                    {fileInfo?.list?.length == 0 && Object.keys(folderInfo)?.map(ele => <div key={ele} className="p-2">
                        <div className="align-items-center bg-color-7 d-flex flex-column justify-content-center rounded-3 cursor-pointer" onClick={() => Array.isArray(folderInfo[ele]) && setFileInfo({ type: ele, list: folderInfo[ele] })}>
                            <div className="d-flex flex-column justify-content-center align-items-center py-5">
                                <div className="d-flex justify-content-center align-items-center fs-4 text-white bg-primary" style={{ height: '3rem', width: '3rem', borderRadius: '3rem' }}>
                                    <IoFolder className="text-light" />
                                </div>
                            </div>
                            <div className="d-flex align-items-center justify-content-center bg-dark gap-5 w-100 p-2 text-primary">
                                <p className="text-center text-wrap fs-5 text-capitalize">{ele}</p>
                            </div>
                        </div>
                    </div>)}
                    {fileInfo?.list?.map(item =>
                        <div key={item?._id} className="p-2">
                            <div className="align-items-center bg-color-7 d-flex flex-column justify-content-center rounded-3">
                                <div className="w-100 p-2">
                                    {item?.isPrivate && <CiLock className="fs-3 text-primary fs-bold" />}
                                    <div className="dropdown float-end cursor-pointer">
                                        <i className="bi bi-three-dots-vertical" data-bs-toggle="dropdown" aria-expanded="false"></i>
                                        <ul className="dropdown-menu">
                                            <li><div className="dropdown-item"><Link to={`${getCheckStorage(item?.url) ? getCheckStorage(item?.url) : "#!"}`} target="_blank">View</Link></div></li>
                                            <li><div className="dropdown-item" onClick={() => handleShareDocument("whatsapp", item)}>WhatsApp</div></li>
                                            <li><div className="dropdown-item" onClick={() => handleShareDocument("email", item)}>Email</div></li>
                                            {role?.toLowerCase() == "admin" && <li><div onClick={() => setChangeIsActiveStatus({ show: true, details: { _id: item?._id, currentStatus: item?.isActive, name: item?.name } })} className="dropdown-item">Delete</div></li>}
                                        </ul>
                                    </div>
                                </div>
                                <div className="d-flex flex-column justify-content-center align-items-center">

                                    {getCheckStorage(item?.url) ?
                                        <DocumentPreview url={getCheckStorage(item?.url)} />
                                        : <div className="d-flex justify-content-center bg-color-6 align-items-center fs-4 text-white bg-primary" style={{ height: '3rem', width: '3rem', borderRadius: '3rem' }}>
                                            <FaFileWord />
                                        </div>}


                                </div>
                            </div>
                        </div>
                    )}
                </div>


                <div className="d-flex row  gap-0  align-items-center"></div>
            </div>
            {uploadingDocs && <AddDocsModal _id={data[0]?._id} uploadingDocs={uploadingDocs} setUploadingDocs={setUploadingDocs}
                handleCaseDocsUploading={addCaseDoc} attachementUpload={attachementUpload} />}
            {deleteCaseDoc?.status && <ConfirmationModal show={deleteCaseDoc?.status} hide={() => setDeleteCaseDoc({ status: false, id: null })} id={deleteCaseDoc?.id} handleComfirmation={deleteDoc} heading={"Are you sure?"} text={"Want to permanent delete this doc"} />}
            {changeisActiveStatus?.show && <SetStatusOfProfile changeStatus={changeisActiveStatus} hide={() => setChangeIsActiveStatus({ show: false, details: {} })} type="Doc" handleChanges={handleChanges} />}

        </div>
    )
}
