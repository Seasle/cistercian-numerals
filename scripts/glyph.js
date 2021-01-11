import { GLYPH_ACTUAL_WIDTH, GLYPH_ACTUAL_HEIGHT, GLYPH_OFFSET, GLYPH_SCALE } from './constants.js';

export const createGlyph = layout => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    [canvas.width, canvas.height] = [GLYPH_ACTUAL_WIDTH, GLYPH_ACTUAL_HEIGHT];

    context.translate(GLYPH_OFFSET * GLYPH_SCALE, GLYPH_OFFSET * GLYPH_SCALE);
    for (const line of layout) {
        const [xStart, xEnd] = line.x;
        const [yStart, yEnd] = line.y;

        context.moveTo(xStart * GLYPH_SCALE, yStart * GLYPH_SCALE);
        context.lineTo(xEnd * GLYPH_SCALE, yEnd * GLYPH_SCALE);
    }
    context.lineWidth = 2;
    context.lineCap = 'round';
    context.stroke();

    return canvas;
};