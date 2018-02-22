var cgf = new CardGameDatabase();

$(document).ready(function() {
	cgf.pageParameters = cgf.URLParameters();
	
	var missingElements = 2;
	
	$.getJSON("config/navigation.json", function(result) {
		cgf.UpdateSiteTitle(result["site_title"])
		cgf.UpdateNavigation(result["navigation"])
		
		missingElements--;
		
		if(missingElements == 0)
		{
			cgf.dataFinishLoadingHandler();
			$(".rulespop").popover({trigger: 'hover', container: 'body'});
		}
	});
	
	$.getJSON("config/cards.json", function(result) {
		cgf.rarities = result["rarities"];
		cgf.sets = result["sets"];
		cgf.cards = result["cards"];
		cgf.cardTypes = result["types"];
		
		missingElements--;
		
		if(missingElements == 0)
		{
			cgf.dataFinishLoadingHandler();
			$(".rulespop").popover({trigger: 'hover', container: 'body'});
		}
	});
});
