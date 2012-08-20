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

function ZaCRMCountryModel(parent) {
    ZaTabView.call(this, {
        parent: parent,
        iKeyName: "ZaCRMCountryModel",
        contextId: "_CRM_Admin_"
    });
    this.initForm(ZaCRMadmin.myXModel, this.getMyXForm());
    this._localXForm.setController(ZaApp.getInstance());
}

ZaCRMCountryModel.prototype = new ZaTabView;

ZaCRMCountryModel.prototype.constructor = ZaCRMCountryModel;

ZaCRMCountryModel.prototype.toString = function () {
    return "ZaCRMadminListView";
}

ZaCRMCountryModel.isEditCountryEnabled = function () {
    return (!AjxUtil.isEmpty(this.getInstanceValue(ZaCRMadmin.A_country_list_cache)) && this.getInstanceValue(ZaCRMadmin.A_country_list_cache).length == 1);
}

ZaCRMCountryModel.isDeleteCountryEnabled = function () {
    return (!AjxUtil.isEmpty(this.getInstanceValue(ZaCRMadmin.A_country_list_cache)));
}

ZaCRMCountryModel.display = function () {

    var json, reqHeader, reqJson, response;
    json = "jsonobj={\"action\":\"LIST\",\"object\":\"country\"}";
    reqHeader = {
        "Content-Type": "application/x-www-form-urlencoded"
    };
    reqJson = AjxStringUtil.urlEncode(json);
    response = AjxRpc.invoke(reqJson, biz_vnc_crm_admin.jspUrl, reqHeader, null, false);
    return (jsonParse(response.text));
}

ZaCRMCountryModel.countrySelectionListener = function (ev) {
    var instance = this.getInstance();
    var arr = this.widget.getSelection();

    if (arr && arr.length) {
        this.getModel().setInstanceValue(this.getInstance(), ZaCRMadmin.A_country_list_cache, arr);
    } else {
        this.getModel().setInstanceValue(this.getInstance(), ZaCRMadmin.A_country_list_cache, null);
    }

    if (ev.detail == DwtListView.ITEM_DBL_CLICKED) {
        ZaCRMCountryModel.editButtonListener.call(this);
    }
}

ZaCRMCountryModel.deleteButtonListener = function () {
    var instance = this.getInstance();
    var path = ZaCRMadmin.A_country;
    var idArray = new Array();
    if (!this.getInstance()[ZaCRMadmin.A_countryRemoved]) {
        this.getInstance()[ZaCRMadmin.A_countryRemoved] = new Array();
    }
    if (instance.country_list_cache != null) {
        var cnt = instance.country_list_cache.length;
        if (cnt && instance[ZaCRMadmin.A_country] && instance[ZaCRMadmin.A_country]) {
            for (var i = 0; i < cnt; i++) {
                var cnt2 = instance[ZaCRMadmin.A_country].length - 1;
                for (var k = cnt2; k >= 0; k--) {
                    if (instance[ZaCRMadmin.A_country][k][ZaCRMadmin.A_countryName] == instance.country_list_cache[i][ZaCRMadmin.A_countryName]) {
                        idArray[i] = instance.country_list_cache[i][ZaCRMadmin.A_countryId];
                        break;
                    }
                }
            }

        }
    }
    ZaApp.getInstance().dialogs["confirmMessageDialog"] = new ZaMsgDialog(ZaApp.getInstance().getAppCtxt().getShell(), null, [DwtDialog.YES_BUTTON, DwtDialog.NO_BUTTON], null, ZaId.VIEW_STATUS + "_confirmMessage");
    ZaApp.getInstance().dialogs["confirmMessageDialog"].setMessage(AjxMessageFormat.format(biz_vnc_crm_admin.MSG_Delete), DwtMessageDialog.INFO_STYLE);
    ZaApp.getInstance().dialogs["confirmMessageDialog"].registerCallback(DwtDialog.YES_BUTTON, ZaCRMCountryModel.prototype.doDelete, this, [idArray]);
    ZaApp.getInstance().dialogs["confirmMessageDialog"].popup();
}

