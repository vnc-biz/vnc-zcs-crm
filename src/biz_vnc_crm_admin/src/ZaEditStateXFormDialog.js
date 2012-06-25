function ZaEditStateXFormDialog(parent,  app, w, h, title) {
	if (arguments.length == 0) return;
	this._standardButtons = [DwtDialog.OK_BUTTON, DwtDialog.CANCEL_BUTTON];	
	ZaXDialog.call(this, parent, app,title, w, h,"ZaEditStateXFormDialog");
	this._containedObject = {attrs:{}};
	this.initForm(ZaCRMadmin.stateList,this.getMyXForm());
}

ZaEditStateXFormDialog.prototype = new ZaXDialog;
ZaEditStateXFormDialog.prototype.constructor = ZaEditStateXFormDialog;

ZaEditStateXFormDialog.prototype.getMyXForm = 
function() {	
	var json,reqHeader,reqJson,response;

	json = "jsonobj={\"action\":\"LIST\",\"object\":\"country\"}";
	reqHeader = {"Content-Type":"application/x-www-form-urlencoded"};
	reqJson = AjxStringUtil.urlEncode(json);
	response = AjxRpc.invoke(reqJson,biz_vnc_crm_admin.jspUrl, reqHeader, null, false);
	
	this._containedObject[ZaCRMadmin.A_country] = jsonParse(response.text);


	var len = this._containedObject[ZaCRMadmin.A_country].length;
	var temp="[";

	ZaEditStateXFormDialog.countryChoices = [];
	for(var i=0;i<len;i++){
		var name=this._containedObject[ZaCRMadmin.A_country][i][ZaCRMadmin.A_countryName];
		var id=this._containedObject[ZaCRMadmin.A_country][i][ZaCRMadmin.A_countryId];

		if(i==len-1){
			temp +="{\"value\":\""+id+"\",\"label\":\""+name+"\"}]";
		}
		else{
			temp +="{\"value\":\""+id+"\",\"label\":\""+name+"\"},";
		}
	}
	var chkListJson = eval(temp);
	ZaEditStateXFormDialog.countryChoices= chkListJson;
	var xFormObject = {
		numCols:1,
		items:[
		{type:_ZAWIZGROUP_, 
		items:[
			
	
		{ref:ZaCRMadmin.A_stateName, type:_TEXTFIELD_, label:biz_vnc_crm_admin.HDR_name+":", labelLocation:_LEFT_, width:250},
		{ref:ZaCRMadmin.A_stateCode, type:_TEXTFIELD_, label:biz_vnc_crm_admin.HDR_code+":", labelLocation:_LEFT_, width:250},
		{type:_SPACER_, height:"5"},
		{ref:ZaCRMadmin.A_stateCountryName, type:_OSELECT1_, msgName:"countries",label:"Select Country", labelLocation:_LEFT_, choices:ZaEditStateXFormDialog.countryChoices,width:"150px", onChange:ZaTabView.onFormFieldChanged},
		{ref:ZaCRMadmin.A_stateCountryStatus,type:_ZA_CHECKBOX_, label:biz_vnc_crm_admin.HDR_status, trueValue:true, falseValue:false, visibilityChecks:[], enableDisableChecks:[]}
		//onChange:ZaTabView.onFormFieldChanged,

		]
			}]
	};
	return xFormObject;
}

