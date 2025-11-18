import { useState } from "react";
import TagInput from "./TagInput";
import { FaPlus } from "react-icons/fa6";
import { IoCloseOutline } from "react-icons/io5";

type TokenEntry = {
  id: string;
  name?: string;
  associatedTokens: string[];
};

export const TagEntryForm = () => {
  const [tokenIdSeed, setTokenIdSeed] = useState<number>(1);
  const [tokens, setTokens] = useState<TokenEntry[]>([
    {
      id: "0",
      name: "",
      associatedTokens: [],
    },
  ]);

  return (
    <div className="rounded-xl border border-gray-400 w-full p-4">
      <div className="border-b pb-4 border-b-gray-400">
        <table className="w-full">
          {tokens.map((token, index) => (
            <tr
              key={`${token.id}`}
              className={
                index < tokens.length - 1 ? `border-b border-b-gray-400` : ""
              }
            >
              <td className="border-r border-r-gray-400 pb-2 pt-2 w-56">
                <div className="flex flex-row items-center pl-2 pr-2">
                  <input
                    className="w-full outline-0"
                    type="text"
                    value={token.name}
                    onChange={(e) => {
                      setTokens((t) => {
                        const clone = [...t];
                        clone[index].name = e.target.value;
                        return clone;
                      });
                    }}
                    placeholder="Token Name"
                  />
                  <button
                    className="h-full cursor-pointer text-gray-500 hover:text-gray-800"
                    onClick={(e) => {
                      setTokens((t) => {
                        const clone = [...t];
                        clone.splice(index, 1);
                        return clone;
                      });
                    }}
                  >
                    <IoCloseOutline />
                  </button>
                </div>
              </td>
              <td className="pb-2 pt-2 grow">
                <div className="w-100 flex flex-row items-center justify-start">
                  <TagInput />
                </div>
              </td>
            </tr>
          ))}
        </table>
      </div>
      <button
        className="mt-5 cursor-pointer"
        onClick={() => {
          setTokens((t) => {
            const clone = [...t];
            clone.push({ id: `${tokenIdSeed}`, associatedTokens: [] });
            return clone;
          });
          setTokenIdSeed(tokenIdSeed + 1);
        }}
      >
        <div className="flex flex-row gap-1.5 items-center text-gray-500 hover:text-gray-800">
          <FaPlus />
          New Token
        </div>
      </button>
    </div>
  );
};
