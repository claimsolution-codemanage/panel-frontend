import { FieldArray, getIn } from "formik";
import useAttachments from "../../../../hooks/useAttachment";
import PaymentDetails from "../../SubPart/PaymentDetails";
import { formatDateToISO, getFormateDMYDate } from "../../../../utils/helperFunction";

const FormSection = ({ section, formik, attachementUpload, setPreviewModal }) => {
  const { loading, handleFileClick, handleAttachment } = useAttachments(formik, attachementUpload);

  if (section.type === "list") {
    return (
      <div className="card shadow mt-3">
        <div className="card-header bg-primary text-white d-flex justify-content-between">
          <span>{section?.label}</span>
          <button
            type="button"
            className="btn btn-light btn-sm"
            onClick={() =>
              formik?.setFieldValue(section?.key, [
                ...(getIn(formik?.values, section?.key) || []),
                // create empty object for new row from config
                section?.fields?.reduce(
                  (acc, f) => ({
                    ...acc,
                    [f.name]:
                      f.type === "file" ? [] :
                        f.type === "checkbox" ? false :
                          "",
                  }),
                  {}
                ),
              ])
            }
          >
            + Add
          </button>
        </div>

        <div className="card-body">
          <FieldArray name={section.key}>
            {({ remove }) => (
              <>
                {(getIn(formik.values, section.key) || []).map((ele, index) => (
                  <div
                    key={index}
                    className="d-flex gap-3 align-items-start mb-3"
                    style={{ overflowX: "auto", whiteSpace: "nowrap" }}
                  >
                    {section.fields.map((field) => {
                      const fieldName = `${section.key}.${index}.${field.name}`;

                      // text/date
                      if (field.type === "text" || field.type === "date") {
                        return (
                          <div style={{ minWidth: "200px" }} key={field.name}>
                            <input
                              type={field.type}
                              className="form-control"
                              placeholder={field.placeholder}
                              name={fieldName}
                              value={getIn(formik.values, fieldName) ? (field?.type==="date" ?  formatDateToISO(getIn(formik.values, fieldName)) : getIn(formik.values, fieldName)) : ""}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            {getIn(formik.touched, fieldName) &&
                              getIn(formik.errors, fieldName) && (
                                <div className="text-danger small">
                                  {getIn(formik.errors, fieldName)}
                                </div>
                              )}
                          </div>
                        );
                      }

                      // select
                      if (field?.type === "select") {
                        return (
                          <div style={{ minWidth: "200px" }} key={field?.name}>
                            <select
                              className={`form-select`}
                              placeholder={field?.placeholder}
                              name={fieldName}
                              value={getIn(formik?.values, fieldName) || ""}
                              onChange={formik?.handleChange}
                              onBlur={formik?.handleBlur}
                              aria-label="Default select example">
                              <option value="">-- {field?.placeholder}</option>
                              {field?.options?.map(ele => <option key={ele?.value} value={ele?.value}>{ele?.label}</option>)}
                            </select>
                            {getIn(formik?.touched, fieldName) &&
                              getIn(formik?.errors, fieldName) && (
                                <div className="text-danger small">
                                  {getIn(formik?.errors, fieldName)}
                                </div>
                              )}
                          </div>
                        );
                      }

                      // checkbox
                      if (field.type === "checkbox") {
                        return (
                          <div
                            className="d-flex align-items-center"
                            style={{ minWidth: "120px" }}
                            key={field.name}
                          >
                            <input
                              type="checkbox"
                              name={fieldName}
                              checked={getIn(formik.values, fieldName) || false}
                              onChange={formik.handleChange}
                            />
                            <label className="ms-1">{field.label}</label>
                          </div>
                        );
                      }

                      // file
                      if (field.type === "file") {
                        return (
                          <div
                            className="d-flex align-items-center gap-2"
                            style={{ maxWidth: "250px" }}
                            key={field.name}
                          >
                            <input
                              type="file"
                              id={fieldName}
                              hidden
                              multiple={field.multiple}
                              onChange={(e) => handleAttachment(e, fieldName,field?.multiple)}
                            />
                            <button
                              type="button"
                              className="btn btn-primary btn-sm"
                              disabled={loading?.id === fieldName}
                              onClick={() => handleFileClick(fieldName)}
                            >
                              {loading?.id === fieldName ? "Uploading..." : "Upload"}
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() =>
                                setPreviewModal({
                                  show: true,
                                  files: getIn(formik.values, fieldName),
                                  id:fieldName,
                                  isMulti:field?.multiple,
                                })
                              }
                            >
                              👁️ View
                            </button>
                          </div>
                        );
                      }

                      return null;
                    })}

                    {/* remove button */}
                    <div style={{ minWidth: "60px" }}>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => remove(index)}
                      >
                        -
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </FieldArray>
        </div>
      </div>
    )
  }

  // for single sections
  if (section.type === "single") {
    return (
      <div className="card shadow mt-3">
      <div className="card-header bg-primary text-white">{section.label}</div>
      <div className="card-body">
        <div
          className={`${!section?.isColumn  && "d-flex gap-3 align-items-center"} mb-3`}
          style={{ overflowX: "auto", whiteSpace: "nowrap" }}
        >
          {section.fields.map((field) => {
            const fieldName = `${section.key}.${field.name}`;
            const condition = field.showIf
              ? getIn(formik.values, `${section.key}.${field.showIf}`) ??
                getIn(formik.values, field.showIf) // support global
              : true;

            if (!condition) return null;

            // ---- Text / Date Inputs ----
            if (field.type === "text" || field.type === "date") {
              return (
                <div key={field.name}>
                  <label className="form-label">{field.label || field.placeholder}</label>
                  <input
                    type={field.type}
                    className="form-control"
                    name={fieldName}
                    // value={getIn(formik.values, fieldName) || ""}
                    value={getIn(formik.values, fieldName) ? (field?.type==="date" ?  formatDateToISO(getIn(formik.values, fieldName)) : getIn(formik.values, fieldName)) : ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {getIn(formik.touched, fieldName) &&
                    getIn(formik.errors, fieldName) && (
                      <div className="text-danger small">
                        {getIn(formik.errors, fieldName)}
                      </div>
                    )}
                </div>
              );
            }

            if (field?.type === "select") {
              return (
                <div style={{ minWidth: "200px" }} key={field?.name}>
                  <label className="form-label">{field.label || field.placeholder}</label>
                  <select
                    className={`form-select`}
                    placeholder={field?.placeholder}
                    name={fieldName}
                    value={getIn(formik?.values, fieldName) || ""}
                    onChange={formik?.handleChange}
                    onBlur={formik?.handleBlur}
                    aria-label="Default select example">
                    <option value="">-- {field?.placeholder}</option>
                    {field?.options?.map(ele => <option key={ele?.value} value={ele?.value}>{ele?.label}</option>)}
                  </select>
                  {getIn(formik?.touched, fieldName) &&
                    getIn(formik?.errors, fieldName) && (
                      <div className="text-danger small">
                        {getIn(formik?.errors, fieldName)}
                      </div>
                    )}
                </div>
              );
            }

            // ---- Checkbox ----
            if (field.type === "checkbox") {
              return (
                <div className="form-check" key={field.name}>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={fieldName}
                    name={fieldName}
                    checked={!!getIn(formik.values, fieldName)} // ✅ always boolean
                    onChange={(e) =>
                      formik.setFieldValue(fieldName, e.target.checked) // ✅ store true/false
                    }
                  />
                  <label className="form-check-label" htmlFor={fieldName}>
                    {field.label}
                  </label>
                </div>
              );
            }

            // ---- File Upload ----
            if (field.type === "file") {
              return (
                <div className="d-flex gap-2 align-items-center" key={field.name}>
                  <input
                    type="file"
                    id={fieldName}
                    hidden
                    onChange={(e) => handleAttachment(e, fieldName,field?.multiple)}
                  />
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    disabled={loading?.id === fieldName}
                    onClick={() => handleFileClick(fieldName)}
                  >
                    {loading?.id === fieldName
                      ? "Uploading..."
                      : getIn(formik.values, fieldName)?.length
                      ? "Replace"
                      : "Upload"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() =>
                      setPreviewModal({
                        show: true,
                        files: getIn(formik.values, fieldName),
                        isMulti:field?.multiple,
                        id:fieldName
                      })
                    }
                  >
                    👁️ View
                  </button>
                </div>
              );
            }

            // ---- Custom Components ----
            if (field.type === "custom" && field.component === "PaymentDetails") {
              return (
                <div className="w-100" key={field.name}>
                  <PaymentDetails formik={formik} />
                </div>
              );
            }

            return null;
          })}
        </div>
      </div>
    </div>
    );
  }

  return null;

};

export default FormSection;
