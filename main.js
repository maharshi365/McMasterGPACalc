function processRawData(){
	rawData = document.getElementById("inputText").value
	console.log(rawData);
	var format = /[A-Z]+ +(.*)+\n+(.*)+\n+(.*)+\n+(.*)+\n+(.*)+\n+(.*)+/gm;
	
	var courses = [];
	var years = [];
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
			years.push(parseInt(courses[i][2].substring(0,4)));
		}
		else{
			courses[i].push(parseInt(courses[i][2].substring(0,4)) - 1);
			years.push(parseInt(courses[i][2].substring(0,4)) - 1);
		}

		// calculate credits earned
		courses[i].push(courses[i][4]*courses[i][6]);
	}

	//extract all unique years from data
	years = Array.from(new Set(years));
	
	//final data to return
	var finalData = [];

	//calculate yearly gpa
	var totalCredits = 0;
	var totalUnits = 0.0;

	for (var j = 0; j<years.length; j++){
		totalCredits = 0;
		totalUnits = 0;
		for(var k = 0; k<courses.length; k++){
			if(courses[k][8] == years[j]){
				totalUnits = totalUnits + parseInt(courses[k][4]);
				totalCredits = totalCredits + courses[k][9];
			}
		}
		finalData[j]=[years[j].toString(),totalUnits.toString(),totalCredits.toString(),((totalCredits/totalUnits).toFixed(2)).toString()];

	}

	//calculate final gpa
	totalCredits = 0;
	totalUnits = 0.0;
	for (var l = 0; l<courses.length; l++){
		if(courses[l][7] == 'True'){
		totalUnits = totalUnits + parseInt(courses[l][4]);
		totalCredits = totalCredits + courses[l][9];
	}
}
	finalData[j]=['Cumulative',totalUnits.toString(),totalCredits.toString(),((totalCredits/totalUnits).toFixed(2)).toString()];

	//add headers and table rows to output table
	var rows = finalData.length;
	var columns = finalData[0].length;
	var table = document.getElementById("mytable");
	var tableHeaders = ['Year','Units Taken', 'Credits Earned', '12 Point GPA'];
	
	// add table data
	for(var r = 0; r<rows; r++){
		var row = table.insertRow(r);
		for(var c = 0; c<columns; c++){
			var cell = row.insertCell(c);
			cell.innerHTML = finalData[r][c];
		}
	}

	//add table headers
	var row = table.insertRow(0);
	for(var n = 0; n<columns; n++){
		var cell = row.insertCell(n);
		cell.innerHTML = tableHeaders[n];
	}

}
