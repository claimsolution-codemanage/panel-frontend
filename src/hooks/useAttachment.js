// useAttachments.js
import { getIn } from "formik";
import { useState } from "react";
import { toast } from "react-toastify";

export default function useAttachments(formik, attachementUpload) {
  const [loading, setLoading] = useState({ status: false, id: null });

  const handleFileClick = (inputId) => {
    document.getElementById(inputId)?.click();
  };

  const uploadAttachmentFiles = async (files, type, id, isList) => {
    setLoading({ status: true, id });

    try {
      const prev = getIn(formik.values, id) || [];
      let newAttachments = [];

      for (let file of files) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await attachementUpload(type, formData);

        if (res?.data?.success) {
          const attachment = {
            url: res.data.url,
            fileName: file.name,
            fileType: file.type,
          };
          newAttachments.push(attachment);
        }
      }

      let payload;
      if (isList) {
        payload = [...prev, ...newAttachments];
      } else {
        payload = newAttachments[0] || null; // single mode
      }

      console.log("payload",payload);
      

      formik.setFieldValue(id, payload);

      if (newAttachments.length) toast.success("File(s) uploaded successfully");
    } catch (error) {
      console.error("upload error", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading({ status: false, id: null });
    }
  };

  const handleAttachment = async (e, id, isList) => {
    const files = e.target.files;
    if (!files?.length) return toast.error("Please select a file");

    const validFiles = [];
    const maxSize = 150 * 1024 * 1024; // 150MB

    for (let file of files) {
      const ext = file.name.split(".").pop().toLowerCase();

      if (file.size > maxSize) {
        toast.error(`${file.name} is too large (max 150MB)`);
        continue;
      }

      const validExts = {
        audio: ["mp3", "wav", "ogg", "amr", "aac"],
        video: ["mp4", "avi"],
        word: ["doc", "docx"],
        excel: ["xls", "xlsx"],
        image: ["jpg", "jpeg", "png", "gif", "bmp"],
        pdf: ["pdf"],
      };

      const type = Object.entries(validExts).find(([_, exts]) =>
        exts.includes(ext)
      )?.[0];

      if (type) validFiles.push({ file, type });
      else toast.error(`${file.name} format not supported.`);
    }

    console.log("isListing",isList);
    
    if (validFiles.length) {
      await uploadAttachmentFiles(
        validFiles.map((f) => f.file),
        validFiles[0].type, // ✅ assume same type for batch
        id,
        isList
      );
    }
  };

  return { loading, handleFileClick, handleAttachment };
}
