// import React, { useRef } from 'react'
// import { getFormateDMYDate } from '../../../utils/helperFunction';
// import { BsGlobe2, BsPersonCircle } from 'react-icons/bs';
// import { FaFacebook, FaPhoneAlt, FaYoutube } from 'react-icons/fa';
// import { MdEmail } from 'react-icons/md';
// import { SiInstagram } from 'react-icons/si';
// import { AiFillTwitterCircle } from 'react-icons/ai';
// import html2canvas from 'html2canvas';


// export default function StatementPdf({ statementOf, data, dateRange }) {

//   const getTotal = (arr) => {
//     let total = 0
//     arr?.forEach(ele => total += ele?.payableAmt || 0)
//     return total
//   }

//   return (
//     <div className=''>
//       <div id="statement-pdf" className='text-black' >
//         <div className='pdf-hearder'>
//           <img src="/Images/icons/company-logo.png" height={70} width={200} alt="Company-logo" loading="lazy" />
//         </div>
//         <div className='bg-primary text-white py-2'>
//           <h5 className='text-uppercase text-center pdf-font'>Commission Statement</h5>
//         </div>
//         <div className='py-3'>
//           <p className='text-uppercase text-center fw-bold pdf-font'>Period from {dateRange?.startDate && getFormateDMYDate(dateRange?.startDate)} to {dateRange?.endDate && getFormateDMYDate(dateRange?.endDate)}</p>
//         </div>
//         <div className=''>
//           <div className="row row-cols-3 g-2 pdf-font mx-2">
//             <div className="d-flex ">
//               <div className="bg-secondary p-2 text-white border border-end-0 rounded-start d-flex align-items-center w-50">{statementOf?.partner ? "Partner" : "Sathi"} Name:</div>
//               <div className="border p-2 border-start-0 rounded-end w-100 d-flex align-items-center text-capitalize">
//                 {statementOf?.partner ? (statementOf?.partner?.profile?.consultantName)
//                   : statementOf?.employee?.fullName}
//               </div>
//             </div>
//             <div className="d-flex ">
//               <div className="bg-secondary p-2 text-white border border-end-0 rounded-start d-flex align-items-center w-55">Reporting Branch:</div>
//               <div className="border p-2 border-start-0 rounded-end w-100 d-flex align-items-center text-capitalize">
//                 {statementOf?.partner ? (statementOf?.partner?.branchId)
//                   : statementOf?.employee?.branchId}
//               </div>
//             </div>
//             <div className="d-flex ">
//               <div className="bg-secondary p-2 text-white border border-end-0 rounded-start d-flex align-items-center w-50">Bank Name:</div>
//               <div className="border p-2 border-start-0 rounded-end w-100 d-flex align-items-center text-capitalize">
//                 {statementOf?.partner ? (statementOf?.partner?.bankingDetails?.bankName)
//                   : statementOf?.employee?.bankName}
//               </div>
//             </div>
//             <div className="d-flex ">
//               <div className="bg-secondary p-2 text-white border border-end-0 rounded-start d-flex align-items-center w-50">{statementOf?.partner ? "Consultant Code" : "Sathi Id"}:</div>
//               <duv className="border p-2 border-start-0 rounded-end w-100 d-flex align-items-center">
//                 {statementOf?.partner ? (statementOf?.partner?.profile?.consultantCode)
//                   : statementOf?.employee?.empId}
//               </duv>
//             </div>
//             <div className="d-flex ">
//               <div className="bg-secondary p-2 text-white border border-end-0 rounded-start d-flex align-items-center w-50">Manager Name:</div>
//               <div className="border p-2 border-start-0 rounded-end w-100 d-flex align-items-center text-capitalize">
//                 {statementOf?.partner ? (statementOf?.partner?.salesId?.fullName)
//                   : statementOf?.employee?.referEmpId?.fullName}
//               </div>
//             </div>
//             <div className="d-flex ">
//               <div className="bg-secondary p-2 text-white border border-end-0 rounded-start d-flex align-items-center w-50">Bank Branch:</div>
//               <div className="border p-2 border-start-0 rounded-end w-100 d-flex align-items-center text-capitalize">
//                 {statementOf?.partner ? (statementOf?.partner?.bankingDetails?.bankBranchName)
//                   : statementOf?.employee?.bankBranchName}
//               </div>
//             </div>
//             <div className="d-flex ">
//               <div className="bg-secondary p-2 text-white border border-end-0 rounded-start d-flex align-items-center w-50">Address:</div>
//               <div className="border p-2 border-start-0 rounded-end w-100 d-flex align-items-center text-capitalize">
//                 {statementOf?.partner ? (statementOf?.partner?.profile?.address)
//                   : statementOf?.employee?.address}
//               </div>
//             </div>
//             <div className="d-flex ">
//               <div className="bg-secondary p-2 text-white border border-end-0 rounded-start d-flex align-items-center w-50">PAN No:</div>
//               <div className="border p-2 border-start-0 rounded-end w-100 d-flex align-items-center text-capitalize">
//                 {statementOf?.partner ? (statementOf?.partner?.bankingDetails?.panNo)
//                   : statementOf?.employee?.panNo}
//               </div>
//             </div>
//             <div className="d-flex ">
//               <div className="bg-secondary p-2 text-white border border-end-0 rounded-start d-flex align-items-center w-50">Bank A/C No:</div>
//               <div className="border p-2 border-start-0 rounded-end w-100 d-flex align-items-center ">
//                 {statementOf?.partner ? (statementOf?.partner?.bankingDetails?.bankAccountNo)
//                   : statementOf?.employee?.bankAccountNo}
//               </div>
//             </div>
//           </div>
//           <div>
//             <div>

