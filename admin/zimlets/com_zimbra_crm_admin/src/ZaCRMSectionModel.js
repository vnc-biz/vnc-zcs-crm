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



ZaCRMSectionModel.sectionSelectionListener = 
function (ev) {
	var instance = this.getInstance();
	var arr= this.widget.getSelection();

    if(arr && arr.length) {
        //arr.sort(ZaServer.comparepersonsByName);
        this.getModel().setInstanceValue(this.getInstance(), ZaCRMadmin.A_section_list_cache, arr);
        //instance.section_list_cache = arr;
    } else {
        this.getModel().setInstanceValue(this.getInstance(), ZaCRMadmin.A_section_list_cache, null);
        //instance.section_list_cache = null;
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
						instance[ZaCRMadmin.A_sectionRemoved].push(instance[ZaCRMadmin.A_section][k]);
						instance[ZaCRMadmin.A_section].splice(k,1);
						idArray[i]	= instance.section_list_cache[i][ZaCRMadmin.A_sectionId];
						break;	
					}
				}
			}
				
		}
	}
	ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format(com_zimbra_crm_admin.MSG_Delete,"Delete","Delete"));
	instance[ZaCRMadmin.A_section_list_cache]=new Array();
	this.getForm().parent.setDirty(true);
	this.getForm().refresh();

	var json = "jsonobj={\"action\":\"DELETEBYID\",\"object\":\"section\",\"array\":\"" + idArray + "\"}";
	var reqHeader = {"Content-Type":"application/x-www-form-urlencoded"};
	var reqJson = AjxStringUtil.urlEncode(json);
	var response = AjxRpc.invoke(reqJson,com_zimbra_crm_admin.jspUrl, reqHeader, null, false);
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
	
		 var volArr = this.getModel().getInstanceValue(this.getInstance(),ZaCRMadmin.A_section);

        var cnt = volArr.length;
        for(var i=0; i < cnt; i++) {
            if(volArr[i][ZaCRMadmin.A_sectionName]==obj[ZaCRMadmin.A_sectionName])
             {
                obj._index = i;
                break;
            }
        }
	
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
		var countries = [];
		var cnt = instance[ZaCRMadmin.A_section].length;
		for (var i=0; i< cnt; i++) 
		{
			countries[i] = instance[ZaCRMadmin.A_section][i];
		}
		var dirty = false;
		obj[ZaCRMadmin.A_sectionWriteby]= ZaZimbraAdmin.currentUserName;
		if(countries[obj._index]) 
		{
		    if(countries[obj._index][ZaCRMadmin.A_sectionName] != obj[ZaCRMadmin.A_sectionName]) 
		    {
		    	DBG.println(AjxDebug.DBG3, "Name Match");
		        countries[obj._index][ZaCRMadmin.A_sectionName] = obj[ZaCRMadmin.A_sectionName];
		        dirty=true;
		    }
		    if(countries[obj._index][ZaCRMadmin.A_sectionCode] != obj[ZaCRMadmin.A_sectionCode]) {
		        countries[obj._index][ZaCRMadmin.A_sectionCode] = obj[ZaCRMadmin.A_sectionCode];
		        dirty=true;
		    }
			if(countries[obj._index][ZaCRMadmin.A_sectionUserId] != obj[ZaCRMadmin.A_sectionUserId]) {
		        countries[obj._index][ZaCRMadmin.A_sectionUserId] = obj[ZaCRMadmin.A_sectionUserId];
		        dirty=true;
		    }
		    if(countries[obj._index][ZaCRMadmin.A_sectionStatus] != obj[ZaCRMadmin.A_sectionStatus]) {
		        countries[obj._index][ZaCRMadmin.A_sectionStatus] = obj[ZaCRMadmin.A_sectionStatus];
		        dirty=true;
		    }

		}
 		
		var j = JSON.stringify({action:"UPDATE",object:"section",sectionId:obj[ZaCRMadmin.A_sectionId],sectionName:obj[ZaCRMadmin.A_sectionName],sectionCode:obj[ZaCRMadmin.A_sectionCode],sectionUserId:obj[ZaCRMadmin.A_sectionUserId],status:obj[ZaCRMadmin.A_sectionStatus],writeBy:obj[ZaCRMadmin.A_sectionWriteby]});
		var json = "jsonobj=" + j;
		var reqHeader = {"Content-Type":"application/x-www-form-urlencoded"};
		var reqJson = AjxStringUtil.urlEncode(json);
		var response = AjxRpc.invoke(reqJson,com_zimbra_crm_admin.jspUrl, reqHeader, null, false);


