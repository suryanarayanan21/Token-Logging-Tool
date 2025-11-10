import type { RootState } from "./store";
import type { Token } from "../types/Token";
import type { PayloadAction } from "@reduxjs/toolkit";

import { createSlice } from "@reduxjs/toolkit";

export type TokenState = Token[];

const initialState: TokenState = [];

export const tokenSlice = createSlice({
  name: "tokens",
  initialState,
  reducers: {
    addToken: (tokens, action: PayloadAction<Token>) => {
      const token: Token = {
        ...action.payload,
        version: 0,
      };

      tokens.push(token);
    },
  },
});

export const { addToken } = tokenSlice.actions;

export const selectTokens = (state: RootState) => state.tokens;

export default tokenSlice.reducer;
