import { useState } from 'react';
import AsyncSelect from 'react-select/async';
import debounce from 'debounce';

export default function FormEmpSelectField({ getEmpList, name = "", type = "text", label = "", placeholder = "", formik = "", handleOnChange = "" }) {
    const [selectEmployee, setSelectEmployee] = useState([])
    const { errors, touched, values } = formik
    const isInVaild = touched[name] && errors[name]
    const fetchEmpList = async (inputValue, cb) => {
        try {
            const { data } = await getEmpList(50, 1, inputValue)
            const list = data?.data?.map(emp => {
                return {
                    label: `${emp?.fullName || ""} | ${emp?.branchId || ""} | ${emp?.type || ""} | ${emp?.designation || ""}`,
                    value: emp?._id
                }
            })
            cb(list)
        } catch (error) {
            cb([])
        }

    }

    const fetchOptions = debounce(fetchEmpList, 3000)

    return (
        <div className="mb-3">
            {label && <label htmlFor={name} className='col-form-label'>{label}</label>}
            <AsyncSelect
                cacheOptions
                defaultOptions
                className='text-capitalize'
                value={values[name]}
                onChange={(e) => handleOnChange(e, name)}
                onBlur={formik.handleBlur}
                loadOptions={fetchOptions}
            />
            {isInVaild && <p className='text-danger'>{isInVaild}</p>}
        </div>
    );
}