//             </div>
//             <div className="mt-4 overflow-auto pdf-font mx-2">
//               <p className='fw-bold'>Policy Details:</p>
//               <table className="table table-bordered ">
//                 <thead>
//                   <tr className="bg-primary text-white">
//                     <th scope="col" colSpan={0.5} className="" >SL No</th>
//                     <th scope="col" colSpan={2} className="">Case Login Date</th>
//                     <th scope="col" colSpan={3} className=""  >Policyholder Name</th>
//                     <th scope="col" colSpan={2} className=""  >File No</th>
//                     <th scope="col" colSpan={2} className=""  >Policy No</th>
//                     <th scope="col" colSpan={3} className=""  >Insurance Company Name</th>
//                     <th scope="col" colSpan={2} className=""  >Claim Amount</th>
//                     <th scope="col" colSpan={2} className="" >Total Claim Approved amount</th>
//                     <th scope="col" colSpan={2} className=""  >Consultancy Fees</th>
//                     <th scope="col" colSpan={1} className=""  >TDS</th>
//                     <th scope="col" colSpan={2} className=""  >Mode Of Login</th>
//                     <th scope="col" colSpan={2} className=""  >Net Amount Payable</th>
//                     <th scope="col" colSpan={2} className=""  >UTR Details</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {Array.isArray(data) && data?.map((item, ind) => <tr key={item._id} className="">
//                     <th scope="row" colSpan={0.5}>{ind + 1}</th>
//                     <td colSpan={2} className="">{item?.caseLogin && getFormateDMYDate(item?.caseLogin)}</td>
//                     <td colSpan={3} className="">{item?.policyHolder}</td>
//                     <td colSpan={2} className="">{item?.fileNo}</td>
//                     <td colSpan={2} className="">{item?.policyNo}</td>
//                     <td colSpan={3} className="">{item?.insuranceCompanyName}</td>
//                     <td colSpan={2} className="">{item?.claimAmount}</td>
//                     <td colSpan={2} className="">{item?.approvedAmt}</td>
//                     <td colSpan={2} className="">{item?.constultancyFee}</td>
//                     <td colSpan={1} className="">{item?.TDS}</td>
//                     <td colSpan={2} className="">{item?.modeOfLogin}</td>
//                     <td colSpan={2} className="">{item?.payableAmt}</td>
//                     <td colSpan={2} className="">{item?.utrDetails}</td>
//                   </tr>)}
//                 </tbody>
//               </table>
//               {data && <div className="">
//                 <p>Total: {getTotal(data)}</p>
//               </div>}

//             </div>
       
//           </div>
//         </div>


