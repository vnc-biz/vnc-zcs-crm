function ZaEditChannelXFormDialog(parent,  app, w, h, title) {
	if (arguments.length == 0) return;
	this._standardButtons = [DwtDialog.OK_BUTTON, DwtDialog.CANCEL_BUTTON];	
	ZaXDialog.call(this, parent, app,title, w, h,"ZaEditChannelXFormDialog");
	this._containedObject = {};
	this.initForm(ZaCRMadmin.channelList,this.getMyXForm());
}

ZaEditChannelXFormDialog.prototype = new ZaXDialog;
ZaEditChannelXFormDialog.prototype.constructor = ZaEditChannelXFormDialog;

ZaEditChannelXFormDialog.prototype.getMyXForm = 
function() {	
	var xFormObject = {
		numCols:1,
		items:[
		{type:_ZAWIZGROUP_, 
		items:[
			
	
		{ref:ZaCRMadmin.A_channelName, type:_TEXTFIELD_, label:biz_vnc_crm_admin.HDR_name+":", labelLocation:_LEFT_, width:250},
		{type:_SPACER_, height:"5"},
		{ref:ZaCRMadmin.A_channelStatus,type:_ZA_CHECKBOX_, label:biz_vnc_crm_admin.HDR_status, trueValue:true, falseValue:false, visibilityChecks:[], enableDisableChecks:[]}

		]
			}]
	};
	return xFormObject;
}

