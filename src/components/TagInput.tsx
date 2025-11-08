import { useEffect, useRef, useState } from "react";

type TagProps = {
  text: string;
  onClose?: () => void;
};

type SearchInputProps = {
  tagList: string[];
  onCreateTag: (tag: string) => void;
};

function Tag({ text, onClose }: TagProps) {
  return (
    <div className="flex flex-row justify-center items-center pr-2.5 pl-2.5 pt-1 pb-1 bg-blue-900 text-white text-sm rounded-sm gap-1.5 w-fit text-nowrap">
      {text}
      {onClose && (
        <div className="w-fit text-white cursor-pointer" onClick={onClose}>
          🗙
        </div>
      )}
    </div>
  );
}

function SearchInput({ tagList, onCreateTag }: SearchInputProps) {
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const [selSuggestion, setSelSuggestion] = useState<number | undefined>();

  return (
    <div className="relative">
      <input
        value={value}
        onFocus={(e) => {
          if (e.target.value !== "") setShowSuggestions(true);
        }}
        onBlur={() => setShowSuggestions(false)}
        onChange={(e) => {
          if (e.target.value !== "") setShowSuggestions(true);
          else setShowSuggestions(false);
          setValue(e.target.value);
          setSelSuggestion(undefined);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setShowSuggestions(false);
            if (selSuggestion === undefined || selSuggestion === tagList.length)
              onCreateTag(value);
            else onCreateTag(tagList[selSuggestion]);
            setValue("");
          }

          if (e.key === "ArrowDown") {
            setSelSuggestion((s) =>
              s !== undefined ? (s + 1) % (tagList.length + 1) : 0
            );
            e.preventDefault();
          }

          if (e.key === "ArrowUp") {
            setSelSuggestion((s) =>
              s !== undefined ? (s - 1 < 0 ? tagList.length : s - 1) : 0
            );
            e.preventDefault();
          }
        }}
        className="outline-0"
        type="text"
        placeholder="Add tokens"
      />
      {showSuggestions && (
        <div className="absolute top-10 left-2 flex flex-col bg-white border rounded-sm border-gray-700 min-w-50 p-2 gap-0.5">
          {tagList.map((tag, index) => (
            <div
              className={`flex flex-row gap-2 items-center p-1 rounded-sm cursor-pointer ${
                index === selSuggestion ? "bg-gray-200" : "bg-white"
              }`}
              onMouseEnter={() => setSelSuggestion(index)}
              onMouseMove={() => setSelSuggestion(index)}
              onMouseDown={(e) => {
                e.preventDefault();
                onCreateTag(tagList[index]);
                setSelSuggestion(undefined);
                setShowSuggestions(false);
                setValue("");
              }}
            >
              <Tag text={tag} />
              {selSuggestion === index && (
                <span className="text-nowrap text-sm text-gray-700">Hit ⏎</span>
              )}
            </div>
          ))}
          <div
            className={`flex flex-row gap-2 items-center mt-2 p-1 pl-1.5 rounded-sm cursor-pointer ${
              tagList.length === selSuggestion ? "bg-gray-200" : "bg-white"
            }`}
            onMouseEnter={() => setSelSuggestion(tagList.length)}
            onMouseMove={() => setSelSuggestion(tagList.length)}
            onMouseDown={(e) => {
                e.preventDefault();
                onCreateTag(value);
                setSelSuggestion(undefined);
                setShowSuggestions(false);
                setValue("");
              }}
          >
            <span className="text-nowrap">Create token</span>{" "}
            <Tag text={value} />
            {(selSuggestion === tagList.length ||
              selSuggestion === undefined) && (
              <span className="text-nowrap text-sm text-gray-700">Hit ⏎</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function TagInput() {
  const [tags, setTags] = useState<string[] | undefined>([
    "Animal",
    "Birthday",
  ]);

  const deleteTag = (index: number) => {
    const clone = tags ? [...tags] : undefined;
    clone?.splice(index, 1);
    setTags(clone);
  };

  return (
    <div className="flex flex-row items-center pl-3 pr-3 pt-2 pb-2 gap-2">
      {tags?.map((tag, index) => (
        <Tag text={tag} onClose={() => deleteTag(index)} />
      ))}
      <SearchInput
        tagList={["Banana", "Apple", "Pie"]}
        onCreateTag={(tag) => {
          setTags([...(tags ?? []), tag]);
        }}
      />
    </div>
  );
}

export default TagInput;
