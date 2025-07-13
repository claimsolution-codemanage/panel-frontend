
export default function FormSelectField({ name = "", type = "text", label = "", options = [], placeholder = "", formik = "", handleOnChange = "" }) {
    const { errors, touched, values } = formik
    const isInVaild = touched[name] && errors[name]
    return (
        <div>
            <div className="mb-3">
                {label && <label htmlFor={name} className='col-form-label'>{label}</label>}
                <select
                    className={`form-select ${isInVaild && "is-invalid"}`}
                    name={name} value={values[name]}
                    onChange={(e) => handleOnChange(e, name)}
                    onBlur={formik.handleBlur}
                    aria-label="Default select example">
                    <option value="">-- {placeholder}</option>
                    {options?.map(ele => <option key={ele?.value} value={ele?.value}>{ele?.label}</option>)}
                </select>
                {isInVaild && <p className='text-danger'>{isInVaild}</p>}
            </div>
        </div>
    )
}
