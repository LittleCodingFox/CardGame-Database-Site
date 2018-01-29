DataFinishLoadingHandler = function() {
	var parent = $("#content");
	var setCodeTemplate = Handlebars.compile($("#setCode-template").html());
	
	Handlebars.registerHelper('cardSetList', function(items) {
		var out = ""
		
		for(var i = 0; i < items.length; i++) {
			var item = items[i];
			
			out += setCodeTemplate(item)
		}
		
		return new Handlebars.SafeString(out);
	});
	
	var resultTemplate = Handlebars.compile($("#result-template").html());

	var name = pageParameters["name"]
	var set = pageParameters["set"]
	var first = true;
	
	$.each(cards, function(index, card) {
		if(name != undefined && name.length > 0 && !card["name"].includes(name))
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
		
		var cardSets = []
		
		$.each(card.sets, function(index, object) {
			cardSets[cardSets.length] = {
				"setCode": object["setCode"],
				 "collectorNumber": object["collector_number"],
				"setName": SetName(object["setCode"]),
				"rarityColor": RarityColor(object["rarity"]),
				"rarity": object["rarity"],
			 }
		});
		
		var context = {"cardName": card["name"], "cardWidth": cardSize.width,
			"cardHeight": cardSize.height, "cardRules": card.rules, "artist": cardImage.artist, 
			"cardImageURL": cardImageURL, "cardSets": cardSets
		}
		
		var htmlString = resultTemplate(context);
		
		parent.append(htmlString);
	});
}
