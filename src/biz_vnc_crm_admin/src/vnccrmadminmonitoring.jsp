<%
/*
	http://www.vnc.biz
	Copyright 2012, VNC - Virtual Network Consult GmbH
	Released under GPL Licenses.
*/
%>
<%@ page import="biz.vnc.zimbra.util.JSPUtil" %>
<%@ page import="biz.vnc.zimbra.util.ZStats" %>
<%@ page import="biz.vnc.zimbra.util.ZLog" %>
<%@ page import="com.zimbra.cs.account.Account" %>
<%@ page import="java.util.Properties"%>
<%

try {
	JSPUtil.nocache(response);
	Account account = JSPUtil.getCurrentAccount(request);
	ZStats zs = new ZStats();
	Properties prop = JSPUtil.getZimletTranslationProperties(application,"biz_vnc_crm_admin");
	zs.product_feedback("biz_vnc_crm_admin",prop.getProperty("ZIMLET_VERSION"),account.getName());
} catch (Exception e) {
	out.println("error");
	ZLog.err("VNC CRM for Zimbra Client", "vnccrmadminmonitoring.jsp fail ", e);
}

%>
