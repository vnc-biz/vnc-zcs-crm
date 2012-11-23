<%
/*
##############################################################################
#    VNC-Virtual Network Consult GmbH.
#    Copyright (C) 2004-TODAY VNC-Virtual Network Consult GmbH
#    (< http://www.vnc.biz >).
#
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU General Public License as
#    published by the Free Software Foundation, either version 3 of the
#    License, or (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU General Public License for more details.
#
#    You should have received a copy of the GNU General Public License
#    along with this program.  If not, see < http://www.gnu.org/licenses/ >.
#
##############################################################################
*/
%>
<%@ page import="biz.vnc.base.InterfaceHelper" %>
<%@ page import="biz.vnc.base.AbstractBean" %>
<%@ page import="biz.vnc.helpers.CategoryHelper" %>
<%@ page import="biz.vnc.helpers.ChannelHelper" %>
<%@ page import="biz.vnc.helpers.CompanyHelper" %>
<%@ page import="biz.vnc.helpers.CountryHelper" %>
<%@ page import="biz.vnc.helpers.LeadHelper" %>
<%@ page import="biz.vnc.helpers.OpportunityHelper" %>
<%@ page import="biz.vnc.helpers.PriorityHelper" %>
<%@ page import="biz.vnc.helpers.SectionHelper" %>
<%@ page import="biz.vnc.helpers.StageHelper" %>
<%@ page import="biz.vnc.helpers.StateHelper" %>
<%@ page import="biz.vnc.util.Utility" %>
<%@ page import="biz.vnc.zimbra.util.JSPUtil"%>
<%@ page import="biz.vnc.zimbra.util.ZLog"%>
<%@ page import="com.google.gson.Gson" %>
<%@ page import="com.google.gson.JsonObject" %>
<%@ page import="com.google.gson.JsonParser" %>
<%

