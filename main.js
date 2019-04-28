$(document).ready(function() {
    $("#summaryButton").click(function() {
        var userText = $("#inputText").val();
        courses = processRawData(userText);
        courses = getAllData(courses);
        var allData = courses;
        var uFrequency = getUnitFreq(allData);
        courses = isIncluded(courses);
        // for future if not included courses need to be accessed
        var notIncluded = courses[1];
        courses = courses[0];
        var gFrequency = getGradeFreq(courses);


        //array of all unique years
        years = extractUniqueYears(courses);
        //array of all unique semesters
        semesters = extractUniqueSemesters(courses);
        //calculate cumulative GPA data
        cumulative = calculateCumulativeGPA(courses);
        //calculate yearly GPA data
        yearly = calculateYearlyGPA(courses, years);
        //calculate semsterly values
        semesterly = calculateSemesterlyGPA(courses, semesters);
        //create string that contains course data formatted by years and semesters
        summaryString = createSummaryTableString(cumulative,yearly,semesterly,courses);

        $("#gradesTable").html(summaryString);


    });

    $("#coursesButton").click(function() {
      var userText = $("#inputText").val();
      courses = processRawData(userText);
      courses = getAllData(courses);
      var courseString = createCourseTableString(courses);
      $("#gradesTable").html(courseString);
    });


    $('.semesterrow').hide();
    $('.courserow').hide();
    $('#gradesTable').on('click', 'tr', function() {
        $this = $(this);
        if ($this.hasClass('yearrow')) {
            if ($this.hasClass('open')) {
                $this.toggleClass('open').nextUntil('.yearrow', 'tr').hide(600);
            } else {
                $this.toggleClass('open').nextUntil('.yearrow', 'tr:not(.courserow)').toggle(600);
            }
        } else if ($this.hasClass('semesterrow')) {
            $this.nextUntil('.semesterrow', 'tr:not(.yearrow)').toggle(600);
        }
    });
});

function processRawData(rawData) {
    var format = /[A-Z]+ +(.)*\n(.)*\n+[0-9]+ +[A-z]*\n+[A-Z\D]*\n+[0-9]+[.]+[0-9]*\n+[A-z]*\n/gm;
    var courses = [];
    while ((row = format.exec(rawData)) !== null) {
        var entry = row[0].split('\n');
        courses.push(entry);
    }
    return courses;
}

function getAllData(data) {
    // function to manage the generation of attributes for all course data that is used further
    data = getNames(data);
    data = timeTaken(data);
    data = getTwelvePoint(data);
    return data;
}

function getNames(courses) {
    // function replaces course code and name fields with a combined field
    for (var i = 0; i < courses.length; i++) {
        //combine course code and course name and add replace course code data
        courses[i][0] = courses[i][0].concat(": ", courses[i][1]);
        //remove course name data
        courses[i].splice(1, 1);
    }
    return courses;
}

function timeTaken(courses) {
    //function caclulates the time that the course was taken --> year and semster
    for (var i = 0; i < courses.length; i++) {
        // if fall use parsed year else subtract 1 from parsed year
        // calculator assumes that all school years start in the fall
        if (courses[i][1].substring(5, 9) == 'Fall') {
            courses[i].splice(1, 0, parseInt(courses[i][1].substring(0, 4)))
        } else {
            courses[i].splice(1, 0, parseInt(courses[i][1].substring(0, 4)) - 1)
        }
        //parse for and add the semseter that the course was taken in
        var semsester = courses[i][2].split(' ');
        courses[i].splice(2, 0, semsester[1]);
        //remove the old course year and semseter data
    }
    return courses;
}

