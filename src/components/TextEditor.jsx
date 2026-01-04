import React, { useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const modules = {
  toolbar: [
    [{ font: [] }, { size: [] }], // font & size

    ["bold", "italic", "underline"], // text styles

    [{ color: [] }, { background: [] }], // font color & highlight

    [{ header: 1 }, { header: 2 }],

    [{ list: "ordered" }, { list: "bullet" }], // lists

    [{ indent: "-1" }, { indent: "+1" }], // indent

    [{ align: [] }], // alignment

    ["link",], // media
  ]
};

const formats = [
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "color",
  "background",
  "header",
  "list",
  "bullet",
  "indent",
  "align",
  "link",
];

function TextEditor({ value, handleOnChange, placeholder }) {
  const quillRef = useRef(null);

  return (
    <div className="text-editor">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={handleOnChange}
        placeholder={placeholder || "Enter message..."}
        modules={modules}
        formats={formats}
        // style={{ height: "150px" }}
      />
    </div>
  );
}

export default TextEditor;
