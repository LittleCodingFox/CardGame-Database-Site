var siteTitle = "";
var siteNavigation = [];

var rarities = [];
var sets = [];
var cards = [];
var cardTypes = [];

var pageParameters = [];

var DataFinishLoadingHandler = function() {}

function RarityColor(rarityName) {
	var outColor = "";
	
	$.each(rarities, function(index, object) {
		if(object["name"] == rarityName)
		{
			outColor = object["color"];
		}
	});
	
	return outColor;
}

function SetName(setCode) {
	var setName = undefined;
	
	$.each(sets, function(index, object) {
		if(object["setCode"] == setCode)
		{
			setName = object["name"];
		}
	});
	
	return setName;
}

function SetCardCount(setCode) {
	var cardCount = 0;
	
	$.each(sets, function(index, object) {
		if(object["setCode"] == setCode)
		{
			cardCount = object["cardCount"];
		}
	});
	
	return cardCount;
}

function CardSets(card) {
	var outSets = [];
	
	$.each(card["sets"], function(index, object) {
		outSets[outSets.length] = object["setCode"];
	});
	
	return outSets;
}

function CardImage(card, setCode) {
	var outCardImage = undefined;
	
	$.each(card["images"], function(index, object) {
		if(object["setCode"] == setCode)
		{
			outCardImage = object;
		}
	});
	
	return outCardImage;
}

function CardType(name) {
	var outCardType = undefined
	
	$.each(cardTypes, function(index, object) {
		if(object["identifier"] == name)
		{
			outCardType = object;
		}
	});
	
	return outCardType;
}

function CardTypes(card) {
	var outCardTypes = []
	
	$.each(card["types"], function(index, object) {
		var cardType = CardType(object);
		
		if(cardType != undefined)
		{
			outCardTypes[outCardTypes.length] = cardType;
		}
	});
	
	return outCardTypes;
}

function CardSize(card) {
	var outCardSize = undefined;
	var cardTypes = CardTypes(card);
	
	$.each(cardTypes, function(index, object) {
		if(object["cardWidth"] != undefined && object["cardHeight"] != undefined) {
			outCardSize = { "width": object["cardWidth"], "height": object["cardHeight"] };
		}
	});
	
	return outCardSize;
}

function CardImageURL(card, setCode) {
	var cardImage = CardImage(card, setCode);
	
	if(cardImage != undefined) {
		return cardImage["url"];
	}
	
	return "";
}

function URLParameters() {
	var vars = {};
	window.location.href.replace( location.hash, '' ).replace( 
		/[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
		function( m, key, value ) { // callback
			if(key.includes("[]")) {
				if(value !== undefined) {
					if(vars[key] == undefined) {
						vars[key] = []
					}
					
					vars[key][vars[key].length] = value;
				}
			}
			else {
				vars[key] = value !== undefined ? value : '';
			}
		}
	);
	
	return vars;
}

function UpdateSiteTitle(title) {
	siteTitle = title
	window.document.title = siteTitle
	$(".navbar-brand").html(siteTitle);
}

function UpdateNavigation(navigation) {
	siteNavigation = navigation

	var content = $("<ul class='navbar-nav' id='navbar-content'></ul>") 
	
	UpdateNavigationChildren(siteNavigation, content);
	
	$("#navbarResponsive").append(content);
}

function UpdateNavigationChildren(navigation, content) {
	$.each(navigation, function(index, object) {
		var type = object["type"]
		
		if (type != undefined) {
			if(type == "search")
			{
				content.append($("<form class='form-inline' action='search.html' method='GET'><input class='form-control mr-sm-2' type='search' placeholder='Search' aria-label='Search' name='name'></form>"));
			}
			else if(type == "link")
			{
				var text = object["text"];
				var href = object["href"];
				
				var htmlString = "<li class='nav-item'><a class='nav-link' href='" + href + "'>" + text + "</a></li>"
				
				content.append(htmlString);
			}
			else if(type == "dropdown")
			{
				var text = object["text"]
				var items = object["items"]

				var parent = $("<div class='dropdown-menu' aria-labelledby='navbarDropdown" + text + "'></div>");
				
				UpdateNavigationSubChildren(items, parent);
				
				var htmlString = "<li class='nav-item dropdown'><a class='nav-link dropdown-toggle' href='#' id='navbarDropdown" + text + "' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>" + text + "</a>" +
					"<div class='dropdown-menu' aria-labelledby='navbarDropdown" + text + "'>" + parent.html() + "</div></li>";
				
				var outElement = $(htmlString);
				
				content.append(outElement);
			}
		}
	});
}

function UpdateNavigationSubChildren(navigation, content) {
	$.each(navigation, function(index, object) {
		var type = object["type"]
		
		if(type == "link")
		{
			var text = object["text"];
			var href = object["href"];
			
			var htmlString = "<a class='dropdown-item' href='" + href + "'>" + text + "</a>"
			
			content.append(htmlString);
		}
	});
}

$(document).ready(function() {
	pageParameters = URLParameters();
	
	var missingElements = 2;
	
	$.getJSON("config/navigation.json", function(result) {
		UpdateSiteTitle(result["site_title"])
		UpdateNavigation(result["navigation"])
		
		missingElements--;
		
		if(missingElements == 0)
		{
			DataFinishLoadingHandler();
			$(".rulespop").popover({trigger: 'hover', container: 'body'});
		}
	});
	
	$.getJSON("config/cards.json", function(result) {
		rarities = result["rarities"];
		sets = result["sets"];
		cards = result["cards"];
		cardTypes = result["types"];
		
		missingElements--;
		
		if(missingElements == 0)
		{
			DataFinishLoadingHandler();
			$(".rulespop").popover({trigger: 'hover', container: 'body'});
		}
	});
});