JSPUtil.nocache(response);
try {
	int operationStatus = 0;
	AbstractBean abstractBean = null;
	Gson gson = new Gson();
	String jString = request.getParameter("jsonobj");
	JsonObject k  = new JsonParser().parse(jString).getAsJsonObject();
	String actionType = k.get("action").getAsString();
	String objectType = k.get("object").getAsString();
	InterfaceHelper interfaceHelper = Utility.callHelper(objectType);
	if(interfaceHelper != null){
		abstractBean = interfaceHelper.toBean(jString);
	}
	if(objectType.equals("AllObject")) {
		try {
			String[] object = {"priority","category","stage","state","country","company","channel","section","leadClass"};
			String result = "";
			String AllResult = "[";
			for(int i=0;i<object.length;i++){
				interfaceHelper = Utility.callHelper(object[i]);
				result = interfaceHelper.listClientView("");
				if(i == object.length-1) {
					AllResult += "{\"" + object[i] + "\":" + result + "}]";
				} else {
					AllResult += "{\"" + object[i] + "\":" + result + "},";	
				}
			}
			out.println(AllResult);
		} catch(Exception e) {
			ZLog.err("CRM CLIENT","Error in getting all data", e);
		}
	} else if(actionType.equals("FULLLIST")) {
		try{
			String username = k.get("username").getAsString();
			String result = interfaceHelper.listView(username);
			out.println(result);
		} catch(Exception e) {
			ZLog.err("CRM CLIENT","Error in full listing", e);
		}
	} else if(actionType.equals("LIST")) {
		try {
			String username = k.get("username").getAsString();
			String result = interfaceHelper.listClientView(username);
			out.println(result);
		} catch(Exception e) {
			ZLog.err("CRM CLIENT","Error in listing", e);
		}
	} else if(actionType.equals("FILTER")) {
		try {
			String username = k.get("username").getAsString();
			String array1 = k.get("array").getAsString();
			if(array1.equals("")) {
				String result = interfaceHelper.listClientView(username);
				out.println(result);
			} else {
				String result = interfaceHelper.filterView(array1,username);
				out.println(result);
			}
		} catch(Exception e) {
			ZLog.err("CRM CLIENT","Error in Filter", e);
		}
	} else if(actionType.equals("CONTACT")) {
		try {
			String username = k.get("username").getAsString();
			String array2 = k.get("array").getAsString();
			if(array2.equals("")) {
				String result = interfaceHelper.listClientView(username);
				out.println(result);
			} else {
				String result = interfaceHelper.filterByContact(array2,username);
				out.println(result);
			}
		} catch(Exception e) {
			ZLog.err("CRM CLIENT","Error in Contact", e);
		}
	} else if(actionType.equals("ADD")) {
		try {
			operationStatus = interfaceHelper.add(abstractBean);
			out.println(operationStatus);
		} catch(Exception e) {
			ZLog.err("CRM CLIENT","Error in Add", e);
		}
	} else if(actionType.equals("UPDATE")) {
		try {
			operationStatus = interfaceHelper.update(abstractBean);
			out.println(operationStatus);
		} catch(Exception e) {
			ZLog.err("CRM CLIENT","Error in Update", e);
		}
	} else if(actionType.equals("COUNT")) {
		try {
			operationStatus = interfaceHelper.recordCounter();
			out.println(operationStatus);
		} catch(Exception e) {
			ZLog.err("CRM CLIENT","Error in Counting", e);
		}
	} else if(actionType.equals("USER")) {
		try {
			String allAccounts = interfaceHelper.getUsers();
			out.println(allAccounts);
		} catch(Exception e) {
			ZLog.err("CRM CLIENT","Error in User", e);
		}
	} else if(actionType.equals("DELETEBYID")) {
		try {
			String array = k.get("array").getAsString();
			String user = k.get("writeBy").getAsString();
			operationStatus = interfaceHelper.deleteByIds(array,user);
			out.println(operationStatus);
		} catch(Exception e) {
			ZLog.err("CRM CLIENT","Error in Deleted by Id", e);
		}
	} else if(actionType.equals("DELETEHISTORY")) {
		try {
			String array = k.get("array").getAsString();
			String leadId = k.get("leadId").getAsString();
			operationStatus = interfaceHelper.deleteHistory(array,leadId);
			out.println(operationStatus);
		} catch(Exception e) {
			ZLog.err("CRM CLIENT","Error in Delete history", e);
		}
	} else if(actionType.equals("HISTORY")) {
		try {
			String array = k.get("array").getAsString();
			String leadId = k.get("leadId").getAsString();
			operationStatus = interfaceHelper.addHistory(array,leadId);
			out.println(operationStatus);
		} catch(Exception e) {
			ZLog.err("CRM CLIENT","Error in history", e);
		}
	} else if(actionType.equals("CALHISTORY")) {
		try {
			String array = k.get("array").getAsString();
			String leadId = k.get("leadId").getAsString();
			operationStatus = interfaceHelper.addAppointment(array,leadId);
			out.println(operationStatus);
		} catch(Exception e) {
			ZLog.err("CRM CLIENT","Error in cal history", e);
		}
	} else if(actionType.equals("TASKHISTORY")) {
		try {
			String array = k.get("array").getAsString();
			String leadId = k.get("leadId").getAsString();
			operationStatus = interfaceHelper.addTask(array,leadId);
			out.println(operationStatus);
		} catch(Exception e) {
			ZLog.err("CRM CLIENT","Error in task history", e);
		}
	} else if(actionType.equals("DELETETASK")) {
		try {
			String array = k.get("array").getAsString();
			String leadId = k.get("leadId").getAsString();
			operationStatus = interfaceHelper.deleteTask(array,leadId);
			out.println(operationStatus);
		} catch(Exception e) {
			ZLog.err("CRM CLIENT","Error in delete task", e);
		}
	} else if(actionType.equals("LISTHISTORY")) {
		try {
			String leadId = k.get("leadId").getAsString();
			String result = interfaceHelper.listHistory(leadId);
			out.print(result);
		} catch(Exception e) {
			ZLog.err("CRM CLIENT","Error in list history", e);
		}
	} else if(actionType.equals("listTask")) {
		try {
			String leadId = k.get("leadId").getAsString();
			String result = interfaceHelper.listTask(leadId);
			out.print(result);
		} catch(Exception e) {
			ZLog.err("CRM CLIENT","Error in list task", e);
		}
	} else if(actionType.equals("DELETEAPPT")) {
		try {
			String array = k.get("array").getAsString();
			String leadId = k.get("leadId").getAsString();
			operationStatus = interfaceHelper.deleteAppointment(array,leadId);
			out.println(operationStatus);
		} catch(Exception e) {
			ZLog.err("CRM CLIENT","Error in delete appointment", e);
		}
	} else if(actionType.equals("LISTAPPTHISTORY")) {
		try {
			String leadId = k.get("leadId").getAsString();
			String result = interfaceHelper.listAppointment(leadId);
			out.print(result);
		} catch(Exception e) {
			ZLog.err("CRM CLIENT","Error in list appointment", e);
		}
	}
} catch (Exception e) {
	ZLog.err("CRM CLIENT","Error", e);
}

%>
