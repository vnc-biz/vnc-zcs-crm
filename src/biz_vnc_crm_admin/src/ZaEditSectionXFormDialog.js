function ZaEditSectionXFormDialog(parent, app, w, h, title) {
    if (arguments.length == 0) return;
    this._standardButtons = [DwtDialog.OK_BUTTON, DwtDialog.CANCEL_BUTTON];
    ZaXDialog.call(this, parent, app, title, w, h, "ZaEditSectionXFormDialog");
    this._containedObject = {
        attrs: {}
    };
    this.initForm(ZaCRMadmin.sectionList, this.getMyXForm());
}

ZaEditSectionXFormDialog.prototype = new ZaXDialog;
ZaEditSectionXFormDialog.prototype.constructor = ZaEditSectionXFormDialog;

ZaEditSectionXFormDialog.prototype.getMyXForm = function () {

    var json, reqHeader, reqJson, response;

    json = "jsonobj={\"action\":\"USER\",\"object\":\"section\"}";
    reqHeader = {
        "Content-Type": "application/x-www-form-urlencoded"
    };
    reqJson = AjxStringUtil.urlEncode(json);
    response = AjxRpc.invoke(reqJson, biz_vnc_crm_admin.jspUrl, reqHeader, null, false);
    ZaEditSectionXFormDialog.humtum = [];
    var chkListJson = eval(response.text);



    ZaEditSectionXFormDialog.userChoices = chkListJson;
    var xFormObject = {
        numCols: 1,
        items: [{
            type: _ZAWIZGROUP_,
            items: [
            {
                ref: ZaCRMadmin.A_sectionName,
                type: _TEXTFIELD_,
                label: biz_vnc_crm_admin.HDR_name + ":",
                labelLocation: _LEFT_,
                width: 250,
            }, {
                ref: ZaCRMadmin.A_sectionCode,
                type: _TEXTFIELD_,
                label: biz_vnc_crm_admin.HDR_code + ":",
                labelLocation: _LEFT_,
                width: 250
            }, {
                type: _SPACER_,
                height: "5"
            }, {
                ref: ZaCRMadmin.A_sectionManagerId,
                type: _OSELECT1_,
                msgName: "sections",
                label: biz_vnc_crm_admin.HDR_sectionManagerId + ":",
                labelLocation: _LEFT_,
                choices: ZaEditSectionXFormDialog.userChoices,
                width: "250px",
                onChange: ZaTabView.onFormFieldChanged
            }, {
                type: _SPACER_,
                height: "5"
            }, {
                ref: ZaCRMadmin.A_sectionLeaderId,
                type: _OSELECT1_,
                msgName: "sections",
                label: biz_vnc_crm_admin.HDR_sectionLeaderId + ":",
                labelLocation: _LEFT_,
                choices: ZaEditSectionXFormDialog.userChoices,
                width: "250px",
                onChange: ZaTabView.onFormFieldChanged
            }, {
                type: _SPACER_,
                height: "5"
            }, {
                ref: ZaCRMadmin.A_sectionWatcherId,
                type: _OSELECT1_,
                msgName: "sections",
                label: biz_vnc_crm_admin.HDR_sectionWatcherId + ":",
                labelLocation: _LEFT_,
                choices: ZaEditSectionXFormDialog.userChoices,
                width: "250px",
                onChange: ZaTabView.onFormFieldChanged
            }, {
                type: _SPACER_,
                height: "5"
            }, {
                type: _SPACER_,
                height: "5"
            }, {
                ref: ZaCRMadmin.A_sectionStatus,
                type: _ZA_CHECKBOX_,
                label: biz_vnc_crm_admin.HDR_status,
                trueValue: true,
                falseValue: false,
                visibilityChecks: [],
                enableDisableChecks: []
            },

            /*-------------list start ------------------*/ 
            {
                type: _GROUP_,
                width: "98%",
                numCols: 1,
                items: [{
                    type: _SPACER_,
                    height: "10"
                }, {
                    type: _ZACENTER_GROUPER_,
                    numCols: 1,
                    width: "100%",
                    label: "Selected users list",
                    items: [{
                        ref: ZaCRMadmin.A_sectionSalesTeamIds,
                        type: _DWT_LIST_,
                        height: "200",
                        width: "98%",
                        forceUpdate: true,
                        preserveSelection: false,
                        multiselect: true,
                        cssClass: "DLTarget",
                        cssStyle: "margin-left: 5px; ",
                        onSelection: ZaEditSectionXFormDialog.blockedExtSelectionListener,
                        onChange: ZaCRMxFormView.currentFieldChanged,
                        valueChangeEventSources: [ZaCRMadmin.A_sectionSalesTeamIds]
                    }, {
                        type: _SPACER_,
                        height: "5"
                    }, {
                        type: _GROUP_,
                        width: "100%",
                        numCols: 4,
                        colSizes: [125, 10, 125, "*"],
                        items: [{
                            type: _DWT_BUTTON_,
                            label: ZaMsg.DLXV_ButtonRemoveAll,
                            width: 120,
                            onActivate: "ZaEditSectionXFormDialog.removeAllExt.call(this)",
                            enableDisableChecks: [ZaEditSectionXFormDialog.shouldEnableRemoveAllButton],
                            enableDisableChangeEventSources: [ZaCRMadmin.A_sectionSalesTeamIds],
                            relevant: "ZaEditSectionXFormDialog.shouldEnableRemoveAllButton.call(this)",
                            relevantBehavior: _DISABLE_
                        }, {
                            type: _CELLSPACER_
                        }, {
                            type: _DWT_BUTTON_,
                            label: ZaMsg.DLXV_ButtonRemove,
                            width: 120,
                            onActivate: "ZaEditSectionXFormDialog.removeExt.call(this)",
                            enableDisableChecks: [ZaEditSectionXFormDialog.shouldEnableRemoveButton],
                            enableDisableChangeEventSources: [ZaCRMadmin.A_selected_user_selection, ZaCRMadmin.A_sectionSalesTeamIds],	
                            relevant: "ZaEditSectionXFormDialog.shouldEnableRemoveButton.call(this)",
                            relevantBehavior: _DISABLE_
                        }, {
                            type: _CELLSPACER_
                        }]
                    }]
                }]
            }, {
                type: _GROUP_,
                width: "98%",
                numCols: 1,
                items: [{
                    type: _SPACER_,
                    height: "10"
                }, {
                    type: _ZACENTER_GROUPER_,
                    numCols: 1,
                    width: "100%",
                    label: "Common users list",
                    items: [{
                        ref: ZaCRMadmin.A_sectionCommonSalesTeamIds,
                        type: _DWT_LIST_,
                        height: "200",
                        width: "98%",
                        forceUpdate: true,
                        preserveSelection: false,
                        multiselect: true,
                        cssClass: "DLSource",
                        onSelection: ZaEditSectionXFormDialog.commonExtSelectionListener,
                        onChange: ZaCRMxFormView.currentFieldChanged,
                        valueChangeEventSources: [ZaCRMadmin.A_sectionCommonSalesTeamIds]
                    }, {
                        type: _SPACER_,
                        height: "5"
                    }, {
                        type: _GROUP_,
                        width: "98%",
                        numCols: 7,
                        colSizes: [95, 10, 70, 10, 90, 60, 70],
                        items: [{
                            type: _DWT_BUTTON_,
                            label: ZaMsg.DLXV_ButtonAddSelected,
                            width: 95,
                            onActivate: "ZaEditSectionXFormDialog.addCommonExt.call(this)",
                            enableDisableChecks: [ZaEditSectionXFormDialog.shouldEnableAddButton],//A_sectionSalesTeamIds
                            enableDisableChangeEventSources: [ZaCRMadmin.A_common_user_selection, ZaCRMadmin.A_sectionSalesTeamIds],
                            relevant: "ZaEditSectionXFormDialog.shouldEnableAddButton.call(this)",
                            relevantBehavior: _DISABLE_
                        }, {
                            type: _CELLSPACER_
                        }, {
                            type: _DWT_BUTTON_,
                            label: ZaMsg.DLXV_ButtonAddAll,
                            width: 70,
                            onActivate: "ZaEditSectionXFormDialog.addAllCommonExt.call(this)",
                            enableDisableChecks: [ZaEditSectionXFormDialog.shouldEnableAddAllButton],
                            enableDisableChangeEventSources: [ZaCRMadmin.A_sectionCommonSalesTeamIds, ZaCRMadmin.A_sectionSalesTeamIds]
                        }

                        ]
                    }]
                }]
            }
            /*-------------list end ------------------*/
            ]
        }]
    };
    return xFormObject;
}


