jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.Column");

jQuery.sap.declare("incture.bpmInbox.customComponent.Component");

sap.ui.core.UIComponent.extend("incture.bpmInbox.customComponent.Component",{
	metadata:{
		includes:[
		          "../css/Style.css","/util/formatter.js","sap.ui.comp.filterbar"
		          ],
		properties:{
			tpext: "string",
			width: "string",
			tableButtonAlign: "string",
			tableButtons: "string",
			tableButtonNames: "string",
			tableColumnNames: "string",
			tableColumns: "string",
				
			tableColumnNo: "string",
			filterList:"string"
		}
	}
});

incture.bpmInbox.customComponent.Component.prototype.createContent= function(){
	var that= this;
	
	/**set resource model**/ 
	var resourceModel = new sap.ui.model.resource.ResourceModel({
		bundleName: "incture.inbox.i18n.inboxi18n"
	});
	sap.ui.getCore().setModel(resourceModel, "i18n");

	
	var panel = new sap.m.Panel({
		expandable: false,
		content:[]
	}).addStyleClass("panel-style");
	
	this.SelectFilterTask = new sap.m.Select({
		width : "11rem", 
		maxWidth : "100%",
		selectedKey : "", 
		selectedItemId : "", 
		items : [ 
		   new sap.ui.core.Item({
			text : "Open Tasks",
			key : "open", 
		}),
		new sap.ui.core.Item({
			text : "Completed Tasks",
			key : "completed", 
		}),
		new sap.ui.core.Item({
			text : "Overdue Tasks",
			key : "overdue", 
		}),
		new sap.ui.core.Item({
			text : "Escalated Tasks",
			key : "escalated", 
		})],
		
		selectedItem : undefined,
		change : [ function(oEvent) {
			var control = oEvent.getSource();
			var key= control.getSelectedKey();
			switch(key){
			case "open": 
				var model=that.getOpenTasks();
				that.oTable.setModel(model,"bpmModel");
				break;
			case "completed":
				var model=that.getCompletedTasks();
				that.oTable.setModel(model,"bpmModel");
				break;
			case "overdue":
				var model=that.getOverdueTasks();
				that.oTable.setModel(model,"bpmModel");
				break;
			case "escalated":
				var model=that.getEscalatedTasks();
				that.oTable.setModel(model,"bpmModel");
				break;
				
			}
		}, this ]
	});

	var searchBar = new sap.m.Toolbar({
		width : "100%", 
		active : false,
		enabled : true,
		height : "", 
		design : sap.m.ToolbarDesign.Auto, 
		tooltip : undefined, 
		content : [
		           new sap.ui.core.Icon({
					src : "sap-icon://filter", 
					size : "1.2em", 
					color : "#ff6666",
					hoverColor : "#e60000",
					activeColor : undefined,
					width : undefined,
					height : "30px", 
					backgroundColor : undefined,
					hoverBackgroundColor : undefined,
					activeBackgroundColor : undefined, 
					decorative : true, 
					useIconTooltip : true, 
					alt : undefined,
					tooltip : undefined, 
					press : [ function(oEvent) {
						var control = oEvent.getSource();
						that.openFilters(oEvent);
					}, this ]
		           }),
		           this.SelectFilterTask ,
		           new sap.m.ToolbarSpacer({}),
		           new sap.m.SearchField({
					value : undefined, 
					width : "30%", 
					enabled : true, 
					visible : true, 
					placeholder : undefined,
					showRefreshButton : false,
					showSearchButton : true, 
					selectOnFocus : true,
					tooltip : undefined, 
					search : [ function(oEvent) {
						var control = oEvent.getSource();
						that.searchTable(oEvent);
					}, this ],
					liveChange : [ function(oEvent) {
						var control = oEvent.getSource();
					}, this ]
				}).addStyleClass("search-height")
		           ]
	});
	
	this.headerToolBar = new sap.m.Toolbar({
		width : "100%", 
		active : false,
		enabled : true,
		height : "", 
		design : sap.m.ToolbarDesign.Auto, 
		tooltip : undefined, 
		content : []
	});
	this.headerToolBar.addStyleClass("whiteBG");
	this.headerToolBar.addContent(new sap.ui.core.Icon({
		src : "sap-icon://refresh", 
		size : "1.2em", 
		color : "#ff6666",
		hoverColor : "#e60000",
		activeColor : undefined,
		width : undefined,
		height : "30px", 
		backgroundColor : undefined,
		hoverBackgroundColor : undefined,
		activeBackgroundColor : undefined, 
		decorative : true, 
		useIconTooltip : true, 
		alt : undefined,
		tooltip : undefined, 
		press : [ function(oEvent) {
			var control = oEvent.getSource();
			that.refreshTable(oEvent);
		}, this ]
       }));
	
	this.columnListItem = new sap.m.ColumnListItem({
    	cells:[],
    	//type:sap.m.ListType.Active,
    	press: function(oEvent){
    		that.activeItem = oEvent.getSource().getBindingContextPath("bpmModel").split("/")[3];
    		if(that.activeItem){
    			var btns= that.headerToolBar.getContent();
    			that.enableButtons(btns,true,that.activeItem);
    		}else{
    			var btns= that.headerToolBar.getContent();
    			that.enableButtons(btns, false);
    		}
    	}
    });
	
	this.oTable = new sap.m.Table({
		items : [], 
		columns : [],
		mode : sap.m.ListMode.SingleSelectLeft,
		growing: true,
		growingThreshold: 10,
		updateFinished: function(oEvent){
			var control= oEvent.getSource();
			var id= control.getId();
			$("#"+id).find("th").addClass("header");
			$("#"+id).addClass("fix-table");

			if($(window).width() < 500){
				var btns= that.headerToolBar.getContent();
				for(var i=0;i<btns.length;i++){
					if(btns[i].getMetadata()._sClassName === "sap.m.Button"){
						btns[i].setText("");
					}
				}
			}
		},
		itemPress: function(oEvent){
		},
		selectionChange: function(oEvent){
    		that.activeItem = oEvent.getParameter("listItem").getBindingContextPath("bpmModel").split("/")[3];
    		if(that.activeItem){
    			var btns= that.headerToolBar.getContent();
    			that.enableButtons(btns,true,that.activeItem);
    		}else{
    			var btns= that.headerToolBar.getContent();
    			that.enableButtons(btns, false);
    		}
    	}
	});
	
	panel.addContent(searchBar);
	panel.addContent(this.headerToolBar);
	panel.addContent(this.oTable);
	
	var i18n= sap.ui.getCore().getModel("i18n");
	var text= i18n.getResourceBundle().getText("DETAIL_TITLE");
	return panel;
};