ZaCRMCountryModel.prototype.doDelete = function (idArray) {
    var name = ZaZimbraAdmin.currentUserName;
    var json = "jsonobj={\"action\":\"DELETEBYID\",\"object\":\"country\",\"array\":\"" + idArray + "\",\"writeBy\":\"" + name + "\"}";
    var reqHeader = {
        "Content-Type": "application/x-www-form-urlencoded"
    };
    var reqJson = AjxStringUtil.urlEncode(json);
    var response = AjxRpc.invoke(reqJson, biz_vnc_crm_admin.jspUrl, reqHeader, null, false);
    var instance = this.getInstance();
    instance[ZaCRMadmin.A_country] = ZaCRMCountryModel.display();

    ZaApp.getInstance().dialogs["confirmMessageDialog"].popdown();
    this.getForm().parent.setDirty(true);
    this.getForm().refresh();
}

ZaCRMCountryModel.closeButtonListener = function () {
    this.parent.editCountryDlg.popdown();
    this.getInstance()[ZaCRMadmin.A_country_list_cache] = new Array();
    this.parent.setDirty(false);
    this.refresh();
}

ZaCRMCountryModel.editButtonListener = function () {
    var instance = this.getInstance();
    if (instance.country_list_cache && instance.country_list_cache[0]) {
        var formPage = this.getForm().parent;
        if (!formPage.editCountryDlg) {
            formPage.editCountryDlg = new ZaEditCountryXFormDialog(ZaApp.getInstance().getAppCtxt().getShell(), ZaApp.getInstance(), "350px", "100px", "Edit Country");
            formPage.editCountryDlg.registerCallback(DwtDialog.OK_BUTTON, ZaCRMCountryModel.updateCountry, this.getForm(), null);
            formPage.editCountryDlg.registerCallback(DwtDialog.CANCEL_BUTTON, ZaCRMCountryModel.closeButtonListener, this.getForm(), null);
        }
        var obj = {};
        obj[ZaCRMadmin.A_countryId] = instance.country_list_cache[0][ZaCRMadmin.A_countryId];
        obj[ZaCRMadmin.A_countryName] = instance.country_list_cache[0][ZaCRMadmin.A_countryName];
        obj[ZaCRMadmin.A_countryCode] = instance.country_list_cache[0][ZaCRMadmin.A_countryCode];
        obj[ZaCRMadmin.A_countryStatus] = instance.country_list_cache[0][ZaCRMadmin.A_countryStatus];

        formPage.editCountryDlg.setObject(obj);
        formPage.editCountryDlg.popup();
    }
}

ZaCRMCountryModel.updateCountry = function () {
    var json = "jsonobj={\"action\":\"COUNT\",\"object\":\"country\"}";
    var reqHeader = {
        "Content-Type": "application/x-www-form-urlencoded"
    };
    var reqJson = AjxStringUtil.urlEncode(json);
    var response = AjxRpc.invoke(reqJson, biz_vnc_crm_admin.jspUrl, reqHeader, null, false);
    if (this.parent.editCountryDlg) {
        this.parent.editCountryDlg.popdown();
        var obj = this.parent.editCountryDlg.getObject();
        var instance = this.getInstance();
        obj[ZaCRMadmin.A_countryWriteby] = ZaZimbraAdmin.currentUserName;
        if (obj[ZaCRMadmin.A_countryStatus] == true && response.text == 2){
            ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format(biz_vnc_crm_admin.usageLimitMessage));
            return;
        }

        var j = JSON.stringify({
            action: "UPDATE",
            object: "country",
            countryId: obj[ZaCRMadmin.A_countryId],
            countryName: obj[ZaCRMadmin.A_countryName],
            countryCode: obj[ZaCRMadmin.A_countryCode],
            status: obj[ZaCRMadmin.A_countryStatus],
            writeBy: obj[ZaCRMadmin.A_countryWriteby]
        });
        var json = "jsonobj=" + j;
        var reqHeader = {
            "Content-Type": "application/x-www-form-urlencoded"
        };
        var reqJson = AjxStringUtil.urlEncode(json);
        var response = AjxRpc.invoke(reqJson, biz_vnc_crm_admin.jspUrl, reqHeader, null, false);

        instance[ZaCRMadmin.A_country] = ZaCRMCountryModel.display();

        ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format(biz_vnc_crm_admin.MSG_Edit + " : " + obj[ZaCRMadmin.A_countryName]));
        this.parent.setDirty(true);
        this.refresh();
    }
}