function getTwelvePoint(courses) {
    for (var i = 0; i < courses.length; i++) {
        //convert corse units from string to int
        courses[i][5] = parseInt(courses[i][5]);
        // get the Twelve Point grade from the letter grade
        var grade = courses[i][4];
        if (grade == 'A+') {
            courses[i].splice(5, 0, 12);
        } else if (grade == 'A') {
            courses[i].splice(5, 0, 11);
        } else if (grade == 'A-') {
            courses[i].splice(5, 0, 10);
        } else if (grade == 'B+') {
            courses[i].splice(5, 0, 9);
        } else if (grade == 'B') {
            courses[i].splice(5, 0, 8);
        } else if (grade == 'B-') {
            courses[i].splice(5, 0, 7);
        } else if (grade == 'C+') {
            courses[i].splice(5, 0, 6);
        } else if (grade == 'C') {
            courses[i].splice(5, 0, 5);
        } else if (grade == 'C-') {
            courses[i].splice(5, 0, 4);
        } else if (grade == 'D+') {
            courses[i].splice(5, 0, 3);
        } else if (grade == 'D') {
            courses[i].splice(5, 0, 2);
        } else if (grade == 'D-') {
            courses[i].splice(5, 0, 2);
        } else {
            courses[i].splice(5, 0, 0);
        }
        //remove the letter grade
        courses[i].splice(4, 1);
        //add in the total credits earned
        courses[i].splice(6, 0, courses[i][4] * courses[i][5]);
    }
    return courses;
}

function isIncluded(courses) {
    //function returns two arrays
    //first array is of courses that are included in GPA calculation
    //other array is of courses not included in GPA calculation
    var toReturn = [];
    var notIncluded = []
    for (var i = 0; i < courses.length; i++) {
        if ((courses[i][7] == 'In Progress') || (courses[i][5] == 0)) {
            courses[i].splice(7, 1);
            notIncluded.push(courses[i]);
        } else {
            courses[i].splice(7, 1);
            toReturn.push(courses[i]);
        }
    }
    toReturn = toReturn.sort();
    return [toReturn, notIncluded];
}

function extractUniqueYears(courses) {
    //function returns an array of all unique years in course list
    var years = [];
    for (var i = 0; i < courses.length; i++) {
        years.push(courses[i][1]);
    }
    years = Array.from(new Set(years));
    return years.sort();
}

function extractUniqueSemesters(courses) {
    //funtion returns array of all unique semesters in course list
    var semesters = [];
    for (var i = 0; i < courses.length; i++) {
        semesters.push(courses[i][3]);
    }
    semesters = Array.from(new Set(semesters));
    semseters = semesters.sort();
    return semesters;
}

function calculateCumulativeGPA(courses) {
    //calculate overall GPA
    totalCredits = 0;
    totalUnits = 0;
    for (var l = 0; l < courses.length; l++) {
        totalUnits = totalUnits + courses[l][5];
        totalCredits = totalCredits + courses[l][6];
    }
    var cumulative = ['Cumulative', totalUnits.toString(), totalCredits.toString(), ((totalCredits / totalUnits).toFixed(1)).toString()];
    return cumulative;
}

function calculateYearlyGPA(courses, years) {
    var finalData = [];
    //calculate yearly gpa
    var totalCredits = 0;
    var totalUnits = 0;
    for (var j = 0; j < years.length; j++) {
        totalCredits = 0;
        totalUnits = 0;
        for (var k = 0; k < courses.length; k++) {
            if (courses[k][1] == years[j]) {
                totalUnits = totalUnits + courses[k][5];
                totalCredits = totalCredits + courses[k][6];
            }
        }
        finalData[j] = [years[j].toString() + '-' + (years[j] + 1).toString(), totalUnits.toString(), totalCredits.toString(), ((totalCredits / totalUnits).toFixed(1)).toString()];
    }
    for (var i = 0; i < finalData.length; i++) {
        finalData[i].push(parseInt(finalData[i][0]));
    }
    var yearly = finalData;
    return yearly;
}

function calculateSemesterlyGPA(courses, semesters) {
    var finalData = [];
    //calculate yearly gpa
    var totalCredits = 0;
    var totalUnits = 0.0;
    for (var j = 0; j < semseters.length; j++) {
        totalCredits = 0;
        totalUnits = 0;
        for (var k = 0; k < courses.length; k++) {
            if (courses[k][3] == semesters[j]) {
                totalUnits = totalUnits + courses[k][5];
                totalCredits = totalCredits + courses[k][6];
            }
        }
        finalData[j] = [semesters[j], totalUnits.toString(), totalCredits.toString(), ((totalCredits / totalUnits).toFixed(1)).toString()];
    }
    finalData = academicYearID(finalData);
    var semesterly = finalData.sort();
    return semesterly;
}

function academicYearID(data) {
    for (var i = 0; i < data.length; i++) {
        if (data[i][0].substring(5, 9) == 'Fall') {
            data[i].push(parseInt(data[i][0].substring(0, 4)));
        } else {
            data[i].push(parseInt(data[i][0].substring(0, 4)) - 1);
        }
    }
    return data;
}

