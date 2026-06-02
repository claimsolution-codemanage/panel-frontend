import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { BsFileText, BsArrowRight, BsEnvelope, BsShieldCheck, BsClock } from 'react-icons/bs';
import { MdVerified, MdRefresh, MdAccessTime, MdPhoneAndroid } from 'react-icons/md';
import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import OtpInput from 'react-otp-input';
import '../../../styles/emailVerification/EmailVerificationModal.css'; // We'll create this CSS file

export default function ShowEmailVerificationModal({ show, onClose, userEmail, onVerifySuccess, viewServiceAgreementUrl, sendEmailVerifyOtpApi, verifyEmailApi }) {
    const [step, setStep] = useState('terms'); // 'terms' or 'otp'
    const [agreementChecked, setAgreementChecked] = useState(false);
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState({ minutes: 1, seconds: 30, active: false });
    const [resendLoading, setResendLoading] = useState(false);
    
    let timerInterval = useRef(null);

    useEffect(() => {
        if (show) {
            // Reset state when modal opens
            setStep('terms');
            setAgreementChecked(false);
            setOtp('');
            stopTimer();
        }
        return () => stopTimer();
    }, [show]);

    const stopTimer = () => {
        if (timerInterval.current) {
            clearInterval(timerInterval.current);
            timerInterval.current = null;
        }
    };

    const startResendTimer = () => {
        setResendTimer({ minutes: 1, seconds: 30, active: true });
        
        timerInterval.current = setInterval(() => {
            setResendTimer(prev => {
                if (prev.seconds === 0) {
                    if (prev.minutes === 0) {
                        clearInterval(timerInterval.current);
                        return { ...prev, active: false };
                    }
                    return { minutes: prev.minutes - 1, seconds: 59, active: true };
                }
                return { ...prev, seconds: prev.seconds - 1, active: true };
            });
        }, 1000);
    };

    const handleSendOtp = async () => {
        if (!agreementChecked) {
            toast.warning('Please agree to the Service Agreement');
            return;
        }

        setLoading(true);
        try {

            const result = await sendEmailVerifyOtpApi({ email: userEmail })
            if (result?.data?.success) {
                toast.success('OTP sent successfully to your email');
                setStep('otp');
                startResendTimer();
            } else {
                throw new Error('Failed to send OTP');
            }
        } catch (error) {
            toast.error(error?.response?.data?.message ?? 'Failed to send OTP. Please try again after sometime');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (resendTimer.active) {
            toast.info(`Please wait ${resendTimer.minutes}:${resendTimer.seconds.toString().padStart(2, '0')} before requesting again`);
            return;
        }

        setResendLoading(true);
        try {
            const result = await sendEmailVerifyOtpApi({ email: userEmail })
            if (result?.data?.success) {
                toast.success('OTP resent successfully');
                setOtp('');
                startResendTimer();
            } else {
                throw new Error('Failed to resend OTP');
            }
        } catch (error) {
            toast.error(error?.response?.data?.message ?? 'Failed to resend OTP. Please try again after sometime');
        } finally {
            setResendLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        
        if (otp.length !== 6) {
            toast.warning('Please enter the 6-digit OTP');
            return;
        }

        setLoading(true);
        try {
            const result = await verifyEmailApi({ email: userEmail,otp })
            if (result?.data?.success) {
                toast.success('Email verified successfully!');
                onVerifySuccess?.();
                onClose();
            } else {
                toast.error('Invalid OTP. Please try again.');
            }
        } catch (error) {
            toast.error('Verification failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        stopTimer();
        onClose();
    };

    return (
        <Modal
            show={show}
            size="md"
            aria-labelledby="email-verification-modal"
            centered
            backdrop="static"
            keyboard={false}
            className="email-verification-modal"
        >
            <Modal.Body className="p-0">
                {/* Header Section with Gradient */}
                <div className="modal-header-custom">
                    <div className="header-icon-wrapper">
                        <MdPhoneAndroid className="header-icon" />
                    </div>
                    <h5 className="modal-title-custom">Email Verification Required</h5>
                    <p className="modal-subtitle">Verify your email to continue with case submission</p>
                </div>

                {/* Content Section */}
                <div className="modal-content-custom p-4">
                    {step === 'terms' ? (
                        // Step 1: Terms & Conditions
                        <div className="terms-step">
                            {/* <div className="info-alert">
                                <FiAlertCircle className="info-icon" />
                                <span>Please review and accept the terms to receive verification code</span>
                            </div> */}

                            <div className="email-info-card">
                                <BsEnvelope className="email-icon" />
                                <div>
                                    <div className="email-label">Verification will be sent to</div>
                                    <div className="email-address">{userEmail || 'user@example.com'}</div>
                                </div>
                            </div>

                            <div className="agreement-checkbox-wrapper">
                                <label className="checkbox-label-custom">
                                    <input 
                                        type="checkbox" 
                                        checked={agreementChecked}
                                        onChange={(e) => setAgreementChecked(e.target.checked)}
                                        className="custom-checkbox"
                                    />
                                    <span className="checkbox-text">
                                        I agree to the 
                                        <Link to={viewServiceAgreementUrl ?? '#'} target="_blank" className="agreement-link-custom">
                                            {/* <BsFileText className="inline-icon" /> */}
                                            Service Agreement
                                        </Link>
                                    </span>
                                </label>
                            </div>

                            <button
                                onClick={handleSendOtp}
                                disabled={loading || !agreementChecked}
                                className="btn-primary-custom btn-block"
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" />
                                        Sending Code...
                                    </>
                                ) : (
                                    <>
                                        <MdVerified className="btn-icon" />
                                        Send Verification Code
                                        <BsArrowRight className="btn-icon-end" />
                                    </>
                                )}
                            </button>
                        </div>
                    ) : (
                        // Step 2: OTP Verification
                        <div className="otp-step">
                            <div className="otp-header">
                                <FiCheckCircle className="success-icon" />
                                <h6>Verification Code Sent</h6>
                                <p className="otp-desc">Please enter the 6-digit code sent to <strong>{userEmail}</strong></p>
                            </div>

                            <form onSubmit={handleVerifyOtp}>
                                <div className="otp-input-wrapper">
                                    <OtpInput
                                        shouldAutoFocus={true}
                                        inputType="tel"
                                        value={otp}
                                        onChange={setOtp}
                                        numInputs={6}
                                        renderInput={(props) => (
                                            <input
                                                {...props}
                                                className="otp-input-digit"
                                                style={{
                                                    width: '50px',
                                                    height: '60px',
                                                    margin: '0 6px',
                                                    fontSize: '24px',
                                                    borderRadius: '12px',
                                                    border: `2px solid ${otp.length === 6 ? '#10b981' : '#e2e8f0'}`,
                                                    textAlign: 'center',
                                                    fontWeight: '600',
                                                    backgroundColor: '#f8fafc'
                                                }}
                                            />
                                        )}
                                    />
                                </div>

                                {/* Resend Section */}
                                <div className="resend-section">
                                    {resendTimer.active ? (
                                        <div className="timer-display-custom">
                                            <MdAccessTime className="timer-icon" />
                                            <span>Resend code in {resendTimer.minutes}:{resendTimer.seconds.toString().padStart(2, '0')}</span>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={handleResendOtp}
                                            disabled={resendLoading}
                                            className="resend-button-custom"
                                        >
                                            {resendLoading ? (
                                                <span className="spinner-border spinner-border-sm" />
                                            ) : (
                                                <>
                                                    <MdRefresh className="resend-icon" />
                                                    <span>Resend Verification Code</span>
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>

                                {/* Verify Button */}
                                <button
                                    type="submit"
                                    disabled={loading || otp.length !== 6}
                                    className="btn-primary-custom btn-block btn-verify"
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" />
                                            Verifying...
                                        </>
                                    ) : (
                                        <>
                                            <BsShieldCheck className="btn-icon" />
                                            Verify & Continue
                                        </>
                                    )}
                                </button>

                                {/* Back Button */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setStep('terms');
                                        stopTimer();
                                    }}
                                    className="btn-link-custom"
                                >
                                    ← Back to Terms
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </Modal.Body>

            <Modal.Footer className="modal-footer-custom">
                <button onClick={handleClose} className="btn-secondary-custom">
                    Cancel
                </button>
                {step === 'otp' && (
                    <button onClick={handleClose} className="btn-outline-custom">
                        Close
                    </button>
                )}
            </Modal.Footer>
        </Modal>
    );
}