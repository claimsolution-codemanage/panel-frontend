import OtpInput from 'react-otp-input';
import { useState } from 'react'
import { toast } from 'react-toastify'
import { AppContext } from "../../App"
import { useContext } from "react"
import { setToken, getJwtDecode } from '../../utils/helperFunction';
import { useNavigate } from 'react-router-dom';
import { MdMailLock } from 'react-icons/md'
import { useEffect } from 'react';
import { partnerResendOtpApi, partnerVerifyOtpApi } from '../../apis/auth/partnerAuthApi';

export default function OtpVerify() {
    const [otp, setOtp] = useState('');
    const state = useContext(AppContext)
    const [disable, setDisable] = useState(false)
    const [resendOtp, setResendOtp] = useState({ loading: false, message: "resend otp", timerStart: false, minutes: 1, second: 30 })
    const navigate = useNavigate()

    const handleVerify = async (e) => {
        e.preventDefault()
        setDisable(true)
        try {
            const res = await partnerVerifyOtpApi({ otp: otp })
            // console.log("res", res);
            if (res?.data?.success) {
                setOtp("")
                const token = res?.headers["x-auth-token"]
                if (token) {
                    setToken(token)
                    const details = getJwtDecode(token)
                    state?.setMyAppData({ isLogin: false, details: details })
                    toast.success(res?.data?.message)
                    navigate("/partner/dashboard")
                    // console.log("partner verify otp", res);
                    setDisable(false)
                }
                // navigate("/partner/verification completed")
                // setDisable(false)
            }
        } catch (error) {
            if (error && error?.response?.data?.message) {
                toast.error(error?.response?.data?.message)
            } else {
                toast.error("Something went wrong")
            }
            // console.log("verify opt error", error);
            setDisable(false)
        }
        // console.log("otp", otp);
    }

    useEffect(() => {
        if (resendOtp.timerStart) {
            const interval = setInterval(() => {
                if (resendOtp.second > 0) {
                    setResendOtp({ ...resendOtp, second: resendOtp.second - 1 })
                }

                if (resendOtp.second === 0) {
                    if (resendOtp.minutes === 0) {
                        clearInterval(interval)
                        setResendOtp({ loading: false, message: "resend otp", timerStart: false, minutes: 1, second: 30 })
                    } else {
                        setResendOtp({ ...resendOtp, second: 59, minutes: resendOtp?.minutes - 1 })
                    }
                }
            }, 1000);

            return () => {
                clearInterval(interval)
            }
        }
    }, [resendOtp.timerStart, resendOtp.minutes, resendOtp.second])

    const handleResentOtp = async () => {
        // console.log("calling handleResentOtp");
        setResendOtp({ ...resendOtp, loading: true, message: "sending..." })
        try {
            const res = await partnerResendOtpApi()
            if (res?.status == 200 && res?.data?.success) {
                toast.success(res?.data?.message)
                setResendOtp({ ...resendOtp, loading: false, message: "", timerStart: true })
            }
        } catch (error) {
            if (error && error?.response?.data?.message) {
                toast.error(error?.response?.data?.message)
            } else {
                toast.error("Something went wrong")
            }
            setResendOtp({ ...resendOtp, loading: false, message: "" })
        }
    }

    return (<>
        <div className="mt-5 mb-5">
            <div className="container-px-5">
                <div className="">
                    <div className="row p-0 m-0">
                        <div className="col-12 col-md-6">
                            <img src="/Images/home/otp.png" className='img-fluid h-100' alt="signup" />
                        </div>
                        <div className="col-md-6 col-sm-12 p-0  bg-color-7 color-4">
                            <div className='mx-auto p-0 p-md-5'>
                                <div className='aligin-items-center d-flex justify-content-center'>
                                    <div className="w-100 w-md-75">
                                        <h2 className='text-center '>Email OTP Verification</h2>
                                        <div className="form w-100 my-4 pb-5">
                                            <div className='d-flex align-items-center justify-content-center mb-5 mt-3'>
                                                <div className='bg-primary text-white d-flex align-items-center justify-content-center' style={{ height: "2.5rem", width: '2.5rem', borderRadius: '2.5rem' }}>
                                                    <MdMailLock className='fs-5' />
                                                </div>
                                            </div>
                                            <div className="mb-3 mt-3">
                                                <OtpInput
                                                    shouldAutoFocus={true}
                                                    inputType="tel"
                                                    value={otp}
                                                    onChange={(otp) => setOtp(otp)}
                                                    numInputs={6}
                                                    containerStyle="d-flex justify-content-center gap-2"
                                                    inputStyle="otp-input"
                                                    renderSeparator={<span> </span>}
                                                    renderInput={(props) => <input {...props} />}
                                                />
                                            </div>
                                            <div class="d-flex gap-2 mt-5 fs-6 align-items-center justify-content-center">
                                                <label class="" >{resendOtp?.timerStart ? "Time Remaining" : "Don't receive the OTP ?"} </label>
                                                <div onClick={resendOtp.loading && resendOtp.timerStart ? () => { } : handleResentOtp} className={`${resendOtp.loading ? "text-info" : "text-primary cursor-pointer"} text-capitalize `}>{resendOtp?.timerStart ? `${resendOtp?.minutes}:${resendOtp.second}s` : resendOtp.message}</div>
                                            </div>
                                            <div className="d-flex justify-content-center mt-5">
                                                <button type="submit" aria-disabled={disable} onClick={handleVerify} className={disable ? "btn btn-primary disabled w-100" : "btn btn-primary w-100"}> {disable ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span> : <span>Verify Email </span>} </button>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}