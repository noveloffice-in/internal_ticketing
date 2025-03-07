import React, { useState } from "react";
import { Editor } from "primereact/editor";


const TextEditor = () => {
    const [text, setText] = useState('');

    return (
        // <div className="w-full bg-white pt-4 pl-4 rounded-lg shadow-md mt-4">
        <div className="card bg-white mt-4 rounded-md shadow-md border-none ">
            <Editor value={text} onTextChange={(e) => setText(e.htmlValue)} style={{ height: '150px' }} />
        </div>

    )
}


export default TextEditor;
