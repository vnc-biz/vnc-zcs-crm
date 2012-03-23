function ZaCRMSectionModel (parent) {
	
	ZaTabView.call(this, {
        parent:parent,
        iKeyName:"ZaCRMSectionModel",
        contextId:"_CRM_Admin_"
        });
		this.initForm(ZaCRMadmin.myXModel,this.getMyXForm());	
		this._localXForm.setController(ZaApp.getInstance());
}

ZaCRMSectionModel.prototype = new ZaTabView;
ZaCRMSectionModel.prototype.constructor = ZaCRMSectionModel;

ZaCRMSectionModel.prototype.toString = function() {
	return "ZaCRMadminListView";
}
ZaCRMSectionModel.isEditSectionEnabled=function()
{
	return (!AjxUtil.isEmpty(this.getInstanceValue(ZaCRMadmin.A_section_list_cache)) && this.getInstanceValue(ZaCRMadmin.A_section_list_cache).length==1);
}
ZaCRMSectionModel.isDeleteSectionEnabled=function()
{
	return (!AjxUtil.isEmpty(this.getInstanceValue(ZaCRMadmin.A_section_list_cache)));
}

ZaCRMSectionModel.display =
function () {
		var json,reqHeader,reqJson,response;
		json = "jsonobj={\"action\":\"LIST\",\"object\":\"section\"}";
		reqHeader = {"Content-Type":"application/x-www-form-urlencoded"};
		reqJson = AjxStringUtil.urlEncode(json);
		response = AjxRpc.invoke(reqJson,com_zimbra_crm_admin.jspUrl, reqHeader, null, false);
		return (jsonParse(response.text));
}

ZaCRMSectionModel.sectionSelectionListener = 
function (ev) {
	var instance = this.getInstance();
	var arr= this.widget.getSelection();

    if(arr && arr.length) {
        this.getModel().setInstanceValue(this.getInstance(), ZaCRMadmin.A_section_list_cache, arr);
    } else {
        this.getModel().setInstanceValue(this.getInstance(), ZaCRMadmin.A_section_list_cache, null);
    }

    if (ev.detail == DwtListView.ITEM_DBL_CLICKED) {
        ZaCRMSectionModel.editButtonListener.call(this);
    }	
}

ZaCRMSectionModel.deleteButtonListener=function()
{
	var instance = this.getInstance();
	var path = ZaCRMadmin.A_section;
	var idArray = new Array();
	if(!this.getInstance()[ZaCRMadmin.A_sectionRemoved]) {
		this.getInstance()[ZaCRMadmin.A_sectionRemoved] = new Array();
	}

	if(instance.section_list_cache != null) {
		var cnt = instance.section_list_cache.length;
		if(cnt && instance[ZaCRMadmin.A_section] && instance[ZaCRMadmin.A_section]) {
			for(var i=0;i<cnt;i++) {
				var cnt2 = instance[ZaCRMadmin.A_section].length-1;				
				for(var k=cnt2;k>=0;k--) {
					if(instance[ZaCRMadmin.A_section][k][ZaCRMadmin.A_sectionName]==instance.section_list_cache[i][ZaCRMadmin.A_sectionName]) {
						idArray[i]	= instance.section_list_cache[i][ZaCRMadmin.A_sectionId];
						break;	
					}
				}
			}
				
		}
	}
	ZaApp.getInstance().dialogs["confirmMessageDialog"] = new ZaMsgDialog(ZaApp.getInstance().getAppCtxt().getShell(), null, [DwtDialog.YES_BUTTON, DwtDialog.NO_BUTTON], null, ZaId.VIEW_STATUS + "_confirmMessage");
	ZaApp.getInstance().dialogs["confirmMessageDialog"].setMessage(AjxMessageFormat.format(com_zimbra_crm_admin.MSG_Delete),DwtMessageDialog.INFO_STYLE );
	ZaApp.getInstance().dialogs["confirmMessageDialog"].registerCallback(DwtDialog.YES_BUTTON, ZaCRMSectionModel.prototype.doDelete, this, [idArray]);
	ZaApp.getInstance().dialogs["confirmMessageDialog"].popup();		
}

