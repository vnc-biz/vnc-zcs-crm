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
<%@ page import="biz.vnc.helpers.LeadClassHelper" %>
<%@ page import="biz.vnc.helpers.OpportunityHelper" %>
<%@ page import="biz.vnc.helpers.PriorityHelper" %>
<%@ page import="biz.vnc.helpers.SectionHelper" %>
<%@ page import="biz.vnc.helpers.StageHelper" %>
<%@ page import="biz.vnc.helpers.StateHelper" %>
<%@ page import="biz.vnc.util.Utility" %>
<%@ page import="biz.vnc.zimbra.util.JSPUtil" %>
<%@ page import="biz.vnc.zimbra.util.ZLog" %>
<%@ page import="com.google.gson.Gson" %>
<%@ page import="com.google.gson.JsonObject" %>
<%@ page import="com.google.gson.JsonParser" %>
<%

JSPUtil.nocache(response);
try {
	int operationStatus = 0;
	Gson gson = new Gson();
	String jString = request.getParameter("jsonobj");
	InterfaceHelper interfaceHelper = Utility.callHelper(jString);
	JsonObject k  = new JsonParser().parse(jString).getAsJsonObject();
	String actionType = k.get("action").getAsString();
	AbstractBean abstractBean = interfaceHelper.toBean(jString);
	if(actionType.equals("LIST")) {
		try {
			String result = interfaceHelper.listView();
			out.println(result);
		} catch(Exception e) {
			ZLog.err("Zimbra CRM Admin","Error in list",e);
		}
	} else if(actionType.equals("ADD")) {
		try {
			operationStatus = interfaceHelper.add(abstractBean);
			out.println(operationStatus);
		} catch(Exception e) {
			ZLog.err("Zimbra CRM Admin","Error in add",e);
		}
	} else if(actionType.equals("UPDATE")) {
		try {
			operationStatus = interfaceHelper.update(abstractBean);
			out.println(operationStatus);
		} catch(Exception e) {
			ZLog.err("Zimbra CRM Admin","Error in update",e);
		}
	} else if(actionType.equals("COUNT")){
		try{
			operationStatus = interfaceHelper.recordCounter();
			out.println(operationStatus);
		}catch(Exception e){
			ZLog.err("Zimbra CRM Admin","Error in count",e);
		}
	} else if(actionType.equals("USER")) {
		try {
			String allAccounts = interfaceHelper.getUsers();
			out.println(allAccounts);
		} catch(Exception e) {
			ZLog.err("Zimbra CRM Admin","Error in user",e);
		}
	} else if(actionType.equals("DELETEBYID")) {
		try {
			String array = k.get("array").getAsString();
			String user = k.get("writeBy").getAsString();
			operationStatus = interfaceHelper.deleteByIds(array,user);
			out.println(operationStatus);
		} catch(Exception e) {
			ZLog.err("Zimbra CRM Admin","Error in delete by id",e);
		}
	}
} catch (Exception e) {
	ZLog.err("Zimbra CRM Admin","Error",e);
}

%>
