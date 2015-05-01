function initXHR(x) {
    console.log(x);
    if (x == 'list') {
		retrieveActiveListsFromServer('data/recipeList.json');
		document.getElementById("list").style.display = "block";
	}
}

function retrieveActiveListsFromServer(url) {

	var xmlhttp = new XMLHttpRequest();
	var list;

	xmlhttp.onreadystatechange = function() {

		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var list = JSON.parse(xmlhttp.responseText);
			populateListsView('list', list);
		}
	}
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}

function populateListsView(elementId, list) {
	element = document.getElementById(elementId);
	var newElement = "";
    for (var i = 0; i < list.length; i++) {
        newElement += "<div class=\"row\">";
        newElement += "<div class=\"col-md-4\">";
        newElement += "<a href=\"recipeView.html\">";
        newElement += "<img class=\"img-responsive\" src=\"" + list[i].image +  "\" alt=\"\">";
        newElement += "</a>";
        newElement += "<p></p>";
        newElement += "<a><span class=\"glyphicon glyphicon-edit\"></span></a>";
        newElement += "<a><span class=\"glyphicon glyphicon-trash\"></span></a>";
        newElement += "</div>";
        newElement += "<div class=\"col-md-5\">";
        newElement += "<h4>" + list[i].name + "</h4>";
        newElement += "<h5>Description</h5>";
        newElement += "<p>" + list[i].description + "</p>";
        newElement += "<a class=\"btn btn-xl\" href=\"recipeView.html\">View Full Recipe <span class=\"glyphicon glyphicon-chevron-right\"></span></a>";
        newElement += "</div>";
        newElement += "<div class=\"col-md-3\">";
        newElement += "<h4>Shared With</h4>";
        for (var j = 0; j < list[i].sharedWith.length; j++) {
            newElement += "<li>" + list[i].sharedWith[j] + "</li>";
        }
        newElement += "<a><span class=\"glyphicon glyphicon-plus-sign\"></span></a>";
        newElement += "</div>";
        newElement += "</div>";
        newElement += "<hr>";
    }
	element.innerHTML = newElement;
}
