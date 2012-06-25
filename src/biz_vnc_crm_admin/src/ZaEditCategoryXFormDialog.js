function ZaEditCategoryXFormDialog(parent,  app, w, h, title) {
	if (arguments.length == 0) return;
	this._standardButtons = [DwtDialog.OK_BUTTON, DwtDialog.CANCEL_BUTTON];	
	ZaXDialog.call(this, parent, app,title, w, h,"ZaEditCategoryXFormDialog");
	this._containedObject = {attrs:{}};
	this.initForm(ZaCRMadmin.categoryList,this.getMyXForm());
}

ZaEditCategoryXFormDialog.prototype = new ZaXDialog;
ZaEditCategoryXFormDialog.prototype.constructor = ZaEditCategoryXFormDialog;

ZaEditCategoryXFormDialog.prototype.getMyXForm = 
function() {	

	var json,reqHeader,reqJson,response;

	json = "jsonobj={\"action\":\"LIST\",\"object\":\"section\"}";
	reqHeader = {"Content-Type":"application/x-www-form-urlencoded"};
	reqJson = AjxStringUtil.urlEncode(json);
	response = AjxRpc.invoke(reqJson,biz_vnc_crm_admin.jspUrl, reqHeader, null, false);
	this._containedObject[ZaCRMadmin.A_section] = jsonParse(response.text);

	var len = this._containedObject[ZaCRMadmin.A_section].length;
	var temp="[";

	ZaEditCategoryXFormDialog.salesTeamChoices = [];
	for(var i=0;i<len;i++){
		var name=this._containedObject[ZaCRMadmin.A_section][i][ZaCRMadmin.A_sectionName];
		var id=this._containedObject[ZaCRMadmin.A_section][i][ZaCRMadmin.A_sectionId];

		if(i==len-1){
			temp +="{\"value\":\""+id+"\",\"label\":\""+name+"\"}]";
		}
		else{
			temp +="{\"value\":\""+id+"\",\"label\":\""+name+"\"},";
		}
	}
	var chkListJson = eval(temp);
	ZaEditCategoryXFormDialog.salesTeamChoices= chkListJson;

	var xFormObject = {
		numCols:1,
		items:[
		{type:_ZAWIZGROUP_, 
		items:[
			
	
		{ref:ZaCRMadmin.A_categoryName, type:_TEXTFIELD_, label:biz_vnc_crm_admin.HDR_name+":", labelLocation:_LEFT_, width:250},
		{type:_SPACER_, height:"5"},
		{ref:ZaCRMadmin.A_sales_team_id, type:_OSELECT1_, msgName:"salesTeam",label:"Sales Team :", labelLocation:_LEFT_, choices:ZaEditCategoryXFormDialog.salesTeamChoices,width:"150px", onChange:ZaTabView.onFormFieldChanged},
		{type:_SPACER_, height:"5"},
		{ref:ZaCRMadmin.A_categoryStatus,type:_ZA_CHECKBOX_, label:biz_vnc_crm_admin.HDR_status, trueValue:true, falseValue:false, visibilityChecks:[], enableDisableChecks:[]}
		]
			}]
	};
	return xFormObject;
}

