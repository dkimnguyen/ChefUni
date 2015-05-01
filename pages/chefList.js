function initXHR(x) {
    console.log(x);
    if (x == 'chefList') {

        retrieveActiveListsFromServer('data/chefList.json');

        document.getElementById("chefList").style.display = "block";
    }
}

function retrieveActiveListsFromServer(url) {

    var xmlhttp = new XMLHttpRequest();
    var list;

    xmlhttp.onreadystatechange = function() {

        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var list = JSON.parse(xmlhttp.responseText);
            populateListsView('chefList', list);
        }
    }
    xmlhttp.open("GET", url, true);

    xmlhttp.send();
}

function populateListsView(elementId, list) {
    element = document.getElementById(elementId);
    var newElement = "";
    for (var i = 0; i < list.length; i++) {
        newElement += "<div class=\"col-lg-4 col-sm-6 text-center\">";
        newElement += "<a href=\"chef.html\">";
        newElement += "<img class=\"img-circle img-responsive img-center\" src=\"" + list[i].image +  "\" alt=\"\">";
        newElement += "</a>";
        newElement += "<p></p>";
        newElement += "<h4>" + list[i].chefName + "<small>:"+ list[i].restraunt+"</small></h4>";
        newElement += "<p>" + list[i].description + "</p></div>";
    }
    element.innerHTML = newElement;
}
