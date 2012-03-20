function ZaCRMCountryModel (parent) {
	ZaTabView.call(this, {
        parent:parent,
        iKeyName:"ZaCRMCountryModel",
        contextId:"_CRM_Admin_"
        });
		this.initForm(ZaCRMadmin.myXModel,this.getMyXForm());	
		this._localXForm.setController(ZaApp.getInstance());
}


ZaCRMCountryModel.prototype = new ZaTabView;

ZaCRMCountryModel.prototype.constructor = ZaCRMCountryModel;

ZaCRMCountryModel.prototype.toString = function() {
	return "ZaCRMadminListView";
}

ZaCRMCountryModel.isEditCountryEnabled=function()
{
	return (!AjxUtil.isEmpty(this.getInstanceValue(ZaCRMadmin.A_country_list_cache)) && this.getInstanceValue(ZaCRMadmin.A_country_list_cache).length==1);
}
ZaCRMCountryModel.isDeleteCountryEnabled=function()
{
	return (!AjxUtil.isEmpty(this.getInstanceValue(ZaCRMadmin.A_country_list_cache)));
}



ZaCRMCountryModel.countrySelectionListener = 
function (ev) {
	var instance = this.getInstance();
	var arr= this.widget.getSelection();

    if(arr && arr.length) {
        //arr.sort(ZaServer.comparepersonsByName);
        this.getModel().setInstanceValue(this.getInstance(), ZaCRMadmin.A_country_list_cache, arr);
        //instance.country_list_cache = arr;
    } else {
        this.getModel().setInstanceValue(this.getInstance(), ZaCRMadmin.A_country_list_cache, null);
        //instance.country_list_cache = null;
    }

    if (ev.detail == DwtListView.ITEM_DBL_CLICKED) {
        ZaCRMCountryModel.editButtonListener.call(this);
    }
	
}

ZaCRMCountryModel.deleteButtonListener=function()
{

	var instance = this.getInstance();
	var path = ZaCRMadmin.A_country;
	var idArray = new Array();
	if(!this.getInstance()[ZaCRMadmin.A_countryRemoved]) {
		this.getInstance()[ZaCRMadmin.A_countryRemoved] = new Array();
	}

	if(instance.country_list_cache != null) {
		var cnt = instance.country_list_cache.length;
		if(cnt && instance[ZaCRMadmin.A_country] && instance[ZaCRMadmin.A_country]) {
			for(var i=0;i<cnt;i++) {
				var cnt2 = instance[ZaCRMadmin.A_country].length-1;				
				for(var k=cnt2;k>=0;k--) {
					if(instance[ZaCRMadmin.A_country][k][ZaCRMadmin.A_countryName]==instance.country_list_cache[i][ZaCRMadmin.A_countryName]) {
						instance[ZaCRMadmin.A_countryRemoved].push(instance[ZaCRMadmin.A_country][k]);
						instance[ZaCRMadmin.A_country].splice(k,1);
						idArray[i]	= instance.country_list_cache[i][ZaCRMadmin.A_countryId];
						break;	
					}
				}
			}
				
		}
	}
	ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format(com_zimbra_crm_admin.MSG_Delete,"Delete","Delete"));
	instance[ZaCRMadmin.A_country_list_cache]=new Array();
	this.getForm().parent.setDirty(true);
	this.getForm().refresh();

	var json = "jsonobj={\"action\":\"DELETEBYID\",\"object\":\"country\",\"array\":\"" + idArray + "\"}";
	var reqHeader = {"Content-Type":"application/x-www-form-urlencoded"};
	var reqJson = AjxStringUtil.urlEncode(json);
	var response = AjxRpc.invoke(reqJson,com_zimbra_crm_admin.jspUrl, reqHeader, null, false);
}
ZaCRMCountryModel.closeButtonListener=
function()
{
	this.parent.editCountryDlg.popdown();
	this.getInstance()[ZaCRMadmin.A_country_list_cache]=new Array();
	this.parent.setDirty(false);
	DBG.println(AjxDebug.DBG3, "Cancel button Listener");
	this.refresh();
	
}
ZaCRMCountryModel.editButtonListener =
function () {
    var instance = this.getInstance();
    
    if(instance.country_list_cache && instance.country_list_cache[0]) {
        var formPage = this.getForm().parent;
        if(!formPage.editCountryDlg) {
            formPage.editCountryDlg = new ZaEditCountryXFormDialog(ZaApp.getInstance().getAppCtxt().getShell(),ZaApp.getInstance(), "350px", "100px","Edit Country");
            formPage.editCountryDlg.registerCallback(DwtDialog.OK_BUTTON, ZaCRMCountryModel.updateCountry, this.getForm(),null);
            formPage.editCountryDlg.registerCallback(DwtDialog.CANCEL_BUTTON, ZaCRMCountryModel.closeButtonListener, this.getForm(),null);
        }
        var obj = {};
        obj[ZaCRMadmin.A_countryId] = instance.country_list_cache[0][ZaCRMadmin.A_countryId];
        obj[ZaCRMadmin.A_countryName] = instance.country_list_cache[0][ZaCRMadmin.A_countryName];
        obj[ZaCRMadmin.A_countryCode] = instance.country_list_cache[0][ZaCRMadmin.A_countryCode];
		obj[ZaCRMadmin.A_countryStatus] = instance.country_list_cache[0][ZaCRMadmin.A_countryStatus];

	 var volArr = this.getModel().getInstanceValue(this.getInstance(),ZaCRMadmin.A_country);

        var cnt = volArr.length;
        for(var i=0; i < cnt; i++) {
            if(volArr[i][ZaCRMadmin.A_countryName]==obj[ZaCRMadmin.A_countryName])
             {
                obj._index = i;
                break;
            }
        }
	
	instance[ZaCRMadmin.A_country_list_cache]=new Array();
        formPage.editCountryDlg.setObject(obj);
        formPage.editCountryDlg.popup();
    }
}