function createTableHeaders() {
    return '<thead style = "padding: 8px; text-align: center;"><tr class="tableheader"><th>Time Period/Course</th><th>Units Taken</th><th>Credits Earned</th><th>GPA</th></tr></thead><tbody>'
}

function createCumulativeRow(Units, Credits, grade) {
    return '<tr class="cumulativerow" style = "padding: 8px; text-align: center; "><td>Cumulative</td><td>' + Units.toString() + '</td><td>' + Credits.toString() + '</td><td>' + grade.toString() + '</td></tr>';
}

function createYearRow(TimePeriod, Units, Credits, grade) {
    return '<tr class="yearrow" style = "padding: 8px; text-align: center; "><td>' + TimePeriod.toString() + '</td><td>' + Units.toString() + '</td><td>' + Credits.toString() + '</td><td>' + grade.toString() + '</td></tr>';
}

function createSemesterRow(TimePeriod, Units, Credits, grade) {
    return '<tr class="semesterrow" style = "padding: 8px; text-align: center; "><td>' + TimePeriod.toString() + '</td><td>' + Units.toString() + '</td><td>' + Credits.toString() + '</td><td>' + grade.toString() + '</td></tr>';
}

function createCourseRow(Title, Units, Credits, grade) {
    return '<tr class="courserow" style = "padding: 8px; text-align: center;"><td>' + (Title.toString()) + '</td><td>' + Units.toString() + '</td><td>' + Credits.toString() + '</td><td>' + grade.toString() + '</td></tr>';
}

function createSoloTableHeaders() {
    return '<thead style = "padding: 8px; text-align: center;"><tr class="tableheader"><th>Course</th><th>Academic Year</th><th>Semester</th><th>Units Taken</th><th>Credits Earned</th><th>GPA</th><th>Status</th></tr></thead><tbody>'
}

function createSoloCourseRow(Title, Year, Semester, Units, Credits, Grade, Status) {
    return '<tr class="solocourserow" style = "padding: 8px; text-align: center;"><td>' + (Title.toString()) + '</td><td>' + Year.toString() + '</td><td>' + Semester.toString() + '</td><td>' + Units.toString() + '</td><td>' + Credits.toString() + '</td><td>' + Grade.toString() + '</td><td>' + Status.toString() + "</td></tr>";
}

function createSummaryTableString(cumulative,yearly,semesterly,courses){
  var tableString = '<table>' + createTableHeaders();
  tableString = tableString + createCumulativeRow(cumulative[1], cumulative[2], cumulative[3]);
  for (var i = 0; i < yearly.length; i++) {
      if (yearly[i][1] != 0) {
          tableString = tableString + createYearRow(yearly[i][0], yearly[i][1], yearly[i][2], yearly[i][3]);
      }
      for (var j = 0; j < semesterly.length; j++) {
          if ((semesterly[j][4] == yearly[i][4]) && (semesterly[j][1] != 0)) {
              tableString = tableString + createSemesterRow(semesterly[j][0], semesterly[j][1], semesterly[j][2], semesterly[j][3]);
          }
          for (var k = 0; k < courses.length; k++) {
              if ((semesterly[j][0] == courses[k][3]) && (courses[k][1] == yearly[i][4])) {
                  tableString = tableString + createCourseRow(courses[k][0], courses[k][5], courses[k][6], courses[k][4]);
              }
          }
      }
  }
  tableString = tableString + '</tbody></table>';
  return tableString;
}

function createCourseTableString(courses){
  var tableString = '<table>' + createSoloTableHeaders();
  for(var i = 0; i<courses.length;i++){
    var temp =  createSoloCourseRow(courses[i][0],courses[i][1],courses[i][3],courses[i][5],courses[i][6],courses[i][4],courses[i][7]);
    tableString = tableString + temp;
  }
  tableString = tableString + '</tbody></table>';
  return tableString;
}

function getUnitFreq(data) {
  units = [0,0,0,0,0,0,0];
  for (var i = 0; i<data.length; i++){
    units[data[i][5] - 1]++;
  }
  return units;
}

function getGradeFreq(data){
  grades = [0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  for(var i=0;i<data.length;i++){
    grades[data[i][4]]++;
  }
  return grades;
}
