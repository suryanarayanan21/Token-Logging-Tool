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

type TagEditFormProps = {
  token: Token;
};

export const TagEditForm = ({ token }: TagEditFormProps) => {
  const [name, setName] = useState(token.name);
  const [course, setCourse] = useState(token.course);
  const [attachments] = useState(token.attachments);
  const [tags, setTags] = useState(token.associatedTokens);
  const [isModified, setIsModified] = useState(false);

  const { data: tagList } = useGetAllAssociatedTokensQuery();
  const [updateToken] = useUpdateTokenMutation();
  const [deleteToken] = useDeleteTokenMutation();

  return (
    <div className="rounded-xl border border-gray-400 w-full p-4">
      <table className="w-full">
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
          <td className="border-r border-r-gray-400 pb-2 pt-2 grow">
            <div className="w-100 flex flex-row items-center justify-start">
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
          <td className="pb-2 pt-2">
            <div className="flex flex-row items-center pl-2 pr-2 gap-1">
              <button
                className="h-full cursor-pointer text-gray-500 hover:text-gray-800"
                onClick={async () => {
                  await deleteToken(token.id);
                }}
              >
                <MdOutlineDeleteOutline />
              </button>
              <button
                className="h-full cursor-pointer text-gray-500 hover:text-gray-800"
                disabled={!isModified}
                onClick={async () => {
                  alert("Editing Token");
                  await updateToken({
                    ...token,
                    name,
                    course,
                    associatedTokens: tags,
                    attachments,
                  });
                }}
              >
                <FaCheck />
              </button>
            </div>
          </td>
        </tr>
      </table>
      <AttachmentInput />
    </div>
  );
};
