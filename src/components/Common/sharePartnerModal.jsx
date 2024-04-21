import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { IoMdAdd } from 'react-icons/io'
import { adminGetAllEmployee, adminGetSaleEmployee } from '../../apis';
import HashLoader from "react-spinners/HashLoader";
import { IoIosShareAlt } from "react-icons/io";
import ReactPaginate from 'react-paginate';
import { BiLeftArrow } from 'react-icons/bi'
import { BiRightArrow } from 'react-icons/bi'




export default function SharePartnerModal({ partnerShareModal, handleShareCase, close }) {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [shareLoading, setShareLoading] = useState(false)
    const [selectEmployee, setSelectEmployee] = useState([])
    const [pageItemLimit, setPageItemLimit] = useState(10)
    const [pageNo, setPageNo] = useState(1)
    const [noOfEmployee,setNoOfEmployee] = useState(0)
    const [searchQuery,setSearchQuery] = useState("")
    useEffect(() => {
        async function fetch() {
            setLoading(true)
            try {
                const res = await adminGetSaleEmployee(pageItemLimit, pageNo, searchQuery)
                // console.log("adminGetAllEmployee", res?.data?.data);
                if (res?.data?.success && res?.data?.data) {
                    setData([...res?.data?.data])
                    setNoOfEmployee(res?.data?.noOfEmployee)
                    setLoading(false)
                }
            } catch (error) {
                console.log("error",error);
                if (error && error?.response?.data?.message) {
                    toast.error(error?.response?.data?.message)
                } else {
                    toast.error("Something went wrong")
                }
                // console.log("adminGetAllEmployee error", error);
            }
        } fetch()
    }, [pageNo])

    const handleSelectEmployee = (id) => {
        if (selectEmployee.includes(id)) {
            const newSelectEmployee = selectEmployee.filter(employee => employee != id)
            // console.log("newempl",newSelectEmployee);
            setSelectEmployee(newSelectEmployee)
        } else {
            setSelectEmployee([...selectEmployee, id])
        }
    }

    const handleShare = async () => {
        try {
            setShareLoading(true)
            const sendData = { shareEmployee: selectEmployee, sharePartners: partnerShareModal?.value }
            const res = await handleShareCase(sendData)
            if (res?.data?.success) {
                setShareLoading(false)
                toast.success(res?.data?.message)
                close()
            }
        } catch (error) {
            if (error && error?.response?.data?.message) {
                toast.error(error?.response?.data?.message)
            } else {
                toast.error("Something went wrong")
            }
            setShareLoading(false)
            // console.log("handleShareCase", error);
        }
        // console.log("handleShare",sendData);
    }

    const handlePageClick = (event) => {
        setPageNo(event.selected + 1)
      };


    return (
        <Modal
            show={partnerShareModal.status}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            {loading ? <div className='d-flex align-items-center justify-content-center' style={{ height: '50vh' }}><HashLoader color="#092bf7" /></div> : <div>
                <Modal.Body className='color-4'>
                    <div className='p-3'>
                        <div className="border-3 border-primary border-bottom mb-5">
                            <h6 className="text-primary text-center fs-3">Select employee</h6>

                        </div>
                        <div className='overflow-auto' style={{ height: '40vh' }}>
                            <div className="list-group">
                                {data.map((item, ind) => <button type="button" onClick={() => handleSelectEmployee(item?._id)} className={`list-group-item list-group-item-action ${selectEmployee.includes(item?._id) && "active border border-white"}`} aria-current="true">
                                    <div className=''>
                                        <h6 className='fs-5 text-capitalize'>{item?.fullName}</h6>
                                        <span className="badge bg-warning text-dark m-0">{item?.type}</span>
                                    </div>
                                </button>
                                )}
                            </div>
                            <div className="d-flex flex align-items-center justify-content-center mt-3">
                                <ReactPaginate
                                    breakLabel="..."
                                    nextLabel={<BiRightArrow />}
                                    onPageChange={handlePageClick}
                                    pageRangeDisplayed={5}
                                    pageCount={Math.ceil(noOfEmployee / pageItemLimit) || 1}
                                    previousLabel={<BiLeftArrow />}
                                    className="d-flex flex gap-2"
                                    pageClassName="border border-primary paginate-li"
                                    previousClassName="paginate-li bg-color-3"
                                    nextClassName="paginate-li bg-color-3"
                                    activeClassName="bg-primary text-white"
                                    forcePage={pageNo > 0 ? pageNo - 1 : 0}
                                    renderOnZeroPageCount={null}
                                />
                            </div>
                        </div>
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <div className="d-flex  justify-content-center">
                        <Button disabled={shareLoading} className={`d-flex align-items-center justify-content-center gap-3 btn btn-primary ${shareLoading && "disabled"}`} onClick={handleShare}>
                            {shareLoading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span> : <span><IoIosShareAlt /> Share</span>}
                        </Button>
                    </div>
                    {/* <Button className='' onClick={handleShare}><IoIosShareAlt /> Share</Button> */}
                    <Button onClick={close}>Close</Button>
                </Modal.Footer>
            </div>}

        </Modal>
    );
}