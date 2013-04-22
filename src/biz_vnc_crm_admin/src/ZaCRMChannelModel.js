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

var ZaCRMChannelModel = function(parent) {
    ZaTabView.call(this, {
        parent: parent,
        iKeyName: "ZaCRMChannelModel",
        contextId: "_CRM_Admin_"
    });
    this.initForm(ZaCRMadmin.myXModel, this.getMyXForm());
    this._localXForm.setController(ZaApp.getInstance());
}

ZaCRMChannelModel.prototype = new ZaTabView;

ZaCRMChannelModel.prototype.constructor = ZaCRMChannelModel;

ZaCRMChannelModel.prototype.toString = function () {
    return "ZaCRMadminListView";
}

ZaCRMChannelModel.isEditChannelEnabled = function () {
    return (!AjxUtil.isEmpty(this.getInstanceValue(ZaCRMadmin.A_channel_list_cache)) && this.getInstanceValue(ZaCRMadmin.A_channel_list_cache).length == 1);
}
ZaCRMChannelModel.isDeleteChannelEnabled = function () {
    return (!AjxUtil.isEmpty(this.getInstanceValue(ZaCRMadmin.A_channel_list_cache)));
}

ZaCRMChannelModel.display = function () {
    var json, response;
    json = JSON.stringify({
        action: "LIST",
        object: "channel"
    });
    response = biz_vnc_crm_admin.rpc(json);
    return (jsonParse(response.text));
}

ZaCRMChannelModel.channelSelectionListener = function (ev) {
    var instance = this.getInstance();
    var arr = this.widget.getSelection();
    if (arr && arr.length) {
        this.getModel().setInstanceValue(this.getInstance(), ZaCRMadmin.A_channel_list_cache, arr);

    } else {
        this.getModel().setInstanceValue(this.getInstance(), ZaCRMadmin.A_channel_list_cache, null);
    }

    if (ev.detail == DwtListView.ITEM_DBL_CLICKED) {
        ZaCRMChannelModel.editButtonListener.call(this);
    }
}

ZaCRMChannelModel.deleteButtonListener = function () {
    var instance = this.getInstance();
    var path = ZaCRMadmin.A_channel;
    var idArray = new Array();

    if (!this.getInstance()[ZaCRMadmin.A_channelRemoved]) {
        this.getInstance()[ZaCRMadmin.A_channelRemoved] = new Array();
    }

    if (instance.channel_list_cache != null) {
        var cnt = instance.channel_list_cache.length;

        if (cnt && instance[ZaCRMadmin.A_channel] && instance[ZaCRMadmin.A_channel]) {
            for (var i = 0; i < cnt; i++) {
                var cnt2 = instance[ZaCRMadmin.A_channel].length - 1;
                for (var k = cnt2; k >= 0; k--) {
                    if (instance[ZaCRMadmin.A_channel][k][ZaCRMadmin.A_channelName] == instance.channel_list_cache[i][ZaCRMadmin.A_channelName]) {
                        idArray[i] = instance.channel_list_cache[i][ZaCRMadmin.A_channelId];
                        break;

                    }
                }
            }

        }
    }

    ZaApp.getInstance().dialogs["confirmMessageDialog"] = new ZaMsgDialog(ZaApp.getInstance().getAppCtxt().getShell(), null, [DwtDialog.YES_BUTTON, DwtDialog.NO_BUTTON], null, ZaId.VIEW_STATUS + "_confirmMessage");
    ZaApp.getInstance().dialogs["confirmMessageDialog"].setMessage(AjxMessageFormat.format(biz_vnc_crm_admin.MSG_Delete), DwtMessageDialog.INFO_STYLE);
    ZaApp.getInstance().dialogs["confirmMessageDialog"].registerCallback(DwtDialog.YES_BUTTON, ZaCRMChannelModel.prototype.doDelete, this, [idArray]);
    ZaApp.getInstance().dialogs["confirmMessageDialog"].popup();
}

ZaCRMChannelModel.prototype.doDelete = function (idArray) {
    var instance = this.getInstance();
    var name = ZaZimbraAdmin.currentUserName;
    var json = JSON.stringify({
        action: "DELETEBYID",
        object: "channel",
        array: idArray.toString(),
        writeBy: name
    });
    var response = biz_vnc_crm_admin.rpc(json);
    instance[ZaCRMadmin.A_channel] = ZaCRMChannelModel.display();

    ZaApp.getInstance().dialogs["confirmMessageDialog"].popdown();
    this.getForm().parent.setDirty(true);
    this.getForm().refresh();
}

ZaCRMChannelModel.closeButtonListener = function () {
    this.parent.editchannelDlg.popdown();
    this.getInstance()[ZaCRMadmin.A_channel_list_cache] = new Array();
    this.parent.setDirty(false);
    DBG.println(AjxDebug.DBG3, "Cancel button Listener");
    this.refresh();

}

