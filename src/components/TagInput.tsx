import { useState } from "react";

type TagProps = {
  text: string;
};

type TransformingInputProps = {
  index: number;
  setTags: React.Dispatch<React.SetStateAction<string[] | undefined>>;
  isFocused: boolean;
  setFocusIndex: React.Dispatch<React.SetStateAction<number>>;
  tagLength: number;
};

function Tag({ text }: TagProps) {
  return (
    <div className="flex flex-row justify-center items-center pr-2.5 pl-2.5 pt-1 pb-1 bg-amber-900 text-white text-sm rounded-sm">
      {text}
    </div>
  );
}

function TransformingInput({
  index,
  setTags,
  isFocused,
  setFocusIndex,
  tagLength
}: TransformingInputProps) {
  const [value, setValue] = useState<string>("");

  return (
    <div className="flex flex-row items-center justify-center">
      <span className="whitespace-pre">{value}</span>
      <input
        className="border-0 outline-0 w-0.5 text-white caret-black"
        type="text"
        autoFocus={isFocused}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            // Add input to tags
            setTags((tags) => {
              const clone = tags ? [...tags] : undefined;
              clone?.splice(index, 0, value);
              return clone;
            });

            // Reset focus
            setFocusIndex(index + 1);
          }

          if (e.key === "Backspace") {
            // Remove previous entry from tags
            if (value === "") {
              if (index > 0) {
                setTags((tags) => {
                  const clone = tags ? [...tags] : undefined;
                  clone?.splice(index - 1, 1);
                  return clone;
                });

                // Reset focus
                setFocusIndex(index - 1);
              }
            }
          }

          if(e.key === "ArrowLeft" && index > 0){
            setFocusIndex(i => i-1);
          }

          if(e.key === "ArrowRight" && index < tagLength) {
            setFocusIndex(i => i+1);
          }
        }}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
    </div>
  );
}

function TagInput() {
  const [tags, setTags] = useState<string[] | undefined>([
    "Animal",
    "Birthday",
  ]);

  const [focusIndex, setFocusIndex] = useState<number>(tags?.length ?? 0);

  return (
    <div className="flex flex-row pl-3 pr-3 pt-2 pb-2 gap-1">
      {tags?.map((tag, index) => (
        <>
          <TransformingInput
            key={Math.random()}
            index={index}
            setTags={setTags}
            isFocused={index == focusIndex}
            setFocusIndex={setFocusIndex}
            tagLength={tags.length}
          />
          <Tag text={tag} />
        </>
      ))}
      <TransformingInput
        key={Math.random()}
        index={tags?.length ?? 0}
        setTags={setTags}
        isFocused={(tags?.length ?? 0) == focusIndex}
        setFocusIndex={setFocusIndex}
        tagLength={tags?.length ?? 0}
      />
    </div>
  );
}

export default TagInput;
