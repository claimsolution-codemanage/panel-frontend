import { useState,useEffect } from 'react'
import { toast } from 'react-toastify'
import { useNavigate,Link } from 'react-router-dom';
import { getToken, setToken } from '../../utils/helperFunction';
import { AppContext } from "../../App"
import { useContext } from "react"
import { getJwtDecode } from '../../utils/helperFunction';
import OtpInput from 'react-otp-input';
import Loader from '../../components/Common/loader';
import { partnerSendMobileOtpCode,partnerMobileOtpCodeVerify } from '../../apis';
import {FaPhoneAlt} from 'react-icons/fa'
import {GoShieldLock} from 'react-icons/go'
import { auth } from '../../utils/firebase';
import { RecaptchaVerifier,signInWithPhoneNumber} from 'firebase/auth'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

export default function ClientMobileSendOtp() {
    const state = useContext(AppContext)
    const [otp, setOtp] = useState('');
    const [disable, setDisable] = useState(false)
    const [disableVerify,setDisableVerify] = useState(false)
    const [loading,setLoading] = useState(false)
    const [sendMobileNo,setSendMobileNo] = useState("")
    const [sendOTP,setSendOTP] = useState(false)
    const navigate = useNavigate()

    useEffect(()=>{
        const token = getToken()
        if(token){
            const details = getJwtDecode(token)
            // state?.setMyAppData({isLogin:false,details:details})
            const mobileNo = details?.mobileNo
            if(mobileNo){
                setSendMobileNo(mobileNo)
                setLoading(false)
                }else{
                    navigate("/client/signup")
                }
        }else{
            navigate("/client/signup")
        }
    },[state])

    const handleVerify = async (e) => {
        // e.preventDefault()
        setDisableVerify(true)
        try {
            const res = await partnerMobileOtpCodeVerify()
            // console.log("res", res);
            if (res?.data?.success) {
                setOtp("")
                navigate("/client/verification completed")
                // const token =  res?.headers["x-auth-token"]
                // if(token){
                //     setToken(token)
                //     const details = getJwtDecode(token)
                //     state?.setMyAppData({isLogin:true,details:details})         
                //     toast.success(res?.data?.message)
                //     navigate("/client/dashboard")
                //     // console.log("handleVerify", res);
                //     setDisableVerify(false)
                // }
                setDisableVerify(false)
            }
        } catch (error) {
            if (error && error?.response?.data?.message) {
                toast.error(error?.response?.data?.message)
            } else {
                toast.error("Something went wrong")
            }
           
            // console.log("verify opt error", error);
            setDisableVerify(false)
        }
        // console.log("otp", otp);
    }

    const sendMobileCode = async(e)=>{
            e.preventDefault()
            setDisable(true)
            try {
                const res = await partnerSendMobileOtpCode({mobileNo: sendMobileNo })
                // console.log("res", res);
                if (res?.data?.success) {
                    setDisable(false)
                    onCaptchVerify()
                }
            } catch (error) {
                if (error && error?.response?.data?.message) {
                    toast.error(error?.response?.data?.message)
                } else {
                    toast.error("Something went wrong")
                }
                // console.log("sendMobileCode error", error);
                setDisable(false)
            }

    }

    

    const onCaptchVerify=async()=>{
        setDisable(true)
    // console.log("calling oncaptchverify");
    window.recaptchaVerifier = new RecaptchaVerifier(auth,'recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {
            // handleSendMobileOtp()
            // console.log("calling recaptch callback",response);
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          // ...
        },
        'expired-callback': () => {
            toast.error("Please Solve reCAPTCHA again.")
        }
      });

      const formatPhone = '+' + sendMobileNo;
      const appVerifier = window.recaptchaVerifier;
      signInWithPhoneNumber(auth, formatPhone, appVerifier)
        .then((confirmationResult) => {
          toast.success("OTP sent to phone");
          window.confirmationResult = confirmationResult;
          setDisable(false)
          setSendOTP(true);
        })
        .catch((error) => {
        //   console.log("Failed to send OTP", error);
          toast.error("Failed to send phone OTP, try again later");
        });
    }

