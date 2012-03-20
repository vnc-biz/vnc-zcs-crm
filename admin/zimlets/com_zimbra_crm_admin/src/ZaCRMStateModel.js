function ZaCRMStateModel (parent) {
	
	ZaTabView.call(this, {
        parent:parent,
        iKeyName:"ZaCRMStateModel",
        contextId:"_CRM_Admin_"
        });
		this.initForm(ZaCRMadmin.myXModel,this.getMyXForm());	
		this._localXForm.setController(ZaApp.getInstance());
}

ZaCRMStateModel.prototype = new ZaTabView;
ZaCRMStateModel.prototype.constructor = ZaCRMStateModel;

ZaCRMStateModel.prototype.toString = function() {
	
	return "ZaCRMadminListView";
}

ZaCRMStateModel.isEditStateEnabled=function()
{
	return (!AjxUtil.isEmpty(this.getInstanceValue(ZaCRMadmin.A_state_list_cache)) && this.getInstanceValue(ZaCRMadmin.A_state_list_cache).length==1);
}
ZaCRMStateModel.isDeleteStateEnabled=function()
{
	return (!AjxUtil.isEmpty(this.getInstanceValue(ZaCRMadmin.A_state_list_cache)));
}


ZaCRMStateModel.stateSelectionListener = 
function (ev) {
	var instance = this.getInstance();
	var arr= this.widget.getSelection();

    if(arr && arr.length) {
        //arr.sort(ZaServer.comparepersonsByName);
        this.getModel().setInstanceValue(this.getInstance(), ZaCRMadmin.A_state_list_cache, arr);
        //instance.state_list_cache = arr;
    } else {
        this.getModel().setInstanceValue(this.getInstance(), ZaCRMadmin.A_state_list_cache, null);
        //instance.state_list_cache = null;
    }

    if (ev.detail == DwtListView.ITEM_DBL_CLICKED) {
        ZaCRMStateModel.editButtonListener.call(this);
    }
	
}

ZaCRMStateModel.deleteButtonListener_state=function()
{
	var instance = this.getInstance();
	var path = ZaCRMadmin.A_state;
	var idArray = new Array();

	if(!this.getInstance()[ZaCRMadmin.A_stateRemoved]) {
		this.getInstance()[ZaCRMadmin.A_stateRemoved] = new Array();
	}

	if(instance.state_list_cache != null) {
		var cnt = instance.state_list_cache.length;
		if(cnt && instance[ZaCRMadmin.A_state] && instance[ZaCRMadmin.A_state]) {
			for(var i=0;i<cnt;i++) {
				var cnt2 = instance[ZaCRMadmin.A_state].length-1;				
				for(var k=cnt2;k>=0;k--) {
					if(instance[ZaCRMadmin.A_state][k][ZaCRMadmin.A_stateName]==instance.state_list_cache[i][ZaCRMadmin.A_stateName]) {
						instance[ZaCRMadmin.A_stateRemoved].push(instance[ZaCRMadmin.A_state][k]);
						instance[ZaCRMadmin.A_state].splice(k,1);
						idArray[i]	= instance.state_list_cache[i][ZaCRMadmin.A_stateId];
						break;	
					}
				}
			}
				
		}
	}
	ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format(com_zimbra_crm_admin.MSG_Delete,"Delete","Delete"));
	instance[ZaCRMadmin.A_state_list_cache]=new Array();
	this.getForm().parent.setDirty(true);
	this.getForm().refresh();

	var json = "jsonobj={\"action\":\"DELETEBYID\",\"object\":\"state\",\"array\":\"" + idArray + "\"}";
	var reqHeader = {"Content-Type":"application/x-www-form-urlencoded"};
	var reqJson = AjxStringUtil.urlEncode(json);
	var response = AjxRpc.invoke(reqJson,com_zimbra_crm_admin.jspUrl, reqHeader, null, false);
}
ZaCRMStateModel.closeButtonListener=
function()
{
	this.parent.editStateDlg.popdown();
	this.getInstance()[ZaCRMadmin.A_state_list_cache]=new Array();
	this.parent.setDirty(false);
	DBG.println(AjxDebug.DBG3, "Cancel button Listener");
	this.refresh();
	
}
ZaCRMStateModel.editButtonListener =
function () {
    var instance = this.getInstance();
    
    if(instance.state_list_cache && instance.state_list_cache[0]) {
        var formPage = this.getForm().parent;
        if(!formPage.editStateDlg) {
            formPage.editStateDlg = new ZaEditStateXFormDialog(ZaApp.getInstance().getAppCtxt().getShell(),ZaApp.getInstance(), "350px", "120px","Edit State");
            formPage.editStateDlg.registerCallback(DwtDialog.OK_BUTTON, ZaCRMStateModel.updateState, this.getForm(),null);
            formPage.editStateDlg.registerCallback(DwtDialog.CANCEL_BUTTON, ZaCRMStateModel.closeButtonListener, this.getForm(),null);
        }
        var obj = {};
		var len = ZaEditStateXFormDialog.countryChoices.length;
		for(var i=0;i<len;i++){
			if(ZaEditStateXFormDialog.countryChoices[i].label==instance.state_list_cache[0][ZaCRMadmin.A_stateCountryName])
				obj[ZaCRMadmin.A_stateCountryName] = ZaEditStateXFormDialog.countryChoices[i].value;
		}
        obj[ZaCRMadmin.A_stateId] = instance.state_list_cache[0][ZaCRMadmin.A_stateId];
		obj[ZaCRMadmin.A_stateName] = instance.state_list_cache[0][ZaCRMadmin.A_stateName];
        obj[ZaCRMadmin.A_stateCode] = instance.state_list_cache[0][ZaCRMadmin.A_stateCode];
        obj[ZaCRMadmin.A_stateCountryStatus] = instance.state_list_cache[0][ZaCRMadmin.A_stateCountryStatus];

	 var volArr = this.getModel().getInstanceValue(this.getInstance(),ZaCRMadmin.A_state);

        var cnt = volArr.length;
        for(var i=0; i < cnt; i++) {
            if(volArr[i][ZaCRMadmin.A_stateName]==obj[ZaCRMadmin.A_stateName])
             {
                obj._index = i;
                break;
            }
        }
	
	instance[ZaCRMadmin.A_state_list_cache]=new Array();
        formPage.editStateDlg.setObject(obj);
        formPage.editStateDlg.popup();
    }
}

