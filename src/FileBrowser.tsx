import { FileManager } from "@cubone/react-file-manager";
import "@cubone/react-file-manager/dist/style.css";
import { useEffect, useState } from "react";

type ListFileResponseItem = {
  name: string;
  properties: {
    createdOn: string;
    lastModified: string;
    contentType: string;
  };
};

function parseFileNames(files: ListFileResponseItem[]) {
  let folders: any = {};
  let result: any[] = [];

  files.forEach((file) => {
    const nameComponents = file.name.split("/");
    let obj = folders;
    let path = "";
    for (let i = 0; i < nameComponents.length - 1; ++i) {
      if (obj[nameComponents[i]] === undefined) {
        result.push({
          name: nameComponents[i],
          isDirectory: true,
          path: `${path}/${nameComponents[i]}`,
        });
        obj[nameComponents[i]] = {}
      }
      obj = obj[nameComponents[i]];
      path = `${path}/${nameComponents[i]}`;
    }

    result.push({
      name: nameComponents.at(-1),
      isDirectory: false,
      path: `/${file.name}`,
      updatedAt: file.properties.lastModified,
    });
  });

  return result;
}

export function FileBrowser() {
  const [files, setFiles] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const filesResponse = await fetch("/api/allfiles");
      const filesData: ListFileResponseItem[] = await filesResponse.json();
      setFiles(parseFileNames(filesData));
    })();
  });

  return (
    <div>
      <FileManager files={files} />
    </div>
  );
}
