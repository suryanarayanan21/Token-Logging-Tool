export type Attachment = {
  name: string;
  mimetype: string;
  url: string;
}

export type Token = {
  id: string;
  author: string;
  course: string;
  name: string;
  associatedTokens: string[];
  version: number;
  attachments: Attachment[];
  deleted?: boolean;
};
