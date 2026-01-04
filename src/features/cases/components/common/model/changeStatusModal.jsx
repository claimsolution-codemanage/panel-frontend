import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { caseMailMethod, caseStatus } from '../../../../../utils/constant';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import TextEditor from '../../../../../components/TextEditor';
import { formatDateToISO } from '../../../../../utils/helperFunction';

const minDate = formatDateToISO(new Date(new Date().setDate(new Date().getDate()+1)))

export default function ChangeStatusModal({ changeStatus, setChangeStatus, handleCaseStatus, getCaseById, role, attachementUpload }) {
    const [data, setData] = useState({ _id: changeStatus?.details?._id, status: "", remark: "", mailMethod: "None", nextFollowUp: "", })
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const hangleOnchange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value })
    }

    const handleSumbit = async (e) => {
        setLoading(true)
        try {
            const res = await handleCaseStatus(data)
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
            // console.log("adminChangeCaseStatus error", error);
            setLoading(false)
        }
    }

    const handleSave = () => {
        if (data?.remark?.trim()) {
            handleSumbit()
        }
    }

    const addOneMonthToISO = (date = new Date()) => {
        const d = new Date(date);
        d.setMonth(d.getMonth() + 1);
        return d.toISOString().split("T")[0];
    };

    return (
        <Modal
            show={changeStatus?.status}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Body className='color-4'>
                <div className='p-3'>
                    <div className="border-3 border-primary border-bottom mb-2">
                        <h6 className="text-primary text-center fs-3">Change Case Status</h6>
                    </div>
                    <div className='text-center'>
                        <p className='badge bg-primary fs-6'>Current Status: {changeStatus?.details?.currentStatus}</p>
                    </div>
                    <div className='d-flex gap-3 h5 justify-content-center'>
                        <p className='p-0 m-0'>Name: {changeStatus?.details?.name}</p>
                        <p className='p-0 m-0'>File No.: {changeStatus?.details?.fileNo}</p>
                    </div>

                    <div className="mb-1">
                        <label htmlFor={"status"} className='col-form-label'>Case Status</label>
                        <select className="form-select color-4" name="status" value={data?.status} onChange={hangleOnchange} aria-label="Default select example">
                            <option>--Select Case Status</option>
                            {caseStatus?.map(item => <option className='' key={item} value={item}>{item}</option>)}
                        </select>
                    </div>
                    <div className="mb-1">
                        <label htmlFor={"mailMethod"} className='col-form-label'>Mail Method</label>
                        <select className="form-select color-4" name="mailMethod" value={data?.mailMethod} onChange={hangleOnchange} aria-label="Default select example">
                            <option>--Mail Method</option>
                            {caseMailMethod?.map(ele => <option className='' key={ele} value={ele}>{ele}</option>)}
                        </select>
                    </div>
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
                    <div className="mb-1 col-12">
                        <label htmlFor={"remark"} className='col-form-label'>Remark</label>
                        <TextEditor value={data?.remark || ""} handleOnChange={(val) => setData({ ...data, remark: val })} />
                    </div>
                </div>

            </Modal.Body>
            <Modal.Footer>
                <div className="d-flex  justify-content-center">
                    <div aria-disabled={loading} className={`d-flex align-items-center justify-content-center gap-3 btn btn-primary ${loading && "disabled"}`} onClick={handleSave}>
                        {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span> : <span>Save </span>}
                    </div>
                </div>
                <Button onClick={() => setChangeStatus({ status: false, details: "" })}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}