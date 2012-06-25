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

ZaCRMStageModel.display =
function () {
		var json,reqHeader,reqJson,response;
		json = "jsonobj={\"action\":\"LIST\",\"object\":\"stage\"}";
		reqHeader = {"Content-Type":"application/x-www-form-urlencoded"};
		reqJson = AjxStringUtil.urlEncode(json);
		response = AjxRpc.invoke(reqJson,biz_vnc_crm_admin.jspUrl, reqHeader, null, false);
		return (jsonParse(response.text));
}

ZaCRMStageModel.stageSelectionListener = 
function (ev) {
	var instance = this.getInstance();
	var arr= this.widget.getSelection();

    if(arr && arr.length) {
        this.getModel().setInstanceValue(this.getInstance(), ZaCRMadmin.A_stage_list_cache, arr);
    } else {
        this.getModel().setInstanceValue(this.getInstance(), ZaCRMadmin.A_stage_list_cache, null);
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
						idArray[i]	= instance.stage_list_cache[i][ZaCRMadmin.A_stageId];
						break;	
					}
				}
			}
				
		}
	}
	ZaApp.getInstance().dialogs["confirmMessageDialog"] = new ZaMsgDialog(ZaApp.getInstance().getAppCtxt().getShell(), null, [DwtDialog.YES_BUTTON, DwtDialog.NO_BUTTON], null, ZaId.VIEW_STATUS + "_confirmMessage");
	ZaApp.getInstance().dialogs["confirmMessageDialog"].setMessage(AjxMessageFormat.format(biz_vnc_crm_admin.MSG_Delete),DwtMessageDialog.INFO_STYLE );
	ZaApp.getInstance().dialogs["confirmMessageDialog"].registerCallback(DwtDialog.YES_BUTTON, ZaCRMStageModel.prototype.doDelete, this, [idArray]);
	ZaApp.getInstance().dialogs["confirmMessageDialog"].popup();		
}

