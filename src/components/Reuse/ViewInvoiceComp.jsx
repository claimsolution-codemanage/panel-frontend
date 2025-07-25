import { useEffect, useState } from "react"
import { toast } from 'react-toastify'
import { useLocation, useNavigate } from 'react-router-dom'
import { useParams } from "react-router-dom"
import { IoArrowBackCircleOutline } from 'react-icons/io5'
import Loader from "../Common/loader"
import { AppContext } from "../../App"
import { useContext, useRef } from "react"
import { useReactToPrint } from 'react-to-print';
import { invoiceFormatDate } from "../../utils/helperFunction"
import { ToWords } from 'to-words'
import { useFormik } from "formik"
import { invNoInitalValues, invNoValidationSchema } from "../../utils/validation"
import EditInvoiceNoModal from "../Common/Modal/invoice/EditInvoiceNoModal"



export default function ViewInvoiceComp({ getInvoice, id, editInvNo, editInvNoApi }) {
  const toWords = new ToWords()
  const invoiceRef = useRef()
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const param = useParams()

  const getCaseById = async () => {
    setLoading(true)
    try {
      const res = await getInvoice(id)
      if (res?.data?.success && res?.data?.data) {
        setData(res?.data?.data)
        setLoading(false)
      }
    } catch (error) {
      if (error && error?.response?.data?.message) {
        toast.error(error?.response?.data?.message)
      } else {
        toast.error("Something went wrong")
      }
    }
  }

  const invoiceNoFormik = useFormik({
    initialValues: invNoInitalValues,
    validationSchema: invNoValidationSchema,
    onSubmit: handleEditInvoiceNo
  })

  async function handleEditInvoiceNo(values) {
    invoiceNoFormik.setFieldValue("loading", true)
    try {
      const res = await editInvNoApi(values)
      if (res?.data?.success && res.status == 200) {
        toast.success(res?.data?.message)
        invoiceNoFormik.resetForm()
        getCaseById()
      }
    } catch (error) {
      if (error && error?.response?.data?.message) {
        toast.error(error?.response?.data?.message)
      } else {
        toast.error("Something went wrong")
      }
    }
    invoiceNoFormik.setFieldValue("show", false)
    invoiceNoFormik.setFieldValue("loading", false)
  }


  useEffect(() => {
    if (param?._id) {
      getCaseById()
    }
  }, [param])

  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
  });

  const handleBack = () => {
    if (location?.state?.filter && location?.state?.back) {
      navigate(location?.state?.back, { state: { ...location?.state, back: location?.pathname } });
    } else {
      navigate(-1)
    }
  };

  const handleClickEditInvoiceNo = () => {
    invoiceNoFormik.setValues({
      _id: data?._id,
      invoiceNo: data?.invoiceNo,
      loading: false,
      show: true
    })
  }

  return (<>
    {loading ? <Loader /> :
      <div>
        <div className="d-flex justify-content-between bg-color-1 text-primary fs-5 px-4 py-3 shadow">
          <div className="d-flex flex align-items-center gap-3">
            <IoArrowBackCircleOutline className="fs-3" onClick={handleBack} style={{ cursor: "pointer" }} />
            <div className="d-flex flex align-items-center gap-1">
              <span>View Invoice</span>
              {/* <span><LuPcCase /></span> */}
            </div>
          </div>
          <div className="d-flex gap-2">
            {editInvNo && <div onClick={handleClickEditInvoiceNo} className="btn btn-primary cursor-pointer">Invoice No</div>}
            <div onClick={handlePrint} className="btn btn-primary cursor-pointer">Print/ Download</div>
          </div>
        </div>
        <div className="container my-5 mx-0 mx-md-auto w-100">
          <div className="row m-0 p-0">
            <div ref={invoiceRef} className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <div className="invoice-title">
                    <div className="float-end font-size-15">
                      {<div className={`rounded-1 w-auto text-white text-center px-2 py-1 ${data?.isPaid ? "bg-primary" : "bg-danger"}`}>{data?.isPaid ? "Paid" : "Due"}</div>}
                      <h4 className='fs-4'>Invoice {data?.invoiceNo}</h4>

                      <div className="mt-4">
                        <h5 className="font-size-15 mb-1">Invoice Date</h5>
                        <p>{invoiceFormatDate(data.billDate, true)}</p>
                      </div>
                    </div>
                    <div className='sender w-50'>
                      <div className="my-2">
                        <img className="img-fluid" width={150} height={300} src="/Images/icons/company-logo.png" alt="logo" />
                      </div>
                      <div className="mb-4">
                        <h4 className="mb-1 text-muted text-capitalize">{data?.sender?.name}</h4>
                      </div>
                      <div className="text-muted">
                        <p className="mb-1 w-75">{data?.sender?.address}</p>
                        <p className='p-0 m-0'>
                          GSTIN: {data?.sender?.gstNo}
                        </p>
                        <p className='p-0 m-0'>
                          PAN NO: {data?.sender?.panNo}
                        </p>
                        <p className='p-0 m-0'>
                          State Name: {data?.sender?.state}
                        </p>
                        <p className='p-0 m-0'>
                          PH NO: {data?.sender?.mobileNo}
                        </p>
                        <p className='p-0 m-0'>
                          E-mail: {data?.sender?.email}
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
                        <h5 className="font-size-16 mb-3 d-flex align-items-center gap-2"> Billed To: </h5>
                        <h5 className="font-size-15 mb-2 w-75 text-capitalize">{data?.receiver?.name}</h5>
                        <div className="text-muted">
                          <p className="mb-1 w-75">{data?.receiver?.address}-{data?.receiver?.pinCode}</p>
                          <p className='p-0 m-0'>
                            GSTIN: {data?.receiver?.gstNo}
                          </p>
                          <p className='p-0 m-0'>
                            PAN NO: {data?.receiver?.panNo}
                          </p>
                          <p className='p-0 m-0'>
                            State Name: {data?.receiver?.state}
                          </p>
                          <p className='p-0 m-0'>
                            PH NO: {data?.receiver?.mobileNo}
                          </p>
                          <p className='p-0 m-0'>
                            E-mail: {data?.receiver?.email}
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
                    <h5 className="font-size-15 d-flex align-items-center gap-2">Summary</h5>
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
                          {data?.invoiceItems?.map((item, ind) => <tr key={ind + 1}>
                            <th scope="row">
                              {ind + 1}
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
                        </tbody>
                      </table>
                    </div>
                    <div className="table-responsive">
                      <table className="table align-middle table-nowrap table-centered mb-0">
                        <thead>
                          <tr>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td colSpan={10}>
                              <tr>
                                <td >
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
                                <td className="border-0 text-end">{data?.subAmt?.toFixed(2)}</td>
                              </tr>
                              {data?.sender?.state?.toLowerCase() == data?.receiver?.state?.toLowerCase()
                                ? <>
                                  <tr>
                                    <th scope="row" colSpan={11} className="border-0 text-end px-2">
                                      CGST
                                    </th>
                                    <td className="border-0 text-end">{(data?.gstAmt / 2)?.toFixed(2)}</td>
                                  </tr>
                                  <tr>
                                    <th scope="row" colSpan={11} className="border-0 text-end px-2">
                                      SGST
                                    </th>
                                    <td className="border-0 text-end">{(data?.gstAmt / 2)?.toFixed(2)}</td>
                                  </tr>
                                </>
                                : <>
                                  <tr>
                                    <th scope="row" colSpan={11} className="border-0 text-end px-2">
                                      IGST
                                    </th>
                                    <td className="border-0 text-end">{(data?.gstAmt)?.toFixed(2)}</td>
                                  </tr>
                                </>
                              }
                              <tr>
                                <th scope="row" colSpan={11} className="border-0 text-end px-2">
                                  Grand Total
                                </th>
                                <td className="border-0 text-end">
                                  <h4 className="m-0 fw-semibold fs-5">{data?.totalAmt}</h4>
                                </td>
                              </tr>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={10} className="fw-semibold border-0">
                              {!isNaN(data?.totalAmt) && `Total Amount(In words): ${toWords?.convert(Number(data?.totalAmt), { currency: true, ignoreZeroCurrency: true })}`}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {invoiceNoFormik?.values?.show && <EditInvoiceNoModal show={invoiceNoFormik?.values?.show} onHide={invoiceNoFormik?.resetForm} formik={invoiceNoFormik} />}
      </div>}
  </>)
}