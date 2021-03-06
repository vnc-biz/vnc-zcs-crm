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

var ZaEditCountryXFormDialog = function(parent, app, w, h, title) {
    if (arguments.length == 0) return;
    this._standardButtons = [DwtDialog.OK_BUTTON, DwtDialog.CANCEL_BUTTON];
    ZaXDialog.call(this, parent, app, title, w, h, "ZaEditCountryXFormDialog");
    this._containedObject = {};
    this.initForm(ZaCRMadmin.countryList, this.getMyXForm());
}

ZaEditCountryXFormDialog.prototype = new ZaXDialog;
ZaEditCountryXFormDialog.prototype.constructor = ZaEditCountryXFormDialog;

ZaEditCountryXFormDialog.prototype.getMyXForm = function () {
    var xFormObject = {
        numCols: 1,
        items: [{
            type: _ZAWIZGROUP_,
            items: [
            {
                ref: ZaCRMadmin.A_countryName,
                type: _TEXTFIELD_,
                label: biz_vnc_crm_admin.HDR_name + ":",
                labelLocation: _LEFT_,
                width: 250
            }, {
                ref: ZaCRMadmin.A_countryCode,
                type: _TEXTFIELD_,
                label: biz_vnc_crm_admin.HDR_code + ":",
                labelLocation: _LEFT_,
                width: 250
            }, {
                type: _SPACER_,
                height: "5"
            }, {
                ref: ZaCRMadmin.A_countryStatus,
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
