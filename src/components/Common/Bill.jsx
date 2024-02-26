import React from 'react'

export const Bill = () => {
  return (
    <div className='bg-white color-2 p-2 p-md-4'>
        <div className='border border-dark'>
            <div className='border border-bottom border-dark border-end-0 border-top-0 border-start-0'>
            <p className='fs-5 fw-bold text-center m-0 p-0'>TAX INVOICE</p>
            </div>
            <div className="row row-cols-2">
                <div className='border border-top-0 border-dark border-end border-bottom-0 border-start-0'>
                    <p>
                    ADAKIYA CONSULTANCY SERVICES PVT.LTD 
                    <br />
                    A-3, KH NO-150, BHAVISHYA APARTMENT
                    <br />
                    NAI BASTI ROAD,DEOLI,SOUTH DELHI
                    <br />
                    DELHI-110062,INDIA
                    <br />
                    GSTIN: 07AAYCA7531P1ZR
                    <br />
                    PAN NO: AAYCA7531P
                    <br />
                    State Name: Delhi,Code:07
                    <br />
                    PH No: 011 49858616
                    <br />
                    E-Mail: claimsolution.in@gmail.com
                    <br />
                    </p>
                </div>
                <div>
                <p>
                    INVOICE NO:08 <br />
                    <p>Date:04.09.2023</p> 
                    </p>
                </div>

            </div>
            <div className='border border-bottom border-top border-dark border-end-0 border-start-0'>
                PARTY NAME <br />
                Mr. Raj Kishore <br />
                T.F-06, Gopala Homes-4,Amuj City Near Tigri Gol Chakkar,AkbarPur Behrampur,Ghaziabad,uttar Pradesh-201009 <br />
                Mobile No:7894561230 <br />
            </div>

            <table className="table table-bordered border-dark">
  <thead>
    <tr>
      <th scope="col-1">SI No.</th>
      <th scope="col-8">Particulars (Descriptions & Specifications) and HSN</th>
      <th scope="col-1">Rate</th>
      <th scope="col-1">Quantity</th>
      <th scope="col-1">Amount</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>File Processing fee</td>
      <td>1694.92</td>
      <td></td>
      <td>1694.92</td>

    </tr>
    <tr>
      <th scope="row"></th>
      <td></td>
      <td>Total</td>
      <td></td>
      <td>1,694.92</td>
    </tr>
  </tbody>
</table>

<div className="row m-0 p-0">
    <div className="col-9">
        Terms & conditions:
        1. Goods once sold shall not be taken back.
        2.Delayed payment shallcarry an interst @24% p.a.
        3.No Claim for refund or otherwise shall be entertained after delivery of goods.
        4.All dispute subject to exclusive judroction of High Court of Delhi or Courts subordinate to it.
    </div>
    <div className="col-3">
        <div className='row m-0 p-0'>
            <div className="col-10">Add: CGST @9%</div>
            <div className="col-2">152.54</div>
        </div>
        <div className='row m-0 p-0'>
            <div className="col-10">Add: SGST @9%</div>
            <div className="col-2">152.54</div>
        </div>
        <div className='row m-0 p-0'>
            <div className="col-10">Add: IGST @9%</div>
            <div className="col-2"></div>
        </div>
        <div className='row m-0 p-0'>
            <div className="col-10">Grand Total</div>
            <div className="col-2">2000</div>
        </div>

    </div>
</div>
        </div>
    </div>
  )
}
