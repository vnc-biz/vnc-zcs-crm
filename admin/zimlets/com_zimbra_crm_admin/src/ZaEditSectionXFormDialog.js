function ZaEditSectionXFormDialog(parent,  app, w, h, title) {
	if (arguments.length == 0) return;
	this._standardButtons = [DwtDialog.OK_BUTTON, DwtDialog.CANCEL_BUTTON];	
	ZaXDialog.call(this, parent, app,title, w, h,"ZaEditSectionXFormDialog");
	this._containedObject = {attrs:{}};
	this.initForm(ZaCRMadmin.sectionList,this.getMyXForm());
}

ZaEditSectionXFormDialog.prototype = new ZaXDialog;
ZaEditSectionXFormDialog.prototype.constructor = ZaEditSectionXFormDialog;

ZaEditSectionXFormDialog.prototype.getMyXForm = 
function() {	

	var json,reqHeader,reqJson,response;

	json = "jsonobj={\"action\":\"USER\",\"object\":\"section\"}";
	reqHeader = {"Content-Type":"application/x-www-form-urlencoded"};
	reqJson = AjxStringUtil.urlEncode(json);
	response = AjxRpc.invoke(reqJson,com_zimbra_crm_admin.jspUrl, reqHeader, null, false);

	var chkListJson = eval(response.text);
	ZaEditSectionXFormDialog.userChoices= chkListJson;
	var xFormObject = {
		numCols:1,
		items:[
		{type:_ZAWIZGROUP_, 
		items:[
			
	
		{ref:ZaCRMadmin.A_sectionName, type:_TEXTFIELD_, label:com_zimbra_crm_admin.HDR_name+":", labelLocation:_LEFT_, width:250},
		{ref:ZaCRMadmin.A_sectionCode, type:_TEXTFIELD_, label:com_zimbra_crm_admin.HDR_code+":", labelLocation:_LEFT_, width:250},
		{type:_SPACER_, height:"5"},
		{ref:ZaCRMadmin.A_sectionUserId, type:_OSELECT1_, msgName:"sections",label:"Select User :", labelLocation:_LEFT_, choices:ZaEditSectionXFormDialog.userChoices,width:"250px", onChange:ZaTabView.onFormFieldChanged},
		{type:_SPACER_, height:"5"},
		{ref:ZaCRMadmin.A_sectionStatus,type:_ZA_CHECKBOX_, label:com_zimbra_crm_admin.HDR_status, trueValue:true, falseValue:false, visibilityChecks:[], enableDisableChecks:[]}

		
		]
			}]
	};
	return xFormObject;
}

