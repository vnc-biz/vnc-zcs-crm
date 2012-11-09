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

var ZaCRMSectionModel = function(parent) {
    ZaTabView.call(this, {
        parent: parent,
        iKeyName: "ZaCRMSectionModel",
        contextId: "_CRM_Admin_"
    });
    this.initForm(ZaCRMadmin.myXModel, this.getMyXForm());
    this._localXForm.setController(ZaApp.getInstance());
}

ZaCRMSectionModel.prototype = new ZaTabView;
ZaCRMSectionModel.prototype.constructor = ZaCRMSectionModel;

ZaCRMSectionModel.prototype.toString = function () {
    return "ZaCRMadminListView";
}

ZaCRMSectionModel.isEditSectionEnabled = function () {
    return (!AjxUtil.isEmpty(this.getInstanceValue(ZaCRMadmin.A_section_list_cache)) && this.getInstanceValue(ZaCRMadmin.A_section_list_cache).length == 1);
}

ZaCRMSectionModel.isDeleteSectionEnabled = function () {
    return (!AjxUtil.isEmpty(this.getInstanceValue(ZaCRMadmin.A_section_list_cache)));
}

ZaCRMSectionModel.display = function () {
    var json, reqHeader, reqJson, response;
    json = "jsonobj={\"action\":\"LIST\",\"object\":\"section\"}";
    reqHeader = {
        "Content-Type": "application/x-www-form-urlencoded"
    };
    reqJson = AjxStringUtil.urlEncode(json);
    response = AjxRpc.invoke(reqJson, biz_vnc_crm_admin.jspUrl, reqHeader, null, false);
    return (jsonParse(response.text));
}

ZaCRMSectionModel.sectionSelectionListener = function (ev) {
    var instance = this.getInstance();
    var arr = this.widget.getSelection();

    if (arr && arr.length) {
        this.getModel().setInstanceValue(this.getInstance(), ZaCRMadmin.A_section_list_cache, arr);
    } else {
        this.getModel().setInstanceValue(this.getInstance(), ZaCRMadmin.A_section_list_cache, null);
    }

    if (ev.detail == DwtListView.ITEM_DBL_CLICKED) {
        ZaCRMSectionModel.editButtonListener.call(this);
    }
}

ZaCRMSectionModel.deleteButtonListener = function () {
    var instance = this.getInstance();
    var path = ZaCRMadmin.A_section;
    var idArray = new Array();
    if (!this.getInstance()[ZaCRMadmin.A_sectionRemoved]) {
        this.getInstance()[ZaCRMadmin.A_sectionRemoved] = new Array();
    }

    if (instance.section_list_cache != null) {
        var cnt = instance.section_list_cache.length;
        if (cnt && instance[ZaCRMadmin.A_section] && instance[ZaCRMadmin.A_section]) {
            for (var i = 0; i < cnt; i++) {
                var cnt2 = instance[ZaCRMadmin.A_section].length - 1;
                for (var k = cnt2; k >= 0; k--) {
                    if (instance[ZaCRMadmin.A_section][k][ZaCRMadmin.A_sectionName] == instance.section_list_cache[i][ZaCRMadmin.A_sectionName]) {
                        idArray[i] = instance.section_list_cache[i][ZaCRMadmin.A_sectionId];
                        break;
                    }
                }
            }

        }
    }
    ZaApp.getInstance().dialogs["confirmMessageDialog"] = new ZaMsgDialog(ZaApp.getInstance().getAppCtxt().getShell(), null, [DwtDialog.YES_BUTTON, DwtDialog.NO_BUTTON], null, ZaId.VIEW_STATUS + "_confirmMessage");
    ZaApp.getInstance().dialogs["confirmMessageDialog"].setMessage(AjxMessageFormat.format(biz_vnc_crm_admin.MSG_Delete), DwtMessageDialog.INFO_STYLE);
    ZaApp.getInstance().dialogs["confirmMessageDialog"].registerCallback(DwtDialog.YES_BUTTON, ZaCRMSectionModel.prototype.doDelete, this, [idArray]);
    ZaApp.getInstance().dialogs["confirmMessageDialog"].popup();
}

