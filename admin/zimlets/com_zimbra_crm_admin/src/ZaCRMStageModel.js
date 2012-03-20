function ZaCRMStageModel (parent) {
	
	ZaTabView.call(this, {
        parent:parent,
        iKeyName:"ZaCRMStageModel",
        contextId:"_CRM_Admin_"
        });
		this.initForm(ZaCRMadmin.myXModel,this.getMyXForm());	
		this._localXForm.setController(ZaApp.getInstance());
}



ZaCRMStageModel.prototype = new ZaTabView;
ZaCRMStageModel.prototype.constructor = ZaCRMStageModel;

ZaCRMStageModel.prototype.toString = function() {
	
	return "ZaCRMadminListView";
}

ZaCRMStageModel.isEditStageEnabled=function()
{
	return (!AjxUtil.isEmpty(this.getInstanceValue(ZaCRMadmin.A_stage_list_cache)) && this.getInstanceValue(ZaCRMadmin.A_stage_list_cache).length==1);
}
ZaCRMStageModel.isDeleteStageEnabled=function()
{
	return (!AjxUtil.isEmpty(this.getInstanceValue(ZaCRMadmin.A_stage_list_cache)));
}



ZaCRMStageModel.stageSelectionListener = 
function (ev) {
	var instance = this.getInstance();
	var arr= this.widget.getSelection();

    if(arr && arr.length) {
        //arr.sort(ZaServer.comparepersonsByName);
        this.getModel().setInstanceValue(this.getInstance(), ZaCRMadmin.A_stage_list_cache, arr);
        //instance.stage_list_cache = arr;
    } else {
        this.getModel().setInstanceValue(this.getInstance(), ZaCRMadmin.A_stage_list_cache, null);
        //instance.stage_list_cache = null;
    }

    if (ev.detail == DwtListView.ITEM_DBL_CLICKED) {
        ZaCRMStageModel.editButtonListener.call(this);
    }
	
}

