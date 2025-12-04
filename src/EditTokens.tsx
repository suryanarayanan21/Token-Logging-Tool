import { useLoaderData } from "react-router";
import { useGetTokensQuery } from "../data/tokenApi";
import { TagEditForm } from "./components/TagEditForm";
import { ToastContainer, toast } from "react-toastify";

export const EditTokens = () => {
  const pageData = useLoaderData();
  const { data } = useGetTokensQuery();

  if (data === undefined) return <></>;

  return (
    <div className="flex flex-col gap-4 items-center justify-center p-10 w-dvw h-dvh">
      {data
        .filter((token) => token.author === pageData.author)
        .map((token) => (
          <TagEditForm toast={toast} key={`${token.id}-${token.version}`} token={token} />
        ))}

      <ToastContainer />
    </div>
  );
};
