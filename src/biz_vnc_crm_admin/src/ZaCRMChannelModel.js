function ZaCRMChannelModel(parent) {
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
    var json, reqHeader, reqJson, response;
    json = "jsonobj={\"action\":\"LIST\",\"object\":\"channel\"}";
    reqHeader = {
        "Content-Type": "application/x-www-form-urlencoded"
    };
    reqJson = AjxStringUtil.urlEncode(json);
    response = AjxRpc.invoke(reqJson, biz_vnc_crm_admin.jspUrl, reqHeader, null, false);
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
    var json = "jsonobj={\"action\":\"DELETEBYID\",\"object\":\"channel\",\"array\":\"" + idArray + "\",\"writeBy\":\"" + name + "\"}";
    var reqHeader = {
        "Content-Type": "application/x-www-form-urlencoded"
    };
    var reqJson = AjxStringUtil.urlEncode(json);
    var response = AjxRpc.invoke(reqJson, biz_vnc_crm_admin.jspUrl, reqHeader, null, false);
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
            formPage.editchannelDlg = new ZaEditChannelXFormDialog(ZaApp.getInstance().getAppCtxt().getShell(), ZaApp.getInstance(), "350px", "100px", "Edit channel");
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

    if (this.parent.editchannelDlg) {
        this.parent.editchannelDlg.popdown();
        var obj = this.parent.editchannelDlg.getObject();
        var instance = this.getInstance();

        obj[ZaCRMadmin.A_channelWriteby] = ZaZimbraAdmin.currentUserName;
        var j = JSON.stringify({
            action: "UPDATE",
            object: "channel",
            channelId: obj[ZaCRMadmin.A_channelId],
            channelName: obj[ZaCRMadmin.A_channelName],
            status: obj[ZaCRMadmin.A_channelStatus],
            writeBy: obj[ZaCRMadmin.A_channelWriteby]
        });
        var json = "jsonobj=" + j;
        var reqHeader = {
            "Content-Type": "application/x-www-form-urlencoded"
        };
        var reqJson = AjxStringUtil.urlEncode(json);
        var response = AjxRpc.invoke(reqJson, biz_vnc_crm_admin.jspUrl, reqHeader, null, false);
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
            var j = JSON.stringify({
                action: "ADD",
                object: "channel",
                channelId: obj[ZaCRMadmin.A_channelId],
                channelName: obj[ZaCRMadmin.A_channelName],
                status: obj[ZaCRMadmin.A_channelStatus],
                createBy: obj[ZaCRMadmin.A_channelCreatedby],
                writeBy: obj[ZaCRMadmin.A_channelWriteby]
            });
            var json = "jsonobj=" + j;
            var reqHeader = {
                "Content-Type": "application/x-www-form-urlencoded"
            };
            var reqJson = AjxStringUtil.urlEncode(json);
            var response = AjxRpc.invoke(reqJson, biz_vnc_crm_admin.jspUrl, reqHeader, null, false);
            ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format(biz_vnc_crm_admin.MSG_Add + " : " + obj[ZaCRMadmin.A_channelName]));
        } else {
            ZaApp.getInstance().getCurrentController().popupMsgDialog(AjxMessageFormat.format("Channel already exists" + " : " + obj[ZaCRMadmin.A_channelName]));
        }

        instance[ZaCRMadmin.A_channel] = ZaCRMChannelModel.display();
        this.parent.setDirty(true);
        this.refresh();
    }
}

ZaCRMChannelModel.addButtonListener = function () {
    var formPage = this.getForm().parent;
    if (!formPage.addchannelDlg) {
        formPage.addchannelDlg = new ZaEditChannelXFormDialog(ZaApp.getInstance().getAppCtxt().getShell(), ZaApp.getInstance(), "350px", "100px", "Add new channel");
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