import { TagEntryForm } from "./components/TagEntryForm";
import { useLoaderData } from "react-router";

export const NewTokens = () => {
  const data = useLoaderData();

  return (
    <div className="p-10 w-dvw h-dvh">
      <div className="flex flex-col w-full justify-center items-baseline gap-10">
        <p className="text-2xl text-gray-800">
          Hi {data.author}, please enter your tokens.
        </p>
        <TagEntryForm />
        <div>
          <button className="rounded-sm bg-black text-white pt-2 pb-2 pl-4 pr-4 cursor-pointer">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};
