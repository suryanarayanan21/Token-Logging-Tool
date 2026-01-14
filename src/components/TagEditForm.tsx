import { useState } from "react";
import type { Token } from "../../types/Token";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";
import TagInput from "./TagInput";
import {
  useDeleteTokenMutation,
  useGetAllAssociatedTokensQuery,
  useUpdateTokenMutation,
} from "../../data/tokenApi";
import { AttachmentInput } from "./AttachmentInput";
import { toast } from "react-toastify";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

type TagEditFormProps = {
  token: Token;
  toast: typeof toast;
};

export const TagEditForm = ({ token }: TagEditFormProps) => {
  const [name, setName] = useState(token.name);
  const [course, setCourse] = useState(token.course);
  const [chapter, setChapter] = useState(token.learningChapter);
  const [tokenType, setTokenType] = useState(token.type);
  const [attachments, setAttachments] = useState(token.attachments);
  const [tags, setTags] = useState(token.associatedTokens);
  const [isModified, setIsModified] = useState(false);

  const { data: tagList } = useGetAllAssociatedTokensQuery();
  const [updateToken] = useUpdateTokenMutation();
  const [deleteToken] = useDeleteTokenMutation();

  return (
    <div className="flex flex-col rounded-xl border border-gray-400 w-full p-4 gap-4">
      <table className="w-full table-fixed">
        <tr key={token.id}>
          <td className="border-r border-r-gray-400 pb-2 pt-2 w-56 min-w-32">
            <div className="flex flex-col items-start justify-center pl-2 pr-2 gap-1">
              <span className="text-sm text-gray-600">Name</span>
              <input
                className="w-full outline-0"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (token.name !== e.target.value) {
                    setIsModified(true);
                  } else {
                    setIsModified(false);
                  }
                }}
                placeholder="Token Name"
              />
            </div>
          </td>
          <td className="border-r border-r-gray-400 pb-2 pt-2 w-56 min-w-32">
            <div className="flex flex-col items-start justify-center gap-1 pl-2 pr-2">
              <span className="text-sm text-gray-600">Type</span>
              <TextField
                value={tokenType}
                select
                onChange={(e) => {
                  setTokenType(() => {
                    if (e.target.value === "Domain Specific") {
                      return "Domain Specific";
                    } else {
                      return "Domain General";
                    }
                  });

                  if (token.type !== e.target.value) {
                    setIsModified(true);
                  } else {
                    setIsModified(false);
                  }
                }}
                sx={{
                  "& fieldset": { border: "none" },
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": { border: "none" },
                    "&.Mui-focused fieldset": { border: "none" },
                  },
                }}
              >
                <MenuItem value={"Domain General"}>{"Domain General"}</MenuItem>
                <MenuItem value={"Domain Specific"}>
                  {"Domain Specific"}
                </MenuItem>
              </TextField>
            </div>
          </td>
          <td className="border-r border-r-gray-400 pb-2 pt-2">
            <div className="w-full flex flex-col items-start justify-center gap-1">
              <span className="block pl-3 text-sm text-gray-600">Associated Tokens</span>
              <TagInput
                initialList={token.associatedTokens}
                tagList={tagList ?? []}
                onChange={(tags) => {
                  setIsModified(false);
                  for (const tag of token.associatedTokens) {
                    if (!tags.includes(tag)) {
                      setIsModified(true);
                      break;
                    }
                  }
                  setTags(tags);
                }}
              />
            </div>
          </td>
          <td className="border-r border-r-gray-400 pb-2 pt-2 w-56 min-w-32">
            <div className="flex flex-col items-start justify-center gap-1 pl-2 pr-2">
              <span className="text-sm text-gray-600">Learning Chapter</span>
              <input
                className="w-full outline-0"
                type="text"
                placeholder="Chapter"
                value={token.learningChapter}
                onChange={(e) => {
                  setChapter(e.target.value);
                  if (token.learningChapter !== e.target.value) {
                    setIsModified(true);
                  } else {
                    setIsModified(false);
                  }
                }}
              />
            </div>
          </td>
          <td className="border-r border-r-gray-400 pb-2 pt-2 w-56 min-w-32">
            <div className="flex flex-col items-start justify-center gap-1 pl-2 pr-2">
              <span className="text-sm text-gray-600">Course</span>
              <input
                className="w-full outline-0"
                type="text"
                placeholder="Course"
                value={course}
                onChange={(e) => {
                  setCourse(e.target.value);
                  if (token.course !== e.target.value) {
                    setIsModified(true);
                  } else {
                    setIsModified(false);
                  }
                }}
              />
            </div>
          </td>
          <td className="pb-2 pt-2 w-20">
            <div className="flex flex-row items-center pl-2 pr-2 gap-1">
              <button
                className={`flex flex-row justify-center items-center h-10 min-w-10 rounded-full bg-gray-100 cursor-pointer text-gray-500 hover:text-gray-800`}
                onClick={async () => {
                  await toast.promise(
                    deleteToken(token.id),
                    {
                      pending: " Deleting token...",
                      success: " Deleted token!",
                    },
                    {
                      position: "top-center",
                    }
                  );
                }}
              >
                <MdOutlineDeleteOutline />
              </button>
              <button
                className={`flex flex-row justify-center items-center h-10 min-w-10 rounded-full bg-gray-100 cursor-pointer ${
                  isModified ? "text-gray-500" : "text-gray-300"
                } ${isModified ? "hover:text-gray-800" : ""}`}
                disabled={!isModified}
                onClick={async () => {
                  await toast.promise(
                    updateToken({
                      ...token,
                      name,
                      course,
                      type: tokenType,
                      learningChapter: chapter,
                      associatedTokens: tags,
                      attachments,
                    }),
                    {
                      pending: " Updating token...",
                      success: " Token updated!",
                    },
                    {
                      position: "top-center",
                    }
                  );

                  setIsModified(false);
                }}
              >
                <FaCheck />
              </button>
            </div>
          </td>
        </tr>
      </table>
      <AttachmentInput
        initialList={token.attachments}
        onChange={(attachments) => {
          setAttachments(attachments);
          setIsModified(true);
        }}
      />
    </div>
  );
};
