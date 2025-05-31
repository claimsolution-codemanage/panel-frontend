import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function AddAdminTagModal({ adminTag, setAdminTag, handleAdminTag,}) {
    const [data, setData] = useState({ _id: adminTag?.details?._id,profileTag: adminTag?.details?.profileTag ? adminTag?.details?.profileTag : "" })
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const hangleOnchange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value })
    }

    const handleSumbit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await handleAdminTag(data)
            if (res?.data?.success) {
                setAdminTag({ status: false, details: "" })
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
            // console.log("adminChangeCaseStatus error", error);
            setLoading(false)
        }
    }
    return (
        <Modal
            show={adminTag?.status}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Body className='color-4'>
                <div className='p-3'>
                    <div className="border-3 border-primary border-bottom mb-5">
                        <h6 className="text-primary text-center fs-3">Add/ Edit Tag</h6>
                    </div>
                    <div className="mb-3 col-12">
                        {/* <label for="mobileNo." className="form-label">About you</label> */}
                        <input className="form-control" name="profileTag" value={data?.profileTag} onChange={hangleOnchange} placeholder="Profile Tag"/>
                    </div>
                </div>

            </Modal.Body>
            <Modal.Footer>
                <div className="d-flex  justify-content-center">
                    <div aria-disabled={loading} className={`d-flex align-items-center justify-content-center gap-3 btn btn-primary ${loading && "disabled"}`} onClick={handleSumbit}>
                        {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span> : <span>Save </span>}
                    </div>
                </div>
                <Button onClick={() => setAdminTag({ status: false, details: {} })}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}