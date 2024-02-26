import React from 'react'
import '../App.css'
import { Link } from 'react-router-dom'

export default function EmployeeHome() {

  return (
    <div>
      <h1>Invoice System</h1>
      <div className='d-flex flex-column'>
         <Link to={"/create-invoice"}>Create Invoice</Link>
         <Link to={"/all-invoices"}>All Invoice</Link>
         <Link to={"/view-invoice"}>View Invoice</Link>
      </div>
    </div>
  )
}
