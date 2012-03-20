function ZaCRMChannelModel (parent) {
	ZaTabView.call(this, {
        parent:parent,
        iKeyName:"ZaCRMChannelModel",
        contextId:"_CRM_Admin_"
        });
		this.initForm(ZaCRMadmin.myXModel,this.getMyXForm());	
		this._localXForm.setController(ZaApp.getInstance());
}

ZaCRMChannelModel.prototype = new ZaTabView;

ZaCRMChannelModel.prototype.constructor = ZaCRMChannelModel;

ZaCRMChannelModel.prototype.toString = function() {
	return "ZaCRMadminListView";
}

ZaCRMChannelModel.isEditChannelEnabled=function()
{
	return (!AjxUtil.isEmpty(this.getInstanceValue(ZaCRMadmin.A_channel_list_cache)) && this.getInstanceValue(ZaCRMadmin.A_channel_list_cache).length==1);
}
ZaCRMChannelModel.isDeleteChannelEnabled=function()
{
	return (!AjxUtil.isEmpty(this.getInstanceValue(ZaCRMadmin.A_channel_list_cache)));
}


ZaCRMChannelModel.channelSelectionListener = 
function (ev) {
	
	

	var instance = this.getInstance();
	var arr= this.widget.getSelection();
	if(arr && arr.length) {
        //arr.sort(ZaServer.comparepersonsByName);
        this.getModel().setInstanceValue(this.getInstance(), ZaCRMadmin.A_channel_list_cache, arr);
        //instance.channel_list_cache = arr;
    } else {
        this.getModel().setInstanceValue(this.getInstance(), ZaCRMadmin.A_channel_list_cache, null);
        //instance.channel_list_cache = null;
    }

    if (ev.detail == DwtListView.ITEM_DBL_CLICKED) {
        ZaCRMChannelModel.editButtonListener.call(this);
    }
	
}

ZaCRMChannelModel.deleteButtonListener=function()
{
	var instance = this.getInstance();
	var path = ZaCRMadmin.A_channel;
	var idArray = new Array();
	
	if(!this.getInstance()[ZaCRMadmin.A_channelRemoved]) {
		this.getInstance()[ZaCRMadmin.A_channelRemoved] = new Array();
	}

	if(instance.channel_list_cache != null) {
	var cnt = instance.channel_list_cache.length;

		if(cnt && instance[ZaCRMadmin.A_channel] && instance[ZaCRMadmin.A_channel]) {
			for(var i=0;i<cnt;i++) {
				var cnt2 = instance[ZaCRMadmin.A_channel].length-1;				
				for(var k=cnt2;k>=0;k--) {
					if(instance[ZaCRMadmin.A_channel][k][ZaCRMadmin.A_channelName]==instance.channel_list_cache[i][ZaCRMadmin.A_channelName]) {
						instance[ZaCRMadmin.A_channelRemoved].push(instance[ZaCRMadmin.A_channel][k]);
						instance[ZaCRMadmin.A_channel].splice(k,1);
						idArray[i]	= instance.channel_list_cache[i][ZaCRMadmin.A_channelId];
						break;
							
					}
				}
			}
				
		}
	}

	
	ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format(com_zimbra_crm_admin.MSG_Delete,"Delete","Delete"));
	instance[ZaCRMadmin.A_channel_list_cache]=new Array();
	this.getForm().parent.setDirty(true);
	this.getForm().refresh();

	var json = "jsonobj={\"action\":\"DELETEBYID\",\"object\":\"channel\",\"array\":\"" + idArray + "\"}";
	var reqHeader = {"Content-Type":"application/x-www-form-urlencoded"};
	var reqJson = AjxStringUtil.urlEncode(json);
	var response = AjxRpc.invoke(reqJson,com_zimbra_crm_admin.jspUrl, reqHeader, null, false);
}
ZaCRMChannelModel.closeButtonListener=
function()
{
	this.parent.editchannelDlg.popdown();
	this.getInstance()[ZaCRMadmin.A_channel_list_cache]=new Array();
	this.parent.setDirty(false);
	DBG.println(AjxDebug.DBG3, "Cancel button Listener");
	this.refresh();
	
}
ZaCRMChannelModel.editButtonListener =
function () {
    var instance = this.getInstance();
    
    if(instance.channel_list_cache && instance.channel_list_cache[0]) {
        var formPage = this.getForm().parent;
        if(!formPage.editchannelDlg) {
            formPage.editchannelDlg = new ZaEditChannelXFormDialog(ZaApp.getInstance().getAppCtxt().getShell(),ZaApp.getInstance(), "350px", "100px","Edit channel");
            formPage.editchannelDlg.registerCallback(DwtDialog.OK_BUTTON, ZaCRMChannelModel.updatechannel, this.getForm(),null);
            formPage.editchannelDlg.registerCallback(DwtDialog.CANCEL_BUTTON, ZaCRMChannelModel.closeButtonListener, this.getForm(),null);
        }
        var obj = {};
        obj[ZaCRMadmin.A_channelId] = instance.channel_list_cache[0][ZaCRMadmin.A_channelId];
        obj[ZaCRMadmin.A_channelName] = instance.channel_list_cache[0][ZaCRMadmin.A_channelName];
        obj[ZaCRMadmin.A_channelStatus] = instance.channel_list_cache[0][ZaCRMadmin.A_channelStatus];
		
	 var volArr = this.getModel().getInstanceValue(this.getInstance(),ZaCRMadmin.A_channel);

        var cnt = volArr.length;
        for(var i=0; i < cnt; i++) {
            if(volArr[i][ZaCRMadmin.A_channelName]==obj[ZaCRMadmin.A_channelName])
             {
                obj._index = i;
                break;
            }
        }
	
	instance[ZaCRMadmin.A_channel_list_cache]=new Array();
        formPage.editchannelDlg.setObject(obj);
        formPage.editchannelDlg.popup();
    }
}

