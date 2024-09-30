import React, { useRef } from 'react'
import { getFormateDMYDate } from '../../../utils/helperFunction';

export default function StatementPdf({statementOf,data,dateRange}) {

const getTotal =(arr)=>{
    let total =0
    arr?.forEach(ele=>total+=ele?.payableAmt ||0)
    return total
}

  return (
    <div className='d-none'>
    <div  id="statement-pdf" className='text-black'>
        <div>
        <img src="/Images/icons/company-logo.png" height={70} width={200} alt="Company-logo" loading="lazy" />
        </div>
        <div className='bg-primary text-white py-2'>
        <h5 className='text-uppercase text-center'>Commission Statement</h5>
        </div>
        <div className='py-3'>
            <p className='text-uppercase text-center fw-bold'>Period from {dateRange?.startDate && getFormateDMYDate(dateRange?.startDate)} to {dateRange?.endDate && getFormateDMYDate(dateRange?.endDate)}</p>
        </div>
        <div className='m-1'>
        <div className="row row-cols-3 g-2">
            <div className="d-flex ">
              <div className="bg-secondary p-2 text-white border border-end-0 rounded-start d-flex align-items-center w-50">{statementOf?.partner ? "Partner" : "Sathi"} Name:</div>
              <div className="border p-2 border-start-0 rounded-end w-100 d-flex align-items-center text-capitalize">
              {statementOf?.partner ? (statementOf?.partner?.profile?.consultantName) 
              :statementOf?.employee?.fullName}
              </div>
            </div>
            <div className="d-flex ">
              <div className="bg-secondary p-2 text-white border border-end-0 rounded-start d-flex align-items-center w-55">Reporting Branch:</div>
              <div className="border p-2 border-start-0 rounded-end w-100 d-flex align-items-center text-capitalize">
              {statementOf?.partner ? (statementOf?.partner?.branchId) 
              :statementOf?.employee?.branchId}
              </div>
            </div>
            <div className="d-flex ">
              <div className="bg-secondary p-2 text-white border border-end-0 rounded-start d-flex align-items-center w-50">Bank Name:</div>
              <div className="border p-2 border-start-0 rounded-end w-100 d-flex align-items-center text-capitalize">
              {statementOf?.partner ? (statementOf?.partner?.bankingDetails?.bankName) 
              :statementOf?.employee?.bankName}
              </div>
            </div>
            <div className="d-flex ">
              <div className="bg-secondary p-2 text-white border border-end-0 rounded-start d-flex align-items-center w-50">{statementOf?.partner ? "Consultant Code" : "Sathi Id"}:</div>
              <duv className="border p-2 border-start-0 rounded-end w-100 d-flex align-items-center">
              {statementOf?.partner ? (statementOf?.partner?.profile?.consultantCode) 
              :statementOf?.employee?.empId}
              </duv>
            </div>
            <div className="d-flex ">
              <div className="bg-secondary p-2 text-white border border-end-0 rounded-start d-flex align-items-center w-50">Manager Name:</div>
              <div className="border p-2 border-start-0 rounded-end w-100 d-flex align-items-center text-capitalize">
              {statementOf?.partner ? (statementOf?.partner?.salesId?.fullName) 
              :statementOf?.employee?.referEmpId?.fullName}
              </div>
            </div>
            <div className="d-flex ">
              <div className="bg-secondary p-2 text-white border border-end-0 rounded-start d-flex align-items-center w-50">Bank Branch:</div>
              <div className="border p-2 border-start-0 rounded-end w-100 d-flex align-items-center text-capitalize">
              {statementOf?.partner ? (statementOf?.partner?.bankingDetails?.bankBranchName) 
              :statementOf?.employee?.bankBranchName}
              </div>
            </div>
            <div className="d-flex ">
              <div className="bg-secondary p-2 text-white border border-end-0 rounded-start d-flex align-items-center w-50">Address:</div>
              <div className="border p-2 border-start-0 rounded-end w-100 d-flex align-items-center text-capitalize">
              {statementOf?.partner ? (statementOf?.partner?.profile?.address) 
              :statementOf?.employee?.address}
              </div>
            </div>
            <div className="d-flex ">
              <div className="bg-secondary p-2 text-white border border-end-0 rounded-start d-flex align-items-center w-50">PAN No:</div>
              <div className="border p-2 border-start-0 rounded-end w-100 d-flex align-items-center text-capitalize">
              {statementOf?.partner ? (statementOf?.partner?.bankingDetails?.panNo) 
              :statementOf?.employee?.panNo}
              </div>
            </div>
            <div className="d-flex ">
              <div className="bg-secondary p-2 text-white border border-end-0 rounded-start d-flex align-items-center w-50">Bank A/C No:</div>
              <div className="border p-2 border-start-0 rounded-end w-100 d-flex align-items-center ">
              {statementOf?.partner ? (statementOf?.partner?.bankingDetails?.bankAccountNo) 
              :statementOf?.employee?.bankAccountNo}
              </div>
            </div>
          </div>
        <div>
            <div className="mt-4 overflow-auto">
            <p className='fw-bold'>Policy Details:</p>
              <table className="table table-bordered ">
                <thead>
                  <tr className="bg-primary text-white">
                    <th scope="col" colSpan={0.5} className="" >SL No</th>
                    <th scope="col" colSpan={2} className="">Case Login Date</th>
                    <th scope="col" colSpan={3} className=""  >Policyholder Name</th>
                    <th scope="col" colSpan={2} className=""  >File No</th>
                    <th scope="col" colSpan={2} className=""  >Policy No</th>
                    <th scope="col" colSpan={3} className=""  >Insurance Company Name</th>
                    <th scope="col" colSpan={2} className=""  >Claim Amount</th>
                    <th scope="col" colSpan={2} className="" >Total Claim Approved amount</th>
                    <th scope="col" colSpan={2} className=""  >Consultancy Fees</th>
                    <th scope="col" colSpan={1} className=""  >TDS</th>
                    <th scope="col" colSpan={2} className=""  >Mode Of Login</th>
                    <th scope="col" colSpan={2} className=""  >Net Amount Payable</th>
                    <th scope="col" colSpan={2} className=""  >UTR Details</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((item, ind) => <tr key={item._id} className="">
                    <th scope="row" colSpan={0.5}>{ind + 1}</th>   
                   <td   colSpan={2} className="">{item?.caseLogin && getFormateDMYDate(item?.caseLogin)}</td>
                    <td  colSpan={3} className="">{item?.policyHolder}</td>
                    <td colSpan={2} className="">{item?.fileNo}</td>
                    <td colSpan={2} className="">{item?.policyNo}</td>
                    <td colSpan={3} className="">{item?.insuranceCompanyName}</td>
                    <td colSpan={2} className="">{item?.claimAmount}</td>
                    <td colSpan={2} className="">{item?.approvedAmt}</td>
                    <td colSpan={2} className="">{item?.constultancyFee}</td>
                    <td colSpan={1} className="">{item?.TDS}</td>
                    <td colSpan={2} className="">{item?.modeOfLogin}</td>
                    <td colSpan={2} className="">{item?.payableAmt}</td>
                    <td colSpan={2} className="">{item?.utrDetails}</td>
                  </tr>)}
                </tbody>
              </table>
              {data  && <div  className="">
                    <p>Total: {getTotal(data)}</p>   
                  </div>}

            </div>
        </div>
        </div>


    </div>
  </div>
  )
}
