import React from 'react'
import { useState } from 'react'
import { IoArrowBackCircleOutline } from 'react-icons/io5'
import { Link } from 'react-router-dom'

export default function ClientServiceAgreement() {
    const [loading, setLoading] = useState({ status: true, height: "0%", width: "0%" })
    return (
        <div className="100%" style={{ height: '100vh' }}>
            <div className="d-flex justify-content-between bg-color-1 text-primary fs-5 px-4 py-3 shadow">
                <div className="d-flex flex   align-items-center gap-3">
                    {/* <Link to="/client/dashboard">
                        <IoArrowBackCircleOutline className="fs-3" style={{ cursor: "pointer" }} />
                    </Link> */}
                    <div className="d-flex flex align-items-center gap-1">
                        <span>Service Agreement</span>
                    </div>
                </div>
            </div>
            <iframe
                id='id12322'
                title='casedoc'
                width={loading.width}
                height={loading.height}
                frameBorder="0"
                name="cboxmain"
                seamless="seamless"
                typeof='application/pdf'
                onLoad={() => setLoading({ status: false, height: "100%", width: "100%" })}
                src="/agreement/client.pdf"
            ></iframe>



        </div>

    )
}
