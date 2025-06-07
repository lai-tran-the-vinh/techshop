import React from "react";
import SunEditor, { buttonList } from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";

function Editor({ setProduct, ...properties }) {
  return (
    <div>
      <SunEditor
        {...properties}
        onChange={(content) => {
          setProduct((currentProduct) => ({
            ...currentProduct,
            description: content,
          }));
        }}
        setOptions={{
          buttonList: [
            ["undo", "redo"],
            ["font", "fontSize", "formatBlock"],
            [
              "bold",
              "underline",
              "italic",
              "strike",
              "subscript",
              "superscript",
            ],
            ["removeFormat"],
            ["fontColor", "hiliteColor"],
            ["indent", "outdent"],
            ["align", "horizontalRule", "list", "table"],
            ["link", "image"],
            ["fullScreen", "showBlocks", "codeView"],
          ],
          imageUploadUrl: "",
          imageAccept: ".jpg, .jpeg, .png, .gif",
          imageUploadSizeLimit: 5242880,
        }}
        setDefaultStyle="font-family: 'Roboto', sans-serif; font-size: 16px; line-height: 1.5;"
      />
    </div>
  );
}

export default Editor;
