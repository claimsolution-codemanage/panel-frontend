import React, { useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function TextEditor({ value, handleOnChange,placeholder }) {
  const quillRef = useRef(null);

  const handleFocus = () => {
    if (quillRef.current && quillRef.current.getEditor) {
      quillRef.current.getEditor().focus();
    }
  };

  return (
    <div>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        placeholder={placeholder || "Enter message..."}
        value={value}
        style={{height:"100px"}}
        onChange={handleOnChange}
      />
    </div>
  );
}

export default TextEditor;
