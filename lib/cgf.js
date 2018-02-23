function CardGameDatabase() {
	this.siteTitle = "";
	this.siteNavigation = [];
	this.rarities = [];
	this.sets = [];
	this.cardTypes = [];
	this.pageParameters = [];
	this.dataFinishLoadingHandler = function() {};

	return this;
}

CardGameDatabase.prototype.RarityColor = function(rarityName) {
	var outColor = "";
	
	$.each(this.rarities, function(index, object) {
		if(object.name == rarityName) {
			outColor = object.color;
		}
	});
	
	return outColor;
}

CardGameDatabase.prototype.SetName = function(setCode) {
	var setName = null;
	
	$.each(this.sets, function(index, object) {
		if(object.setCode == setCode) {
			setName = object.name;
		}
	});
	
	return setName;
}

CardGameDatabase.prototype.SetCardCount = function(setCode) {
	var cardCount = 0;
	
	$.each(this.sets, function(index, set) {
		if(set.setCode == setCode) {
			cardCount = set.cards.length;
		}
	});
	
	return cardCount;
}

CardGameDatabase.prototype.GetCardAtSet = function (id, setCode) {
    var outCard = null;

    $.each(this.sets, function (index, object) {
        if (object.setCode != setCode)
        {
            return;
        }

        $.each(object.cards, function (index, card) {
            if (card.id == id)
            {
                outCard = card;
            }
        });
    });

    return outCard;
}

CardGameDatabase.prototype.CardSets = function (card) {
    var self = this;
	var outSets = [];
	
    $.each(this.sets, function (index, object) {
        if (self.GetCardAtSet(card.id, object.setCode) !== null) {
            outSets[outSets.length] = object.setCode;
        }
	});
	
	return outSets;
}

CardGameDatabase.prototype.CardType = function(name) {
	var outCardType = null
	
	$.each(this.cardTypes, function(index, object) {
		if(object.identifier == name) {
			outCardType = object;
		}
	});
	
	return outCardType;
}

CardGameDatabase.prototype.CardTypes = function(card) {
	var self = this;
	var outCardTypes = []
	
	$.each(card.types, function(index, object) {
		var cardType = self.CardType(object);
		
		if(cardType != null) {
			outCardTypes[outCardTypes.length] = cardType;
		}
	});
	
	return outCardTypes;
}

CardGameDatabase.prototype.CardSize = function(card) {
	var outCardSize = null;
	var cardTypes = this.CardTypes(card);
	
	$.each(cardTypes, function(index, object) {
		if(object.cardWidth != null && object.cardHeight != null) {
			outCardSize = { "width": object.cardWidth, "height": object.cardHeight };
		}
	});
	
	return outCardSize;
}

//---------- Page Specific Behaviour

CardGameDatabase.prototype.URLParameters = function() {
	var vars = {};
	window.location.href.replace( location.hash, '' ).replace( 
		/[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
		function( m, key, value ) { // callback
			if(key.includes("[]")) {
				if(value !== null) {
					if(vars[key] == null) {
						vars[key] = []
					}
					
					vars[key][vars[key].length] = value;
				}
			}
			else {
				vars[key] = value !== null ? value : '';
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
		
		if (type != null) {
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
