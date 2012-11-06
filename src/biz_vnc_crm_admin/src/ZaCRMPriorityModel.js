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

var ZaCRMPriorityModel = function(parent) {
    ZaTabView.call(this, {
        parent: parent,
        iKeyName: "ZaCRMPriorityModel",
        contextId: "_CRM_Admin_"
    });
    this.initForm(ZaCRMadmin.myXModel, this.getMyXForm());
    this._localXForm.setController(ZaApp.getInstance());
}

ZaCRMPriorityModel.prototype = new ZaTabView;
ZaCRMPriorityModel.prototype.constructor = ZaCRMPriorityModel;

ZaCRMPriorityModel.prototype.toString = function () {
    return "ZaCRMadminListView";
}

ZaCRMPriorityModel.isEditPriorityEnabled = function () {
    return (!AjxUtil.isEmpty(this.getInstanceValue(ZaCRMadmin.A_priority_list_cache)) && this.getInstanceValue(ZaCRMadmin.A_priority_list_cache).length == 1);
}

ZaCRMPriorityModel.isDeletePriorityEnabled = function () {
    return (!AjxUtil.isEmpty(this.getInstanceValue(ZaCRMadmin.A_priority_list_cache)));
}

ZaCRMPriorityModel.display = function () {
    var json, reqHeader, reqJson, response;
    json = "jsonobj={\"action\":\"LIST\",\"object\":\"priority\"}";
    reqHeader = {
        "Content-Type": "application/x-www-form-urlencoded"
    };
    reqJson = AjxStringUtil.urlEncode(json);
    response = AjxRpc.invoke(reqJson, biz_vnc_crm_admin.jspUrl, reqHeader, null, false);
    return (jsonParse(response.text));
}

ZaCRMPriorityModel.prioritySelectionListener = function (ev) {
    var instance = this.getInstance();
    var arr = this.widget.getSelection();

    if (arr && arr.length) {
        this.getModel().setInstanceValue(this.getInstance(), ZaCRMadmin.A_priority_list_cache, arr);
    } else {
        this.getModel().setInstanceValue(this.getInstance(), ZaCRMadmin.A_priority_list_cache, null);
    }

    if (ev.detail == DwtListView.ITEM_DBL_CLICKED) {
        ZaCRMPriorityModel.editButtonListener.call(this);
    }

}

ZaCRMPriorityModel.deleteButtonListener = function () {
    var instance = this.getInstance();
    var path = ZaCRMadmin.A_priority;
    var idArray = new Array();
    if (!this.getInstance()[ZaCRMadmin.A_priorityRemoved]) {
        this.getInstance()[ZaCRMadmin.A_priorityRemoved] = new Array();
    }

    if (instance.priority_list_cache != null) {
        var cnt = instance.priority_list_cache.length;
        if (cnt && instance[ZaCRMadmin.A_priority] && instance[ZaCRMadmin.A_priority]) {
            for (var i = 0; i < cnt; i++) {
                var cnt2 = instance[ZaCRMadmin.A_priority].length - 1;
                for (var k = cnt2; k >= 0; k--) {
                    if (instance[ZaCRMadmin.A_priority][k][ZaCRMadmin.A_priorityName] == instance.priority_list_cache[i][ZaCRMadmin.A_priorityName]) {
                        idArray[i] = instance.priority_list_cache[i][ZaCRMadmin.A_priorityId];
                        break;
                    }
                }
            }

        }
    }
    ZaApp.getInstance().dialogs["confirmMessageDialog"] = new ZaMsgDialog(ZaApp.getInstance().getAppCtxt().getShell(), null, [DwtDialog.YES_BUTTON, DwtDialog.NO_BUTTON], null, ZaId.VIEW_STATUS + "_confirmMessage");
    ZaApp.getInstance().dialogs["confirmMessageDialog"].setMessage(AjxMessageFormat.format(biz_vnc_crm_admin.MSG_Delete), DwtMessageDialog.INFO_STYLE);
    ZaApp.getInstance().dialogs["confirmMessageDialog"].registerCallback(DwtDialog.YES_BUTTON, ZaCRMPriorityModel.prototype.doDelete, this, [idArray]);
    ZaApp.getInstance().dialogs["confirmMessageDialog"].popup();
}