// const handleSendMobileOtp = ()=>{
//     // onCaptchVerify()
//     console.log("calling handleSendMobile");
//     const appVerifier = window.recaptchaVerifier;
//     const formatPhone = '+'+sendMobileNo
//     signInWithPhoneNumber(auth,formatPhone, appVerifier)
//     .then((confirmationResult) => {
//     toast.success("OTP send to Phone")
//     setSendOTP(true)
//       // SMS sent. Prompt user to type the code from the message, then sign the
//       // user in with confirmationResult.confirm(code).
//       window.confirmationResult = confirmationResult;
//       console.log("confirmation",confirmationResult);
//       // ...
//     }).catch((error) => {
//         console.log("failed send otp",error);
//         toast.error("Failed to send phone OTP, try again later")
        
//       // Error; SMS not sent
//       // ...
//     });
// }

// console.log("phoneno","+"+sendMobileNo);

const onOTPVerify =()=>{
    if(window.confirmationResult){
        // console.log("otp",otp);
        window.confirmationResult.confirm(otp).then( async(result) => {
            // User signed in successfully.
            const user = result.user;
            // console.log("user",user);
            handleVerify()
            // ...
          }).catch((error) => {
            toast.error("Invaild/expired phone otp")
            // User couldn't sign in (bad verification code?)
            // ...
          });
    }else{
        toast.error("Not getting confirmation result")
    }
}


    return (
        <>
            
            <div className="container-fluid py-5">
                <div className="container-px-5">
                    <div className="card bg-color-2">
                        <div className="row p-0">
                            <div className="col-sm-12 col-md-6 p-0">
                                <img src="/Images/home/sign-in.png" alt="card image" className='img-fluid h-100' />
                            </div>
                            <div className="col-sm-12 col-md-6 bg-color-7 color-4 p-0">
                                <div className="p-5">
                                    {sendOTP ? <div className='aligin-items-center d-flex justify-content-center'>
                                    <div className="w-75">
                                    <div className="h2 fw-bold text-center">Phone OTP Verification</div>
                                    <div className="my-5 pb-5">
                                    <div className='d-flex align-items-center justify-content-center mb-5'>
                                            <div className='bg-primary text-white d-flex align-items-center justify-content-center' style={{height:"2.5rem",width:'2.5rem',borderRadius:'2.5rem'}}>
                                        <GoShieldLock className='fs-3' />
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
                                    <div class="form-check">
                                     <label class="float-end" >
                                            <div onClick={()=>{setSendOTP(false);setDisableVerify(false)}} style={{cursor:'pointer'}} className="text-decoration-underline text-primary">Go Back</div>
                                        </label>
                                    </div>
                                    </div>
                                    <div className="mt-5">
                                        <button aria-disabled={disableVerify}  class={`btn btn-primary color-1 w-100 ${disableVerify && "disabled"}`} onClick={onOTPVerify}>  {disableVerify ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span> : <span>Verify Code</span>} </button>
                                    </div>
                                        </div>
                                </div> 
                                : <div className='aligin-items-center d-flex justify-content-center'>
                                    <div className="w-75">
                                    <div className="h2 fw-bold text-center">Verify your phone number</div>
                                  
                                    {loading ? <Loader/> :<>
                                    <div className="my-4 pb-5">
                                        <div className='d-flex align-items-center justify-content-center mb-5'>
                                            <div className='bg-primary text-white d-flex align-items-center justify-content-center' style={{height:"2.5rem",width:'2.5rem',borderRadius:'2.5rem'}}>
                                        <FaPhoneAlt className='fs-5'/>
                                            </div>
                                        </div>
                                    <div className="mb-3 mt-3">
                                    <PhoneInput
                                    country={'in'}
                                    containerClass="w-100"
                                    inputClass="w-100"
                                    placeholder="+91 12345-67890"
                                    onlyCountries={['in']}
                                   value={sendMobileNo} disabled={true}/>
                                    </div>
                                    <div class="form-check">
                                     <label class="float-end" >
                                            <Link to="/client/signup" className="text-decoration-underline text-primary">Go Back</Link>
                                        </label>
                                    </div>
                                    </div>
                                    <div id='recaptcha-container' className=''></div>
                                    <div className="mt-5">
                                        <button aria-disabled={disable} type="submit" class={`btn btn-primary color-1 w-100 ${disable && "disabled"}`} onClick={sendMobileCode}>  {disable ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span> : <span>Send Code</span>} </button>
                                    </div>
                                    </>}
                                        </div>
                                        </div>
                                        }
                                        
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}