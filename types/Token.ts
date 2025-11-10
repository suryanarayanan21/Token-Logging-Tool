export type Token = {
  author: string;
  name: string;
  associatedTokens: string[];
  version: number;
  attachments: string[];
  deleted?: boolean;
};
