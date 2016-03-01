jQuery.sap.declare("incture.inbox.Component");

sap.ui.core.UIComponent.extend("incture.inbox.Component",{
	metadata:{
		includes:[
		          "./css/Style.css"
		          ],
		routing:{
			
			config:{
				viewType: "XML",
				viewPath: "inbox"
			},
			
			routes:[
			        {
			        	pattern:"",
			        	name:"Master",
			        	target:["master"],
			        }
			        ],
			        
			targets:{
				"master":{
					viewName: "InboxContainer",
					type:"XML",
					controlAggregation:"pages",
					controlId:"myApp"
				}
			}
		}
	},
	
	init: function(){
		jQuery.sap.require("sap.m.routing.RouteMatchedHandler");
		jQuery.sap.require("sap.ui.core.routing.HashChanger");
		
		sap.ui.core.UIComponent.prototype.init.apply(this,arguments);
		
		this.router= this.getRouter();
		this.router.initialize();
	},
	
	createContent: function(){
		var oView = sap.ui.view({
			id:'app',
			viewName:"inbox.App",
			type:"XML",
			viewData: {component: this}
		});
		
//		var oModel = new sap.ui.model.odata.ODataModel("http://services.odata.org/V3/Northwind/Northwind.svc");
//		oView.setModel(oModel,"defaultModel");
		
		return oView;
	}
	
});