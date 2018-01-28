DataFinishLoadingHandler = function() {
	var parent = $("#content");

	var name = pageParameters["name"]
	var set = pageParameters["set"]
	var first = true;
	
	$.each(cards, function(index, card) {
		if(name.length > 0 && !card["name"].includes(name))
		{
			return;
		}
		
		var cardSets = CardSets(card);
		var targetSet = set;
		
		if(set != null)
		{
			var found = false;
			
			$.each(cardSets, function(index, object) {
				if(object["setCode"] == set)
				{
					found = true;
				}
			});
			
			if(!found)
			{
				return;
			}
		}
		
		if(targetSet == undefined)
		{
			targetSet = cardSets[cardSets.length - 1];
		}
		
		if(first) {
			first = false;
		}
		else {
			parent.append("<hr>");
		}
		
		var cardSize = CardSize(card);
		var cardImage = CardImage(card, targetSet);
		var cardImageURL = CardImageURL(card, targetSet);
		var cardTypes = CardTypes(card);
		
		var htmlString = "<div class='row-fluid'><div class='span9'><div class='media pull-left'><img width='" + cardSize["width"] + "' height='" + cardSize["height"] + "' class='img-rounded lazy' alt='" + card["name"] + "' title='" + card["name"] + "' src='" + cardImageURL + "' /></div>";
		
		htmlString += "<div style='margin-left: " + (cardSize["width"] + 10) + "px;'><h1 class='cardtitle'><a href='#'>" + card["name"] + "</a></h1>";
		htmlString += "<p class='cardfront'>" + card["rules"] + "</p>";
		htmlString += "<p>Art by: " + cardImage["artist"] + "</p>";
		htmlString += "</div></div>";
		
		htmlString += "<div class='span3'><small><u><strong>Editions:</strong></u><br />";
		
		$.each(card.sets, function(index, object) {
			var setString = "";

			if(object["setCode"] == targetSet)
			{
				setString += "<strong>";
			}
			
			setString += SetName(object["setCode"]);

			if(object["setCode"] == targetSet)
			{
				setString += "</strong>";
			}
			
			setString += "&nbsp;(" + object["collector_number"] + "-<span style='color:" + RarityColor(object["rarity"]) + "'>" + object["rarity"] + "</span>)<br />";
			
			htmlString += setString;
		});
		
		htmlString += "</small></div>";
		
		htmlString += "</div>";
		
		parent.append(htmlString);
	});
}
