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

var ZaEditCategoryXFormDialog = function(parent, app, w, h, title) {
    if (arguments.length == 0) return;
    this._standardButtons = [DwtDialog.OK_BUTTON, DwtDialog.CANCEL_BUTTON];
    ZaXDialog.call(this, parent, app, title, w, h, "ZaEditCategoryXFormDialog");
    this._containedObject = {
        attrs: {}
    };
    this.initForm(ZaCRMadmin.categoryList, this.getMyXForm());
}

ZaEditCategoryXFormDialog.prototype = new ZaXDialog;
ZaEditCategoryXFormDialog.prototype.constructor = ZaEditCategoryXFormDialog;

ZaEditCategoryXFormDialog.prototype.getMyXForm = function () {
    var json, response;

    json = JSON.stringify({
        action: "LIST",
        object: "section"
    });
    response = biz_vnc_crm_admin.rpc(json);
    this._containedObject[ZaCRMadmin.A_section] = jsonParse(response.text);

    var len = this._containedObject[ZaCRMadmin.A_section].length;
    var temp = "[";

    ZaEditCategoryXFormDialog.salesTeamChoices = [];
    for (var i = 0; i < len; i++) {
        var name = this._containedObject[ZaCRMadmin.A_section][i][ZaCRMadmin.A_sectionName];
        var id = this._containedObject[ZaCRMadmin.A_section][i][ZaCRMadmin.A_sectionId];

        if (i == len - 1) {
            temp += "{\"value\":\"" + id + "\",\"label\":\"" + name + "\"}]";
        } else {
            temp += "{\"value\":\"" + id + "\",\"label\":\"" + name + "\"},";
        }
    }
    var chkListJson = eval(temp);
    ZaEditCategoryXFormDialog.salesTeamChoices = chkListJson;

    var xFormObject = {
        numCols: 1,
        items: [{
            type: _ZAWIZGROUP_,
            items: [
            {
                ref: ZaCRMadmin.A_categoryName,
                type: _TEXTFIELD_,
                label: biz_vnc_crm_admin.HDR_name + ":",
                labelLocation: _LEFT_,
                width: 250
            }, {
                type: _SPACER_,
                height: "5"
            }, {
                ref: ZaCRMadmin.A_sales_team_id,
                type: _OSELECT1_,
                msgName: "salesTeam",
                label: "Sales Team :",
                labelLocation: _LEFT_,
                choices: ZaEditCategoryXFormDialog.salesTeamChoices,
                width: "150px",
                onChange: ZaTabView.onFormFieldChanged
            }, {
                type: _SPACER_,
                height: "5"
            }, {
                ref: ZaCRMadmin.A_categoryStatus,
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
