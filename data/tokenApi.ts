import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Token } from "../types/Token";

export const tokenApi = createApi({
  reducerPath: "tokens",
  tagTypes: ["TokenList"],
  baseQuery: fetchBaseQuery({ baseUrl: "/api/" }),
  endpoints: (build) => ({
    getTokens: build.query<Token[], void>({
      query: () => ({ url: "tokens" }),
      providesTags: ["TokenList"],
    }),

    getAllAssociatedTokens: build.query<string[], void>({
      query: () => ({ url: "tokens" }),
      providesTags: ["TokenList"],
      transformResponse: (response: Token[]) => {
        return [
          ...new Set(response.map((token) => token.associatedTokens).flat()),
        ];
      },
    }),

    addToken: build.mutation<void, Omit<Token, "id" | "version">>({
      query: (token) => {
        const id = crypto.randomUUID();
        return {
          url: `tokens`,
          method: "POST",
          body: {
            ...token,
            id,
            version: 1,
          },
        };
      },
      invalidatesTags: ["TokenList"],
    }),

    updateToken: build.mutation<void, Token>({
      query: (token) => ({
        url: "tokens",
        method: "PUT",
        body: {
          ...token,
          version: token.version + 1,
        },
      }),
      invalidatesTags: ["TokenList"],
    }),

    deleteToken: build.mutation<void, string>({
      query: (id) => ({
        url: `tokens/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TokenList"],
    }),
  }),
});

export const {
  useGetTokensQuery,
  useGetAllAssociatedTokensQuery,
  useAddTokenMutation,
  useDeleteTokenMutation,
  useUpdateTokenMutation,
} = tokenApi;
