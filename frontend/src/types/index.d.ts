export type History = {
  sender: "system" | "ai" | "user";
  message: string;
}[];

export type ModesTypes =
  | "Tax Resources"
  | "Freelancer Resources"
  | "Multi Resources";

export type Mode = {
  name: ModesTypes;
  namespace: string;
  image: string;
};

export type Modes = Mode[];
