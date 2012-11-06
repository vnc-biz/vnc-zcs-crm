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

var ZaCRMCategoryModel = function(parent) {
    ZaTabView.call(this, {
        parent: parent,
        iKeyName: "ZaCRMCategoryModel",
        contextId: "_CRM_Admin_"
    });
    this.initForm(ZaCRMadmin.myXModel, this.getMyXForm());
    this._localXForm.setController(ZaApp.getInstance());
}

ZaCRMCategoryModel.prototype = new ZaTabView;
ZaCRMCategoryModel.prototype.constructor = ZaCRMCategoryModel;

ZaCRMCategoryModel.prototype.toString = function () {
    return "ZaCRMadminListView";
}

ZaCRMCategoryModel.isEditCategoryEnabled = function () {
    return (!AjxUtil.isEmpty(this.getInstanceValue(ZaCRMadmin.A_category_list_cache)) && this.getInstanceValue(ZaCRMadmin.A_category_list_cache).length == 1);
}

ZaCRMCategoryModel.isDeleteCategoryEnabled = function () {
    return (!AjxUtil.isEmpty(this.getInstanceValue(ZaCRMadmin.A_category_list_cache)));
}

ZaCRMCategoryModel.display = function () {
    var json, reqHeader, reqJson, response;
    json = "jsonobj={\"action\":\"LIST\",\"object\":\"category\"}";
    reqHeader = {
        "Content-Type": "application/x-www-form-urlencoded"
    };
    reqJson = AjxStringUtil.urlEncode(json);
    response = AjxRpc.invoke(reqJson, biz_vnc_crm_admin.jspUrl, reqHeader, null, false);
    return (jsonParse(response.text));
}

ZaCRMCategoryModel.categorySelectionListener = function (ev) {
    var instance = this.getInstance();
    var arr = this.widget.getSelection();

    if (arr && arr.length) {
        this.getModel().setInstanceValue(this.getInstance(), ZaCRMadmin.A_category_list_cache, arr);
    } else {
        this.getModel().setInstanceValue(this.getInstance(), ZaCRMadmin.A_category_list_cache, null);
    }

    if (ev.detail == DwtListView.ITEM_DBL_CLICKED) {
        ZaCRMCategoryModel.editButtonListener.call(this);
    }
}

ZaCRMCategoryModel.deleteButtonListener = function () {
    var instance = this.getInstance();
    var path = ZaCRMadmin.A_category;
    var idArray = new Array();
    if (!this.getInstance()[ZaCRMadmin.A_categoryRemoved]) {
        this.getInstance()[ZaCRMadmin.A_categoryRemoved] = new Array();
    }

    if (instance.category_list_cache != null) {
        var cnt = instance.category_list_cache.length;
        if (cnt && instance[ZaCRMadmin.A_category] && instance[ZaCRMadmin.A_category]) {
            for (var i = 0; i < cnt; i++) {
                var cnt2 = instance[ZaCRMadmin.A_category].length - 1;
                for (var k = cnt2; k >= 0; k--) {
                    if (instance[ZaCRMadmin.A_category][k][ZaCRMadmin.A_categoryName] == instance.category_list_cache[i][ZaCRMadmin.A_categoryName]) {
                        idArray[i] = instance.category_list_cache[i][ZaCRMadmin.A_categoryId];
                        break;
                    }
                }
            }

        }
    }
    ZaApp.getInstance().dialogs["confirmMessageDialog"] = new ZaMsgDialog(ZaApp.getInstance().getAppCtxt().getShell(), null, [DwtDialog.YES_BUTTON, DwtDialog.NO_BUTTON], null, ZaId.VIEW_STATUS + "_confirmMessage");
    ZaApp.getInstance().dialogs["confirmMessageDialog"].setMessage(AjxMessageFormat.format(biz_vnc_crm_admin.MSG_Delete), DwtMessageDialog.INFO_STYLE);
    ZaApp.getInstance().dialogs["confirmMessageDialog"].registerCallback(DwtDialog.YES_BUTTON, ZaCRMCategoryModel.prototype.doDelete, this, [idArray]);
    ZaApp.getInstance().dialogs["confirmMessageDialog"].popup();
}