incture.bpmInbox.customComponent.Component.prototype.setWidth = function(sWidth){
	return this;
};

incture.bpmInbox.customComponent.Component.prototype.setTableButtonAlign = function(alignment){
	this.setProperty("tableButtonAlign",alignment);
	return this;
};

incture.bpmInbox.customComponent.Component.prototype.setTableButtonNames = function(oButtonNames){
	var nameArr = oButtonNames.split(",");
	for(var i=0,j=0;i< nameArr.length, j<this.headerToolBar.getContent().length; i++,j++){
		var btn =this.headerToolBar.getContent()[j];
		if(btn.getMetadata()._sClassName !== "sap.m.Button"){
			if(i !== nameArr.length-1){
				i=i-1;
			}
		}else{
			btn.setText(nameArr[i]);
		}
	}

	return this;
};

incture.bpmInbox.customComponent.Component.prototype.enableButtons = function(btnList,enable, itemId){
	if(enable){
		for(var i=0;i<btnList.length;i++){
			if(btnList[i].getMetadata()._sClassName === "sap.m.Button"){
				var type= btnList[i].getIcon().split("/")[2];
				var item= this.oTable.getModel("bpmModel").getData().d.results[itemId];
				switch(type){
					case "locked":if(item.SupportsClaim){
						btnList[i].setEnabled(true);
					}else{
						btnList[i].setEnabled(false);
					} ;//claim
					break;
					case "unlocked":if(item.SupportsRelease){
						btnList[i].setEnabled(true);
					} else{
						btnList[i].setEnabled(false);
					};//release
					break;
					case "forward": if(item.SupportsForward){
						btnList[i].setEnabled(true);
					}else{
						btnList[i].setEnabled(false);
					};//forward
					default: btnList[i].setEnabled(true);
				}
			}
		}
	}else{
		for(var i=0;i<btnList.length;i++){
			if(btnList[i].getMetadata()._sClassName === "sap.m.Button"){
				btnList[i].setEnabled(false);
			}
		}
	}
};

incture.bpmInbox.customComponent.Component.prototype.setTableButtons = function(oButtons){
	var that=this;
	var nameArr = oButtons.split(",");
	
	if(this.getProperty("tableButtonAlign") !== "left"){
		this.headerToolBar.addContent(new sap.m.ToolbarSpacer());
	}
	
	for(var i=0;i< nameArr.length; i++){
		var aIcon = this.getButtonIcon(nameArr[i]);
		var aButton= new sap.m.Button({
			enabled: false,
			icon: aIcon,
			text: nameArr[i],
			press: function(oEvent){
				var control= oEvent.getSource();
				if(control.getIcon().split("/")[2]){
					switch(control.getIcon().split("/")[2]){
					case "locked": that.claim(oEvent);
					break;
					case "open-folder": that.open(oEvent, false);
					break;
					case "unlocked": that.release(oEvent);
					break;
					case "forward": that.forward(oEvent);
					break;
					}
				}
			}
		});
		//aButton.addStyleClass("small-width");
		this.headerToolBar.addContent(aButton);
	}

	return this;
};

incture.bpmInbox.customComponent.Component.prototype.getButtonIcon = function(oBtn){
	var icon="";
	switch(oBtn){
	case "Open": icon = "sap-icon://open-folder";
	break;
	case "Claim": icon = "sap-icon://locked";
	break;
	case "Release":icon = "sap-icon://unlocked";
	break;
	case "Forward":icon = "sap-icon://forward";
	break;
	}
	return icon;
}

incture.bpmInbox.customComponent.Component.prototype.setTableColumnNames = function(oColumns){
	var nameArr = oColumns.split(",");
	
	var that= this;
	for(var i=0;i< nameArr.length; i++){
		var aColumn= new sap.m.Column({
			header : new MyText({text: nameArr[i], data: this.columnListItem.getCells()[i].data("type")}), 
			styleClass : "whiteBG"
		});
		
		var cell =this.columnListItem.getCells()[i];
		if(cell.getMetadata()._sClassName === "sap.m.Link"){
			var width= (100/parseInt(this.getProperty("tableColumnNo")))*2;
			aColumn.setWidth(width+"%");
		}
		this.oTable.addColumn(aColumn);
	}

	return this;
};

incture.bpmInbox.customComponent.Component.prototype.setTableColumns = function(oColumns){
	var colArr = oColumns.split(",");
	this.setProperty("tableColumnNo",colArr.length);
	for(var i=0;i< colArr.length; i++){
		var aCell = this.getCellControl(i,colArr[i].trim());
		this.columnListItem.addCell(aCell);
	}
	this.oTable.bindItems("bpmModel>/d/results",this.columnListItem);
	
	var oModel= this.getAllBPMTasks();
	if(!oModel.getData().d){
		oModel.loadData("customComponent/Mockdata.json",null,false);
	}
	this.oTable.setModel(oModel,"bpmModel");
	
	return this;
};

incture.bpmInbox.customComponent.Component.prototype.setFilterLists = function(filters){
	this.setProperty("filterList",filters);
};

