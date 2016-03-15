jQuery.sap.require("sap.ui.core.format.DateFormat");

formatter = {
		
		formatDate: function(date){
			 var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
	               style : "medium"
	        });
			var oDate="";
			if(date){
				date= new Date(parseInt(date.substr(6)));
		        oDate = oDateFormat.format(date,true);
		        
		        var month = date.getMonth() + 1;
		        var day = date.getDate();
		        var year = date.getFullYear();
		        oDate = day + "/" + month + "/" + year;
			}
			
	        return oDate;
		},
		formatStatus: function(status){
			switch(status){
			case "READY": return "Ready";
			case "IN_PROGRESS": return "In Progress";
			case "RESERVED": return "Reserved";
			case "COMPLETED": return "Completed";
			}
		},
		formatPriority: function(priority){
			switch(priority){
			case "HIGH":return "High";
			case "MEDIUM": return "Medium";
			case "LOW": return "Low";
			}
			return priority;
		},
		formatLinkStatus: function(status){
			if(status === "COMPLETED"){
				return false;
			}
			return true;
		}
}