ZaEditSectionXFormDialog.blockedExtSelectionListener = function () {
    var arr = this.widget.getSelection();
    if (arr && arr.length) {
        arr.sort();
        this.getModel().setInstanceValue(this.getInstance(), ZaCRMadmin.A_selected_user_selection, arr);
    } else {
        this.getModel().setInstanceValue(this.getInstance(), ZaCRMadmin.A_selected_user_selection, null);
    }
}
ZaEditSectionXFormDialog.removeAllExt = function () {
    this.setInstanceValue([], ZaCRMadmin.A_sectionSalesTeamIds);
    this.setInstanceValue([], ZaCRMadmin.A_selected_user_selection);
    this.getForm().parent.setDirty(true);
}
ZaEditSectionXFormDialog.shouldEnableRemoveAllButton = function () {
    return (!AjxUtil.isEmpty(this.getInstanceValue(ZaCRMadmin.A_sectionSalesTeamIds)));
}

ZaEditSectionXFormDialog.shouldEnableRemoveButton = function () {
    return (!AjxUtil.isEmpty(this.getInstanceValue(ZaCRMadmin.A_selected_user_selection)));
}

ZaEditSectionXFormDialog.shouldEnableAddButton = function () {
    return (!AjxUtil.isEmpty(this.getInstanceValue(ZaCRMadmin.A_common_user_selection)));
}

