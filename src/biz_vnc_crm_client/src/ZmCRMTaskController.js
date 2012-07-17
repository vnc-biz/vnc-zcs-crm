AjxDispatcher.require(["TasksCore", "Tasks"]);
ZmCRMTaskController = function (container, calApp, currentView, leadId) {
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
            Ext.getCmp('oppTaskGrid').getStore().loadData(jsonParse(leadTaskListData), false);
            Ext.getCmp('oppTaskGrid').getView().refresh();
        }
    }
}

ZmCRMTaskController.prototype._cancelListener = function (ev) {
    this._action = ZmCalItemComposeController.SAVE_CLOSE;
    this.closeView();
    appCtxt.getCurrentApp().pushView(this._crmViewId, true);
};