ZaCRMStateModel.updateState=function()
{
	
	if(this.parent.editStateDlg) 
	{
	
        	this.parent.editStateDlg.popdown();
       		var obj = this.parent.editStateDlg.getObject();
		
		
		var instance = this.getInstance();
		var countries = [];
		var cnt = instance[ZaCRMadmin.A_state].length;
		for (var i=0; i< cnt; i++) 
		{
			countries[i] = instance[ZaCRMadmin.A_state][i];
		}
		var dirty = false;
		obj[ZaCRMadmin.A_stateWriteby]= ZaZimbraAdmin.currentUserName;
		if(countries[obj._index]) 
		{
		    if(countries[obj._index][ZaCRMadmin.A_stateName] != obj[ZaCRMadmin.A_stateName]) 
		    {
		        countries[obj._index][ZaCRMadmin.A_stateName] = obj[ZaCRMadmin.A_stateName];
		        dirty=true;
		    }
		    if(countries[obj._index][ZaCRMadmin.A_stateCode] != obj[ZaCRMadmin.A_stateCode]) {
		        countries[obj._index][ZaCRMadmin.A_stateCode] = obj[ZaCRMadmin.A_stateCode];
		        dirty=true;
		    }
			if(countries[obj._index][ZaCRMadmin.A_stateCountryName] != obj[ZaCRMadmin.A_stateCountryName]) {
			    countries[obj._index][ZaCRMadmin.A_stateCountryName] = obj[ZaCRMadmin.A_stateCountryName];
		        dirty=true;
		    }
			if(countries[obj._index][ZaCRMadmin.A_stateCountryStatus] != obj[ZaCRMadmin.A_stateCountryStatus]) {
		        countries[obj._index][ZaCRMadmin.A_stateCountryStatus] = obj[ZaCRMadmin.A_stateCountryStatus];
		        dirty=true;
		    }
		}

 		var j = JSON.stringify({action:"UPDATE",object:"state",stateId:obj[ZaCRMadmin.A_stateId],stateName:obj[ZaCRMadmin.A_stateName],stateCode:obj[ZaCRMadmin.A_stateCode],countryId:obj[ZaCRMadmin.A_stateCountryName],status:obj[ZaCRMadmin.A_stateCountryStatus],writeBy:obj[ZaCRMadmin.A_stateWriteby]});
		var json = "jsonobj=" + j;
		alert("JJJJJJJJJJJJJJ "+ j);
		//var json = "jsonobj={\"action\":\"LIST\",\"object\":\"state\"}";
		var reqHeader = {"Content-Type":"application/x-www-form-urlencoded"};
		var reqJson = AjxStringUtil.urlEncode(json);
		var response = AjxRpc.invoke(reqJson,com_zimbra_crm_admin.jspUrl, reqHeader, null, false);
		

//	 	this.getModel().setInstanceValue(this.getInstance(),ZaCRMadmin.A_state,countries);
		this.getModel().setInstanceValue(this.getInstance(), ZaCRMadmin.A_state_list_cache, new Array());
		
		for(t=0;t<cnt;t++)
		{
			instance[ZaCRMadmin.A_state].pop();
			
		}
		this.parent.setDirty(true);
		this.refresh();
		var tmp={};
		for(var k=0;k<cnt;k++)
		{
			tmp[ZaCRMadmin.A_stateId]=countries[k][ZaCRMadmin.A_stateId];
			tmp[ZaCRMadmin.A_stateName]= countries[k][ZaCRMadmin.A_stateName];
			tmp[ZaCRMadmin.A_stateCode]= countries[k][ZaCRMadmin.A_stateCode];
			tmp[ZaCRMadmin.A_stateCountryName]= countries[k][ZaCRMadmin.A_stateCountryName];
			tmp[ZaCRMadmin.A_stateCountryStatus]= countries[k][ZaCRMadmin.A_stateCountryStatus];
			tmp[ZaCRMadmin.A_stateCreatedby]= countries[k][ZaCRMadmin.A_stateCreatedby];
			tmp[ZaCRMadmin.A_stateCreateddate]= countries[k][ZaCRMadmin.A_stateCreateddate];
			tmp[ZaCRMadmin.A_stateWriteby]= countries[k][ZaCRMadmin.A_stateWriteby];
			tmp[ZaCRMadmin.A_stateWritedate]= countries[k][ZaCRMadmin.A_stateWritedate];
			
			instance[ZaCRMadmin.A_state].push(tmp);
			tmp={};	
		}
		ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format(com_zimbra_crm_admin.MSG_Edit+" : "+obj[ZaCRMadmin.A_stateName]));
		this.parent.setDirty(true);
		this.refresh();
		
		
	}
		
}

