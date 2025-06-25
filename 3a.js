function createAcademicDataManager() {
    let cieMarks = 0;
    let seeMarks = 0;
    
    return {
        setCIE: function(marks) {
            cieMarks = marks;
        },
        
        setSEE: function(marks) {
            seeMarks = marks;
        },
        
        getTotalMarks: function() {
            return cieMarks + seeMarks;
        },
        
        getStudentDetails: function(usn, subjectCode, subjectName) {
            const total = this.getTotalMarks();
            return {
                usn: usn,
                subject_code: subjectCode,
                subject_name: subjectName,
                cie_marks: cieMarks,
                see_marks: seeMarks,
                total_marks: total
            };
        }
    };
}