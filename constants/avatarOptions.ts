import { ImageSourcePropType } from "react-native";

export type AvatarOption = {
  id: string;
  label: string;
  source: ImageSourcePropType;
};

export const avatarOptions: AvatarOption[] = [
  { id: "fox", label: "Fox", source: require("../assets/avatars/fox.png") },
  { id: "red-panda", label: "Red Panda", source: require("../assets/avatars/red-panda.png") },
  { id: "bunny", label: "Bunny", source: require("../assets/avatars/bunny.png") },
  { id: "bear", label: "Bear", source: require("../assets/avatars/bear.png") },
  { id: "cat", label: "Cat", source: require("../assets/avatars/cat.png") },
  { id: "koala", label: "Koala", source: require("../assets/avatars/koala.png") },
  { id: "otter", label: "Otter", source: require("../assets/avatars/otter.png") },
  { id: "raccoon", label: "Raccoon", source: require("../assets/avatars/raccoon.png") },
  { id: "panda", label: "Panda", source: require("../assets/avatars/panda.png") },
  { id: "tiger", label: "Tiger", source: require("../assets/avatars/tiger.png") },
  { id: "lion", label: "Lion", source: require("../assets/avatars/lion.png") },
  { id: "owl", label: "Owl", source: require("../assets/avatars/owl.png") },
  { id: "penguin", label: "Penguin", source: require("../assets/avatars/penguin.png") },
  { id: "hedgehog", label: "Hedgehog", source: require("../assets/avatars/hedgehog.png") },
  { id: "frog", label: "Frog", source: require("../assets/avatars/frog.png") },
  { id: "duck", label: "Duck", source: require("../assets/avatars/duck.png") },
  { id: "hamster", label: "Hamster", source: require("../assets/avatars/hamster.png") },
  { id: "capybara", label: "Capybara", source: require("../assets/avatars/capybara.png") },
  { id: "llama", label: "Llama", source: require("../assets/avatars/llama.png") },
  { id: "elephant", label: "Elephant", source: require("../assets/avatars/elephant.png") },
];

export const avatarOptionMap = new Map(avatarOptions.map((option) => [option.id, option]));
