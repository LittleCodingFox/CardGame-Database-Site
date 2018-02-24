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

    Handlebars.registerHelper('property', function (properties, propertyName) {
        var out = "";

        for (var i = 0; i < properties.length; i++) {
            var property = properties[i];

            if (property.name == propertyName) {
                if (property.type == "BOOL") {
                    out += property.boolValue ? "YES" : "NO";
                }
                else if (property.type == "INT") {
                    out += property.intValue;
                }
                else if (property.type == "STRING") {
                    out += property.stringValue;
                }

                break;
            }
        }

        return new Handlebars.SafeString(out);
    });

    Handlebars.registerHelper('propertyFormat', function (properties, format, propertyName) {
        var out = "";
        var propertyValue = null;

        for (var i = 0; i < properties.length; i++) {
            var property = properties[i];

            if (property.name == propertyName) {
                if (property.type == "BOOL") {
                    propertyValue = property.boolValue ? "YES" : "NO";
                }
                else if (property.type == "INT") {
                    propertyValue = property.intValue;
                }
                else if (property.type == "STRING") {
                    propertyValue = property.stringValue;
                }
            }
        }

        if (propertyValue !== null) {
            var args = [propertyValue];

            out = format.replace(/{(\d+)}/g, function (match, number) {
                return typeof args[number] != 'undefined' ? args[number] : match;
            });
        }

        return new Handlebars.SafeString(out);
    });

    Handlebars.registerHelper('propertyFormat2', function (properties, format, propertyName1, propertyName2) {
        var out = "";
        var propertyValue1 = null;
        var propertyValue2 = null;

        for (var i = 0; i < properties.length; i++) {
            var property = properties[i];

            if (property.name == propertyName1) {
                if (property.type == "BOOL") {
                    propertyValue1 = property.boolValue ? "YES" : "NO";
                }
                else if (property.type == "INT") {
                    propertyValue1 = property.intValue;
                }
                else if (property.type == "STRING") {
                    propertyValue1 = property.stringValue;
                }
            }

            if (property.name == propertyName2) {
                if (property.type == "BOOL") {
                    propertyValue2 = property.boolValue ? "YES" : "NO";
                }
                else if (property.type == "INT") {
                    propertyValue2 = property.intValue;
                }
                else if (property.type == "STRING") {
                    propertyValue2 = property.stringValue;
                }
            }
        }

        if (propertyValue1 !== null && propertyValue2 !== null)
        {
            var args = [propertyValue1, propertyValue2];

            out = format.replace(/{(\d+)}/g, function (match, number) {
                return typeof args[number] != 'undefined' ? args[number] : match;
            });
        }

        return new Handlebars.SafeString(out);
    });
	
	var resultTemplate = Handlebars.compile($("#result-template").html());

    var name = cgf.pageParameters["name"];
    var sets = cgf.pageParameters["sets[]"];
    var page = cgf.pageParameters["page"];
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

    var counter = 0;

    if (page === undefined) {
        page = 1;
    }
    else {
        page = parseInt(page);
    }

    var pageCount = Math.ceil(trimmedCards.length / 10.0);

    for (var i = 0; i < (page - 1) * 10; i++)
    {
        if (trimmedCards.length > 0) {
            trimmedCards.splice(0, 1);
        }
    }

    while (trimmedCards.length > 10) {
        trimmedCards.splice(10, 1);
    }

    filteredCards = trimmedCards;

    var paginationString = "";

    if (pageCount > 1) {
        var getData = "search.html?name=";

        if (name !== undefined) {
            getData += name;
        }

        if (sets !== undefined) {
            for (var i = 0; i < sets.length; i++) {
                getData += "&sets[]=" + sets[i];
            }
        }

        paginationString = "<nav aria-label='Pagination'>\n" +
            "<ul class='pagination justify-content-center'>\n";

        if (page > 1) {
            paginationString += "<li class='page-item'><a class='page-link' href='" + getData + "&page=" + (page - 1) + "'>Previous</a></li>\n";
        }

        var startIndex = 1;

        if (page > 3) {
            startIndex = page - 2;
        }

        for (var i = startIndex; i < startIndex + 5; i++) {
            if (i > pageCount) {
                break;
            }

            paginationString += "<li class='page-item'><a class='page-link' href='" + getData + "&page=" + i + "'>";

            if (i == page) {
                paginationString += "<strong>";
            }

            paginationString += i;

            if (i == page) {
                paginationString += "</strong>";
            }

            paginationString += "</a></li>\n";
        }

        if (page + 1 <= pageCount) {
            paginationString += "<li class='page-item'><a class='page-link' href='" + getData + "&page=" + (page + 1) + "'>Next</a></li>\n";
        }

        paginationString += "</ul></nav>";

        parent.append(paginationString);
    }
	
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
            "cardName": card.name,
            "cardWidth": cardSize.width,
            "cardHeight": cardSize.height,
            "cardWidthExtra": cardSize.width + 10,
            "cardType": card.type,
            "cardRules": card.rules,
            "artist": cardImage.artist,
            "cardImageURL": cardImageURL,
            "cardSets": cardSets,
            "cardProperties": card.properties,
		}

        var resultString = resultTemplate(context);
		
        parent.append(resultString);
	});

    if (pageCount > 1) {
        parent.append("<br />" + paginationString);
    }
}
