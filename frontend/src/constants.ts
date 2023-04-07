import { Modes } from "./types";

// CONSTANTS
export const URL = import.meta.env.VITE_BASE_URL as string;
// debugger
export const MODES: Modes = [
  {
    name: "Tax Resources",
    namespace: "hnry-co-nz-tax-resources",
    image:
      "https://cdn.pixabay.com/photo/2023/03/21/09/53/willow-catkin-7866866_960_720.jpg",
  },
  {
    name: "Freelancer Resources",
    namespace: "hnry-co-nz-freelancer-resources",
    image:
      "https://cdn.pixabay.com/photo/2016/11/18/12/14/owl-1834152_960_720.jpg",
  },
  {
    name: "Multi Resources",
    namespace: "hnry-co-nz-multi-resources",
    image:
      "https://cdn.pixabay.com/photo/2014/05/20/21/20/bird-349026_960_720.jpg",
  },
];

export const DEFAULT_MODE = MODES[0];
