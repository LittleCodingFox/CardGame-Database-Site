function CardGameDatabase() {
	this.siteTitle = "";
	this.siteNavigation = [];
	this.rarities = [];
	this.sets = [];
	this.cards = [];
	this.cardTypes = [];
	this.pageParameters = [];
	this.dataFinishLoadingHandler = function() {};

	return this;
}

CardGameDatabase.prototype.RarityColor = function(rarityName) {
	var outColor = "";
	
	$.each(this.rarities, function(index, object) {
		if(object["name"] == rarityName) {
			outColor = object["color"];
		}
	});
	
	return outColor;
}

CardGameDatabase.prototype.SetName = function(setCode) {
	var setName = undefined;
	
	$.each(this.sets, function(index, object) {
		if(object["setCode"] == setCode) {
			setName = object["name"];
		}
	});
	
	return setName;
}

CardGameDatabase.prototype.SetCardCount = function(setCode) {
	var cardCount = 0;
	
	$.each(this.sets, function(index, object) {
		if(object["setCode"] == setCode) {
			cardCount = object["cardCount"];
		}
	});
	
	return cardCount;
}

CardGameDatabase.prototype.CardSets = function(card) {
	var outSets = [];
	
	$.each(card["sets"], function(index, object) {
		outSets[outSets.length] = object["setCode"];
	});
	
	return outSets;
}

CardGameDatabase.prototype.CardImage = function(card, setCode) {
	var outCardImage = undefined;
	
	$.each(card["images"], function(index, object) {
		if(object["setCode"] == setCode) {
			outCardImage = object;
		}
	});
	
	return outCardImage;
}

CardGameDatabase.prototype.CardType = function(name) {
	var outCardType = undefined
	
	$.each(this.cardTypes, function(index, object) {
		if(object["identifier"] == name) {
			outCardType = object;
		}
	});
	
	return outCardType;
}

CardGameDatabase.prototype.CardTypes = function(card) {
	var self = this;
	var outCardTypes = []
	
	$.each(card["types"], function(index, object) {
		var cardType = self.CardType(object);
		
		if(cardType != undefined) {
			outCardTypes[outCardTypes.length] = cardType;
		}
	});
	
	return outCardTypes;
}

CardGameDatabase.prototype.CardSize = function(card) {
	var outCardSize = undefined;
	var cardTypes = this.CardTypes(card);
	
	$.each(cardTypes, function(index, object) {
		if(object["cardWidth"] != undefined && object["cardHeight"] != undefined) {
			outCardSize = { "width": object["cardWidth"], "height": object["cardHeight"] };
		}
	});
	
	return outCardSize;
}

CardGameDatabase.prototype.CardImageURL = function(card, setCode) {
	var cardImage = this.CardImage(card, setCode);
	
	if(cardImage != undefined) {
		return cardImage["url"];
	}
	
	return "";
}

//---------- Page Specific Behaviour

CardGameDatabase.prototype.URLParameters = function() {
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

//---------- Site Specific Behaviour

CardGameDatabase.prototype.UpdateSiteTitle = function(title) {
	siteTitle = title
	window.document.title = siteTitle
	$(".navbar-brand").html(siteTitle);
}

CardGameDatabase.prototype.UpdateNavigation = function(navigation) {
	siteNavigation = navigation

	var content = $("<ul class='navbar-nav' id='navbar-content'></ul>") 
	
	this.UpdateNavigationChildren(siteNavigation, content);
	
	$("#navbarResponsive").append(content);
}

CardGameDatabase.prototype.UpdateNavigationChildren = function(navigation, content) {
	var self = this;

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
				
				self.UpdateNavigationSubChildren(items, parent);
				
				var htmlString = "<li class='nav-item dropdown'><a class='nav-link dropdown-toggle' href='#' id='navbarDropdown" + text + "' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>" + text + "</a>" +
					"<div class='dropdown-menu' aria-labelledby='navbarDropdown" + text + "'>" + parent.html() + "</div></li>";
				
				var outElement = $(htmlString);
				
				content.append(outElement);
			}
		}
	});
}

CardGameDatabase.prototype.UpdateNavigationSubChildren = function(navigation, content) {
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
