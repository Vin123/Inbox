jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("sap.m.MessageBox");

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
	var panel = new sap.m.Panel({
		expandable: false,
		content:[]
	}).addStyleClass("panel-style");

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
					size : undefined, 
					color : "#ff6666",
					hoverColor : undefined,
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
		           new sap.m.ToolbarSpacer({}),
		           new sap.m.SearchField({
					value : undefined, 
					width : "50%", 
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
						//
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
	
	this.columnListItem = new sap.m.ColumnListItem({
    	cells:[],
    	type:sap.m.ListType.Active,
    	press: function(oEvent){
    		that.activeItem = oEvent.getSource().getBindingContextPath("bpmModel").split("/")[3];
    		if(that.activeItem){
    			var btns= that.headerToolBar.getContent();
    			for(var i=0;i<btns.length;i++){
    				if(btns[i].getMetadata()._sClassName === "sap.m.Button"){
    					btns[i].setEnabled(true);
    				}
    			}
    		}else{
    			var btns= that.headerToolBar.getContent();
    			for(var i=0;i<btns.length;i++){
    				if(btns[i].getMetadata()._sClassName === "sap.m.Button"){
    					btns[i].setEnabled(false);
    				}
    			}
    		}
    	}
    });
	
	this.oTable = new sap.m.Table({
		headerToolbar: this.headerToolBar,
		items : [], 
		columns : [],
		growing: true,
		growingThreshold: 10,
		updateFinished: function(oEvent){
			var control= oEvent.getSource();
			var id= control.getId();
			$("#"+id).find("th").addClass("header");
		},
		itemPress: function(oEvent){
			//debugger;
		},
		selectionChange: function(oEvent){
			//debugger;
			
		}
	});
	
	panel.addContent(searchBar);
	panel.addContent(this.oTable);
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
					case "open-folder": that.open(oEvent);
					break;
					case "unlocked": that.release(oEvent);
					break;
					case "forward": that.forward(oEvent);
					break;
					}
				}
			}
		});
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
	this.setProperty("tableColumnNo",nameArr.length);
	for(var i=0;i< nameArr.length; i++){
		var aColumn= new sap.m.Column({
			header : new sap.m.Text({text: nameArr[i]}), 
			styleClass : "whiteBG"
		});
		this.oTable.addColumn(aColumn);
	}

	return this;
};

