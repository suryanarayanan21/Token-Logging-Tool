import { useEffect, useState } from "react";
import TagInput from "./TagInput";
import { FaPlus } from "react-icons/fa6";
import { IoCloseOutline } from "react-icons/io5";
import {
  useGetAllAssociatedTokensQuery,
  useGetTokensQuery,
} from "../../data/tokenApi";
import type { Token } from "../../types/Token";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import Box from '@mui/material/Box';

export type TokenEntry = Pick<
  Token,
  "id" | "name" | "associatedTokens" | "course"
>;

type TagEntryFormProps = {
  onChange: (tokens: TokenEntry[]) => void;
};

type AutoCompleteOption = {
  value: string;
  id: number;
  title: string;
  subtext: string;
};

const filter = createFilterOptions<AutoCompleteOption>();

export const TagEntryForm = ({ onChange }: TagEntryFormProps) => {
  const [tokenIdSeed, setTokenIdSeed] = useState<number>(1);
  const [tokens, setTokens] = useState<TokenEntry[]>([
    {
      id: "0",
      name: "",
      course: "",
      associatedTokens: [],
    },
  ]);

  useEffect(() => {
    onChange(tokens);
  }, [tokens]);

  const { data: tagList, isLoading } = useGetAllAssociatedTokensQuery();

  const { data: tokenDB, isLoading: isTokensLoading } = useGetTokensQuery();

  const getNewlyAddedTags = () => {
    return tokens.map((token) => token.associatedTokens).flat();
  };

  return (
    !isLoading &&
    !isTokensLoading && (
      <div className="rounded-xl border border-gray-400 w-full p-4">
        <div className="border-b pb-4 border-b-gray-400">
          <table className="w-full table-fixed">
            {tokens.map((token, index) => (
              <tr
                key={`${token.id}`}
                className={
                  index < tokens.length - 1 ? `border-b border-b-gray-400` : ""
                }
              >
                <td className="border-r border-r-gray-400 pb-2 pt-2 w-56 min-w-32">
                  <div className="flex flex-row items-center pl-2 pr-2">
                    <Autocomplete
                      options={
                        tokenDB
                          ? tokenDB?.map((t, i) => ({
                              id: i + 1,
                              value: t.name,
                              title: t.name,
                              subtext: "subtext",
                            }))
                          : []
                      }
                      filterOptions={(options, state) => {
                        const filtered = filter(options, state);
                        filtered.unshift({
                          id: 0,
                          value: state.inputValue,
                          title: `New Token: ${state.inputValue}`,
                          subtext: "",
                        });

                        return filtered;
                      }}
                      onChange={(
                        _e: any,
                        value: AutoCompleteOption | null
                      ) => {
                        if(value?.id !== 0){
                          alert("Navigate to edit tab");
                        }
                      }}
                      getOptionKey={o => o.id}
                      getOptionLabel={o => o.value}
                      renderInput={(params) => <TextField {...params} />}
                      renderOption={(props, option, _state, _ownerState) => {
                        const { key, ...optionProps } = props;
                        return <Box
                          key={key}
                          component='li'
                          {...optionProps}
                        >
                          {option.title}
                        </Box>
                      }}
                      clearOnBlur
                      clearIcon={false}
                      sx={{width: '100%'}}
                    />
                    <button
                      className="h-full cursor-pointer text-gray-500 hover:text-gray-800"
                      onClick={() => {
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
                <td className="border-r border-r-gray-400 pb-2 pt-2 w-56 min-w-32">
                  <div className="flex flex-row items-center pl-2 pr-2">
                    <input
                      className="w-full outline-0"
                      type="text"
                      placeholder="Course"
                      value={token.course}
                      onChange={(e) => {
                        setTokens((t) => {
                          const clone = [...t];
                          clone[index].course = e.target.value;
                          return clone;
                        });
                      }}
                    />
                  </div>
                </td>
                <td className="pb-2 pt-2">
                  <div className="w-full flex flex-row items-center justify-start">
                    <TagInput
                      tagList={[
                        ...new Set([
                          ...(tagList ?? []),
                          ...getNewlyAddedTags(),
                        ]),
                      ]}
                      onChange={(tags) => {
                        setTokens((t) => {
                          const clone = [...t];
                          clone[index].associatedTokens = [...tags];
                          return clone;
                        });
                      }}
                    />
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
              clone.push({
                id: `${tokenIdSeed}`,
                name: "",
                course: "",
                associatedTokens: [],
              });
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
    )
  );
};
