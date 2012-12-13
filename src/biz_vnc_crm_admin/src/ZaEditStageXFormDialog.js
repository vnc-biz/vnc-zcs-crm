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

var ZaEditStageXFormDialog = function(parent, app, w, h, title) {
    if (arguments.length == 0) return;
    this._standardButtons = [DwtDialog.OK_BUTTON, DwtDialog.CANCEL_BUTTON];
    ZaXDialog.call(this, parent, app, title, w, h, "ZaEditStageXFormDialog");
    this._containedObject = {};
    this.initForm(ZaCRMadmin.stageList, this.getMyXForm());
}

ZaEditStageXFormDialog.prototype = new ZaXDialog;
ZaEditStageXFormDialog.prototype.constructor = ZaEditStageXFormDialog;

ZaEditStageXFormDialog.prototype.getMyXForm = function () {
    var xFormObject = {
        numCols: 1,
        items: [{
            type: _ZAWIZGROUP_,
            items: [{
                ref: ZaCRMadmin.A_stageName,
                type: _TEXTFIELD_,
                label: biz_vnc_crm_admin.HDR_name + ":",
                labelLocation: _LEFT_,
                width: 250
            }, {
                ref: ZaCRMadmin.A_stageSequence,
                type: _TEXTFIELD_,
                label: biz_vnc_crm_admin.HDR_stageSequence + ":",
                labelLocation: _LEFT_,
                width: 250
            }, {
                type: _SPACER_,
                height: "5"
            }, {
                ref: ZaCRMadmin.A_stageType,
                type: _OSELECT1_,
                msgName: "stageType",
                label: biz_vnc_crm_admin.HDR_stageType + ":",
                labelLocation: _LEFT_,
                choices: ZaCRMadmin.stageChoices,
                width: "150px",
                onChange: ZaTabView.onFormFieldChanged
            }, {
                type: _SPACER_,
                height: "5"
            }, {
                ref: ZaCRMadmin.A_stageState,
                type: _OSELECT1_,
                msgName: "stageState",
                label: biz_vnc_crm_admin.HDR_stageState + ":",
                labelLocation: _LEFT_,
                choices: ZaCRMadmin.stateChoices,
                width: "150px",
                onChange: ZaTabView.onFormFieldChanged
            }, {
                type: _SPACER_,
                height: "5"
            }, {
                ref: ZaCRMadmin.A_stageProbability,
                type: _TEXTFIELD_,
                label: biz_vnc_crm_admin.HDR_stageProb + ":",
                labelLocation: _LEFT_,
                width: 250
            }, {
                ref: ZaCRMadmin.A_stageDescription,
                type: _TEXTFIELD_,
                label: biz_vnc_crm_admin.HDR_stageDesc + ":",
                labelLocation: _LEFT_,
                width: 250
            }, {
                type: _SPACER_,
                height: "5"
            }, {
                ref: ZaCRMadmin.A_stageAuto,
                type: _ZA_CHECKBOX_,
                label: biz_vnc_crm_admin.HDR_stageAuto + ":",
                labelLocation: _LEFT_,
                labelCssStyle: "text-align: right;",
                align: _LEFT_,
                trueValue: true,
                falseValue: false,
                visibilityChecks: [],
                enableDisableChecks: []
            }, {
                type: _SPACER_,
                height: "5"
            }, {
                ref: ZaCRMadmin.A_stageStatus,
                type: _ZA_CHECKBOX_,
                label: biz_vnc_crm_admin.HDR_status + ":",
                labelLocation: _LEFT_,
                labelCssStyle: "text-align: right;",
                align: _LEFT_,
                trueValue: true,
                falseValue: false,
                visibilityChecks: [],
                enableDisableChecks: []
            }]
        }]
    };
    return xFormObject;
}
