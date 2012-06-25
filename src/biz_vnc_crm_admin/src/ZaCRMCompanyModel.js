function ZaCRMCompanyModel (parent) {
	ZaTabView.call(this, {
        parent:parent,
        iKeyName:"ZaCRMCompanyModel",
        contextId:"_CRM_Admin_"
        });
		this.initForm(ZaCRMadmin.myXModel,this.getMyXForm());	
		this._localXForm.setController(ZaApp.getInstance());
}


ZaCRMCompanyModel.prototype = new ZaTabView;

ZaCRMCompanyModel.prototype.constructor = ZaCRMCompanyModel;

ZaCRMCompanyModel.prototype.toString = function() {
	return "ZaCRMadminListView";
}

ZaCRMCompanyModel.isEditCompanyEnabled=function()
{
	return (!AjxUtil.isEmpty(this.getInstanceValue(ZaCRMadmin.A_company_list_cache)) && this.getInstanceValue(ZaCRMadmin.A_company_list_cache).length==1);
}
ZaCRMCompanyModel.isDeleteCompanyEnabled=function()
{
	return (!AjxUtil.isEmpty(this.getInstanceValue(ZaCRMadmin.A_company_list_cache)));
}

ZaCRMCompanyModel.display =
function () {

		var json,reqHeader,reqJson,response;
		json = "jsonobj={\"action\":\"LIST\",\"object\":\"company\"}";
		reqHeader = {"Content-Type":"application/x-www-form-urlencoded"};
		reqJson = AjxStringUtil.urlEncode(json);
		response = AjxRpc.invoke(reqJson,biz_vnc_crm_admin.jspUrl, reqHeader, null, false);
		return (jsonParse(response.text));
}

ZaCRMCompanyModel.companySelectionListener = 
function (ev) {
	var instance = this.getInstance();
	var arr= this.widget.getSelection();

    if(arr && arr.length) {
        this.getModel().setInstanceValue(this.getInstance(), ZaCRMadmin.A_company_list_cache, arr);
    } else {
        this.getModel().setInstanceValue(this.getInstance(), ZaCRMadmin.A_company_list_cache, null);
    }

    if (ev.detail == DwtListView.ITEM_DBL_CLICKED) {
        ZaCRMCompanyModel.editButtonListener.call(this);
    }
}

ZaCRMCompanyModel.deleteButtonListener=function()
{
	var instance = this.getInstance();
	var path = ZaCRMadmin.A_company;
	var idArray = new Array();
	if(!this.getInstance()[ZaCRMadmin.A_companyRemoved]) {
		this.getInstance()[ZaCRMadmin.A_companyRemoved] = new Array();
	}
	if(instance.company_list_cache != null) {
		var cnt = instance.company_list_cache.length;
		if(cnt && instance[ZaCRMadmin.A_company] && instance[ZaCRMadmin.A_company]) {
			for(var i=0;i<cnt;i++) {
				var cnt2 = instance[ZaCRMadmin.A_company].length-1;				
				for(var k=cnt2;k>=0;k--) {
					if(instance[ZaCRMadmin.A_company][k][ZaCRMadmin.A_companyName]==instance.company_list_cache[i][ZaCRMadmin.A_companyName]) {
						idArray[i]	= instance.company_list_cache[i][ZaCRMadmin.A_companyId];
						break;	
					}
				} 
			}
				
		}
	}
//	instance[ZaCRMadmin.A_company_list_cache]=new Array();
	ZaApp.getInstance().dialogs["confirmMessageDialog"] = new ZaMsgDialog(ZaApp.getInstance().getAppCtxt().getShell(), null, [DwtDialog.YES_BUTTON, DwtDialog.NO_BUTTON], null, ZaId.VIEW_STATUS + "_confirmMessage");
	ZaApp.getInstance().dialogs["confirmMessageDialog"].setMessage(AjxMessageFormat.format(biz_vnc_crm_admin.MSG_Delete),DwtMessageDialog.INFO_STYLE );
	ZaApp.getInstance().dialogs["confirmMessageDialog"].registerCallback(DwtDialog.YES_BUTTON, ZaCRMCompanyModel.prototype.doDelete, this, [idArray]);
	ZaApp.getInstance().dialogs["confirmMessageDialog"].popup();		
}

