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
				System.out.println("1------------------>>>>"+jString);
                InterfaceHelper interfaceHelper = Utility.callHelper(jString);
				//InterfaceHelper interfaceHelper = new LeadHelper();
				System.out.println("2");
				JsonObject k  = new JsonParser().parse(jString).getAsJsonObject();
				System.out.println("3");
                String actionType = k.get("action").getAsString();
				System.out.println("=============IF 2"+actionType);
				System.out.println("1------------dasdadas------>>>>"+jString);
                AbstractBean abstractBean = interfaceHelper.toBean(jString);
				System.out.println("1-------sdsadasfasfdgggggggggggggg----------->>>>"+jString);
                if(actionType.equals("LIST")){
                        try{
									System.out.println("=============IF 2");
									String result = interfaceHelper.listClientView();
									out.println(result);
								
                        }catch(Exception e){
								System.out.println("1----ddddddddddddddddd-------------->>>>"+jString);
                                e.printStackTrace();
                        }
                }
                else if(actionType.equals("FILTER")){
                        try{
									System.out.println("1---ttttttttttt-------------->>>>"+jString);
								String array1 = k.get("array").getAsString();
								if(array1.equals("")){
									String result = interfaceHelper.listClientView();
									out.println(result);
								}
								else{
									String result = interfaceHelper.filterView(array1);
									out.println(result);
								}
                                
                        }catch(Exception e){
                                e.printStackTrace();
                        }
                }
				else if(actionType.equals("CONTACT")){
                        try{
								System.out.println("1---ttttttttttt-------------->>>>"+jString);
								String array2 = k.get("array").getAsString();
								if(array2.equals("")){
									String result = interfaceHelper.listClientView();
									out.println(result);
								}
								else{
									String result = interfaceHelper.filterByContact(array2);
									out.println(result);
								}
                                
                        }catch(Exception e){
                                e.printStackTrace();
                        }
                }
				else if(actionType.equals("ADD")){
                        try{
                                operationStatus = interfaceHelper.add(abstractBean);
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
								System.out.println("===========sdddddddddd==IF 2");
                               	String allAccounts = interfaceHelper.getUsers();
                                out.println(allAccounts);
                        }catch(Exception e){
                                e.printStackTrace();
                        }
                }
			    else if(actionType.equals("DELETEBYID")){
                        try{
                                String array = k.get("array").getAsString();
								String user = k.get("writeBy").getAsString();
                                operationStatus = interfaceHelper.deleteByIds(array,user);
                                out.println(operationStatus);
                        }catch(Exception e){
                                e.printStackTrace();
                        }
                }
				 else if(actionType.equals("DELETEHISTORY")){
                        try{
                                String array = k.get("array").getAsString();
								String leadId = k.get("leadId").getAsString();
							//	String user = k.get("writeBy").getAsString();
                                operationStatus = interfaceHelper.deleteHistory(array,leadId);
                                out.println(operationStatus);
                        }catch(Exception e){
                                e.printStackTrace();
                        }
                }
				else if(actionType.equals("HISTORY")){
                        try{
                                String array = k.get("array").getAsString();
								String leadId = k.get("leadId").getAsString();
								System.out.println("==>>>>>>>>" + array);
                                operationStatus = interfaceHelper.addHistory(array,leadId);
                                out.println(operationStatus);
                        }catch(Exception e){
                                e.printStackTrace();
                        }
                }
				else if(actionType.equals("CALHISTORY")){
                        try{
                                String array = k.get("array").getAsString();
								String leadId = k.get("leadId").getAsString();
								System.out.println("==>>>>>>>>" + array);
                                operationStatus = interfaceHelper.addAppointment(array,leadId);
                                out.println(operationStatus);
                        }catch(Exception e){
                                e.printStackTrace();
                        }
                }
				else if(actionType.equals("TASKHISTORY")){
                        try{
                                String array = k.get("array").getAsString();
								String leadId = k.get("leadId").getAsString();
								System.out.println("==>>>>>>>>" + array);
                                operationStatus = interfaceHelper.addTask(array,leadId);
                                out.println(operationStatus);
                        }catch(Exception e){
                                e.printStackTrace();
                        }
                }
				else if(actionType.equals("DELETETASK")){
                        try{
                                String array = k.get("array").getAsString();
								String leadId = k.get("leadId").getAsString();
								System.out.println("==>>>>>>>>" + array);
                                operationStatus = interfaceHelper.deleteTask(array,leadId);
                                out.println(operationStatus);
                        }catch(Exception e){
                                e.printStackTrace();
                        }
                }
				else if(actionType.equals("LISTHISTORY")){
                        try{
                                String leadId = k.get("leadId").getAsString();
                                String result = interfaceHelper.listHistory(leadId);
                                out.print(result);
								System.out.println(result);
                        }catch(Exception e){
                                e.printStackTrace();
                        }
                }
				else if(actionType.equals("listTask")){
                        try{
                                String leadId = k.get("leadId").getAsString();
                                String result = interfaceHelper.listTask(leadId);
                                out.print(result);
								System.out.println(result);
                        }catch(Exception e){
                                e.printStackTrace();
                        }
                }
				else if(actionType.equals("LISTAPPTHISTORY")){
                        try{
                                String leadId = k.get("leadId").getAsString();
                                String result = interfaceHelper.listAppointment(leadId);
                                out.print(result);
								System.out.println(result);
                        }catch(Exception e){
                                e.printStackTrace();
                        }
                }
    }catch (Exception e) {
        System.out.println("Nothing came." + e);
        e.printStackTrace();
    }
%>
