import React, { useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function TextEditor({ value, handleOnChange }) {
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
        value={value}
        onChange={handleOnChange}
      />
    </div>
  );
}

export default TextEditor;
