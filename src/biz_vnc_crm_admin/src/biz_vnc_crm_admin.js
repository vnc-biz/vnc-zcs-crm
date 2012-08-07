function ZaCRM_Panel() {}

ZaZimbraAdmin._CRM_ADMIN_VIEW = ZaZimbraAdmin.VIEW_INDEX++;
/*
    Adding node to tree in Admin UI
*/
ZaCRM_Panel.backupOvTreeModifier = function (tree) {
    if (ZaSettings.ENABLED_UI_COMPONENTS[ZaSettings.BACKUP_VIEW] || ZaSettings.ENABLED_UI_COMPONENTS[ZaSettings.CARTE_BLANCHE_UI]) {
        this._crmTi = new DwtTreeItem({
            parent: this._toolsTi,
            className: "AdminTreeItem"
        });
        this._crmTi.setText(biz_vnc_crm_admin.CRM_tab_title);
        this._crmTi.setImage("Backup");
        this._crmTi.setData(ZaOverviewPanelController._TID, ZaZimbraAdmin._CRM_ADMIN_VIEW);
        if (ZaOverviewPanelController.overviewTreeListeners) {
            ZaOverviewPanelController.overviewTreeListeners[ZaZimbraAdmin._CRM_ADMIN_VIEW] = ZaOverviewPanelController.crm_adminTreeListener;
        }
    }
}

ZaApp.prototype.getCRMadmin = function (refresh) {
    if (refresh || (this._crmAdmin == null)) {
        this._crmAdmin = new ZaCRMadmin(this);
    }
    return this._crmAdmin;
}
ZaApp.prototype.getCRMadminViewController = function () {
    if (this._controllers[ZaZimbraAdmin._CRM_ADMIN_VIEW] == null) {
        this._controllers[ZaZimbraAdmin._CRM_ADMIN_VIEW] = new ZaCRMadminViewController(this._appCtxt, this._container, this);
    }
    return this._controllers[ZaZimbraAdmin._CRM_ADMIN_VIEW];
}

ZaOverviewPanelController.crm_adminTreeListener = function (ev) {
    if (this._app.getCurrentController()) {
        this._app.getCurrentController().switchToNextView(this._app.getCRMadminViewController(), ZaCRMadminViewController.prototype.show, this._app.getCRMadmin(this));
    } else {
        this._app.getCRMadminViewController().show(this._app.getCRMadmin(this));
    }

}
if (ZaOverviewPanelController.treeModifiers) {
    ZaOverviewPanelController.treeModifiers.push(ZaCRM_Panel.backupOvTreeModifier);
}