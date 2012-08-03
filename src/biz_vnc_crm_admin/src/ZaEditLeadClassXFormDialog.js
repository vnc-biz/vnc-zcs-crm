function ZaEditLeadClassXFormDialog(parent, app, w, h, title) {
    if (arguments.length == 0) return;
    this._standardButtons = [DwtDialog.OK_BUTTON, DwtDialog.CANCEL_BUTTON];
    ZaXDialog.call(this, parent, app, title, w, h, "ZaEditLeadClassXFormDialog");
    this._containedObject = {};
    this.initForm(ZaCRMadmin.leadClassList, this.getMyXForm());
}

ZaEditLeadClassXFormDialog.prototype = new ZaXDialog;
ZaEditLeadClassXFormDialog.prototype.constructor = ZaEditLeadClassXFormDialog;

ZaEditLeadClassXFormDialog.prototype.getMyXForm = function () {
    var xFormObject = {
        numCols: 1,
        items: [{
            type: _ZAWIZGROUP_,
            items: [


            {
                ref: ZaCRMadmin.A_leadClassName,
                type: _TEXTFIELD_,
                label: biz_vnc_crm_admin.HDR_name + ":",
                labelLocation: _LEFT_,
                width: 250
            }, {
                type: _SPACER_,
                height: "5"
            }, {
                ref: ZaCRMadmin.A_leadClassStatus,
                type: _ZA_CHECKBOX_,
                label: biz_vnc_crm_admin.HDR_status,
                trueValue: true,
                falseValue: false,
                visibilityChecks: [],
                enableDisableChecks: []
            }

            ]
        }]
    };
    return xFormObject;
}