ZaCRMStageModel.deleteButtonListener=function()
{
	var instance = this.getInstance();
	var path = ZaCRMadmin.A_stage;
	var idArray = new Array();
	
	if(!this.getInstance()[ZaCRMadmin.A_stageRemoved]) {
		this.getInstance()[ZaCRMadmin.A_stageRemoved] = new Array();
	}

	if(instance.stage_list_cache != null) {
		var cnt = instance.stage_list_cache.length;
		if(cnt && instance[ZaCRMadmin.A_stage] && instance[ZaCRMadmin.A_stage]) {
			for(var i=0;i<cnt;i++) {
				var cnt2 = instance[ZaCRMadmin.A_stage].length-1;				
				for(var k=cnt2;k>=0;k--) {
					if(instance[ZaCRMadmin.A_stage][k][ZaCRMadmin.A_stageName]==instance.stage_list_cache[i][ZaCRMadmin.A_stageName]) {
						instance[ZaCRMadmin.A_stageRemoved].push(instance[ZaCRMadmin.A_stage][k]);
						instance[ZaCRMadmin.A_stage].splice(k,1);
						idArray[i]	= instance.stage_list_cache[i][ZaCRMadmin.A_stageId];
						break;	
					}
				}
			}
				
		}
	}
	ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format(com_zimbra_crm_admin.MSG_Delete,"Delete","Delete"));
	instance[ZaCRMadmin.A_stage_list_cache]=new Array();
	this.getForm().parent.setDirty(true);
	this.getForm().refresh();

	var json = "jsonobj={\"action\":\"DELETEBYID\",\"object\":\"stage\",\"array\":\"" + idArray + "\"}";
	var reqHeader = {"Content-Type":"application/x-www-form-urlencoded"};
	var reqJson = AjxStringUtil.urlEncode(json);
	var response = AjxRpc.invoke(reqJson,com_zimbra_crm_admin.jspUrl, reqHeader, null, false);
}
ZaCRMStageModel.closeButtonListener=
function()
{
	this.parent.editStageDlg.popdown();
	this.getInstance()[ZaCRMadmin.A_stage_list_cache]=new Array();
	this.parent.setDirty(false);
	DBG.println(AjxDebug.DBG3, "Cancel button Listener");
	this.refresh();
	
}
ZaCRMStageModel.editButtonListener =
function () {
    var instance = this.getInstance();
    
    if(instance.stage_list_cache && instance.stage_list_cache[0]) {
        var formPage = this.getForm().parent;
        if(!formPage.editStageDlg) {
            formPage.editStageDlg = new ZaEditStageXFormDialog(ZaApp.getInstance().getAppCtxt().getShell(),ZaApp.getInstance(), "400px", "180px","Edit Stage");
            formPage.editStageDlg.registerCallback(DwtDialog.OK_BUTTON, ZaCRMStageModel.updateStage, this.getForm(),null);
            formPage.editStageDlg.registerCallback(DwtDialog.CANCEL_BUTTON, ZaCRMStageModel.closeButtonListener, this.getForm(),null);
        }
        var obj = {};
        obj[ZaCRMadmin.A_stageId] = instance.stage_list_cache[0][ZaCRMadmin.A_stageId];
        obj[ZaCRMadmin.A_stageName] = instance.stage_list_cache[0][ZaCRMadmin.A_stageName];
        obj[ZaCRMadmin.A_stageSequence] = instance.stage_list_cache[0][ZaCRMadmin.A_stageSequence];
        obj[ZaCRMadmin.A_stageType] = instance.stage_list_cache[0][ZaCRMadmin.A_stageType];
        obj[ZaCRMadmin.A_stageProbability] = instance.stage_list_cache[0][ZaCRMadmin.A_stageProbability];
        obj[ZaCRMadmin.A_stageAuto] = instance.stage_list_cache[0][ZaCRMadmin.A_stageAuto];
        obj[ZaCRMadmin.A_stageDescription] = instance.stage_list_cache[0][ZaCRMadmin.A_stageDescription];
		obj[ZaCRMadmin.A_stageStatus] = instance.stage_list_cache[0][ZaCRMadmin.A_stageStatus];
		
	 var volArr = this.getModel().getInstanceValue(this.getInstance(),ZaCRMadmin.A_stage);

        var cnt = volArr.length;
        for(var i=0; i < cnt; i++) {
            if(volArr[i][ZaCRMadmin.A_stageName]==obj[ZaCRMadmin.A_stageName])
             {
                obj._index = i;
                break;
            }
        }
	
	instance[ZaCRMadmin.A_stage_list_cache]=new Array();
        formPage.editStageDlg.setObject(obj);
        formPage.editStageDlg.popup();
    }
}

