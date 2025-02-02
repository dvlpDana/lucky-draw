type DrawType = 'roulette' | 'number';

interface Range {
  start: number;
  end: number;
}

interface Rank {
  rank: number;
  count: number;
}

interface Results {
  [key: number]: number[];
}


export type { Range, Rank, Results, DrawType };