incture.bpmInbox.customComponent.Component.prototype.openFilters = function(oEvent){
	var that=this;
	if(!this._filterPopUp){
		var filters = this.getProperty("filterList");
		filters = filters.split(",");
		var filterContent=[];
		for(var i=0; i< filters.length;i++){
			var btnList = this.getFilterButtons(filters[i].trim());
			var panel= new sap.m.Panel({
           	 expandable:true,
        	 headerText: filters[i],
        	 content: new sap.m.RadioButtonGroup({
        		 buttons:btnList
        		})
    		 });
			filterContent.push(panel);
		}
		
		var list = new sap.m.List({
			items: [
			         new sap.m.CustomListItem({content:filterContent})
			        ],
		})
		
		this._filterPopUp = new sap.m.ResponsivePopover({
			placement : sap.m.PlacementType.Bottom, // sap.m.PlacementType
			showHeader : false, // boolean
			icon : undefined, // sap.ui.core.URI
			modal : undefined, // boolean
			offsetX : undefined, // int
			offsetY : undefined, // int
			contentWidth : undefined, // sap.ui.core.CSSSize
			contentHeight : undefined, // sap.ui.core.CSSSize
			horizontalScrolling : true, // boolean
			verticalScrolling : true, // boolean
			showCloseButton : true, // boolean
			content : [list], // sap.ui.core.Control
			customHeader : undefined, // sap.m.IBar
			subHeader : undefined, // sap.m.IBar
			beforeOpen : [ function(oEvent) {
				var control = oEvent.getSource();
			}, this ],
			afterOpen : [ function(oEvent) {
				var control = oEvent.getSource();
			}, this ],
			beforeClose : [ function(oEvent) {
				var control = oEvent.getSource();
			}, this ],
			afterClose : [ function(oEvent) {
				var control = oEvent.getSource();
			}, this ]
		});
	}
	this._filterPopUp.openBy(oEvent.getSource());
	
	var id= this._filterPopUp.getId();
	$("#"+id+"-popover").find("h1").css("font-size","small");
	$("#"+id+"-popover").find("label").css("font-size","smaller");
	//$("#"+header.getAttribute("id")).css("background-color","#ff6666");
	
};