ZaCRMCategoryModel.prototype.doDelete = function (idArray) {
    var instance = this.getInstance();
    var name = ZaZimbraAdmin.currentUserName;
    var json = "jsonobj={\"action\":\"DELETEBYID\",\"object\":\"category\",\"array\":\"" + idArray + "\",\"writeBy\":\"" + name + "\"}";
    var reqHeader = {
        "Content-Type": "application/x-www-form-urlencoded"
    };
    var reqJson = AjxStringUtil.urlEncode(json);
    var response = AjxRpc.invoke(reqJson, biz_vnc_crm_admin.jspUrl, reqHeader, null, false);
    instance[ZaCRMadmin.A_category] = ZaCRMCategoryModel.display();
    ZaApp.getInstance().dialogs["confirmMessageDialog"].popdown();
    this.getForm().parent.setDirty(true);
    this.getForm().refresh();

}

ZaCRMCategoryModel.closeButtonListener = function () {
    this.parent.editcategoryDlg.popdown();
    this.getInstance()[ZaCRMadmin.A_category_list_cache] = new Array();
    this.parent.setDirty(false);
    DBG.println(AjxDebug.DBG3, "Cancel button Listener");
    this.refresh();
}

ZaCRMCategoryModel.editButtonListener = function () {
    var instance = this.getInstance();

    if (instance.category_list_cache && instance.category_list_cache[0]) {
        var formPage = this.getForm().parent;
        if (!formPage.editcategoryDlg) {
            formPage.editcategoryDlg = new ZaEditCategoryXFormDialog(ZaApp.getInstance().getAppCtxt().getShell(), ZaApp.getInstance(), "350px", "100px", "Edit category");
            formPage.editcategoryDlg.registerCallback(DwtDialog.OK_BUTTON, ZaCRMCategoryModel.updatecategory, this.getForm(), null);
            formPage.editcategoryDlg.registerCallback(DwtDialog.CANCEL_BUTTON, ZaCRMCategoryModel.closeButtonListener, this.getForm(), null);
        }
        var obj = {};
        obj[ZaCRMadmin.A_categoryId] = instance.category_list_cache[0][ZaCRMadmin.A_categoryId];
        obj[ZaCRMadmin.A_categoryName] = instance.category_list_cache[0][ZaCRMadmin.A_categoryName];
        var len = ZaEditCategoryXFormDialog.salesTeamChoices.length;
        for (var i = 0; i < len; i++) {
            if (ZaEditCategoryXFormDialog.salesTeamChoices[i].label == instance.category_list_cache[0][ZaCRMadmin.A_sales_team_id]) obj[ZaCRMadmin.A_sales_team_id] = ZaEditCategoryXFormDialog.salesTeamChoices[i].value;
        }
        obj[ZaCRMadmin.A_categoryStatus] = instance.category_list_cache[0][ZaCRMadmin.A_categoryStatus];
        formPage.editcategoryDlg.setObject(obj);
        formPage.editcategoryDlg.popup();
    }
}

ZaCRMCategoryModel.updatecategory = function () {
    var json = "jsonobj={\"action\":\"COUNT\",\"object\":\"category\"}";
    var reqHeader = {
        "Content-Type": "application/x-www-form-urlencoded"
    };
    var reqJson = AjxStringUtil.urlEncode(json);
    var response = AjxRpc.invoke(reqJson, biz_vnc_crm_admin.jspUrl, reqHeader, null, false);
    if (this.parent.editcategoryDlg) {

        this.parent.editcategoryDlg.popdown();
        var obj = this.parent.editcategoryDlg.getObject();
        var instance = this.getInstance();
        obj[ZaCRMadmin.A_categoryWriteby] = ZaZimbraAdmin.currentUserName;
        if (obj[ZaCRMadmin.A_categoryStatus] == true && response.text == 2){
            ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format(biz_vnc_crm_admin.usageLimitMessage));
            return;
        }

        var j = JSON.stringify({
            action: "UPDATE",
            object: "category",
            categoryId: obj[ZaCRMadmin.A_categoryId],
            categoryName: obj[ZaCRMadmin.A_categoryName],
            sectionId: obj[ZaCRMadmin.A_sales_team_id],
            status: obj[ZaCRMadmin.A_categoryStatus],
            writeBy: obj[ZaCRMadmin.A_categoryWriteby]
        });
        var json = "jsonobj=" + j;
        var reqHeader = {
            "Content-Type": "application/x-www-form-urlencoded"
        };
        var reqJson = AjxStringUtil.urlEncode(json);
        var response = AjxRpc.invoke(reqJson, biz_vnc_crm_admin.jspUrl, reqHeader, null, false);

        ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format(biz_vnc_crm_admin.MSG_Edit + " : " + obj[ZaCRMadmin.A_categoryName]));
        instance[ZaCRMadmin.A_category] = ZaCRMCategoryModel.display();
        this.parent.setDirty(true);
        this.refresh();
    }
}

