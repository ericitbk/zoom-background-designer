import techBlue from "@/assets/mfv-virtual-background-3-01.png";
import gradientPurple from "@/assets/mfv-virtual-background-3-02.png";
import officeClean from "@/assets/mfv-virtual-background-3-04.png";
import cloudBoxClean from "@/assets/mfv-virtual-background-3-05.png";

export interface BackgroundOption {
  id: string;
  name: string;
  image: string;
}

export const backgrounds: BackgroundOption[] = [
  {
    id: "tech-blue",
    name: "BG 1",
    image: techBlue,
  },
  {
    id: "gradient-purple",
    name: "BG 2",
    image: gradientPurple,
  },
  {
    id: "office-clean",
    name: "BG 3",
    image: officeClean,
  },
  {
    id: "cloud-box-clean",
    name: "BG 4",
    image: cloudBoxClean,
  },
];
