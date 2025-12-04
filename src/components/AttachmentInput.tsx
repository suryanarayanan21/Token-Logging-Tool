import { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { FaFile } from "react-icons/fa";
import { FaRegFilePdf } from "react-icons/fa6";
import { FaRegImage } from "react-icons/fa6";
import { FiVideo } from "react-icons/fi";
import { MdOutlineAudiotrack } from "react-icons/md";
import { IoCloseOutline } from "react-icons/io5";
import { MoonLoader } from "react-spinners";
import type { Attachment } from "../../types/Token";

type AttachmentInputProps = {
  initialList: Attachment[];
  onChange: (list: Attachment[]) => void;
};

type LoadingAttachment = Attachment & {
  loading: boolean;
};

type AttachmentDisplayProps = {
  filename: string;
  mimetype: string;
  onDelete: () => void;
  loading: boolean;
};

type FileIconProps = {
  mimetype: string;
  loading: boolean;
};

const FileIcon = ({ mimetype, loading }: FileIconProps) => {
  if (loading)
    return <MoonLoader loading={loading} color="#444444" size={24} />;
  if (mimetype === "application/pdf") return <FaRegFilePdf />;
  if (mimetype.startsWith("video")) return <FiVideo />;
  if (mimetype.startsWith("audio")) return <MdOutlineAudiotrack />;
  if (mimetype.startsWith("image")) return <FaRegImage />;
  else return <FaFile />;
};

const AttachmentDisplay = ({
  filename,
  mimetype,
  onDelete,
  loading,
}: AttachmentDisplayProps) => {
  return (
    <div className="flex flex-row items-center gap-1.5 bg-gray-300 rounded-md pl-4 pr-4 pt-2 pb-2">
      <FileIcon mimetype={mimetype} loading={loading} />
      <span className="max-w-32 text-ellipsis overflow-clip whitespace-nowrap">
        {filename}
      </span>
      <button className="cursor-pointer" onClick={onDelete}>
        <IoCloseOutline />
      </button>
    </div>
  );
};

export const AttachmentInput = ({
  initialList,
  onChange,
}: AttachmentInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [attachments, setAttachments] = useState<LoadingAttachment[]>(
    initialList.map((a) => ({ ...a, loading: false }))
  );

  useEffect(() => {
    if (!attachments.find((a) => a.loading)) onChange(attachments);
  }, [attachments]);

  const uploadAttachment = async (file: File, index: number) => {
    const formdata = new FormData();
    formdata.append("file", file);

    const response = await fetch("/api/files", {
      method: "POST",
      body: formdata,
    });

    const { url } = await response.json();

    console.log("url received");

    setAttachments((a) => {
      const clone = [...a];
      clone[index].loading = false;
      clone[index].url = url;
      return clone;
    });
  };

  return (
    <div className="flex flex-row items-center gap-2 flex-wrap">
      <input
        onChange={async (e) => {
          const files = e.target.files;
          if (files && files.length > 0) {
            const attachment: LoadingAttachment = {
              name: files[0].name,
              mimetype: files[0].type,
              url: "",
              loading: true,
            };

            const index = attachments.length;

            setAttachments((a) => {
              return [...a, attachment];
            });

            await uploadAttachment(files[0], index);
          }
        }}
        type="file"
        ref={inputRef}
        className="hidden"
      />

      {attachments.map((attachment, index) => (
        <AttachmentDisplay
          key={attachment.name}
          filename={attachment.name}
          mimetype={attachment.mimetype}
          loading={attachment.loading}
          onDelete={() => {
            const clone = [...attachments];
            clone.splice(index, 1);
            setAttachments(clone);
          }}
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
