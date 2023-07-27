export type Bracket = {
  index: number;
  character: string;
}

export type BracketPair = {
  start: Bracket;
  end: Bracket;
  depth: number;
}

/** List of bracket pairs in a string. */
export class BracketPairList {
  pairs: BracketPair[] = [];
  #stack: Bracket[] = [];

  constructor(string: string, types = '()[]{}') {
    // For each character in the string, check if it's a bracket
    stringLoop: for (const [index, character] of Object.entries(string)) {
      // For each bracket type, check if the current character is it
      typeLoop: for (let charIndex = 0; charIndex < types.length; charIndex++) {
        // If the current character is an opening bracket
        if (charIndex % 2 === 0 && character === types[charIndex]) {
          this.#stack.push({ index: Number(index), character: types[charIndex] });
          continue stringLoop;
        }
        
        // If the current character is a closing bracket
        else if (charIndex % 1 === 0 && character === types[charIndex]) {
          const lastOpen = this.#stack.pop();

          // If no bracket was open before, ignore the current closing bracket
          if (typeof lastOpen === 'undefined') continue stringLoop;

          // If the current closing bracket corresponds to the previous opening bracket
          if (lastOpen.character === types[charIndex - 1]) {
            const depth = this.#stack.length;
            this.pairs.push({
              start: lastOpen,
              end: { index: Number(index), character: types[charIndex] },
              depth: depth
            });
            continue stringLoop;
          } else {
            continue typeLoop;
          }
        }
      }
    }
  }


  /** Checks if all opened brackets are closed in the correct order. */
  get balanced() {
    return this.#stack.length === 0;
  }


  /** Returns the maximum number of nested brackets. */
  get maxDepth() {
    return Math.max(...this.pairs.map(pair => pair.depth));
  }


  /** Returns the list of bracket pairs nested at a particular depth. */
  getPairsAtDepth(depth: number): BracketPair[] {
    return this.pairs.filter(pair => pair.depth === depth);
  }


  /** Returns the direct ancestor to a bracket pair, i.e. the closest bracket pair containing that pair. */
  getAncestor(pair: BracketPair): BracketPair | null {
    if (pair.depth === 0) return null;

    const potentialAncestors = this.getPairsAtDepth(pair.depth - 1);
    for (const candidate of potentialAncestors) {
      if (candidate.start.index < pair.start.index && candidate.end.index > pair.end.index) {
        return candidate;
      }
    }

    return null;
  }


  /** Checks if two bracket pair lists are identical. */
  isSame(other: BracketPairList) {
    return this.pairs.every((pair, k) => {
      const otherPair = other.pairs[k];
      return (
        pair.depth === otherPair.depth
        && pair.start.index === otherPair.start.index
        && pair.start.character === otherPair.start.character
        && pair.end.index === otherPair.end.index
        && pair.end.character === otherPair.end.character
      );
    });
  }
}



/** List of string fragments contained between brackets, ordered by reversed depth. */
export class BracketFragments {
  fragments: string[] = [];

  constructor(string: string, types = '()[]{}') {
    const bracketPairList = new BracketPairList(string, types);
    if (!(bracketPairList.balanced)) {
      throw new Error(`Unbalanced bracket pairs of type ${types} in string ${string}`);
    }

    let modifiedString = string;
    let id = 0;

    // For each depth level, extract the string fragments into an array,
    // and replace the fragment in the original string by ${f[id]} where id
    // is the key of the associated fragment in the fragments array.
    for (let depth = bracketPairList.maxDepth; depth >= 0; depth--) {
      const pairs = bracketPairList.getPairsAtDepth(depth);

      // For each pair of brackets, extract the fragment that is between the brackets
      // and replace it in the original string.
      for (let k = 0; k < pairs.length; k++) {
        const pair = pairs[k];

        // Extract the fragment
        const fragment = modifiedString.slice(pair.start.index + 1, pair.end.index);
        this.fragments.push(fragment);

        // Replace it in the original string
        const replacement = `\${f[${id}]}`;
        id++;
        const prefix = modifiedString.slice(0, pair.start.index);
        const suffix = modifiedString.slice(pair.end.index + 1);
        modifiedString = `${prefix}${pair.start.character}${replacement}${pair.end.character}${suffix}`;

        // Compute the length difference between the fragment and its replacement,
        // and then shift all bracket pair indexes accordingly.
        const shiftBy = replacement.length - fragment.length;

        // Shift the end index of ancestor pairs
        let editedPair = pair;
        for (let subDepth = depth - 1; subDepth >= 0; subDepth--) {
          const ancestor = bracketPairList.getAncestor(editedPair);
          if (!ancestor) break;
          ancestor.end.index += shiftBy;
          editedPair = ancestor;
        }

        // Shift the start and end indexes of following sibling pairs
        for (const p of pairs) {
          if (p.start.index <= pair.start.index) continue;
          p.start.index += shiftBy;
          p.end.index += shiftBy;
        }

        // Shift the end index of the current pair,
        // after shifting the ancestors and siblings so that they compare their old indexes.
        pair.end.index += shiftBy;
      }
    }

    this.fragments.push(modifiedString);
  }


  /** Takes a string with fragment references (i.e. ${f[id]}) and replaces them with the actual fragments. */
  insertInto(string: string): string {
    let modifiedString = string;
    let lastModifiedString = null;
    while (true) {
      for (let id = 0; id < this.fragments.length; id++) {
        modifiedString = modifiedString.replace(`\${f[${id}]}`, this.fragments[id]);
      }
      if (lastModifiedString === modifiedString) break;
      lastModifiedString = modifiedString;
    }
    return modifiedString;
  }
}