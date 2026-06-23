import React, { useState } from 'react';
import { Card, Form, Button, Row, Col, Badge, Alert, ProgressBar } from 'react-bootstrap';
import {
    FaPaperPlane,
    FaPaperclip,
    FaUsers,
    FaEnvelope,
    FaCheckCircle,
    FaTimes,
    FaFile,
    FaFilePdf,
    FaFileImage,
    FaFileWord,
    FaFileExcel,
    FaSpinner,
    FaTrash
} from 'react-icons/fa';
import TextEditor from '../../components/TextEditor';
import '../../styles/mail/MassMail.css';
import { toast } from 'react-toastify';

const CommonSendMail = ({ attachementUpload, sendMailApi }) => {
    // State for form fields
    const [formData, setFormData] = useState({
        group: '',
        subject: '',
        content: '',
    });
    const [attachments, setAttachments] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);
    const [uploadStatus, setUploadStatus] = useState({ status: 0, message: '' });
    const [loading, setLoading] = useState(false);

    // Allowed file types
    const ALLOWED_FILE_TYPES = {
        'application/pdf': 'PDF',
        'image/jpeg': 'JPEG',
        'image/png': 'PNG',
        'image/gif': 'GIF',
        'image/webp': 'WEBP',
        'image/svg+xml': 'SVG',
        'application/msword': 'Word',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word',
        'application/vnd.ms-excel': 'Excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel',
        'text/plain': 'TXT'
    };

    // Allowed file extensions
    const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.doc', '.docx', '.xls', '.xlsx', '.txt'];

    // Get file icon based on mime type
    const getFileIcon = (mimeType) => {
        if (mimeType?.includes('pdf')) return <FaFilePdf className="text-danger" />;
        if (mimeType?.includes('image')) return <FaFileImage className="text-primary" />;
        if (mimeType?.includes('word') || mimeType?.includes('document')) return <FaFileWord className="text-info" />;
        if (mimeType?.includes('excel') || mimeType?.includes('sheet')) return <FaFileExcel className="text-success" />;
        if (mimeType?.includes('text')) return <FaFile className="text-secondary" />;
        return <FaFile className="text-secondary" />;
    };

    // Get file type label
    const getFileTypeLabel = (mimeType) => {
        return ALLOWED_FILE_TYPES[mimeType] || 'File';
    };

    // Validate file type
    const isValidFileType = (file) => {
        // Check by MIME type
        if (ALLOWED_FILE_TYPES[file.type]) {
            return true;
        }

        // Check by extension as fallback
        const extension = '.' + file.name.split('.').pop().toLowerCase();
        return ALLOWED_EXTENSIONS.includes(extension);
    };

    // Format file size
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Handle file upload
    const handleFileUpload = async (file) => {
        if (!file) return;

        // Check file count (max 5)
        if (attachments.length >= 5) {
            setUploadStatus({ status: 2, message: 'Maximum 5 attachments allowed' });
            setTimeout(() => setUploadStatus({ status: 0, message: '' }), 3000);
            return;
        }

        // Validate file type
        if (!isValidFileType(file)) {
            const extension = '.' + file.name.split('.').pop().toLowerCase();
            setUploadStatus({
                status: 2,
                message: `Invalid file type. Allowed formats: PDF, Images (JPG, PNG, GIF, WEBP, SVG), Word (DOC, DOCX), Excel (XLS, XLSX), and TXT files.`
            });
            setTimeout(() => setUploadStatus({ status: 0, message: '' }), 5000);
            return;
        }

        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            setUploadStatus({ status: 2, message: 'File size should be less than 10MB' });
            setTimeout(() => setUploadStatus({ status: 0, message: '' }), 3000);
            return;
        }

        setUploading(true);
        setUploadProgress(0);

        try {
            const formData = new FormData();
            formData.append("file", file);

            // Simulate progress
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 200);

            const res = await attachementUpload('mail-attachments', formData);
            clearInterval(progressInterval);
            setUploadProgress(100);

            if (res?.data?.success) {
                const newAttachment = {
                    filename: file.name,
                    mimeType: file.type || 'application/octet-stream',
                    size: file.size,
                    // storagePath: res?.data?.path || `mail-attachments/${Date.now()}/${file.name}`,
                    url: res?.data?.url || URL.createObjectURL(file),
                    // file: file // Keep reference for preview
                };

                setAttachments([...attachments, newAttachment]);
                setUploadStatus({ status: 1, message: `${file.name} uploaded successfully` });
                setTimeout(() => setUploadStatus({ status: 0, message: '' }), 2000);
            } else {
                setUploadStatus({ status: 2, message: res?.data?.message || 'Upload failed' });
                setTimeout(() => setUploadStatus({ status: 0, message: '' }), 3000);
            }
        } catch (error) {
            console.error('Upload error:', error);
            setUploadStatus({
                status: 2,
                message: error?.response?.data?.message || 'Something went wrong'
            });
            setTimeout(() => setUploadStatus({ status: 0, message: '' }), 3000);
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    // Handle file selection
    const handleAttachmentChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
        e.target.value = ''; // Reset input
    };

    // Remove attachment
    const removeAttachment = (index) => {
        const newAttachments = attachments.filter((_, i) => i !== index);
        setAttachments(newAttachments);
    };

    // Submit handler
    const handleSend = async () => {
        try {
            setLoading(true);
            // Prepare email data with attachments
            const emailData = {
                group: formData.group,
                subject: formData.subject,
                content: formData.content,
                attachments: attachments.map(att => ({
                    filename: att.filename,
                    mimeType: att.mimeType,
                    size: att.size,
                    url: att.url
                }))
            };

            console.log('Sending mass mail:', emailData);
            const res = await sendMailApi(emailData)
            if (res?.data?.success) {
                toast.success(res?.data?.message)
                setShowSuccess(true);
                setFormData({
                    group: '',
                    subject: '',
                    content: '',
                });
                setAttachments([]);
            } else {
                toast.error(res?.data?.message)
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error(error?.response?.data?.message || 'Something went wrong')
        } finally {
            setLoading(false);
        }
    };

    // Clear all attachments
    const clearAllAttachments = () => {
        setAttachments([]);
    };

    // Group options with labels and icons
    const groupOptions = [
        { value: 'client', label: 'Client', icon: '👤' },
        { value: 'partner', label: 'Partner', icon: '🤝' },
        { value: 'Sathi Team', label: 'STM', icon: '📊' },
        { value: 'employee', label: 'Employee', icon: '💼' },
        { value: 'surveyor', label: 'Surveyor', icon: '📋' },
        { value: 'advocate', label: 'Advocate', icon: '⚖️' },
    ];

    return (
        <div className="mass-mail-wrapper p-3 p-md-4">
            <Row className="mb-4 align-items-center">
                <Col>
                    <h2 className="d-flex align-items-center gap-2">
                        <FaEnvelope className="text-primary" />
                        Mass Mail Campaign
                    </h2>
                    <p className="text-muted mb-0">Send broadcast emails to selected user groups</p>
                </Col>
                <Col xs="auto">
                    <Badge bg="light" text="dark" className="px-3 py-2 border">
                        <FaUsers className="me-2" />
                        {formData.group ? groupOptions.find(g => g.value === formData.group)?.label || 'No group selected' : 'No group selected'}
                    </Badge>
                </Col>
            </Row>

            {uploadStatus.status === 1 && (
                <Alert variant="success" className="d-flex align-items-center gap-2" dismissible>
                    <FaCheckCircle size={20} />
                    <span>{uploadStatus.message}</span>
                </Alert>
            )}

            {uploadStatus.status === 2 && (
                <Alert variant="danger" className="d-flex align-items-center gap-2" dismissible>
                    <FaTimes size={20} />
                    <span>{uploadStatus.message}</span>
                </Alert>
            )}

            <Card className="shadow-sm border-0">
                <Card.Body className="p-4">
                    <Form>
                        {/* Group Selection */}
                        <Form.Group className="mb-4" controlId="groupSelect">
                            <Form.Label className="fw-semibold">
                                <span className="text-danger me-1">*</span> Group
                            </Form.Label>
                            <Form.Select
                                value={formData.group}
                                onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                                className="py-2"
                                required
                            >
                                <option value="">Select recipient group</option>
                                {groupOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.icon} {opt.label}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        {/* Subject */}
                        <Form.Group className="mb-4" controlId="subjectInput">
                            <Form.Label className="fw-semibold">
                                <span className="text-danger me-1">*</span> Subject
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter email subject"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                className="py-2"
                                required
                            />
                        </Form.Group>

                        {/* Content with TextEditor */}
                        <Form.Group className="mb-4" controlId="contentEditor">
                            <Form.Label className="fw-semibold">
                                <span className="text-danger me-1">*</span> Content
                            </Form.Label>
                            <div className="text-editor-wrapper border rounded overflow-hidden">
                                <TextEditor
                                    value={formData.content}
                                    handleOnChange={(val) => setFormData({ ...formData, content: val })}
                                />
                            </div>
                        </Form.Group>

                        {/* Attachments */}
                        <Form.Group className="mb-4" controlId="attachmentInput">
                            <Form.Label className="fw-semibold d-flex align-items-center justify-content-between">
                                <span>
                                    <FaPaperclip className="me-2 text-secondary" />
                                    Attachments (optional)
                                </span>
                                <span className="text-muted small fw-normal">
                                    {attachments.length}/5 files
                                </span>
                            </Form.Label>

                            <div className="attachment-upload-area">
                                <Form.Control
                                    type="file"
                                    onChange={handleAttachmentChange}
                                    className="py-2"
                                    disabled={uploading || attachments.length >= 5}
                                    accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.svg,.doc,.docx,.xls,.xlsx,.txt"
                                />
                                <div className="mt-1">
                                    <small className="text-muted">
                                        Allowed formats: PDF, Images (JPG, PNG, GIF, WEBP, SVG), Word (DOC, DOCX), Excel (XLS, XLSX), and TXT. Max 5 files, 10MB each.
                                    </small>
                                </div>
                                {uploading && (
                                    <div className="mt-2">
                                        <ProgressBar
                                            now={uploadProgress}
                                            label={`${uploadProgress}%`}
                                            variant="primary"
                                            className="upload-progress"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Attachment List */}
                            {attachments.length > 0 && (
                                <div className="mt-3">
                                    <div className="d-flex align-items-center justify-content-between mb-2">
                                        <h6 className="mb-0 text-muted small">Uploaded Files</h6>
                                        <Button
                                            variant="link"
                                            size="sm"
                                            className="text-danger p-0"
                                            onClick={clearAllAttachments}
                                        >
                                            <FaTrash className="me-1" />
                                            Clear All
                                        </Button>
                                    </div>
                                    <div className="attachment-list">
                                        {attachments.map((attachment, index) => (
                                            <div key={index} className="attachment-item d-flex align-items-center justify-content-between p-2 border rounded mb-2">
                                                <div className="d-flex align-items-center gap-3">
                                                    {getFileIcon(attachment.mimeType)}
                                                    <div>
                                                        <div className="fw-semibold small">{attachment.filename}</div>
                                                        <div className="text-muted small">
                                                            {getFileTypeLabel(attachment.mimeType)} • {formatFileSize(attachment.size)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="link"
                                                    size="sm"
                                                    className="text-danger p-0"
                                                    onClick={() => removeAttachment(index)}
                                                >
                                                    <FaTimes />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </Form.Group>

                        {/* Action Buttons */}
                        <div className="d-flex flex-wrap gap-3 mt-4 pt-2 border-top">
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={handleSend}
                                disabled={!formData.group || !formData.subject || !formData.content || uploading || loading}
                                className="px-3 d-flex align-items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <FaSpinner className="spinning" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <FaPaperPlane />
                                        Send Mail
                                    </>
                                )}
                            </Button>
                            <Button
                                variant="outline-secondary"
                                onClick={() => {
                                    setFormData({ group: '', subject: '', content: '' });
                                    setAttachments([]);
                                }}
                            >
                                Clear All
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default CommonSendMail;