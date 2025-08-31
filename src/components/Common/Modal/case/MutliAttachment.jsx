import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { getCheckStorage } from '../../../../utils/helperFunction';

export default function MultiAttachmentFormDoc({ show, attachments, close }) {

    return (
        <Modal
            show={show}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered>
            <Modal.Body className='color-4'>
                <div className='p-3'>
                    <div className='row row-cols-1 row-row-cols-md-3'>
                        {attachments?.map(item=><div className="align-items-center bg-color-7 d-flex flex-column justify-content-center rounded-3" style={{ maxWidth: '250px' }}>
                        <div className="w-100 p-2">
                            <div className="dropdown float-end cursor-pointer">
                                <i className="bi bi-three-dots-vertical" data-bs-toggle="dropdown" aria-expanded="false"></i>
                                <ul className="dropdown-menu">
                                    <li><div className="dropdown-item"><Link to={`${getCheckStorage(item?.url) || "#!"}`} target="_blank">View</Link></div></li>
                                </ul>
                            </div>
                        </div>
                        <div className="d-flex flex-column justify-content-center align-items-center">
                            {getCheckStorage(item?.url) && <DocumentPreview height='150px' url={getCheckStorage(item?.url)} />}
                        </div>
                    </div>)}
                    </div>
                    
                </div>

            </Modal.Body>
            <Modal.Footer>
                <div className="d-flex  justify-content-center">
                    <Button className={`d-flex align-items-center justify-content-center gap-3 btn btn-primary`} onClick={handleCommit}>
                        Save
                    </Button>
                </div>
                {/* <Button className='' onClick={handleShare}><IoIosShareAlt /> Share</Button> */}
                <Button onClick={close}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}