ZaCRMSectionModel.prototype.doDelete = function(idArray) {
	
	var instance = this.getInstance();
	var name = ZaZimbraAdmin.currentUserName;
	var json = "jsonobj={\"action\":\"DELETEBYID\",\"object\":\"section\",\"array\":\"" + idArray + "\",\"writeBy\":\"" + name + "\"}";
	var reqHeader = {"Content-Type":"application/x-www-form-urlencoded"};
	var reqJson = AjxStringUtil.urlEncode(json);
	var response = AjxRpc.invoke(reqJson,com_zimbra_crm_admin.jspUrl, reqHeader, null, false);
	instance[ZaCRMadmin.A_section] = ZaCRMSectionModel.display();

	ZaApp.getInstance().dialogs["confirmMessageDialog"].popdown();
	this.getForm().parent.setDirty(true);
	this.getForm().refresh();

}

ZaCRMSectionModel.closeButtonListener=
function()
{
	this.parent.editSectionDlg.popdown();
	this.getInstance()[ZaCRMadmin.A_section_list_cache]=new Array();
	this.parent.setDirty(false);
	DBG.println(AjxDebug.DBG3, "Cancel button Listener");
	this.refresh();
	
}
ZaCRMSectionModel.editButtonListener =
function () {
    var instance = this.getInstance();
    
    if(instance.section_list_cache && instance.section_list_cache[0]) {
        var formPage = this.getForm().parent;
        if(!formPage.editSectionDlg) {
            formPage.editSectionDlg = new ZaEditSectionXFormDialog(ZaApp.getInstance().getAppCtxt().getShell(),ZaApp.getInstance(), "350px", "120px","Edit Section");
            formPage.editSectionDlg.registerCallback(DwtDialog.OK_BUTTON, ZaCRMSectionModel.updateSection, this.getForm(),null);
            formPage.editSectionDlg.registerCallback(DwtDialog.CANCEL_BUTTON, ZaCRMSectionModel.closeButtonListener, this.getForm(),null);
        }
        var obj = {};
        obj[ZaCRMadmin.A_sectionId] = instance.section_list_cache[0][ZaCRMadmin.A_sectionId];
        obj[ZaCRMadmin.A_sectionName] = instance.section_list_cache[0][ZaCRMadmin.A_sectionName];
        obj[ZaCRMadmin.A_sectionCode] = instance.section_list_cache[0][ZaCRMadmin.A_sectionCode];
		obj[ZaCRMadmin.A_sectionUserId] = instance.section_list_cache[0][ZaCRMadmin.A_sectionUserId];
        obj[ZaCRMadmin.A_sectionStatus] = instance.section_list_cache[0][ZaCRMadmin.A_sectionStatus];

		instance[ZaCRMadmin.A_section_list_cache]=new Array();
        formPage.editSectionDlg.setObject(obj);
        formPage.editSectionDlg.popup();
    }
}

ZaCRMSectionModel.updateSection=function()
{
	if(this.parent.editSectionDlg) 
	{
     	this.parent.editSectionDlg.popdown();
  		var obj = this.parent.editSectionDlg.getObject();

		var instance = this.getInstance();
		obj[ZaCRMadmin.A_sectionWriteby]= ZaZimbraAdmin.currentUserName;
		var j = JSON.stringify({action:"UPDATE",object:"section",sectionId:obj[ZaCRMadmin.A_sectionId],sectionName:obj[ZaCRMadmin.A_sectionName],sectionCode:obj[ZaCRMadmin.A_sectionCode],userId:obj[ZaCRMadmin.A_sectionUserId],status:obj[ZaCRMadmin.A_sectionStatus],writeBy:obj[ZaCRMadmin.A_sectionWriteby]});
		var json = "jsonobj=" + j;
		var reqHeader = {"Content-Type":"application/x-www-form-urlencoded"};
		var reqJson = AjxStringUtil.urlEncode(json);
		var response = AjxRpc.invoke(reqJson,com_zimbra_crm_admin.jspUrl, reqHeader, null, false);

		ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format(com_zimbra_crm_admin.MSG_Edit+" : "+obj[ZaCRMadmin.A_sectionName]));
		instance[ZaCRMadmin.A_section] = ZaCRMSectionModel.display();
		this.parent.setDirty(true);
		this.refresh();
	}
}

