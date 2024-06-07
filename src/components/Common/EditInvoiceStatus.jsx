import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function EditInvoiceStatusModal({ changeInvoiceStatus, setChangeInvoiceStatus, handleInvoiceStatus}) {
    const [data, setData] = useState({ 
        _id: changeInvoiceStatus?._id,
        remark: ""})
    const [loading, setLoading] = useState(false)

    const hangleOnchange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value })
    }


    const handleSumbit = async (e) => {
        if(data?.remark?.length>3){
            e.preventDefault()
            setLoading(true)
            try {
                const res = await handleInvoiceStatus(data)
                if (res?.data?.success) {
                    setChangeInvoiceStatus({ status: false, details: "" })
                    toast.success(res?.data?.message)
                    setLoading(false)
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

    }
    return (
        <Modal
            show={changeInvoiceStatus?.status}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Body className='color-4'>
                <div className='p-3'>
                    <div className="border-3 border-primary border-bottom mb-5">
                        <h6 className="text-primary text-center fs-3">Change invoice status</h6>
                    </div>
                    <div className="mb-3 col-12">
                        {/* <label for="mobileNo." className="form-label">About you</label> */}
                        <textarea className="form-control" name="remark" value={data.remark} onChange={hangleOnchange} placeholder="Invoice remark" rows={5} cols={5} ></textarea>
                    <p>Must have minimum 3 characters</p>
                    </div>
                </div>

            </Modal.Body>
            <Modal.Footer>
                <div className="d-flex  justify-content-center">
                    <div aria-disabled={loading} className={`d-flex align-items-center justify-content-center gap-3 btn btn-primary ${loading && "disabled"}`} onClick={handleSumbit}>
                        {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span> : <span>Paid </span>}
                    </div>
                </div>
                <Button disabled={loading} onClick={() => setChangeInvoiceStatus({ status: false, details: {} })}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}