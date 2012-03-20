ZaEvent.S_CRM=i++;
function ZaCRMadminViewController(appCtxt, container) {
	ZaXFormViewController.call(this, appCtxt,container,"ZaCRMadminViewController");
	this._UICreated = false;	
	this._app=appCtxt.getAppController().getApp(ZaZimbraAdmin.ADMIN_APP);
	//this._container=container;
	this.objType = ZaEvent.S_CRM;
//DJ	this._toolbarOperations = new Array();
	this.tabConstructor =ZaCRMxFormView;
}

ZaCRMadminViewController.prototype = new ZaXFormViewController();
ZaCRMadminViewController.prototype.constructor = ZaCRMadminViewController;

ZaController.setViewMethods["ZaCRMadminViewController"] = new Array();

ZaController.changeActionsStateMethods["ZaCRMadminViewController"] = new Array();




ZaCRMadminViewController.prototype.show = 
function(entry) {

		this._setView(entry,true);
		this.setDirty(false);
}

ZaCRMadminViewController.setViewMethod =
function(entry) {
	
	if(!this ._UICreated) 
	{
	this._contentView = this._view = new this.tabConstructor(this._container);
	var elements = new Object();
	elements[ZaAppViewMgr.C_APP_CONTENT] = this._contentView;
	
	var tabParams = {
		openInNewTab:true,
		tabId:ZaZimbraAdmin._CRM_ADMIN_VIEW,
		tab: this.getMainTab() 

		}

		this._app.createView(ZaZimbraAdmin._CRM_ADMIN_VIEW, elements,tabParams);
    	this._UICreated = true;
    	this._app._controllers[ZaZimbraAdmin._CRM_ADMIN_VIEW] = this;
	}	
	try {
		this._app.pushView(ZaZimbraAdmin._CRM_ADMIN_VIEW);
		this._view.setDirty(false);
		this._view.setObject(entry);
		this._currentObject=entry;
	} catch (ex) {
		this._handleException(ex, "ZaCRMadminViewController.setViewMethod", null, false);
	}		
}

ZaController.setViewMethods["ZaCRMadminViewController"].push(ZaCRMadminViewController.setViewMethod);
/*
ZaCRMadminViewController.prototype._saveChanges =
function () {
	this._contentView.setDirty(false);
  return true;
}
*/