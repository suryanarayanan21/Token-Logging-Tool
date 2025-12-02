export type Token = {
  id: string;
  author: string;
  course: string;
  name: string;
  associatedTokens: string[];
  version: number;
  attachments: string[];
  deleted?: boolean;
};
