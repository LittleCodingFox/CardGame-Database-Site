function CardTypesForCategory(category) {
	var outList = []
	
	$.each(cardTypes, function(index, object) {
		var type = object["type"];
		var objectCategory = object["category"]
		var identifier = object["identifier"]
		var name = object["name"]
		
		if(type == "item" && objectCategory == category)
		{
			outList[outList.length] = { "name": name, "identifier": identifier }
		}
	});
	
	return outList;
}

function UpdateCardTypes() {
	var parent = $("select[name=card_type\\[\\]]")
	parent.html("");
	
	$.each(cardTypes, function(index, object) {
		var type = object["type"];
		var identifier = object["identifier"];
		var name = object["name"];
		
		if(type == "category")
		{
			var element = $("<optgroup label='" + name + "'></optgroup>");
			var children = CardTypesForCategory(name);
			
			$.each(children, function(childIndex, childObject) {
				var childElement = $("<option value='" + childObject["identifier"] + "'>" + childObject["name"] + "</option>");
				
				element.append(childElement);
			});
			
			parent.append(element);
		}
	});
}

DataFinishLoadingHandler = function() {
	console.log("Updating card types");
	UpdateCardTypes();
};
