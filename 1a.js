function translate(text) {
    const consonants = 'bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ';
    return text.split('').map(char => {
        if (consonants.includes(char)) {
            return char + 'o' + char.toLowerCase();
        }
        return char;
    }).join('');
}

console.log(translate("this is fun"));