import React from 'react'
import EmpJoiningForm from '../../../components/Common/EmpJoiningForm'
import { adminAddOrUpdateJoiningFormApi, adminGetEmpJoiningFormApi } from '../../../apis'
import { adminAttachementUpload, adminImageUpload } from '../../../apis/upload'
import { useParams } from 'react-router-dom'

function JoiningForm() {
    const param = useParams()
    return (
        <div>
            <EmpJoiningForm
                addOrUpdateJoiningFormApi={adminAddOrUpdateJoiningFormApi}
                getEmpJoiningFormApi={adminGetEmpJoiningFormApi}
                id={param?._id}
                role={"admin"}
                attachementUpload={adminAttachementUpload}
                imageUpload={adminImageUpload}

            />
        </div>
    )
}

export default JoiningForm