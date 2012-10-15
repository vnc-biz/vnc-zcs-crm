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

function ZaCRMxFormView(parent) {
    ZaTabView.call(this, {
        parent: parent,
        iKeyName: "ZaCRMxFormView",
        contextId: "_CRM_Admin_"
    });
    this.initForm(ZaCRMadmin.myXModel, this.getMyXForm());
    this._localXForm.setController(ZaApp.getInstance());
}

ZaCRMxFormView.prototype = new ZaTabView;
ZaCRMxFormView.prototype.constructor = ZaCRMxFormView;

ZaCRMxFormView.prototype.toString = function () {
    return "ZaCRMadminListView";
}

ZaCRMxFormView.prototype.getTitle = function () {
    return biz_vnc_crm_admin.CRM_view_title
}

ZaCRMxFormView.prototype.getTabIcon = function () {
    return "Zimlet";
}

ZaCRMxFormView.prototype.getTabTitle = function () {
    return biz_vnc_crm_admin.CRM_tab_title
}

ZaTabView.XFormModifiers["ZaCRMxFormView"] = new Array();

ZaCRMxFormView.prototype.TAB_INDEX = 0;
ZaCRMxFormView.prototype.lastid = 0;
ZaCRMxFormView.prototype.setObject = function (entry) {
    this.entry = entry;

    this._containedObject = {
        attrs: {}
    };

    this._containedObject.name = entry.name;
    this._containedObject.type = entry.type;

    var json, reqHeader, reqJson, response;

    if (entry.id) {
        this._containedObject.id = entry.id;
    }

    json = "jsonobj={\"action\":\"LIST\",\"object\":\"company\"}";
    reqHeader = {
        "Content-Type": "application/x-www-form-urlencoded"
    };
    reqJson = AjxStringUtil.urlEncode(json);
    response = AjxRpc.invoke(reqJson, biz_vnc_crm_admin.jspUrl, reqHeader, null, false);
    this._containedObject[ZaCRMadmin.A_company] = jsonParse(response.text);

    json = "jsonobj={\"action\":\"LIST\",\"object\":\"country\"}";
    reqJson = AjxStringUtil.urlEncode(json);
    response = AjxRpc.invoke(reqJson, biz_vnc_crm_admin.jspUrl, reqHeader, null, false);
    this._containedObject[ZaCRMadmin.A_country] = jsonParse(response.text);

    json = "jsonobj={\"action\":\"LIST\",\"object\":\"state\"}";
    reqJson = AjxStringUtil.urlEncode(json);
    response = AjxRpc.invoke(reqJson, biz_vnc_crm_admin.jspUrl, reqHeader, null, false);
    this._containedObject[ZaCRMadmin.A_state] = jsonParse(response.text);

    json = "jsonobj={\"action\":\"LIST\",\"object\":\"channel\"}";
    reqJson = AjxStringUtil.urlEncode(json);
    response = AjxRpc.invoke(reqJson, biz_vnc_crm_admin.jspUrl, reqHeader, null, false);
    this._containedObject[ZaCRMadmin.A_channel] = jsonParse(response.text);

    json = "jsonobj={\"action\":\"LIST\",\"object\":\"priority\"}";
    reqJson = AjxStringUtil.urlEncode(json);
    response = AjxRpc.invoke(reqJson, biz_vnc_crm_admin.jspUrl, reqHeader, null, false);
    this._containedObject[ZaCRMadmin.A_priority] = jsonParse(response.text);

    json = "jsonobj={\"action\":\"LIST\",\"object\":\"category\"}";
    reqJson = AjxStringUtil.urlEncode(json);
    response = AjxRpc.invoke(reqJson, biz_vnc_crm_admin.jspUrl, reqHeader, null, false);
    this._containedObject[ZaCRMadmin.A_category] = jsonParse(response.text);

    json = "jsonobj={\"action\":\"LIST\",\"object\":\"section\"}";
    reqJson = AjxStringUtil.urlEncode(json);
    response = AjxRpc.invoke(reqJson, biz_vnc_crm_admin.jspUrl, reqHeader, null, false);
    this._containedObject[ZaCRMadmin.A_section] = jsonParse(response.text);

    json = "jsonobj={\"action\":\"LIST\",\"object\":\"stage\"}";
    reqJson = AjxStringUtil.urlEncode(json);
    response = AjxRpc.invoke(reqJson, biz_vnc_crm_admin.jspUrl, reqHeader, null, false);
    this._containedObject[ZaCRMadmin.A_stage] = jsonParse(response.text);

    json = "jsonobj={\"action\":\"LIST\",\"object\":\"leadClass\"}";
    reqJson = AjxStringUtil.urlEncode(json);
    response = AjxRpc.invoke(reqJson, biz_vnc_crm_admin.jspUrl, reqHeader, null, false);
    this._containedObject[ZaCRMadmin.A_leadClass] = jsonParse(response.text);

    if (entry.attrs) {
        for (var a in entry.attrs) {
            var modelItem = this._localXForm.getModel().getItem(a);
            if ((modelItem != null && modelItem.type == _LIST_) || (entry.attrs[a] != null && entry.attrs[a] instanceof Array)) {
                this._containedObject.attrs[a] = ZaItem.deepCloneListItem(entry.attrs[a]);
            } else {
                this._containedObject.attrs[a] = entry.attrs[a];
            }
        }
    }
    if (!entry[ZaModel.currentTab]) {
        this._containedObject[ZaModel.currentTab] = "1";
    } else {
        this._containedObject[ZaModel.currentTab] = entry[ZaModel.currentTab];
    }
    this._localXForm.setInstance(this._containedObject);
    this.formDirtyLsnr = new AjxListener(ZaApp.getInstance().getCurrentController(), ZaXFormViewController.prototype.handleXFormChange);
    this._localXForm.addListener(DwtEvent.XFORMS_FORM_DIRTY_CHANGE, this.formDirtyLsnr);
    this._localXForm.addListener(DwtEvent.XFORMS_VALUE_ERROR, this.formDirtyLsnr);
    this.updateTab();
}

