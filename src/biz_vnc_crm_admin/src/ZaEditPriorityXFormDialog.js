function ZaEditPriorityXFormDialog(parent,  app, w, h, title) {
	if (arguments.length == 0) return;
	this._standardButtons = [DwtDialog.OK_BUTTON, DwtDialog.CANCEL_BUTTON];	
	ZaXDialog.call(this, parent, app,title, w, h,"ZaEditPriorityXFormDialog");
	this._containedObject = {};
	this.initForm(ZaCRMadmin.priorityList,this.getMyXForm());
}

ZaEditPriorityXFormDialog.prototype = new ZaXDialog;
ZaEditPriorityXFormDialog.prototype.constructor = ZaEditPriorityXFormDialog;

ZaEditPriorityXFormDialog.prototype.getMyXForm = 
function() {	
	var xFormObject = {
		numCols:1,
		items:[
		{type:_ZAWIZGROUP_, 
		items:[
			
	
		{ref:ZaCRMadmin.A_priorityName, type:_TEXTFIELD_, label:biz_vnc_crm_admin.HDR_name+":", labelLocation:_LEFT_, width:250},
		{ref:ZaCRMadmin.A_priorityCode, type:_TEXTFIELD_, label:biz_vnc_crm_admin.HDR_code+":", labelLocation:_LEFT_, width:250},
		{type:_SPACER_, height:"5"},
		{ref:ZaCRMadmin.A_priorityStatus,type:_ZA_CHECKBOX_, label:biz_vnc_crm_admin.HDR_status, trueValue:true, falseValue:false, visibilityChecks:[], enableDisableChecks:[]}
		]
			}]
	};
	return xFormObject;
}