ZaCRMPriorityModel.prototype.doDelete = function (idArray) {

    var instance = this.getInstance();
    var name = ZaZimbraAdmin.currentUserName;
    var json = "jsonobj={\"action\":\"DELETEBYID\",\"object\":\"priority\",\"array\":\"" + idArray + "\",\"writeBy\":\"" + name + "\"}";
    var reqHeader = {
        "Content-Type": "application/x-www-form-urlencoded"
    };
    var reqJson = AjxStringUtil.urlEncode(json);
    var response = AjxRpc.invoke(reqJson, biz_vnc_crm_admin.jspUrl, reqHeader, null, false);
    instance[ZaCRMadmin.A_priority] = ZaCRMPriorityModel.display();

    ZaApp.getInstance().dialogs["confirmMessageDialog"].popdown();
    this.getForm().parent.setDirty(true);
    this.getForm().refresh();

}

ZaCRMPriorityModel.closeButtonListener = function () {
    this.parent.editpriorityDlg.popdown();
    this.getInstance()[ZaCRMadmin.A_priority_list_cache] = new Array();
    this.parent.setDirty(false);
    DBG.println(AjxDebug.DBG3, "Cancel button Listener");
    this.refresh();

}

ZaCRMPriorityModel.editButtonListener = function () {
    var instance = this.getInstance();

    if (instance.priority_list_cache && instance.priority_list_cache[0]) {
        var formPage = this.getForm().parent;
        if (!formPage.editpriorityDlg) {
            formPage.editpriorityDlg = new ZaEditPriorityXFormDialog(ZaApp.getInstance().getAppCtxt().getShell(), ZaApp.getInstance(), "350px", "100px", "Edit priority");
            formPage.editpriorityDlg.registerCallback(DwtDialog.OK_BUTTON, ZaCRMPriorityModel.updatepriority, this.getForm(), null);
            formPage.editpriorityDlg.registerCallback(DwtDialog.CANCEL_BUTTON, ZaCRMPriorityModel.closeButtonListener, this.getForm(), null);
        }
        var obj = {};
        obj[ZaCRMadmin.A_priorityId] = instance.priority_list_cache[0][ZaCRMadmin.A_priorityId];
        obj[ZaCRMadmin.A_priorityName] = instance.priority_list_cache[0][ZaCRMadmin.A_priorityName];
        obj[ZaCRMadmin.A_priorityCode] = instance.priority_list_cache[0][ZaCRMadmin.A_priorityCode];
        obj[ZaCRMadmin.A_priorityStatus] = instance.priority_list_cache[0][ZaCRMadmin.A_priorityStatus];

        instance[ZaCRMadmin.A_priority_list_cache] = new Array();
        formPage.editpriorityDlg.setObject(obj);
        formPage.editpriorityDlg.popup();
    }
}

ZaCRMPriorityModel.updatepriority = function () {
    var json = "jsonobj={\"action\":\"COUNT\",\"object\":\"priority\"}";
    var reqHeader = {
        "Content-Type": "application/x-www-form-urlencoded"
    };
    var reqJson = AjxStringUtil.urlEncode(json);
    var response = AjxRpc.invoke(reqJson, biz_vnc_crm_admin.jspUrl, reqHeader, null, false);
    if (this.parent.editpriorityDlg) {
        this.parent.editpriorityDlg.popdown();
        var obj = this.parent.editpriorityDlg.getObject();
        var instance = this.getInstance();
        obj[ZaCRMadmin.A_priorityWriteby] = ZaZimbraAdmin.currentUserName;
        if (obj[ZaCRMadmin.A_priorityStatus] == true && response.text == 2){
            ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format(biz_vnc_crm_admin.usageLimitMessage));
            return;
        }

        var j = JSON.stringify({
            action: "UPDATE",
            object: "priority",
            priorityId: obj[ZaCRMadmin.A_priorityId],
            priorityName: obj[ZaCRMadmin.A_priorityName],
            priorityCode: obj[ZaCRMadmin.A_priorityCode],
            status: obj[ZaCRMadmin.A_priorityStatus],
            writeBy: obj[ZaCRMadmin.A_priorityWriteby]
        });
        var json = "jsonobj=" + j;
        var reqHeader = {
            "Content-Type": "application/x-www-form-urlencoded"
        };
        var reqJson = AjxStringUtil.urlEncode(json);
        var response = AjxRpc.invoke(reqJson, biz_vnc_crm_admin.jspUrl, reqHeader, null, false);

        ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format(biz_vnc_crm_admin.MSG_Edit + " : " + obj[ZaCRMadmin.A_priorityName]));
        instance[ZaCRMadmin.A_priority] = ZaCRMPriorityModel.display();
        this.parent.setDirty(true);
        this.refresh();
    }
}

