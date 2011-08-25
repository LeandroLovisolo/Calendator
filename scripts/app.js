var startDate, currentDate = null;
var startMouseY = 0;

$(function() {
	startDate = Date.today();
	while(!startDate.is().sunday()) startDate.add(-1).days();
	currentDate = startDate;
	
	// Populate the calendar
	$("tbody").empty();
	for(var i = 0; i < 12; i++) addWeek();
	
	// Bind events
	$("#grippie").mousedown(startDragging);
	$("#print").click(function() { print(); });
});

function startDragging(event) {
	$(document).mousemove(dragging);
	$(document).mouseup(stopDragging);
	startMouseY = event.clientY;
	if(event.target.setCapture) event.target.setCapture();
	event.preventDefault();
}

function dragging(event) {
	if(Math.abs(event.clientY - startMouseY) > $("tbody tr").height()) {
		if((event.clientY - startMouseY) > 0) addWeek();
		else removeWeek();
		startMouseY = event.clientY;
	}
	event.preventDefault();
}

function stopDragging(event) {
	$(document).unbind("mousemove");
	$(document).unbind("mouseup");
	if(event.target.releaseCapture) event.target.releaseCapture();
}

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
}

function removeWeek() {
	if($("tbody tr").length == 1) return;
	$("tbody tr:last").remove();
	currentDate.add(-7).days();
}

function toggleDate() {
	$(this).toggleClass("marked");
}

