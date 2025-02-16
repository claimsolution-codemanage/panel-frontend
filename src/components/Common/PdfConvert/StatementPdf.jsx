import React from 'react';
import { getFormateDMYDate } from '../../../utils/helperFunction';
import { BsGlobe2, BsPersonCircle } from 'react-icons/bs';
import { FaFacebook, FaPhoneAlt, FaYoutube } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { SiInstagram } from 'react-icons/si';
import { AiFillTwitterCircle } from 'react-icons/ai';

const chunkArray = (array, chunk_size) => {
  let index = 0;
  let arrayLength = array.length;
  let tempArray = [];

  for (index = 0; index < arrayLength; index += chunk_size) {
    let chunk = array.slice(index, index + chunk_size);
    tempArray.push(chunk);
  }

  return tempArray;
};

export default function StatementPdf({ statementOf, data, dateRange }) {
  let pgItem = 4
  const getTotal = (arr) => {
    let total = 0;
    arr?.forEach(ele => total += ele?.payableAmt || 0);
    return total;
  }

  let customData = [...data,{modeOfLogin:"Total Amount",payableAmt:getTotal(data)}]


  const pages = chunkArray(customData, pgItem); // Chunk data into pages of 4 rows each

  return (
    <div className='d-none' >
    <div id="statement-pdf" className='position-relative-pg'>
      {pages.map((page, pageIndex) => (
        <div key={pageIndex} className='statement-page page' style={{ pageBreakAfter: "always" }}>
          {/* Header - Make sure it appears on every page */}
          <div className='pdf-header header'>
            <div className='d-flex align-items-center justify-content-between px-5'>
              <p className='p-0 m-0 fs-4 fst-italic text-logo1'>Claim Hai toh,Solution Hai</p>
            <img src="/Images/icons/company-logo.png" height={70} width={200} alt="Company-logo" loading="lazy" />
            </div>
          </div>

        <div className='content text-black'>
          {pageIndex==0 && 
        <div className=''>
          <div className='bg-logo1 text-uppercase text-white text-center py-2'>Monthly Statement</div>
          <div className='border border-top pdf-logo3 border-2 mb-2'></div>
          <p className='text-center fw-bold text-uppercase m-0 p-0'>Period from {getFormateDMYDate(dateRange?.startDate)}  to  {getFormateDMYDate(dateRange?.endDate)}</p>
          <div className="row row-cols-3 g-2 my-0 p-0 pdf-font mx-2">
            <div className="d-flex">
              <div className="bg-logo2 p-2 text-black border border-end-0 rounded-start d-flex align-items-center w-50">{statementOf?.partner ? "Partner " : "Sathi "} Name:</div>
              <div className="border p-2 border-start-0 rounded-end w-100 d-flex align-items-center text-capitalize">
                {statementOf?.partner ? (statementOf?.partner?.profile?.consultantName)
                  : statementOf?.employee?.fullName}
              </div>
            </div>
            <div className="d-flex ">
              <div className="bg-logo2 p-2 text-black border border-end-0 rounded-start d-flex align-items-center w-55">Reporting Branch:</div>
              <div className="border p-2 border-start-0 rounded-end w-100 d-flex align-items-center text-capitalize">
                {statementOf?.partner ? (statementOf?.partner?.branchId)
                  : statementOf?.employee?.branchId}
              </div>
            </div>
            <div className="d-flex ">
              <div className="bg-logo2 p-2 text-black border border-end-0 rounded-start d-flex align-items-center w-50">Bank Name:</div>
              <div className="border p-2 border-start-0 rounded-end w-100 d-flex align-items-center text-capitalize">
                {statementOf?.partner ? (statementOf?.partner?.bankingDetails?.bankName)
                  : statementOf?.employee?.bankName}
              </div>
            </div>
            <div className="d-flex ">
              <div className="bg-logo2 p-2 text-black border border-end-0 rounded-start d-flex align-items-center w-50">{statementOf?.partner ? "Consultant Code" : "Sathi Id"}:</div>
              <div className="border p-2 border-start-0 rounded-end w-100 d-flex align-items-center">
                {statementOf?.partner ? (statementOf?.partner?.profile?.consultantCode)
                  : statementOf?.employee?.empId}
              </div>
            </div>
            <div className="d-flex ">
              <div className="bg-logo2 p-2 text-black border border-end-0 rounded-start d-flex align-items-center w-50">Manager Name:</div>
              <div className="border p-2 border-start-0 rounded-end w-100 d-flex align-items-center text-capitalize">
                {statementOf?.partner ? (statementOf?.partner?.salesId?.fullName)
                  : statementOf?.employee?.referEmpId?.fullName}
              </div>
            </div>
            <div className="d-flex ">
              <div className="bg-logo2 p-2 text-black border border-end-0 rounded-start d-flex align-items-center w-50">Bank Branch:</div>
              <div className="border p-2 border-start-0 rounded-end w-100 d-flex align-items-center text-capitalize">
                {statementOf?.partner ? (statementOf?.partner?.bankingDetails?.bankBranchName)
                  : statementOf?.employee?.bankBranchName}
              </div>
            </div>
            <div className="d-flex ">
              <div className="bg-logo2 p-2 text-black border border-end-0 rounded-start d-flex align-items-center w-50">Address:</div>
              <div className="border p-2 border-start-0 rounded-end w-100 d-flex align-items-center text-capitalize">
                {statementOf?.partner ? (statementOf?.partner?.profile?.address)
                  : statementOf?.employee?.address}
              </div>
            </div>
            <div className="d-flex ">
              <div className="bg-logo2 p-2 text-black border border-end-0 rounded-start d-flex align-items-center w-50">PAN No:</div>
              <div className="border p-2 border-start-0 rounded-end w-100 d-flex align-items-center text-capitalize">
                {statementOf?.partner ? (statementOf?.partner?.bankingDetails?.panNo)
                  : statementOf?.employee?.panNo}
              </div>
            </div>
            <div className="d-flex ">
              <div className="bg-logo2 p-2 text-black border border-end-0 rounded-start d-flex align-items-center w-50">Bank A/C No:</div>
              <div className="border p-2 border-start-0 rounded-end w-100 d-flex align-items-center ">
                {statementOf?.partner ? (statementOf?.partner?.bankingDetails?.bankAccountNo)
                  : statementOf?.employee?.bankAccountNo}
              </div>
            </div>
          </div>
          </div>}
          {/* Table Content */}
          <div className="mt-2 overflow-auto pdf-font mx-2">
          {pageIndex==0 &&   <p className='fw-bold p-0 m-0'>Policy Details:</p>}
            <table className="table table-bordered border-dark border-1">
              <thead>
                <tr className="bg-logo2 text-black">
                     {/* <th scope="col" colSpan={0.5} className="" >SL No</th> */}
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
                     {/* <th scope="col" colSpan={2} className=""  >UTR Details</th> */}
                </tr>
              </thead>
              <tbody>
                {page.map((item, ind) => 
                  <tr key={item._id} className="">
                    {/* <th scope="row" colSpan={0.5}>{pageIndex*pgItem+ ( ind + 1)}</th> */}
                    <td colSpan={2} className="">{item?.caseLogin && getFormateDMYDate(item?.caseLogin)}</td>
                    <td colSpan={3} className="">{item?.policyHolder}</td>
                    <td colSpan={2} className="">{item?.fileNo}</td>
                    <td colSpan={2} className="">{item?.policyNo}</td>
                    <td colSpan={3} className="">{item?.insuranceCompanyName}</td>
                    <td colSpan={2} className="">{item?.claimAmount}</td>
                    <td colSpan={2} className="">{item?.approvedAmt}</td>
                    <td colSpan={2} className="">{item?.constultancyFee}</td>
                    <td colSpan={1} className="">{item?.TDS}</td>
                    <td colSpan={2} className="">{item?.modeOfLogin}</td>
                    <td colSpan={2} className="">{item?.payableAmt}</td>
                    {/* <td colSpan={2} className="">{item?.utrDetails}</td> */}
                  </tr>)}
              </tbody>
            </table>
             
          </div>
        </div>




          {/* Footer - Add footer on every page */}
          <div className='pdf-footer footer'>
            <div className='border border-top pdf-logo1 border-2'></div>
            <div className='row row-cols-4 m-0 p-0'>
              <div className='border border-2 border-top-0 border-bottom-0 border-start-0 m-0 p-0 pdf-logo1'>
                <div className='px-2 text-logo1 d-flex gap-2  align-items-center'>
                  <BsPersonCircle className='text-logo1' />
                  For any assistance contact:
                </div>
              </div>
              <div className='border border-2 border-top-0 border-bottom-0 border-start-0 m-0 p-0 pdf-logo1'>
                <div className='text-logo1 d-flex gap-2  align-items-center'>
                  <FaPhoneAlt className='text-logo1' />
                  +91 9205530811
                </div>
              </div>
              <div className='border border-2 border-top-0 border-bottom-0 border-start-0 m-0 p-0 pdf-logo1'>
                <div className='text-logo1 d-flex  gap-2 align-items-center'>
                  <MdEmail className='text-logo1' />
                  help@claimsolution.in
                </div>
              </div>
              <div className='border border-2 border-top-0 border-end-0 border-bottom-0 border-start-0 m-0 p-0 pdf-logo1'>
                <div className='text-logo1 d-flex gap-2  align-items-center'>
                  <BsGlobe2 className='text-logo1' />
                  www.claimsolution.in
                </div>
              </div>
            </div>
            <div className='bg-logo2 text-center text-black py-1' >
               Adakiya Consultancy Services Pvt. Ltd<br/>
               Regional Office Address - A-4 & 5, 3rd Floor, Rajupark, Devli Road, Near Domino's Pizza, New Delhi -110080, India
               </div>
               <div className='bg-logo1 text-white d-flex py-1 gap-3 align-items-center justify-content-center' style={{color:'white'}}>
                 <p className='p-0 m-0'>Connect with us online:</p>
                 <div className='d-flex gap-2'>
                  <i className='bi bi-facebook'></i>
                  <i className='bi bi-twitter'></i>
                  <i className='bi bi-instagram'></i>
                  <i className='bi bi-youtube'></i>
                 </div>
               </div>
          </div>
        </div>
      ))}
    </div>
    </div>
  );
}