ZaCRMChannelModel.updatechannel=function()
{
	
	if(this.parent.editchannelDlg) 
	{
	
       	this.parent.editchannelDlg.popdown();
   		var obj = this.parent.editchannelDlg.getObject();

		var instance = this.getInstance();
		var channeles = [];
		var cnt = instance[ZaCRMadmin.A_channel].length;
		for (var i=0; i< cnt; i++) 
		{
			channeles[i] = instance[ZaCRMadmin.A_channel][i];
		}
		var dirty = false;

		obj[ZaCRMadmin.A_channelWriteby]= ZaZimbraAdmin.currentUserName;

		if(channeles[obj._index]) 
		{
		    if(channeles[obj._index][ZaCRMadmin.A_channelName] != obj[ZaCRMadmin.A_channelName]) {
		        channeles[obj._index][ZaCRMadmin.A_channelName] = obj[ZaCRMadmin.A_channelName];
		        dirty=true;
		    }
		    if(channeles[obj._index][ZaCRMadmin.A_channelStatus] != obj[ZaCRMadmin.A_channelStatus]) {
		        channeles[obj._index][ZaCRMadmin.A_channelStatus] = obj[ZaCRMadmin.A_channelStatus];
		        dirty=true;
		    }

		}

		var j = JSON.stringify({action:"UPDATE",object:"channel",channelId:obj[ZaCRMadmin.A_channelId],channelName:obj[ZaCRMadmin.A_channelName],status:obj[ZaCRMadmin.A_channelStatus],writeBy:obj[ZaCRMadmin.A_channelWriteby]});
		var json = "jsonobj=" + j;
		alert("jjjj channel ::"+j);
		//var json = "jsonobj={\"action\":\"LIST\",\"object\":\"channel\"}";
		var reqHeader = {"Content-Type":"application/x-www-form-urlencoded"};
		var reqJson = AjxStringUtil.urlEncode(json);
		var response = AjxRpc.invoke(reqJson,com_zimbra_crm_admin.jspUrl, reqHeader, null, false);
 		

//	 	this.getModel().setInstanceValue(this.getInstance(),ZaCRMadmin.A_channel,channeles);
		this.getModel().setInstanceValue(this.getInstance(), ZaCRMadmin.A_channel_list_cache, new Array());
		
		for(t=0;t<cnt;t++)
		{
			instance[ZaCRMadmin.A_channel].pop();
			
		}
		this.parent.setDirty(true);
		this.refresh();
		var tmp={};
		for(var k=0;k<cnt;k++)
		{
			tmp[ZaCRMadmin.A_channelId]=channeles[k][ZaCRMadmin.A_channelId];
			tmp[ZaCRMadmin.A_channelName]= channeles[k][ZaCRMadmin.A_channelName];
			tmp[ZaCRMadmin.A_channelStatus]= channeles[k][ZaCRMadmin.A_channelStatus];
			tmp[ZaCRMadmin.A_channelCreatedby]= channeles[k][ZaCRMadmin.A_channelCreatedby];
			tmp[ZaCRMadmin.A_channelCreateddate]= channeles[k][ZaCRMadmin.A_channelCreateddate];
			tmp[ZaCRMadmin.A_channelWriteby]= channeles[k][ZaCRMadmin.A_channelWriteby];
			tmp[ZaCRMadmin.A_channelWritedate]= channeles[k][ZaCRMadmin.A_channelWritedate];
			
			instance[ZaCRMadmin.A_channel].push(tmp);
			tmp={};	
		}
		ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format(com_zimbra_crm_admin.MSG_Edit+" : "+obj[ZaCRMadmin.A_channelName]));
		this.parent.setDirty(true);
		this.refresh();
		
		
	}
		
}

