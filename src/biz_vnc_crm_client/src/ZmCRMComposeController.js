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
    delete(this._autoSaveInterval);
    this._initAutoSave();
    var needToPop = this._processSendMsg(draftType, msg, resp);

    this._msg = msg;

    if (callback) {
        callback.run(result);
    }

    if(this.sendMsgCallback) {
        this.sendMsgCallback.run(result);
    }

    appCtxt.notifyZimlets("onSendMsgSuccess", [this, msg]);

    if (needToPop) {
        this._app.popView(true, this._currentView);
    }
    
    appCtxt.getCurrentApp().pushView(this._crmViewId);
    var mailId = resp.m[0].id;
    var json = "jsonobj={\"action\":\"HISTORY\",\"object\":\"opp\",\"array\":\"" + mailId + "\",\"leadId\":\"" + this.leadId + "\"}";
    var reqHeader = {
        "Content-Type": "application/x-www-form-urlencoded"
    };
    var reqJson = AjxStringUtil.urlEncode(json);
    var response = AjxRpc.invoke(reqJson, "/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);
    if (response.text == 1) {
        Ext.example.msg('', biz_vnc_crm_client.msgEmailAttach);
        if (biz_vnc_crm_client.flag == 0) {
            var leadId = biz_vnc_crm_client.leadId;
            var json = "jsonobj={\"action\":\"LISTHISTORY\",\"object\":\"lead\",\"leadId\":\"" + leadId + "\"}";
            var reqHeader = {
                "Content-Type": "application/x-www-form-urlencoded"
            };
            var reqJson = AjxStringUtil.urlEncode(json);
            var responseMailHistory = AjxRpc.invoke(reqJson, "/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);
            var msgArray = [];
            var item;
            var msgArray = (responseMailHistory.text).split(",");
    
            if (msgArray != "null") {
                biz_vnc_crm_client.requestMailList(msgArray);
            } else {
                biz_vnc_crm_client.mailData = "[{'mailId':'','date':'','from':'','subject':'','message':''}]";
            }
            Ext.getCmp('leadMailGrid').getStore().loadData(jsonParse(biz_vnc_crm_client.mailData), false);
            Ext.getCmp('leadMailGrid').getView().refresh();

        } else if (biz_vnc_crm_client.flag == 1) {
            var leadId = biz_vnc_crm_client.leadId;
            var json = "jsonobj={\"action\":\"LISTHISTORY\",\"object\":\"opp\",\"leadId\":\"" + leadId + "\"}";
            var reqHeader = {
                "Content-Type": "application/x-www-form-urlencoded"
            };
            var reqJson = AjxStringUtil.urlEncode(json);
            var responseMailHistory = AjxRpc.invoke(reqJson, "/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);
            var msgArray = [];
            var item;
            var msgArray = (responseMailHistory.text).split(",");
    
            if (msgArray != "null") {
                biz_vnc_crm_client.requestMailList(msgArray);
            } else {
                biz_vnc_crm_client.mailData = "[{'mailId':'','date':'','from':'','subject':'','message':''}]";
            }
            Ext.getCmp('oppMailGrid').getStore().loadData(jsonParse(biz_vnc_crm_client.mailData), false);
            Ext.getCmp('oppMailGrid').getView().refresh();
        }
    } else {
           Ext.example.msg('', biz_vnc_crm_client.msgEmailNotAttach);
    }
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
