import React, { useRef, useMemo } from "react";
import JoditEditor from "jodit-react";

function TextEditor({ value, handleOnChange, placeholder }) {
  const editor = useRef(null);

  // useMemo helps to avoid unnecessary re-renders of the editor configuration
  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: placeholder || "Enter message...",
      enableDragAndDropFileToEditor: true,
      toolbarAdaptive: false,
      // Clean up status bar
      showCharsCounter: false,
      showWordsCounter: false,
      showXPathInStatusbar: false,
      height: 300,
      buttons: [
        "font",
        "fontsize",
        "|",
        "bold",
        "italic",
        "underline",
        "|",
        "brush", // font color & background
        "copyformat", // copy formatting tool (paint roller)
        "|",
        "paragraph", // headers
        "|",
        "ul",
        "ol",
        "|",
        "outdent",
        "indent",
        "|",
        "align",
        "|",
        "link",
        "table", // New table option
        "|",
        "copy", // standard copy tool
        "cut",
        "selectall"
      ]
    }),
    [placeholder]
  );

  return (
    <div className="text-editor">
      <JoditEditor
        ref={editor}
        value={value || ""}
        config={config}
        tabIndex={1} // tabIndex of textarea
        onBlur={(newContent) => handleOnChange(newContent)} // preferred to use only this option to update the content for performance reasons
        onChange={(newContent) => handleOnChange(newContent)}
      />
    </div>
  );
}

export default TextEditor;
