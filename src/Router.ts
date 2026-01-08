import { createBrowserRouter } from "react-router";
// import App from "./App";
import { Login } from "./Login";
import { NewTokens } from "./NewTokens";
import { EditTokens } from "./EditTokens";

export default createBrowserRouter([
  {
    path: "/",
    children: [
      { index: true, Component: Login },
      { path: "login", Component: Login },
      {
        path: "form/:author",
        loader: async ({ params }) => {
          return { author: params.author };
        },
        Component: NewTokens,
      },
      {
        path: "edit/:author",
        loader: async ({params}) => {
          return { filter: params.filter }
        },
        Component: EditTokens,
      }
    ],
  },
]);
