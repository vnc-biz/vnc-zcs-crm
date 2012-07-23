function ZaEditCompanyXFormDialog(parent, app, w, h, title) {
    if (arguments.length == 0) return;
    this._standardButtons = [DwtDialog.OK_BUTTON, DwtDialog.CANCEL_BUTTON];
    ZaXDialog.call(this, parent, app, title, w, h, "ZaEditCompanyXFormDialog");
    this._containedObject = {};
    this.initForm(ZaCRMadmin.companyList, this.getMyXForm());
}

ZaEditCompanyXFormDialog.prototype = new ZaXDialog;
ZaEditCompanyXFormDialog.prototype.constructor = ZaEditCompanyXFormDialog;

ZaEditCompanyXFormDialog.prototype.getMyXForm = function () {
    var xFormObject = {
        numCols: 1,
        items: [{
            type: _ZAWIZGROUP_,
            items: [


            {
                ref: ZaCRMadmin.A_companyName,
                type: _TEXTFIELD_,
                label: biz_vnc_crm_admin.HDR_name + ":",
                labelLocation: _LEFT_,
                width: 250
            }, {
                ref: ZaCRMadmin.A_companyAddress,
                type: _TEXTFIELD_,
                label: biz_vnc_crm_admin.HDR_address + ":",
                labelLocation: _LEFT_,
                width: 250
            }, {
                ref: ZaCRMadmin.A_companyPhone,
                type: _TEXTFIELD_,
                label: biz_vnc_crm_admin.HDR_phone + ":",
                labelLocation: _LEFT_,
                width: 250
            }, {
                ref: ZaCRMadmin.A_companyFax,
                type: _TEXTFIELD_,
                label: biz_vnc_crm_admin.HDR_fax + ":",
                labelLocation: _LEFT_,
                width: 250
            }, {
                ref: ZaCRMadmin.A_companyEmail,
                type: _TEXTFIELD_,
                label: biz_vnc_crm_admin.HDR_email + ":",
                labelLocation: _LEFT_,
                width: 250
            },

            {
                type: _SPACER_,
                height: "5"
            }, {
                ref: ZaCRMadmin.A_companyStatus,
                type: _ZA_CHECKBOX_,
                label: biz_vnc_crm_admin.HDR_status,
                trueValue: true,
                falseValue: false,
                visibilityChecks: [],
                enableDisableChecks: []
            }]
        }]
    };
    return xFormObject;
}