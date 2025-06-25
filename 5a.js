function pluralize(noun, number) {
    if (number === 1) {
        return `${number} ${noun}`;
    }
    
    const irregularNouns = {
        'sheep': 'sheep',
        'goose': 'geese',
        'child': 'children',
        'mouse': 'mice',
        'tooth': 'teeth',
        'foot': 'feet'
    };
    
    if (irregularNouns[noun]) {
        return `${number} ${irregularNouns[noun]}`;
    }
    
    return `${number} ${noun}s`;
}