incture.bpmInbox.customComponent.Component.prototype.getFilterButtons = function(filter){
	var btnList= [];
	var that=this;
	switch(filter){
	case "Task Type": btnList.push(new sap.m.RadioButton({
					  	  text:"One Task",
						  selected:false,
						  select: function(oEvent){
							 
						  }
					  }));
					  btnList.push(new sap.m.RadioButton({
						  text:"Employee Task",
						  selected:false,
						  select: function(oEvent){
						  }
					  }));
					  break;
	case "Priority": btnList.push(new sap.m.RadioButton({
						  text:"All",
						  selected:false,
						  groupName: "priority",
						  select: function(oEvent){
						  var oBinding=that.oTable.getBinding("items");
//						      oBinding.filter([]);
						  var filters= oBinding.aFilters;
							  if(filters.length == 0){
								  oBinding.filter([]);
							  }else{
								  for(var i=0;i<filters.length;i++){
									  if(filters[i].sPath=== "Priority"){
										  filters.splice(i,1);
										  oBinding.filter(filters);
										  break;
									  }
								  }
							  }
						  }
					}));
					btnList.push(new sap.m.RadioButton({
						  text:"Low",
						  selected:false,
						  groupName: "priority",
						  select: function(oEvent){
							  var oBinding=that.oTable.getBinding("items");
							  var filters= oBinding.aFilters;
							  if(filters.length == 0){
								  oBinding.filter(new sap.ui.model.Filter("Priority","EQ","LOW"));
							  }else{
								  var isPresent=false;
								  for(var i=0;i<filters.length;i++){
									  if(filters[i].sPath=== "Priority"){
										  isPresent= true;
										  filters[i]= new sap.ui.model.Filter("Priority","EQ","LOW");
										  break;
									  }
								  }
								  if(!isPresent){
									  filters.push(new sap.ui.model.Filter("Priority","EQ","LOW"));
								  }
								  oBinding.filter(filters);
							  }
						    //  var oFilter=new sap.ui.model.Filter("Priority","EQ","LOW");
						  }
					}));
					btnList.push(new sap.m.RadioButton({
				    	  text:"Medium",
				    	  selected:false,
				    	  groupName: "priority",
				    	  select: function(oEvent){
							  var oBinding=that.oTable.getBinding("items");
							  var filters= oBinding.aFilters;
							  if(filters.length == 0){
								  oBinding.filter(new sap.ui.model.Filter("Priority","EQ","MEDIUM"));
							  }else{
								  var isPresent=false;
								  for(var i=0;i<filters.length;i++){
									  if(filters[i].sPath=== "Priority"){
										  isPresent= true;
										  filters[i]= new sap.ui.model.Filter("Priority","EQ","MEDIUM");
										  break;
									  }
								  }
								  if(!isPresent){
									  filters.push(new sap.ui.model.Filter("Priority","EQ","MEDIUM"));
								  }
								  oBinding.filter(filters);
							  }
						  }
				      }));
					btnList.push(new sap.m.RadioButton({
				    	  text:"High",
				    	  selected:false,
				    	  groupName: "priority",
				    	  select: function(oEvent){
							  var oBinding=that.oTable.getBinding("items");
							  var filters= oBinding.aFilters;
							  if(filters.length == 0){
								  oBinding.filter(new sap.ui.model.Filter("Priority","EQ","HIGH"));
							  }else{
								  var isPresent=false;
								  for(var i=0;i<filters.length;i++){
									  if(filters[i].sPath=== "Priority"){
										  isPresent= true;
										  filters[i]= new sap.ui.model.Filter("Priority","EQ","HIGH");
										  break;
									  }
								  }
								  if(!isPresent){
									  filters.push(new sap.ui.model.Filter("Priority","EQ","HIGH"));
								  }
								  oBinding.filter(filters);
							  }
						  }
				      }));
					btnList.push(new sap.m.RadioButton({
				    	  text:"Very High",
				    	  selected:false,
				    	  groupName: "priority",
				    	  select: function(oEvent){
							  var oBinding=that.oTable.getBinding("items");
							  var filters= oBinding.aFilters;
							  if(filters.length == 0){
								  oBinding.filter(new sap.ui.model.Filter("Priority","EQ","VERY_HIGH"));
							  }else{
								  var isPresent=false;
								  for(var i=0;i<filters.length;i++){
									  if(filters[i].sPath=== "Priority"){
										  isPresent= true;
										  filters[i]= new sap.ui.model.Filter("Priority","EQ","VERY_HIGH");
										  break;
									  }
								  }
								  if(!isPresent){
									  filters.push(new sap.ui.model.Filter("Priority","EQ","VERY_HIGH"));
								  }
								  oBinding.filter(filters);
							  }
						  }
				      }));
					 break;
	case "Status":btnList.push(new sap.m.RadioButton({
					  text:"All",
					  selected:false,
					  groupName: "status",
					  select: function(oEvent){
						  var oBinding=that.oTable.getBinding("items");
						  var filters= oBinding.aFilters;
							  if(filters.length == 0){
								  oBinding.filter([]);
							  }else{
								  for(var i=0;i<filters.length;i++){
									  if(filters[i].sPath=== "Status"){
										  filters.splice(i,1);
										  oBinding.filter(filters);
										  break;
									  }
								  }
							  }
						  
//						  var oBinding=that.oTable.getBinding("items");
//					      oBinding.filter([]);
//						  var oBinding=that.oTable.getBinding("items");
//						  var filters= oBinding.aFilters;
//						  if(filters.length == 0){
//							  oBinding.filter([]);
//						  }else{
//							  for(var i=0;i<filters.length;i++){
//								  if(filters[i].sPath=== "Status"){
//									  debugger;
//									  filters[i]= new sap.ui.model.Filter("Priority","EQ","MEDIUM");
//								  }
//							  }
//						  }
					  }
					}));
					btnList.push(new sap.m.RadioButton({
					  text:"Ready",
					  selected:false,
					  groupName: "status",
					  select: function(oEvent){
//						  var oBinding=that.oTable.getBinding("items");
//					      var oFilter=new sap.ui.model.Filter("Status","EQ","Ready");
//					      oBinding.filter([oFilter]);
//						  var oBinding=that.oTable.getBinding("items");
//						  var filters= oBinding.aFilters;
//						  if(filters.length == 0){
//							  oBinding.filter([new sap.ui.model.Filter("Status","EQ","Ready")]);
//						  }else{
//							  for(var i=0;i<filters.length;i++){
//								  if(filters[i].sPath=== "Status"){
//									  filters[i]= new sap.ui.model.Filter("Status","EQ","Ready");
//								  }
//							  }
//						  }
						  var oBinding=that.oTable.getBinding("items");
						  var filters= oBinding.aFilters;
						  if(filters.length == 0){
							  oBinding.filter(new sap.ui.model.Filter("Status","EQ","Ready"));
						  }else{
							  var isPresent=false;
							  for(var i=0;i<filters.length;i++){
								  if(filters[i].sPath=== "Status"){
									  isPresent= true;
									  filters[i]= new sap.ui.model.Filter("Status","EQ","Ready");
									  break;
								  }
							  }
							  if(!isPresent){
								  filters.push(new sap.ui.model.Filter("Status","EQ","Ready"));
							  }
							  oBinding.filter(filters);
						  }
					  }
					}));
					btnList.push(new sap.m.RadioButton({
					  text:"Reserved",
					  selected:false,
					  groupName: "status",
					  select: function(oEvent){
//						  var oBinding=that.oTable.getBinding("items");
//					      var oFilter=new sap.ui.model.Filter("Status","EQ","Reserved");
//					      oBinding.filter([oFilter]);
						  var oBinding=that.oTable.getBinding("items");
						  var filters= oBinding.aFilters;
						  if(filters.length == 0){
							  oBinding.filter(new sap.ui.model.Filter("Status","EQ","Reserved"));
						  }else{
							  var isPresent=false;
							  for(var i=0;i<filters.length;i++){
								  if(filters[i].sPath=== "Status"){
									  isPresent= true;
									  filters[i]= new sap.ui.model.Filter("Status","EQ","Reserved");
									  break;
								  }
							  }
							  if(!isPresent){
								  filters.push(new sap.ui.model.Filter("Status","EQ","Reserved"));
							  }
							  oBinding.filter(filters);
						  }
					  }
					}));
					btnList.push(new sap.m.RadioButton({
						  text:"In Progress",
						  selected:false,
						  groupName: "status",
						  select: function(oEvent){
//							  var oBinding=that.oTable.getBinding("items");
//						      var oFilter=new sap.ui.model.Filter("Status","EQ","IN_PROGRESS");
//						      oBinding.filter([oFilter]);
							  var oBinding=that.oTable.getBinding("items");
							  var filters= oBinding.aFilters;
							  if(filters.length == 0){
								  oBinding.filter(new sap.ui.model.Filter("Status","EQ","IN_PROGRESS"));
							  }else{
								  var isPresent=false;
								  for(var i=0;i<filters.length;i++){
									  if(filters[i].sPath=== "Status"){
										  isPresent= true;
										  filters[i]= new sap.ui.model.Filter("Status","EQ","IN_PROGRESS");
										  break;
									  }
								  }
								  if(!isPresent){
									  filters.push(new sap.ui.model.Filter("Status","EQ","IN_PROGRESS"));
								  }
								  oBinding.filter(filters);
							  }
						  }
					}));
					break;
	case "Creation Date": btnList.push(new sap.m.RadioButton({
						  text:"All",
						  selected:false,
						  select: function(oEvent){
//							  var oBinding=that.oTable.getBinding("items");
//						      oBinding.filter([]);

							  var oBinding=that.oTable.getBinding("items");
							  var filters= oBinding.aFilters;
								  if(filters.length == 0){
									  oBinding.filter([]);
								  }else{
									  for(var i=0;i<filters.length;i++){
										  if(filters[i].sPath=== "CreatedOn"){
											  filters.splice(i,1);
											  oBinding.filter(filters);
											  break;
										  }
									  }
								  }
							  
						  }
						})); 
						btnList.push(new sap.m.RadioButton({
						  text:"Today",
						  selected:false,
						  select: function(oEvent){
							  var oBinding=that.oTable.getBinding("items");
							  var filters= oBinding.aFilters;
							  var today=new Date();
							  var dateFilter = new sap.ui.model.Filter("CreatedOn","EQ",today);
							  dateFilter.fnTest= function(value){
						    	  var today= new Date();
						    	  today=today.setHours(0,0,0,0);
						    	  value= new Date(parseInt(value.substr(6)));
						    	  value=value.setHours(0,0,0,0);
						    	  return today === value;
						      };
							  if(filters.length == 0){
								  oBinding.filter(dateFilter);
							  }else{
								  var isPresent=false;
								  for(var i=0;i<filters.length;i++){
									  if(filters[i].sPath=== "CreatedOn"){
										  isPresent= true;
										  filters[i]= dateFilter;
										  break;
									  }
								  }
								  if(!isPresent){
									  filters.push(dateFilter);
								  }
								  oBinding.filter(filters);
							  }
//							  var oBinding=that.oTable.getBinding("items");
//							  var today=new Date();
//						      var oFilter=new sap.ui.model.Filter("CreatedOn","EQ",today);
//						      oFilter.fnTest= function(value){
//						    	  var today= new Date();
//						    	  today=today.setHours(0,0,0,0);
//						    	  value= new Date(parseInt(value.substr(6)));
//						    	  value=value.setHours(0,0,0,0);
//						    	  return today === value;
//						      };
//						      oBinding.filter([oFilter]);
						  }
						}));
						btnList.push(new sap.m.RadioButton({
							  text:"Less than 7 days",
							  selected:false,
							  select: function(oEvent){
								  var oBinding=that.oTable.getBinding("items");
								  var filters= oBinding.aFilters;
								  var today=new Date();
								  var dateFilter = new sap.ui.model.Filter("CreatedOn","EQ",today);
								  dateFilter.fnTest= function(value){
									  var nextDay=new Date();
							    	  nextDay.setDate(nextDay.getDate()- 7);
							    	  
							    	  nextDay=nextDay.setHours(0,0,0,0);
							    	  
							    	  value= new Date(parseInt(value.substr(6)));
							    	  value=value.setHours(0,0,0,0);
							    	  
							    	  return value > nextDay;
							      };
								  if(filters.length == 0){
									  oBinding.filter(dateFilter);
								  }else{
									  var isPresent=false;
									  for(var i=0;i<filters.length;i++){
										  if(filters[i].sPath=== "CreatedOn"){
											  isPresent= true;
											  filters[i]= dateFilter;
											  break;
										  }
									  }
									  if(!isPresent){
										  filters.push(dateFilter);
									  }
									  oBinding.filter(filters);
								  }
//								  var oBinding=that.oTable.getBinding("items");
//								  var today=new Date();
//							      var oFilter=new sap.ui.model.Filter("CreatedOn","EQ",today);
//							      oFilter.fnTest= function(value){
//							    	  var nextDay=new Date();
//							    	  nextDay.setDate(nextDay.getDate()- 7);
//							    	  
//							    	  nextDay=nextDay.setHours(0,0,0,0);
//							    	  
//							    	  value= new Date(parseInt(value.substr(6)));
//							    	  value=value.setHours(0,0,0,0);
//							    	  
//							    	  return value > nextDay;
//							      };
//							      oBinding.filter([oFilter]);
							  }
						}));
						btnList.push(new sap.m.RadioButton({
							  text:"Less than 15 days",
							  selected:false,
							  select: function(oEvent){
								  var oBinding=that.oTable.getBinding("items");
								  var filters= oBinding.aFilters;
								  var today=new Date();
								  var dateFilter = new sap.ui.model.Filter("CreatedOn","EQ",today);
								  dateFilter.fnTest= function(value){
									  var nextDay=new Date();
							    	  nextDay.setDate(nextDay.getDate()- 15);
							    	  
							    	  nextDay=nextDay.setHours(0,0,0,0);
							    	  
							    	  value= new Date(parseInt(value.substr(6)));
							    	  value=value.setHours(0,0,0,0);
							    	  
							    	  return value > nextDay;
							      };
								  if(filters.length == 0){
									  oBinding.filter(dateFilter);
								  }else{
									  var isPresent=false;
									  for(var i=0;i<filters.length;i++){
										  if(filters[i].sPath=== "CreatedOn"){
											  isPresent= true;
											  filters[i]= dateFilter;
											  break;
										  }
									  }
									  if(!isPresent){
										  filters.push(dateFilter);
									  }
									  oBinding.filter(filters);
								  }
//								  var oBinding=that.oTable.getBinding("items");
//								  var today=new Date();
//							      var oFilter=new sap.ui.model.Filter("CreatedOn","EQ",today);
//							      oFilter.fnTest= function(value){
//							    	  var nextDay=new Date();
//							    	  nextDay.setDate(nextDay.getDate()- 15);
//							    	  
//							    	  nextDay=nextDay.setHours(0,0,0,0);
//							    	  
//							    	  value= new Date(parseInt(value.substr(6)));
//							    	  value=value.setHours(0,0,0,0);
//							    	  
//							    	  return value > nextDay;
//							      };
//							      oBinding.filter([oFilter]);
							  }
						}));
						break;
	
	}
	return btnList;
};

