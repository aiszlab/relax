export type Intersection<P, N> = Pick<P, keyof N & keyof P> &
  Partial<Omit<P, keyof N & keyof P>> &
  Partial<Omit<N, keyof N & keyof P>>;
