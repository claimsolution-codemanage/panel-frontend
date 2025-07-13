
export default function FormInputField({ name = "", type = "text", label = "",disable=false, placeholder = "", formik = "", handleOnChange = "" }) {
    const { errors, touched, values } = formik
    const isInVaild = touched[name] && errors[name]
    return (
        <div>
            <div className="mb-3">
                {label && <label htmlFor={name} className='col-form-label'>{label}</label>}
                <input
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    value={values[name]}
                    onChange={(e) => handleOnChange(e, name)}
                    onBlur={formik.handleBlur}
                    disable={disable}
                    className={`form-control ${isInVaild && "is-invalid"}`} />
                {isInVaild && <p className='text-danger'>{isInVaild}</p>}
            </div>
        </div>
    )
}