ZaCRMCompanyModel.prototype.doDelete = function(idArray) {
	var name = ZaZimbraAdmin.currentUserName;
	var json = "jsonobj={\"action\":\"DELETEBYID\",\"object\":\"company\",\"array\":\"" + idArray + "\",\"writeBy\":\"" + name + "\"}";
	var reqHeader = {"Content-Type":"application/x-www-form-urlencoded"};
	var reqJson = AjxStringUtil.urlEncode(json);
	var response = AjxRpc.invoke(reqJson,biz_vnc_crm_admin.jspUrl, reqHeader, null, false);
	var instance = this.getInstance();
	instance[ZaCRMadmin.A_company] = ZaCRMCompanyModel.display();

	ZaApp.getInstance().dialogs["confirmMessageDialog"].popdown();
	this.getForm().parent.setDirty(true);
	this.getForm().refresh();
}

ZaCRMCompanyModel.closeButtonListener=
function()
{
	this.parent.editCompanyDlg.popdown();
	this.getInstance()[ZaCRMadmin.A_company_list_cache]=new Array();
	this.parent.setDirty(false);
	this.refresh();
}
ZaCRMCompanyModel.editButtonListener =
function () {
    var instance = this.getInstance();
    if(instance.company_list_cache && instance.company_list_cache[0]) {
        var formPage = this.getForm().parent;
        if(!formPage.editCompanyDlg) {
            formPage.editCompanyDlg = new ZaEditCompanyXFormDialog(ZaApp.getInstance().getAppCtxt().getShell(),ZaApp.getInstance(), "350px", "180px","Edit Company");
            formPage.editCompanyDlg.registerCallback(DwtDialog.OK_BUTTON, ZaCRMCompanyModel.updateCompany, this.getForm(),null);
            formPage.editCompanyDlg.registerCallback(DwtDialog.CANCEL_BUTTON, ZaCRMCompanyModel.closeButtonListener, this.getForm(),null);
        }
        var obj = {};
        obj[ZaCRMadmin.A_companyId] = instance.company_list_cache[0][ZaCRMadmin.A_companyId];
        obj[ZaCRMadmin.A_companyName] = instance.company_list_cache[0][ZaCRMadmin.A_companyName];
        obj[ZaCRMadmin.A_companyAddress] = instance.company_list_cache[0][ZaCRMadmin.A_companyAddress];
        obj[ZaCRMadmin.A_companyPhone] = instance.company_list_cache[0][ZaCRMadmin.A_companyPhone];
        obj[ZaCRMadmin.A_companyFax] = instance.company_list_cache[0][ZaCRMadmin.A_companyFax];
        obj[ZaCRMadmin.A_companyEmail] = instance.company_list_cache[0][ZaCRMadmin.A_companyEmail];
		obj[ZaCRMadmin.A_companyStatus] = instance.company_list_cache[0][ZaCRMadmin.A_companyStatus];

		formPage.editCompanyDlg.setObject(obj);
        formPage.editCompanyDlg.popup();
    }
}

ZaCRMCompanyModel.updateCompany=function()
{
	if(this.parent.editCompanyDlg) 
	{
       	this.parent.editCompanyDlg.popdown();
   		var obj = this.parent.editCompanyDlg.getObject();
		var instance = this.getInstance();

		obj[ZaCRMadmin.A_companyWriteby]= ZaZimbraAdmin.currentUserName;
		var j = JSON.stringify({action:"UPDATE",object:"company",companyId:obj[ZaCRMadmin.A_companyId],companyName:obj[ZaCRMadmin.A_companyName],companyAddress:obj[ZaCRMadmin.A_companyAddress],companyPhone:obj[ZaCRMadmin.A_companyPhone],companyFax:obj[ZaCRMadmin.A_companyFax],companyEmail:obj[ZaCRMadmin.A_companyEmail],status:obj[ZaCRMadmin.A_companyStatus],writeBy:obj[ZaCRMadmin.A_companyWriteby]});
		var json = "jsonobj=" + j;
		var reqHeader = {"Content-Type":"application/x-www-form-urlencoded"};
		var reqJson = AjxStringUtil.urlEncode(json);
		var response = AjxRpc.invoke(reqJson,biz_vnc_crm_admin.jspUrl, reqHeader, null, false);

		instance[ZaCRMadmin.A_company] = ZaCRMCompanyModel.display();

		ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format(biz_vnc_crm_admin.MSG_Edit+" : "+obj[ZaCRMadmin.A_companyName]));
		this.parent.setDirty(true);
		this.refresh();
	}
}

