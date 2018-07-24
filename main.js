function processRawData(){
	rawData = document.getElementById("inputText").value
	console.log(rawData);
	var format = /[A-Z]+ +(.*)+\n+(.*)+\n+(.*)+\n+(.*)+\n+(.*)+\n+(.*)+/gm;
	
	var courses = [];
	while((row = format.exec(rawData)) !== null){
		var entry = row[0].split('\n');
		courses.push(entry);
	}

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

		// Check to see if course should be included in GPA Calc
		if((courses[i][5] == 'In Progress') || (courses[i][3] == 'NC') || (courses[i][3] == 'COM') || (courses[i][5] == 'Transferred')){
			courses[i].push('False');
		}
		else{
			courses[i].push('True');
		}

		// calculate academic year of course taken
		if(courses[i][2].substring(5,9) == 'Fall'){
			courses[i].push(parseInt(courses[i][2].substring(0,4)));
		}
		else{
			courses[i].push(parseInt(courses[i][2].substring(0,4)) - 1);
		}

		// calculate credits earned
		courses[i].push(courses[i][4]*courses[i][6]);
	}

	var totalCredits = 0;
	var totalUnits = 0.0;

	for (var j = 0; j<courses.length; j++){
		if(courses[j][7] == 'True'){
		totalUnits = totalUnits + parseInt(courses[j][4]);
		totalCredits = totalCredits + courses[j][9];
	}
}
	alert(totalCredits/totalUnits);
}
