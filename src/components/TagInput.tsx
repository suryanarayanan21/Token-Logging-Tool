import { useEffect, useState } from "react";

type TagInputProps = {
  tagList: string[];
  initialList?: string[];
  onChange: (tags: string[]) => void;
}

type TagProps = {
  text: string;
  onClose?: () => void;
};

type SearchInputProps = {
  tagList: string[];
  onCreateTag: (tag: string) => void;
};

type SuggestionItemProps = {
  isSelected: boolean;
  onHovered: () => void;
  onClicked: (tag: string) => void;
  value: string;
  isSpecialItem?: boolean;
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

function SuggestionItem({
  isSelected,
  onHovered,
  onClicked,
  value,
  isSpecialItem,
}: SuggestionItemProps) {
  return (
    <div
      className={`flex flex-row gap-2 items-center p-1 rounded-sm cursor-pointer ${
        isSelected ? "bg-gray-200" : "bg-white"
      }`}
      onMouseEnter={onHovered}
      onMouseMove={onHovered}
      onMouseDown={(e) => {
        e.preventDefault();
        onClicked(value);
      }}
    >
      {isSpecialItem && <span className="text-nowrap">Create token </span>}
      <Tag text={value} />
      {isSelected && (
        <span className="text-nowrap text-sm text-gray-700">Hit ⏎</span>
      )}
    </div>
  );
}

function SearchInput({ tagList: fullTagList, onCreateTag }: SearchInputProps) {
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const [tagList, setTaglist] = useState<string[]>([]);
  const [selSuggestion, setSelSuggestion] = useState<number | undefined>();

  useEffect(() => {
    setTaglist(() => {
      if (value !== "")
        return fullTagList
          .filter((tag) => tag.toLowerCase().includes(value.toLowerCase()))
          .slice(0, 5);
      else return fullTagList.slice(0, 5);
    });
  }, [value]);

  const createTag = (tag: string) => {
    onCreateTag(tag);
    setSelSuggestion(undefined);
    setShowSuggestions(false);
    setValue("");
  };

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
            if (selSuggestion === undefined || selSuggestion === tagList.length)
              createTag(value);
            else createTag(tagList[selSuggestion]);
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
        placeholder="Add associated tokens"
      />
      {showSuggestions && (
        <div className="absolute top-10 left-2 flex flex-col bg-white border rounded-sm border-gray-700 min-w-50 p-2 gap-0.5">
          <div className="flex flex-row items-center border-b pb-2 mb-2 border-b-gray-400">
            <span className="text-sm text-gray-700 whitespace-pre">
              Select existing token or create
            </span>
          </div>
          {tagList.map((tag, index) => (
            <SuggestionItem
              isSelected={index === selSuggestion}
              onHovered={() => setSelSuggestion(index)}
              onClicked={(v) => {
                createTag(v);
              }}
              value={tag}
            />
          ))}
          <SuggestionItem
            isSelected={
              tagList.length === selSuggestion || selSuggestion === undefined
            }
            onHovered={() => setSelSuggestion(tagList.length)}
            onClicked={(v) => {
              createTag(v);
            }}
            value={value}
            isSpecialItem
          />
        </div>
      )}
    </div>
  );
}

function TagInput({ initialList, tagList, onChange }:TagInputProps) {
  const [tags, setTags] = useState<string[] | undefined>(initialList);

  const deleteTag = (index: number) => {
    const clone = tags ? [...tags] : undefined;
    clone?.splice(index, 1);
    setTags(clone);
  };

  return (
    <div className="flex flex-row flex-wrap items-center pl-3 pr-3 pt-2 pb-2 gap-2">
      {tags?.map((tag, index) => (
        <Tag text={tag} onClose={() => deleteTag(index)} />
      ))}
      <SearchInput
        tagList={tagList}
        onCreateTag={(tag) => {
          let clone = [...(tags ?? []), tag]
          onChange(clone);
          setTags(clone);
        }}
      />
    </div>
  );
}

export default TagInput;
