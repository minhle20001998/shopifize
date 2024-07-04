import { append } from "./append";

export function mergeArrayStringFromIndex(
  array: readonly string[],
  arrayToMerge: readonly string[],
  fromIndex: number
): string[] {
  return array.reduce(
    (accumulator, currentValue, index) => {
      const { characters, restArrayMerged } = accumulator;
      if (index < fromIndex) {
        return {
          restArrayMerged,
          characters: append(characters, currentValue),
        };
      }

      const [firstCharacter, ...restArrayWithoutFirstCharacter] =
        restArrayMerged;
      return {
        restArrayMerged: restArrayWithoutFirstCharacter,
        characters: append(characters, firstCharacter || ""),
      };
    },
    {
      restArrayMerged: arrayToMerge,
      characters: [] as string[],
    }
  ).characters;
}
