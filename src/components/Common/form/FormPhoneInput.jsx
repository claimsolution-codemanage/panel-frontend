import PhoneInput from "react-phone-input-2"

export default function FormPhoneInputField({ name = "", label = "", placeholder = "", formik = "", handleOnChange = "" }) {
    const { errors, touched, values } = formik
    const isInVaild = touched[name] && errors[name]
    return (
        <div>
            <div >
                {label && <label htmlFor={name} className='col-form-label'>{label}</label>}
                <PhoneInput
                    country={'in'}
                    containerClass="w-100"
                    inputClass="w-100"
                    placeholder="+91 12345-67890"
                    onlyCountries={['in']}
                    value={values[name]} onChange={(e) => handleOnChange(e, name)} />

                {isInVaild && <p className='text-danger'>{isInVaild}</p>}
            </div>
        </div>
    )
}
