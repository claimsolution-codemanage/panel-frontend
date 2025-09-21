import { useEffect, useState } from "react"
import { toast } from 'react-toastify'
import { useLocation, useNavigate } from 'react-router-dom'
import { useParams } from "react-router-dom"
import { IoArrowBackCircleOutline,} from 'react-icons/io5'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { adminUpdateClientCaseFee, } from "../../apis"
import Loader from "../../components/Common/loader"
import { useContext } from "react"
import { AppContext } from "../../App"
import GroSection from "../Common/ViewCaseSection/GroSection"
import PaymentSection from "../Common/ViewCaseSection/PaymentSection"
import CommentSection from "../Common/ViewCaseSection/CommentSection"
import StatusSection from "../Common/ViewCaseSection/StatusSection"
import OmbudsmanSection from "../Common/ViewCaseSection/ObudsmanSection"
import CaseDetails from "../Common/ViewCaseSection/CaseDetails"
import DocumentSection from "../Common/ViewCaseSection/DocumentSection"
import ViewCaseForm from "../Common/case/form/CaseFormList"


export default function ViewCaseComp({ id, getCase, role,empType, attachementUpload, addCaseDoc,
    editUrl, addCaseCommit, viewPartner, viewClient, editCaseProcess, addCaseProcess, addReference,
    deleteReference, deleteDoc, isAddRefence, isAddCaseProcess, isAddCommit,
    isViewProfile, setCaseDocStatus, viewEmp, paymentDetailsApi, accessPayment, isCaseFormAccess, createOrUpdateCaseFormApi,
    privateCommit,caseFormDetailApi
}) {

    const [data, setData] = useState([])
    const state = useContext(AppContext)
    const location = useLocation()
    const [loading, setLoading] = useState(false)
    const [clearClientpayment, setClearClientPayment] = useState({ status: false, loading: false, payment: "", feeType: "", data: { _id: "", paymentId: "", paymentMode: "" } })

    const navigate = useNavigate()
    const param = useParams()

    const getCaseById = async () => {
        setLoading(true)
        try {
            const res = await getCase(id)
            if (res?.data?.success && res?.data?.data) {
                setData([res?.data?.data])
                setLoading(false)
            }
        } catch (error) {
            if (error && error?.response?.data?.message) {
                toast.error(error?.response?.data?.message)
                setLoading(false)
            } else {
                toast.error("Something went wrong")
                setLoading(false)
            }

            console.log("case error", error);
        }
    }


    useEffect(() => {
        if (id) {
            getCaseById()
        }
    }, [id])

    const handleClearClientPayment = async () => {
        // console.log("clear payment handler", clearClientpayment);
        setClearClientPayment({ ...clearClientpayment, loading: true })
        try {
            const res = await adminUpdateClientCaseFee(clearClientpayment.data)
            // console.log("case", res?.data);
            if (res?.data?.success) {
                toast.success(res?.data?.message)
                setClearClientPayment({ status: false, loading: false, payment: "", feeType: "", data: { _id: "", paymentId: "", paymentMode: "" } })
                getCaseById()
            }
        } catch (error) {
            if (error && error?.response?.data?.message) {
                toast.error(error?.response?.data?.message)
                setClearClientPayment({ status: false, loading: false, payment: "", feeType: "", data: { _id: "", paymentId: "", paymentMode: "" } })
            } else {
                toast.error("Something went wrong")
                setClearClientPayment({ status: false, loading: false, payment: "", feeType: "", data: { _id: "", paymentId: "", paymentMode: "" } })
            }
        }
    }

    const handleBack = () => {
        if (location?.state?.filter && location?.state?.back) {
            navigate(location?.state?.back, { state: { ...location?.state, back: location?.pathname } });
        } else {
            navigate(-1)
        }
    };

    return (<>
        {loading ? <Loader /> :
            <div>
                <div>
                    <div className="d-flex justify-content-between bg-color-1 text-primary fs-5 px-4 py-3 shadow">
                        <div className="d-flex flex align-items-center gap-3">
                            <IoArrowBackCircleOutline className="fs-3" onClick={handleBack} style={{ cursor: "pointer" }} />
                            <div className="d-flex flex align-items-center gap-1">
                                <span>View Case</span>
                            </div>
                        </div>
                    </div>
                    <div className="m-0 m-md-5 p-md-4">
                        <div className="container-fluid color-4 p-0">
                            <div className="">
                                <div>
                                    <div className="">
                                        <div className="">
                                            {/* case details section */}
                                            <CaseDetails data={data} role={role} viewPartner={viewPartner} deleteReference={deleteReference} isViewProfile={isViewProfile} getCaseById={getCaseById} editUrl={editUrl} viewClient={viewClient} isAddRefence={isAddRefence} viewEmp={viewEmp} addReference={addReference} />

                                            {/* documents section */}
                                            <DocumentSection data={data} role={role} getCaseById={getCaseById} deleteDoc={deleteDoc} setCaseDocStatus={setCaseDocStatus} attachementUpload={attachementUpload} addCaseDoc={addCaseDoc} />

                                            {/* case process */}
                                            <StatusSection isAddCaseProcess={isAddCaseProcess} editCaseProcess={editCaseProcess} role={role} id={id} processSteps={data[0]?.processSteps} getCaseById={getCaseById} details={data[0]} addCaseProcess={addCaseProcess} attachementUpload={attachementUpload} />

                                            {/* case  form section*/}
                                            {(data[0]?.caseFrom?.toLowerCase() == "client" || data?.[0]?.case_forms?.length) ?
                                                <ViewCaseForm caseFormDetailApi={caseFormDetailApi} id={id} role={role} empType={empType} isCaseFormAccess={isCaseFormAccess} getCaseById={getCaseById} status={data?.[0]?.currentStatus} formList={data?.[0]?.case_forms} createOrUpdateApi={createOrUpdateCaseFormApi} attachementUpload={attachementUpload} />:""
                                            }
                                            {/* case gro form*/}
                                            {/* {((data[0]?.caseFrom?.toLowerCase() == "client" && data[0]?.currentStatus?.toLowerCase() == "gro") || data?.[0]?.caseGroDetails) &&
                                                <GroSection id={id} role={role} empType={empType} isCaseFormAccess={isCaseFormAccess} getCaseById={getCaseById} status={data?.[0]?.currentStatus} groDetails={data?.[0]?.caseGroDetails} createOrUpdateApi={createOrUpdateCaseFormApi} attachementUpload={attachementUpload} />
                                            } */}

                                            {/* case ombudsman form*/}
                                            {/* {((data[0]?.caseFrom?.toLowerCase() == "client" && data[0]?.currentStatus?.toLowerCase()?.includes("ombudsman")) || data?.[0]?.caseOmbudsmanDetails) &&
                                                <OmbudsmanSection id={id} role={role} empType={empType}  isCaseFormAccess={isCaseFormAccess} getCaseById={getCaseById} status={data?.[0]?.currentStatus} details={data?.[0]?.caseOmbudsmanDetails} createOrUpdateApi={createOrUpdateCaseFormApi} attachementUpload={attachementUpload} />
                                            } */}

                                            {/* payment details */}
                                            {data[0]?.caseFrom?.toLowerCase() == "client" && <PaymentSection id={id} accessPayment={accessPayment} getCaseById={getCaseById} paymentDetailsApi={paymentDetailsApi} casePayment={data[0]?.casePayment} />}

                                            {/* case comment */}
                                            {isAddCommit && <CommentSection id={id} privateCommit={privateCommit} addCaseCommit={addCaseCommit} role={role} getCaseById={getCaseById} caseCommit={data[0]?.caseCommit} />}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* for clear case payment */}
                <Modal
                    show={clearClientpayment.status}
                    size="md"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    className="p-5"
                >
                    <Modal.Body className='color-4'>
                        <div className="border-3 border-primary border-bottom py-2 mb-2">
                            <div className="text-primary text-center fs-4">Clear Payment</div>
                        </div>
                        <div className="my-2 text-primary text-center">Fee Type: {clearClientpayment?.feeType}</div>
                        <div className="mb-3 col-12">
                            <label for="paymentMode" className="form-label">Payment mode</label>
                            <select className="form-select w-100" name="paymentMode" value={clearClientpayment.data.paymentMode} onChange={(e) => setClearClientPayment({ ...clearClientpayment, data: { ...clearClientpayment.data, paymentMode: e.target.value } })} >
                                <option value="">--select payment mode</option>
                                <option value="Cash">Cash</option>
                                <option value="paytm">paytm</option>
                                <option value="PhonePay">PhonePay</option>
                                <option value="gpay">GPay</option>
                                <option value="Online">Online</option>
                                <option value="Others">Others</option>

                            </select>
                        </div>

                        <div className="d-flex gap-1 flex-reverse">
                            <div className="d-flex  justify-content-center">
                                <div aria-disabled={clearClientpayment.loading} className={`d-flex align-items-center justify-content-center gap-3 btn btn-primary ${clearClientpayment.loading
                                    && "disabled"}`} onClick={handleClearClientPayment}>
                                    {clearClientpayment.loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span> : <span>Clear Rs.{clearClientpayment?.payment} </span>}
                                </div>
                            </div>
                            <Button onClick={() => setClearClientPayment({ status: false, loading: false, payment: "", feeType: "", data: { _id: "", paymentId: "", paymentMode: "" } })}>Close</Button>

                        </div>

                    </Modal.Body>
                </Modal>

            </div>}
    </>)
}