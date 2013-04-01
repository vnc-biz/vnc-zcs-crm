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

var biz_vnc_crm_client_AttachMailTabView = function (parent, zimlet, className) {
    this.zimlet = zimlet;
    DwtTabViewPage.call(this, parent, className, Dwt.STATIC_STYLE);
};

biz_vnc_crm_client_AttachMailTabView.prototype = new DwtTabViewPage;
biz_vnc_crm_client_AttachMailTabView.prototype.constructor = biz_vnc_crm_client_AttachMailTabView;

biz_vnc_crm_client_AttachMailTabView.prototype.toString = function () {
    return "biz_vnc_crm_client_AttachMailTabView";
};

/**
 * Shows the tab view.
 *
 */
biz_vnc_crm_client_AttachMailTabView.prototype.showMe = function () {
    DwtTabViewPage.prototype.showMe.call(this);
    if (this._isLoaded) {
        this.setSize("500", "230");
        return;
    }
    this._createHtml1();
    document.getElementById(this._folderTreeCellId).onclick = AjxCallback.simpleClosure(this._treeListener, this);
    this._isLoaded = true;
};

/**
 * Resets the query.
 *
 * @param    {string}    newQuery        the new query
 */
biz_vnc_crm_client_AttachMailTabView.prototype._resetQuery = function (newQuery) {
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
biz_vnc_crm_client_AttachMailTabView.prototype._getQueryFromFolder = function (folderId) {
    return this._resetQuery('inid:"' + folderId + '"');
};

/**
 * Hides the tab view.
 *
 */
biz_vnc_crm_client_AttachMailTabView.prototype.hideMe = function () {
    DwtTabViewPage.prototype.hideMe.call(this);
};

/**
 * Creates HTML for for the attach mail tab UI.
 *
 */
biz_vnc_crm_client_AttachMailTabView.prototype._createHtml1 = function () {
    this._contentEl = this.getContentHtmlElement();
    this._tableID = Dwt.getNextId();
    this._folderTreeCellId = Dwt.getNextId();
    this._folderListId = Dwt.getNextId();
    var dataArray = {treecellid: this._folderTreeCellId, listid: this._folderListId};
    this._contentEl.innerHTML = AjxTemplate.expand("biz_vnc_crm_client.templates.AttachMail#AttachMailLeft",dataArray);
    this.showAttachMailTreeView();
    var params = {
        parent: appCtxt.getShell(),
        className: "biz_vnc_crm_client_AttachMailList",
        posStyle: DwtControl.ABSOLUTE_STYLE,
        view: ZmId.VIEW_BRIEFCASE_ICON,
        type: ZmItem.ATT
    };
    var bcView = biz_vnc_crm_client_AttachMailTabView._tabAttachMailView = new ZmAttachMailListView(params);
    bcView.reparentHtmlElement(this._folderListId);
    bcView.addSelectionListener(new AjxListener(this, this._listSelectionListener));
    Dwt.setPosition(bcView.getHtmlElement(), Dwt.RELATIVE_STYLE);
};

biz_vnc_crm_client_AttachMailTabView.prototype.searchFolder = function (params) {
    var soapDoc = AjxSoapDoc.create("SearchRequest", "urn:zimbraMail");
    soapDoc.setMethodAttribute("types", "message");
    soapDoc.setMethodAttribute("limit", params.limit);
    soapDoc.setMethodAttribute("offset", params.offset);
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
biz_vnc_crm_client_AttachMailTabView.prototype.handleSearchResponse = function (params) {
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
biz_vnc_crm_client_AttachMailTabView.prototype.processDocsResponse = function (params) {
    var msgs = params.searchResponse.m;
    var mailList = new ZmMailList(ZmItem.MSG, "");
    mailList.setHasMore(params.searchResponse.more);
    if (msgs == undefined) return mailList;

    for (var i = 0; i < msgs.length; i++) {
        var msg = msgs[i];
        mailList.addFromDom(msg);
    }
    return mailList;
};

/**
 * Shows the search folder result content.
 *
 * @param    {hash}    params        a hash of parameters
 */
biz_vnc_crm_client_AttachMailTabView.prototype.showResultContents = function (params) {
    var items = params.items;
    var numItems = items.size();
    if (items) {
        this._list = items;
    } else {
        this._list = new ZmList(ZmItem.BRIEFCASE_ITEM);
    }
    var bcView = biz_vnc_crm_client_AttachMailTabView._tabAttachMailView;
    bcView.set(this._list);
};

/**
 * Handles the view keys events.
 *
 * @param    {DwtKeyEvent}    ev
 */

biz_vnc_crm_client_AttachMailTabView.prototype.gotAttachments = function () {
    return false;
};

/**
 * Shows the attach mail tree view.
 *
 */
biz_vnc_crm_client_AttachMailTabView.prototype.showAttachMailTreeView = function () {
    var callback = new AjxCallback(this, this._showTreeView);
    AjxPackage.undefine("zimbraMail.mail.controller.ZmMailFolderTreeController");
    AjxPackage.require({
        name: "MailCore",
        forceReload: true,
        callback: callback
    });
};

biz_vnc_crm_client_AttachMailTabView.prototype._showTreeView = function () {
    if (appCtxt.isChildWindow) {
        ZmOverviewController.CONTROLLER["FOLDER"] = "ZmMailFolderTreeController";
    }
    //Force create deferred folders if not created
    var app = appCtxt.getApp(ZmApp.MAIL);
    app._createDeferredFolders();
    var base = this.toString();
    var acct = appCtxt.getActiveAccount();
    var params = {
        treeIds: ["FOLDER"],
        fieldId: this._folderTreeCellId,
        overviewId: (appCtxt.multiAccounts) ? ([base, acct.name].join(":")) : base,
        account: acct
    };
    this._setOverview(params);
    this.setSize("500", "230");
    this._currentQuery = this._getQueryFromFolder("2");
    this.treeView.setSelected("2");
    this._treeListener();
};

biz_vnc_crm_client_AttachMailTabView.prototype._setOverview = function (params) {
    var overviewId = params.overviewId;
    var opc = appCtxt.getOverviewController();
    var overview = opc.getOverview(overviewId);
    if (!overview) {
        var ovParams = {
            overviewId: overviewId,
            overviewClass: "biz_vnc_crm_client_AttachMailTabBox",
            headerClass: "DwtTreeItem",
            noTooltips: true,
            treeIds: params.treeIds
        };
        ovParams.omit = {};
        ovParams.omit[ZmFolder.ID_TRASH] = true;
        ovParams.omit[ZmFolder.ID_SPAM] = true;
        ovParams.omit[ZmFolder.ID_DRAFTS] = true;
        overview = opc.createOverview(ovParams);
        overview.set(params.treeIds,ovParams.omit);

    } else if (params.account) {
        overview.account = params.account;
    }
    this._overview = overview;
    document.getElementById(params.fieldId).appendChild(overview.getHtmlElement());
    this.treeView = overview.getTreeView("FOLDER");
    this.treeView.addSelectionListener(new AjxListener(this, this._treeListener));
    this._hideRoot(this.treeView);
};

biz_vnc_crm_client_AttachMailTabView.prototype._treeListener = function (ev) {
    var item = this.treeView.getSelected();
    var query = this._getQueryFromFolder(item.id);
    this.executeQuery(query);
};

biz_vnc_crm_client_AttachMailTabView.prototype._hideRoot = function (treeView) {
    var ti = treeView.getTreeItemById(ZmOrganizer.ID_ROOT);
    if (!ti) {
        var rootId = ZmOrganizer.getSystemId(ZmOrganizer.ID_ROOT);
        ti = treeView.getTreeItemById(rootId);
    }
    ti.showCheckBox(true);
    ti.setExpanded(true);
    ti.setVisible(false, true);
};

biz_vnc_crm_client_AttachMailTabView.prototype.executeQuery = function (query, forward) {
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
var ZmAttachMailController = function (container, app) {
    if (arguments.length == 0) {
        return;
    }

};

ZmAttachMailController.prototype = new ZmListController;
ZmAttachMailController.prototype.constructor = ZmAttachMailController;

ZmAttachMailController.prototype._resetToolbarOperations = function () {
    // override to avoid js expn although we do not have a toolbar per se
};

/**
 * @class
 * The attach mail list view.
 *
 * @extends        ZmListView
 */
var ZmAttachMailListView = function (params) {
    ZmListView.call(this, params);
    this._controller = new ZmAttachMailController();
};

ZmAttachMailListView.prototype = new ZmListView;
ZmAttachMailListView.prototype.constructor = ZmAttachMailListView;

ZmAttachMailListView.prototype._getDivClass = function (base, item, params) {
    return "";
};

ZmAttachMailListView.prototype._getCellContents = function (htmlArr, idx, item, field, colIdx, params) {
    var fragment = item.fragment;
    if (fragment) {
        if (fragment.length > 100) {
            fragment = fragment.substring(0, 96) + "...";
        }
    } else {
        fragment = "";
    }
    fragment = AjxStringUtil.htmlEncode(fragment, true);
    var from = "";
    if (item.getAddress("FROM").name != "") {
        from = item.getAddress("FROM").name;
    } else {
        from = item.getAddress("FROM").address;
    }
    var attachCell = "";
    if (item.hasAttach) {
        attachCell = "<td width='16px'><div class='ImgAttachment' /></td>";
    }
    var subject = item.subject;
    if (subject == undefined) subject = "<no subject>";
    else if (subject.length > 35) {
        subject = subject.substring(0, 32) + "...";
    }
    if (fragment != "") {
        fragmentHtml = "<span style=\"color:gray\"> - " + fragment + "</SPAN></DIV>";
    } else {
        fragmentHtml = "<span style=\"color:gray\"> - " + fragment + "</SPAN></DIV>";
    }
    var dateFormat = AjxDateUtil.computeDateStr(params.now || new Date(), item.date);
    var dataArray = {attachCell: attachCell, from: from, dateFormat: dateFormat, subject: subject, fragmentHtml: fragmentHtml};
    htmlArr[idx++] = AjxTemplate.expand("biz_vnc_crm_client.templates.AttachMail#AttachMailRight",dataArray);
    return idx;
};
