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

function ZaCRMLeadClassModel(parent) {
    ZaTabView.call(this, {
        parent: parent,
        iKeyName: "ZaCRMLeadClassModel",
        contextId: "_CRM_Admin_"
    });
    this.initForm(ZaCRMadmin.myXModel, this.getMyXForm());
    this._localXForm.setController(ZaApp.getInstance());
}

ZaCRMLeadClassModel.prototype = new ZaTabView;

ZaCRMLeadClassModel.prototype.constructor = ZaCRMLeadClassModel;

ZaCRMLeadClassModel.prototype.toString = function () {
    return "ZaCRMadminListView";
}

ZaCRMLeadClassModel.isEditLeadClassEnabled = function () {
    return (!AjxUtil.isEmpty(this.getInstanceValue(ZaCRMadmin.A_leadClass_list_cache)) && this.getInstanceValue(ZaCRMadmin.A_leadClass_list_cache).length == 1);
}

ZaCRMLeadClassModel.isDeleteLeadClassEnabled = function () {
    return (!AjxUtil.isEmpty(this.getInstanceValue(ZaCRMadmin.A_leadClass_list_cache)));
}

ZaCRMLeadClassModel.display = function () {
    var json, reqHeader, reqJson, response;
    json = "jsonobj={\"action\":\"LIST\",\"object\":\"leadClass\"}";
    reqHeader = {
        "Content-Type": "application/x-www-form-urlencoded"
    };
    reqJson = AjxStringUtil.urlEncode(json);
    response = AjxRpc.invoke(reqJson, biz_vnc_crm_admin.jspUrl, reqHeader, null, false);
    return (jsonParse(response.text));
}

ZaCRMLeadClassModel.leadClassSelectionListener = function (ev) {
    var instance = this.getInstance();
    var arr = this.widget.getSelection();
    if (arr && arr.length) {
        this.getModel().setInstanceValue(this.getInstance(), ZaCRMadmin.A_leadClass_list_cache, arr);

    } else {
        this.getModel().setInstanceValue(this.getInstance(), ZaCRMadmin.A_leadClass_list_cache, null);
    }

    if (ev.detail == DwtListView.ITEM_DBL_CLICKED) {
        ZaCRMLeadClassModel.editButtonListener.call(this);
    }
}

ZaCRMLeadClassModel.deleteButtonListener = function () {
    var instance = this.getInstance();
    var path = ZaCRMadmin.A_leadClass;
    var idArray = new Array();

    if (!this.getInstance()[ZaCRMadmin.A_leadClassRemoved]) {
        this.getInstance()[ZaCRMadmin.A_leadClassRemoved] = new Array();
    }

    if (instance.leadClass_list_cache != null) {
        var cnt = instance.leadClass_list_cache.length;
        if (cnt && instance[ZaCRMadmin.A_leadClass] && instance[ZaCRMadmin.A_leadClass]) {
            for (var i = 0; i < cnt; i++) {
                var cnt2 = instance[ZaCRMadmin.A_leadClass].length - 1;
                for (var k = cnt2; k >= 0; k--) {
                    if (instance[ZaCRMadmin.A_leadClass][k][ZaCRMadmin.A_leadClassName] == instance.leadClass_list_cache[i][ZaCRMadmin.A_leadClassName]) {
                        idArray[i] = instance.leadClass_list_cache[i][ZaCRMadmin.A_leadClassId];
                        break;
                    }
                }
            }
        }
    }

    ZaApp.getInstance().dialogs["confirmMessageDialog"] = new ZaMsgDialog(ZaApp.getInstance().getAppCtxt().getShell(), null, [DwtDialog.YES_BUTTON, DwtDialog.NO_BUTTON], null, ZaId.VIEW_STATUS + "_confirmMessage");
    ZaApp.getInstance().dialogs["confirmMessageDialog"].setMessage(AjxMessageFormat.format(biz_vnc_crm_admin.MSG_Delete), DwtMessageDialog.INFO_STYLE);
    ZaApp.getInstance().dialogs["confirmMessageDialog"].registerCallback(DwtDialog.YES_BUTTON, ZaCRMLeadClassModel.prototype.doDelete, this, [idArray]);
    ZaApp.getInstance().dialogs["confirmMessageDialog"].popup();
}

ZaCRMLeadClassModel.prototype.doDelete = function (idArray) {
    var instance = this.getInstance();
    var name = ZaZimbraAdmin.currentUserName;
    var json = "jsonobj={\"action\":\"DELETEBYID\",\"object\":\"leadClass\",\"array\":\"" + idArray + "\",\"writeBy\":\"" + name + "\"}";
    var reqHeader = {
        "Content-Type": "application/x-www-form-urlencoded"
    };
    var reqJson = AjxStringUtil.urlEncode(json);
    var response = AjxRpc.invoke(reqJson, biz_vnc_crm_admin.jspUrl, reqHeader, null, false);
    instance[ZaCRMadmin.A_leadClass] = ZaCRMLeadClassModel.display();

    ZaApp.getInstance().dialogs["confirmMessageDialog"].popdown();
    this.getForm().parent.setDirty(true);
    this.getForm().refresh();
}

ZaCRMLeadClassModel.closeButtonListener = function () {
    this.parent.editleadClassDlg.popdown();
    this.getInstance()[ZaCRMadmin.A_leadClass_list_cache] = new Array();
    this.parent.setDirty(false);
    DBG.println(AjxDebug.DBG3, "Cancel button Listener");
    this.refresh();
}

