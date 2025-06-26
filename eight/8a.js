// vowelCount.js (or 8a.js)
function vowelCount(str) {
    const vowels = 'aeiouAEIOU';
    const counts = { a: 0, e: 0, i: 0, o: 0, u: 0 };
    
    for (let char of str) {
        if (vowels.includes(char)) {
            counts[char.toLowerCase()]++;
        }
    }
    
    console.log(`a, e, i, o, and u appear, respectively, ${counts.a}, ${counts.e}, ${counts.i}, ${counts.o}, ${counts.u} times`);
    return counts;
}

// Test the function
vowelCount("Hello World");
vowelCount("Programming is fun");
vowelCount("Le Tour de France"); // Given example

module.exports = vowelCount;