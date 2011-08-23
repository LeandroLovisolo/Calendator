var startDate, currentDate = null;

$(function() {
	startDate = Date.today();
	while(!startDate.is().sunday()) startDate.add(-1).days();
	currentDate = startDate;
	
	// Populate the calendar
	$("tbody").empty();
	for(var i = 0; i < 4; i++) addWeek();
	
	// Bind events
	$("#more").click(addWeek);
	$("#less").click(removeWeek);
});

function addWeek() {
	var row = $("<tr></tr>");
	row.append("<td class='month'></td>");
	var newMonth = false;
	
	for(var i = 1; i <= 7; i++) {
		var cell = $("<td class='date'>" + currentDate.getDate() + "</td>");
		if(i == 1 || i == 7) cell.addClass("weekend");
		cell.click(toggleDate);
		row.append(cell);
		if(currentDate.getDate() == 1) newMonth = true;
		currentDate.add(1).days();
	}
	
	row.append("<td class='comments'><input type='text' maxlength='40'/></td>");
	
	if(newMonth || $("tbody").children().length == 0) {
		row.find("td.month").text(currentDate.toString("MMM yyyy"));
	}
	
	$("tbody").append(row);
	updateLessLink();
}

function removeWeek() {
	if($("tbody tr").length == 1) return;
	$("tbody tr:last").remove();
	currentDate.add(-7).days();
	updateLessLink();
}

function updateLessLink() {
	if($("tbody tr").length == 1) {
		$("#less").addClass("disabled");
	} else {
		$("#less").removeClass("disabled");	
	}
}

function toggleDate() {
	$(this).toggleClass("marked");
}

