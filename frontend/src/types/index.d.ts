export type History = {
  sender: "system" | "ai" | "user";
  message: string;
}[];

export type Mode = {
  name: string;
  namespace: string;
  image: string;
};

export type Modes = Mode[];