ZaCRMChannelModel.addPerson  = function () {
	if(this.parent.addchannelDlg) {
		var obj = this.parent.addchannelDlg.getObject();
		var instance = this.getInstance();
		instance = this.getInstance();
		var flag = 0;
		var len = this.getInstance()[ZaCRMadmin.A_channel].length;
		for (var i=0;i<len;i++)
		{
			if(obj[ZaCRMadmin.A_channelName] == this.getInstance()[ZaCRMadmin.A_channel][i][ZaCRMadmin.A_channelName])
			{
				flag = 1;
			}
		}
		if(flag == 0)
		{
			this.parent.addchannelDlg.popdown();
			instance[ZaCRMadmin.A_channel].push(obj);
			var j = JSON.stringify({action:"ADD",object:"channel",channelId:obj[ZaCRMadmin.A_channelId],channelName:obj[ZaCRMadmin.A_channelName],status:obj[ZaCRMadmin.A_channelStatus],createBy:obj[ZaCRMadmin.A_channelCreatedby],createDate:obj[ZaCRMadmin.A_channelCreateddate],writeBy:obj[ZaCRMadmin.A_channelWriteby],writeDate:obj[ZaCRMadmin.A_channelWritedate]});
			var json = "jsonobj=" + j;
			var reqHeader = {"Content-Type":"application/x-www-form-urlencoded"};
			var reqJson = AjxStringUtil.urlEncode(json);
			var response = AjxRpc.invoke(reqJson,com_zimbra_crm_admin.jspUrl, reqHeader, null, false);
			console.log(jsonParse(response.text));
			ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format(com_zimbra_crm_admin.MSG_Add+" : "+obj[ZaCRMadmin.A_channelName]));
		}
		else
		{
			ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format("Channel already exists"+" : "+obj[ZaCRMadmin.A_channelName]));
		}
		this.parent.setDirty(true);
		this.refresh();	
	}
}

ZaCRMChannelModel.addButtonListener =
function () {
	
	
	DBG.println(AjxDebug.DBG3, "Enter in AddButton Listener");

//	var aa = this.getHtmlElement();
		var formPage = this.getForm().parent;
		if(!formPage.addchannelDlg) {
			formPage.addchannelDlg = new ZaEditChannelXFormDialog(ZaApp.getInstance().getAppCtxt().getShell(),ZaApp.getInstance(),"350px", "100px","Add new channel");
			formPage.addchannelDlg.registerCallback(DwtDialog.OK_BUTTON, ZaCRMChannelModel.addPerson , this.getForm(), null);	
		}
		
		var obj = {};

		obj[ZaCRMadmin.A_channelId]= 0;
		obj[ZaCRMadmin.A_channelName]= "";
		obj[ZaCRMadmin.A_channelStatus]= true;
		obj[ZaCRMadmin.A_channelCreatedby]= ZaZimbraAdmin.currentUserName;
		obj[ZaCRMadmin.A_channelCreateddate]= "null";
		obj[ZaCRMadmin.A_channelWriteby]= ZaZimbraAdmin.currentUserName;
		obj[ZaCRMadmin.A_channelWritedate]= "null";
		obj.current = false;		
		
		formPage.addchannelDlg.setObject(obj);
		formPage.addchannelDlg.popup();		
		
}