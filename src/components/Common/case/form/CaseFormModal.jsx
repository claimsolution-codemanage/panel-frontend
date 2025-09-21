import { FORM_CONFIG } from "./formConfig";
import FormSection from "./CaseFormSection";
import { FormikProvider, useFormik } from "formik";
import { useState } from "react";
import { toast } from "react-toastify";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import AttachmentPreviewModal from "./AttachmentPreview";

const CaseFormModal = ({ formType, caseId, show, close, getCaseById, formData, createOrUpdateApi, attachementUpload }) => {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState({ status: false, id: null });
  const [previewModal, setPreviewModal] = useState({ show: false, files: [], id: null, isMulti: true });
  const config = FORM_CONFIG[formType];

  const handleSubmit = async (values) => {
    setSaving(true);
    try {
      const { approval, info } = values
      let payload = { ...(approval ? approval : {}), ...(info ? info : {}) }
      const sections = []
      const sectionKeys = ['status', 'query_reply', 'query','track_stages','hearing_schedule','award_part']
      sectionKeys?.map(key => {
        if (values[key]) {
          sections.push(...values[key]?.map(ele => { return { ...ele, type: key } }))
          delete values[key]
        }
      })
      delete values.approval
      delete values.info
      payload.sections = sections
      if (payload?.approval?.approvalLetter?.url || payload?.approvalLetter?.url) {
        payload.approvalLetter = payload?.approvalLetter?.url || payload?.approval?.approvalLetter?.url
      }
      payload = { ...values, ...payload, isSettelment: values?.isSettelment?.isSettelment }
      const res = await createOrUpdateApi({ ...payload, caseId, formType });
      toast.success(res?.data?.message);
      if (getCaseById) getCaseById();
      close();
    } catch (error) {
      console.log("error",error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
    setSaving(false);
  };

  const formik = useFormik({
    initialValues: { ...config?.initialValue, ...(formData ? formData : {}) }, // each type can inject defaults
    validationSchema: config?.validationSchema || {},
    enableReinitialize: true,
    onSubmit: handleSubmit,
  });

  console.log("fromike",formik?.values);
  

  return (
    config ? 
    <>
      <Modal show={show} size="lg" centered>
        <Modal.Body className="color-4">
          <h2 className="text-center text-primary">{config?.title}</h2>
          <FormikProvider value={formik}>
            <form onSubmit={formik.handleSubmit}>
              {config?.sections?.filter(ele=>ele?.key!=="queryReply")?.map((section, idx1) => (
                <FormSection
                  idx1={idx1}
                  section={section}
                  key={section?.key}
                  type={section?.type}
                  formik={formik}
                  setPreviewModal={setPreviewModal}
                  attachementUpload={attachementUpload}
                />
              ))}
            </form>
          </FormikProvider>
        </Modal.Body>
        <Modal.Footer>
          <button
            className={`btn btn-primary ${saving && "disabled"}`}
            onClick={formik.handleSubmit}
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <Button disabled={saving} onClick={close}>Close</Button>
        </Modal.Footer>
      </Modal>
      <AttachmentPreviewModal show={previewModal?.show} files={previewModal?.files} isMulti={previewModal?.isMulti} onDelete={(newValue) => { formik.setFieldValue(previewModal?.id, newValue); setPreviewModal({ show: false, id: null, files: [] }) }} onClose={() => setPreviewModal({ show: false, files: [] })} />


    </> :<></>
  );
};

export default CaseFormModal