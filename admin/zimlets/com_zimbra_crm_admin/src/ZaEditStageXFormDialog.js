function ZaEditStageXFormDialog(parent,  app, w, h, title) {
	if (arguments.length == 0) return;
	this._standardButtons = [DwtDialog.OK_BUTTON, DwtDialog.CANCEL_BUTTON];	
	ZaXDialog.call(this, parent, app,title, w, h,"ZaEditStageXFormDialog");
	this._containedObject = {};
	this.initForm(ZaCRMadmin.stageList,this.getMyXForm());
}

ZaEditStageXFormDialog.prototype = new ZaXDialog;
ZaEditStageXFormDialog.prototype.constructor = ZaEditStageXFormDialog;

ZaEditStageXFormDialog.prototype.getMyXForm = 
function() {	
	var xFormObject = {
		numCols:1,
		items:[
		{type:_ZAWIZGROUP_, 
		items:[
			
	
		{ref:ZaCRMadmin.A_stageName, type:_TEXTFIELD_, label:com_zimbra_crm_admin.HDR_name+":", labelLocation:_LEFT_, width:250},
		{ref:ZaCRMadmin.A_stageSequence, type:_TEXTFIELD_, label:com_zimbra_crm_admin.HDR_stageSequence+":", labelLocation:_LEFT_, width:250},
		{type:_SPACER_, height:"5"},
		{ref:ZaCRMadmin.A_stageType, type:_OSELECT1_, msgName:"stageType",label:com_zimbra_crm_admin.HDR_stageType+":", labelLocation:_LEFT_, choices:ZaCRMadmin.stageChoices,width:"150px", onChange:ZaTabView.onFormFieldChanged},
		{type:_SPACER_, height:"5"},
		{ref:ZaCRMadmin.A_stageProbability, type:_TEXTFIELD_, label:com_zimbra_crm_admin.HDR_stageProb+":", labelLocation:_LEFT_, width:250},
		{ref:ZaCRMadmin.A_stageDescription, type:_TEXTFIELD_, label:com_zimbra_crm_admin.HDR_stageDesc+":", labelLocation:_LEFT_, width:250},
		{type:_SPACER_, height:"5"},
		{ref:ZaCRMadmin.A_stageAuto,type:_ZA_CHECKBOX_, label:com_zimbra_crm_admin.HDR_stageAuto, trueValue:true, falseValue:false, visibilityChecks:[], enableDisableChecks:[]},
		{type:_SPACER_, height:"5"},
		{ref:ZaCRMadmin.A_stageStatus,type:_ZA_CHECKBOX_, label:com_zimbra_crm_admin.HDR_status, trueValue:true, falseValue:false, visibilityChecks:[], enableDisableChecks:[]}
		]
			}]
	};
	return xFormObject;
}

