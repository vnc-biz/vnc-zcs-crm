<%@ page import="com.google.gson.Gson" %>
<%@ page import="biz.vnc.base.*" %>
<%@ page import="biz.vnc.beans.*" %>
<%@ page import="biz.vnc.helpers.*" %>
<%@ page import="biz.vnc.util.*" %>
<%@ page import="biz.vnc.zimbra.util.JSPUtil"%>
<%@ page import="biz.vnc.zimbra.util.ZLog"%>
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
			String result = interfaceHelper.listClientView();
			out.println(result);

		} catch(Exception e) {
			ZLog.err("CRM CLIENT","Error in listing", e);
		}
	} else if(actionType.equals("FILTER")) {
		try {
			String array1 = k.get("array").getAsString();
			if(array1.equals("")) {
				String result = interfaceHelper.listClientView();
				out.println(result);
			} else {
				String result = interfaceHelper.filterView(array1);
				out.println(result);
			}
		} catch(Exception e) {
			ZLog.err("CRM CLIENT","Error in Filter", e);
		}
	} else if(actionType.equals("CONTACT")) {
		try {
			String array2 = k.get("array").getAsString();
			if(array2.equals("")) {
				String result = interfaceHelper.listClientView();
				out.println(result);
			} else {
				String result = interfaceHelper.filterByContact(array2);
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
	}

	else if(actionType.equals("USER")) {
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
