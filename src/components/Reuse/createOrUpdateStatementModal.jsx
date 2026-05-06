import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { adminCreateOrUpdateStatment, empOpCreateOrUpdateStatment } from '../../apis';
import { FiPlus, FiTrash2, FiSearch, FiSave } from 'react-icons/fi';

export default function CreateOrUpdateStatmentModal({ show, hide, type, partnerId, empId, data, all, fileDetailApi, refetch }) {
  const [loading, setLoading] = useState(false)
  const [searchingIndex, setSearchingIndex] = useState(null)

  // Validation schema for a single statement
  const statementValidationSchema = Yup.object().shape({
    empId: Yup.string(),
    partnerId: Yup.string(),
    partnerEmail: Yup.string().email("Invalid email format"),
    empEmail: Yup.string().email("Invalid email format"),
    caseLogin: Yup.date().required("Case login date is required").nullable(),
    policyHolder: Yup.string().required("Policy holder name is required"),
    fileNo: Yup.string().required("File number is required"),
    policyNo: Yup.string().required("Policy number is required"),
    insuranceCompanyName: Yup.string().required("Insurance company name is required"),
    claimAmount: Yup.number().typeError("Must be a number").positive("Must be positive").required("Claim amount is required"),
    approvedAmt: Yup.number().typeError("Must be a number").positive("Must be positive").required("Approved amount is required"),
    constultancyFee: Yup.number().typeError("Must be a number").positive("Must be positive").required("Consultancy fee is required"),
    TDS: Yup.string().required("TDS is required"),
    modeOfLogin: Yup.string().required("Mode of login is required"),
    payableAmt: Yup.number().typeError("Must be a number").positive("Must be positive").required("Payable amount is required"),
    utrDetails: Yup.string(),
    fileUrl: Yup.string(),
  })

  // Get empty statement template
  const getEmptyStatement = () => ({
    empId: "",
    partnerId: "",
    partnerEmail: "",
    empEmail: "",
    caseLogin: new Date(),
    policyHolder: "",
    fileNo: "",
    policyNo: "",
    insuranceCompanyName: "",
    claimAmount: "",
    approvedAmt: "",
    constultancyFee: "",
    TDS: "",
    modeOfLogin: "",
    payableAmt: "",
    utrDetails: "",
    fileUrl: "",
    _id: undefined
  })

  // Formik setup for multiple statements
  const formik = useFormik({
    initialValues: {
      statements: [getEmptyStatement()]
    },
    validationSchema: Yup.object({
      statements: Yup.array().of(statementValidationSchema)
    }),
    onSubmit: async (values) => {
      // Check if form is valid
      if (!formik.isValid) {
        toast.error("Please fix all validation errors before submitting")
        return
      }

      try {
        setLoading(true)

        // Prepare payload as array of statements
        const payload = values.statements.map(statement => ({
          ...statement,
          caseLogin: new Date(statement?.caseLogin).getTime(),
          partnerId: partnerId || "",
          empId: empId || "",
        }))

        let res = {}
        if (type == "admin") {
          res = await adminCreateOrUpdateStatment({ statements: payload })
        } else {
          res = await empOpCreateOrUpdateStatment({ statements: payload })
        }

        if (res?.status == 200) {
          setLoading(false)
          formik.resetForm()
          formik.setValues({ statements: [getEmptyStatement()] })
          refetch()
          hide()
          toast.success(res?.data?.message || "Statements saved successfully")
        }
      } catch (error) {
        if (error && error?.response?.data?.message) {
          toast.error(error?.response?.data?.message)
        } else {
          toast.error("Something went wrong")
        }
        setLoading(false)
      }
    }
  })

  // Initialize form with existing data
  useEffect(() => {
    if (data && data._id) {
      // If editing existing data, convert single object to array
      formik.setValues({
        statements: [{
          _id: data?._id,
          empId: data?.empId || "",
          partnerId: data?.partnerId || "",
          caseLogin: data?.caseLogin ? new Date(data?.caseLogin) : new Date(),
          policyHolder: data?.policyHolder || "",
          fileNo: data?.fileNo || "",
          policyNo: data?.policyNo || "",
          insuranceCompanyName: data?.insuranceCompanyName || "",
          claimAmount: data?.claimAmount || "",
          approvedAmt: data?.approvedAmt || "",
          constultancyFee: data?.constultancyFee || "",
          TDS: data?.TDS || "",
          modeOfLogin: data?.modeOfLogin || "",
          payableAmt: data?.payableAmt || "",
          utrDetails: data?.utrDetails || "",
          fileUrl: data?.fileUrl || "",
        }]
      })
    } else {
      formik.setValues({ statements: [getEmptyStatement()] })
    }
  }, [data])

  // Add new statement
  const addStatement = () => {
    const currentStatements = formik.values.statements
    formik.setValues({
      statements: [...currentStatements, getEmptyStatement()]
    })
  }

  // Remove statement
  const removeStatement = (index) => {
    if (formik.values.statements.length > 1) {
      const newStatements = formik.values.statements.filter((_, i) => i !== index)
      formik.setValues({ statements: newStatements })
      // Clear validation errors for removed statement
      formik.setTouched({})
    } else {
      toast.warning("At least one statement is required")
    }
  }

  // Handle search for specific statement
  const handleSearch = async (index) => {
    const currentStatement = formik.values.statements[index]
    if (currentStatement?.fileNo) {
      try {
        setSearchingIndex(index)
        const res = await fileDetailApi(currentStatement?.fileNo)
        const fileData = res?.data?.data?.[0]
        if (fileData) {
          const { claimAmount, employeeDetails, name, insuranceCompanyName, partnerDetails, policyNo } = fileData
          const updatedStatements = [...formik.values.statements]
          updatedStatements[index] = {
            ...updatedStatements[index],
            policyHolder: name || "",
            policyNo: policyNo || "",
            claimAmount: claimAmount || "",
            insuranceCompanyName: insuranceCompanyName || "",
            ...(!partnerId && !empId && {
              partnerEmail: partnerDetails?.email || "",
              empEmail: employeeDetails?.email || "",
            })
          }
          formik.setValues({ statements: updatedStatements })
          toast.success("File details loaded successfully")
        }
        setSearchingIndex(null)
      } catch (error) {
        console.log("error", error)
        if (error && error?.response?.data?.message) {
          toast.error(error?.response?.data?.message)
        } else {
          toast.error("Failed to fetch file details")
        }
        setSearchingIndex(null)
      }
    }
  }

  const checkNumber = (e, index, field) => {
    const { value } = e?.target
    if (!isNaN(value) || value?.includes(' ') || value === '') {
      const updatedStatements = [...formik.values.statements]
      updatedStatements[index][field] = value
      formik.setValues({ statements: updatedStatements })
    }
  }

  // Get error message for a specific field
  const getFieldError = (index, field) => {
    const error = formik.errors.statements?.[index]?.[field]
    const touched = formik.touched.statements?.[index]?.[field]
    return touched && error ? error : null
  }

  return (
    <Modal
      show={show}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onHide={() => !loading && hide()}
    >
      <Modal.Header className="bg-primary text-white">
        <Modal.Title id="contained-modal-title-vcenter">
          <div className="d-flex align-items-center gap-2">
            <FiSave size={24} />
            <h5 className="mb-0">Manage Statements</h5>
          </div>
        </Modal.Title>
        <Button
          variant="link"
          className="text-white"
          onClick={() => !loading && hide()}
          style={{ textDecoration: 'none' }}
        >
          ×
        </Button>
      </Modal.Header>

      <Modal.Body className="bg-light">
        <div className="container-fluid">
          {/* Header with Add Button */}
          <div className="d-md-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
            <div>
              <h6 className="text-muted mb-1">Statement Management</h6>
              <small className="text-secondary">Manage statement details for partners/sathi team</small>
            </div>
            {!data?._id && <Button
              variant="primary"
              size="md"
              onClick={addStatement}
              disabled={loading}
              className="d-flex align-items-center gap-2 shadow-sm"
            >
              <FiPlus /> Add Statement
            </Button>}
          </div>

          {/* Statements List */}
          <div style={{ maxHeight: '60vh', overflowY: 'auto' }} className="pe-2">
            {formik.values.statements.map((statement, index) => (
              <div key={index} className="card shadow-sm mb-4 border-0">
                <div className="card-header bg-white d-flex justify-content-between align-items-center border-bottom">
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-primary rounded-pill">#{index + 1}</span>
                    <h6 className="mb-0 text-primary">Statement Details</h6>
                  </div>
                  {formik.values.statements.length > 1 && !statement?._id && (
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => removeStatement(index)}
                      disabled={loading}
                      className="d-flex align-items-center gap-1"
                    >
                      <FiTrash2 size={14} /> Remove
                    </Button>
                  )}
                </div>

                <div className="card-body">
                  <div className="row g-3">
                    {/* Case Login Date */}
                    <div className="col-md-6 col-lg-4">
                      <label className="form-label fw-semibold">
                        Case Login Date <span className="text-danger">*</span>
                      </label>
                      <DatePicker
                        className={`form-control ${getFieldError(index, 'caseLogin') ? 'is-invalid' : ''}`}
                        selected={statement?.caseLogin}
                        dateFormat={"dd-MM-yyyy"}
                        onChange={(date) => {
                          const updatedStatements = [...formik.values.statements]
                          updatedStatements[index].caseLogin = date
                          formik.setValues({ statements: updatedStatements })
                          formik.setFieldTouched(`statements.${index}.caseLogin`, true)
                        }}
                        placeholderText="Select date"
                      />
                      {getFieldError(index, 'caseLogin') && (
                        <div className="invalid-feedback d-block">{getFieldError(index, 'caseLogin')}</div>
                      )}
                    </div>

                    {/* Partner Email (Conditional) */}
                    {all && (
                      <div className="col-md-6 col-lg-4">
                        <label className="form-label fw-semibold">Partner Email</label>
                        <input
                          type="email"
                          name={`statements.${index}.partnerEmail`}
                          value={statement?.partnerEmail}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`form-control ${getFieldError(index, 'partnerEmail') ? 'is-invalid' : ''}`}
                          placeholder="partner@example.com"
                        />
                        {getFieldError(index, 'partnerEmail') && (
                          <div className="invalid-feedback d-block">{getFieldError(index, 'partnerEmail')}</div>
                        )}
                      </div>
                    )}

                    {/* Sathi Team Email (Conditional) */}
                    {all && (
                      <div className="col-md-6 col-lg-4">
                        <label className="form-label fw-semibold">Employee Email</label>
                        <input
                          type="email"
                          name={`statements.${index}.empEmail`}
                          value={statement?.empEmail}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`form-control ${getFieldError(index, 'empEmail') ? 'is-invalid' : ''}`}
                          placeholder="employee@example.com"
                        />
                        {getFieldError(index, 'empEmail') && (
                          <div className="invalid-feedback d-block">{getFieldError(index, 'empEmail')}</div>
                        )}
                      </div>
                    )}

                    {/* Policy Holder Name */}
                    <div className="col-md-6 col-lg-4">
                      <label className="form-label fw-semibold">
                        Policyholder Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name={`statements.${index}.policyHolder`}
                        value={statement?.policyHolder}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`form-control ${getFieldError(index, 'policyHolder') ? 'is-invalid' : ''}`}
                        placeholder="Enter policyholder name"
                      />
                      {getFieldError(index, 'policyHolder') && (
                        <div className="invalid-feedback d-block">{getFieldError(index, 'policyHolder')}</div>
                      )}
                    </div>

                    {/* File No with Search */}
                    <div className="col-md-6 col-lg-4">
                      <label className="form-label fw-semibold">
                        File Number <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <input
                          type="text"
                          name={`statements.${index}.fileNo`}
                          value={statement?.fileNo}
                          onChange={(e) => checkNumber(e, index, "fileNo")}
                          onBlur={formik.handleBlur}
                          className={`form-control ${getFieldError(index, 'fileNo') ? 'is-invalid' : ''}`}
                          placeholder="Enter file number"
                        />
                        <button
                          type="button"
                          className="btn btn-primary"
                          disabled={searchingIndex === index || !statement?.fileNo?.trim()}
                          onClick={() => handleSearch(index)}
                        >
                          {searchingIndex === index ? (
                            <span className="spinner-border spinner-border-sm" role="status" />
                          ) : (
                            <FiSearch />
                          )}
                        </button>
                      </div>
                      {getFieldError(index, 'fileNo') && (
                        <div className="invalid-feedback d-block">{getFieldError(index, 'fileNo')}</div>
                      )}
                    </div>

                    {/* Policy No */}
                    <div className="col-md-6 col-lg-4">
                      <label className="form-label fw-semibold">
                        Policy Number <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name={`statements.${index}.policyNo`}
                        value={statement?.policyNo}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`form-control ${getFieldError(index, 'policyNo') ? 'is-invalid' : ''}`}
                        placeholder="Enter policy number"
                      />
                      {getFieldError(index, 'policyNo') && (
                        <div className="invalid-feedback d-block">{getFieldError(index, 'policyNo')}</div>
                      )}
                    </div>

                    {/* Insurance Company Name */}
                    <div className="col-md-6 col-lg-4">
                      <label className="form-label fw-semibold">
                        Insurance Company <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name={`statements.${index}.insuranceCompanyName`}
                        value={statement?.insuranceCompanyName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`form-control ${getFieldError(index, 'insuranceCompanyName') ? 'is-invalid' : ''}`}
                        placeholder="Enter insurance company"
                      />
                      {getFieldError(index, 'insuranceCompanyName') && (
                        <div className="invalid-feedback d-block">{getFieldError(index, 'insuranceCompanyName')}</div>
                      )}
                    </div>

                    {/* Claim Amount */}
                    <div className="col-md-6 col-lg-4">
                      <label className="form-label fw-semibold">
                        Claim Amount <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">₹</span>
                        <input
                          type="text"
                          name={`statements.${index}.claimAmount`}
                          value={statement?.claimAmount}
                          onChange={(e) => checkNumber(e, index, "claimAmount")}
                          onBlur={formik.handleBlur}
                          className={`form-control ${getFieldError(index, 'claimAmount') ? 'is-invalid' : ''}`}
                          placeholder="0.00"
                        />
                      </div>
                      {getFieldError(index, 'claimAmount') && (
                        <div className="invalid-feedback d-block">{getFieldError(index, 'claimAmount')}</div>
                      )}
                    </div>

                    {/* Approved Amount */}
                    <div className="col-md-6 col-lg-4">
                      <label className="form-label fw-semibold">
                        Approved Amount <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">₹</span>
                        <input
                          type="text"
                          name={`statements.${index}.approvedAmt`}
                          value={statement?.approvedAmt}
                          onChange={(e) => checkNumber(e, index, "approvedAmt")}
                          onBlur={formik.handleBlur}
                          className={`form-control ${getFieldError(index, 'approvedAmt') ? 'is-invalid' : ''}`}
                          placeholder="0.00"
                        />
                      </div>
                      {getFieldError(index, 'approvedAmt') && (
                        <div className="invalid-feedback d-block">{getFieldError(index, 'approvedAmt')}</div>
                      )}
                    </div>

                    {/* Consultancy Fee */}
                    <div className="col-md-6 col-lg-4">
                      <label className="form-label fw-semibold">
                        Consultancy Fee <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">₹</span>
                        <input
                          type="text"
                          name={`statements.${index}.constultancyFee`}
                          value={statement?.constultancyFee}
                          onChange={(e) => checkNumber(e, index, "constultancyFee")}
                          onBlur={formik.handleBlur}
                          className={`form-control ${getFieldError(index, 'constultancyFee') ? 'is-invalid' : ''}`}
                          placeholder="0.00"
                        />
                      </div>
                      {getFieldError(index, 'constultancyFee') && (
                        <div className="invalid-feedback d-block">{getFieldError(index, 'constultancyFee')}</div>
                      )}
                    </div>

                    {/* TDS */}
                    <div className="col-md-6 col-lg-4">
                      <label className="form-label fw-semibold">
                        TDS <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <input
                          type="text"
                          name={`statements.${index}.TDS`}
                          value={statement?.TDS}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`form-control ${getFieldError(index, 'TDS') ? 'is-invalid' : ''}`}
                          placeholder="e.g., 10%"
                        />
                        <span className="input-group-text">%</span>
                      </div>
                      {getFieldError(index, 'TDS') && (
                        <div className="invalid-feedback d-block">{getFieldError(index, 'TDS')}</div>
                      )}
                    </div>

                    {/* Mode of Login */}
                    <div className="col-md-6 col-lg-4">
                      <label className="form-label fw-semibold">
                        Mode of Login <span className="text-danger">*</span>
                      </label>
                      <select
                        name={`statements.${index}.modeOfLogin`}
                        value={statement?.modeOfLogin}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`form-select ${getFieldError(index, 'modeOfLogin') ? 'is-invalid' : ''}`}
                      >
                        <option value="">Select mode</option>
                        <option value="Online">Online</option>
                        <option value="Offline">Offline</option>
                        <option value="Both">Both</option>
                      </select>
                      {getFieldError(index, 'modeOfLogin') && (
                        <div className="invalid-feedback d-block">{getFieldError(index, 'modeOfLogin')}</div>
                      )}
                    </div>

                    {/* Payable Amount */}
                    <div className="col-md-6 col-lg-4">
                      <label className="form-label fw-semibold">
                        Net Payable Amount <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">₹</span>
                        <input
                          type="text"
                          name={`statements.${index}.payableAmt`}
                          value={statement?.payableAmt}
                          onChange={(e) => checkNumber(e, index, "payableAmt")}
                          onBlur={formik.handleBlur}
                          className={`form-control ${getFieldError(index, 'payableAmt') ? 'is-invalid' : ''}`}
                          placeholder="0.00"
                        />
                      </div>
                      {getFieldError(index, 'payableAmt') && (
                        <div className="invalid-feedback d-block">{getFieldError(index, 'payableAmt')}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer className="bg-light border-top">
        <div className="d-flex justify-content-end gap-2 w-100">
          <Button
            variant="secondary"
            onClick={() => !loading && hide()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            disabled={loading || !formik.isValid}
            className="d-flex align-items-center gap-2 px-4 bg-primary"
            onClick={formik.handleSubmit}
          // style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden={true} />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <FiSave />
                <span>{data?._id ? "Save" : "Save All Statements"}</span>
              </>
            )}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  )
}