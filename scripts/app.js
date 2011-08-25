var startDate, currentDate = null;
var startMouseY = 0;
var markedDates = [], comments = [];

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

	// Prepare the comments cell
	var commentsCell = $("<td class='comments'><input type='text' maxlength='40'/></td>");

	// Remember comments
	commentsCell.find("input")[0].date = currentDate.clone();
	var rememberComments = function() {
		var comment = null;
		for(var i = 0; i < comments.length; i++) {
			if(comments[i].date.compareTo(this.date) == 0) {
				comment = comments[i];
			}
		}
		if(comment == null) {
			comment = {date: this.date, text: null};
			comments.push(comment);
		}
		comment.text = $(this).val();
	};
	commentsCell.find("input").keyup(rememberComments);
	commentsCell.find("input").change(rememberComments);

	// Load previously entered comments
	for(var i = 0; i < comments.length; i++) {
		if(comments[i].date.compareTo(currentDate) == 0) {
			commentsCell.find("input").val(comments[i].text);
		}
	}	

	for(var i = 1; i <= 7; i++) {
		var cell = $("<td class='date'>" + currentDate.getDate() + "</td>");
		if(!currentDate.isWeekday()) cell.addClass("weekend");

		// Add the "marked" class if the user marked this date
		for(var j = 0; j < markedDates.length; j++) {
			if(markedDates[j].compareTo(currentDate) == 0) {
				cell.addClass("marked");
				break;
			}
		}

		// Mark/unmark dates when clicked
		cell[0].date = currentDate.clone();
		cell.click(function() {
			var wasMarked = false;
			for(var j = 0; j < markedDates.length; j++) {
				if(markedDates[j].compareTo(this.date) == 0) {
					markedDates.splice(j, 1);
					wasMarked = true;
					break;
				}
			}
			if(!wasMarked) markedDates.push(this.date);
			$(this).toggleClass("marked");			
		});

		row.append(cell);
		if(currentDate.getDate() == 1) newMonth = true;
		currentDate.add(1).days();
	}
	
	row.append(commentsCell);
	
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