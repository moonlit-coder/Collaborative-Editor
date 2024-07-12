import React, { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import io from "socket.io-client";
import { useParams } from "react-router-dom";

function QuillEditor() {
  const { docId } = useParams();
  const [socket, setSocket] = useState(null);
  const [quill, setQuill] = useState(null);
  const server = process.env.REACT_APP_SERVER;
  useEffect(() => {
    const sk = io(server);
    setSocket(sk);

    return () => {
      sk.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket == null || quill == null) return;

    const saveInterval = setInterval(() => {
      socket.emit("save-document", quill.getContents());
    }, 2000);

    return () => clearInterval(saveInterval);
  }, [socket, quill]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    socket.once("load-document", (data) => {
      quill.setContents(data);
      quill.enable();
    });

    socket.emit("get-document", docId);
  }, [socket, quill, docId]);

  useEffect(() => {
    if (socket === null || quill === null) return;

    const func = (delta, oldDelta, source) => {
      if (source !== "user") return;
      socket.emit("send-changes", delta);
    };

    quill.on("text-change", func);

    return () => {
      quill.off("text-change", func);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (socket === null || quill === null) return;
  
    const receiveChangesHandler = (delta) => {
      quill.updateContents(delta);
    };
  
    socket.on("receive-changes", receiveChangesHandler);
  
    return () => {
      socket.off("receive-changes", receiveChangesHandler);
    };
  }, [socket, quill]);
  

  const toolbarOptions = [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote", "code-block"],

    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    [{ direction: "rtl" }], // text direction

    [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],

    ["clean"],
  ];
  const ref = useCallback(
    (wrapper) => {
      if (wrapper === null || quill !== null) return;

      wrapper.innerHTML = "";
      const editor = document.createElement("div");
      wrapper.append(editor);

      const q = new Quill(editor, {
        theme: "snow",
        modules: { toolbar: toolbarOptions },
      });
      q.disable();
      q.setText("Loading...");
      setQuill(q);
    },
    [quill, setQuill, toolbarOptions]
  );

  return <div className="editor-cover" ref={ref}></div>;
}

export default QuillEditor;
