import { createBrowserRouter } from "react-router";
import App from "./App";
import { TagEntryForm } from "./components/TagEntryForm";

export default createBrowserRouter([
  {
    path: "/",
    children: [
      { index: true, Component: App },
      { path: "form", Component: TagEntryForm },
    ],
  },
]);
