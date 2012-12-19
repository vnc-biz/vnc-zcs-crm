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

var biz_vnc_crm_client_AttachTask = function (parent, zimlet) {
    this.zimlet = zimlet;
    DwtTabViewPage.call(this, parent, "", Dwt.STATIC_STYLE);
};

biz_vnc_crm_client_AttachTask.prototype = new DwtTabViewPage;
biz_vnc_crm_client_AttachTask.prototype.constructor = biz_vnc_crm_client_AttachTask;

biz_vnc_crm_client_AttachTask.prototype.toString = function () {
    return "AttachTask";
};

/**
 * Shows the tab view.
 *
 */
biz_vnc_crm_client_AttachTask.prototype.showMe = function () {
    DwtTabViewPage.prototype.showMe.call(this);
    if (this._isLoaded) {
        this.setSize("500", "230");
        return;
    }
    this._createHtml1();
    this._isLoaded = true;
};

/**
 * Resets the query.
 *
 * @param    {string}    newQuery        the new query
 */
biz_vnc_crm_client_AttachTask.prototype._resetQuery = function (newQuery) {
    if (this._currentQuery == undefined) {
        return newQuery;
    }
    if (this._currentQuery != newQuery) {
        this._offset = 0;
        this._currentQuery = newQuery;
    }
    return newQuery;
};

/**
 * Gets the "from folder id" query.
 *
 * @param    {string}        folderId
 * @return    {string}    the query
 */
biz_vnc_crm_client_AttachTask.prototype._getQueryFromFolder = function (folderId) {
    return this._resetQuery('inid:"' + folderId + '"');
};

/**
 * Hides the tab view.
 *
 */
biz_vnc_crm_client_AttachTask.prototype.hideMe = function () {
    DwtTabViewPage.prototype.hideMe.call(this);
};

/**
 * Creates HTML for for the attach mail tab UI.
 *
 */
biz_vnc_crm_client_AttachTask.prototype._createHtml1 = function () {
    this._contentEl = this.getContentHtmlElement();
    this._tableID = Dwt.getNextId();
    this._folderTreeCellId = Dwt.getNextId();
    this._folderListId = Dwt.getNextId();
    var html = [];
    var idx = 0;
    var dataArray = {treecellid: this._folderTreeCellId, listid: this._folderListId};
    this._contentEl.innerHTML = AjxTemplate.expand("biz_vnc_crm_client.templates.AttachTask#AttachTaskLeft",dataArray);
    this.showAttachMailTreeView();

    var params = {
        parent: appCtxt.getShell(),
        className: "biz_vnc_crm_client_AttachTasksTabBox biz_vnc_crm_client_AttachTasksList",
        posStyle: DwtControl.ABSOLUTE_STYLE,
        view: ZmId.VIEW_BRIEFCASE_ICON,
        type: ZmItem.ATT
    };
    var bcView = biz_vnc_crm_client_AttachTask._tabAttachTaskView = new ZmAttachTasksListView(params);
    bcView.reparentHtmlElement(this._folderListId);
    bcView.addSelectionListener(new AjxListener(this, this._listSelectionListener));
    Dwt.setPosition(bcView.getHtmlElement(), Dwt.RELATIVE_STYLE);
};

biz_vnc_crm_client_AttachTask.prototype.searchFolder = function (params) {
    var soapDoc = AjxSoapDoc.create("SearchRequest", "urn:zimbraMail");
    soapDoc.setMethodAttribute("sortBy", "taskDueAsc");
    soapDoc.setMethodAttribute("limit", params.limit);
    soapDoc.setMethodAttribute("offset", params.offset);
    soapDoc.setMethodAttribute("types", "task");
    soapDoc.set("query", params.query);

    params.response = appCtxt.getAppController().sendRequest({
        soapDoc: soapDoc,
        noBusyOverlay: false
    });
    this.handleSearchResponse(params);
};

/**
 * Handles the search folder response.
 *
 * @param    {hash}    params        a hash of parameters
 */
biz_vnc_crm_client_AttachTask.prototype.handleSearchResponse = function (params) {
    var response = params.response;
    if (response && (response.SearchResponse || response._data.SearchResponse)) {
        params.searchResponse = response.SearchResponse || response._data.SearchResponse;
        params.items = this.processDocsResponse(params);
    }
    if (params.callback) {
        params.callback.run(params);
    }
};

/**
 * Processes the search folder doc response.
 *
 * @param    {hash}    params        a hash of parameters
 */
biz_vnc_crm_client_AttachTask.prototype.processDocsResponse = function (params) {
    var tasks = params.searchResponse.task;
    var taskList = new ZmMailList(ZmItem.TASK, "");
    taskList.setHasMore(params.searchResponse.more);
    if (tasks == undefined) return taskList;

    for (var i = 0; i < tasks.length; i++) {
        var msg = tasks[i];
        taskList.addFromDom(msg);
    }
    return taskList;
};

/**
 * Shows the search folder result content.
 *
 * @param    {hash}    params        a hash of parameters
 */
biz_vnc_crm_client_AttachTask.prototype.showResultContents = function (params) {
    var items = params.items;

    var numItems = items.size();
    if (items) {
        this._list = items;
    } else {
        this._list = new ZmList(ZmItem.BRIEFCASE_ITEM);
    }
    var bcView = biz_vnc_crm_client_AttachTask._tabAttachTaskView;
    bcView.set(this._list);
};

