AjxDispatcher.require(["CalendarCore", "Calendar", "CalendarAppt"]);
ZmCRMCalViewController = function(calApp) {
	ZmCalViewController.call(this,calApp);	
}
ZmCRMCalViewController.prototype = new ZmCalViewController();
ZmCRMCalViewController.prototype.constructor = ZmCRMCalViewController;
ZmCRMCalViewController.prototype._quickAddCallback = function(response){
console.dir(response);

	var array = [];
	array.push(response.invId);

	var json = "jsonobj={\"action\":\"CALHISTORY\",\"object\":\"lead\",\"array\":\"" + array + "\",\"leadId\":\"" + biz_vnc_crm_client.leadId + "\"}";
    var reqHeader = {"Content-Type":"application/x-www-form-urlencoded"};
	var reqJson = AjxStringUtil.urlEncode(json);
	var response = AjxRpc.invoke(reqJson,"/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);

	if (biz_vnc_crm_client.flag == 0) {
			var leadId = biz_vnc_crm_client.leadId;
			var json = "jsonobj={\"action\":\"LISTAPPTHISTORY\",\"object\":\"lead\",\"leadId\":\""+ leadId + "\"}";
			var reqHeader = {"Content-Type":"application/x-www-form-urlencoded"};
			var reqJson = AjxStringUtil.urlEncode(json);
			var responseMailHistory = AjxRpc.invoke(reqJson,"/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);
			var msgArray = [];
			var item;
			var msgArray = (responseMailHistory.text).split(",");
			if(msgArray != "null"){
				biz_vnc_crm_client.requestApptList(msgArray);
			}else{
				biz_vnc_crm_client.apptData = "[{'subject':'','location1':'','status':'','calendar':'','startdate':''}]";
			}
			Ext.getCmp('leadApptGrid').getStore().loadData(jsonParse(biz_vnc_crm_client.apptData),false);
			Ext.getCmp('leadApptGrid').getView().refresh();

		} else if (biz_vnc_crm_client.flag == 1) {
			var leadId = biz_vnc_crm_client.leadId;
			var json = "jsonobj={\"action\":\"LISTAPPTHISTORY\",\"object\":\"opp\",\"leadId\":\""+ leadId + "\"}";
			var reqHeader = {"Content-Type":"application/x-www-form-urlencoded"};
			var reqJson = AjxStringUtil.urlEncode(json);
			var responseMailHistory = AjxRpc.invoke(reqJson,"/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);
			var msgArray = [];
			var item;
			var msgArray = (responseMailHistory.text).split(",");
			if(msgArray != "null"){
				biz_vnc_crm_client.requestApptList(msgArray);
			}else{
				biz_vnc_crm_client.apptData = "[{'subject':'','location1':'','status':'','calendar':'','startdate':''}]";
			}
			Ext.getCmp('oppApptGrid').getStore().loadData(jsonParse(biz_vnc_crm_client.apptData),false);
			Ext.getCmp('oppApptGrid').getView().refresh();
		}
}