ZaCRMStateModel.addPerson  = function () {
	if(this.parent.addStateDlg) {

		var obj = this.parent.addStateDlg.getObject();
		var instance = this.getInstance();
		instance = this.getInstance();
		var flag = 0;
		var len = this.getInstance()[ZaCRMadmin.A_state].length;

		for (var i=0;i<len;i++)
		{
			if((obj[ZaCRMadmin.A_stateName] == this.getInstance()[ZaCRMadmin.A_state][i][ZaCRMadmin.A_stateName]) || (obj[ZaCRMadmin.A_stateCode] == this.getInstance()[ZaCRMadmin.A_state][i][ZaCRMadmin.A_stateCode]))
			{
				flag = 1;
			}
		}
		if(flag == 0)
		{
			instance[ZaCRMadmin.A_state].push(obj);
			this.parent.addStateDlg.popdown();
			var j = JSON.stringify({action:"ADD",object:"state",stateId:obj[ZaCRMadmin.A_stateId],stateName:obj[ZaCRMadmin.A_stateName],stateCode:obj[ZaCRMadmin.A_stateCode],countryId:obj[ZaCRMadmin.A_stateCountryName],status:obj[ZaCRMadmin.A_stateCountryStatus],createBy:obj[ZaCRMadmin.A_stateCreatedby],createDate:obj[ZaCRMadmin.A_stateCreateddate],writeBy:obj[ZaCRMadmin.A_stateWriteby],writeDate:obj[ZaCRMadmin.A_stateWritedate]});
			var json = "jsonobj=" + j;
			alert("J=====J=="+j);
			//var json = "jsonobj={\"action\":\"LIST\",\"object\":\"state\"}";
			var reqHeader = {"Content-Type":"application/x-www-form-urlencoded"};
			var reqJson = AjxStringUtil.urlEncode(json);
			var response = AjxRpc.invoke(reqJson,com_zimbra_crm_admin.jspUrl, reqHeader, null, false);
			
			ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format(com_zimbra_crm_admin.MSG_Add+" : "+obj[ZaCRMadmin.A_stateName]));
		}
		else
		{
			ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format("State already exists"+" : "+obj[ZaCRMadmin.A_stateName] + " OR " + obj[ZaCRMadmin.A_stateCode]));
		}

		//alert("obj[ZaCRMadmin.A_stateCountryName] ::.."+obj[ZaCRMadmin.A_stateCountryName]);

		this.parent.setDirty(true);
		//this._localXForm.setInstance(this._containedObject);

		this.refresh();	
	}

}


ZaCRMStateModel.addButtonListener_state =
function () {
	
		var formPage = this.getForm().parent;
		if(!formPage.addStateDlg) {
			formPage.addStateDlg = new ZaEditStateXFormDialog(ZaApp.getInstance().getAppCtxt().getShell(),ZaApp.getInstance(),"350px", "120px","Add new State");
			formPage.addStateDlg.registerCallback(DwtDialog.OK_BUTTON, ZaCRMStateModel.addPerson , this.getForm(), null);						
		}
		
		var obj = {};
	

		obj[ZaCRMadmin.A_stateId]= 0;
		obj[ZaCRMadmin.A_stateName]= "";
		obj[ZaCRMadmin.A_stateCode]= "";
		obj[ZaCRMadmin.A_stateCountryName]= "Select Country";
		obj[ZaCRMadmin.A_stateCountryStatus]= true;
		obj[ZaCRMadmin.A_stateCreatedby]= ZaZimbraAdmin.currentUserName;
		obj[ZaCRMadmin.A_stateCreateddate]= "null";
		obj[ZaCRMadmin.A_stateWriteby]= ZaZimbraAdmin.currentUserName;
		obj[ZaCRMadmin.A_stateWritedate]= "null";
		
		obj.current = false;		
		
		formPage.addStateDlg.setObject(obj);
		formPage.addStateDlg.popup();		
}