import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { IoIosShareAlt } from "react-icons/io";
import AsyncSelect from 'react-select/async';
import debounce from 'debounce';

export default function ShareSectionModal({show,shareValue, handleShareCase, close, getSaleEmp,getRefreshData,shareOf="sharePartners" }) {
    const [shareLoading, setShareLoading] = useState(false)
    const [selectEmployee, setSelectEmployee] = useState([])
    const fetchEmpList = async (inputValue, cb) => {
        try {
            const { data } = await getSaleEmp(50, 0, inputValue)
            const list = data?.data?.map(emp => {
                return {
                    label: `${emp?.fullName || ""} | ${emp?.branchId || ""} | ${emp?.type || ""} | ${emp?.designation || ""}`,
                    value: emp?._id
                }
            })
            cb(list)
        } catch (error) {
            cb([])
        }

    }

    const fetchOptions = debounce(fetchEmpList, 3000)

    const handleShare = async () => {
        try {
            setShareLoading(true)
            const sendData = { shareEmployee: selectEmployee?.map(emp=>emp?.value), [shareOf]: shareValue }
            const res = await handleShareCase(sendData)
            if (res?.data?.success) {
                setShareLoading(false)
                toast.success(res?.data?.message)
                close()
                if(getRefreshData) getRefreshData()
            }
        } catch (error) {
            if (error && error?.response?.data?.message) {
                toast.error(error?.response?.data?.message)
            } else {
                toast.error("Something went wrong")
            }
            setShareLoading(false)
        }
    }

    return (
        <Modal
            show={show}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered>
            <div>
                <Modal.Body className='color-4'>
                    <div className='p-3'>
                        <div className="border-3 border-primary border-bottom mb-5">
                            <h6 className="text-primary text-center fs-3">Select employee</h6>

                        </div>
                        <div className="">
                            <AsyncSelect
                                isMulti
                                cacheOptions
                                defaultOptions
                                className='text-capitalize'
                                value={selectEmployee}
                                onChange={(val) => setSelectEmployee(val)}
                                loadOptions={fetchOptions}
                            />
                        </div>
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <div className="d-flex  justify-content-center">
                        <Button disabled={shareLoading || !selectEmployee?.length} className={`d-flex align-items-center justify-content-center gap-3 btn btn-primary ${shareLoading && "disabled"}`} onClick={handleShare}>
                            {shareLoading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span> : <span><IoIosShareAlt /> Share</span>}
                        </Button>
                    </div>
                    {/* <Button className='' onClick={handleShare}><IoIosShareAlt /> Share</Button> */}
                    <Button onClick={close}>Close</Button>
                </Modal.Footer>
            </div>
        </Modal>
    );
}