ZaCRMSectionModel.prototype.doDelete = function (idArray) {
    var instance = this.getInstance();
    var name = ZaZimbraAdmin.currentUserName;
    var json = "jsonobj={\"action\":\"DELETEBYID\",\"object\":\"section\",\"array\":\"" + idArray + "\",\"writeBy\":\"" + name + "\"}";
    var reqHeader = {
        "Content-Type": "application/x-www-form-urlencoded"
    };
    var reqJson = AjxStringUtil.urlEncode(json);
    var response = AjxRpc.invoke(reqJson, biz_vnc_crm_admin.jspUrl, reqHeader, null, false);
    instance[ZaCRMadmin.A_section] = ZaCRMSectionModel.display();

    ZaApp.getInstance().dialogs["confirmMessageDialog"].popdown();
    this.getForm().parent.setDirty(true);
    this.getForm().refresh();
}

ZaCRMSectionModel.closeButtonListener = function () {
    this.parent.editSectionDlg.popdown();
    this.getInstance()[ZaCRMadmin.A_section_list_cache] = new Array();
    this.parent.setDirty(false);
    DBG.println(AjxDebug.DBG3, "Cancel button Listener");
    this.refresh();
}

ZaCRMSectionModel.editButtonListener = function () {
    var instance = this.getInstance();
    if (instance.section_list_cache && instance.section_list_cache[0]) {
        var formPage = this.getForm().parent;
        if (!formPage.editSectionDlg) {
            formPage.editSectionDlg = new ZaEditSectionXFormDialog(ZaApp.getInstance().getAppCtxt().getShell(), ZaApp.getInstance(), "800px", "500px", "Edit Section");
            formPage.editSectionDlg.registerCallback(DwtDialog.OK_BUTTON, ZaCRMSectionModel.updateSection, this.getForm(), null);
            formPage.editSectionDlg.registerCallback(DwtDialog.CANCEL_BUTTON, ZaCRMSectionModel.closeButtonListener, this.getForm(), null);
        }
        var json, reqHeader, reqJson, response;

        json = "jsonobj={\"action\":\"USER\",\"object\":\"section\"}";
        reqHeader = {
            "Content-Type": "application/x-www-form-urlencoded"
        };
        reqJson = AjxStringUtil.urlEncode(json);
        response = AjxRpc.invoke(reqJson, biz_vnc_crm_admin.jspUrl, reqHeader, null, false);
        var chkListJson = eval(response.text);

        var commonuser = new Array();
        var len = chkListJson.length;

        for (var i = 0; i < len; i++) {
            var id = chkListJson[i].value;
            commonuser.push(id);
        }
        commonuser = AjxUtil.isEmpty(commonuser) ? [] : commonuser;

        var obj = {};

        obj[ZaCRMadmin.A_sectionId] = instance.section_list_cache[0][ZaCRMadmin.A_sectionId];
        obj[ZaCRMadmin.A_sectionName] = instance.section_list_cache[0][ZaCRMadmin.A_sectionName];
        obj[ZaCRMadmin.A_sectionCode] = instance.section_list_cache[0][ZaCRMadmin.A_sectionCode];
        obj[ZaCRMadmin.A_sectionManagerId] = instance.section_list_cache[0][ZaCRMadmin.A_sectionManagerId];
        obj[ZaCRMadmin.A_sectionLeaderId] = instance.section_list_cache[0][ZaCRMadmin.A_sectionLeaderId];
        obj[ZaCRMadmin.A_sectionWatcherId] = instance.section_list_cache[0][ZaCRMadmin.A_sectionWatcherId];
        var temp = instance.section_list_cache[0][ZaCRMadmin.A_sectionSalesTeamIds];
        var temp1 = temp.split(/[\s,;]+/);
        obj[ZaCRMadmin.A_sectionSalesTeamIds] = temp1;
        obj[ZaCRMadmin.A_sectionCommonSalesTeamIds] = commonuser;
        obj[ZaGlobalConfig.A_zimbraMtaBlockedExtension] = instance.section_list_cache[0][ZaCRMadmin.A_sectionSalesTeamIds];
        obj[ZaCRMadmin.A_sectionStatus] = instance.section_list_cache[0][ZaCRMadmin.A_sectionStatus];
        instance[ZaCRMadmin.A_section_list_cache] = new Array();
        formPage.editSectionDlg.setObject(obj);
        formPage.editSectionDlg.popup();
    }
}

