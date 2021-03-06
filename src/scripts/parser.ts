import { IParsedGlyph, IRawGlyph } from './types';

const parseRange = (range: string): [number, number] => {
    const parts = range.split(':');

    return parts.length === 1
        ? [Number(parts[0]), Number(parts[0])]
        : [Number(parts[0]), Number(parts[1])];
};

export const parseScheme = (scheme: IRawGlyph[]): IParsedGlyph[] => scheme.map(entry => {
    const layout = entry.layout.map(range => ({
        x: parseRange(range.x),
        y: parseRange(range.y)
    }));

    return {
        number: entry.number,
        layout,
        scheme: entry
    };
});
