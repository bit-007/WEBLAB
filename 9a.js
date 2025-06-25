function notBad(str) {
    const notIndex = str.indexOf('not');
    const badIndex = str.indexOf('bad');
    
    if (notIndex !== -1 && badIndex !== -1 && notIndex < badIndex) {
        const before = str.substring(0, notIndex);
        const after = str.substring(badIndex + 3);
        return before + 'good' + after;
    }
    
    return str;
}

// Usage examples:
// console.log(notBad('This dinner is not that bad!')); // "This dinner is good!"
// console.log(notBad('This dinner is bad!')); // "This dinner is bad!"
