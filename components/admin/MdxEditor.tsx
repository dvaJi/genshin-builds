import { useRef, useState } from "react";
import { FaBold, FaImage, FaTableCells } from "react-icons/fa6";

function MdxEditor() {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleBoldClick = () => {
    const selection = window?.getSelection()?.toString() ?? null;
    const start = textareaRef.current?.selectionStart ?? 0;
    const end = textareaRef.current?.selectionEnd ?? 0;

    if (selection) {
      const newText =
        text.substring(0, start) + `**${selection}**` + text.substring(end);
      setText(newText);
    } else {
      const insertText = "**" + " " + "**";
      const newText =
        text.substring(0, start) + insertText + text.substring(end);
      setText(newText);
      setTimeout(() => {
        if (textareaRef.current) {
          const current = textareaRef.current;
          current.selectionStart = start + 2;
          current.selectionEnd = start + 2;
          current.focus();
        }
      }, 0);
    }
  };

  const handleInsertImageClick = () => {
    const imageUrl = prompt("Enter image URL:");
    if (imageUrl) {
      const start = textareaRef.current?.selectionStart ?? 0;
      const insertText = "\n![](" + imageUrl + ")\n";
      const newText =
        text.substring(0, start) + insertText + text.substring(start);
      setText(newText);
    }
  };

  const handleInsertTableClick = () => {
    const rows = parseInt(prompt("Enter number of rows:") ?? "1", 10);
    const columns = parseInt(prompt("Enter number of columns:") ?? "2", 10);

    if (!isNaN(rows) && !isNaN(columns) && rows > 0 && columns > 0) {
      let tableMarkdown = "\n";

      // Headers
      for (let j = 0; j < columns; j++) {
        tableMarkdown += "| Header ";
      }
      tableMarkdown += "|\n";

      // Divider
      for (let j = 0; j < columns; j++) {
        tableMarkdown += "| --- ";
      }
      tableMarkdown += "|\n";

      // Rows
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
          tableMarkdown += "| Data ";
        }
        tableMarkdown += "|\n";
      }

      const start = textareaRef.current?.selectionStart ?? 0;
      const newText =
        text.substring(0, start) + tableMarkdown + text.substring(start);
      setText(newText);
    } else {
      alert(
        "Invalid input. Please enter positive numbers for rows and columns."
      );
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between border-b border-gray-600 px-3 py-2">
        <div className="flex flex-wrap items-center divide-gray-600 sm:divide-x">
          <div className="flex items-center space-x-1 sm:pr-4">
            <button onClick={(e) => e.preventDefault()}></button>
            <button
              onClick={handleBoldClick}
              type="button"
              className="cursor-pointer rounded p-2 text-gray-400 hover:bg-gray-600 hover:text-white"
            >
              <FaBold className="h-5 w-5" />
            </button>
            <button
              onClick={handleInsertTableClick}
              type="button"
              className="cursor-pointer rounded p-2 text-gray-400 hover:bg-gray-600 hover:text-white"
            >
              <FaTableCells className="h-5 w-5" />
            </button>
            <button
              onClick={handleInsertImageClick}
              type="button"
              className="cursor-pointer rounded p-2 text-gray-400 hover:bg-gray-600 hover:text-white"
            >
              <FaImage className="h-5 w-5" />
            </button>
            
          </div>
          <div className="flex flex-wrap items-center space-x-1 sm:pl-4">
            {/* Add upload image */}
            {/* <button
              onClick={handleInsertImageClick}
              type="button"
              className="cursor-pointer rounded p-2 text-gray-400 hover:bg-gray-600 hover:text-white"
            >
              <FaUpload className="h-5 w-5" />
            </button> */}
            {/* Add components */}
          </div>
        </div>
      </div>
      <div className="rounded-b-lg bg-zinc-800 px-4 py-2">
        <textarea
          ref={textareaRef}
          rows={8}
          onChange={(e) => setText(e.target.value)}
          value={text}
          className="block w-full border-0 bg-zinc-800 px-0 text-sm text-white placeholder-zinc-400 focus:ring-0"
          placeholder="Write an article..."
          required
        ></textarea>
      </div>
    </div>
  );
}

export default MdxEditor;
