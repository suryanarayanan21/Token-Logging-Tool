import type { RootState } from "./store";
import type { Token } from "../types/Token";
import type { PayloadAction } from "@reduxjs/toolkit";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export type TokenState = {
  loading: boolean;
  tokens: Token[];
};

const initialState: TokenState = {
  loading: true,
  tokens: [],
};

export const tokenSlice = createSlice({
  name: "tokens",
  initialState,
  reducers: {
    addNewToken: (tokenState, action: PayloadAction<Token>) => {
      const token: Token = {
        ...action.payload,
        id: crypto.randomUUID(),
        version: 0,
      };

      tokenState.tokens.push(token);
    },
  },
});

export const { addNewToken } = tokenSlice.actions;

export const selectTokens = (state: RootState) => state.tokens;

export const selectTokenOptions = (state: RootState) => {
  [...new Set(state.tokens.tokens.map((token) => token.associatedTokens).flat())];
};

export default tokenSlice.reducer;
