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

type TagEditFormProps = {
  token: Token;
  toast: typeof toast;
};

export const TagEditForm = ({ token }: TagEditFormProps) => {
  const [name, setName] = useState(token.name);
  const [course, setCourse] = useState(token.course);
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
            <div className="flex flex-row items-center pl-2 pr-2">
              <input
                className="w-full outline-0"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setIsModified(true);
                }}
                placeholder="Token Name"
              />
            </div>
          </td>
          <td className="border-r border-r-gray-400 pb-2 pt-2 w-56 min-w-32">
            <div className="flex flex-row items-center pl-2 pr-2">
              <input
                className="w-full outline-0"
                type="text"
                placeholder="Course"
                value={course}
                onChange={(e) => {
                  setCourse(e.target.value);
                  setIsModified(true);
                }}
              />
            </div>
          </td>
          <td className="border-r border-r-gray-400 pb-2 pt-2">
            <div className="w-full flex flex-row items-center justify-start">
              <TagInput
                initialList={token.associatedTokens}
                tagList={tagList ?? []}
                onChange={(tags) => {
                  setIsModified(true);
                  setTags(tags);
                }}
              />
            </div>
          </td>
          <td className="pb-2 pt-2 w-20">
            <div className="flex flex-row items-center pl-2 pr-2 gap-1">
              <button
                className="flex flex-row justify-center items-center h-8 w-8 rounded-full bg-gray-400 cursor-pointer text-gray-500 hover:text-gray-800"
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
                className="flex flex-row justify-center items-center h-8 w-8 rounded-full bg-gray-400 cursor-pointer text-gray-500 hover:text-gray-800"
                disabled={!isModified}
                onClick={async () => {
                  await toast.promise(
                    updateToken({
                      ...token,
                      name,
                      course,
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
