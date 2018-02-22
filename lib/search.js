var filteredCards = [];

cgf.dataFinishLoadingHandler = function() {
	var parent = $("#content");
	var setCodeTemplate = Handlebars.compile($("#setCode-template").html());
	
	Handlebars.registerHelper('cardSetList', function(items) {
		var out = "";
		
		for(var i = 0; i < items.length; i++) {
			var item = items[i];
			
			out += setCodeTemplate(item);
		}
		
		return new Handlebars.SafeString(out);
	});
	
	var resultTemplate = Handlebars.compile($("#result-template").html());

	var name = cgf.pageParameters["name"]
	var sets = cgf.pageParameters["sets[]"]
	var first = true;
	
	$.each(cgf.cards, function(index, card) {
		if(name !== undefined && name.length > 0 &&
			!card["name"].toUpperCase().includes(name.toUpperCase())) {
			return;
		}
		
		var cardSets = cgf.CardSets(card);
		
		if(sets !== undefined && sets.length > 0) {
			var found = false;
			
			$.each(sets, function(index, set) {
				$.each(cgf.cardSets, function(index, object) {
					if(object == set) {
						found = true;
					}
				});
			});
			
			if(!found) {
				return;
			}
		}
		
		filteredCards[filteredCards.length] = card
	});
	
	$.each(filteredCards, function(index, card) {
		var targetSet = sets !== undefined ? sets[0] : undefined;
		var cardSets = cgf.CardSets(card);

		if(targetSet == undefined) {
			targetSet = cardSets[cardSets.length - 1];
		}
		
		if(first) {
			first = false;
		}
		else {
			parent.append("<hr>");
		}
		
		var cardSize = cgf.CardSize(card);
		var cardImage = cgf.CardImage(card, targetSet);
		var cardImageURL = cgf.CardImageURL(card, targetSet);
		var cardTypes = cgf.CardTypes(card);
		
		var cardSets = []
		
		$.each(card.sets, function(index, object) {
			cardSets[cardSets.length] = {
				"setCode": object["setCode"],
				"collectorNumber": object["collector_number"],
				"setName": cgf.SetName(object["setCode"]),
				"rarityColor": cgf.RarityColor(object["rarity"]),
				"rarity": object["rarity"],
			 }
		});
		
		var context = {
			"cardName": card["name"], "cardWidth": cardSize.width,
			"cardHeight": cardSize.height, "cardWidthExtra": cardSize.width + 10,
			"cardRules": card.rules, "artist": cardImage.artist, 
			"cardImageURL": cardImageURL, "cardSets": cardSets
		}
		
		var htmlString = resultTemplate(context);
		
		parent.append(htmlString);
	});
}