ZaCRMChannelModel.editButtonListener = function () {
    var instance = this.getInstance();

    if (instance.channel_list_cache && instance.channel_list_cache[0]) {
        var formPage = this.getForm().parent;
        if (!formPage.editchannelDlg) {
            formPage.editchannelDlg = new ZaEditChannelXFormDialog(ZaApp.getInstance().getAppCtxt().getShell(), ZaApp.getInstance(), "350px", "100px", biz_vnc_crm_admin.HDR_edit_channel);
            formPage.editchannelDlg.registerCallback(DwtDialog.OK_BUTTON, ZaCRMChannelModel.updatechannel, this.getForm(), null);
            formPage.editchannelDlg.registerCallback(DwtDialog.CANCEL_BUTTON, ZaCRMChannelModel.closeButtonListener, this.getForm(), null);
        }
        var obj = {};
        obj[ZaCRMadmin.A_channelId] = instance.channel_list_cache[0][ZaCRMadmin.A_channelId];
        obj[ZaCRMadmin.A_channelName] = instance.channel_list_cache[0][ZaCRMadmin.A_channelName];
        obj[ZaCRMadmin.A_channelStatus] = instance.channel_list_cache[0][ZaCRMadmin.A_channelStatus];

        instance[ZaCRMadmin.A_channel_list_cache] = new Array();
        formPage.editchannelDlg.setObject(obj);
        formPage.editchannelDlg.popup();
    }
}

ZaCRMChannelModel.updatechannel = function () {
    var json = JSON.stringify({
        action: "COUNT",
        object: "channel"
    });
    var response = biz_vnc_crm_admin.rpc(json);
    if (this.parent.editchannelDlg) {
        this.parent.editchannelDlg.popdown();
        var obj = this.parent.editchannelDlg.getObject();
        var instance = this.getInstance();

        obj[ZaCRMadmin.A_channelWriteby] = ZaZimbraAdmin.currentUserName;
        if (obj[ZaCRMadmin.A_channelStatus] == true && response.text == 2){
            ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format(biz_vnc_crm_admin.usageLimitMessage));
            return;
        }

        var json = JSON.stringify({
            action: "UPDATE",
            object: "channel",
            channelId: obj[ZaCRMadmin.A_channelId],
            channelName: obj[ZaCRMadmin.A_channelName],
            status: obj[ZaCRMadmin.A_channelStatus],
            writeBy: obj[ZaCRMadmin.A_channelWriteby]
        });
        var response = biz_vnc_crm_admin.rpc(json);
        ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format(biz_vnc_crm_admin.MSG_Edit + " : " + obj[ZaCRMadmin.A_channelName]));

        instance[ZaCRMadmin.A_channel] = ZaCRMChannelModel.display();
        this.parent.setDirty(true);
        this.refresh();
    }

}

ZaCRMChannelModel.addPerson = function () {
    if (this.parent.addchannelDlg) {
        var obj = this.parent.addchannelDlg.getObject();
        var instance = this.getInstance();
        instance = this.getInstance();
        var flag = 0;
        var len = this.getInstance()[ZaCRMadmin.A_channel].length;
        for (var i = 0; i < len; i++) {
            if (obj[ZaCRMadmin.A_channelName] == this.getInstance()[ZaCRMadmin.A_channel][i][ZaCRMadmin.A_channelName]) {
                flag = 1;
            }
        }
        if (flag == 0) {
            this.parent.addchannelDlg.popdown();
            var json = JSON.stringify({
                action: "ADD",
                object: "channel",
                channelId: obj[ZaCRMadmin.A_channelId],
                channelName: obj[ZaCRMadmin.A_channelName],
                status: obj[ZaCRMadmin.A_channelStatus],
                createBy: obj[ZaCRMadmin.A_channelCreatedby],
                writeBy: obj[ZaCRMadmin.A_channelWriteby]
            });
            var response = biz_vnc_crm_admin.rpc(json);
            ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format(biz_vnc_crm_admin.MSG_Add + " : " + obj[ZaCRMadmin.A_channelName]));
        } else {
            ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format(biz_vnc_crm_admin.MSG_dup_channel + " : " + obj[ZaCRMadmin.A_channelName]));
        }

        instance[ZaCRMadmin.A_channel] = ZaCRMChannelModel.display();
        this.parent.setDirty(true);
        this.refresh();
    }
}

ZaCRMChannelModel.addButtonListener = function () {
    var json = JSON.stringify({
        action: "COUNT",
        object: "channel"
    });
    var response = biz_vnc_crm_admin.rpc(json);

    if (response.text == 2){
        ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format(biz_vnc_crm_admin.usageLimitMessage));
        return;
    }

    var formPage = this.getForm().parent;
    if (!formPage.addchannelDlg) {
        formPage.addchannelDlg = new ZaEditChannelXFormDialog(ZaApp.getInstance().getAppCtxt().getShell(), ZaApp.getInstance(), "350px", "100px", biz_vnc_crm_admin.HDR_add_channel);
        formPage.addchannelDlg.registerCallback(DwtDialog.OK_BUTTON, ZaCRMChannelModel.addPerson, this.getForm(), null);
    }

    var obj = {};
    obj[ZaCRMadmin.A_channelId] = 0;
    obj[ZaCRMadmin.A_channelName] = "";
    obj[ZaCRMadmin.A_channelStatus] = true;
    obj[ZaCRMadmin.A_channelCreatedby] = ZaZimbraAdmin.currentUserName;
    obj[ZaCRMadmin.A_channelWriteby] = ZaZimbraAdmin.currentUserName;
    obj.current = false;

    formPage.addchannelDlg.setObject(obj);
    formPage.addchannelDlg.popup();
}
