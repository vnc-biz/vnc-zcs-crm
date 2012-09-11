/*
##############################################################################
#    VNC-Virtual Network Consult GmbH.
#    Copyright (C) 2004-TODAY VNC-Virtual Network Consult GmbH
#    (<http://www.vnc.biz>).
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
#    along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
##############################################################################
*/

AjxDispatcher.require(["CalendarCore", "Calendar", "CalendarAppt"]);

ZmCRMCalViewController = function (calApp) {
    ZmCalViewController.call(this, calApp);
}

ZmCRMCalViewController.prototype = new ZmCalViewController();
ZmCRMCalViewController.prototype.constructor = ZmCRMCalViewController;

ZmCRMCalViewController.prototype._quickAddCallback = function (response) {
    var array = [];
    array.push(response.invId);

    var json = "jsonobj={\"action\":\"CALHISTORY\",\"object\":\"lead\",\"array\":\"" + array + "\",\"leadId\":\"" + biz_vnc_crm_client.leadId + "\"}";
    var reqHeader = {
        "Content-Type": "application/x-www-form-urlencoded"
    };
    var reqJson = AjxStringUtil.urlEncode(json);
    var response = AjxRpc.invoke(reqJson, "/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);
	if (response.text == 0) {
		Ext.example.msg('',biz_vnc_crm_client.msgApptNotAttach);
	} else {
    	if (biz_vnc_crm_client.flag == 0) {
       		var leadId = biz_vnc_crm_client.leadId;
        	var json = "jsonobj={\"action\":\"LISTAPPTHISTORY\",\"object\":\"lead\",\"leadId\":\"" + leadId + "\"}";
	        var reqHeader = {
	            "Content-Type": "application/x-www-form-urlencoded"
    	    };
    	    var reqJson = AjxStringUtil.urlEncode(json);
    	    var responseMailHistory = AjxRpc.invoke(reqJson, "/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);
    	    var msgArray = [];
    	    var item;
    	    var msgArray = (responseMailHistory.text).split(",");
    	    if (msgArray != "null") {
    	        biz_vnc_crm_client.requestApptList(msgArray);
    	    } else {
    	        biz_vnc_crm_client.apptData = "[{'subject':'','location1':'','status':'','calendar':'','startdate':''}]";
    	    }
    	    Ext.getCmp('leadApptGrid').getStore().loadData(jsonParse(biz_vnc_crm_client.apptData), false);
    	    Ext.getCmp('leadApptGrid').getView().refresh();
    	} else if (biz_vnc_crm_client.flag == 1) {
    	    var leadId = biz_vnc_crm_client.leadId;
    	    var json = "jsonobj={\"action\":\"LISTAPPTHISTORY\",\"object\":\"opp\",\"leadId\":\"" + leadId + "\"}";
    	    var reqHeader = {
    	        "Content-Type": "application/x-www-form-urlencoded"
    	    };
    	    var reqJson = AjxStringUtil.urlEncode(json);
    	    var responseMailHistory = AjxRpc.invoke(reqJson, "/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);
    	    var msgArray = [];
    	    var item;
    	    var msgArray = (responseMailHistory.text).split(",");
    	    if (msgArray != "null") {
    	        biz_vnc_crm_client.requestApptList(msgArray);
    	    } else {
    	        biz_vnc_crm_client.apptData = "[{'subject':'','location1':'','status':'','calendar':'','startdate':''}]";
    	    }
    	    Ext.getCmp('oppApptGrid').getStore().loadData(jsonParse(biz_vnc_crm_client.apptData), false);
    	    Ext.getCmp('oppApptGrid').getView().refresh();
    	}
		Ext.example.msg('',biz_vnc_crm_client.msgApptAttach);
	}
}		
