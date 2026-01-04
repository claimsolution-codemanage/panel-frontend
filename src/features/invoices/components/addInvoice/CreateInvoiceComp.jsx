import { useEffect, useState, useRef } from 'react'
import SenderModal from '../../../../components/Common/InvoiceComp/SenderModal'
import ReceiverModal from '../../../../components/Common/InvoiceComp/receiverModal'
import AddItem from '../../../../components/Common/InvoiceComp/AddItem'
import { useFormik } from 'formik'
import { IoIosAddCircle } from "react-icons/io";
import { LuClipboardEdit } from "react-icons/lu";
import { TiDelete } from "react-icons/ti";
import EditItem from '../../../../components/Common/InvoiceComp/editItem'
import { BiMessageSquareEdit } from "react-icons/bi";
import { useReactToPrint } from 'react-to-print';
import { toast } from 'react-toastify'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { ToWords } from 'to-words'
import { invoiceFormatDate } from '../../../../utils/helperFunction'
import { IoArrowBackCircleOutline } from 'react-icons/io5'
import { itemInvInitalValues, itemInvValidationSchema, receiverInvInitalValues, receiverValidationSchema, senderInvInitalValues, senderValidationSchema } from '../../../../utils/validation'

export default function CreateInvoiceComp({ createInvoice, clientId, caseId, viewInvoiceUrl, isOffice,fileDetailApi }) {
  const [searchParams,setSearchParams] =useSearchParams()
  const navigate = useNavigate()
  const toWords = new ToWords()
  const printRef = useRef()
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const [showSender, setShowSender] = useState(false)
  const [showReceiver, setShowReceiver] = useState(false)
  const [invoiceItems, setInvoiceItems] = useState({ status: false, data: [] })
  const [showEditItem, setShowEditItem] = useState({ status: false, data: {}, id: "" })
  const [finalDetails, setFinalDetails] = useState({ subAmt: 0, gstAmt: 0, totalAmt: 0, billDate: new Date().getTime() })

  const senderFormik = useFormik({
    initialValues: senderInvInitalValues,
    validationSchema: senderValidationSchema,
    onSubmit: () => setShowSender(false)
  })

  const receiverFormik = useFormik({
    initialValues: receiverInvInitalValues,
    validationSchema: receiverValidationSchema,
    onSubmit: () => setShowReceiver(false)
  })

  const handleInvoiceItem = async (values) => {
    const rate = values.quantity && values.quantity !== 0
      ? (values.amt / (1 + values.gstRate / 100) * values.quantity).toFixed(2)
      : (values?.amt / (1 + values?.gstRate / 100)).toFixed(2);

    const convertItem = {
      ...values,
      rate: rate,
      gstAmt: values.quantity && values.quantity !== 0
        ? (values.amt * values.quantity - rate).toFixed(2)
        : (values.amt - rate).toFixed(2),
      totalAmt: values.quantity && values.quantity !== 0
        ? (values.amt * values.quantity).toFixed(2)
        : (values.amt),
    };
    setInvoiceItems({ status: false, data: [...invoiceItems.data, convertItem] })
    invoiceItemsFormik.resetForm()
  }

  const invoiceItemsFormik = useFormik({
    initialValues: itemInvInitalValues,
    validationSchema: itemInvValidationSchema,
    onSubmit: handleInvoiceItem
  })

  const handleEditSave = (updatedItem, id) => {
    const updatedItemsArray = invoiceItems?.data?.map((item, ind) => {
      if (ind == id) {
        return updatedItem; // Return the updated item
      } else {
        return item; // Return unchanged items
      }
    });
    // Set the updated array in the state
    setInvoiceItems({ status: false, data: updatedItemsArray });
    setShowEditItem({ status: false, data: {}, id: "" })
  }

  useEffect(() => {
    let updateSubAmt = 0
    let updategstAmt = 0
    let updatetotalAmt = 0
    invoiceItems?.data?.map(item => {
      updategstAmt += Number(item.gstAmt)
      updateSubAmt += Number(item?.rate)
      updatetotalAmt += Number(item?.totalAmt)

    })
    setFinalDetails({ ...finalDetails, subAmt: updateSubAmt, gstAmt: updategstAmt, totalAmt: updatetotalAmt })
  }, [invoiceItems.data])

  const handleRemoveItem = (id) => {
    const filterItems = invoiceItems.data.filter((item, ind) => ind != id)
    setInvoiceItems({ ...invoiceItems, data: filterItems })
  }

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const handleSave = async () => {
    // console.log("error:", senderFormik.initialErrors, receiverFormik.isValidating, invoiceItemsFormik.errors);
    if (isOffice || (clientId && caseId)) {
      try {
        if (Object.keys(senderFormik.errors).length > 0 || !senderFormik.isValid) {
          // console.log("senderFormik.errors", senderFormik.errors);
          let errorFields = ""
          Object.keys(senderFormik.errors).map(error => errorFields += error + ", ")
          toast.error(`Please enter sender ${errorFields} required fields`)
          return
        }
        if (Object.keys(receiverFormik.errors).length > 0 || !receiverFormik.isValid) {
          let errorFields = ""
          Object.keys(receiverFormik.errors).map(error => errorFields += error + ", ")
          toast.error(`Please enter receiver ${errorFields} required fields`)
          return
        }
        if (Object.keys(invoiceItemsFormik.errors).length > 0 || !invoiceItemsFormik.isValid) {
          let errorFields = ""
          Object.keys(invoiceItemsFormik.errors).map(error => errorFields += error + ", ")
          toast.error(`Please enter invoice items ${errorFields} required fields`)
          return
        }
        if (invoiceItems.data.length == 0) {
          toast.error("Invoice must have 1 item")
          return
        }
        const payload = {
          sender: senderFormik.values,
          receiver: receiverFormik.values,
          invoiceItems: invoiceItems.data,
          subAmt: finalDetails.subAmt,
          gstAmt: finalDetails.gstAmt,
          totalAmt: finalDetails.totalAmt,
          billDate: finalDetails.billDate
        }
        setLoading(true)
        let clientObjId = clientId || searchParams?.get("clientId")
        let caseObjId = caseId || searchParams?.get("caseId")
        const res = await createInvoice(payload, clientObjId, caseObjId)
        if (res?.data?.success && res.status == 200) {
          toast.success(res?.data?.message)
          setLoading(false)
          if (res?.data?._id) {
            navigate(`${viewInvoiceUrl}${res?.data?._id}`)
          }
        }
      } catch (error) {
        setLoading(false)
        if (error && error?.response?.data?.message) {
          toast.error(error?.response?.data?.message)
        } else {
          toast.error("Something went wrong")
        }
      }
    }
  }

  const handleBack = () => {
    if (location?.state?.filter && location?.state?.back) {
      navigate(location?.state?.back, { state: { ...location?.state, back: location?.pathname } });
    } else {
      navigate(-1)
    }
  };

  console.log("isOffice",isOffice);
  

  return (
    <div>
      <div className="d-flex justify-content-between bg-color-1 text-primary fs-5 px-4 py-3 shadow">
        <div className="d-flex justify-content-between ">
          <div className="d-flex flex align-items-center gap-3">
            {location?.state?.back && <IoArrowBackCircleOutline className="fs-3" onClick={handleBack} style={{ cursor: "pointer" }} />}
            <div className="d-flex flex align-items-center gap-1">
              <span>Create Invoice</span>
            </div>
          </div>
        </div>
        <div className="">
          <button aria-disabled={loading} type="submit" className={`btn btn-primary color-1 w-100 ${loading && "disabled"}`} onClick={handleSave}>  {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true}></span> : <span>Save </span>} </button>
        </div>
      </div>
      <div ref={printRef} className="container my-5 w-100">
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <div className="invoice-title">
                  <div className="float-end font-size-15">
                    <h4 className='fs-4'>Invoice #ACS</h4>
                    <div className="mt-4">
                      <h5 className="font-size-15 mb-1">Invoice Date</h5>
                      {/* <p>{finalDetails.billDate}</p> */}
                      <div className="form-group">
                        <input type="date" name='' value={invoiceFormatDate(finalDetails.billDate)} onChange={(e) => setFinalDetails((pre) => { return { ...pre, billDate: e?.target?.value && new Date(e?.target?.value).getTime() } })} className={`form-control`} id="billDate" />
                      </div>
                    </div>
                  </div>
                  <div className='sender w-50'>
                    <div className="my-2">
                      <img className="img-fluid" width={150} height={300} src="/Images/icons/company-logo.png" alt="logo" />
                    </div>
                    <div className="mb-4">
                      <h4 className="mb-1 text-muted text-capitalize">{senderFormik?.values?.name}</h4>
                    </div>
                    <div className="text-muted">
                      <LuClipboardEdit onClick={() => setShowSender(true)} className='fs-4 text-primary cursor-pointer' />
                      <p className="mb-1 w-75">{senderFormik?.values?.address}</p>
                      <p className='p-0 m-0'>
                        GSTIN: {senderFormik?.values?.gstNo}
                      </p>
                      <p className='p-0 m-0'>
                        PAN NO: {senderFormik?.values?.panNo}
                      </p>
                      <p className='p-0 m-0'>
                        State Name: {senderFormik?.values?.state}
                      </p>
                      <p className='p-0 m-0'>
                        PH NO: {senderFormik?.values?.mobileNo}
                      </p>
                      <p className='p-0 m-0'>
                        E-mail: {senderFormik?.values?.email}
                      </p>
                      <p className='p-0 m-0'>
                        Website: www.claimsolution.in
                      </p>
                      <p className='p-0 m-0'>
                        Helpline No:  9205530811
                      </p>
                    </div>
                  </div>
                </div>
                <hr className="my-4" />
                <div className="row">
                  <div className="col-sm-6">
                    <div className="text-muted">
                      <h5 className="font-size-16 mb-3 d-flex align-items-center gap-2"><LuClipboardEdit onClick={() => setShowReceiver(true)} className='fs-4 text-primary cursor-pointer' /> Billed To: </h5>
                      <h5 className="font-size-15 mb-2 w-75 text-capitalize">{receiverFormik?.values?.name}</h5>
                      <div className="text-muted">
                        <p className="mb-1 w-75">{receiverFormik?.values?.address}-{receiverFormik?.values?.pinCode}</p>
                        <p className='p-0 m-0'>
                          GSTIN: {receiverFormik?.values?.gstNo}
                        </p>
                        <p className='p-0 m-0'>
                          PAN NO: {receiverFormik?.values?.panNo}
                        </p>
                        <p className='p-0 m-0'>
                          State Name: {receiverFormik?.values?.state}
                        </p>
                        <p className='p-0 m-0'>
                          PH NO: {receiverFormik?.values?.mobileNo}
                        </p>
                        <p className='p-0 m-0'>
                          E-mail: {receiverFormik?.values?.email}
                        </p>
                      </div>
                      <p></p>
                    </div>
                  </div>
                  {/* end col */}
                  <div className="col-sm-6">
                    <div className="text-muted text-sm-end">
                    </div>
                  </div>
                  {/* end col */}
                </div>
                {/* end row */}
                <div className="py-2">
                  <h5 className="font-size-15 d-flex align-items-center gap-2"><IoIosAddCircle onClick={() => setInvoiceItems({ ...invoiceItems, status: true })} className='fs-3 text-primary cursor-pointer' /> Summary</h5>
                  <div className="table-responsive">
                    <table className="table align-middle table-nowrap table-centered mb-0">
                      <thead>
                        <tr >
                          <th >S.No</th>
                          <th colSpan={6}>Particulars(Description & Specification) and HSN</th>
                          <th colSpan={1}>Quantity</th>
                          <th colSpan={1}>Gst Rate</th>
                          <th colSpan={1}>Rate</th>
                          <th colSpan={1}>Gst Amt</th>
                          <th colSpan={1} className="text-end col-1">
                            Total
                          </th>
                        </tr>
                      </thead>
                      {/* end thead */}
                      <tbody>
                        {/* end tr */}
                        {invoiceItems.data?.map((item, ind) => <tr key={ind + 1}>
                          <th scope="row">
                            {ind + 1}
                            <TiDelete onClick={() => handleRemoveItem(ind)} className="fs-3 text-danger cursor-pointer" />
                            <BiMessageSquareEdit onClick={() => setShowEditItem({ status: true, data: item, id: ind })} className="fs-3 text-primary cursor-pointer" />
                          </th>
                          <td colSpan={6}>
                            <div>
                              {/* <h5 className="text-truncate font-size-14 mb-1">
                                {item?.name}
                              </h5> */}
                              <p className="text-muted mb-0"> {item?.description}</p>
                            </div>
                          </td>
                          <td colSpan={1}>{item?.quantity ? item?.quantity : "-"}</td>
                          <td colSpan={1}>{item?.gstRate}%</td>
                          <td colSpan={1}>{item.rate}</td>
                          <td colSpan={1}>{item.gstAmt}</td>
                          <td colSpan={1} className="text-end">{item?.quantity && item.quantity !== 0 ? item?.amt * item.quantity : item?.amt}</td>
                        </tr>)}
                        {/* end tr */}


                        <tr>
                          <td colSpan={10}>
                            <tr>
                              <td className="border-0">
                                <strong>Terms & conditions: </strong>
                                <p>1. Goods once sold shall not be taken back.</p>
                                <p>2. Delayed payments shall carry an interest @24% p.a</p>
                                <p>3. No claim for refund or otherwise shall be entertained after delivery of goods/services</p>
                                <p>4. All disputes subject to exclusive judriction of High Court of Delhi or Courts subordinate to it</p>

                              </td>
                            </tr>
                          </td>
                          <td colSpan={2}>
                            <tr className='text-end'>
                              <th scope="row" colSpan={11} className="border-0 text-end px-2">
                                Sub Total
                              </th>
                              <td className="border-0 text-end">{finalDetails?.subAmt?.toFixed(2)}</td>
                            </tr>
                            {senderFormik?.values?.state?.toLowerCase() == receiverFormik?.values?.state?.toLowerCase()
                              ? <>
                                <tr>
                                  <th scope="row" colSpan={11} className="border-0 text-end px-2">
                                    CGST
                                  </th>
                                  <td className="border-0 text-end">{(finalDetails?.gstAmt / 2)?.toFixed(2)}</td>
                                </tr>
                                <tr>
                                  <th scope="row" colSpan={11} className="border-0 text-end px-2">
                                    SGST
                                  </th>
                                  <td className="border-0 text-end">{(finalDetails?.gstAmt / 2)?.toFixed(2)}</td>
                                </tr>
                              </>
                              : <>
                                <tr>
                                  <th scope="row" colSpan={11} className="border-0 text-end px-2">
                                    IGST
                                  </th>
                                  <td className="border-0 text-end">{(finalDetails?.gstAmt)?.toFixed(2)}</td>
                                </tr>
                              </>
                            }
                            <tr>
                              <th scope="row" colSpan={11} className="border-0 text-end px-2">
                                Grand Total
                              </th>
                              <td className="border-0 text-end">
                                <h4 className="m-0 fw-semibold fs-5">{finalDetails?.totalAmt}</h4>
                              </td>
                            </tr>
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={10} className="fw-semibold border-0">
                            {!isNaN(finalDetails?.totalAmt) && `Total Amount(In words): ${toWords?.convert(Number(finalDetails?.totalAmt), { currency: true, ignoreZeroCurrency: true })}`}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                </div>
              </div>
            </div>
          </div>
          {/* end col */}
        </div>
      </div>

      <div className='container my-5 w-100'>
        {/* end table responsive */}
        <div className="d-print-none mt-4">
          <div className="float-end">
          </div>
        </div>
      </div>

      {showSender && <SenderModal show={showSender} onHide={() => setShowSender(false)} formik={senderFormik} data={senderFormik.values} handleChange={(field, value) => senderFormik.setFieldValue(field, value)} onSave={senderFormik.handleSubmit} />}
      {showReceiver && <ReceiverModal show={showReceiver} onHide={() => setShowReceiver(false)} formik={receiverFormik} data={receiverFormik.values} handleChange={(field, value) => receiverFormik.setFieldValue(field, value)} onSave={receiverFormik.handleSubmit} fileDetailApi={fileDetailApi}/>}
      {invoiceItems.status && <AddItem show={invoiceItems.status} onHide={() => setInvoiceItems({ ...invoiceItems, status: false })} formik={invoiceItemsFormik} data={invoiceItemsFormik.values} handleChange={(field, value) => invoiceItemsFormik.setFieldValue(field, value)} onSave={invoiceItemsFormik.handleSubmit} />}
      {showEditItem.status && <EditItem show={showEditItem.status} onHide={() => setShowEditItem({ ...showEditItem, status: false })} data={showEditItem.data} id={showEditItem.id} onSave={(updateItem, id) => handleEditSave(updateItem, id)} />}

    </div>
  )
}
