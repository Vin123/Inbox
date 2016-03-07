sap.ui.controller("inbox.InboxContainer", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf inbox.InboxContainer
*/
	onInit: function() {
		
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf inbox.InboxContainer
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf inbox.InboxContainer
*/
	onAfterRendering: function() {
		var component = this.getView().byId("comp1");
		$("#"+this.getView().getId()).css("background-color","white");
		$("#"+component.getId()).css("background-color","white");
		$("#"+component.getId()).find("th").addClass("header");
		$("#"+component.getId()).find("th").find("span").addClass("table-header-text");
		
		var divs= $("#"+component.getId()).find("div");
		for(var i=0;i<divs.length;i++){
			var id=divs[i].getAttribute("id")
			if(id && id.indexOf("table") >0){
				$("#"+id).addClass("fix-table");
				break;
			}
		}
		
	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf inbox.InboxContainer
*/
//	onExit: function() {
//
//	}

});