ZaCRMSectionModel.addPerson  = function () {
	if(this.parent.addSectionDlg) {

		var obj = this.parent.addSectionDlg.getObject();
		var instance = this.getInstance();
		instance = this.getInstance();
		var flag = 0;

		var len = this.getInstance()[ZaCRMadmin.A_section].length;
		for (var i=0;i<len;i++)
		{
			if((obj[ZaCRMadmin.A_sectionName] == this.getInstance()[ZaCRMadmin.A_section][i][ZaCRMadmin.A_sectionName]) || (obj[ZaCRMadmin.A_sectionCode] == this.getInstance()[ZaCRMadmin.A_section][i][ZaCRMadmin.A_sectionCode]))
			{
				flag = 1;
			}
		}
		if(flag == 0)
		{
			this.parent.addSectionDlg.popdown();
			var j = JSON.stringify({action:"ADD",object:"section",sectionId:obj[ZaCRMadmin.A_sectionId],sectionName:obj[ZaCRMadmin.A_sectionName],sectionCode:obj[ZaCRMadmin.A_sectionCode],userId:obj[ZaCRMadmin.A_sectionUserId],status:obj[ZaCRMadmin.A_sectionStatus],createBy:obj[ZaCRMadmin.A_sectionCreatedby],writeBy:obj[ZaCRMadmin.A_sectionWriteby]});
			var json = "jsonobj=" + j;
			var reqHeader = {"Content-Type":"application/x-www-form-urlencoded"};
			var reqJson = AjxStringUtil.urlEncode(json);
			var response = AjxRpc.invoke(reqJson,com_zimbra_crm_admin.jspUrl, reqHeader, null, false);
			ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format(com_zimbra_crm_admin.MSG_Add+" : "+obj[ZaCRMadmin.A_sectionName]));
		}
		else
		{
			ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format("Country already exists"+" : "+obj[ZaCRMadmin.A_sectionName] + " OR " + obj[ZaCRMadmin.A_sectionCode]));
		}
		instance[ZaCRMadmin.A_section] = ZaCRMSectionModel.display();
		this.parent.setDirty(true);
		this.refresh();	
	}
}

ZaCRMSectionModel.addButtonListener =
function () {
		var formPage = this.getForm().parent;
		if(!formPage.addSectionDlg) {
			formPage.addSectionDlg = new ZaEditSectionXFormDialog(ZaApp.getInstance().getAppCtxt().getShell(),ZaApp.getInstance(),"350px", "120px","Add new section");
			formPage.addSectionDlg.registerCallback(DwtDialog.OK_BUTTON, ZaCRMSectionModel.addPerson , this.getForm(), null);						
		}
		
		var obj = {};
		obj[ZaCRMadmin.A_sectionId]= 0;
		obj[ZaCRMadmin.A_sectionName]= "";
		obj[ZaCRMadmin.A_sectionCode]= "";
		obj[ZaCRMadmin.A_sectionUserId]= "Select Users";
		obj[ZaCRMadmin.A_sectionStatus]= true;
		obj[ZaCRMadmin.A_sectionCreatedby]= ZaZimbraAdmin.currentUserName;
		obj[ZaCRMadmin.A_sectionWriteby]= ZaZimbraAdmin.currentUserName;
		
		obj.current = false;		
		
		formPage.addSectionDlg.setObject(obj);
		formPage.addSectionDlg.popup();		
}