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
    var json = "jsonobj={\"action\":\"TASKHISTORY\",\"object\":\"lead\",\"array\":\"" + taskids + "\",\"leadId\":\"" + this.leadId + "\"}";
    var reqHeader = {
        "Content-Type": "application/x-www-form-urlencoded"
    };
    var reqJson = AjxStringUtil.urlEncode(json);
    var response = AjxRpc.invoke(reqJson, "/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);
    if (response.text == 1) {
        if (biz_vnc_crm_client.flag == 0) {
            var json = "jsonobj={\"action\":\"listTask\",\"object\":\"lead\",\"leadId\":\"" + this.leadId + "\"}";
            var reqHeader = {
                "Content-Type": "application/x-www-form-urlencoded"
            };
            var reqJson = AjxStringUtil.urlEncode(json);
            var responseTaskList = AjxRpc.invoke(reqJson, "/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);
            var newtaskArray = (responseTaskList.text).split(",");
            var allTask = searchResponse.getArray();
            var taskArray = [];
            if (newtaskArray != null) {
                for (var i = 0; i < allTask.length; i++) {
                    for (var j = 0; j < newtaskArray.length; j++) {
                        if (allTask[i].invId == newtaskArray[j]) {
                            taskArray.push(newtaskArray[j]);
                        }
                    }
                }
            }
            if (taskArray.length <= 0) {
                leadTaskListData = "[{'taskId':'','subject':'','status':'','complete':'','dueDate':''}]";
            } else {
                leadTaskListData = "[";
                var flag = 0;
                var isFinished = false;
                for (var i = 0; i < allTask.length; i++) {
                    var temp = allTask[i];
                    for (var j = 0; j < taskArray.length; j++) {
                        if (temp.invId == taskArray[j]) {
                            if (flag == taskArray.length - 1) {
                                leadTaskListData += "{\"taskId\":\"" + temp.invId + "\",\"subject\":\"" + temp.name + "\",\"status\":\"" + ZmCalItem.getLabelForStatus(temp.status) + "\",\"complete\":\"" + temp.pComplete + "\",\"dueDate\":\"" + new Date(temp.endDate) + "\"}]";
                                isFinished = true;
                                break;
                            } else {
                                leadTaskListData += "{\"taskId\":\"" + temp.invId + "\",\"subject\":\"" + temp.name + "\",\"status\":\"" + ZmCalItem.getLabelForStatus(temp.status) + "\",\"complete\":\"" + temp.pComplete + "\",\"dueDate\":\"" + new Date(temp.endDate) + "\"},";
                            }
                            flag++;
                        }
                    }
                    if (isFinished) break;
                }
            }
            Ext.example.msg('',biz_vnc_crm_client.msgTaskAttach);
            Ext.getCmp('leadTaskGrid').getStore().loadData(jsonParse(leadTaskListData), false);
            Ext.getCmp('leadTaskGrid').getView().refresh();
        } else if (biz_vnc_crm_client.flag == 1) {
            var json = "jsonobj={\"action\":\"listTask\",\"object\":\"opp\",\"leadId\":\"" + this.leadId + "\"}";
            var reqHeader = {
                "Content-Type": "application/x-www-form-urlencoded"
            };
            var reqJson = AjxStringUtil.urlEncode(json);
            var responseTaskList = AjxRpc.invoke(reqJson, "/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);
            var newtaskArray = (responseTaskList.text).split(",");
            var allTask = searchResponse.getArray();
            var taskArray = [];
            if (newtaskArray != null) {
                for (var i = 0; i < allTask.length; i++) {
                    for (var j = 0; j < newtaskArray.length; j++) {
                        if (allTask[i].invId == newtaskArray[j]) {
                            taskArray.push(newtaskArray[j]);
                        }
                    }
                }
            }
            if (taskArray.length <= 0) {
                leadTaskListData = "[{'taskId':'','subject':'','status':'','complete':'','dueDate':''}]";
            } else {
                leadTaskListData = "[";
                var flag = 0;
                var isFinished = false;
                for (var i = 0; i < allTask.length; i++) {
                    var temp = allTask[i];
                    for (var j = 0; j < taskArray.length; j++) {
                        if (temp.invId == taskArray[j]) {
                            if (flag == taskArray.length - 1) {
                                leadTaskListData += "{\"taskId\":\"" + temp.invId + "\",\"subject\":\"" + temp.name + "\",\"status\":\"" + ZmCalItem.getLabelForStatus(temp.status) + "\",\"complete\":\"" + temp.pComplete + "\",\"dueDate\":\"" + new Date(temp.endDate) + "\"}]";
                                isFinished = true;
                                break;
                            } else {
                                leadTaskListData += "{\"taskId\":\"" + temp.invId + "\",\"subject\":\"" + temp.name + "\",\"status\":\"" + ZmCalItem.getLabelForStatus(temp.status) + "\",\"complete\":\"" + temp.pComplete + "\",\"dueDate\":\"" + new Date(temp.endDate) + "\"},";
                            }
                            flag++;
                        }
                    }
                    if (isFinished) break;
                }
            }
            Ext.example.msg('',biz_vnc_crm_client.msgTaskAttach);
            Ext.getCmp('oppTaskGrid').getStore().loadData(jsonParse(leadTaskListData), false);
            Ext.getCmp('oppTaskGrid').getView().refresh();
        }
    } else {
        Ext.example.msg('',biz_vnc_crm_client.msgTaskNotAttach);
    }
}

ZmCRMTaskController.prototype._cancelListener = function (ev) {
    this._action = ZmCalItemComposeController.SAVE_CLOSE;
    this.closeView();
    appCtxt.getCurrentApp().pushView(this._crmViewId, true);
};