incture.bpmInbox.customComponent.Component.prototype.getCellControl = function(columnNo, oColumn){
	var returnControl=null;
	var that=this;
	switch(oColumn){
	case "TaskTitle":returnControl= new sap.m.Link({
			text : "{bpmModel>TaskTitle}",
			href : "", 
			emphasized : true, 
			tooltip : undefined, 
			press : [ function(oEvent) {
				var control = oEvent.getSource();
				that.open(oEvent, true);
			}, this ]
		}).addStyleClass("link");
		returnControl.data("type","TaskTitle");
		break;
	case "CreationDate":returnControl=new sap.m.Text({
			text: "{parts:[{path:'bpmModel>CreatedOn'}], formatter: 'formatter.formatDate' }"
		});
		returnControl.data("type","CreationDate");
		break;
	case "CreatedBy":returnControl=new sap.m.Text({
			text: "{bpmModel>CreatedBy}"
		});
		returnControl.data("type","CreatedBy");
		break;
	case "DueDate":returnControl=new sap.m.Text({
			text: "{parts:[{path:'bpmModel>ExpiryDate'}], formatter: 'formatter.formatDate' }"
		});
		returnControl.data("type","DueDate");
		break;
	case "Status":returnControl=new sap.m.Text({
			text: "{parts:[{path:'bpmModel>Status'}], formatter: 'formatter.formatStatus' }"
		});
		returnControl.data("type","Status");
		break;
	case "Priority":returnControl=new sap.m.Text({
			text: "{parts:[{path:'bpmModel>Priority'}], formatter: 'formatter.formatPriority' }"
		});
		returnControl.data("type","Priority");
		break;
	}
	return returnControl;
};

