import { useState } from "react";
import { AttachmentInput } from "./components/AttachmentInput";
import { TagEntryForm, type TokenEntry } from "./components/TagEntryForm";
import { useLoaderData } from "react-router";
import { useAddTokenMutation } from "../data/tokenApi";

export const NewTokens = () => {
  const data = useLoaderData();
  const [tokens, setTokens] = useState<TokenEntry[]>([]);
  const [addToken] = useAddTokenMutation();

  return (
    <div className="p-10 w-dvw h-dvh">
      <div className="flex flex-col w-full justify-center items-baseline gap-4">
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
            onClick={() => {
              tokens.forEach(({ id, ...token }) =>
                addToken({
                  ...token,
                  attachments: [],
                  author: data.author,
                })
              );
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};
