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