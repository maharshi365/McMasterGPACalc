$(document).ready(function(){
	$("#gobutton").click(function() {
		var userText = $("#inputText").val();
		var data = processRawData(userText);
		data = getAllData(data);
		data = data.sort()
		
		// extract all unique years
		var years = [];
		years = extractUniqueYears(years,data);

		// extract all unique semesters
		var semsetersUn = [];
		semsetersUn = extractUniqueSemesters(semsetersUn,data);

		var cumulative = [];
		cumulative = calculateCumulativeGPA(cumulative,data);

		var yearly = [];
		yearly = calculateYearlyGPA(yearly,data,years);

		var semesterly = [];
		semseterly = calculateSemesterlyGPA(semesterly,data,semsetersUn);

		console.log(cumulative);
		console.log(yearly);
		console.log(semseterly);

		tableString = '<table>' + createTableHeaders();
		
		for(var i = 0; i<yearly.length; i++){
			tableString = tableString + createYearRow(yearly[i][0],yearly[i][1],yearly[i][2],yearly[i][3]);
			for(var j = 0; j<semseterly.length; j++){
				if(semseterly[j][4] == yearly[i][4]){
					tableString = tableString + createSemesterRow(semseterly[j][0],semseterly[j][1],semseterly[j][2],semseterly[j][3]);
				}
			}
		}
		console.log(tableString);
		tableString = tableString + '</tbody></table>';
		$("#gradesTable").append(tableString);
	});

	$('.breakrow').click(function() {
  		$(this).nextUntil('.breakrow').toggle("hide");
	});

});



function getAllData(data){
	data = getTwelvePoint(data);
	data = isIncluded(data);
	data = addAcademicYear(data);
	data = addSemester(data);
	data = calculateCredits(data)
	data = convertUnits(data);
	return data;	
}

function processRawData(rawData){
	var format = /[A-Z]+ +(.*)+\n+(.*)+\n+(.*)+\n+(.*)+\n+(.*)+\n+(.*)+/gm;
	var courses = [];
	while((row = format.exec(rawData)) !== null){
		var entry = row[0].split('\n');
		courses.push(entry);
	}
	return courses;
}

function getTwelvePoint(courses){
	for (var i=0;i<courses.length;i++){
		// get the Twelve Point grade from the letter grade
		var grade = courses[i][3];
		if(grade == 'A+'){
			courses[i].push(12);
		}
		else if(grade == 'A'){
			courses[i].push(11);
		}
		else if(grade == 'A-'){
			courses[i].push(10);
		}
		else if(grade == 'B+'){
			courses[i].push(9);
		}
		else if(grade == 'B'){
			courses[i].push(8);
		}
		else if(grade == 'B-'){
			courses[i].push(7);
		}
		else if(grade == 'C+'){
			courses[i].push(6);
		}
		else if(grade == 'C'){
			courses[i].push(5);
		}
		else if(grade == 'C-'){
			courses[i].push(4);
		}
		else if(grade == 'D+'){
			courses[i].push(3);
		}
		else if(grade == 'D'){
			courses[i].push(2);
		}
		else if(grade == 'D-'){
			courses[i].push(1);
		}
		else{
			courses[i].push(0);
		}
	}

	return courses;
}

function isIncluded(courses){
	for (var i=0;i<courses.length;i++){
		if((courses[i][5] == 'In Progress') || (courses[i][3] == 'NC') || (courses[i][3] == 'COM') || (courses[i][5] == 'Transferred')){
			courses[i].push(false);
		}
		else{
			courses[i].push(true);
		}
	}

	return courses;
}

function addAcademicYear(courses){
	for (var i=0;i<courses.length;i++){
		if(courses[i][2].substring(5,9) == 'Fall'){
			courses[i].push(parseInt(courses[i][2].substring(0,4)));
		}
		else{
			courses[i].push(parseInt(courses[i][2].substring(0,4)) - 1);
		}
	}

	return courses;
}

function addSemester(courses){
	for (var i=0;i<courses.length;i++){
		var semsester = courses[i][2].split(' ');
		courses[i].push(semsester[1]);
	}
	return courses;
}