ZaCRMPriorityModel.addPerson = function () {
    if (this.parent.addpriorityDlg) {

        var obj = this.parent.addpriorityDlg.getObject();
        var instance = this.getInstance();
        instance = this.getInstance();
        var flag = 0;
        var len = this.getInstance()[ZaCRMadmin.A_priority].length;
        for (var i = 0; i < len; i++) {
            if ((obj[ZaCRMadmin.A_priorityName] == this.getInstance()[ZaCRMadmin.A_priority][i][ZaCRMadmin.A_priorityName]) || (obj[ZaCRMadmin.A_priorityCode] == this.getInstance()[ZaCRMadmin.A_priority][i][ZaCRMadmin.A_priorityCode])) {
                flag = 1;
            }
        }
        if (flag == 0) {
            this.parent.addpriorityDlg.popdown();
            var j = JSON.stringify({
                action: "ADD",
                object: "priority",
                priorityId: obj[ZaCRMadmin.A_priorityId],
                priorityName: obj[ZaCRMadmin.A_priorityName],
                priorityCode: obj[ZaCRMadmin.A_priorityCode],
                status: obj[ZaCRMadmin.A_priorityStatus],
                createBy: obj[ZaCRMadmin.A_priorityCreatedby],
                writeBy: obj[ZaCRMadmin.A_priorityWriteby]
            });
            var json = "jsonobj=" + j;
            var reqHeader = {
                "Content-Type": "application/x-www-form-urlencoded"
            };
            var reqJson = AjxStringUtil.urlEncode(json);
            var response = AjxRpc.invoke(reqJson, biz_vnc_crm_admin.jspUrl, reqHeader, null, false);
            ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format(biz_vnc_crm_admin.MSG_Add + " : " + obj[ZaCRMadmin.A_priorityName]));
        } else {
            ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format("Priority already exists" + " : " + obj[ZaCRMadmin.A_priorityName] + " OR " + obj[ZaCRMadmin.A_priorityCode]));
        }

        instance[ZaCRMadmin.A_priority] = ZaCRMPriorityModel.display();
        this.parent.setDirty(true);
        this.refresh();
    }
}

ZaCRMPriorityModel.addButtonListener = function () {
    var json = "jsonobj={\"action\":\"COUNT\",\"object\":\"priority\"}";
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
    if (!formPage.addpriorityDlg) {
        formPage.addpriorityDlg = new ZaEditPriorityXFormDialog(ZaApp.getInstance().getAppCtxt().getShell(), ZaApp.getInstance(), "350px", "100px", "Add new priority");
        formPage.addpriorityDlg.registerCallback(DwtDialog.OK_BUTTON, ZaCRMPriorityModel.addPerson, this.getForm(), null);
    }

    var obj = {};
    obj[ZaCRMadmin.A_priorityId] = 0;
    obj[ZaCRMadmin.A_priorityName] = "";
    obj[ZaCRMadmin.A_priorityCode] = "";
    obj[ZaCRMadmin.A_priorityStatus] = true;
    obj[ZaCRMadmin.A_priorityCreatedby] = ZaZimbraAdmin.currentUserName;
    obj[ZaCRMadmin.A_priorityWriteby] = ZaZimbraAdmin.currentUserName;

    obj.current = false;

    formPage.addpriorityDlg.setObject(obj);
    formPage.addpriorityDlg.popup();
}