incture.bpmInbox.customComponent.Component.prototype.setTableColumns = function(oColumns){
	var colArr = oColumns.split(",");
	for(var i=0;i< colArr.length; i++){
		var aCell = this.getCellControl(i,colArr[i].trim());
		this.columnListItem.addCell(aCell);
	}
	this.oTable.bindItems("bpmModel>/d/results",this.columnListItem);
	
	var oModel= this.getAllBPMTasks();
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
			showHeader : true, // boolean
			title : "Filters", // string
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
						  select: function(oEvent){
							  var oBinding=that.oTable.getBinding("items");
						      var oFilter=new sap.ui.model.Filter("Priority","EQ","LOW");
						      oBinding.filter([oFilter]);
						  }
					}));
					btnList.push(new sap.m.RadioButton({
						  text:"Low",
						  selected:false,
						  select: function(oEvent){
							  var oBinding=that.oTable.getBinding("items");
						      var oFilter=new sap.ui.model.Filter("Priority","EQ","LOW");
						      oBinding.filter([oFilter]);
						  }
					}));
					btnList.push(new sap.m.RadioButton({
				    	  text:"Medium",
				    	  selected:false,
				    	  select: function(oEvent){
				    		  var oBinding=that.oTable.getBinding("items");
						      var oFilter=new sap.ui.model.Filter("Priority","EQ","MEDIUM");
						      oBinding.filter([oFilter]);
				    	  }
				      }));
					btnList.push(new sap.m.RadioButton({
				    	  text:"High",
				    	  selected:false,
				    	  select: function(oEvent){
				    		  var oBinding=that.oTable.getBinding("items");
						      var oFilter=new sap.ui.model.Filter("Priority","EQ","HIGH");
						      oBinding.filter([oFilter]);
				    	  }
				      }));
					btnList.push(new sap.m.RadioButton({
				    	  text:"Very High",
				    	  selected:false,
				    	  select: function(oEvent){
				    		  var oBinding=that.oTable.getBinding("items");
						      var oFilter=new sap.ui.model.Filter("Priority","EQ","VERY HIGH");
						      oBinding.filter([oFilter]);
				    	  }
				      }));
					 break;
	case "Status": btnList.push(new sap.m.RadioButton({
					  text:"Reserved",
					  selected:false,
					  select: function(oEvent){
						  var oBinding=that.oTable.getBinding("items");
					      var oFilter=new sap.ui.model.Filter("Status","EQ","Reserved");
					      oBinding.filter([oFilter]);
					  }
					}));
					btnList.push(new sap.m.RadioButton({
						  text:"Completed",
						  selected:false,
						  select: function(oEvent){
							  var oBinding=that.oTable.getBinding("items");
						      var oFilter=new sap.ui.model.Filter("Status","EQ","Completed");
						      oBinding.filter([oFilter]);
						  }
					}));
					break;
	case "Creation Date": btnList.push(new sap.m.RadioButton({
						  text:"Reserved",
						  selected:false,
						  select: function(oEvent){
							  var oBinding=that.oTable.getBinding("items");
						      var oFilter=new sap.ui.model.Filter("Status","EQ","Reserved");
						      oBinding.filter([oFilter]);
						  }
						}));
						btnList.push(new sap.m.RadioButton({
							  text:"Completed",
							  selected:false,
							  select: function(oEvent){
								  var oBinding=that.oTable.getBinding("items");
							      var oFilter=new sap.ui.model.Filter("Status","EQ","Completed");
							      oBinding.filter([oFilter]);
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
				var id= control.getBindingContext("bpmModel").getPath().split("/")[3];
				var data = this.oTable.getModel("bpmModel").getData().d.results[id];
				var url = data.UIExecutionLink.__deferred.uri;
				window.open(url);
			}, this ]
		}).addStyleClass("link");
		var width= (100/parseInt(this.getProperty("tableColumnNo")))*2;
		this.oTable.getColumns()[columnNo].setWidth(width+"%");
		break;
	case "CreationDate":returnControl=new sap.m.Text({
			text: "{parts:[{path:'bpmModel>CreatedOn'}], formatter: 'formatter.formatDate' }"
		});
		break;
	case "CreatedBy":returnControl=new sap.m.Text({
			text: "{bpmModel>CreatedBy}"
		});
		break;
	case "DueDate":returnControl=new sap.m.Text({
			text: "{parts:[{path:'bpmModel>ExpiryDate'}], formatter: 'formatter.formatDate' }"
		});
		break;
	case "Status":returnControl=new sap.m.Text({
			text: "{parts:[{path:'bpmModel>Status'}], formatter: 'formatter.formatStatus' }"
		});
		break;
	case "Priority":returnControl=new sap.m.Text({
			text: "{parts:[{path:'bpmModel>Priority'}], formatter: 'formatter.formatPriority' }"
		});
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
	
	return this.makeSapCall(url, method, oParam);
};

incture.bpmInbox.customComponent.Component.prototype.makeSapCall = function(url, method, oParam){
	var oHeader={"Content-Type":"application/json; charset=utf-8"};
	
	var oModel = new sap.ui.model.json.JSONModel(); 
    oModel.loadData(url, JSON.stringify(oParam), false,method,false,false,oHeader);
     oModel.attachRequestCompleted(function(){
    	 debugger
     });
     if(oModel.getData() && Object.keys(oModel.getData()).length){
        return oModel;
     }else{
     	return ;
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
        	debugger;
        	if(oAction === "OK"){
        		var url= "http://192.168.1.149:50000/bpmodata/tasks.svc/Claim?InstanceID='"+task.InstanceID+"'&$format=json"
        		that.makeSapCall(url,"POST",null);
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

incture.bpmInbox.customComponent.Component.prototype.open = function(oEvent){
	var that=this;
	
};

incture.bpmInbox.customComponent.Component.prototype.release = function(oEvent){
	var that=this;
	var task = this.oTable.getModel("bpmModel").getData().d.results[this.activeItem];
	
	sap.m.MessageBox.confirm("Do you want to Release '"+task.TaskTitle+"'",{
		icon: sap.m.MessageBox.Icon.INFORMATION,
        title: "Release Task",
        actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
        onClose: function(oAction) {
        	debugger;
        	if(oAction === "OK"){
        		var url= "http://192.168.1.149:50000/bpmodata/tasks.svc/Release?InstanceID='"+task.InstanceID+"'&$format=json"
        		that.makeSapCall(url,"POST",null);
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
			that.makeSapCall(url,"POST",null);
		}
	})
	
	dialog.bindAggregation("items","/d/results",template);
	
	dialog.open();
};

incture.bpmInbox.customComponent.Component.prototype.setTpext = function(sText){
	this.setProperty("tpext",sText);
	return this;
}

