import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import { toast } from 'react-toastify';
import {ImSwitch} from 'react-icons/im'
import { RiDeleteBin2Line } from "react-icons/ri";

export default function ConfirmationModal({show,hide,id,handleComfirmation,heading,text,getRefreshData}) {
    const [loading,setLoading] = useState(false)


    const handleSumbit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await handleComfirmation(id)
            if (res?.data?.success) {
                toast.success(res?.data?.message)
                setLoading(false)
                hide()
                if(getRefreshData) getRefreshData()

            }
            setLoading(false)
        } catch (error) {
            if (error && error?.response?.data?.message) {
                toast.error(error?.response?.data?.message)

            } else {
                toast.error("Something went wrong")

            }
            // console.log("adminChangeCaseStatus error", error);
            hide()
            setLoading(false)
        }
    }
    return (
        <Modal
            show={show}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Body className='color-4'>
                <div className='p-3'>
                <div className='d-flex flex-column align-items-center justify-content-center'>
                    <div className='d-flex align-items-center justify-content-center text-white bg-danger' style={{height:50,width:50,borderRadius:50}}><RiDeleteBin2Line className='fs-3'/></div>
                    <p className='text-danger fs-2 mt-4'>{heading}</p>
                    <p className='text fs-5 text-center'>{text}</p>
                </div>
                </div>

            </Modal.Body>
            <Modal.Footer>
                <div className="d-flex  justify-content-center">
                    <div aria-disabled={loading} className={`d-flex align-items-center justify-content-center gap-3 btn px-4 btn-danger ${loading && "disabled"}`} onClick={handleSumbit}>
                        {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span> : <span>Yes </span>}
                    </div>
                </div>
                <Button className='px-4' onClick={() => hide()}>No</Button>
            </Modal.Footer>
        </Modal>
    );
}