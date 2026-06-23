import CommonSendMail from '../../../features/massMail/CommonSendMail'
import { adminAttachementUpload } from '../../../apis/upload'
import { adminSendMassMailApi } from '../../../apis/mail/adminMailApi'

export default function AdminSendMail() {

    return (
        <div>
            <CommonSendMail
                attachementUpload={adminAttachementUpload}
                sendMailApi={adminSendMassMailApi}
            />
        </div>
    )
}
