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
    
    newElement += "<div class=\"row\">";
    newElement += "<div class=\"col-lg-12\">";
    newElement += "<h1 class=\"page-header\">Recipe Name<small>Chef Name</small></h1></div></div>";
    newElement += "<div class=\"row\">";
    newElement += "<div class=\"col-md-5\">";
    newElement += "<img class=\"img-responsive\" src=\"" + list[0].image + "\" alt=\"\"></div>";
    newElement += "<div class=\"col-md-5\">";
    newElement += "<h4>Ingredients : </h4><ul>" + list[0].ingredients + "</ul><p></p>";
    newElement += "<h4>Prep Time : </h4><p>" + list[0].prep + "</p></div>";
    newElement += "<div class=\"col-md-8\"><p></p><h2>Cooking Instructions</h2>";
    newElement += "<p>" + list[0].instructions + "</p></div></div><hr>";

	element.innerHTML = newElement;
}
