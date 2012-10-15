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

function ZaCRMStateModel(parent) {
    ZaTabView.call(this, {
        parent: parent,
        iKeyName: "ZaCRMStateModel",
        contextId: "_CRM_Admin_"
    });
    this.initForm(ZaCRMadmin.myXModel, this.getMyXForm());
    this._localXForm.setController(ZaApp.getInstance());
}

ZaCRMStateModel.prototype = new ZaTabView;
ZaCRMStateModel.prototype.constructor = ZaCRMStateModel;

ZaCRMStateModel.prototype.toString = function () {
    return "ZaCRMadminListView";
}

ZaCRMStateModel.isEditStateEnabled = function () {
    return (!AjxUtil.isEmpty(this.getInstanceValue(ZaCRMadmin.A_state_list_cache)) && this.getInstanceValue(ZaCRMadmin.A_state_list_cache).length == 1);
}

ZaCRMStateModel.isDeleteStateEnabled = function () {
    return (!AjxUtil.isEmpty(this.getInstanceValue(ZaCRMadmin.A_state_list_cache)));
}

ZaCRMStateModel.display = function () {
    var json, reqHeader, reqJson, response;
    json = "jsonobj={\"action\":\"LIST\",\"object\":\"state\"}";
    reqHeader = {
        "Content-Type": "application/x-www-form-urlencoded"
    };
    reqJson = AjxStringUtil.urlEncode(json);
    response = AjxRpc.invoke(reqJson, biz_vnc_crm_admin.jspUrl, reqHeader, null, false);
    return (jsonParse(response.text));
}

ZaCRMStateModel.stateSelectionListener = function (ev) {
    var instance = this.getInstance();
    var arr = this.widget.getSelection();

    if (arr && arr.length) {
        this.getModel().setInstanceValue(this.getInstance(), ZaCRMadmin.A_state_list_cache, arr);
    } else {
        this.getModel().setInstanceValue(this.getInstance(), ZaCRMadmin.A_state_list_cache, null);
    }

    if (ev.detail == DwtListView.ITEM_DBL_CLICKED) {
        ZaCRMStateModel.editButtonListener.call(this);
    }
}

ZaCRMStateModel.deleteButtonListener_state = function () {
    var instance = this.getInstance();
    var path = ZaCRMadmin.A_state;
    var idArray = new Array();

    if (!this.getInstance()[ZaCRMadmin.A_stateRemoved]) {
        this.getInstance()[ZaCRMadmin.A_stateRemoved] = new Array();
    }

    if (instance.state_list_cache != null) {
        var cnt = instance.state_list_cache.length;
        if (cnt && instance[ZaCRMadmin.A_state] && instance[ZaCRMadmin.A_state]) {
            for (var i = 0; i < cnt; i++) {
                var cnt2 = instance[ZaCRMadmin.A_state].length - 1;
                for (var k = cnt2; k >= 0; k--) {
                    if (instance[ZaCRMadmin.A_state][k][ZaCRMadmin.A_stateName] == instance.state_list_cache[i][ZaCRMadmin.A_stateName]) {
                        idArray[i] = instance.state_list_cache[i][ZaCRMadmin.A_stateId];
                        break;
                    }
                }
            }
        }
    }
    ZaApp.getInstance().dialogs["confirmMessageDialog"] = new ZaMsgDialog(ZaApp.getInstance().getAppCtxt().getShell(), null, [DwtDialog.YES_BUTTON, DwtDialog.NO_BUTTON], null, ZaId.VIEW_STATUS + "_confirmMessage");
    ZaApp.getInstance().dialogs["confirmMessageDialog"].setMessage(AjxMessageFormat.format(biz_vnc_crm_admin.MSG_Delete), DwtMessageDialog.INFO_STYLE);
    ZaApp.getInstance().dialogs["confirmMessageDialog"].registerCallback(DwtDialog.YES_BUTTON, ZaCRMStateModel.prototype.doDelete, this, [idArray]);
    ZaApp.getInstance().dialogs["confirmMessageDialog"].popup();
}

