function createMonthConverter() {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    return function(monthNumber) {
        if (isNaN(monthNumber)) {
            return "Bad Number";
        }
        
        monthNumber = Math.floor(Number(monthNumber));
        
        if (monthNumber < 1 || monthNumber > 12) {
            return "Bad Number";
        }
        
        return months[monthNumber - 1];
    };
}

const monthConverter = createMonthConverter();
