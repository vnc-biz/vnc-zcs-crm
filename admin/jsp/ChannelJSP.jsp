<%
        response.setHeader( "Pragma", "no-cache" );
        response.setHeader( "Cache-Control", "no-cache" );
        response.setDateHeader( "Expires", 0 );
%>
<%@ page import="com.google.gson.Gson" %>
<%@ page import="biz.vnc.base.*" %>
<%@ page import="biz.vnc.beans.*" %>
<%@ page import="biz.vnc.helpers.*" %>
<%@ page import="biz.vnc.util.*" %>
<%@ page import="com.google.gson.JsonObject" %>
<%@ page import="com.google.gson.JsonParser" %>
<%
        try{
                int operationStatus = 0;
                Gson gson = new Gson();
                String jString = request.getParameter("jsonobj");
		System.out.println("JSP jString : " + jString);
                InterfaceHelper interfaceHelper = Utility.callHelper(jString);
		System.out.println("1......................");
                JsonObject k  = new JsonParser().parse(jString).getAsJsonObject();
		System.out.println("2......................");
                String actionType = k.get("action").getAsString();
		System.out.println("3......................");
                AbstractBean abstractBean = interfaceHelper.toBean(jString);
		System.out.println("4......................");
                if(actionType.equals("LIST")){
                        try{
				System.out.println("List 5...........................");
                                String result = interfaceHelper.listView();
                                out.println(result);
                        }catch(Exception e){
                                e.printStackTrace();
                        }
                }
                else if(actionType.equals("ADD")){
                        try{
								System.out.println("5......................");
                                operationStatus = interfaceHelper.add(abstractBean);
								System.out.println("JSP Op Status : " + operationStatus);
                                out.println(operationStatus);
                        }catch(Exception e){
                                e.printStackTrace();
                        }
                }
                else if(actionType.equals("UPDATE")){
                        try{
                                operationStatus = interfaceHelper.update(abstractBean);
                                out.println(operationStatus);
                        }catch(Exception e){
                                e.printStackTrace();
                        }
                }

                else if(actionType.equals("USER")){
                        try{
                               	String allAccounts = interfaceHelper.getUsers();
                                out.println(allAccounts);
                        }catch(Exception e){
                                e.printStackTrace();
                        }
                }
			    else if(actionType.equals("DELETEBYID")){
                        try{

                                String array = k.get("array").getAsString();
                                operationStatus = interfaceHelper.deleteByIds(array);
                                out.println(operationStatus);
                        }catch(Exception e){
                                e.printStackTrace();
                        }
                }
    }catch (Exception e) {
        System.out.println("Nothing came." + e);
        e.printStackTrace();
    }
%>
