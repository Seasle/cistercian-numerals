import { parseScheme } from './parser.js';
import { createGlyph } from './glyph.js';
import { GLYPH_ACTUAL_WIDTH, GLYPH_ACTUAL_HEIGHT, GLYPH_MIN_NUMBER, GLYPH_MAX_NUMBER } from './constants.js';
const input = document.querySelector('input[type="text"]');
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const store = {
    glyphs: [],
    numbers: [],
    cache: new Map(),
    number: GLYPH_MIN_NUMBER,
    showNumbers: true
};
const getMaxSymbol = (number) => {
    const maxNumber = Math.max(...store.numbers.filter(entry => entry <= number));
    return store.glyphs.find(symbol => symbol.number === maxNumber);
};
const numberToGlyphs = (number) => {
    if (number < GLYPH_MIN_NUMBER) {
        return [];
    }
    const groups = [];
    const count = Math.ceil(number / GLYPH_MAX_NUMBER);
    for (let index = 0; index < count; index++) {
        const entries = [];
        const remainder = number - GLYPH_MAX_NUMBER * (count - index - 1);
        let current = remainder > GLYPH_MAX_NUMBER
            ? GLYPH_MAX_NUMBER
            : remainder;
        let iteration = 0;
        while (current > 0) {
            const symbol = getMaxSymbol(current);
            if (symbol !== undefined) {
                entries.push(symbol);
                current -= symbol.number;
            }
            iteration++;
            if (iteration >= 100) {
                throw new Error('Cannot create symbol');
            }
        }
        groups.unshift(entries);
    }
    return groups;
};
const isEqual = (a, b) => a.every(entry => b.includes(entry)) && b.every(entry => a.includes(entry));
const mergeGlyphs = (groups) => groups.map(glyphs => glyphs.reduce((accumulator, glyph) => {
    accumulator.number += glyph.number;
    for (const line of glyph.layout) {
        if (accumulator.layout.findIndex(entry => isEqual(entry.x, line.x) && isEqual(entry.y, line.y)) === -1) {
            accumulator.layout.push(line);
        }
    }
    return accumulator;
}, {
    number: 0,
    layout: []
}));
const drawGlyph = (glyph) => {
    if (!store.cache.has(glyph.number)) {
        store.cache.set(glyph.number, createGlyph(glyph.layout));
    }
    const image = store.cache.get(glyph.number);
    context.drawImage(image, 0, 0, image.width, image.height);
};
const update = () => {
    if (store.number <= 1e6) {
        const size = canvas.parentElement.getBoundingClientRect();
        const glyphs = mergeGlyphs(numberToGlyphs(store.number));
        const columns = Math.min(glyphs.length, Math.floor(size.width / GLYPH_ACTUAL_WIDTH));
        if (columns > 0) {
            const rows = Math.ceil(glyphs.length / columns);
            [canvas.width, canvas.height] = [GLYPH_ACTUAL_WIDTH * columns, GLYPH_ACTUAL_HEIGHT * rows];
            context.clearRect(0, 0, canvas.width, canvas.height);
            glyphs.forEach((glyph, index) => {
                const line = Math.floor(index / columns);
                const x = GLYPH_ACTUAL_WIDTH * (index - line * columns);
                const y = GLYPH_ACTUAL_HEIGHT * line;
                context.save();
                context.translate(x, y);
                drawGlyph(glyph);
                context.fillText(glyph.number.toString(), 0, GLYPH_ACTUAL_HEIGHT);
                context.restore();
            });
        }
    }
};
const init = () => {
    input.addEventListener('input', () => {
        store.number = Number(input.value) || GLYPH_MIN_NUMBER;
        requestAnimationFrame(update);
    });
    window.addEventListener('resize', () => {
        requestAnimationFrame(update);
    });
    fetch('./assets/glyphs.json')
        .then(response => response.json())
        .then((data) => {
        store.glyphs = parseScheme(data);
        store.numbers = store.glyphs.map(symbol => symbol.number);
        console.group('Parsed Scheme');
        console.log(store.glyphs);
        console.groupEnd();
        requestAnimationFrame(update);
    });
};
window.addEventListener('DOMContentLoaded', init);