function extractUniqueYears(years,courses){
	for (var i=0;i<courses.length;i++){
		if(courses[i][2].substring(5,9) == 'Fall'){
			years.push(parseInt(courses[i][2].substring(0,4)));
		}
		else{
			years.push(parseInt(courses[i][2].substring(0,4)) - 1);
		}
	}

	years = Array.from(new Set(years));
	return years;
}

function extractUniqueSemesters(semesters,courses){
	for (var i=0;i<courses.length;i++){
		semesters.push(courses[i][2]);
	}
	semesters = Array.from(new Set(semesters));
	semseters = semesters.sort();
	return semesters;
}

function calculateCredits(courses){
	for (var i=0;i<courses.length;i++){
		courses[i].push(courses[i][4]*courses[i][6]);
	}
	return courses;
}

function convertUnits(courses){
	for (var i=0;i<courses.length;i++){
		courses[i][4] = parseFloat(courses[i][4]);
	}
	return courses;
}

function calculateCumulativeGPA(cumulative,courses){
	//calculate final gpa
	totalCredits = 0;
	totalUnits = 0.0;
	for (var l = 0; l<courses.length; l++){
		if(courses[l][7] == true){
		totalUnits = totalUnits + parseInt(courses[l][4]);
		totalCredits = totalCredits + courses[l][10];
	}
}
	cumulative=['Cumulative',totalUnits.toString(),totalCredits.toString(),((totalCredits/totalUnits).toFixed(2)).toString()];
	return cumulative;
}

function calculateYearlyGPA(yearly,courses,years){
	var finalData = [];
	//calculate yearly gpa
	var totalCredits = 0;
	var totalUnits = 0.0;

	for (var j = 0; j<years.length; j++){
		totalCredits = 0;
		totalUnits = 0;
		for(var k = 0; k<courses.length; k++){
			if((courses[k][8] == years[j]) && courses[k][7] == true){
				totalUnits = totalUnits + parseInt(courses[k][4]);
				totalCredits = totalCredits + courses[k][10];
			}
		}
		finalData[j]=[years[j].toString() + '-' + (years[j]+1).toString(),totalUnits.toString(),totalCredits.toString(),((totalCredits/totalUnits).toFixed(2)).toString()];

	}

	for(var i = 0; i<finalData.length; i++){
		finalData[i].push(parseInt(finalData[i][0]));
	}

	yearly = finalData;
	return yearly;
}

function calculateSemesterlyGPA(semesterly,courses,semesters){
	var finalData = [];
	//calculate yearly gpa
	var totalCredits = 0;
	var totalUnits = 0.0;

	for (var j = 0; j<semseters.length; j++){
		totalCredits = 0;
		totalUnits = 0;
		for(var k = 0; k<courses.length; k++){
			if((courses[k][2] == semesters[j]) && courses[k][7] == true){
				totalUnits = totalUnits + parseInt(courses[k][4]);
				totalCredits = totalCredits + courses[k][10];
			}
		}
		finalData[j]=[semesters[j],totalUnits.toString(),totalCredits.toString(),((totalCredits/totalUnits).toFixed(2)).toString()];

	}

	finalData = academicYearID(finalData);

	semesterly = finalData.sort();
	return semesterly;
}


function academicYearID(data){
	for (var i = 0;i<data.length;i++){
		if (data[i][0].substring(5,9) == 'Fall'){
			data[i].push(parseInt(data[i][0].substring(0,4)));
		}
		else{
			data[i].push(parseInt(data[i][0].substring(0,4))-1);	
		}
	}
	return data;
}

function createTableHeaders(){
	return '<thead><tr class="tableheader"><th>Time Period</th><th>Units Taken</th><th>Credits Earned</th><th>GPA</th></tr></thead><tbody>'
}

function createYearRow(TimePeriod,Units,Credits,grade){
	return '<tr class="breakrow"><td>' + TimePeriod.toString() + '</td><td>' + Units.toString() + '</td><td>' + Credits.toString() + '</td><td>' + grade.toString() + '</td></tr>';

}

function createSemesterRow(TimePeriod,Units,Credits,grade){
	return '<tr class="datarow"><td>' + TimePeriod.toString() + '</td><td>' + Units.toString() + '</td><td>' + Credits.toString() + '</td><td>' + grade.toString() + '</td></tr>';
}
