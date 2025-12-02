import { useLoaderData } from "react-router";
import { useGetTokensQuery } from "../data/tokenApi";
import { TagEditForm } from "./components/TagEditForm";
import { useState } from "react";

export const EditTokens = () => {
  const pageData = useLoaderData();
  const { data } = useGetTokensQuery();
  const [_, setRefreshCounter] = useState(0);

  const refreshPage = () => {
    setRefreshCounter((r) => r + 1);
    alert("Refreshing page")
  };

  if (data === undefined) return <></>;

  return (
    <div className="flex flex-col gap-4 items-center justify-center p-10 w-dvw h-dvh">
      {data
        .filter((token) => token.author === pageData.author)
        .map((token) => (
          <TagEditForm key={`${token.id}-${token.version}`} token={token} refresh={refreshPage} />
        ))}
    </div>
  );
};
