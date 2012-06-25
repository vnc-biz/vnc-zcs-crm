function ZaCRMCategoryModel (parent) {
	
	ZaTabView.call(this, {
        parent:parent,
        iKeyName:"ZaCRMCategoryModel",
        contextId:"_CRM_Admin_"
        });
		this.initForm(ZaCRMadmin.myXModel,this.getMyXForm());	
		this._localXForm.setController(ZaApp.getInstance());
}

ZaCRMCategoryModel.prototype = new ZaTabView;
ZaCRMCategoryModel.prototype.constructor = ZaCRMCategoryModel;

ZaCRMCategoryModel.prototype.toString = function() {
	return "ZaCRMadminListView";
}

ZaCRMCategoryModel.isEditCategoryEnabled=function()
{
	return (!AjxUtil.isEmpty(this.getInstanceValue(ZaCRMadmin.A_category_list_cache)) && this.getInstanceValue(ZaCRMadmin.A_category_list_cache).length==1);
}
ZaCRMCategoryModel.isDeleteCategoryEnabled=function()
{
	return (!AjxUtil.isEmpty(this.getInstanceValue(ZaCRMadmin.A_category_list_cache)));
}

ZaCRMCategoryModel.display =
function () {
		var json,reqHeader,reqJson,response;
		json = "jsonobj={\"action\":\"LIST\",\"object\":\"category\"}";
		reqHeader = {"Content-Type":"application/x-www-form-urlencoded"};
		reqJson = AjxStringUtil.urlEncode(json);
		response = AjxRpc.invoke(reqJson,biz_vnc_crm_admin.jspUrl, reqHeader, null, false);
		return (jsonParse(response.text));
}



ZaCRMCategoryModel.categorySelectionListener = 
function (ev) {
	var instance = this.getInstance();
	var arr= this.widget.getSelection();

    if(arr && arr.length) {
        this.getModel().setInstanceValue(this.getInstance(), ZaCRMadmin.A_category_list_cache, arr);
    } else {
        this.getModel().setInstanceValue(this.getInstance(), ZaCRMadmin.A_category_list_cache, null);
    }

    if (ev.detail == DwtListView.ITEM_DBL_CLICKED) {
        ZaCRMCategoryModel.editButtonListener.call(this);
    }
	
}

ZaCRMCategoryModel.deleteButtonListener=function()
{
	var instance = this.getInstance();
	var path = ZaCRMadmin.A_category;
	var idArray = new Array();
	if(!this.getInstance()[ZaCRMadmin.A_categoryRemoved]) {
		this.getInstance()[ZaCRMadmin.A_categoryRemoved] = new Array();
	}

	if(instance.category_list_cache != null) {
		var cnt = instance.category_list_cache.length;
		if(cnt && instance[ZaCRMadmin.A_category] && instance[ZaCRMadmin.A_category]) {
			for(var i=0;i<cnt;i++) {
				var cnt2 = instance[ZaCRMadmin.A_category].length-1;				
				for(var k=cnt2;k>=0;k--) {
					if(instance[ZaCRMadmin.A_category][k][ZaCRMadmin.A_categoryName]==instance.category_list_cache[i][ZaCRMadmin.A_categoryName]) {
						idArray[i]	= instance.category_list_cache[i][ZaCRMadmin.A_categoryId];
						break;	
					}
				}
			}
				
		}
	}
	//instance[ZaCRMadmin.A_category] = ZaCRMCategoryModel.display();
	ZaApp.getInstance().dialogs["confirmMessageDialog"] = new ZaMsgDialog(ZaApp.getInstance().getAppCtxt().getShell(), null, [DwtDialog.YES_BUTTON, DwtDialog.NO_BUTTON], null, ZaId.VIEW_STATUS + "_confirmMessage");
	ZaApp.getInstance().dialogs["confirmMessageDialog"].setMessage(AjxMessageFormat.format(biz_vnc_crm_admin.MSG_Delete),DwtMessageDialog.INFO_STYLE );
	ZaApp.getInstance().dialogs["confirmMessageDialog"].registerCallback(DwtDialog.YES_BUTTON, ZaCRMCategoryModel.prototype.doDelete, this, [idArray]);
	ZaApp.getInstance().dialogs["confirmMessageDialog"].popup();		
}

ZaCRMCategoryModel.prototype.doDelete = function(idArray) {

	var instance = this.getInstance();	
	var name = ZaZimbraAdmin.currentUserName;
	var json = "jsonobj={\"action\":\"DELETEBYID\",\"object\":\"category\",\"array\":\"" + idArray + "\",\"writeBy\":\"" + name + "\"}";
	var reqHeader = {"Content-Type":"application/x-www-form-urlencoded"};
	var reqJson = AjxStringUtil.urlEncode(json);
	var response = AjxRpc.invoke(reqJson,biz_vnc_crm_admin.jspUrl, reqHeader, null, false);
	instance[ZaCRMadmin.A_category] = ZaCRMCategoryModel.display();

	ZaApp.getInstance().dialogs["confirmMessageDialog"].popdown();
	this.getForm().parent.setDirty(true);
	this.getForm().refresh();

}

