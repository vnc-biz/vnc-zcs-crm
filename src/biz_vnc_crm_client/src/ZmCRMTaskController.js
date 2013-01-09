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

AjxDispatcher.require(["TasksCore", "Tasks"]);

var ZmCRMTaskController = function (container, calApp, currentView, leadId) {
    this.leadId = leadId;
    ZmTaskController.call(this, container, calApp);
    this.viewId = ZmId.VIEW_TASKEDIT;
    this._crmViewId = currentView;
}

ZmCRMTaskController.prototype = new ZmTaskController();
ZmCRMTaskController.prototype.constructor = ZmCRMTaskController;

ZmCRMTaskController.prototype._handleResponseSave = function (calItem, result) {
    this.closeView();
    appCtxt.getCurrentApp().pushView(this._crmViewId, true);
    var taskids = [];
    taskids.push(result.invId);
    var query = "";
    var folderAry = appCtxt.getTaskManager().getCheckedCalendarFolderIds(true);
    for (var i in folderAry) {
        if (folderAry.length - 1 != i) {
            query = query + "inid:\"" + folderAry[i] + "\"" + " OR ";
        } else {
            query = query + "inid:\"" + folderAry[i] + "\"";
        }
    }
    appCtxt.getTaskManager()._rawTasks = [];
    var searchResponse = appCtxt.getTaskManager()._search({
        offset: 0,
        query: query,
        "types": "task"
    });
    userId = appCtxt.getUsername();
    var response = biz_vnc_crm_client.rpc("jsonobj={\"action\":\"TASKHISTORY\",\"object\":\"lead\",\"array\":\"" + taskids + "\",\"userId\":\"" + userId + "\",\"leadId\":\"" + this.leadId + "\"}");
    biz_vnc_crm_client.msgNotification(response.text);
    if (response.text == 8) {
        if (biz_vnc_crm_client.flag == 0) {
            biz_vnc_crm_client.requestTaskList(this.leadId, "leadTaskGrid");
        } else if (biz_vnc_crm_client.flag == 1) {
            biz_vnc_crm_client.requestTaskList(this.leadId, "oppTaskGrid");
        }
    }
}

ZmCRMTaskController.prototype._cancelListener = function (ev) {
    this._action = ZmCalItemComposeController.SAVE_CLOSE;
    this.closeView();
    appCtxt.getCurrentApp().pushView(this._crmViewId, true);
};
