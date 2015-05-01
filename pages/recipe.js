function initXHR(x) {
    console.log(x);
    if (x == 'recipe') {
		retrieveActiveListsFromServer('data/recipeList.json');
		document.getElementById("recipe").style.display = "block";
	}
}

function retrieveActiveListsFromServer(url) {

	var xmlhttp = new XMLHttpRequest();
	var list;

	xmlhttp.onreadystatechange = function() {

		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            console.log('got here');
			var list = JSON.parse(xmlhttp.responseText);

			populateListsView('recipe', list);
		}
	}
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}

function populateListsView(elementId, list) {
	element = document.getElementById(elementId);
	var newElement = "";


  for (var i = 0; i < 1; i++) {
 newElement += "<div class=\"row\">";
    newElement += "<div class=\"col-lg-12\">";
    newElement += "<h1 class=\"page-header\">" +list[i].name+ "<small>" +list[i].chefName+ "</small></h1></div></div>";
    newElement += "<div class=\"row\">";
    newElement += "<div class=\"col-md-5\">";
    newElement += "<img class=\"img-responsive\" src=\"" + list[i].image + "\" alt=\"\"><p></p>";
    newElement += "<h5> <b>Prep Time : </b>" + list[i].prep + "</h5>";
newElement += "<h5> <b>Cook Time : </b>" + list[i].cooktime + "</h5>";
        newElement += "<h5> <b>Serving Size : </b>" + list[i].servings + "</h5></div>";
    newElement += "<div class=\"col-md-5\">";
    newElement += "<h4>Ingredients : </h4><ul>" + list[i].ingredients + "</ul><p></p></div>";

    newElement += "<div class=\"col-md-8\"><p></p><h2>Cooking Instructions</h2>";

    newElement += "<p>" + list[i].instructions + "</p></div></div><hr>";



    }
    element.innerHTML = newElement;
}
