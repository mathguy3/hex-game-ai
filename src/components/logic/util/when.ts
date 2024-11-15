export const when = <T>(cases: Array<[T, boolean] | [T]>): T =>
    cases.find(([_, test]) => test)?.[0] ?? cases[cases.length - 1][0];