//       </div>
//       <div id='pdf-footer' className='mt-4 pdf-footer'>
//               <div className='border border-top border-primary border-2'></div>
//               <div className='row row-cols-4'>
//                 <div className='border border-2 border-top-0 border-bottom-0 border-start-0 border-primary'>
//                   <div className='px-2 text-primary d-flex gap-2 align-items-center'>
//                     <BsPersonCircle className='text-primary' />
//                     For any assistance contact:
//                   </div>
//                 </div>
//                 <div className='border border-2 border-top-0 border-bottom-0 border-start-0 border-primary'>
//                   <div className='text-primary d-flex gap-2 align-items-center'>
//                     <FaPhoneAlt className='text-primary' />
//                     +91 9205530811
//                   </div>
//                 </div>
//                 <div className='border border-2 border-top-0 border-bottom-0 border-start-0 border-primary'>
//                   <div className='text-primary d-flex gap-2 align-items-center'>
//                     <MdEmail className='text-primary' />
//                     help@claimsolution.in
//                   </div>
//                 </div>
//                 <div className='border border-2 border-top-0 border-bottom-0 border-start-0 border-primary'>
//                   <div className='text-primary d-flex gap-2 align-items-center'>
//                     <BsGlobe2 className='text-primary' />
//                     www.claimsolution.in
//                   </div>
//                 </div>
//               </div>
//               <div className='bg-gray-light text-center'>
//               Adakiya Consultancy Services Pvt. Ltd<br/>
//               150, Bhavishya Apartment in Nai Basti Road Deoli, Nai Basti Road, Deoli, South Delhi - 110080, India
//               </div>
//               <div className='bg-primary text-white d-flex gap-3 align-items-center justify-content-center'>
//                 <p className='p-0 m-0'>Connect with us online:</p>
//                 <div className='d-flex gap-2'>
//                 <AiFillTwitterCircle />
//                 <SiInstagram />
//                 <FaFacebook />
//                 <FaYoutube />
//                 </div>
//               </div>
//       </div>
//     </div>
//   )
// }



import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const StatementPdf = ({ data }) => {
  const contentRef = useRef(null);  // Reference for hidden content

  const generatePDF = async () => {
    try {
      const doc = new jsPDF('p', 'pt', 'a4');
      const itemsPerPage = 4;
      const totalPages = Math.ceil(data.length / itemsPerPage);

      // Define page size and margins
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const marginTop = 40;
      const marginBottom = 40;

      for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
        const pageData = data.slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage);

        // Render HTML content in the hidden div and wait for it to load in the DOM
        renderHtml(pageData, pageIndex + 1, totalPages);
        
        // Ensure the content is fully rendered before capturing it
        const contentHtml = contentRef.current;

        if (contentHtml) {
          const canvas = await html2canvas(contentHtml, { scale: 2, useCORS: true });

          const imgData = canvas.toDataURL('image/png');

          // Add image of HTML content to PDF
          if (pageIndex > 0) {
            doc.addPage();
          }
          doc.addImage(imgData, 'PNG', 0, marginTop, pageWidth, pageHeight - marginTop - marginBottom);
        }
      }

      // Save the PDF
      doc.save('generated.pdf');

    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const renderHtml = (pageData, currentPage, totalPages) => {
    if (contentRef.current) {
      // Create custom HTML structure for the current page content
      contentRef.current.innerHTML = `
        <div class="pdf-header">
         
        </div>
        <div class="bg-primary text-white py-2">
          <h5 class="text-uppercase text-center">Commission Statement</h5>
        </div>
        <div class="py-3 text-center">
          <p class="fw-bold">Period from 01/01/2023 to 31/12/2023</p>
        </div>
        <table class="table table-bordered">
          <thead>
            <tr class="bg-primary text-white">
              <th>SL No</th>
              <th>Policyholder Name</th>
              <th>Policy No</th>
              <th>Claim Amount</th>
              <th>Net Amount Payable</th>
            </tr>
          </thead>
          <tbody>
            ${pageData.map((item, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${item.policyHolder}</td>
                <td>${item.policyNo}</td>
                <td>${item.claimAmount}</td>
                <td>${item.payableAmt}</td>
              </tr>`).join('')}
          </tbody>
        </table>
        <div class="pdf-footer">
          <p>Page ${currentPage} of ${totalPages}</p>
          <p>Adakiya Consultancy Services Pvt. Ltd, 150, Bhavishya Apartment, South Delhi</p>
        </div>
      `;
    }
  };

  return (
    <div>
      <button className='btn btn-primary' onClick={generatePDF}>Generate PDF</button>
      
      {/* Hidden container for rendering HTML content */}
      <div ref={contentRef} style={{ display: 'none' }}></div>
    </div>
  );
};

export default StatementPdf;