ZaCRMCategoryModel.closeButtonListener=
function()
{
	this.parent.editcategoryDlg.popdown();
	this.getInstance()[ZaCRMadmin.A_category_list_cache]=new Array();
	this.parent.setDirty(false);
	DBG.println(AjxDebug.DBG3, "Cancel button Listener");
	this.refresh();
	
}
ZaCRMCategoryModel.editButtonListener =
function () {
    var instance = this.getInstance();
    
    if(instance.category_list_cache && instance.category_list_cache[0]) {
        var formPage = this.getForm().parent;
        if(!formPage.editcategoryDlg) {
            formPage.editcategoryDlg = new ZaEditCategoryXFormDialog(ZaApp.getInstance().getAppCtxt().getShell(),ZaApp.getInstance(), "350px", "100px","Edit category");
            formPage.editcategoryDlg.registerCallback(DwtDialog.OK_BUTTON, ZaCRMCategoryModel.updatecategory, this.getForm(),null);
            formPage.editcategoryDlg.registerCallback(DwtDialog.CANCEL_BUTTON, ZaCRMCategoryModel.closeButtonListener, this.getForm(),null);
        }
        var obj = {};
        obj[ZaCRMadmin.A_categoryId] = instance.category_list_cache[0][ZaCRMadmin.A_categoryId];
        obj[ZaCRMadmin.A_categoryName] = instance.category_list_cache[0][ZaCRMadmin.A_categoryName];
		var len = ZaEditCategoryXFormDialog.salesTeamChoices.length;
		for(var i=0;i<len;i++){
			if(ZaEditCategoryXFormDialog.salesTeamChoices[i].label==instance.category_list_cache[0][ZaCRMadmin.A_sales_team_id])
				obj[ZaCRMadmin.A_sales_team_id] = ZaEditCategoryXFormDialog.salesTeamChoices[i].value;
		}
        obj[ZaCRMadmin.A_categoryStatus] = instance.category_list_cache[0][ZaCRMadmin.A_categoryStatus];
		
		/*
		var volArr = this.getModel().getInstanceValue(this.getInstance(),ZaCRMadmin.A_category);

        var cnt = volArr.length;
        for(var i=0; i < cnt; i++) {
            if(volArr[i][ZaCRMadmin.A_categoryName]==obj[ZaCRMadmin.A_categoryName])
             {
                obj._index = i;
                break;
            }
        }
	
		instance[ZaCRMadmin.A_category_list_cache]=new Array();
    */
		formPage.editcategoryDlg.setObject(obj);
        formPage.editcategoryDlg.popup();
    }
}

ZaCRMCategoryModel.updatecategory=function()
{
	if(this.parent.editcategoryDlg) 
	{
	
       	this.parent.editcategoryDlg.popdown();
    	var obj = this.parent.editcategoryDlg.getObject();
		var instance = this.getInstance();
/*	
		var categoryes = [];
		var cnt = instance[ZaCRMadmin.A_category].length;
		for (var i=0; i< cnt; i++) 
		{
			categoryes[i] = instance[ZaCRMadmin.A_category][i];
		}
		var dirty = false;

		if(categoryes[obj._index]) 
		{
		    if(categoryes[obj._index][ZaCRMadmin.A_categoryName] != obj[ZaCRMadmin.A_categoryName]) 
		    {
		        categoryes[obj._index][ZaCRMadmin.A_categoryName] = obj[ZaCRMadmin.A_categoryName];
		        dirty=true;
		    }
		    if(categoryes[obj._index][ZaCRMadmin.A_sales_team_id] != obj[ZaCRMadmin.A_sales_team_id]) {
		        categoryes[obj._index][ZaCRMadmin.A_sales_team_id] = obj[ZaCRMadmin.A_sales_team_id];
		        dirty=true;
		    }
		    if(categoryes[obj._index][ZaCRMadmin.A_categoryStatus] != obj[ZaCRMadmin.A_categoryStatus]) 
		    {
		        categoryes[obj._index][ZaCRMadmin.A_categoryStatus] = obj[ZaCRMadmin.A_categoryStatus];
		        dirty=true;
		    }
			categoryes[obj._index][ZaCRMadmin.A_categoryWritedate] = AjxDateFormat.format("yyyy-MM-dd HH:mm:ss.0", new Date());

		}
		*/

		obj[ZaCRMadmin.A_categoryWriteby]= ZaZimbraAdmin.currentUserName; 		
		var j = JSON.stringify({action:"UPDATE",object:"category",categoryId:obj[ZaCRMadmin.A_categoryId],categoryName:obj[ZaCRMadmin.A_categoryName],sectionId:obj[ZaCRMadmin.A_sales_team_id],status:obj[ZaCRMadmin.A_categoryStatus],writeBy:obj[ZaCRMadmin.A_categoryWriteby]});
		var json = "jsonobj=" + j;
		var reqHeader = {"Content-Type":"application/x-www-form-urlencoded"};
		var reqJson = AjxStringUtil.urlEncode(json);
		var response = AjxRpc.invoke(reqJson,biz_vnc_crm_admin.jspUrl, reqHeader, null, false);
/*
		this.getModel().setInstanceValue(this.getInstance(), ZaCRMadmin.A_category_list_cache, new Array());
		
		for(t=0;t<cnt;t++)
		{
			instance[ZaCRMadmin.A_category].pop();
			
		}
		this.parent.setDirty(true);
		this.refresh();
		var tmp={};
		for(var k=0;k<cnt;k++)
		{
			tmp[ZaCRMadmin.A_categoryId]=categoryes[k][ZaCRMadmin.A_categoryId];
			tmp[ZaCRMadmin.A_categoryName]= categoryes[k][ZaCRMadmin.A_categoryName];
			tmp[ZaCRMadmin.A_sales_team_id]= categoryes[k][ZaCRMadmin.A_sales_team_id];
			tmp[ZaCRMadmin.A_categoryStatus]= categoryes[k][ZaCRMadmin.A_categoryStatus];
			tmp[ZaCRMadmin.A_categoryCreatedby]= categoryes[k][ZaCRMadmin.A_categoryCreatedby];
			tmp[ZaCRMadmin.A_categoryCreateddate]= categoryes[k][ZaCRMadmin.A_categoryCreateddate];
			tmp[ZaCRMadmin.A_categoryWriteby]= categoryes[k][ZaCRMadmin.A_categoryWriteby];
			tmp[ZaCRMadmin.A_categoryWritedate]= categoryes[k][ZaCRMadmin.A_categoryWritedate];
			
			instance[ZaCRMadmin.A_category].push(tmp);
			tmp={};	
		}*/

		ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format(biz_vnc_crm_admin.MSG_Edit+" : "+obj[ZaCRMadmin.A_categoryName]));
		instance[ZaCRMadmin.A_category] = ZaCRMCategoryModel.display();
		this.parent.setDirty(true);
		this.refresh();		

	}
		
}

