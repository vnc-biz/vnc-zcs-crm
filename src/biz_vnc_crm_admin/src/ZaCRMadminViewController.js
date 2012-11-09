/*
##############################################################################
#    VNC-Virtual Network Consult GmbH.
#    Copyright (C) 2004-TODAY VNC-Virtual Network Consult GmbH
#    (<http://www.vnc.biz>).
#
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU General Public License as
#    published by the Free Software Foundation, either version 3 of the
#    License, or (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU General Public License for more details.
#
#    You should have received a copy of the GNU General Public License
#    along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
##############################################################################
*/

ZaEvent.S_CRM = i++;

var ZaCRMadminViewController = function(appCtxt, container) {
    ZaXFormViewController.call(this, appCtxt, container, "ZaCRMadminViewController");
    this._UICreated = false;
    this._app = appCtxt.getAppController().getApp(ZaZimbraAdmin.ADMIN_APP);
    this.objType = ZaEvent.S_CRM;
    this.tabConstructor = ZaCRMxFormView;
}

ZaCRMadminViewController.prototype = new ZaXFormViewController();
ZaCRMadminViewController.prototype.constructor = ZaCRMadminViewController;
ZaController.setViewMethods["ZaCRMadminViewController"] = new Array();
ZaController.changeActionsStateMethods["ZaCRMadminViewController"] = new Array();
ZaCRMadminViewController.prototype.show = function (entry) {
    this._setView(entry, true);
    this.setDirty(false);
}

ZaCRMadminViewController.setViewMethod = function (entry) {
    if (!this._UICreated) {
        this._contentView = this._view = new this.tabConstructor(this._container);
        var elements = new Object();
        elements[ZaAppViewMgr.C_APP_CONTENT] = this._contentView;

        var tabParams = {
            openInNewTab: true,
            tabId: ZaZimbraAdmin._CRM_ADMIN_VIEW,
            tab: this.getMainTab()
        }

        this._app.createView(ZaZimbraAdmin._CRM_ADMIN_VIEW, elements, tabParams);
        this._UICreated = true;
        this._app._controllers[ZaZimbraAdmin._CRM_ADMIN_VIEW] = this;
    }
    try {
        this._app.pushView(ZaZimbraAdmin._CRM_ADMIN_VIEW);
        this._view.setDirty(false);
        this._view.setObject(entry);
        this._currentObject = entry;
    } catch (ex) {
        this._handleException(ex, "ZaCRMadminViewController.setViewMethod", null, false);
    }
}

ZaController.setViewMethods["ZaCRMadminViewController"].push(ZaCRMadminViewController.setViewMethod);