ZaCRMCountryModel.updateCountry=function()
{
	
	if(this.parent.editCountryDlg) 
	{
	
       	this.parent.editCountryDlg.popdown();
   		var obj = this.parent.editCountryDlg.getObject();
		
		
		var instance = this.getInstance();
		var countries = [];
		var cnt = instance[ZaCRMadmin.A_country].length;
		for (var i=0; i< cnt; i++) 
		{
			countries[i] = instance[ZaCRMadmin.A_country][i];
		}
		var dirty = false;

		obj[ZaCRMadmin.A_countryWriteby]= ZaZimbraAdmin.currentUserName;

		if(countries[obj._index]) 
		{
			if(countries[obj._index][ZaCRMadmin.A_countryName] != obj[ZaCRMadmin.A_countryName]) {
		        countries[obj._index][ZaCRMadmin.A_countryName] = obj[ZaCRMadmin.A_countryName];
		        dirty=true;
		    }
		    if(countries[obj._index][ZaCRMadmin.A_countryCode] != obj[ZaCRMadmin.A_countryCode]) {
		        countries[obj._index][ZaCRMadmin.A_countryCode] = obj[ZaCRMadmin.A_countryCode];
		        dirty=true;
		    }
			if(countries[obj._index][ZaCRMadmin.A_countryStatus] != obj[ZaCRMadmin.A_countrystatus]) {
				countries[obj._index][ZaCRMadmin.A_countryStatus] = obj[ZaCRMadmin.A_countryStatus];
		        dirty=true;
		    }
		}
		
		var j = JSON.stringify({action:"UPDATE",object:"country",countryId:obj[ZaCRMadmin.A_countryId],countryName:obj[ZaCRMadmin.A_countryName],countryCode:obj[ZaCRMadmin.A_countryCode],status:obj[ZaCRMadmin.A_countryStatus],writeBy:obj[ZaCRMadmin.A_countryWriteby]});
		var json = "jsonobj=" + j;
		alert("jjjj country ::"+j);
		var reqHeader = {"Content-Type":"application/x-www-form-urlencoded"};
		var reqJson = AjxStringUtil.urlEncode(json);
		var response = AjxRpc.invoke(reqJson,com_zimbra_crm_admin.jspUrl, reqHeader, null, false);
		console.log(jsonParse(response.text));



//	 	this.getModel().setInstanceValue(this.getInstance(),ZaCRMadmin.A_country,countries);
		this.getModel().setInstanceValue(this.getInstance(), ZaCRMadmin.A_country_list_cache, new Array());
		
		for(t=0;t<cnt;t++)
		{
			instance[ZaCRMadmin.A_country].pop();
			
		}
		this.parent.setDirty(true);
		this.refresh();
		var tmp={};
		for(var k=0;k<cnt;k++)
		{
			tmp[ZaCRMadmin.A_countryId]=countries[k][ZaCRMadmin.A_countryId];
			tmp[ZaCRMadmin.A_countryName]= countries[k][ZaCRMadmin.A_countryName];
			tmp[ZaCRMadmin.A_countryCode]= countries[k][ZaCRMadmin.A_countryCode];
			tmp[ZaCRMadmin.A_countryStatus]= countries[k][ZaCRMadmin.A_countryStatus];
			tmp[ZaCRMadmin.A_countryCreatedby]= countries[k][ZaCRMadmin.A_countryCreatedby];
			tmp[ZaCRMadmin.A_countryCreateddate]= countries[k][ZaCRMadmin.A_countryCreateddate];
			tmp[ZaCRMadmin.A_countryWriteby]= countries[k][ZaCRMadmin.A_countryWriteby];
			tmp[ZaCRMadmin.A_countryWritedate]= countries[k][ZaCRMadmin.A_countryWritedate];
			
			instance[ZaCRMadmin.A_country].push(tmp);
			tmp={};	
		}
		ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format(com_zimbra_crm_admin.MSG_Edit+" : "+obj[ZaCRMadmin.A_countryName]));
		this.parent.setDirty(true);
		this.refresh();
		
		
	}
		
}

