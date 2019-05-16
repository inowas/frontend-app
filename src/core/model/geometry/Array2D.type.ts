type ArrayOneOrMore<T> = {
    0: T
} & T[];

export type Array2D = Array<ArrayOneOrMore<number>>;
