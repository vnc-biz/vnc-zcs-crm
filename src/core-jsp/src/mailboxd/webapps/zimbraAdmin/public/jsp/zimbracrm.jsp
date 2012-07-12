<%@ page import="com.google.gson.Gson" %>
<%@ page import="biz.vnc.base.*" %>
<%@ page import="biz.vnc.beans.*" %>
<%@ page import="biz.vnc.helpers.*" %>
<%@ page import="biz.vnc.util.*" %>
<%@ page import="biz.vnc.zimbra.util.JSPUtil" %>
<%@ page import="biz.vnc.zimbra.util.ZLog" %>
<%@ page import="com.google.gson.JsonObject" %>
<%@ page import="com.google.gson.JsonParser" %>
<%
	JSPUtil.nocache(response);
        try{
                int operationStatus = 0;
                Gson gson = new Gson();
                String jString = request.getParameter("jsonobj");
                InterfaceHelper interfaceHelper = Utility.callHelper(jString);
                JsonObject k  = new JsonParser().parse(jString).getAsJsonObject();
                String actionType = k.get("action").getAsString();
                AbstractBean abstractBean = interfaceHelper.toBean(jString);
                if(actionType.equals("LIST")){
                        try{
                                String result = interfaceHelper.listView();
                                out.println(result);
                        }catch(Exception e){
				ZLog.err("Zimbra CRM Admin","Error in list",e);
                        }
                }else if(actionType.equals("ADD")){
                        try{
                                operationStatus = interfaceHelper.add(abstractBean);
                                out.println(operationStatus);
                        }catch(Exception e){
				ZLog.err("Zimbra CRM Admin","Error in add",e);
                        }
                }else if(actionType.equals("UPDATE")){
                        try{
                                operationStatus = interfaceHelper.update(abstractBean);
                                out.println(operationStatus);
                        }catch(Exception e){
				ZLog.err("Zimbra CRM Admin","Error in update",e);
                        }
                }else if(actionType.equals("USER")){
                        try{
                               	String allAccounts = interfaceHelper.getUsers();
                                out.println(allAccounts);
                        }catch(Exception e){
				ZLog.err("Zimbra CRM Admin","Error in user",e);
                        }
                }else if(actionType.equals("DELETEBYID")){
                        try{
                                String array = k.get("array").getAsString();
								String user = k.get("writeBy").getAsString();
                                operationStatus = interfaceHelper.deleteByIds(array,user);
                                out.println(operationStatus);
                        }catch(Exception e){
				ZLog.err("Zimbra CRM Admin","Error in delete by id",e);
                        }
                }
    }catch (Exception e) {
	ZLog.err("Zimbra CRM Admin","Error",e);
    }
%>