ZaCRMCompanyModel.addPerson  = function () {
	if(this.parent.addCompanyDlg) {
		var obj = this.parent.addCompanyDlg.getObject();
		var instance = this.getInstance();
		instance = this.getInstance();
		var flag = 0;
		var len = this.getInstance()[ZaCRMadmin.A_company].length;
		for (var i=0;i<len;i++)
		{
			if(obj[ZaCRMadmin.A_companyName] == this.getInstance()[ZaCRMadmin.A_company][i][ZaCRMadmin.A_companyName])
			{
				flag = 1;
			}
		}
		if(flag == 0)
		{
			this.parent.addCompanyDlg.popdown();
			var j = JSON.stringify({action:"ADD",object:"company",companyId:obj[ZaCRMadmin.A_companyId],companyName:obj[ZaCRMadmin.A_companyName],companyAddress:obj[ZaCRMadmin.A_companyAddress],companyPhone:obj[ZaCRMadmin.A_companyPhone],companyFax:obj[ZaCRMadmin.A_companyFax],companyEmail:obj[ZaCRMadmin.A_companyEmail],status:obj[ZaCRMadmin.A_companyStatus],createBy:obj[ZaCRMadmin.A_companyCreatedby],writeBy:obj[ZaCRMadmin.A_companyWriteby]});
			var json = "jsonobj=" + j;
			var reqHeader = {"Content-Type":"application/x-www-form-urlencoded"};
			var reqJson = AjxStringUtil.urlEncode(json);
			var response = AjxRpc.invoke(reqJson,biz_vnc_crm_admin.jspUrl, reqHeader, null, false);
			ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format(biz_vnc_crm_admin.MSG_Add+" : "+obj[ZaCRMadmin.A_companyName]));
		}
		else
		{
			ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format("Company already exists"+" : "+obj[ZaCRMadmin.A_companyName] + " OR " + obj[ZaCRMadmin.A_companyCode]));
		}

		instance[ZaCRMadmin.A_company] = ZaCRMCompanyModel.display();
		this.parent.setDirty(true);
		this.refresh();	
	}
}
ZaCRMCompanyModel.addButtonListener =
function () {
		var formPage = this.getForm().parent;
		if(!formPage.addCompanyDlg) {
			formPage.addCompanyDlg = new ZaEditCompanyXFormDialog(ZaApp.getInstance().getAppCtxt().getShell(),ZaApp.getInstance(),"350px", "180px","Add new company");
			formPage.addCompanyDlg.registerCallback(DwtDialog.OK_BUTTON, ZaCRMCompanyModel.addPerson , this.getForm(), null);						
		}
		
		var obj = {};
		obj[ZaCRMadmin.A_companyId]= 0;
		obj[ZaCRMadmin.A_companyName]= "";
		obj[ZaCRMadmin.A_companyAddress]= "";
		obj[ZaCRMadmin.A_companyPhone]= "";
		obj[ZaCRMadmin.A_companyFax]= "";
		obj[ZaCRMadmin.A_companyEmail]= "";
		obj[ZaCRMadmin.A_companyStatus]= true;
		obj[ZaCRMadmin.A_companyCreatedby]= ZaZimbraAdmin.currentUserName;
		obj[ZaCRMadmin.A_companyWriteby]= ZaZimbraAdmin.currentUserName;
	
		obj.current = false;		
		
		formPage.addCompanyDlg.setObject(obj);
		formPage.addCompanyDlg.popup();		
}