/**
 * Handles the view keys events.
 *
 * @param    {DwtKeyEvent}    ev
 */

biz_vnc_crm_client_AttachTask.prototype.gotAttachments = function () {
    return false;
};

/**
 * Shows the attach mail tree view.
 *
 */
biz_vnc_crm_client_AttachTask.prototype.showAttachMailTreeView = function () {
    var callback = new AjxCallback(this, this._showTreeView);
    AjxDispatcher.require(["TasksCore", "Tasks"], false, callback, null, true);
};

biz_vnc_crm_client_AttachTask.prototype._showTreeView = function () {
    if (appCtxt.isChildWindow) {
        ZmOverviewController.CONTROLLER[ZmOrganizer.TASKS] = "ZmTaskTreeController";
    }
    //Force create deferred folders if not created
    var app = appCtxt.getApp(ZmApp.TASKS);
    app._createDeferredFolders();
    var base = this.toString();
    var acct = appCtxt.getActiveAccount();
    var params = {
        treeIds: [ZmOrganizer.TASKS],
        fieldId: this._folderTreeCellId,
        overviewId: (appCtxt.multiAccounts) ? ([base, acct.name].join(":")) : base,
        account: acct
    };
    this._setOverview(params);
    this.setSize("500", "230");
    this._currentQuery = this._getQueryFromFolder("2");
    this.treeView.setSelected("2");
};

biz_vnc_crm_client_AttachTask.prototype._setOverview = function (params) {
    var overviewId = params.overviewId;
    var opc = appCtxt.getOverviewController();
    var overview = opc.getOverview(overviewId);
    if (!overview) {
        var ovParams = {
            overviewId: overviewId,
            overviewClass: "biz_vnc_crm_client_AttachTasksTabBox",
            headerClass: "DwtTreeItem",
            noTooltips: true,
            treeIds: params.treeIds
        };
        ovParams.omit = {};
        ovParams.omit[ZmFolder.ID_TRASH] = true;
        overview = opc.createOverview(ovParams);
        overview.set(params.treeIds,ovParams.omit);

    } else if (params.account) {
        overview.account = params.account;
    }
    this._overview = overview;
    document.getElementById(params.fieldId).appendChild(overview.getHtmlElement());
    this.treeView = overview.getTreeView(ZmOrganizer.TASKS);
    this.treeView.addSelectionListener(new AjxListener(this, this._treeListener));
    this._hideRoot(this.treeView);
};

biz_vnc_crm_client_AttachTask.prototype._treeListener = function (ev) {
    var item = this.treeView.getSelected();
    var query = this._getQueryFromFolder(item.id);
    this.executeQuery(query);
};

biz_vnc_crm_client_AttachTask.prototype._hideRoot = function (treeView) {
    var ti = treeView.getTreeItemById(ZmOrganizer.ID_ROOT);
    if (!ti) {
        var rootId = ZmOrganizer.getSystemId(ZmOrganizer.ID_ROOT);
        ti = treeView.getTreeItemById(rootId);
    }
    ti.showCheckBox(true);
    ti.setExpanded(true);
    ti.setVisible(false, true);
};

biz_vnc_crm_client_AttachTask.prototype.executeQuery = function (query, forward) {
    if (this._limit == undefined) this._limit = 50;

    if (this._offset == undefined) this._offset = 0;

    if (forward != undefined) {
        if (forward) {
            this._offset = this._offset + 50;
        } else {
            this._offset = this._offset - 50;
        }
    }
    var callback = new AjxCallback(this, this.showResultContents);
    this.searchFolder({
        query: this._currentQuery,
        offset: this._offset,
        limit: this._limit,
        callback: callback
    });
};

/**
 * @class
 * The attach mail controller.
 *
 * @extends        ZmListController
 */
ZmAttachTasksController = function (container, app) {
    if (arguments.length == 0) {
        return;
    }

};

ZmAttachTasksController.prototype = new ZmListController;
ZmAttachTasksController.prototype.constructor = ZmAttachTasksController;

ZmAttachTasksController.prototype._resetToolbarOperations = function () {
    // override to avoid js expn although we do not have a toolbar per se
};

/**
 * @class
 * The attach mail list view.
 *
 * @extends        ZmListView
 */
var ZmAttachTasksListView = function (params) {
    ZmListView.call(this, params);
    this._controller = new ZmAttachTasksController();
};

ZmAttachTasksListView.prototype = new ZmListView;
ZmAttachTasksListView.prototype.constructor = ZmAttachTasksListView;

ZmAttachTasksListView.prototype._getDivClass = function (base, item, params) {
    return "";
};

ZmAttachTasksListView.prototype._getCellContents = function (htmlArr, idx, item, field, colIdx, params) {
    var subject = item.name;
    if (!subject) {
        subject = "";
    }
    var dueDate = "";
    if (item.endDate != "" && item.endDate != null) {
        dueDate = AjxDateFormat.format("dd/MM/yyyy", new Date(item.endDate));
    }
    var status ="";
    if(item.status != ""){
        status=ZmCalItem.getLabelForStatus(item.status);
    }

    var dataArray = {subject: subject, dueDate: dueDate, status: status};
    htmlArr[idx++] = AjxTemplate.expand("biz_vnc_crm_client.templates.AttachTask#AttachTaskRight",dataArray);
    return idx;
};
