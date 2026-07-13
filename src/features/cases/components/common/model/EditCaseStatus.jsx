import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { caseStatus } from '../../../../../utils/constant';
import { useState } from 'react';
import { adminChangeCaseStatus } from '../../../../../apis';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import TextEditor from '../../../../../components/TextEditor';
import { formatDateToISO } from '../../../../../utils/helperFunction';

const minDate = formatDateToISO(new Date(new Date().setDate(new Date().getDate() + 1)))

const addOneMonthToISO = (date = new Date()) => {
    const d = new Date(date);
    d.setMonth(d.getMonth() + 12);
    return d.toISOString().split("T")[0];
};


export default function EditCaseStatusModal({ changeStatus, setChangeStatus, handleCaseStatus, role, getCaseById }) {
    const [data, setData] = useState({
        caseId: changeStatus?.details?.caseId,
        processId: changeStatus?.details?.processId,
        status: changeStatus?.details?.caseStatus,
        remark: changeStatus?.details?.caseRemark,
        nextFollowUp: changeStatus?.details?.nextFollowUp ? formatDateToISO(changeStatus?.details?.nextFollowUp) : "",
        otherDetails: changeStatus?.details?.otherDetails ? changeStatus?.details?.otherDetails : {}
    })
    const [loading, setLoading] = useState(false)

    const hangleOnchange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value })
    }

    const handleSumbit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            let payload = {
                ...data,
                isCurrentStatus: changeStatus?.details?.isCurrentStatus ? changeStatus?.details?.isCurrentStatus : false
            }
            const res = await handleCaseStatus(payload)
            if (res?.data?.success) {
                setChangeStatus({ status: false, details: "" })
                toast.success(res?.data?.message)
                setLoading(false)
                if (getCaseById) {
                    getCaseById()
                }
            }
            setLoading(false)
        } catch (error) {
            if (error && error?.response?.data?.message) {
                toast.error(error?.response?.data?.message)

            } else {
                toast.error("Something went wrong")

            }
            setLoading(false)
        }
    }
    return (
        <Modal
            show={changeStatus?.status}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Body className='color-4'>
                <div className='p-3'>
                    <div className="border-3 border-primary border-bottom mb-5">
                        <h6 className="text-primary text-center fs-3">Edit Case Status</h6>
                    </div>

                    <div className="mb-3">
                        <select className="form-select color-4" name="status" value={data.status} onChange={hangleOnchange} aria-label="Default select example">
                            <option>--select Case Status</option>
                            {caseStatus?.map(item => <option className='' key={item} value={item}>{item}</option>)}
                        </select>
                    </div>
                    <div className='row row-cols-1 w-100'>
                        <div className="mb-1">
                            <label htmlFor={"nextFollowUp"} className='col-form-label'>Next follow-up date</label>
                            <input
                                type={"date"}
                                name={"nextFollowUp"}
                                placeholder={"Next follow-up date"}
                                min={minDate}
                                max={addOneMonthToISO(new Date())}
                                value={data?.nextFollowUp ? formatDateToISO(data?.nextFollowUp) : ''}
                                onChange={hangleOnchange}
                                className="form-control" />
                        </div>
                    </div>
                    {data?.status == "Case file in court" && <div className='row row-cols-1 row-cols-lg-2 w-100'>
                        <div className="mb-1">
                            <label htmlFor={"caseNumber"} className='col-form-label'>Case Number</label>
                            <input
                                type={"text"}
                                name={"caseNumber"}
                                placeholder={"Case Number"}
                                value={data?.otherDetails?.caseNumber || ""}
                                onChange={(e) => setData({ ...data, otherDetails: { ...data.otherDetails, caseNumber: e.target.value } })}
                                className="form-control" />
                        </div>
                        <div className="mb-1">
                            <label htmlFor={"courtName"} className='col-form-label'>Court/Forum Name</label>
                            <input
                                type={"text"}
                                name={"courtName"}
                                placeholder={"Court/Forum Name"}
                                value={data?.otherDetails?.courtName || ""}
                                onChange={(e) => setData({ ...data, otherDetails: { ...data.otherDetails, courtName: e.target.value } })}
                                className="form-control" />
                        </div>
                        <div className="mb-1">
                            <label htmlFor={"courtAddress"} className='col-form-label'>Court/Forum Address</label>
                            <input
                                type={"text"}
                                name={"courtAddress"}
                                placeholder={"Court/Forum Address"}
                                value={data?.otherDetails?.courtAddress || ""}
                                onChange={(e) => setData({ ...data, otherDetails: { ...data.otherDetails, courtAddress: e.target.value } })}
                                className="form-control" />
                        </div>
                        <div className="mb-1">
                            <label htmlFor={"nextHearingDate"} className='col-form-label'>Next Hearing Date</label>
                            <input
                                type={"date"}
                                name={"nextHearingDate"}
                                placeholder={"Next Hearing Date"}
                                value={data?.otherDetails?.nextHearingDate || ""}
                                onChange={(e) => setData({ ...data, otherDetails: { ...data.otherDetails, nextHearingDate: e.target.value } })}
                                className="form-control" />
                        </div>
                    </div>}
                    <div className="mb-4 col-12">
                        <TextEditor value={data?.remark || ""} handleOnChange={(val) => setData({ ...data, remark: val })} placeholder={"Case Remark..."} />
                    </div>
                </div>

            </Modal.Body>
            <Modal.Footer>
                <div className="d-flex  justify-content-center">
                    <div aria-disabled={loading} className={`d-flex align-items-center justify-content-center gap-3 btn btn-primary ${loading && "disabled"}`} onClick={handleSumbit}>
                        {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span> : <span>Save </span>}
                    </div>
                </div>
                <Button onClick={() => setChangeStatus({ status: false, details: {} })}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}