ZaCRMCountryModel.addPerson  = function () {
	if(this.parent.addCountryDlg) {
		var obj = this.parent.addCountryDlg.getObject();
		var instance = this.getInstance();
		instance = this.getInstance();
		var flag = 0;
		alert("ZaCRMadmin.A_countryStatus===>"+obj[ZaCRMadmin.A_countryStatus]);
		var len = this.getInstance()[ZaCRMadmin.A_country].length;
		for (var i=0;i<len;i++)
		{
			if((obj[ZaCRMadmin.A_countryName] == this.getInstance()[ZaCRMadmin.A_country][i][ZaCRMadmin.A_countryName]) || (obj[ZaCRMadmin.A_countryCode] == this.getInstance()[ZaCRMadmin.A_country][i][ZaCRMadmin.A_countryCode]))
			{
				flag = 1;
			}
		}
		if(flag == 0)
		{
			this.parent.addCountryDlg.popdown();
			instance[ZaCRMadmin.A_country].push(obj);
			var j = JSON.stringify({action:"ADD",object:"country",countryId:obj[ZaCRMadmin.A_countryId],countryName:obj[ZaCRMadmin.A_countryName],countryCode:obj[ZaCRMadmin.A_countryCode],status:obj[ZaCRMadmin.A_countryStatus],createBy:obj[ZaCRMadmin.A_countryCreatedby],createDate:obj[ZaCRMadmin.A_countryCreateddate],writeBy:obj[ZaCRMadmin.A_countryWriteby],writeDate:obj[ZaCRMadmin.A_countryWritedate]});
			var json = "jsonobj=" + j;
			var reqHeader = {"Content-Type":"application/x-www-form-urlencoded"};
			var reqJson = AjxStringUtil.urlEncode(json);
			var response = AjxRpc.invoke(reqJson,com_zimbra_crm_admin.jspUrl, reqHeader, null, false);
			console.log(jsonParse(response.text));
			ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format(com_zimbra_crm_admin.MSG_Add+" : "+obj[ZaCRMadmin.A_countryName]));
		}
		else
		{
			ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format("Country already exists"+" : "+obj[ZaCRMadmin.A_countryName] + " OR " + obj[ZaCRMadmin.A_countryCode]));
		}
				
		this.parent.setDirty(true);
		this.refresh();	
	}

}


ZaCRMCountryModel.addButtonListener =
function () {
	
	
//	DBG.println(AjxDebug.DBG3, "Enter in AddButton Listener");

//	var aa = this.getHtmlElement();
		//alert(this.getInstance()[ZaCRMadmin.A_country].length);
		//alert(this.getInstance()[ZaCRMadmin.A_country][0][ZaCRMadmin.A_countryName]);
		//alert(this.getInstance()[ZaCRMadmin.A_country][1][ZaCRMadmin.A_countryName]);
		//alert(this.getInstance()[ZaCRMadmin.A_country][2][ZaCRMadmin.A_countryName]);
		var formPage = this.getForm().parent;
		if(!formPage.addCountryDlg) {
			formPage.addCountryDlg = new ZaEditCountryXFormDialog(ZaApp.getInstance().getAppCtxt().getShell(),ZaApp.getInstance(),"350px", "100px","Add new country");
			formPage.addCountryDlg.registerCallback(DwtDialog.OK_BUTTON, ZaCRMCountryModel.addPerson , this.getForm(), null);						
		}
		
		var obj = {};

		//DJ
//ZaCRMCountryModel.prototype.COUNT_ID=0;
		obj[ZaCRMadmin.A_countryId]= 0;
		obj[ZaCRMadmin.A_countryName]= "";
		obj[ZaCRMadmin.A_countryCode]= "";
		obj[ZaCRMadmin.A_countryStatus]= true;
		obj[ZaCRMadmin.A_countryCreatedby]= ZaZimbraAdmin.currentUserName;
		obj[ZaCRMadmin.A_countryCreateddate]= "null";
		obj[ZaCRMadmin.A_countryWriteby]= ZaZimbraAdmin.currentUserName;
		obj[ZaCRMadmin.A_countryWritedate]= "null";
		
		obj.current = false;		
		
		formPage.addCountryDlg.setObject(obj);
		formPage.addCountryDlg.popup();		
}