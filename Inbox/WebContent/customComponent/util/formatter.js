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
			}
			
	        return oDate;
		},
		formatStatus: function(status){
			switch(status){
			case "COMPLETED": return "Completed";
			case "RESERVED": return "Reserved";
			}
		},
		formatPriority: function(priority){
			switch(priority){
			case "HIGH":return "High";
			case "MEDIUM": return "Medium";
			case "LOW": return "Low";
			}
			return priority;
		}
}