incture.bpmInbox.customComponent.Component.prototype.searchTable = function(oEvent){
	var searchValue = oEvent.getSource().getValue();
	searchValue= searchValue.toLowerCase();
	
	
	var items= this.oTable.getItems();
	var v;
	var count=0;
	var g=null;
	var C=0;
	for(var i=0;i< items.length; i++){
		if(items[i] instanceof sap.m.GroupHeaderListItem){
			
		}else{
			v= this.applySearchPatternToListItem(items[i], searchValue);
			items[i].setVisible(v);
			if(v){
				count++;
				C++;
			}
		}
	}
	if(g){
		if(C == 0){
			g.setVisible(false);
		}else{
			g.setVisible(true);
			g.setCount(C);
		}
	}
	return count;
};

incture.bpmInbox.customComponent.Component.prototype.applySearchPatternToListItem = function(i, searchValue){
	if(searchValue === ""){
		return true;
	}
	var property= this.oTable.getModel("bpmModel").getData().d.results[i.getBindingContextPath().split("/")[3]];
	for(var k in property){
		var v= property[k];
		if(typeof v === "string"){
			if(v.toLowerCase().indexOf(searchValue) !== -1){
				return true;
			}
		}
	}
	return false;
};

incture.bpmInbox.customComponent.Component.prototype.getAllBPMTasks = function(){
	var typeOfTask="ne";
	var url="http://192.168.1.149:50000/bpmodata/tasks.svc/TaskCollection?$skip=0&$orderby=CreatedOn desc &$filter=Status ne 'COMPLETED'&$expand=TaskDefinitionData&$format=json";
	var method="GET";
	var oParam=null;
	
	return this.makeAjaxGetCall(url);
//	var oHeader= {
//			"X-Requested-With": "XMLHttpRequest",
//            "Content-Type": "application/atom+xml",
//            "DataServiceVersion": "2.0",       
//            "X-CSRF-Token":"Fetch" 
//           };
//	return this.makeSapCall(url, method, oParam, oHeader);
};

incture.bpmInbox.customComponent.Component.prototype.makeSapCall = function(url, method, oParam, oHeader){
	if(!oHeader){
		oHeader={"Content-Type":"application/json; charset=utf-8"};
	}
	var that=this;
	var oModel = new sap.ui.model.json.JSONModel(); 
	oModel.attachRequestCompleted(function(response){
		//that.token= response.getParameter("headers").
    });
     oModel.loadData(url, JSON.stringify(oParam), false,method,false,false,oHeader);
     
     if(oModel.getData() && Object.keys(oModel.getData()).length){
        return oModel;
     }else{
    	 oModel.loadData("customComponent/Mockdata.json",null,false);
     	return oModel;
     }
};

incture.bpmInbox.customComponent.Component.prototype.claim = function(oEvent){
	var task = this.oTable.getModel("bpmModel").getData().d.results[this.activeItem];
	var that=this;
	sap.m.MessageBox.confirm("Do you want to claim '"+task.TaskTitle+"'",{
		icon: sap.m.MessageBox.Icon.INFORMATION,
        title: "Information",
        actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
        onClose: function(oAction) {
        	if(oAction === "OK"){
        		var url= "http://192.168.1.149:50000/bpmodata/tasks.svc/Claim?InstanceID='"+task.InstanceID+"'&$format=json"
        		//that.makeSapCall(url,"POST",null);
        		that.makeAjaxPostCall(url,"handleClaimSuccess");
        	}
        	var btns= that.headerToolBar.getContent();
			for(var i=0;i<btns.length;i++){
				if(btns[i].getMetadata()._sClassName === "sap.m.Button"){
					btns[i].setEnabled(false);
				}
			}
        }
	});
};

incture.bpmInbox.customComponent.Component.prototype.handleClaimSuccess = function(oEvent){
	sap.m.MessageToast.show("Successfully claimed", {
	    duration: 3000,                 
	    width: "15em",                  
	});
	
	var url="http://192.168.1.149:50000/bpmodata/tasks.svc/TaskCollection?$skip=0&$orderby=CreatedOn desc &$filter=Status ne 'COMPLETED'&$expand=TaskDefinitionData&$format=json";
	var method="GET";
	var oParam=null;
	
	var oModel= this.makeAjaxGetCall(url);
	this.oTable.setModel(oModel,"bpmModel");
	
};

incture.bpmInbox.customComponent.Component.prototype.handleReleaseSuccess = function(oEvent){
	sap.m.MessageToast.show("Successfully Released", {
	    duration: 3000,                 
	    width: "15em",                  
	});
	var url="http://192.168.1.149:50000/bpmodata/tasks.svc/TaskCollection?$skip=0&$orderby=CreatedOn desc &$filter=Status ne 'COMPLETED'&$expand=TaskDefinitionData&$format=json";
	var method="GET";
	var oParam=null;
	
	var oModel= this.makeAjaxGetCall(url);
	this.oTable.setModel(oModel,"bpmModel");
	
};

