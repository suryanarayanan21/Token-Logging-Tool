import { useLocation } from "react-router";
import { useGetTokensQuery } from "../data/tokenApi";
import { TagEditForm } from "./components/TagEditForm";
import { ToastContainer, toast } from "react-toastify";
import { useState } from "react";

import {
  FilterBar,
  getEmptyFilter,
  type TokenFilter,
} from "./components/FilterBar";
import type { Token } from "../types/Token";

const shouldShowToken = (token: Token, filter: TokenFilter) => {
  if (
    (filter.nameFilter == "" || token.name.includes(filter.nameFilter)) &&
    (filter.authorFilter.length === 0 ||
      filter.authorFilter.includes(token.author)) &&
    (filter.chapterFilter.length === 0 ||
      filter.chapterFilter.includes(token.learningChapter)) &&
    (filter.courseFilter.length === 0 ||
      filter.courseFilter.includes(token.course)) &&
    (filter.typeFilter.length === 0 || filter.typeFilter.includes(token.type))
  ) {
    return true;
  } else {
    return false;
  }
};

export const EditTokens = () => {
  const { state: initialFilter } = useLocation();
  const { data } = useGetTokensQuery();

  const [filter, setFilter] = useState<TokenFilter>(
    initialFilter ?? getEmptyFilter()
  );

  if (data === undefined) return <></>;

  return (
    <div className="flex flex-col gap-4 items-center justify-start p-10 w-dvw h-dvh">
      <p className="text-2xl mb-4 text-gray-800">
        You can view / edit existing tokens here.
      </p>

      <FilterBar
        filter={filter}
        setFilter={setFilter}
        authors={[...new Set(data.map((t) => t.author))]}
        tokenTypes={[...new Set(data.map((t) => t.type))]}
        chapters={[...new Set(data.map((t) => t.learningChapter))]}
        courses={[...new Set(data.map((t) => t.course))]}
      />

      {data
        .filter((token) => shouldShowToken(token, filter))
        .map((token) => (
          <TagEditForm
            toast={toast}
            key={`${token.id}-${token.version}`}
            token={token}
          />
        ))}

      <ToastContainer />
    </div>
  );
};
