import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import TextEditor from '../../../../../components/TextEditor';
import { getFileTypeFromExtension } from '../../../../../utils/helperFunction';
import { IoMdAdd, IoMdClose } from 'react-icons/io';
import {
  FaFileImage, FaFileAudio, FaFileVideo, FaFilePdf,
  FaFileWord, FaFileExcel, FaFile
} from 'react-icons/fa';

export default function AddCaseCommit({ show, details, caseEmployeeList, canTagComment, handleCaseCommit, attachementUpload, refetchDetails, close, id, privateCommit }) {
  const [data, setData] = useState({});
  const [commitLoading, setCommitLoading] = useState(false);
  const [uploadingAttachment, setUploadingAttachment] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const attachmentRef = useRef(null);


  // Get file icon based on file type
  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'image':
        return <FaFileImage className="text-primary" size={20} />;
      case 'audio':
        return <FaFileAudio className="text-success" size={20} />;
      case 'video':
        return <FaFileVideo className="text-danger" size={20} />;
      case 'pdf':
        return <FaFilePdf className="text-danger" size={20} />;
      case 'word':
        return <FaFileWord className="text-primary" size={20} />;
      case 'excel':
        return <FaFileExcel className="text-success" size={20} />;
      default:
        return <FaFile className="text-secondary" size={20} />;
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle comment submission
  const handleCommit = async () => {
    if (data?.comment?.trim()?.length >= 3) {
      try {
        setCommitLoading(true);
        const res = await handleCaseCommit(data);
        if (res?.data?.success) {
          setCommitLoading(false);
          toast.success(res?.data?.message);
          close();
          if (refetchDetails) {
            refetchDetails();
          }
        }
      } catch (error) {
        if (error && error?.response?.data?.message) {
          toast.error(error?.response?.data?.message);
        } else {
          toast.error("Something went wrong");
        }
        setCommitLoading(false);
      }
    } else {
      toast.warning("Please enter at least 3 characters");
    }
  };

  // Handle file upload with progress simulation
  const handleAttachment = async (e) => {
    try {
      const file = e?.target?.files?.[0];
      if (!file) {
        toast.error("Please select a file");
        return;
      }

      const fileName = file.name;
      const maxSize = 150 * 1024 * 1024; // 150MB

      if (file.size > maxSize) {
        toast.error("File must be less than 150MB");
        return;
      }

      // Get file extension and type
      const fileExtension = fileName.split(".").pop().toLowerCase();
      const fileType = getFileTypeFromExtension(fileExtension);

      const supportedTypes = ["image", "audio", "pdf", "video", "word", "excel"];
      if (!supportedTypes.includes(fileType)) {
        toast.error("File format not supported. Supported formats: image, audio, pdf, video, Word, Excel.");
        return;
      }

      setUploadingAttachment(true);
      setUploadProgress(0);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const formData = new FormData();
      formData.append("file", file);
      const res = await attachementUpload(fileType, formData);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (res?.data?.success) {
        const newAttachment = {
          url: res?.data?.url,
          fileType: fileType,
          fileName: file?.name,
          fileSize: file?.size,
        };
        setData({ ...data, attachments: [...data?.attachments, newAttachment] });
        toast.success(res?.data?.message ?? "File uploaded successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message ?? "File not uploaded");
    } finally {
      setTimeout(() => {
        setUploadingAttachment(false);
        setUploadProgress(0);
      }, 500);
      attachmentRef.current.value = "";
    }
  };

  // Delete attachment
  const handleDeleteAttachment = (index) => {
    const updatedAttachments = data.attachments.filter((_, i) => i !== index);
    setData({ ...data, attachments: updatedAttachments });
  };

  // Open file in new tab
  const handleOpenFile = (url) => {
    window.open(url, '_blank');
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, []);

  useEffect(() => {
    if (show) {
      setData({
        _id: id,
        caseCommentId: details?._id || null,
        comment: details?.message || "",
        isPrivate: Boolean(details?.isPrivate),
        attachments: details?.attachments || [],
        tagEmployeeIds: details?.tagEmployees?.map(ele => ele?._id) || []
      });
    }
  }, [show, details, id]);

  const filteredEmployees = (caseEmployeeList || []).filter(emp => {
    const isAlreadyTagged = data?.tagEmployeeIds?.includes(emp._id);
    const matchesSearch = emp.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.type?.toLowerCase().includes(searchTerm.toLowerCase());
    return !isAlreadyTagged && matchesSearch;
  });

  const selectedEmployees = (caseEmployeeList || []).filter(emp =>
    data?.tagEmployeeIds?.includes(emp._id)
  );

  const handleAddTag = (empId) => {
    setData(prev => ({
      ...prev,
      tagEmployeeIds: [...(prev.tagEmployeeIds || []), empId]
    }));
    setSearchTerm("");
    setShowDropdown(false);
  };

  const handleRemoveTag = (empId) => {
    setData(prev => ({
      ...prev,
      tagEmployeeIds: (prev.tagEmployeeIds || []).filter(id => id !== empId)
    }));
  };

  return (
    <Modal
      show={show}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="comment-modal"
    >
      <Modal.Body className="p-0">
        <div className="p-4">
          {/* Header */}
          <div className="border-bottom pb-3 mb-4">
            <h5 className="text-primary fw-bold mb-0">
              {details?._id ? "Edit Comment" : "Add New Comment"}
            </h5>
            <p className="text-muted small mt-1 mb-0">
              Share your thoughts and attach relevant files
            </p>
          </div>

          {/* Private Switch */}
          {privateCommit && (
            <div className="mb-4">
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="privateSwitch"
                  checked={data?.isPrivate}
                  onChange={(e) => {
                    const checked = e?.target?.checked;
                    setData(prev => ({
                      ...prev,
                      isPrivate: checked,
                      tagEmployeeIds: checked ? [] : prev.tagEmployeeIds
                    }));
                  }}
                />
                <label className="form-check-label fw-medium" htmlFor="privateSwitch">
                  Private Comment
                </label>
                <small className="text-muted d-block mt-1">
                  Only visible to you and administrators
                </small>
              </div>
            </div>
          )}

          {/* Tag Employees Section */}
          {canTagComment && !data?.isPrivate && (
            <div className="mb-4 position-relative" ref={dropdownRef}>
              <label className="form-label fw-medium mb-2">Tag Employees</label>

              {/* Selected Pills */}
              {selectedEmployees.length > 0 && (
                <div className="d-flex flex-wrap gap-2 mb-2">
                  {selectedEmployees.map(emp => (
                    <span
                      key={emp._id}
                      className="badge bg-light text-primary border d-flex align-items-center gap-1 p-2 rounded-pill hover-shadow"
                      style={{ fontSize: '0.85rem', transition: 'all 0.2s' }}
                    >
                      <span>{emp.fullName} ({emp.type})</span>
                      <IoMdClose
                        className="cursor-pointer text-danger"
                        size={14}
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleRemoveTag(emp._id)}
                      />
                    </span>
                  ))}
                </div>
              )}

              {/* Search Input */}
              <input
                type="text"
                className="form-control"
                placeholder="Search employee by name or designation to tag..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
              />

              {/* Dropdown Menu */}
              {showDropdown && filteredEmployees.length > 0 && (
                <div
                  className="dropdown-menu show w-100 shadow border-0 mt-1 py-1 dropdown-menu-list"
                  style={{
                    maxHeight: '200px',
                    overflowY: 'auto',
                    position: 'absolute',
                    zIndex: 1050
                  }}
                >
                  {filteredEmployees.map(emp => (
                    <button
                      key={emp._id}
                      className="dropdown-item d-flex justify-content-between align-items-center py-2 dropdown-employee-item"
                      type="button"
                      onClick={() => handleAddTag(emp._id)}
                    >
                      <span className="fw-medium text-dark">{emp.fullName}</span>
                      <span className="badge bg-secondary-subtle text-secondary" style={{ fontSize: '0.75rem' }}>{emp.type}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Comment Editor */}
          <div className="mb-4">
            <label className="form-label fw-medium mb-2">Comment *</label>
            <TextEditor
              value={data?.comment || ""}
              handleOnChange={(val) => setData({ ...data, comment: val })}
              placeholder="Write your comment here..."
              rows={5}
              cols={5}
            />
          </div>

          {/* Attachments Section */}
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <label className="form-label fw-medium mb-0">Attachments</label>
                <small className="text-muted d-block">Supported: Images, Documents, Audio, Video (Max 150MB)</small>
              </div>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => {
                  if (!uploadingAttachment) {
                    attachmentRef.current.click();
                  }
                }}
                disabled={uploadingAttachment}
                className="d-flex align-items-center gap-2"
              >
                <IoMdAdd size={18} />
                Add File
              </Button>
              <input
                type="file"
                ref={attachmentRef}
                onChange={handleAttachment}
                name="caseDoc"
                hidden={true}
              />
            </div>

            {/* Upload Progress */}
            {uploadingAttachment && (
              <div className="mb-3 p-3 bg-light rounded border">
                <div className="d-flex align-items-center gap-3">
                  <div className="spinner-border spinner-border-sm text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between mb-1">
                      <small className="fw-medium">Uploading attachment...</small>
                      <small className="text-primary fw-medium">{uploadProgress}%</small>
                    </div>
                    <div className="progress" style={{ height: '6px' }}>
                      <div
                        className="progress-bar progress-bar-striped progress-bar-animated"
                        role="progressbar"
                        style={{ width: `${uploadProgress}%` }}
                        aria-valuenow={uploadProgress}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Attachments List */}
            {data?.attachments?.length > 0 && (
              <div className="border rounded p-2 bg-light">
                <div className="d-flex flex-column gap-2">
                  {data?.attachments?.map((att, i) => (
                    <div
                      key={i}
                      className="d-flex align-items-center justify-content-between p-2 bg-white rounded border hover-shadow"
                      style={{ transition: 'all 0.2s' }}
                    >
                      <div
                        className="d-flex align-items-center gap-3 flex-grow-1 cursor-pointer"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleOpenFile(att?.url)}
                      >
                        <div className="flex-shrink-0">
                          {getFileIcon(att?.fileType)}
                        </div>
                        <div className="flex-grow-1 min-width-0">
                          <div className="fw-medium text-truncate" style={{ maxWidth: '300px' }}>
                            {att?.fileName}
                          </div>
                          {att?.fileSize && (
                            <small className="text-muted">
                              {formatFileSize(att?.fileSize)}
                            </small>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="link"
                        size="sm"
                        className="text-danger p-1"
                        onClick={() => handleDeleteAttachment(i)}
                        title="Delete attachment"
                      >
                        <IoMdClose size={18} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer className="border-top bg-light p-3">
        <div className="d-flex justify-content-end gap-2 w-100">
          <Button
            variant="secondary"
            onClick={close}
            className="px-4"
          >
            Cancel
          </Button>
          <Button
            disabled={commitLoading || uploadingAttachment || !data?.comment?.trim()}
            variant="primary"
            onClick={handleCommit}
            className="d-flex align-items-center gap-2 px-4"
          >
            {commitLoading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span>
                <span>Posting...</span>
              </>
            ) : (
              <span>Post Comment</span>
            )}
          </Button>
        </div>
      </Modal.Footer>

      <style jsx>{`
        .hover-shadow:hover {
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transform: translateY(-1px);
        }
        .cursor-pointer {
          cursor: pointer;
        }
        .min-width-0 {
          min-width: 0;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .comment-modal .modal-body {
          animation: fadeIn 0.3s ease-out;
        }
        .dropdown-menu-list {
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
          border: 1px solid #e2e8f0 !important;
        }
        .dropdown-employee-item {
          transition: background-color 0.15s ease-in-out;
        }
        .dropdown-employee-item:hover {
          background-color: #f8fafc;
        }
      `}</style>
    </Modal>
  );
}