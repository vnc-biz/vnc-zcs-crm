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

function biz_vnc_crm_admin() {}

ZaZimbraAdmin._CRM_ADMIN_VIEW = ZaZimbraAdmin.VIEW_INDEX++;

if(ZaServerVersionInfo.version.substring(0,1) == "7") {
    biz_vnc_crm_admin.ZIMBRA8 = false;
} else {
    biz_vnc_crm_admin.ZIMBRA8 = true;
}

/* initialize zimbra-specific data */
if (biz_vnc_crm_admin.ZIMBRA8) {
    /* Zimbra 8 */
    biz_vnc_crm_admin.changeLogUrl = biz_vnc_crm_admin.Z8_changeLogUrl;
    biz_vnc_crm_admin.documentationUrl = biz_vnc_crm_admin.Z8_documentationUrl;
} else {
    /* Zimbra 7 */
    biz_vnc_crm_admin.changeLogUrl = biz_vnc_crm_admin.Z7_changeLogUrl;
    biz_vnc_crm_admin.documentationUrl = biz_vnc_crm_admin.Z7_documentationUrl;
}

/*
    Adding node to tree in Admin UI
*/
biz_vnc_crm_admin.versionCheckTreeModifier = function (tree) {
    if (!biz_vnc_crm_admin.ZIMBRA8) {
        /* Zimbra 7 */
        if (ZaSettings.ENABLED_UI_COMPONENTS[ZaSettings.BACKUP_VIEW] || ZaSettings.ENABLED_UI_COMPONENTS[ZaSettings.CARTE_BLANCHE_UI]) {
            this._crmTi = new DwtTreeItem({
                parent: this._toolsTi,
                className: "AdminTreeItem"
            });
            this._crmTi.setText(biz_vnc_crm_admin.CRM_tab_title);
            this._crmTi.setImage("Zimlet");
            this._crmTi.setData(ZaOverviewPanelController._TID, ZaZimbraAdmin._CRM_ADMIN_VIEW);
            if (ZaOverviewPanelController.overviewTreeListeners) {
                ZaOverviewPanelController.overviewTreeListeners[ZaZimbraAdmin._CRM_ADMIN_VIEW] = ZaOverviewPanelController.crm_adminTreeListener;
            }
        }
    } else {
        /* Zimbra 8 */
        var overviewPanelController = this ;
        if (!overviewPanelController) throw new Exception("ZaClientUploader.versionCheckTreeModifier: Overview Panel Controller is not set.");
        if (ZaSettings.ENABLED_UI_COMPONENTS[ZaSettings.BACKUP_VIEW] || ZaSettings.ENABLED_UI_COMPONENTS[ZaSettings.CARTE_BLANCHE_UI]) {
            var parentPath = ZaTree.getPathByArray([ZaMsg.OVP_home, ZaMsg.OVP_toolMig]);
            var ti = new ZaTreeItemData({
                parent:parentPath,
                id:ZaId.getTreeItemId(ZaId.PANEL_APP,"magHV",null, "VNCCRMHV"),
                text: biz_vnc_crm_admin.CRM_tab_title,
                mappingId: ZaZimbraAdmin._CRM_ADMIN_VIEW});
                tree.addTreeItemData(ti);
            if (ZaOverviewPanelController.overviewTreeListeners) {
                ZaOverviewPanelController.overviewTreeListeners[ZaZimbraAdmin._CRM_ADMIN_VIEW] = ZaOverviewPanelController.crm_adminTreeListener;
            }
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
    var jspurl = "/service/zimlet/biz_vnc_crm_admin/vnccrmadminmonitoring.jsp";
    var response = AjxRpc.invoke(null,jspurl,null,null,true);
    ZaOverviewPanelController.treeModifiers.push(biz_vnc_crm_admin.versionCheckTreeModifier);
}