ZaCRMStateModel.prototype.doDelete = function (idArray) {
    var instance = this.getInstance();
    var name = ZaZimbraAdmin.currentUserName;
    var json = "jsonobj={\"action\":\"DELETEBYID\",\"object\":\"state\",\"array\":\"" + idArray + "\",\"writeBy\":\"" + name + "\"}";
    var reqHeader = {
        "Content-Type": "application/x-www-form-urlencoded"
    };
    var reqJson = AjxStringUtil.urlEncode(json);
    var response = AjxRpc.invoke(reqJson, biz_vnc_crm_admin.jspUrl, reqHeader, null, false);
    instance[ZaCRMadmin.A_state] = ZaCRMStateModel.display();

    ZaApp.getInstance().dialogs["confirmMessageDialog"].popdown();
    this.getForm().parent.setDirty(true);
    this.getForm().refresh();
}

ZaCRMStateModel.closeButtonListener = function () {
    this.parent.editStateDlg.popdown();
    this.getInstance()[ZaCRMadmin.A_state_list_cache] = new Array();
    this.parent.setDirty(false);
    DBG.println(AjxDebug.DBG3, "Cancel button Listener");
    this.refresh();

}

ZaCRMStateModel.editButtonListener = function () {
    var instance = this.getInstance();
    if (instance.state_list_cache && instance.state_list_cache[0]) {
        var formPage = this.getForm().parent;
        if (!formPage.editStateDlg) {
            formPage.editStateDlg = new ZaEditStateXFormDialog(ZaApp.getInstance().getAppCtxt().getShell(), ZaApp.getInstance(), "350px", "120px", "Edit State");
            formPage.editStateDlg.registerCallback(DwtDialog.OK_BUTTON, ZaCRMStateModel.updateState, this.getForm(), null);
            formPage.editStateDlg.registerCallback(DwtDialog.CANCEL_BUTTON, ZaCRMStateModel.closeButtonListener, this.getForm(), null);
        }
        var obj = {};
        var len = ZaEditStateXFormDialog.countryChoices.length;
        for (var i = 0; i < len; i++) {
            if (ZaEditStateXFormDialog.countryChoices[i].label == instance.state_list_cache[0][ZaCRMadmin.A_stateCountryName]) obj[ZaCRMadmin.A_stateCountryName] = ZaEditStateXFormDialog.countryChoices[i].value;
        }

        obj[ZaCRMadmin.A_stateId] = instance.state_list_cache[0][ZaCRMadmin.A_stateId];
        obj[ZaCRMadmin.A_stateName] = instance.state_list_cache[0][ZaCRMadmin.A_stateName];
        obj[ZaCRMadmin.A_stateCode] = instance.state_list_cache[0][ZaCRMadmin.A_stateCode];
        obj[ZaCRMadmin.A_stateCountryStatus] = instance.state_list_cache[0][ZaCRMadmin.A_stateCountryStatus];

        formPage.editStateDlg.setObject(obj);
        formPage.editStateDlg.popup();
    }
}

ZaCRMStateModel.updateState = function () {
    var json = "jsonobj={\"action\":\"COUNT\",\"object\":\"state\"}";
    var reqHeader = {
        "Content-Type": "application/x-www-form-urlencoded"
    };
    var reqJson = AjxStringUtil.urlEncode(json);
    var response = AjxRpc.invoke(reqJson, biz_vnc_crm_admin.jspUrl, reqHeader, null, false);
    if (this.parent.editStateDlg) {
        this.parent.editStateDlg.popdown();
        var obj = this.parent.editStateDlg.getObject();
        var instance = this.getInstance();

        obj[ZaCRMadmin.A_stateWriteby] = ZaZimbraAdmin.currentUserName;
        if (obj[ZaCRMadmin.A_stateCountryStatus] == true && response.text == 2){
            ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format(biz_vnc_crm_admin.usageLimitMessage));
            return;
        }

        var j = JSON.stringify({
            action: "UPDATE",
            object: "state",
            stateId: obj[ZaCRMadmin.A_stateId],
            stateName: obj[ZaCRMadmin.A_stateName],
            stateCode: obj[ZaCRMadmin.A_stateCode],
            countryId: obj[ZaCRMadmin.A_stateCountryName],
            status: obj[ZaCRMadmin.A_stateCountryStatus],
            writeBy: obj[ZaCRMadmin.A_stateWriteby]
        });
        var json = "jsonobj=" + j;
        var reqHeader = {
            "Content-Type": "application/x-www-form-urlencoded"
        };
        var reqJson = AjxStringUtil.urlEncode(json);
        var response = AjxRpc.invoke(reqJson, biz_vnc_crm_admin.jspUrl, reqHeader, null, false);
        instance[ZaCRMadmin.A_state] = ZaCRMStateModel.display();

        ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format(biz_vnc_crm_admin.MSG_Edit + " : " + obj[ZaCRMadmin.A_stateName]));
        this.parent.setDirty(true);
        this.refresh();
    }
}

