import MenuItem, { type MenuItemProps } from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { FaCaretDown, FaCaretRight, FaCheck } from "react-icons/fa6";

export type TokenFilter = {
  nameFilter: string;
  authorFilter: string[];
  courseFilter: string[];
  typeFilter: string[];
  chapterFilter: string[];
};

type FilterBarProps = {
  filter: TokenFilter;
  setFilter: React.Dispatch<React.SetStateAction<TokenFilter>>;
  tokenTypes: string[];
  authors: string[];
  chapters: string[];
  courses: string[];
};

type FilterMenuItemProps = {
  text: string;
  selectedItems: string[];
};

type FitlerSelectProps = {
  name: string;
  options: string[];
  onSelect: (selection: string[] | string) => void;
  value: string[];
};

export const getEmptyFilter: () => TokenFilter = () => {
  return {
    nameFilter: "",
    authorFilter: [],
    courseFilter: [],
    typeFilter: [],
    chapterFilter: [],
  };
};

const FilterMenuItem = ({
  text,
  selectedItems,
  ...menuProps
}: FilterMenuItemProps & MenuItemProps) => {
  const { sx, ...otherProps } = menuProps;

  return (
    <MenuItem sx={{ width: 232 }} {...otherProps}>
      <div className="flex flex-row p-1 w-full items-center gap-3">
        <p className="flex grow text-sm text-gray-800 text-ellipsis">{text}</p>
        {selectedItems.includes(text) ? (
          <FaCheck className="flex-none w-8" color="#295e1b" />
        ) : (
          <></>
        )}
      </div>
    </MenuItem>
  );
};

const FilterSelect = ({
  name,
  value,
  onSelect,
  options,
}: FitlerSelectProps) => {
  return (
    <div className="flex flex-row gap-3 items-center">
      <span className="text-sm text-gray-700">{name}</span>
      <Select
        sx={{
          width: 232,
          height: 42,
        }}
        value={value}
        multiple={true}
        renderValue={(selection) => selection.join(", ")}
        onChange={(e) => onSelect(e.target.value)}
      >
        {options.map((t) => (
          <FilterMenuItem value={t} text={t} selectedItems={value} />
        ))}
      </Select>
    </div>
  );
};

export const FilterBar = ({
  filter,
  setFilter,
  tokenTypes,
  authors,
  chapters,
  courses,
}: FilterBarProps) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="flex flex-col p-5 gap-4 w-full bg-gray-200 rounded-lg">
      <div
        className="flex flex-row gap-2 items-center"
        onClick={() => {
          setShowFilters(!showFilters);
        }}
      >
        {showFilters ? (
          <FaCaretDown className="text-gray-700" />
        ) : (
          <FaCaretRight className="text-gray-700" />
        )}

        <p className="text-sm text-gray-800">Filters</p>
      </div>
      {showFilters && (
        <div className="flex flex-row items-center justify-between flex-wrap">
          <div className="flex flex-row items-center gap-3">
            <p className="text-sm text-gray-700">Name</p>
            <TextField
              value={filter.nameFilter}
              sx={{
                "& .MuiInputBase-root": {
                  height: 42, // Sets the height of the entire input container
                  width: 232,
                },
                // "& .MuiInputBase-input": {
                //   paddingTop: "8px", // Adjust padding to vertically center text/label
                //   paddingBottom: "8px",
                // },
              }}
              onChange={(e) => {
                setFilter((f) => ({ ...f, nameFilter: e.target.value }));
              }}
            />
          </div>
          <FilterSelect
            name="Token Types"
            value={filter.typeFilter}
            onSelect={(selection) => {
              setFilter((f) => ({
                ...f,
                typeFilter: [...selection],
              }));
            }}
            options={tokenTypes}
          />
          <FilterSelect
            name="Authors"
            value={filter.authorFilter}
            onSelect={(selection) => {
              setFilter((f) => ({
                ...f,
                authorFilter: [...selection],
              }));
            }}
            options={authors}
          />
          <FilterSelect
            name="Courses"
            value={filter.courseFilter}
            onSelect={(selection) => {
              setFilter((f) => ({
                ...f,
                courseFilter: [...selection],
              }));
            }}
            options={courses}
          />
          <FilterSelect
            name="Learning Chapters"
            value={filter.chapterFilter}
            onSelect={(selection) => {
              setFilter((f) => ({
                ...f,
                chapterFilter: [...selection],
              }));
            }}
            options={chapters}
          />
        </div>
      )}
    </div>
  );
};
