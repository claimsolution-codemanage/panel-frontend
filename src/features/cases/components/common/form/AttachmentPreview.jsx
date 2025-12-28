// AttachmentPreviewModal.jsx
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Link, X } from "lucide-react";
import DocumentPreview from "../../../../../components/DocumentPreview";
import { getCheckStorage } from "../../../../../utils/helperFunction";

const AttachmentPreviewModal = ({ show, onClose, files = [], onDelete, isMulti, readOnly }) => {
  const [allFiles, setAllFiles] = useState([])
  const handleDelete = (file) => {
    if (readOnly) return
    const updated = isMulti ? files.filter((f) => f?.url !== file?.url) : null
    setAllFiles(updated);
  };

  const handleSave = () => {
    onDelete(allFiles)
  }
  useEffect(() => {
    let values = []
    if (files) {
      values = isMulti ? files : Array.isArray(files) ? files : [files]
    }
    setAllFiles(values)
  }, [show])

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Attachments</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!allFiles?.length ? (
          <p className="text-muted text-center">No attachments</p>
        ) : (
          <div className="row g-3">
            {allFiles?.map((file, idx) => (
              <div key={idx} className="col-md-4">
                {file?.url ? <div>
                  <div className="align-items-center bg-color-7 d-flex flex-column justify-content-center rounded-3" style={{ maxWidth: '250px' }}>
                    <div className="w-100 p-2">
                      <div className="dropdown float-end cursor-pointer">
                        <i className="bi bi-three-dots-vertical" data-bs-toggle="dropdown" aria-expanded="false"></i>
                        <ul className="dropdown-menu">
                          {file?.url &&<li><div className="dropdown-item"><a href={`${file?.url || "#!"}`} target="_blank">View</a></div></li>}
                          {!readOnly && <li><div  onClick={() => handleDelete(file)} className="dropdown-item">Delete</div></li>}
                          
                        </ul>
                      </div>
                    </div>
                    <div className="d-flex flex-column justify-content-center align-items-center">
                      <DocumentPreview height="150px" url={getCheckStorage(file?.url)} />
                    </div>
                  </div>
                </div> : ""}
              </div>
            ))}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer className="d-flex gap-2">
        {!readOnly && <button className="btn btn-secondary" onClick={handleSave}>
          Save
        </button>}
        <button className="btn btn-secondary" onClick={onClose}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default AttachmentPreviewModal;
