import React from "react";
import { CiFileOn } from "react-icons/ci";
import { FaFileWord } from "react-icons/fa6";

const DocumentPreview = ({ url, height = "150px" }) => {
  const getFileType = (url) => {
    const extension = url?.split('.')?.pop()?.split('?')?.[0]?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "bmp","jfif"].includes(extension)) return "image";
    if (["pdf"].includes(extension)) return "pdf";
    if (["mp3", "wav", "ogg",'amr',"acc"].includes(extension)) return "audio";
    if (["mp4", "webm", "mkv", "avi"].includes(extension)) return "video";
    if (["doc", "docx"].includes(extension)) return "word";
    if (["xls", "xlsx", "csv"].includes(extension)) return "excel";
    return "unsupported";
  };

  const fileType = getFileType(url);

  switch (fileType) {
    case "image":
      return <img src={url} alt="Preview" style={{ maxWidth: "100%", height }} />;
    case "pdf":
      return <iframe src={url} title="PDF Preview" style={{ width: "100%", height }} />;
    case "audio":
      return  <div className="d-flex flex-column justify-content-center align-items-center">
<audio controls autoPlay={false}   style={{ width: "250px",height }}>
      <source src={url} />
      Your browser does not support the audio element.
    </audio>
      </div> ;
    case "video":
      return <video controls autoPlay={false}  src={url} style={{ width: "100%", height }} />;
    case "word":
    case "excel":
      return (
        <iframe
          src={`https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`}
          title="Document Preview"
          style={{ width: "100%", height }}
        />
      );
    default:
      return <div  style={{ height,width: "100%" }} className="bg-light d-flex flex-column justify-content-center align-items-center">
        <p>Unsupported file type</p>
        <div className="d-flex justify-content-center bg-color-6 align-items-center fs-4 text-white bg-primary" style={{ height: '3rem', width: '3rem', borderRadius: '3rem' }}>
        <CiFileOn />
  </div> 
      </div> 
;
  }
};

export default DocumentPreview;
