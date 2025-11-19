import { useRef, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { FaFile } from "react-icons/fa";
import { FaRegFilePdf } from "react-icons/fa6";
import { FiVideo } from "react-icons/fi";
import { MdOutlineAudiotrack } from "react-icons/md";

type AttachmentDisplayProps = {
  filename: string;
  mimetype: string;
};

type FileIconProps = {
  mimetype: string;
};

const FileIcon = ({ mimetype }: FileIconProps) => {
  if (mimetype === "application/pdf") return <FaRegFilePdf />;
  if (mimetype.startsWith("video")) return <FiVideo />;
  if (mimetype.startsWith("audio")) return <MdOutlineAudiotrack />;
  else return <FaFile />;
};

const AttachmentDisplay = ({ filename, mimetype }: AttachmentDisplayProps) => {
  return (
    <div className="flex flex-row items-center gap-1.5 bg-gray-300 rounded-md pl-4 pr-4 pt-2 pb-2">
      <FileIcon mimetype={mimetype} />
      <span className="max-w-32 text-ellipsis overflow-clip whitespace-nowrap">
        {filename}
      </span>
    </div>
  );
};

export const AttachmentInput = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [attachments, setAttachments] = useState<File[]>([]);

  return (
    <div className="flex flex-row items-center gap-2 flex-wrap">
      <input
        onChange={(e) => {
          const files = e.target.files;
          if (files && files.length > 0) {
            setAttachments((a) => {
              return [...a, ...files];
            });
          }
        }}
        type="file"
        ref={inputRef}
        className="hidden"
      />

      {attachments.map((attachment) => (
        <AttachmentDisplay
          filename={attachment.name}
          mimetype={attachment.type}
        />
      ))}

      <button
        onClick={() => {
          if (inputRef) {
            inputRef.current?.click();
          }
        }}
        className="flex flex-row items-center justify-center rounded-full border border-gray-400 text-gray-700 pl-4 pr-4 pb-2 pt-2 gap-1.5 hover:text-gray-900 cursor-pointer"
      >
        <FaPlus />
        <span>Add attachment</span>
      </button>
    </div>
  );
};