ZaCRMStageModel.updateStage=function()
{
	
	if(this.parent.editStageDlg) 
	{
	
        	this.parent.editStageDlg.popdown();
       		var obj = this.parent.editStageDlg.getObject();
		
		
		var instance = this.getInstance();
		var countries = [];
		var cnt = instance[ZaCRMadmin.A_stage].length;
		for (var i=0; i< cnt; i++) 
		{
			countries[i] = instance[ZaCRMadmin.A_stage][i];
		}
		var dirty = false;
		obj[ZaCRMadmin.A_stageWriteby]= ZaZimbraAdmin.currentUserName;
		if(countries[obj._index]) 
		{
		    if(countries[obj._index][ZaCRMadmin.A_stageName] != obj[ZaCRMadmin.A_stageName]) 
		    {
		    	DBG.println(AjxDebug.DBG3, "Name Match");
		        countries[obj._index][ZaCRMadmin.A_stageName] = obj[ZaCRMadmin.A_stageName];
		        dirty=true;
		    }
		    if(countries[obj._index][ZaCRMadmin.A_stageSequence] != obj[ZaCRMadmin.A_stageSequence]) {
		        countries[obj._index][ZaCRMadmin.A_stageSequence] = obj[ZaCRMadmin.A_stageSequence];
		        dirty=true;
		    }
			if(countries[obj._index][ZaCRMadmin.A_stageType] != obj[ZaCRMadmin.A_stageType]) {
		        countries[obj._index][ZaCRMadmin.A_stageType] = obj[ZaCRMadmin.A_stageType];
		        dirty=true;
		    }
			if(countries[obj._index][ZaCRMadmin.A_stageProbability] != obj[ZaCRMadmin.A_stageProbability]) {
		        countries[obj._index][ZaCRMadmin.A_stageProbability] = obj[ZaCRMadmin.A_stageProbability];
		        dirty=true;
		    }
			if(countries[obj._index][ZaCRMadmin.A_stageAuto] != obj[ZaCRMadmin.A_stageAuto]) {
		        countries[obj._index][ZaCRMadmin.A_stageAuto] = obj[ZaCRMadmin.A_stageAuto];
		        dirty=true;
		    }
			if(countries[obj._index][ZaCRMadmin.A_stageDescription] != obj[ZaCRMadmin.A_stageDescription]) {
		        countries[obj._index][ZaCRMadmin.A_stageDescription] = obj[ZaCRMadmin.A_stageDescription];
		        dirty=true;
		    }
			if(countries[obj._index][ZaCRMadmin.A_stageStatus] != obj[ZaCRMadmin.A_stageStatus]) {
		        countries[obj._index][ZaCRMadmin.A_stageStatus] = obj[ZaCRMadmin.A_stageStatus];
		        dirty=true;
		    }

		}
 		
		var j = JSON.stringify({action:"UPDATE",object:"stage",stageId:obj[ZaCRMadmin.A_stageId],stageName:obj[ZaCRMadmin.A_stageName],stageSequence:obj[ZaCRMadmin.A_stageSequence],stageType:obj[ZaCRMadmin.A_stageType],stageProbability:obj[ZaCRMadmin.A_stageProbability],stageDescription:obj[ZaCRMadmin.A_stageDescription],stageAuto:obj[ZaCRMadmin.A_stageAuto],status:obj[ZaCRMadmin.A_stageStatus],writeBy:obj[ZaCRMadmin.A_stageWriteby]});
		var json = "jsonobj=" + j;
		//var json = "jsonobj={\"action\":\"LIST\",\"object\":\"stage\"}";
		var reqHeader = {"Content-Type":"application/x-www-form-urlencoded"};
		var reqJson = AjxStringUtil.urlEncode(json);
		var response = AjxRpc.invoke(reqJson,com_zimbra_crm_admin.jspUrl, reqHeader, null, false);


//	 	this.getModel().setInstanceValue(this.getInstance(),ZaCRMadmin.A_stage,countries);
		this.getModel().setInstanceValue(this.getInstance(), ZaCRMadmin.A_stage_list_cache, new Array());
		
		for(t=0;t<cnt;t++)
		{
			instance[ZaCRMadmin.A_stage].pop();
			
		}
		this.parent.setDirty(true);
		this.refresh();
		var tmp={};
		for(var k=0;k<cnt;k++)
		{
			tmp[ZaCRMadmin.A_stageId]=countries[k][ZaCRMadmin.A_stageId];
			tmp[ZaCRMadmin.A_stageName]= countries[k][ZaCRMadmin.A_stageName];
			tmp[ZaCRMadmin.A_stageSequence]= countries[k][ZaCRMadmin.A_stageSequence];
			tmp[ZaCRMadmin.A_stageType]= countries[k][ZaCRMadmin.A_stageType];
			tmp[ZaCRMadmin.A_stageProbability]= countries[k][ZaCRMadmin.A_stageProbability];
			tmp[ZaCRMadmin.A_stageAuto]= countries[k][ZaCRMadmin.A_stageAuto];
			tmp[ZaCRMadmin.A_stageDescription]= countries[k][ZaCRMadmin.A_stageDescription];
			tmp[ZaCRMadmin.A_stageStatus]= countries[k][ZaCRMadmin.A_stageStatus];
			tmp[ZaCRMadmin.A_stageCreatedby]= countries[k][ZaCRMadmin.A_stageCreatedby];
			tmp[ZaCRMadmin.A_stageCreateddate]= countries[k][ZaCRMadmin.A_stageCreateddate];
			tmp[ZaCRMadmin.A_stageWriteby]= countries[k][ZaCRMadmin.A_stageWriteby];
			tmp[ZaCRMadmin.A_stageWritedate]= countries[k][ZaCRMadmin.A_stageWritedate];
			
			instance[ZaCRMadmin.A_stage].push(tmp);
			tmp={};	
		}
		ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format(com_zimbra_crm_admin.MSG_Edit+" : "+obj[ZaCRMadmin.A_stageName]));
		this.parent.setDirty(true);
		this.refresh();
		
		
	}
		
}

