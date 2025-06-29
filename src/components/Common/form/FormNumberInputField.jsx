import { checkPhoneNo } from "../../../utils/helperFunction"

export default function FormNumberInputField({ name = "", type = "number",digit=10, label = "",disable=false, placeholder = "", formik = "", handleOnChange = "" }) {
    const { errors, touched, values } = formik
    const isInVaild = touched[name] && errors[name]
    return (
        <div>
            <div className="mb-3">
                {label && <label htmlFor={name} className='col-form-label'>{label}</label>}
                <input
                    type={"text"}
                    name={name}
                    placeholder={placeholder}
                    value={values[name]}
                    onChange={(e) => checkPhoneNo(e?.target?.value, digit) && handleOnChange(e, name)}
                    onBlur={formik.handleBlur}
                    disable={disable}
                    className="form-control" />
                {isInVaild && <p className='text-danger'>{isInVaild}</p>}
            </div>
        </div>
    )
}