incture.bpmInbox.customComponent.Component.prototype.handleForwardSuccess = function(oEvent){
	sap.m.MessageToast.show("Successfully Forwarded", {
	    duration: 3000,                 
	    width: "15em",                  
	});
	var url="http://192.168.1.149:50000/bpmodata/tasks.svc/TaskCollection?$skip=0&$orderby=CreatedOn desc &$filter=Status ne 'COMPLETED'&$expand=TaskDefinitionData&$format=json";
	var method="GET";
	var oParam=null;
	
	var oModel= this.makeAjaxGetCall(url);
	this.oTable.setModel(oModel,"bpmModel");
	
};


incture.bpmInbox.customComponent.Component.prototype.open = function(oEvent, isLink){
	var that=this;
	var task="";
	if(isLink){
		var control= oEvent.getSource();
		var id= control.getBindingContext("bpmModel").getPath().split("/")[3];
		task = this.oTable.getModel("bpmModel").getData().d.results[id];
	}else{
		task = this.oTable.getModel("bpmModel").getData().d.results[this.activeItem];
	}
	
	var url="http://192.168.1.149:50000/bpmodata/tasks.svc/TaskCollection(InstanceID='"+task.InstanceID+"',SAP__Origin='SAPSERVER_PO1_00')/UIExecutionLink?$format=json";
	var urlModel= this.makeAjaxGetCall(url);
	
	var link= urlModel.getData().d.GUI_Link;
	window.open(link);
};

incture.bpmInbox.customComponent.Component.prototype.release = function(oEvent){
	var that=this;
	var task = this.oTable.getModel("bpmModel").getData().d.results[this.activeItem];
	
	sap.m.MessageBox.confirm("Do you want to Release '"+task.TaskTitle+"'",{
		icon: sap.m.MessageBox.Icon.INFORMATION,
        title: "Release Task",
        actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
        onClose: function(oAction) {
        	if(oAction === "OK"){
        		var url= "http://192.168.1.149:50000/bpmodata/tasks.svc/Release?InstanceID='"+task.InstanceID+"'&$format=json"
        		that.makeAjaxPostCall(url,"handleReleaseSuccess");
        	}
        	var btns= that.headerToolBar.getContent();
			for(var i=0;i<btns.length;i++){
				if(btns[i].getMetadata()._sClassName === "sap.m.Button"){
					btns[i].setEnabled(false);
				}
			}
        }
	});
};

incture.bpmInbox.customComponent.Component.prototype.forward = function(oEvent){
	var that=this;
	var task = this.oTable.getModel("bpmModel").getData().d.results[this.activeItem];
	this.searchModel= new sap.ui.model.json.JSONModel();
	var template= new sap.m.StandardListItem({
		title:"{DisplayName}",
		description:"{UniqueName}"
	})
	var dialog= new sap.m.SelectDialog({
		title:"Select Freind",
		multiSelect: false,
		rememberSelections: true,
		items:[],
		search:function(oEvent){
			var control= oEvent.getSource();
			var searchVal= oEvent.getParameter("value")
			var url = "http://192.168.1.149:50000/bpmodata/tasks.svc/SearchUsers?SearchPattern='"+searchVal+"'&MaxResults=100&$format=json";
			that.searchModel =that.makeSapCall(url,"GET",null);
			control.setModel(that.searchModel);
		},
		confirm: function(oEvent){
			var item= oEvent.getParameter("selectedItem");
			var id = item.getBindingContextPath().split("/")[3];
			var usr= oEvent.getSource().getModel().getData().d.results[id];
			
			var url = "http://192.168.1.149:50000/bpmodata/tasks.svc/Forward?InstanceID='"+task.InstanceID+"'&ForwardTo='"+usr.UniqueName+"'&$format=json";
			that.makeAjaxPostCall(url,"handleForwardSuccess");
		}
	})
	
	dialog.bindAggregation("items","/d/results",template);
	
	dialog.open();
};

incture.bpmInbox.customComponent.Component.prototype.getOpenTasks = function(){
	var model =null;
	var url="http://192.168.1.149:50000/bpmodata/tasks.svc/TaskCollection?$skip=0&$orderby=CreatedOn desc &$filter=Status ne 'COMPLETED'&$expand=TaskDefinitionData&$format=json";
	model= this.makeAjaxGetCall(url);
	this.refreshFilters();
	return model;
};

incture.bpmInbox.customComponent.Component.prototype.getCompletedTasks = function(){
	var model =null;
	var url="http://192.168.1.149:50000/bpmodata/tasks.svc/TaskCollection?$skip=0&$orderby=CreatedOn desc &$filter=Status eq 'COMPLETED'&$expand=TaskDefinitionData&$format=json";
	model= this.makeAjaxGetCall(url);
	this.refreshFilters();
	return model;
};

incture.bpmInbox.customComponent.Component.prototype.getOverdueTasks = function(){
	var model =null;
	var today= new Date();
	
	var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd" });   
	var timeFormat = sap.ui.core.format.DateFormat.getTimeInstance({pattern: "KK:mm:ss"});  
	
	/** timezoneOffset is in hours convert to milliseconds **/  
	var TZOffsetMs = new Date(0).getTimezoneOffset()*60*1000;  
	var dateStr = dateFormat.format(new Date(today.getTime() + TZOffsetMs)); //05-12-2012   
	var timeStr = timeFormat.format(new Date(today + TZOffsetMs));  //11:00 AM  
	var formattedDate = dateStr + "T" + timeStr;
	
	var url="http://192.168.1.149:50000/bpmodata/tasks.svc/TaskCollection?$skip=0&$orderby=CreatedOn desc &$filter=CompletionDeadLine lt datetime'"+formattedDate+"' and Status ne 'COMPLETED'&$expand=TaskDefinitionData&$format=json";
	model= this.makeAjaxGetCall(url);
	this.refreshFilters();
	return model;
};

incture.bpmInbox.customComponent.Component.prototype.getEscalatedTasks = function(){
	var model =null;
	var url="http://192.168.1.149:50000/bpmodata/tasks.svc/TaskCollection?$skip=0&$orderby=CreatedOn desc &$filter=IsEscalated eq true and Status ne 'COMPLETED'&$expand=TaskDefinitionData&$format=json";
	model= this.makeAjaxGetCall(url);
	this.refreshFilters();
	return model;
};