ZaCRMStageModel.addPerson  = function () {
	if(this.parent.addStageDlg) {

		var obj = this.parent.addStageDlg.getObject();

		var instance = this.getInstance();
		instance = this.getInstance();
		var flag = 0;
		var len = this.getInstance()[ZaCRMadmin.A_stage].length;
		for (var i=0;i<len;i++)
		{
			if(obj[ZaCRMadmin.A_stageName] == this.getInstance()[ZaCRMadmin.A_stage][i][ZaCRMadmin.A_stageName])
			{
				flag = 1;
			}
		}
		if(flag == 0)
		{

			this.parent.addStageDlg.popdown();
	
			instance[ZaCRMadmin.A_stage].push(obj);
	
			var j = JSON.stringify({action:"ADD",object:"stage",stageId:obj[ZaCRMadmin.A_stageId],stageName:obj[ZaCRMadmin.A_stageName],stageSequence:obj[ZaCRMadmin.A_stageSequence],stageType:obj[ZaCRMadmin.A_stageType],stageProbability:obj[ZaCRMadmin.A_stageProbability],stageAuto:obj[ZaCRMadmin.A_stageAuto],stageDescription:obj[ZaCRMadmin.A_stageDescription],status:obj[ZaCRMadmin.A_stageStatus],createBy:obj[ZaCRMadmin.A_stageCreatedby],createDate:obj[ZaCRMadmin.A_stageCreateddate],writeBy:obj[ZaCRMadmin.A_stageWriteby],writeDate:obj[ZaCRMadmin.A_stageWritedate]});
			var json = "jsonobj=" + j;
	
			var reqHeader = {"Content-Type":"application/x-www-form-urlencoded"};
			var reqJson = AjxStringUtil.urlEncode(json);
			var response = AjxRpc.invoke(reqJson,com_zimbra_crm_admin.jspUrl, reqHeader, null, false);
			console.log(jsonParse(response.text));
	
			ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format(com_zimbra_crm_admin.MSG_Add+" : "+obj[ZaCRMadmin.A_stageName]));

		}
		else
		{
			ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format("Channel already exists"+" : "+obj[ZaCRMadmin.A_stageName]));
		}
		
		this.parent.setDirty(true);
		this.refresh();	
	}

}


ZaCRMStageModel.addButtonListener =
function () {
	
	
	DBG.println(AjxDebug.DBG3, "Enter in AddButton Listener");

//	var aa = this.getHtmlElement();
		var formPage = this.getForm().parent;
				alert("4");
		if(!formPage.addStageDlg) {
					alert("5");
			formPage.addStageDlg = new ZaEditStageXFormDialog(ZaApp.getInstance().getAppCtxt().getShell(),ZaApp.getInstance(),"400px", "180px","Add new stage");
					alert("6");
			formPage.addStageDlg.registerCallback(DwtDialog.OK_BUTTON, ZaCRMStageModel.addPerson , this.getForm(), null);						
					alert("7");
		}
		
		var obj = {};

		obj[ZaCRMadmin.A_stageId]= 0;
		obj[ZaCRMadmin.A_stageName]= "";
		obj[ZaCRMadmin.A_stageSequence]= "";
		obj[ZaCRMadmin.A_stageType]= "Select type";
		obj[ZaCRMadmin.A_stageProbability]= "";
		obj[ZaCRMadmin.A_stageDescription]= "";
		obj[ZaCRMadmin.A_stageAuto]= "";
		obj[ZaCRMadmin.A_stageStatus]= true;
		obj[ZaCRMadmin.A_stageCreatedby]= ZaZimbraAdmin.currentUserName;
		obj[ZaCRMadmin.A_stageCreateddate]= "null";
		obj[ZaCRMadmin.A_stageWriteby]= ZaZimbraAdmin.currentUserName;
		obj[ZaCRMadmin.A_stageWritedate]= "null";
		
		obj.current = false;		
		
		formPage.addStageDlg.setObject(obj);
		formPage.addStageDlg.popup();		
}