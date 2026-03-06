const adjectives = [
  "Calm", "Quiet", "Gentle", "Bright", "Soft",
  "Curious", "Brave", "Kind", "Silent", "Warm"
];

const nouns = [
  "River", "Mountain", "Forest", "Star",
  "Cloud", "Wave", "Leaf", "Sky", "Stone"
];

export const generateAlias = () => {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];

  return `${adj}${noun}`;
};