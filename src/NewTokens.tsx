import { useState } from "react";
import { AttachmentInput } from "./components/AttachmentInput";
import { TagEntryForm, type TokenEntry } from "./components/TagEntryForm";
import { MdOutlineEdit } from "react-icons/md";
import { useLoaderData } from "react-router";
import { useAddTokenMutation } from "../data/tokenApi";
import { useNavigate } from "react-router";

export const NewTokens = () => {
  const data = useLoaderData();
  const [tokens, setTokens] = useState<TokenEntry[]>([]);
  const [addToken] = useAddTokenMutation();
  const navigate = useNavigate();

  return (
    <div className="p-10 w-dvw h-dvh">
      <div className="flex flex-col w-full justify-center items-baseline gap-4">
        <button className="flex flex-row gap-2 justify-center items-center text-gray-500 cursor-pointer" onClick={() => {
          navigate(`/edit/${data.author}`)
        }}>
          <MdOutlineEdit />
          <span>Edit tokens</span>
        </button>
        <p className="text-2xl mb-4 text-gray-800">
          Hi {data.author}, please enter your tokens.
        </p>
        <TagEntryForm
          onChange={(tokens) => {
            setTokens(tokens);
          }}
        />
        <AttachmentInput />
        <div>
          <button
            className="rounded-sm bg-black text-white pt-2 pb-2 pl-4 pr-4 cursor-pointer"
            onClick={async () => {
              const jobs = tokens.map(async ({ id, ...token }) =>
                await addToken({
                  ...token,
                  attachments: [],
                  author: data.author,
                })
              );

              await Promise.all(jobs);
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};
