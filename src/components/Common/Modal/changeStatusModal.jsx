import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { caseStatus } from '../../../utils/constant';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import TextEditor from '../../TextEditor';

export default function ChangeStatusModal({ changeStatus, setChangeStatus, handleCaseStatus,getCaseById, role,attachementUpload }) {
    const [data, setData] = useState({ _id: changeStatus?.details?._id, status: "", remark: ""})
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
                if(getCaseById){
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

    const handleSave = ()=>{
        if(data?.remark?.trim()){
            handleSumbit()
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
                        <h6 className="text-primary text-center fs-3">Change Case Status</h6>
                    </div>
                    <div className='text-center'>
                    <p className='badge bg-primary fs-6'>Current Status: {changeStatus?.details?.currentStatus}</p>
                    </div>
                    <div className='d-flex gap-3 h5 justify-content-center'>
                    <p>Name: {changeStatus?.details?.name}</p>
                    <p>File No.: {changeStatus?.details?.fileNo}</p>
                    </div>

                    <div className="mb-3">
                        <select className="form-select color-4" name="status" value={data.status} onChange={hangleOnchange} aria-label="Default select example">
                            <option>--select Case Status</option>
                            {caseStatus?.map(item => <option className='' key={item} value={item}>{item}</option>)}
                        </select>
                    </div>
                    <div className="mb-3 col-12">
                     <TextEditor value={data?.remark || ""} handleOnChange={(val)=>setData({...data,remark:val})}/>
                        
                        {/* <label for="mobileNo." className="form-label">About you</label> */}
                        {/* <textarea className="form-control" name="remark" value={data.remark} onChange={hangleOnchange} placeholder="Case Remark..." rows={5} cols={5} ></textarea> */}
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