import React from 'react'
import { Bill } from '../../components/Common/Bill'
import { IoArrowBackCircleOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'

export default function ClientViewBill() {
    const navigate = useNavigate()
    return (
        <div>
            <div className="d-flex justify-content-between bg-color-1 text-primary fs-5 px-4 py-3 shadow">
                <div className="d-flex flex align-items-center gap-3">
                    <IoArrowBackCircleOutline className="fs-3" style={{ cursor: 'pointer' }} onClick={() => navigate("/client/dashboard")} />
                    <div className="d-flex flex align-items-center gap-1">
                        <span>View Bill</span>
                    </div>
                </div>
            </div>
            <div className="container-fluid p-2 p-md-4">
            <Bill />

            </div>
        </div>
    )
}