ZaCRMStageModel.prototype.doDelete = function(idArray) {
	
	var instance = this.getInstance();
	var name = ZaZimbraAdmin.currentUserName;
	var json = "jsonobj={\"action\":\"DELETEBYID\",\"object\":\"stage\",\"array\":\"" + idArray + "\",\"writeBy\":\"" + name + "\"}";
	var reqHeader = {"Content-Type":"application/x-www-form-urlencoded"};
	var reqJson = AjxStringUtil.urlEncode(json);
	var response = AjxRpc.invoke(reqJson,biz_vnc_crm_admin.jspUrl, reqHeader, null, false);
	instance[ZaCRMadmin.A_stage] = ZaCRMStageModel.display();

	ZaApp.getInstance().dialogs["confirmMessageDialog"].popdown();
	this.getForm().parent.setDirty(true);
	this.getForm().refresh();

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
            formPage.editStageDlg = new ZaEditStageXFormDialog(ZaApp.getInstance().getAppCtxt().getShell(),ZaApp.getInstance(), "400px", "220px","Edit Stage");
            formPage.editStageDlg.registerCallback(DwtDialog.OK_BUTTON, ZaCRMStageModel.updateStage, this.getForm(),null);
            formPage.editStageDlg.registerCallback(DwtDialog.CANCEL_BUTTON, ZaCRMStageModel.closeButtonListener, this.getForm(),null);
        }
        var obj = {};
        obj[ZaCRMadmin.A_stageId] = instance.stage_list_cache[0][ZaCRMadmin.A_stageId];
        obj[ZaCRMadmin.A_stageName] = instance.stage_list_cache[0][ZaCRMadmin.A_stageName];
        obj[ZaCRMadmin.A_stageSequence] = instance.stage_list_cache[0][ZaCRMadmin.A_stageSequence];
        obj[ZaCRMadmin.A_stageType] = instance.stage_list_cache[0][ZaCRMadmin.A_stageType];
		obj[ZaCRMadmin.A_stageState] = instance.stage_list_cache[0][ZaCRMadmin.A_stageState];
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
		obj[ZaCRMadmin.A_stageWriteby]= ZaZimbraAdmin.currentUserName; 		
		var j = JSON.stringify({action:"UPDATE",object:"stage",stageId:obj[ZaCRMadmin.A_stageId],stageName:obj[ZaCRMadmin.A_stageName],stageSequence:obj[ZaCRMadmin.A_stageSequence],stageType:obj[ZaCRMadmin.A_stageType],stageState:obj[ZaCRMadmin.A_stageState],stageProbability:obj[ZaCRMadmin.A_stageProbability],stageDescription:obj[ZaCRMadmin.A_stageDescription],stageAuto:obj[ZaCRMadmin.A_stageAuto],status:obj[ZaCRMadmin.A_stageStatus],writeBy:obj[ZaCRMadmin.A_stageWriteby]});
		var json = "jsonobj=" + j;
		var reqHeader = {"Content-Type":"application/x-www-form-urlencoded"};
		var reqJson = AjxStringUtil.urlEncode(json);
		var response = AjxRpc.invoke(reqJson,biz_vnc_crm_admin.jspUrl, reqHeader, null, false);

		ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format(biz_vnc_crm_admin.MSG_Edit+" : "+obj[ZaCRMadmin.A_stageName]));
		instance[ZaCRMadmin.A_stage] = ZaCRMStageModel.display();
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
			var j = JSON.stringify({action:"ADD",object:"stage",stageId:obj[ZaCRMadmin.A_stageId],stageName:obj[ZaCRMadmin.A_stageName],stageSequence:obj[ZaCRMadmin.A_stageSequence],stageType:obj[ZaCRMadmin.A_stageType],stageState:obj[ZaCRMadmin.A_stageState],stageProbability:obj[ZaCRMadmin.A_stageProbability],stageAuto:obj[ZaCRMadmin.A_stageAuto],stageDescription:obj[ZaCRMadmin.A_stageDescription],status:obj[ZaCRMadmin.A_stageStatus],createBy:obj[ZaCRMadmin.A_stageCreatedby],writeBy:obj[ZaCRMadmin.A_stageWriteby]});
			var json = "jsonobj=" + j;
			var reqHeader = {"Content-Type":"application/x-www-form-urlencoded"};
			var reqJson = AjxStringUtil.urlEncode(json);
			var response = AjxRpc.invoke(reqJson,biz_vnc_crm_admin.jspUrl, reqHeader, null, false);
			ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format(biz_vnc_crm_admin.MSG_Add+" : "+obj[ZaCRMadmin.A_stageName]));
		}
		else
		{
			ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format("Channel already exists"+" : "+obj[ZaCRMadmin.A_stageName]));
		}
		instance[ZaCRMadmin.A_stage] = ZaCRMStageModel.display();		
		this.parent.setDirty(true);
		this.refresh();	
	}
}

ZaCRMStageModel.addButtonListener =
function () {
	
		var formPage = this.getForm().parent;
		if(!formPage.addStageDlg) {
			formPage.addStageDlg = new ZaEditStageXFormDialog(ZaApp.getInstance().getAppCtxt().getShell(),ZaApp.getInstance(),"400px", "220px","Add new stage");
			formPage.addStageDlg.registerCallback(DwtDialog.OK_BUTTON, ZaCRMStageModel.addPerson , this.getForm(), null);						
			}
		
		var obj = {};

		obj[ZaCRMadmin.A_stageId]= 0;
		obj[ZaCRMadmin.A_stageName]= "";
		obj[ZaCRMadmin.A_stageSequence]= "";
		obj[ZaCRMadmin.A_stageType]= "Select type";
		obj[ZaCRMadmin.A_stageState]= "Select state";
		obj[ZaCRMadmin.A_stageProbability]= "";
		obj[ZaCRMadmin.A_stageDescription]= "";
		obj[ZaCRMadmin.A_stageAuto]= true;
		obj[ZaCRMadmin.A_stageStatus]= true;
		obj[ZaCRMadmin.A_stageCreatedby]= ZaZimbraAdmin.currentUserName;
		obj[ZaCRMadmin.A_stageWriteby]= ZaZimbraAdmin.currentUserName;
		
		obj.current = false;		
		
		formPage.addStageDlg.setObject(obj);
		formPage.addStageDlg.popup();		
}