ZaEditSectionXFormDialog.shouldEnableAddAllButton = function () {
    return (!AjxUtil.isEmpty(this.getInstanceValue(ZaCRMadmin.A_sectionCommonSalesTeamIds)));
}
ZaEditSectionXFormDialog.removeExt = function () {
    var blockedExtArray = this.getInstanceValue(ZaCRMadmin.A_sectionSalesTeamIds);
    var selectedExtArray = this.getInstanceValue(ZaCRMadmin.A_selected_user_selection);
    var newBlockedExtArray = AjxUtil.arraySubstract(blockedExtArray, selectedExtArray);
    this.setInstanceValue(newBlockedExtArray, ZaCRMadmin.A_sectionSalesTeamIds);
    this.getForm().parent.setDirty(true);
}

ZaEditSectionXFormDialog.commonExtSelectionListener = function () {
    var arr = this.widget.getSelection();
    if (arr && arr.length) {
        arr.sort();
        this.getModel().setInstanceValue(this.getInstance(), ZaCRMadmin.A_common_user_selection, arr);
    } else {
        this.getModel().setInstanceValue(this.getInstance(), ZaCRMadmin.A_common_user_selection, null);
    }
}
ZaEditSectionXFormDialog.addCommonExt = function () {
    var commonExtArr = this.getInstanceValue(ZaCRMadmin.A_sectionSalesTeamIds);
    var newExtArr = this.getInstanceValue(ZaCRMadmin.A_common_user_selection);
    commonExtArr = AjxUtil.isEmpty(commonExtArr) ? [] : commonExtArr;
    newExtArr = AjxUtil.isEmpty(newExtArr) ? [] : newExtArr;
    this.setInstanceValue(AjxUtil.mergeArrays(commonExtArr, newExtArr), ZaCRMadmin.A_sectionSalesTeamIds);
    this.getForm().parent.setDirty(true);
}
ZaEditSectionXFormDialog.addAllCommonExt = function () {
    var commonExtArr = this.getInstanceValue(ZaCRMadmin.A_sectionSalesTeamIds);
    var newExtArr = this.getInstanceValue(ZaCRMadmin.A_sectionCommonSalesTeamIds);
    commonExtArr = AjxUtil.isEmpty(commonExtArr) ? [] : commonExtArr;
    newExtArr = AjxUtil.isEmpty(newExtArr) ? [] : newExtArr;
    this.setInstanceValue(AjxUtil.mergeArrays(commonExtArr, newExtArr), ZaCRMadmin.A_sectionSalesTeamIds);
    this.getForm().parent.setDirty(true);
}