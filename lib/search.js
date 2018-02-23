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

    $.each(cgf.sets, function (index, set) {
        if (sets !== undefined && sets.length > 0) {
            var found = false;

            $.each(sets, function (index, userSet) {
                if (set.setCode == userSet) {
                    found = true;
                }
            });

            if (!found) {
                return;
            }
        }

        $.each(set.cards, function (index, card) {
            if (name !== undefined && name.length > 0 &&
                !card["name"].toUpperCase().includes(name.toUpperCase())) {
                return;
            }

            filteredCards[filteredCards.length] = card
        });
    });

    var trimmedCards = [];

    for (var i = 0; i < filteredCards.length; i++) {
        var found = false;

        for (var j = 0; j < trimmedCards.length; j++) {
            if (i == j) {
                continue;
            }

            if (filteredCards[i].id == trimmedCards[j].id) {
                found = true;

                break;
            }
        }

        if (!found) {
            trimmedCards[trimmedCards.length] = filteredCards[i];
        }
    }

    trimmedCards.sort(function (a, b) {
        var result = a.name.toUpperCase().localeCompare(b.name.toUpperCase());

        if (result < 0) {
            return -1;
        }

        if (result > 0) {
            return 1;
        }
        return 0;
    });

    filteredCards = trimmedCards;
	
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
		var cardImage = card.image;
		var cardImageURL = card.image.url;
		var cardTypes = cgf.CardTypes(card);
		
        var cardSets = []
		
        $.each(cgf.sets, function (index, set) {
            if (cgf.GetCardAtSet(card.id, set.setCode))
            {
                cardSets[cardSets.length] = {
                    "setCode": set.setCode,
                    "collectorNumber": card.collectorNumber,
                    "setName": set.name,
                    "rarityColor": cgf.RarityColor(card.rarity),
                    "rarity": card.rarity,
                }
            }
		});
		
		var context = {
			"cardName": card.name, "cardWidth": cardSize.width,
			"cardHeight": cardSize.height, "cardWidthExtra": cardSize.width + 10,
			"cardRules": card.rules, "artist": cardImage.artist,
			"cardImageURL": cardImageURL, "cardSets": cardSets
		}
		
		var htmlString = resultTemplate(context);
		
		parent.append(htmlString);
	});
}
