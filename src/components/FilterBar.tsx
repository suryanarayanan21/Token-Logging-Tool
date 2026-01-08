import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";

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

export const FilterBar = ({
  filter,
  setFilter,
  tokenTypes,
  authors,
  chapters,
  courses,
}: FilterBarProps) => {
  return (
    <div className="flex flex-col p-3 gap-2">
      <p>Fiters</p>
      <div className="flex flex-row gap-3">
        <div className="flex flex-row gap-1">
          <p>Name</p>
          <TextField
            value={filter.nameFilter}
            onChange={(e) => {
              setFilter((f) => ({ ...f, nameFilter: e.target.value }));
            }}
          />
        </div>
        <div className="flex flex-row gap-1">
          <p>Token Types</p>
          <Select
            value={filter.typeFilter}
            multiple={true}
            onChange={(e) => {
              setFilter((f) => ({
                ...f,
                typeFilter: [...e.target.value],
              }));
            }}
          >
            {tokenTypes.map((t) => (
              <MenuItem value={t}>t</MenuItem>
            ))}
          </Select>
        </div>
        <div className="flex flex-row gap-1">
          <p>Authors</p>
          <Select
            value={filter.authorFilter}
            multiple={true}
            onChange={(e) => {
              setFilter((f) => ({
                ...f,
                authorFilter: [...e.target.value],
              }));
            }}
          >
            {authors.map((t) => (
              <MenuItem value={t}>t</MenuItem>
            ))}
          </Select>
        </div>
        <div className="flex flex-row gap-1">
          <p>Courses</p>
          <Select
            value={filter.courseFilter}
            multiple={true}
            onChange={(e) => {
              setFilter((f) => ({
                ...f,
                courseFilter: [...e.target.value],
              }));
            }}
          >
            {courses.map((t) => (
              <MenuItem value={t}>t</MenuItem>
            ))}
          </Select>
        </div>
        <div className="flex flex-row gap-1">
          <p>Learning Chapters</p>
          <Select
            value={filter.chapterFilter}
            multiple={true}
            onChange={(e) => {
              setFilter((f) => ({
                ...f,
                chapterFilter: [...e.target.value],
              }));
            }}
          >
            {chapters.map((t) => (
              <MenuItem value={t}>t</MenuItem>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
};
