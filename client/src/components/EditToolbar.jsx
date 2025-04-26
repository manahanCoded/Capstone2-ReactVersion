import React from "react";
import { Quill } from "react-quill-new";
import "quill/dist/quill.snow.css";
import { useLocation } from "react-router-dom";

// Custom Undo button icon component for Quill editor
const CustomUndo = () => (
  <svg viewBox="0 0 18 18">
    <polygon className="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10" />
    <path
      className="ql-stroke"
      d="M8.09,13.91A4.6,4.6,0,0,0,9,14,5,5,0,1,0,4,9"
    />
  </svg>
);

// Custom Redo button icon component for Quill editor
const CustomRedo = () => (
  <svg viewBox="0 0 18 18">
    <polygon className="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10" />
    <path
      className="ql-stroke"
      d="M9.91,13.91A4.6,4.6,0,0,1,9,14a5,5,0,1,1,5-5"
    />
  </svg>
);

// Undo and Redo handler functions for Quill
function undoChange() {
  this.quill.history.undo();
}

function redoChange() {
  this.quill.history.redo();
}

// Register custom formats
const Size = Quill.import("formats/size");
Size.whitelist = ["extra-small", "small", "medium", "large"];
Quill.register(Size, true);

const Font = Quill.import("formats/font");
Font.whitelist = [
  "arial",
  "comic-sans",
  "courier-new",
  "georgia",
  "helvetica",
  "Inter",
  "lucida",
];
Quill.register(Font, true);

// Modules Object for React Quill
export const modules = (toolbarId) => ({
  toolbar: {
    container: `#${toolbarId}`,
    handlers: {
      undo: undoChange,
      redo: redoChange,
    },
  },
  history: {
    delay: 500,
    maxStack: 100,
    userOnly: true,
  },
});

// Formats Object for React Quill
export const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "align",
  "strike",
  "script",
  "blockquote",
  "background",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
  "color",
  "code-block",
];

// Quill Toolbar Component
const QuillToolbar = ({ toolbarId }) => {
  const location = useLocation();

  const isHiddenRoute =
  location.pathname === "/jobs/create-job" ||
  location.pathname.startsWith("/jobs/edit-job/") ||
  location.pathname === "/forum";

  if (!toolbarId) return null;

  return (
    <div id={toolbarId}>
      <span className="ql-formats">
        <button className="ql-bold" />
        <button className="ql-italic" />
        <button className="ql-underline" />
        <button className="ql-strike" />
      </span>
      <span className="ql-formats">
        <select className="ql-font">
          <option value="arial">Arial</option>
          <option value="comic-sans">Comic Sans</option>
          <option value="courier-new">Courier New</option>
          <option value="georgia">Georgia</option>
          <option value="helvetica">Helvetica</option>
          <option value="Inter" selected>
            Inter
          </option>
          <option value="lucida">Lucida</option>
        </select>
        <select className="ql-size">
          <option value="extra-small">Extra Small</option>
          <option value="small">Small</option>
          <option value="medium" selected>
            Medium
          </option>
          <option value="large">Large</option>
        </select>
        <select className="ql-header">
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
          <option value="4">Heading 4</option>
          <option value="5">Heading 5</option>
          <option value="6">Heading 6</option>
          <option value="" selected>
            Normal
          </option>
        </select>
      </span>
      <span className="ql-formats">
        <button className="ql-list" value="ordered" />
        <button className="ql-list" value="bullet" />
        <button className="ql-indent" value="-1" />
        <button className="ql-indent" value="+1" />
      </span>
      <span className="ql-formats">
        <button className="ql-script" value="super" />
        <button className="ql-script" value="sub" />
        <button className="ql-blockquote" />
        <button className="ql-direction" />
      </span>
      <span className="ql-formats">
        <select className="ql-align" />
        <select className="ql-color" />
        <select className="ql-background" />
      </span>
      <span className="ql-formats">
        <button className="ql-link" />
        <button className="ql-image" />
        <button className="ql-video" />
      </span>
      <span className="ql-formats">
        <button className="ql-formula" />
        <button className="ql-code-block" />
        <button className="ql-clean" />
      </span>
      <span className="ql-formats">
        <button className="ql-undo">
          <CustomUndo />
        </button>
        <button className="ql-redo">
          <CustomRedo />
        </button>
      </span>
      {!isHiddenRoute && (
        <span className="ql-formats">
          <a
            href="https://h5p.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="ql-h5p-button"
            style={{
              display: "inline-block",
              backgroundColor: "#333",
              color: "#fff",
              borderRadius: "4px",
              padding: "6px 10px",
              fontSize: "12px",
              textDecoration: "none",
            }}
          >
            Game
          </a>
        </span>
      )}
    </div>
  );
};

export default QuillToolbar;