ZaCRMxFormView.currentFieldChanged = function (value, event, form) {
    ZaCRMxFormView.onFormFieldChanged.call(this, value, event, form);
}

ZaCRMxFormView.onFormFieldChanged = function (value, event, form) {
    form.parent.setDirty(true);
    this.setInstanceValue(value);
    return value;
}

ZaCRMxFormView.myXFormModifier = function (xFormObject) {
    xFormObject.tableCssStyle = "width:100%;";
    var tabChoices = new Array();
    var _tab1 = 1;
    var _tab2 = 2;
    var newTab = ++this.TAB_INDEX;

    xFormObject.items = [{
        type: _TAB_BAR_,
        ref: ZaModel.currentTab,
        id: "crm_admin_xform_tabbar",
        containerCssStyle: "padding-top:0px",
        cssClass: "ZaTabBar",
        choices: [{
            value: 1,
            label: biz_vnc_crm_admin.TBB_company
        }, {
            value: 2,
            label: biz_vnc_crm_admin.TBB_country
        }, {
            value: 3,
            label: biz_vnc_crm_admin.TBB_country_state
        }, {
            value: 4,
            label: biz_vnc_crm_admin.TBB_channel
        }, {
            value: 5,
            label: biz_vnc_crm_admin.TBB_priority
        }, {
            value: 6,
            label: biz_vnc_crm_admin.TBB_category
        }, {
            value: 7,
            label: biz_vnc_crm_admin.TBB_section
        }, {
            value: 8,
            label: biz_vnc_crm_admin.TBB_stage
        }, {
            value: 9,
            label: biz_vnc_crm_admin.TBB_leadClass
        }, {
            value: 10,
            label: biz_vnc_crm_admin.TBB_aboutUs
        }]
    }, {
        type: _SWITCH_,
        id: "tab1",
        items: [{
            type: _ZATABCASE_,
            id: "crm_company",
            ref: ZaModel.currentTab,
            relevant: "instance[ZaModel.currentTab] == 1",
            numCols: 1,
            colSizes: ["800px"],
            caseKey: newTab++,
            items: [{
                type: _ZA_TOP_GROUPER_,
                id: "crm_company_group",
                width: "100%",
                numCols: 1,
                colSizes: ["auto"],
                label: biz_vnc_crm_admin.LBL_company_list,
                // cssStyle apply for country list box
                cssStyle: "margin-top:10px;margin-bottom:10px;padding-bottom:0px;margin-left:10px;margin-right:10px;",
                items: [
                //for main box of header list
                {
                    ref: ZaCRMadmin.A_company,
                    type: _DWT_LIST_,
                    height: "300px",
                    width: "1500",
                    forceUpdate: true,
                    preserveSelection: false,
                    multiselect: true,
                    cssClass: "DLSource",
                    headerList: headerList_cont,
                    widgetClass: ZaCRMadminCompanyListView,
                    onSelection: ZaCRMCompanyModel.companySelectionListener,
                    onChange: ZaCRMxFormView.currentFieldChanged,
                    valueChangeEventSources: [ZaCRMadmin.A_company]
                },
                //That for button
                {
                    type: _GROUP_,
                    numCols: 5,
                    colSizes: ["100px", "auto", "100px", "auto", "100px"],
                    width: "350px",
                    cssStyle: "margin-bottom:10px;padding-bottom:0px;margin-top:10px;margin-left:0px;margin-right:0px;",
                    items: [{
                        type: _DWT_BUTTON_,
                        label: biz_vnc_crm_admin.BTN_Delete,
                        width: "100px",
                        onActivate: "ZaCRMCompanyModel.deleteButtonListener.call(this);",
                        enableDisableChangeEventSources: [ZaCRMadmin.A_company_list_cache],
                        enableDisableChecks: [ZaCRMCompanyModel.isDeleteCompanyEnabled],
                        relevant: "ZaCRMCompanyModel.isDeleteCompanyEnabled.call(this)",
                        relevantBehavior: _DISABLE_
                    }, {
                        type: _CELLSPACER_
                    }, {
                        type: _DWT_BUTTON_,
                        label: biz_vnc_crm_admin.BTN_Edit,
                        width: "100px",
                        onActivate: "ZaCRMCompanyModel.editButtonListener.call(this);",
                        enableDisableChangeEventSources: [ZaCRMadmin.A_company_list_cache],
                        enableDisableChecks: [ZaCRMCompanyModel.isEditCompanyEnabled],
                        relevant: "ZaCRMCompanyModel.isEditCompanyEnabled.call(this)",
                        relevantBehavior: _DISABLE_
                    }, {
                        type: _CELLSPACER_
                    }, {
                        type: _DWT_BUTTON_,
                        label: biz_vnc_crm_admin.BTN_Add,
                        width: "100px",
                        onActivate: "ZaCRMCompanyModel.addButtonListener.call(this);"
                    }]
                }]
            }]
        }, {
            type: _ZATABCASE_,
            id: "crm_country",
            ref: ZaModel.currentTab,
            relevant: "instance[ZaModel.currentTab] == 2",
            numCols: 1,
            colSizes: ["800px"],
            caseKey: newTab++,
            items: [{
                type: _ZA_TOP_GROUPER_,
                id: "crm_country_group",
                width: "100%",
                numCols: 1,
                colSizes: ["auto"],
                label: biz_vnc_crm_admin.LBL_country_list,
                // cssStyle apply for country list box
                cssStyle: "margin-top:10px;margin-bottom:10px;padding-bottom:0px;margin-left:10px;margin-right:10px;",
                items: [
                //for main box of header list
                {
                    ref: ZaCRMadmin.A_country,
                    type: _DWT_LIST_,
                    height: "300px",
                    width: "1300",
                    forceUpdate: true,
                    preserveSelection: false,
                    multiselect: true,
                    cssClass: "DLSource",
                    headerList: headerList_cont,
                    widgetClass: ZaCRMadminCountryListView,
                    onSelection: ZaCRMCountryModel.countrySelectionListener,
                    onChange: ZaCRMxFormView.currentFieldChanged,
                    valueChangeEventSources: [ZaCRMadmin.A_country]
                },
                //That for button
                {
                    type: _GROUP_,
                    numCols: 5,
                    colSizes: ["100px", "auto", "100px", "auto", "100px"],
                    width: "350px",
                    cssStyle: "margin-bottom:10px;padding-bottom:0px;margin-top:10px;margin-left:0px;margin-right:0px;",
                    items: [{
                        type: _DWT_BUTTON_,
                        label: biz_vnc_crm_admin.BTN_Delete,
                        width: "100px",
                        onActivate: "ZaCRMCountryModel.deleteButtonListener.call(this);",
                        enableDisableChangeEventSources: [ZaCRMadmin.A_country_list_cache],
                        enableDisableChecks: [ZaCRMCountryModel.isDeleteCountryEnabled],
                        relevant: "ZaCRMCountryModel.isDeleteCountryEnabled.call(this)",
                        relevantBehavior: _DISABLE_
                    }, {
                        type: _CELLSPACER_
                    }, {
                        type: _DWT_BUTTON_,
                        label: biz_vnc_crm_admin.BTN_Edit,
                        width: "100px",
                        onActivate: "ZaCRMCountryModel.editButtonListener.call(this);",
                        enableDisableChangeEventSources: [ZaCRMadmin.A_country_list_cache],
                        enableDisableChecks: [ZaCRMCountryModel.isEditCountryEnabled],
                        relevant: "ZaCRMCountryModel.isEditCountryEnabled.call(this)",
                        relevantBehavior: _DISABLE_
                    }, {
                        type: _CELLSPACER_
                    }, {
                        type: _DWT_BUTTON_,
                        label: biz_vnc_crm_admin.BTN_Add,
                        width: "100px",
                        onActivate: "ZaCRMCountryModel.addButtonListener.call(this);"
                    }]
                }]
            }]
        }, {
            type: _ZATABCASE_,
            id: "crm_state",
            ref: ZaModel.currentTab,
            relevant: "instance[ZaModel.currentTab] == 3",
            numCols: 1,
            colSizes: ["800px"],
            caseKey: newTab++,
            items: [{
                type: _ZA_TOP_GROUPER_,
                id: "crm_state_group",
                width: "100%",
                numCols: 1,
                colSizes: ["auto"],
                label: biz_vnc_crm_admin.LBL_state_list,
                // cssStyle apply for country list box
                cssStyle: "margin-top:10px;margin-bottom:10px;padding-bottom:0px;margin-left:10px;margin-right:10px;margin-right:50px;",
                items: [
                //for main box of header list
                {
                    ref: ZaCRMadmin.A_state,
                    type: _DWT_LIST_,
                    height: "300px",
                    width: "1350px",
                    forceUpdate: true,
                    preserveSelection: false,
                    multiselect: true,
                    cssClass: "DLSource",
                    headerList: headerList_cont_state,
                    widgetClass: ZaCRMadminCountryStateListView,
                    onSelection: ZaCRMStateModel.stateSelectionListener,
                    onChange: ZaCRMxFormView.currentFieldChanged,
                    valueChangeEventSources: [ZaCRMadmin.A_state]
                },
                //That for button
                {
                    type: _GROUP_,
                    numCols: 5,
                    colSizes: ["100px", "auto", "100px", "auto", "100px"],
                    width: "350px",
                    cssStyle: "margin-bottom:10px;padding-bottom:0px;margin-top:10px;margin-left:0px;margin-right:0px;",
                    items: [{
                        type: _DWT_BUTTON_,
                        label: biz_vnc_crm_admin.BTN_Delete,
                        width: "100px",
                        onActivate: "ZaCRMStateModel.deleteButtonListener_state.call(this);",
                        enableDisableChangeEventSources: [ZaCRMadmin.A_state_list_cache],
                        enableDisableChecks: [ZaCRMStateModel.isDeleteStateEnabled],
                        relevant: "ZaCRMStateModel.isDeleteStateEnabled.call(this)",
                        relevantBehavior: _DISABLE_
                    }, {
                        type: _CELLSPACER_
                    }, {
                        type: _DWT_BUTTON_,
                        label: biz_vnc_crm_admin.BTN_Edit,
                        width: "100px",
                        onActivate: "ZaCRMStateModel.editButtonListener.call(this);",
                        enableDisableChangeEventSources: [ZaCRMadmin.A_state_list_cache],
                        enableDisableChecks: [ZaCRMStateModel.isEditStateEnabled],
                        relevant: "ZaCRMStateModel.isEditStateEnabled.call(this)",
                        relevantBehavior: _DISABLE_
                    }, {
                        type: _CELLSPACER_
                    }, {
                        type: _DWT_BUTTON_,
                        label: biz_vnc_crm_admin.BTN_Add,
                        width: "100px",
                        onActivate: "ZaCRMStateModel.addButtonListener_state.call(this);"
                    }]
                }]
            }]
        }, {
            type: _ZATABCASE_,
            id: "crm_channel",
            ref: ZaModel.currentTab,
            relevant: "instance[ZaModel.currentTab] == 4",
            numCols: 1,
            colSizes: ["800px"],
            caseKey: newTab++,
            items: [{
                type: _ZA_TOP_GROUPER_,
                id: "crm_channel_group",
                width: "100%",
                numCols: 1,
                colSizes: ["auto"],
                label: biz_vnc_crm_admin.LBL_channel_list,
                // cssStyle apply for channel list box
                cssStyle: "margin-top:10px;margin-bottom:10px;padding-bottom:0px;margin-left:10px;margin-right:10px;",
                items: [
                //for main box of header list
                {
                    ref: ZaCRMadmin.A_channel,
                    type: _DWT_LIST_,
                    height: "300px",
                    width: "1200",
                    forceUpdate: true,
                    preserveSelection: false,
                    multiselect: true,
                    cssClass: "DLSource",
                    headerList: headerList_channel,
                    widgetClass: ZaCRMadminChannelListView,
                    onSelection: ZaCRMChannelModel.channelSelectionListener,
                    onChange: ZaCRMxFormView.currentFieldChanged,
                    valueChangeEventSources: [ZaCRMadmin.A_channel]
                },
                //That for button
                {
                    type: _GROUP_,
                    numCols: 5,
                    colSizes: ["100px", "auto", "100px", "auto", "100px"],
                    width: "350px",
                    cssStyle: "margin-bottom:10px;padding-bottom:0px;margin-top:10px;margin-left:0px;margin-right:0px;",
                    items: [{
                        type: _DWT_BUTTON_,
                        label: biz_vnc_crm_admin.BTN_Delete,
                        width: "100px",
                        onActivate: "ZaCRMChannelModel.deleteButtonListener.call(this);",
                        enableDisableChangeEventSources: [ZaCRMadmin.A_channel_list_cache],
                        enableDisableChecks: [ZaCRMChannelModel.isDeleteChannelEnabled],
                        relevant: "ZaCRMChannelModel.isDeleteChannelEnabled.call(this)",
                        relevantBehavior: _DISABLE_
                    }, {
                        type: _CELLSPACER_
                    }, {
                        type: _DWT_BUTTON_,
                        label: biz_vnc_crm_admin.BTN_Edit,
                        width: "100px",
                        onActivate: "ZaCRMChannelModel.editButtonListener.call(this);",
                        enableDisableChangeEventSources: [ZaCRMadmin.A_channel_list_cache],
                        enableDisableChecks: [ZaCRMChannelModel.isEditChannelEnabled],
                        relevant: "ZaCRMChannelModel.isEditChannelEnabled.call(this)",
                        relevantBehavior: _DISABLE_
                    }, {
                        type: _CELLSPACER_
                    }, {
                        type: _DWT_BUTTON_,
                        label: biz_vnc_crm_admin.BTN_Add,
                        width: "100px",
                        onActivate: "ZaCRMChannelModel.addButtonListener.call(this);"
                    }]
                }]
            }]
        }, {
            type: _ZATABCASE_,
            id: "crm_priority",
            ref: ZaModel.currentTab,
            relevant: "instance[ZaModel.currentTab] == 5",
            numCols: 1,
            colSizes: ["800px"],
            caseKey: newTab++,
            items: [{
                type: _ZA_TOP_GROUPER_,
                id: "crm_priority_group",
                width: "100%",
                numCols: 1,
                colSizes: ["auto"],
                label: biz_vnc_crm_admin.LBL_priority_list,
                // cssStyle apply for priority list box
                cssStyle: "margin-top:10px;margin-bottom:10px;padding-bottom:0px;margin-left:10px;margin-right:10px;",
                items: [
                //for main box of header list
                {
                    ref: ZaCRMadmin.A_priority,
                    type: _DWT_LIST_,
                    height: "300px",
                    width: "1200",
                    forceUpdate: true,
                    preserveSelection: false,
                    multiselect: true,
                    cssClass: "DLSource",
                    headerList: headerList_priority,
                    widgetClass: ZaCRMadminPriorityListView,
                    onSelection: ZaCRMPriorityModel.prioritySelectionListener,
                    onChange: ZaCRMxFormView.currentFieldChanged,
                    valueChangeEventSources: [ZaCRMadmin.A_priority]
                },
                //That for button
                {
                    type: _GROUP_,
                    numCols: 5,
                    colSizes: ["100px", "auto", "100px", "auto", "100px"],
                    width: "350px",
                    cssStyle: "margin-bottom:10px;padding-bottom:0px;margin-top:10px;margin-left:0px;margin-right:0px;",
                    items: [{
                        type: _DWT_BUTTON_,
                        label: biz_vnc_crm_admin.BTN_Delete,
                        width: "100px",
                        onActivate: "ZaCRMPriorityModel.deleteButtonListener.call(this);",
                        enableDisableChangeEventSources: [ZaCRMadmin.A_priority_list_cache],
                        enableDisableChecks: [ZaCRMPriorityModel.isDeletePriorityEnabled],
                        relevant: "ZaCRMPriorityModel.isDeletePriorityEnabled.call(this)",
                        relevantBehavior: _DISABLE_
                    }, {
                        type: _CELLSPACER_
                    }, {
                        type: _DWT_BUTTON_,
                        label: biz_vnc_crm_admin.BTN_Edit,
                        width: "100px",
                        onActivate: "ZaCRMPriorityModel.editButtonListener.call(this);",
                        enableDisableChangeEventSources: [ZaCRMadmin.A_priority_list_cache],
                        enableDisableChecks: [ZaCRMPriorityModel.isEditPriorityEnabled],
                        relevant: "ZaCRMPriorityModel.isEditPriorityEnabled.call(this)",
                        relevantBehavior: _DISABLE_
                    }, {
                        type: _CELLSPACER_
                    }, {
                        type: _DWT_BUTTON_,
                        label: biz_vnc_crm_admin.BTN_Add,
                        width: "100px",
                        onActivate: "ZaCRMPriorityModel.addButtonListener.call(this);"
                    }]
                }]
            }]
        }, {
            type: _ZATABCASE_,
            id: "crm_category",
            ref: ZaModel.currentTab,
            relevant: "instance[ZaModel.currentTab] == 6",
            numCols: 1,
            colSizes: ["800px"],
            caseKey: newTab++,
            items: [{
                type: _ZA_TOP_GROUPER_,
                id: "crm_category_group",
                width: "100%",
                numCols: 1,
                colSizes: ["auto"],
                label: biz_vnc_crm_admin.LBL_category_list,
                // cssStyle apply for category list box
                cssStyle: "margin-top:10px;margin-bottom:10px;padding-bottom:0px;margin-left:10px;margin-right:10px;",
                items: [
                //for main box of header list
                {
                    ref: ZaCRMadmin.A_category,
                    type: _DWT_LIST_,
                    height: "300px",
                    width: "1300",
                    forceUpdate: true,
                    preserveSelection: false,
                    multiselect: true,
                    cssClass: "DLSource",
                    headerList: headerList_category,
                    widgetClass: ZaCRMadminCategoryListView,
                    onSelection: ZaCRMCategoryModel.categorySelectionListener,
                    onChange: ZaCRMxFormView.currentFieldChanged,
                    valueChangeEventSources: [ZaCRMadmin.A_category]
                },
                //That for button
                {
                    type: _GROUP_,
                    numCols: 5,
                    colSizes: ["100px", "auto", "100px", "auto", "100px"],
                    width: "350px",
                    cssStyle: "margin-bottom:10px;padding-bottom:0px;margin-top:10px;margin-left:0px;margin-right:0px;",
                    items: [{
                        type: _DWT_BUTTON_,
                        label: biz_vnc_crm_admin.BTN_Delete,
                        width: "100px",
                        onActivate: "ZaCRMCategoryModel.deleteButtonListener.call(this);",
                        enableDisableChangeEventSources: [ZaCRMadmin.A_category_list_cache],
                        enableDisableChecks: [ZaCRMCategoryModel.isDeleteCategoryEnabled],
                        relevant: "ZaCRMCategoryModel.isDeleteCategoryEnabled.call(this)",
                        relevantBehavior: _DISABLE_
                    }, {
                        type: _CELLSPACER_
                    }, {
                        type: _DWT_BUTTON_,
                        label: biz_vnc_crm_admin.BTN_Edit,
                        width: "100px",
                        onActivate: "ZaCRMCategoryModel.editButtonListener.call(this);",
                        enableDisableChangeEventSources: [ZaCRMadmin.A_category_list_cache],
                        enableDisableChecks: [ZaCRMCategoryModel.isEditCategoryEnabled],
                        relevant: "ZaCRMCategoryModel.isEditCategoryEnabled.call(this)",
                        relevantBehavior: _DISABLE_
                    }, {
                        type: _CELLSPACER_
                    }, {
                        type: _DWT_BUTTON_,
                        label: biz_vnc_crm_admin.BTN_Add,
                        width: "100px",
                        onActivate: "ZaCRMCategoryModel.addButtonListener.call(this);"
                    }]
                }]
            }]
        }, {
            type: _ZATABCASE_,
            id: "crm_section",
            ref: ZaModel.currentTab,
            relevant: "instance[ZaModel.currentTab] == 7",
            numCols: 1,
            colSizes: ["800px"],
            caseKey: newTab++,
            items: [{
                type: _ZA_TOP_GROUPER_,
                id: "crm_section_group",
                width: "100%",
                numCols: 1,
                colSizes: ["auto"],
                label: biz_vnc_crm_admin.LBL_section_list,
                // cssStyle apply for country list box
                cssStyle: "margin-top:10px;margin-bottom:10px;padding-bottom:0px;margin-left:10px;margin-right:10px;",
                items: [
                //for main box of header list
                {
                    ref: ZaCRMadmin.A_section,
                    type: _DWT_LIST_,
                    height: "300px",
                    width: "1550",
                    forceUpdate: true,
                    preserveSelection: false,
                    multiselect: true,
                    cssClass: "DLSource",
                    headerList: headerList_section,
                    widgetClass: ZaCRMadminSectionListView,
                    onSelection: ZaCRMSectionModel.sectionSelectionListener,
                    onChange: ZaCRMxFormView.currentFieldChanged,
                    valueChangeEventSources: [ZaCRMadmin.A_section]
                },
                //That for button
                {
                    type: _GROUP_,
                    numCols: 5,
                    colSizes: ["100px", "auto", "100px", "auto", "100px"],
                    width: "350px",
                    cssStyle: "margin-bottom:10px;padding-bottom:0px;margin-top:10px;margin-left:0px;margin-right:0px;",
                    items: [{
                        type: _DWT_BUTTON_,
                        label: biz_vnc_crm_admin.BTN_Delete,
                        width: "100px",
                        onActivate: "ZaCRMSectionModel.deleteButtonListener.call(this);",
                        enableDisableChangeEventSources: [ZaCRMadmin.A_section_list_cache],
                        enableDisableChecks: [ZaCRMSectionModel.isDeleteSectionEnabled],
                        relevant: "ZaCRMSectionModel.isDeleteSectionEnabled.call(this)",
                        relevantBehavior: _DISABLE_
                    }, {
                        type: _CELLSPACER_
                    }, {
                        type: _DWT_BUTTON_,
                        label: biz_vnc_crm_admin.BTN_Edit,
                        width: "100px",
                        onActivate: "ZaCRMSectionModel.editButtonListener.call(this);",
                        enableDisableChangeEventSources: [ZaCRMadmin.A_section_list_cache],
                        enableDisableChecks: [ZaCRMSectionModel.isEditSectionEnabled],
                        relevant: "ZaCRMSectionModel.isEditSectionEnabled.call(this)",
                        relevantBehavior: _DISABLE_
                    }, {
                        type: _CELLSPACER_
                    }, {
                        type: _DWT_BUTTON_,
                        label: biz_vnc_crm_admin.BTN_Add,
                        width: "100px",
                        onActivate: "ZaCRMSectionModel.addButtonListener.call(this);"
                    }]
                }]
            }]
        }, {
            type: _ZATABCASE_,
            id: "crm_stage",
            ref: ZaModel.currentTab,
            relevant: "instance[ZaModel.currentTab] == 8",
            numCols: 1,
            colSizes: ["800px"],
            caseKey: newTab++,
            items: [{
                type: _ZA_TOP_GROUPER_,
                id: "crm_stage_group",
                width: "100%",
                numCols: 1,
                colSizes: ["auto"],
                label: biz_vnc_crm_admin.LBL_stage_list,
                cssStyle: "margin-top:10px;margin-bottom:10px;padding-bottom:0px;margin-left:10px;margin-right:10px;",
                items: [{
                    ref: ZaCRMadmin.A_stage,
                    type: _DWT_LIST_,
                    height: "300px",
                    width: "1450",
                    forceUpdate: true,
                    preserveSelection: false,
                    multiselect: true,
                    cssClass: "DLSource",
                    headerList: headerList_cont,
                    widgetClass: ZaCRMadminStageListView,
                    onSelection: ZaCRMStageModel.stageSelectionListener,
                    onChange: ZaCRMxFormView.currentFieldChanged,
                    valueChangeEventSources: [ZaCRMadmin.A_stage]
                }, {
                    type: _GROUP_,
                    numCols: 5,
                    colSizes: ["100px", "auto", "100px", "auto", "100px"],
                    width: "350px",
                    cssStyle: "margin-bottom:10px;padding-bottom:0px;margin-top:10px;margin-left:0px;margin-right:0px;",
                    items: [{
                        type: _DWT_BUTTON_,
                        label: biz_vnc_crm_admin.BTN_Delete,
                        width: "100px",
                        onActivate: "ZaCRMStageModel.deleteButtonListener.call(this);",
                        enableDisableChangeEventSources: [ZaCRMadmin.A_stage_list_cache],
                        enableDisableChecks: [ZaCRMStageModel.isDeleteStageEnabled],
                        relevant: "ZaCRMStageModel.isDeleteStageEnabled.call(this)",
                        relevantBehavior: _DISABLE_
                    }, {
                        type: _CELLSPACER_
                    }, {
                        type: _DWT_BUTTON_,
                        label: biz_vnc_crm_admin.BTN_Edit,
                        width: "100px",
                        onActivate: "ZaCRMStageModel.editButtonListener.call(this);",
                        enableDisableChangeEventSources: [ZaCRMadmin.A_stage_list_cache],
                        enableDisableChecks: [ZaCRMStageModel.isEditStageEnabled],
                        relevant: "ZaCRMStageModel.isEditStageEnabled.call(this)",
                        relevantBehavior: _DISABLE_
                    }, {
                        type: _CELLSPACER_
                    }, {
                        type: _DWT_BUTTON_,
                        label: biz_vnc_crm_admin.BTN_Add,
                        width: "100px",
                        onActivate: "ZaCRMStageModel.addButtonListener.call(this);"
                    }]
                }]
            }]
        }, {
            type: _ZATABCASE_,
            id: "crm_leadClass",
            ref: ZaModel.currentTab,
            relevant: "instance[ZaModel.currentTab] == 9",
            numCols: 1,
            colSizes: ["800px"],
            caseKey: newTab++,
            items: [{
                type: _ZA_TOP_GROUPER_,
                id: "crm_leadClass_group",
                width: "100%",
                numCols: 1,
                colSizes: ["auto"],
                label: biz_vnc_crm_admin.LBL_leadClass_list,
                // cssStyle apply for channel list box
                cssStyle: "margin-top:10px;margin-bottom:10px;padding-bottom:0px;margin-left:10px;margin-right:10px;",
                items: [
                //for main box of header list
                {
                    ref: ZaCRMadmin.A_leadClass,
                    type: _DWT_LIST_,
                    height: "300px",
                    width: "1200",
                    forceUpdate: true,
                    preserveSelection: false,
                    multiselect: true,
                    cssClass: "DLSource",
                    headerList: headerList_leadClass,
                    widgetClass: ZaCRMadminLeadClassListView,
                    onSelection: ZaCRMLeadClassModel.leadClassSelectionListener,
                    onChange: ZaCRMxFormView.currentFieldChanged,
                    valueChangeEventSources: [ZaCRMadmin.A_leadClass]
                },
                //That for button
                {
                    type: _GROUP_,
                    numCols: 5,
                    colSizes: ["100px", "auto", "100px", "auto", "100px"],
                    width: "350px",
                    cssStyle: "margin-bottom:10px;padding-bottom:0px;margin-top:10px;margin-left:0px;margin-right:0px;",
                    items: [{
                        type: _DWT_BUTTON_,
                        label: biz_vnc_crm_admin.BTN_Delete,
                        width: "100px",
                        onActivate: "ZaCRMLeadClassModel.deleteButtonListener.call(this);",
                        enableDisableChangeEventSources: [ZaCRMadmin.A_leadClass_list_cache],
                        enableDisableChecks: [ZaCRMLeadClassModel.isDeleteLeadClassEnabled],
                        relevant: "ZaCRMLeadClassModel.isDeleteLeadClassEnabled.call(this)",
                        relevantBehavior: _DISABLE_
                    }, {
                        type: _CELLSPACER_
                    }, {
                        type: _DWT_BUTTON_,
                        label: biz_vnc_crm_admin.BTN_Edit,
                        width: "100px",
                        onActivate: "ZaCRMLeadClassModel.editButtonListener.call(this);",
                        enableDisableChangeEventSources: [ZaCRMadmin.A_leadClass_list_cache],
                        enableDisableChecks: [ZaCRMLeadClassModel.isEditLeadClassEnabled],
                        relevant: "ZaCRMLeadClassModel.isEditLeadClassEnabled.call(this)",
                        relevantBehavior: _DISABLE_
                    }, {
                        type: _CELLSPACER_
                    }, {
                        type: _DWT_BUTTON_,
                        label: biz_vnc_crm_admin.BTN_Add,
                        width: "100px",
                        onActivate: "ZaCRMLeadClassModel.addButtonListener.call(this);"
                    }]
                }]
            }]
        }, {
            type: _ZATABCASE_,
            id: "crm_aboutUs",
            ref: ZaModel.currentTab,
            relevant: "instance[ZaModel.currentTab] == 10",
            numCols: 1,
            colSizes: ["800px"],
            caseKey: newTab++,
            cssStyle: "padding: 20px;",
            items:[{
                type:_OUTPUT_, label: null, value:biz_vnc_crm_admin.CRM_tab_title, labelLocation:_LEFT_, cssStyle:"font-size:30pt;font-weight: bold;text-align: center;"
            }, {
                type:_OUTPUT_, label: null, value:biz_vnc_crm_admin.vncurl, labelLocation:_LEFT_, cssStyle:"font-size:10pt;font-weight: bold;text-align: center;"
            }, {
                type:_OUTPUT_, label: null, value:biz_vnc_crm_admin.copyright, labelLocation:_LEFT_, cssStyle:"font-size:10pt;font-weight: bold;text-align: center;"
            }, {
                type:_OUTPUT_, label: null, value:biz_vnc_crm_admin.gpl, labelLocation:_LEFT_, cssStyle:"font-size:10pt;font-weight: bold;text-align: center;"
            }]
        }]
    }];
}

ZaTabView.XFormModifiers["ZaCRMxFormView"].push(ZaCRMxFormView.myXFormModifier);
