import React, { useEffect, useState, useRef } from 'react'
import SenderModal from '../Common/InvoiceComp/SenderModal'
import ReceiverModal from '../Common/InvoiceComp/receiverModal'
import AddItem from '../Common/InvoiceComp/AddItem'
import { useFormik } from 'formik'
import * as Yup from 'yup';
import { IoIosAddCircle } from "react-icons/io";
import { LuClipboardEdit } from "react-icons/lu";
import { IoPrint } from "react-icons/io5";
import { TiDelete } from "react-icons/ti";
import EditItem from '../Common/InvoiceComp/editItem'
import { BiMessageSquareEdit } from "react-icons/bi";
import { useReactToPrint } from 'react-to-print';
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'
import { IoArrowBackCircleOutline } from 'react-icons/io5'
import Loader from '../Common/loader'
import { invoiceFormatDate } from '../../utils/helperFunction'
import {ToWords} from 'to-words'

export default function EditInvoiceComp({getInvoice,id,editInvoice,allInvoiceUrl}) {
  const printRef = useRef()
  const toWords = new ToWords()
  const param = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [loadInvoice,setLoadInvoice] = useState({status:true,data:{}})
  const [showSender, setShowSender] = useState(false)
  const [showReceiver, setShowReceiver] = useState(false)
  const [invoiceItems, setInvoiceItems] = useState({ status: false, data: [] })
  const [showEditItem, setShowEditItem] = useState({ status: false, data: {}, id: "" })
  const [finalDetails, setFinalDetails] = useState({ subAmt: 0,invoiceNo:"", gstAmt: 0, totalAmt: 0, invoiceDate: `${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}` })


  
  const getInvoiceById = async () => {
    try {
        const res = await getInvoice(id)
        // console.log("case", res?.data?.data);
        if (res?.data?.success && res?.data?.data) {
            setLoadInvoice({status:false,data:res?.data?.data})
            senderFormik.setValues(res?.data?.data?.sender)
            receiverFormik.setValues(res?.data?.data?.receiver)
            setInvoiceItems({...invoiceItems,data:res?.data?.data?.invoiceItems})
            setFinalDetails({...finalDetails,
                invoiceNo:res?.data?.data?.invoiceNo,
                billDate:res?.data?.data?.billDate ? res?.data?.data?.billDate : new Date().getTime()})

        }
    } catch (error) {
        if (error && error?.response?.data?.message) {
            toast.error(error?.response?.data?.message)
        } else {
            toast.error("Something went wrong")
        }

        // console.log("case error", error);
    }
}

useEffect(() => {
    if (id) {
        getInvoiceById()
    }
}, [id])


  const senderFormik = useFormik({
    initialValues: {
      name: "ADAKIYA CONSULTANCY SERVICES PVT.LTD",
      address: "A-3, KH NO-150, Bhavishya Apartment,Nai Basti Road,Deoli,South Delhi,Delhi-110062,India",
      state: "Delhi",
      country: "IN",
      pinCode: "110062",
      gstNo: "07AAYCA7531P1ZR",
      panNo: "AAYCA7531P",
      email: "claimsolution.in@gmail.com",
      mobileNo: "011 49858616"
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required('Sender name is required'),
      address: Yup.string().required('Sender address is required'),
      state: Yup.string().required('Sender state is required'),
      country: Yup.string().required('Sender country is required'),
      pinCode: Yup.string().required('Sender pin code is required'),
      gstNo: Yup.string().required('Sender GST number is required'),
      panNo: Yup.string().required('Sender PAN number is required'),
      email: Yup.string().email('Invalid email').required('Sender email is required'),
      mobileNo: Yup.string().required('Sender mobile number is required'),
    }),
    onSubmit: async (values) => {
      // console.log("sender", values);
      setShowSender(false)
    }
  })

  const receiverFormik = useFormik({
    initialValues: {
      name: "",
      address: "",
      state: "",
      country: "IN",
      pinCode: "",
      gstNo: "",
      panNo: "",
      email: "",
      mobileNo: ""
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required('Receiver name is required'),
      address: Yup.string().required('Receiver address is required'),
      state: Yup.string().required('Receiver state is required'),
      country: Yup.string().required('Receiver country is required'),
      pinCode: Yup.string().required('Receiver pin code is required'),
      gstNo: Yup.string(),
      panNo: Yup.string(),
      email: Yup.string().email('Receiver Invalid email'),
      mobileNo: Yup.string(),
    }),
    onSubmit: async (values) => {
      // console.log("receiver", values);
      setShowReceiver(false)
    }
  })

  const invoiceItemsFormik = useFormik({
    initialValues: {
      name: "",
      description: "",
      quantity: 0,
      gstRate: 12,
      rate: 0,
      gstAmt: 0,
      amt: 0,
      totalAmt: 0

    },
    validationSchema: Yup.object().shape({
      name: Yup.string(),
      description: Yup.string().required('Item name is required'),
      quantity: Yup.number().required('Quantity is required'),
      gstRate: Yup.number().required('GST rate is required'),
      rate: Yup.number(),
      gstAmt: Yup.number(),
      amt: Yup.number().required('Amount is required'),
      totalAmt: Yup.number(),
    }),
    onSubmit: async (values) => {
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
        billDate: finalDetails.billDate,
        invoiceNo:finalDetails?.invoiceNo,
        
      }
      setLoading(true)
      const res = await editInvoice(id,payload)
      if (res?.data?.success && res.status==200) {
        toast.success(res?.data?.message)
        setLoading(false)
        navigate(allInvoiceUrl)
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

  return (
    <div>{loadInvoice.status ? <Loader/> :
    <div>
      <div className="d-flex justify-content-between bg-color-1 text-primary fs-5 px-4 py-3 shadow">
        <div className="d-flex flex align-items-center gap-3">
        <IoArrowBackCircleOutline className="fs-3" onClick={() => navigate(-1)} style={{ cursor: "pointer" }} />
          <div className="d-flex flex align-items-center gap-1">
            <span>Edit Invoice</span>
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
                    <h4 className='fs-4'>Invoice</h4>
                    <div className="form-group">
                <input type="text" name='' value={finalDetails?.invoiceNo} onChange={(e) => setFinalDetails((pre)=>{return{...pre,invoiceNo:e?.target?.value}})} className={`form-control`} id="billDate" />
              </div>

                    <div className="mt-4">
                      <h5 className="font-size-15 mb-1">Invoice Date</h5>
                      <div className="form-group">
                <input type="date" name='' value={invoiceFormatDate(finalDetails.billDate)} onChange={(e) => setFinalDetails((pre)=>{return{...pre,billDate:e?.target?.value && new Date(e?.target?.value).getTime()}})} className={`form-control`} id="billDate" />
              </div>
                    </div>
                  </div>
                  <div className='sender w-50'>
                  <div className="my-2">
                      <img className="img-fluid" width={150} height={300} src="/Images/icons/company-logo.png" alt="logo"/>
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
                                <p>4. All disputes shubject to exclusive judriction of High Court of Delhi or Courts subordinate to it</p>

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
                          {!isNaN(finalDetails?.totalAmt)&& `Total Amount(In words): ${toWords?.convert(Number(finalDetails?.totalAmt),{currency:true,ignoreZeroCurrency:true})}`}  
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
      {showReceiver && <ReceiverModal show={showReceiver} onHide={() => setShowReceiver(false)} formik={receiverFormik} data={receiverFormik.values} handleChange={(field, value) => receiverFormik.setFieldValue(field, value)} onSave={receiverFormik.handleSubmit} />}
      {invoiceItems.status && <AddItem show={invoiceItems.status} onHide={() => setInvoiceItems({ ...invoiceItems, status: false })} formik={invoiceItemsFormik} data={invoiceItemsFormik.values} handleChange={(field, value) => invoiceItemsFormik.setFieldValue(field, value)} onSave={invoiceItemsFormik.handleSubmit} />}
      {showEditItem.status && <EditItem show={showEditItem.status} onHide={() => setShowEditItem({ ...showEditItem, status: false })} data={showEditItem.data} id={showEditItem.id} onSave={(updateItem, id) => handleEditSave(updateItem, id)} />}

    </div>}
    </div>
  )
}
