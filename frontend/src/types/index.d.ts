export type History = {
  sender: "system" | "ai" | "user" | "server" | "sources";
  message: string;
}[];

export type Mode = {
  name: string;
  namespace: string;
  image: string;
};

export type Modes = Mode[];