ZaCRMCountryModel.addPerson = function () {
    if (this.parent.addCountryDlg) {
        var obj = this.parent.addCountryDlg.getObject();
        var instance = this.getInstance();
        instance = this.getInstance();
        var flag = 0;
        var len = this.getInstance()[ZaCRMadmin.A_country].length;
        for (var i = 0; i < len; i++) {
            if ((obj[ZaCRMadmin.A_countryName] == this.getInstance()[ZaCRMadmin.A_country][i][ZaCRMadmin.A_countryName]) || (obj[ZaCRMadmin.A_countryCode] == this.getInstance()[ZaCRMadmin.A_country][i][ZaCRMadmin.A_countryCode])) {
                flag = 1;
            }
        }
        if (flag == 0) {
            this.parent.addCountryDlg.popdown();
            var j = JSON.stringify({
                action: "ADD",
                object: "country",
                countryId: obj[ZaCRMadmin.A_countryId],
                countryName: obj[ZaCRMadmin.A_countryName],
                countryCode: obj[ZaCRMadmin.A_countryCode],
                status: obj[ZaCRMadmin.A_countryStatus],
                createBy: obj[ZaCRMadmin.A_countryCreatedby],
                writeBy: obj[ZaCRMadmin.A_countryWriteby]
            });
            var json = "jsonobj=" + j;
            var reqHeader = {
                "Content-Type": "application/x-www-form-urlencoded"
            };
            var reqJson = AjxStringUtil.urlEncode(json);
            var response = AjxRpc.invoke(reqJson, biz_vnc_crm_admin.jspUrl, reqHeader, null, false);
            ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format(biz_vnc_crm_admin.MSG_Add + " : " + obj[ZaCRMadmin.A_countryName]));
        } else {
            ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format("Country already exists" + " : " + obj[ZaCRMadmin.A_countryName] + " OR " + obj[ZaCRMadmin.A_countryCode]));
        }

        instance[ZaCRMadmin.A_country] = ZaCRMCountryModel.display();
        this.parent.setDirty(true);
        this.refresh();
    }
}

ZaCRMCountryModel.addButtonListener = function () {
    var json = "jsonobj={\"action\":\"COUNT\",\"object\":\"country\"}";
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
    if (!formPage.addCountryDlg) {
        formPage.addCountryDlg = new ZaEditCountryXFormDialog(ZaApp.getInstance().getAppCtxt().getShell(), ZaApp.getInstance(), "350px", "100px", "Add new country");
        formPage.addCountryDlg.registerCallback(DwtDialog.OK_BUTTON, ZaCRMCountryModel.addPerson, this.getForm(), null);
    }

    var obj = {};
    obj[ZaCRMadmin.A_countryId] = 0;
    obj[ZaCRMadmin.A_countryName] = "";
    obj[ZaCRMadmin.A_countryCode] = "";
    obj[ZaCRMadmin.A_countryStatus] = true;
    obj[ZaCRMadmin.A_countryCreatedby] = ZaZimbraAdmin.currentUserName;
    obj[ZaCRMadmin.A_countryWriteby] = ZaZimbraAdmin.currentUserName;

    obj.current = false;

    formPage.addCountryDlg.setObject(obj);
    formPage.addCountryDlg.popup();
}