//	 	this.getModel().setInstanceValue(this.getInstance(),ZaCRMadmin.A_section,countries);
		this.getModel().setInstanceValue(this.getInstance(), ZaCRMadmin.A_section_list_cache, new Array());
		
		for(t=0;t<cnt;t++)
		{
			instance[ZaCRMadmin.A_section].pop();
			
		}
		this.parent.setDirty(true);
		this.refresh();
		var tmp={};
		for(var k=0;k<cnt;k++)
		{
			tmp[ZaCRMadmin.A_sectionId]=countries[k][ZaCRMadmin.A_sectionId];
			tmp[ZaCRMadmin.A_sectionName]= countries[k][ZaCRMadmin.A_sectionName];
			tmp[ZaCRMadmin.A_sectionCode]= countries[k][ZaCRMadmin.A_sectionCode];
			tmp[ZaCRMadmin.A_sectionUserId]= countries[k][ZaCRMadmin.A_sectionUserId];
			tmp[ZaCRMadmin.A_sectionStatus]= countries[k][ZaCRMadmin.A_sectionStatus];
			tmp[ZaCRMadmin.A_sectionCreatedby]= countries[k][ZaCRMadmin.A_sectionCreatedby];
			tmp[ZaCRMadmin.A_sectionCreateddate]= countries[k][ZaCRMadmin.A_sectionCreateddate];
			tmp[ZaCRMadmin.A_sectionWriteby]= countries[k][ZaCRMadmin.A_sectionWriteby];
			tmp[ZaCRMadmin.A_sectionWritedate]= countries[k][ZaCRMadmin.A_sectionWritedate];
			
			instance[ZaCRMadmin.A_section].push(tmp);
			tmp={};	
		}
		ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format(com_zimbra_crm_admin.MSG_Edit+" : "+obj[ZaCRMadmin.A_sectionName]));
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
			instance[ZaCRMadmin.A_section].push(obj);
			var j = JSON.stringify({action:"ADD",object:"section",sectionId:obj[ZaCRMadmin.A_sectionId],sectionName:obj[ZaCRMadmin.A_sectionName],sectionCode:obj[ZaCRMadmin.A_sectionCode],sectionUserId:obj[ZaCRMadmin.A_sectionUserId],status:obj[ZaCRMadmin.A_sectionStatus],createBy:obj[ZaCRMadmin.A_sectionCreatedby],createDate:obj[ZaCRMadmin.A_sectionCreateddate],writeBy:obj[ZaCRMadmin.A_sectionWriteby],writeDate:obj[ZaCRMadmin.A_sectionWritedate]});
			var json = "jsonobj=" + j;
			alert(j);
			var reqHeader = {"Content-Type":"application/x-www-form-urlencoded"};
			var reqJson = AjxStringUtil.urlEncode(json);
			var response = AjxRpc.invoke(reqJson,com_zimbra_crm_admin.jspUrl, reqHeader, null, false);
			console.log(jsonParse(response.text));
			ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format(com_zimbra_crm_admin.MSG_Add+" : "+obj[ZaCRMadmin.A_sectionName]));
		}
		else
		{
			ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format("Country already exists"+" : "+obj[ZaCRMadmin.A_sectionName] + " OR " + obj[ZaCRMadmin.A_sectionCode]));
		}

		this.parent.setDirty(true);
		this.refresh();	
	}

}


ZaCRMSectionModel.addButtonListener =
function () {
	
	
//	DBG.println(AjxDebug.DBG3, "Enter in AddButton Listener");

//	var aa = this.getHtmlElement();
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
		obj[ZaCRMadmin.A_sectionCreateddate]= "null";
		obj[ZaCRMadmin.A_sectionWriteby]= ZaZimbraAdmin.currentUserName;
		obj[ZaCRMadmin.A_sectionWritedate]= "null";
		
		obj.current = false;		
		
		formPage.addSectionDlg.setObject(obj);
		formPage.addSectionDlg.popup();		
}