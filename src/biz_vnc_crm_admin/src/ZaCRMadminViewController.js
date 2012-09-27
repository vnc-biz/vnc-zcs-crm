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

function ZaCRMadminViewController(appCtxt, container) {
    ZaXFormViewController.call(this, appCtxt, container, "ZaCRMadminViewController");
    this._UICreated = false;
    this.tabConstructor = ZaCRMxFormView;
}

ZaCRMadminViewController.prototype = new ZaXFormViewController();
ZaCRMadminViewController.prototype.constructor = ZaCRMadminViewController;
ZaController.setViewMethods["ZaCRMadminViewController"] = [];

ZaCRMadminViewController.setViewMethod = function (item) {
    if (!this._UICreated) {
        this._contentView = this._view = new this.tabConstructor(this._container,item);
        var elements = new Object();
        elements[ZaAppViewMgr.C_APP_CONTENT] = this._contentView;
        ZaApp.getInstance().getAppViewMgr().createView(this.getContentViewId(), elements);
        this._UICreated = true;
        ZaApp.getInstance()._controllers[this.getContentViewId ()] = this ;
    }
    try {
        ZaApp.getInstance().pushView(this.getContentViewId());
        this._view.setDirty(false);
        this._view.setObject(item);
        this._currentObject = item;
    } catch (ex) {
        this._handleException(ex, "ZaCRMadminViewController.setViewMethod1", null, false);
    }
}

ZaController.setViewMethods["ZaCRMadminViewController"].push(ZaCRMadminViewController.setViewMethod);
