import {LuCheckCircle} from 'react-icons/lu'
export default function VerificationView({as}){
    return(<>
    <div className="d-flex flex-column align-items-center justify-content-center" style={{height:"80vh"}}>
        <div className='w-50 p-5 color-1 d-flex flex-column align-items-center justify-content-center'>
       <div className=' d-flex flex-column align-items-center justify-content-center'>
        <LuCheckCircle className='fs-1 text-primary mb-3'/>
        <h1>2-step Verification completed!</h1>
       </div>
       <div className='text-center'>
        <p>We are happy that your are join <span className='text-warning'>claim-solution as {as}</span></p> 
       <p className='fs-5'>Please check your <span className='text-primary fs-4'>mail</span> for further detatils</p> 
       </div>
        </div> 
    </div>
    </>)
}