ZaCRMSectionModel.updateSection = function () {
    var json = "jsonobj={\"action\":\"COUNT\",\"object\":\"section\"}";
    var reqHeader = {
        "Content-Type": "application/x-www-form-urlencoded"
    };
    var reqJson = AjxStringUtil.urlEncode(json);
    var response = AjxRpc.invoke(reqJson, biz_vnc_crm_admin.jspUrl, reqHeader, null, false);
    if (this.parent.editSectionDlg) {
        this.parent.editSectionDlg.popdown();
        var obj = this.parent.editSectionDlg.getObject();
        var instance = this.getInstance();
        var temp1 = obj[ZaCRMadmin.A_sectionSalesTeamIds];

        var temp = "";

        var len = temp1.length;
        for (var i = 0; i < len; i++) {
            if (i == len - 1) {
                temp += temp1[i];
            } else {
                temp += temp1[i] + ",";
            }
        }

        obj[ZaCRMadmin.A_sectionWriteby] = ZaZimbraAdmin.currentUserName;
        if (obj[ZaCRMadmin.A_sectionStatus] == true && response.text == 2){
            ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format(biz_vnc_crm_admin.usageLimitMessage));
            return;
        }

        var j = JSON.stringify({
            action: "UPDATE",
            object: "section",
            sectionId: obj[ZaCRMadmin.A_sectionId],
            sectionName: obj[ZaCRMadmin.A_sectionName],
            sectionCode: obj[ZaCRMadmin.A_sectionCode],
            sectionManagerId: obj[ZaCRMadmin.A_sectionManagerId],
            sectionLeaderId: obj[ZaCRMadmin.A_sectionLeaderId],
            sectionWatcherId: obj[ZaCRMadmin.A_sectionWatcherId],
            sectionSalesTeamIds: temp,
            status: obj[ZaCRMadmin.A_sectionStatus],
            writeBy: obj[ZaCRMadmin.A_sectionWriteby]
        });
        var json = "jsonobj=" + j;
        var reqHeader = {
            "Content-Type": "application/x-www-form-urlencoded"
        };
        var reqJson = AjxStringUtil.urlEncode(json);
        var response = AjxRpc.invoke(reqJson, biz_vnc_crm_admin.jspUrl, reqHeader, null, false);

        ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format(biz_vnc_crm_admin.MSG_Edit + " : " + obj[ZaCRMadmin.A_sectionName]));
        instance[ZaCRMadmin.A_section] = ZaCRMSectionModel.display();
        this.parent.setDirty(true);
        this.refresh();
    }
}