ZaCRMCategoryModel.addPerson  = function () {
	if(this.parent.addcategoryDlg) {

		var obj = this.parent.addcategoryDlg.getObject();
		var instance = this.getInstance();
		instance = this.getInstance();
		var flag = 0;
		var len = this.getInstance()[ZaCRMadmin.A_category].length;
		for (var i=0;i<len;i++)
		{
			if((obj[ZaCRMadmin.A_categoryName] == this.getInstance()[ZaCRMadmin.A_category][i][ZaCRMadmin.A_categoryName]))
			{
				flag = 1;
			}
		}
		if(flag == 0)
		{
			this.parent.addcategoryDlg.popdown();
			var j = JSON.stringify({action:"ADD",object:"category",categoryId:obj[ZaCRMadmin.A_categoryId],categoryName:obj[ZaCRMadmin.A_categoryName],sectionId:obj[ZaCRMadmin.A_sales_team_id],status:obj[ZaCRMadmin.A_categoryStatus],createBy:obj[ZaCRMadmin.A_categoryCreatedby],writeBy:obj[ZaCRMadmin.A_categoryWriteby]});
			var json = "jsonobj=" + j;
			var reqHeader = {"Content-Type":"application/x-www-form-urlencoded"};
			var reqJson = AjxStringUtil.urlEncode(json);
			var response = AjxRpc.invoke(reqJson,biz_vnc_crm_admin.jspUrl, reqHeader, null, false);
			ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format(biz_vnc_crm_admin.MSG_Add+" : "+obj[ZaCRMadmin.A_categoryName]));			
		}
		else
		{
			ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format("Category already exists"+" : "+obj[ZaCRMadmin.A_categoryName]));
		}
		instance[ZaCRMadmin.A_category] = ZaCRMCategoryModel.display();
		this.parent.setDirty(true);
		this.refresh();	
	}

}


ZaCRMCategoryModel.addButtonListener =
function () {
	
	
	DBG.println(AjxDebug.DBG3, "Enter in AddButton Listener");

//	var aa = this.getHtmlElement();
		var formPage = this.getForm().parent;
		if(!formPage.addcategoryDlg) {
			formPage.addcategoryDlg = new ZaEditCategoryXFormDialog(ZaApp.getInstance().getAppCtxt().getShell(),ZaApp.getInstance(),"350px", "100px","Add new category");
			formPage.addcategoryDlg.registerCallback(DwtDialog.OK_BUTTON, ZaCRMCategoryModel.addPerson , this.getForm(), null);						
		}
		
		var obj = {};

		obj[ZaCRMadmin.A_categoryId]= 0;
		obj[ZaCRMadmin.A_categoryName]= "";
		obj[ZaCRMadmin.A_categoryStatus]= true;
		obj[ZaCRMadmin.A_sales_team_id]= "Select Section";
		obj[ZaCRMadmin.A_categoryCreatedby]= ZaZimbraAdmin.currentUserName;
		obj[ZaCRMadmin.A_categoryWriteby]= ZaZimbraAdmin.currentUserName;
	
		obj.current = false;		
		
		formPage.addcategoryDlg.setObject(obj);
		formPage.addcategoryDlg.popup();		
}