ZaCRMStateModel.addPerson = function () {
    if (this.parent.addStateDlg) {
        var obj = this.parent.addStateDlg.getObject();
        var instance = this.getInstance();
        instance = this.getInstance();
        var flag = 0;
        var len = this.getInstance()[ZaCRMadmin.A_state].length;
        for (var i = 0; i < len; i++) {
            if ((obj[ZaCRMadmin.A_stateName] == this.getInstance()[ZaCRMadmin.A_state][i][ZaCRMadmin.A_stateName]) || (obj[ZaCRMadmin.A_stateCode] == this.getInstance()[ZaCRMadmin.A_state][i][ZaCRMadmin.A_stateCode])) {
                flag = 1;
            }
        }
        if (flag == 0) {
            this.parent.addStateDlg.popdown();
            var j = JSON.stringify({
                action: "ADD",
                object: "state",
                stateId: obj[ZaCRMadmin.A_stateId],
                stateName: obj[ZaCRMadmin.A_stateName],
                stateCode: obj[ZaCRMadmin.A_stateCode],
                countryId: obj[ZaCRMadmin.A_stateCountryName],
                status: obj[ZaCRMadmin.A_stateCountryStatus],
                createBy: obj[ZaCRMadmin.A_stateCreatedby],
                writeBy: obj[ZaCRMadmin.A_stateWriteby]
            });
            var json = "jsonobj=" + j;
            var reqHeader = {
                "Content-Type": "application/x-www-form-urlencoded"
            };
            var reqJson = AjxStringUtil.urlEncode(json);
            var response = AjxRpc.invoke(reqJson, biz_vnc_crm_admin.jspUrl, reqHeader, null, false);
            var len = ZaEditStateXFormDialog.countryChoices.length;
            for (var i = 0; i < len; i++) {
                if (ZaEditStateXFormDialog.countryChoices[i].value == obj[ZaCRMadmin.A_stateCountryName]) obj[ZaCRMadmin.A_stateCountryName] = ZaEditStateXFormDialog.countryChoices[i].label;
            }
            ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format(biz_vnc_crm_admin.MSG_Add + " : " + obj[ZaCRMadmin.A_stateName]));
        } else {
            ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format("State already exists" + " : " + obj[ZaCRMadmin.A_stateName] + " OR " + obj[ZaCRMadmin.A_stateCode]));
        }

        instance[ZaCRMadmin.A_state] = ZaCRMStateModel.display();
        this.parent.setDirty(true);
        this.refresh();
    }
}

ZaCRMStateModel.addButtonListener_state = function () {
    var json = "jsonobj={\"action\":\"COUNT\",\"object\":\"state\"}";
    var reqHeader = {
        "Content-Type": "application/x-www-form-urlencoded"
    };
    var reqJson = AjxStringUtil.urlEncode(json);
    var response = AjxRpc.invoke(reqJson, biz_vnc_crm_admin.jspUrl, reqHeader, null, false);

    if (response.text == 2){
        ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format(biz_vnc_crm_admin.usageLimitMessage));
        return;
    }

    var formPage = this.getForm().parent;
    if (!formPage.addStateDlg) {
        formPage.addStateDlg = new ZaEditStateXFormDialog(ZaApp.getInstance().getAppCtxt().getShell(), ZaApp.getInstance(), "350px", "120px", "Add new State");
        formPage.addStateDlg.registerCallback(DwtDialog.OK_BUTTON, ZaCRMStateModel.addPerson, this.getForm(), null);
    }

    var obj = {};
    obj[ZaCRMadmin.A_stateId] = 0;
    obj[ZaCRMadmin.A_stateName] = "";
    obj[ZaCRMadmin.A_stateCode] = "";
    obj[ZaCRMadmin.A_stateCountryName] = "Select Country";
    obj[ZaCRMadmin.A_stateCountryStatus] = true;
    obj[ZaCRMadmin.A_stateCreatedby] = ZaZimbraAdmin.currentUserName;
    obj[ZaCRMadmin.A_stateWriteby] = ZaZimbraAdmin.currentUserName;
    obj.current = false;
    formPage.addStateDlg.setObject(obj);
    formPage.addStateDlg.popup();
}
