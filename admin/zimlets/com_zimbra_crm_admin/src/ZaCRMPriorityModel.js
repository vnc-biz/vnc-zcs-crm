function ZaCRMPriorityModel (parent) {
	
	ZaTabView.call(this, {
        parent:parent,
        iKeyName:"ZaCRMPriorityModel",
        contextId:"_CRM_Admin_"
        });
		this.initForm(ZaCRMadmin.myXModel,this.getMyXForm());	
		this._localXForm.setController(ZaApp.getInstance());
}

ZaCRMPriorityModel.prototype = new ZaTabView;
ZaCRMPriorityModel.prototype.constructor = ZaCRMPriorityModel;

ZaCRMPriorityModel.prototype.toString = function() {
	return "ZaCRMadminListView";
}

ZaCRMPriorityModel.isEditPriorityEnabled=function()
{
	return (!AjxUtil.isEmpty(this.getInstanceValue(ZaCRMadmin.A_priority_list_cache)) && this.getInstanceValue(ZaCRMadmin.A_priority_list_cache).length==1);
}
ZaCRMPriorityModel.isDeletePriorityEnabled=function()
{
	return (!AjxUtil.isEmpty(this.getInstanceValue(ZaCRMadmin.A_priority_list_cache)));
}


ZaCRMPriorityModel.prioritySelectionListener = 
function (ev) {
	var instance = this.getInstance();
	var arr= this.widget.getSelection();

    if(arr && arr.length) {
        //arr.sort(ZaServer.comparepersonsByName);
        this.getModel().setInstanceValue(this.getInstance(), ZaCRMadmin.A_priority_list_cache, arr);
        //instance.priority_list_cache = arr;
    } else {
        this.getModel().setInstanceValue(this.getInstance(), ZaCRMadmin.A_priority_list_cache, null);
        //instance.priority_list_cache = null;
    }

    if (ev.detail == DwtListView.ITEM_DBL_CLICKED) {
        ZaCRMPriorityModel.editButtonListener.call(this);
    }
	
}

ZaCRMPriorityModel.deleteButtonListener=function()
{
	var instance = this.getInstance();
	var path = ZaCRMadmin.A_priority;
	var idArray = new Array();
	if(!this.getInstance()[ZaCRMadmin.A_priorityRemoved]) {
		this.getInstance()[ZaCRMadmin.A_priorityRemoved] = new Array();
	}

	if(instance.priority_list_cache != null) {
		var cnt = instance.priority_list_cache.length;
		if(cnt && instance[ZaCRMadmin.A_priority] && instance[ZaCRMadmin.A_priority]) {
			for(var i=0;i<cnt;i++) {
				var cnt2 = instance[ZaCRMadmin.A_priority].length-1;				
				for(var k=cnt2;k>=0;k--) {
					if(instance[ZaCRMadmin.A_priority][k][ZaCRMadmin.A_priorityName]==instance.priority_list_cache[i][ZaCRMadmin.A_priorityName]) {
						instance[ZaCRMadmin.A_priorityRemoved].push(instance[ZaCRMadmin.A_priority][k]);
						instance[ZaCRMadmin.A_priority].splice(k,1);
						idArray[i]	= instance.priority_list_cache[i][ZaCRMadmin.A_priorityId];
						break;	
					}
				}
			}
				
		}
	}
	ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format(com_zimbra_crm_admin.MSG_Delete,"Delete","Delete"));
	instance[ZaCRMadmin.A_priority_list_cache]=new Array();
	this.getForm().parent.setDirty(true);
	this.getForm().refresh();

	var json = "jsonobj={\"action\":\"DELETEBYID\",\"object\":\"priority\",\"array\":\"" + idArray + "\"}";
	var reqHeader = {"Content-Type":"application/x-www-form-urlencoded"};
	var reqJson = AjxStringUtil.urlEncode(json);
	var response = AjxRpc.invoke(reqJson,com_zimbra_crm_admin.jspUrl, reqHeader, null, false);
}
ZaCRMPriorityModel.closeButtonListener=
function()
{
	this.parent.editpriorityDlg.popdown();
	this.getInstance()[ZaCRMadmin.A_priority_list_cache]=new Array();
	this.parent.setDirty(false);
	DBG.println(AjxDebug.DBG3, "Cancel button Listener");
	this.refresh();
	
}
ZaCRMPriorityModel.editButtonListener =
function () {
    var instance = this.getInstance();
    
    if(instance.priority_list_cache && instance.priority_list_cache[0]) {
        var formPage = this.getForm().parent;
        if(!formPage.editpriorityDlg) {
            formPage.editpriorityDlg = new ZaEditPriorityXFormDialog(ZaApp.getInstance().getAppCtxt().getShell(),ZaApp.getInstance(), "350px", "100px","Edit priority");
            formPage.editpriorityDlg.registerCallback(DwtDialog.OK_BUTTON, ZaCRMPriorityModel.updatepriority, this.getForm(),null);
            formPage.editpriorityDlg.registerCallback(DwtDialog.CANCEL_BUTTON, ZaCRMPriorityModel.closeButtonListener, this.getForm(),null);
        }
        var obj = {};
        obj[ZaCRMadmin.A_priorityId] = instance.priority_list_cache[0][ZaCRMadmin.A_priorityId];
        obj[ZaCRMadmin.A_priorityName] = instance.priority_list_cache[0][ZaCRMadmin.A_priorityName];
        obj[ZaCRMadmin.A_priorityCode] = instance.priority_list_cache[0][ZaCRMadmin.A_priorityCode];
        obj[ZaCRMadmin.A_priorityStatus] = instance.priority_list_cache[0][ZaCRMadmin.A_priorityStatus];
		
	 var volArr = this.getModel().getInstanceValue(this.getInstance(),ZaCRMadmin.A_priority);

        var cnt = volArr.length;
        for(var i=0; i < cnt; i++) {
            if(volArr[i][ZaCRMadmin.A_priorityName]==obj[ZaCRMadmin.A_priorityName])
             {
                obj._index = i;
                break;
            }
        }
	
	instance[ZaCRMadmin.A_priority_list_cache]=new Array();
        formPage.editpriorityDlg.setObject(obj);
        formPage.editpriorityDlg.popup();
    }
}

