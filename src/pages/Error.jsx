import { Link } from 'react-router-dom'
export default function Error(){
    return(
        <>
        <div className="container-fluid card-h-100 align-items-center d-flex justify-content-center">
            <div>
                {/* <div className="h1 text-center py-2 fw-bold color-4">Error 404</div>
                <div className="text-center fw-bold color-1 h4">Oops! Page Not Found</div> */}
                <center>
                    <img src="/Images/404-error.jpeg" alt="404 Error" className='w-75'/>
                </center>
                <div className="text-center color-2 h5"><Link to="https://claimsolution.in/"> <div className="bg-color-3 btn color-1">Go Back to Home</div></Link></div>
            </div>
        </div>
        </>
    )
}