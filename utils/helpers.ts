export const StandardSentence = (text: string) => {
  if (typeof text !== "string") return "";
  return text
    .split(" ")
    .map((word) => (word.length > 0 ? word[0].toUpperCase() + word.slice(1).toLowerCase() : ""))
    .join(" ");
};