ZaCRMPriorityModel.updatepriority=function()
{
	
	if(this.parent.editpriorityDlg) 
	{
	
        	this.parent.editpriorityDlg.popdown();
       		var obj = this.parent.editpriorityDlg.getObject();
		
		
		var instance = this.getInstance();
		var priorityes = [];
		var cnt = instance[ZaCRMadmin.A_priority].length;
		for (var i=0; i< cnt; i++) 
		{
			priorityes[i] = instance[ZaCRMadmin.A_priority][i];
		}
		var dirty = false;

		obj[ZaCRMadmin.A_priorityWriteby]= ZaZimbraAdmin.currentUserName;

		if(priorityes[obj._index]) 
		{
		    if(priorityes[obj._index][ZaCRMadmin.A_priorityName] != obj[ZaCRMadmin.A_priorityName]) {
		        priorityes[obj._index][ZaCRMadmin.A_priorityName] = obj[ZaCRMadmin.A_priorityName];
		        dirty=true;
		    }
		    if(priorityes[obj._index][ZaCRMadmin.A_priorityCode] != obj[ZaCRMadmin.A_priorityCode]) {
		        priorityes[obj._index][ZaCRMadmin.A_priorityCode] = obj[ZaCRMadmin.A_priorityCode];
		        dirty=true;
		    }
		    if(priorityes[obj._index][ZaCRMadmin.A_priorityStatus] != obj[ZaCRMadmin.A_priorityStatus]) {
		        priorityes[obj._index][ZaCRMadmin.A_priorityStatus] = obj[ZaCRMadmin.A_priorityStatus];
		        dirty=true;
		    }

		}
 			
		var j = JSON.stringify({action:"UPDATE",object:"priority",priorityId:obj[ZaCRMadmin.A_priorityId],priorityName:obj[ZaCRMadmin.A_priorityName],priorityCode:obj[ZaCRMadmin.A_priorityCode],status:obj[ZaCRMadmin.A_priorityStatus],writeBy:obj[ZaCRMadmin.A_priorityWriteby]});
		var json = "jsonobj=" + j;
		alert("jjjj Priority ::"+ j);
		var reqHeader = {"Content-Type":"application/x-www-form-urlencoded"};
		var reqJson = AjxStringUtil.urlEncode(json);
		var response = AjxRpc.invoke(reqJson,com_zimbra_crm_admin.jspUrl, reqHeader, null, false);

//	 	this.getModel().setInstanceValue(this.getInstance(),ZaCRMadmin.A_priority,priorityes);
		this.getModel().setInstanceValue(this.getInstance(), ZaCRMadmin.A_priority_list_cache, new Array());
		
		for(t=0;t<cnt;t++)
		{
			instance[ZaCRMadmin.A_priority].pop();
			
		}
		this.parent.setDirty(true);
		this.refresh();
		var tmp={};
		for(var k=0;k<cnt;k++)
		{
			tmp[ZaCRMadmin.A_priorityId]=priorityes[k][ZaCRMadmin.A_priorityId];
			tmp[ZaCRMadmin.A_priorityName]= priorityes[k][ZaCRMadmin.A_priorityName];
			tmp[ZaCRMadmin.A_priorityCode]= priorityes[k][ZaCRMadmin.A_priorityCode];
			tmp[ZaCRMadmin.A_priorityStatus]= priorityes[k][ZaCRMadmin.A_priorityStatus];
			tmp[ZaCRMadmin.A_priorityCreatedby]= priorityes[k][ZaCRMadmin.A_priorityCreatedby];
			tmp[ZaCRMadmin.A_priorityCreateddate]= priorityes[k][ZaCRMadmin.A_priorityCreateddate];
			tmp[ZaCRMadmin.A_priorityWriteby]= priorityes[k][ZaCRMadmin.A_priorityWriteby];
			tmp[ZaCRMadmin.A_priorityWritedate]= priorityes[k][ZaCRMadmin.A_priorityWritedate];
			
			instance[ZaCRMadmin.A_priority].push(tmp);
			tmp={};	
		}
		ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format(com_zimbra_crm_admin.MSG_Edit+" : "+obj[ZaCRMadmin.A_priorityName]));
		this.parent.setDirty(true);
		this.refresh();
		
		
	}
		
}