incture.bpmInbox.customComponent.Component.prototype.refreshTable = function(){
	var key=this.SelectFilterTask.getSelectedKey();
	this.oTable.setBusy(true);
	switch(key){
	case "open": 
		var model=this.getOpenTasks();
		this.oTable.setModel(model,"bpmModel");
		break;
	case "completed":
		var model=this.getCompletedTasks();
		this.oTable.setModel(model,"bpmModel");
		break;
	case "overdue":
		var model=this.getOverdueTasks();
		this.oTable.setModel(model,"bpmModel");
		break;
	case "escalated":
		var model=this.getEscalatedTasks();
		this.oTable.setModel(model,"bpmModel");
		break;
	}
	this.oTable.setBusy(false);
	
};

incture.bpmInbox.customComponent.Component.prototype.refreshFilters = function(){
	if(this._filterPopUp){
		var panels= this._filterPopUp.getContent()[0].getAggregation("items")[0].getAggregation("content");
		for(var i=0;i < panels.length; i++){
			panels[i].getAggregation("content")[0].setSelectedIndex(0);
		}
	}
	
};

/*** backend calls ****/
incture.bpmInbox.customComponent.Component.prototype.makeAjaxPostCall = function(url,callBack){
	var that=this;
	this.oTable.setBusy(true);
	$.ajax({
		  dataType: "json",
		  url: url,
		  async: false,
		  method: "POST",
		  headers:
          {     
                         "X-Requested-With": "XMLHttpRequest",
                         "Content-Type": "application/atom+xml",
                         "DataServiceVersion": "2.0",       
                         "X-CSRF-Token":this.token   
          },
		  success: function(rData, jqXHR, options){
			  that.oTable.setBusy(false);
			  that.oTable.removeSelections();
			  var btns= that.headerToolBar.getContent();
			  that.enableButtons(btns, false);
			  that[callBack]();
		  },
		  error:function(error){
			  that.oTable.setBusy(false);
			  that.activeItem= null;
			  that.oTable.removeSelections();
			  var btns= that.headerToolBar.getContent();
			  that.enableButtons(btns, false);
			  that.showError(error);
		  }
		});
};

incture.bpmInbox.customComponent.Component.prototype.makeAjaxGetCall = function(url){
	var oModel= new sap.ui.model.json.JSONModel();
	var that=this;
	this.oTable.setBusy(true);
	$.ajax({
		  dataType: "json",
		  url: url,
		  async: false,
		  method: "GET",
		  headers:
          {     
                         "X-Requested-With": "XMLHttpRequest",
                         "Content-Type": "application/atom+xml",
                         "DataServiceVersion": "2.0",       
                         "X-CSRF-Token":"Fetch"   
          },
		  success: function(rData, jqXHR, options){
			  that.oTable.setBusy(false);
			  that.token= options.getResponseHeader("x-csrf-token");
			  that.oTable.removeSelections();
			  var btns= that.headerToolBar.getContent();
			  that.enableButtons(btns, false);
			  oModel.setData(rData);
		  },
		  error:function(error){
			  that.oTable.setBusy(false);
			  that.activeItem= null;
			  that.oTable.removeSelections()
			  var btns= that.headerToolBar.getContent();
			  that.enableButtons(btns, false);
			  that.showError(error);
		  }
		});
	return oModel;
};

incture.bpmInbox.customComponent.Component.prototype.showError= function(oError){
	var msg= oError.statusText
	sap.m.MessageBox.error(msg, {
	    title: "Error",                                      
	    onClose: null,                                        
	    styleClass: "",                                       
	    initialFocus: null,                                  
	    textDirection: sap.ui.core.TextDirection.Inherit     
	    });
};
/*** extending control ***/
sap.m.Text.extend("MyText",{
	metadata:{
		properties:{
			"data":"string"
		},
		events:{
			"click":{},
			"hover":{}
		}
	},
	onmouseover: function(oEvent){
		var id = oEvent.target.parentElement.getAttribute("id");
		var element = $("#"+id);
		element.removeClass("header");
		element.addClass("header-hover");
	},
	onmouseout: function(oEvent){
		var id = oEvent.target.parentElement.getAttribute("id");
		var element = $("#"+id);
		element.removeClass("header-hover");
		element.addClass("header");
	},
	onclick: function(oEvent){
		var title = this.getText();
		var type= this.getData();
		var that=this;
		var dialog= new sap.m.Dialog({
			title: title,
			contentWidth:"50px",
			contentHeight:"130px",
			content:[
			         new sap.m.RadioButtonGroup({
			        	 buttons:[
			        	          new sap.m.RadioButton({text: "Sort Ascending", select: function(oEvent){
			        	          }}),
			        	          new sap.m.RadioButton({text: "Sort Descending", select: function(oEvent){
			        	          }})
			        	          ]
			         })
			         ],
			beginButton: new sap.m.Button({
				text:"OK",
				press: function(oEvent){
					var dialog = oEvent.getSource().getParent();
					var radioBtn = dialog.getAggregation("content")[0];
					var table = that.getParent().getParent();
					var bDesc= false;
					if(radioBtn.getSelectedIndex() === 1){
						bDesc= true;
					}

					var sorter= new sap.ui.model.Sorter(type,bDesc,false);
					table.getBinding("items").sort([sorter]);
					oEvent.getSource().getParent().close();
				}
			}),
			endButton: new sap.m.Button({
				text: "Cancel",
				press: function(oEvent){
					oEvent.getSource().getParent().close();
				}
			})
		});
		dialog.open();
		
		$("#"+dialog.getId()).find("header").css("background-color","#ff6666");
		$("#"+dialog.getId()).find("footer").addClass("whiteBG");
		$("#"+dialog.getId()).find("footer").addClass("borderTop");
		$("#"+dialog.getId()).find("footer").find("button").find("div").addClass("buttonText");
		$("#"+dialog.getId()).find("section").first().addClass("whiteBG");
		$("#"+dialog.getId()).addClass("whiteBG");
		
	},
	renderer:{}
});

