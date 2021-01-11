export interface IRawLayout {
    x: string;
    y: string;
}

export interface IParsedLayout {
    x: [number, number];
    y: [number, number];
}

export interface IRawGlyph {
    number: number;
    layout: IRawLayout[];
}

export interface IParsedGlyph {
    number: number;
    layout: IParsedLayout[];
    scheme?: IRawGlyph;
}

export interface IStore {
    glyphs: IParsedGlyph[];
    numbers: number[];
    cache: Map<number, HTMLCanvasElement>;
    number: number;
    showNumbers: boolean;
}