ZaCRMLeadClassModel.editButtonListener = function () {
    var instance = this.getInstance();
    if (instance.leadClass_list_cache && instance.leadClass_list_cache[0]) {
        var formPage = this.getForm().parent;
        if (!formPage.editleadClassDlg) {
            formPage.editleadClassDlg = new ZaEditLeadClassXFormDialog(ZaApp.getInstance().getAppCtxt().getShell(), ZaApp.getInstance(), "350px", "100px", "Edit leadClass");
            formPage.editleadClassDlg.registerCallback(DwtDialog.OK_BUTTON, ZaCRMLeadClassModel.updateleadClass, this.getForm(), null);
            formPage.editleadClassDlg.registerCallback(DwtDialog.CANCEL_BUTTON, ZaCRMLeadClassModel.closeButtonListener, this.getForm(), null);
        }
        var obj = {};
        obj[ZaCRMadmin.A_leadClassId] = instance.leadClass_list_cache[0][ZaCRMadmin.A_leadClassId];
        obj[ZaCRMadmin.A_leadClassName] = instance.leadClass_list_cache[0][ZaCRMadmin.A_leadClassName];
        obj[ZaCRMadmin.A_leadClassStatus] = instance.leadClass_list_cache[0][ZaCRMadmin.A_leadClassStatus];

        instance[ZaCRMadmin.A_leadClass_list_cache] = new Array();
        formPage.editleadClassDlg.setObject(obj);
        formPage.editleadClassDlg.popup();
    }
}

ZaCRMLeadClassModel.updateleadClass = function () {
    if (this.parent.editleadClassDlg) {
        this.parent.editleadClassDlg.popdown();
        var obj = this.parent.editleadClassDlg.getObject();
        var instance = this.getInstance();

        obj[ZaCRMadmin.A_leadClassWriteby] = ZaZimbraAdmin.currentUserName;
        var j = JSON.stringify({
            action: "UPDATE",
            object: "leadClass",
            leadClassId: obj[ZaCRMadmin.A_leadClassId],
            leadClassName: obj[ZaCRMadmin.A_leadClassName],
            status: obj[ZaCRMadmin.A_leadClassStatus],
            writeBy: obj[ZaCRMadmin.A_leadClassWriteby]
        });
        var json = "jsonobj=" + j;
        var reqHeader = {
            "Content-Type": "application/x-www-form-urlencoded"
        };
        var reqJson = AjxStringUtil.urlEncode(json);
        var response = AjxRpc.invoke(reqJson, biz_vnc_crm_admin.jspUrl, reqHeader, null, false);
        ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format(biz_vnc_crm_admin.MSG_Edit + " : " + obj[ZaCRMadmin.A_leadClassName]));

        instance[ZaCRMadmin.A_leadClass] = ZaCRMLeadClassModel.display();
        this.parent.setDirty(true);
        this.refresh();
    }

}

ZaCRMLeadClassModel.addPerson = function () {
    if (this.parent.addleadClassDlg) {
        var obj = this.parent.addleadClassDlg.getObject();
        var instance = this.getInstance();
        instance = this.getInstance();
        var flag = 0;
        var len = this.getInstance()[ZaCRMadmin.A_leadClass].length;
        for (var i = 0; i < len; i++) {
            if (obj[ZaCRMadmin.A_leadClassName] == this.getInstance()[ZaCRMadmin.A_leadClass][i][ZaCRMadmin.A_leadClassName]) {
                flag = 1;
            }
        }
        if (flag == 0) {
            this.parent.addleadClassDlg.popdown();
            var j = JSON.stringify({
                action: "ADD",
                object: "leadClass",
                leadClassId: obj[ZaCRMadmin.A_leadClassId],
                leadClassName: obj[ZaCRMadmin.A_leadClassName],
                status: obj[ZaCRMadmin.A_leadClassStatus],
                createBy: obj[ZaCRMadmin.A_leadClassCreatedby],
                writeBy: obj[ZaCRMadmin.A_leadClassWriteby]
            });
            var json = "jsonobj=" + j;
            var reqHeader = {
                "Content-Type": "application/x-www-form-urlencoded"
            };
            var reqJson = AjxStringUtil.urlEncode(json);
            var response = AjxRpc.invoke(reqJson, biz_vnc_crm_admin.jspUrl, reqHeader, null, false);
            ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format(biz_vnc_crm_admin.MSG_Add + " : " + obj[ZaCRMadmin.A_leadClassName]));
        } else {
            ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format("LeadClass already exists" + " : " + obj[ZaCRMadmin.A_leadClassName]));
        }

        instance[ZaCRMadmin.A_leadClass] = ZaCRMLeadClassModel.display();
        this.parent.setDirty(true);
        this.refresh();
    }
}

ZaCRMLeadClassModel.addButtonListener = function () {
    var formPage = this.getForm().parent;
    if (!formPage.addleadClassDlg) {
        formPage.addleadClassDlg = new ZaEditLeadClassXFormDialog(ZaApp.getInstance().getAppCtxt().getShell(), ZaApp.getInstance(), "350px", "100px", "Add new LeadClass");
        formPage.addleadClassDlg.registerCallback(DwtDialog.OK_BUTTON, ZaCRMLeadClassModel.addPerson, this.getForm(), null);
    }

    var obj = {};
    obj[ZaCRMadmin.A_leadClassId] = 0;
    obj[ZaCRMadmin.A_leadClassName] = "";
    obj[ZaCRMadmin.A_leadClassStatus] = true;
    obj[ZaCRMadmin.A_leadClassCreatedby] = ZaZimbraAdmin.currentUserName;
    obj[ZaCRMadmin.A_leadClassWriteby] = ZaZimbraAdmin.currentUserName;
    obj.current = false;

    formPage.addleadClassDlg.setObject(obj);
    formPage.addleadClassDlg.popup();
}