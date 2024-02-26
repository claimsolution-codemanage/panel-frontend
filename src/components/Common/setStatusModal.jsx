import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { RiDeleteBin2Line } from "react-icons/ri";
import {FaTrashRestoreAlt} from 'react-icons/fa'

export default function SetStatusOfProfile({ changeStatus, hide, type,isActive=false, handleChanges }) {

  // console.log("changesstatus",changeStatus);
  return (
    <Modal
      show={changeStatus?.show}
      size="md"
      className='text-center'
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body>
        <div className='p-3'>
          <div className='d-flex flex-column align-items-center justify-content-center'>
            <div className={`d-flex align-items-center justify-content-center text-white ${changeStatus?.details?.currentStatus ? "bg-danger" :"bg-primary"} `} style={{ height: 50, width: 50, borderRadius: 50 }}>{changeStatus?.details?.currentStatus ? <RiDeleteBin2Line className='fs-3' /> : <FaTrashRestoreAlt className='fs-3'/>   } </div>
            <p className='text-danger fs-2 mt-4'>Are You Sure ?</p>
            <p className='text-primary fs-5'>
              {isActive ? `You want to ${changeStatus?.details?.currentStatus ? "Unactive" : "active"} ${changeStatus?.details?.name} ${type}.`
            :  `You want to  ${changeStatus?.details?.currentStatus ? "delete" : "restore"} ${changeStatus?.details?.name} ${type}.`
            }
              
            </p>
          </div>
        </div>


      </Modal.Body>
      <Modal.Footer>
        <Button className="bg-danger" onClick={() => handleChanges(changeStatus?.details?._id, changeStatus?.details?.currentStatus)}>{changeStatus?.details?.currentStatus ? (isActive ? "Unactive" : "Delete") :(isActive ? "Active"  : "Restore")}</Button>
        <Button onClick={hide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}