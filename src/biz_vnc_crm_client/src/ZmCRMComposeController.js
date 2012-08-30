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

AjxDispatcher.require(["MailCore", "Mail"]);

ZmCRMComposeController = function (container, mailApp, currentView, leadId) {
    this.leadId = leadId;
    ZmComposeController.call(this, container, mailApp);
    this.viewId = ZmId.VIEW_COMPOSE;
    this._crmViewId = currentView;
}

ZmCRMComposeController.prototype = new ZmComposeController();
ZmCRMComposeController.prototype.constructor = ZmCRMComposeController;

ZmCRMComposeController.prototype._handleResponseSendMsg =
function(draftType, msg, callback, result) {
    var resp = result.getResponse();
    console.log(resp);
    // Reset the autosave interval to the default
    delete(this._autoSaveInterval);
    // Re-enable autosave
    this._initAutoSave();
    var needToPop = this._processSendMsg(draftType, msg, resp);

    this._msg = msg;

    if (callback) {
        callback.run(result);
    }

    if(this.sendMsgCallback) {
        this.sendMsgCallback.run(result);
    }

    appCtxt.notifyZimlets("onSendMsgSuccess", [this, msg]);//notify Zimlets on success

    if (needToPop) {
        this._app.popView(true, this._currentView);
    }
    appCtxt.getCurrentApp().pushView(this._crmViewId);
};

ZmCRMComposeController.prototype._cancelCompose = function() {
    var dirty = this._composeView.isDirty();
    var needPrompt = dirty || (this._draftType == ZmComposeController.DRAFT_TYPE_AUTO);
    if (!needPrompt) {
        AjxDebug.println(AjxDebug.REPLY, "Reset compose view: _cancelCompose");
        this._composeView.reset(true);
    } else {
        this._composeView.enableInputs(false);
    }
    this._composeView.reEnableDesignMode();
    this._app.popView(!needPrompt);
    appCtxt.getCurrentApp().pushView(this._crmViewId);
};