ZaCRMCategoryModel.addPerson = function () {
    if (this.parent.addcategoryDlg) {
        var obj = this.parent.addcategoryDlg.getObject();
        var instance = this.getInstance();
        instance = this.getInstance();
        var flag = 0;
        var len = this.getInstance()[ZaCRMadmin.A_category].length;
        for (var i = 0; i < len; i++) {
            if ((obj[ZaCRMadmin.A_categoryName] == this.getInstance()[ZaCRMadmin.A_category][i][ZaCRMadmin.A_categoryName])) {
                flag = 1;
            }
        }
        if (flag == 0) {
            this.parent.addcategoryDlg.popdown();
            var j = JSON.stringify({
                action: "ADD",
                object: "category",
                categoryId: obj[ZaCRMadmin.A_categoryId],
                categoryName: obj[ZaCRMadmin.A_categoryName],
                sectionId: obj[ZaCRMadmin.A_sales_team_id],
                status: obj[ZaCRMadmin.A_categoryStatus],
                createBy: obj[ZaCRMadmin.A_categoryCreatedby],
                writeBy: obj[ZaCRMadmin.A_categoryWriteby]
            });
            var json = "jsonobj=" + j;
            var reqHeader = {
                "Content-Type": "application/x-www-form-urlencoded"
            };
            var reqJson = AjxStringUtil.urlEncode(json);
            var response = AjxRpc.invoke(reqJson, biz_vnc_crm_admin.jspUrl, reqHeader, null, false);
            ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format(biz_vnc_crm_admin.MSG_Add + " : " + obj[ZaCRMadmin.A_categoryName]));
        } else {
            ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format("Category already exists" + " : " + obj[ZaCRMadmin.A_categoryName]));
        }
        instance[ZaCRMadmin.A_category] = ZaCRMCategoryModel.display();
        this.parent.setDirty(true);
        this.refresh();
    }

}

ZaCRMCategoryModel.addButtonListener = function () {
    var json = "jsonobj={\"action\":\"COUNT\",\"object\":\"category\"}";
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
    if (!formPage.addcategoryDlg) {
        formPage.addcategoryDlg = new ZaEditCategoryXFormDialog(ZaApp.getInstance().getAppCtxt().getShell(), ZaApp.getInstance(), "350px", "100px", "Add new category");
        formPage.addcategoryDlg.registerCallback(DwtDialog.OK_BUTTON, ZaCRMCategoryModel.addPerson, this.getForm(), null);
    }

    var obj = {};

    obj[ZaCRMadmin.A_categoryId] = 0;
    obj[ZaCRMadmin.A_categoryName] = "";
    obj[ZaCRMadmin.A_categoryStatus] = true;
    obj[ZaCRMadmin.A_sales_team_id] = "Select Section";
    obj[ZaCRMadmin.A_categoryCreatedby] = ZaZimbraAdmin.currentUserName;
    obj[ZaCRMadmin.A_categoryWriteby] = ZaZimbraAdmin.currentUserName;

    obj.current = false;

    formPage.addcategoryDlg.setObject(obj);
    formPage.addcategoryDlg.popup();
}