ZaCRMPriorityModel.addPerson  = function () {
	if(this.parent.addpriorityDlg) {

		var obj = this.parent.addpriorityDlg.getObject();
		var instance = this.getInstance();
		instance = this.getInstance();
		var flag = 0;
		var len = this.getInstance()[ZaCRMadmin.A_priority].length;
		for (var i=0;i<len;i++)
		{
			if((obj[ZaCRMadmin.A_priorityName] == this.getInstance()[ZaCRMadmin.A_priority][i][ZaCRMadmin.A_priorityName]) || (obj[ZaCRMadmin.A_priorityCode] == this.getInstance()[ZaCRMadmin.A_priority][i][ZaCRMadmin.A_priorityCode]))
			{
				flag = 1;
			}
		}
		if(flag == 0)
		{
			this.parent.addpriorityDlg.popdown();
			instance[ZaCRMadmin.A_priority].push(obj);
			var j = JSON.stringify({action:"ADD",object:"priority",priorityId:obj[ZaCRMadmin.A_priorityId],priorityName:obj[ZaCRMadmin.A_priorityName],priorityCode:obj[ZaCRMadmin.A_priorityCode],status:obj[ZaCRMadmin.A_priorityStatus],createBy:obj[ZaCRMadmin.A_priorityCreatedby],createDate:obj[ZaCRMadmin.A_priorityCreateddate],writeBy:obj[ZaCRMadmin.A_priorityWriteby],writeDate:obj[ZaCRMadmin.A_priorityWritedate]});
			var json = "jsonobj=" + j;
			var reqHeader = {"Content-Type":"application/x-www-form-urlencoded"};
			var reqJson = AjxStringUtil.urlEncode(json);
			var response = AjxRpc.invoke(reqJson,com_zimbra_crm_admin.jspUrl, reqHeader, null, false);
			console.log(jsonParse(response.text));
			ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format(com_zimbra_crm_admin.MSG_Add+" : "+obj[ZaCRMadmin.A_priorityName]));
		}
		else
		{
			ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format("Priority already exists"+" : "+obj[ZaCRMadmin.A_priorityName] + " OR " + obj[ZaCRMadmin.A_priorityCode]));
		}
		this.parent.setDirty(true);
		//this._localXForm.setInstance(this._containedObject);
		this.refresh();	
	}

}


ZaCRMPriorityModel.addButtonListener =
function () {
	
	
	DBG.println(AjxDebug.DBG3, "Enter in AddButton Listener");

//	var aa = this.getHtmlElement();
		var formPage = this.getForm().parent;
		if(!formPage.addpriorityDlg) {
			formPage.addpriorityDlg = new ZaEditPriorityXFormDialog(ZaApp.getInstance().getAppCtxt().getShell(),ZaApp.getInstance(),"350px", "100px","Add new priority");
			formPage.addpriorityDlg.registerCallback(DwtDialog.OK_BUTTON, ZaCRMPriorityModel.addPerson , this.getForm(), null);						
		}
		
		var obj = {};

		obj[ZaCRMadmin.A_priorityId]= 0;
		obj[ZaCRMadmin.A_priorityName]= "";
		obj[ZaCRMadmin.A_priorityCode]= "";
		obj[ZaCRMadmin.A_priorityStatus]= true;
		obj[ZaCRMadmin.A_priorityCreatedby]= ZaZimbraAdmin.currentUserName;
		obj[ZaCRMadmin.A_priorityCreateddate]= "null";
		obj[ZaCRMadmin.A_priorityWriteby]= ZaZimbraAdmin.currentUserName;
		obj[ZaCRMadmin.A_priorityWritedate]= "null";
		
		obj.current = false;		
		
		formPage.addpriorityDlg.setObject(obj);
		formPage.addpriorityDlg.popup();		
}