ZaCRMSectionModel.addPerson = function () {
    if (this.parent.addSectionDlg) {

        var obj = this.parent.addSectionDlg.getObject();
        var instance = this.getInstance();
        var flag = 0;

        var test1 = obj[ZaCRMadmin.A_sectionSalesTeamIds];
        var test = "";
        var len = test1.length;
        for (var i = 0; i < len; i++) {
            if (i == len - 1) {
                test += test1[i];
            } else {
                test += test1[i] + ",";
            }
        }
        var len = this.getInstance()[ZaCRMadmin.A_section].length;
        for (var i = 0; i < len; i++) {
            if ((obj[ZaCRMadmin.A_sectionName] == this.getInstance()[ZaCRMadmin.A_section][i][ZaCRMadmin.A_sectionName]) || (obj[ZaCRMadmin.A_sectionCode] == this.getInstance()[ZaCRMadmin.A_section][i][ZaCRMadmin.A_sectionCode])) {
                flag = 1;
            }
        }
        if (flag == 0) {
            this.parent.addSectionDlg.popdown();
            var j = JSON.stringify({
                action: "ADD",
                object: "section",
                sectionId: obj[ZaCRMadmin.A_sectionId],
                sectionName: obj[ZaCRMadmin.A_sectionName],
                sectionCode: obj[ZaCRMadmin.A_sectionCode],
                sectionManagerId: obj[ZaCRMadmin.A_sectionManagerId],
                sectionLeaderId: obj[ZaCRMadmin.A_sectionLeaderId],
                sectionWatcherId: obj[ZaCRMadmin.A_sectionWatcherId],
                sectionSalesTeamIds: test,
                status: obj[ZaCRMadmin.A_sectionStatus],
                createBy: obj[ZaCRMadmin.A_sectionCreatedby],
                writeBy: obj[ZaCRMadmin.A_sectionWriteby]
            });
            var json = "jsonobj=" + j;
            var reqHeader = {
                "Content-Type": "application/x-www-form-urlencoded"
            };
            var reqJson = AjxStringUtil.urlEncode(json);
            var response = AjxRpc.invoke(reqJson, biz_vnc_crm_admin.jspUrl, reqHeader, null, false);
            ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format(biz_vnc_crm_admin.MSG_Add + " : " + obj[ZaCRMadmin.A_sectionName]));
        } else {
            ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format("Country already exists" + " : " + obj[ZaCRMadmin.A_sectionName] + " OR " + obj[ZaCRMadmin.A_sectionCode]));
        }

        instance[ZaCRMadmin.A_section] = ZaCRMSectionModel.display();
        this.parent.setDirty(true);
        this.refresh();
    }
}

ZaCRMSectionModel.addButtonListener = function () {
    var json = "jsonobj={\"action\":\"COUNT\",\"object\":\"section\"}";
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
    var obj = {};
    obj[ZaCRMadmin.A_selected_user_selection] = "";
    obj[ZaCRMadmin.A_common_user_selection] = "";

    if (!formPage.addSectionDlg) {
        formPage.addSectionDlg = new ZaEditSectionXFormDialog(ZaApp.getInstance().getAppCtxt().getShell(), ZaApp.getInstance(), "800px", "500px", "Add new section");
        formPage.addSectionDlg.registerCallback(DwtDialog.OK_BUTTON, ZaCRMSectionModel.addPerson, this.getForm(), null);
    }
    var json, reqHeader, reqJson, response;
    json = "jsonobj={\"action\":\"USER\",\"object\":\"section\"}";
    reqHeader = {
        "Content-Type": "application/x-www-form-urlencoded"
    };
    reqJson = AjxStringUtil.urlEncode(json);
    response = AjxRpc.invoke(reqJson, biz_vnc_crm_admin.jspUrl, reqHeader, null, false);
    var chkListJson = eval(response.text);

    var temp = new Array();
    var len = chkListJson.length;

    for (var i = 0; i < len; i++) {
        var id = chkListJson[i].value;
        temp.push(id);
    }
    temp = AjxUtil.isEmpty(temp) ? [] : temp;

    obj[ZaCRMadmin.A_sectionId] = 0;
    obj[ZaCRMadmin.A_sectionName] = "";
    obj[ZaCRMadmin.A_sectionCode] = "";
    obj[ZaCRMadmin.A_sectionCommonSalesTeamIds] = temp;
    obj[ZaCRMadmin.A_sectionStatus] = true;
    obj[ZaCRMadmin.A_sectionCreatedby] = ZaZimbraAdmin.currentUserName;
    obj[ZaCRMadmin.A_sectionWriteby] = ZaZimbraAdmin.currentUserName;
    obj[ZaCRMadmin.A_sectionSalesTeamIds] = "";

    obj.current = false;
    formPage.addSectionDlg.setObject(obj);
    formPage.addSectionDlg.popup();
}
