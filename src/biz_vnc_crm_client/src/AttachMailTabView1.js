AttachMailTabView1 = function (parent, zimlet, className) {
    this.zimlet = zimlet;
    DwtTabViewPage.call(this, parent, className, Dwt.STATIC_STYLE);
};

AttachMailTabView1.prototype = new DwtTabViewPage;
AttachMailTabView1.prototype.constructor = AttachMailTabView1;


AttachMailTabView1.prototype.toString = function () {
    return "AttachMailTabView1";
};

/**
 * Shows the tab view.
 * 
 */
AttachMailTabView1.prototype.showMe = function () {
    DwtTabViewPage.prototype.showMe.call(this);
    if (this._isLoaded) {
        this.setSize("485", "230");
        return;
    }
    this._createHtml1();
    document.getElementById(this._folderTreeCellId).onclick = AjxCallback.simpleClosure(this._treeListener, this);
    this._isLoaded = true;
};

/**
 * Resets the query.
 * 
 * @param	{string}	newQuery		the new query
 */
AttachMailTabView1.prototype._resetQuery = function (newQuery) {
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
 * @param	{string}		folderId
 * @return	{string}	the query
 */
AttachMailTabView1.prototype._getQueryFromFolder = function (folderId) {
    return this._resetQuery('inid:"' + folderId + '"');
};

/**
 * Hides the tab view.
 * 
 */
AttachMailTabView1.prototype.hideMe = function () {
    DwtTabViewPage.prototype.hideMe.call(this);
};

/**
 * Creates HTML for for the attach mail tab UI.
 * 
 */
AttachMailTabView1.prototype._createHtml1 = function () {
    this._contentEl = this.getContentHtmlElement();
    this._tableID = Dwt.getNextId();
    this._folderTreeCellId = Dwt.getNextId();
    this._folderListId = Dwt.getNextId();
    var html = [];
    var idx = 0;

    html[idx++] = '<div>';
    html[idx++] = '<div style="float:left; position:relative; width:100px;" id="' + this._folderTreeCellId + '">';
    html[idx++] = '</div>';
    html[idx++] = '<div style="float:left;position:relative; width:360px;" id="' + this._folderListId + '">';
    html[idx++] = '</div>';

    html[idx++] = '</div>';
    this._contentEl.innerHTML = html.join("");
    this.showAttachMailTreeView();
    var params = {
        parent: appCtxt.getShell(),
        className: "AttachMailTabBox AttachMailList",
        posStyle: DwtControl.ABSOLUTE_STYLE,
        view: ZmId.VIEW_BRIEFCASE_ICON,
        type: ZmItem.ATT
    };
    var bcView = AttachMailTabView1._tabAttachMailView = new ZmAttachMailListView(params);
    bcView.reparentHtmlElement(this._folderListId);
    bcView.addSelectionListener(new AjxListener(this, this._listSelectionListener));
    Dwt.setPosition(bcView.getHtmlElement(), Dwt.RELATIVE_STYLE);
};

AttachMailTabView1.prototype.searchFolder = function (params) {
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
 * @param	{hash}	params		a hash of parameters
 */
AttachMailTabView1.prototype.handleSearchResponse = function (params) {
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
 * @param	{hash}	params		a hash of parameters
 */
AttachMailTabView1.prototype.processDocsResponse = function (params) {
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
 * @param	{hash}	params		a hash of parameters
 */
AttachMailTabView1.prototype.showResultContents = function (params) {
    var items = params.items;
    var numItems = items.size();
    if (items) {
        this._list = items;
    } else {
        this._list = new ZmList(ZmItem.BRIEFCASE_ITEM);
    }
    var bcView = AttachMailTabView1._tabAttachMailView;
    bcView.set(this._list);
};

/**
 * Handles the view keys events.
 * 
 * @param	{DwtKeyEvent}	ev
 */

AttachMailTabView1.prototype.gotAttachments = function () {
    return false;
};

/**
 * Shows the attach mail tree view.
 * 
 */
AttachMailTabView1.prototype.showAttachMailTreeView = function () {
    var callback = new AjxCallback(this, this._showTreeView);
    AjxPackage.undefine("zimbraMail.mail.controller.ZmMailFolderTreeController");
    AjxPackage.require({
        name: "MailCore",
        forceReload: true,
        callback: callback
    });
};

AttachMailTabView1.prototype._showTreeView = function () {
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
    this.setSize("485", "230");
    this._currentQuery = this._getQueryFromFolder("2");
    this.treeView.setSelected("2");
    this._treeListener();
};

AttachMailTabView1.prototype._setOverview = function (params) {
    var overviewId = params.overviewId;
    var opc = appCtxt.getOverviewController();
    var overview = opc.getOverview(overviewId);
    if (!overview) {
        var ovParams = {
            overviewId: overviewId,
            overviewClass: "AttachMailTabBox",
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

AttachMailTabView1.prototype._treeListener = function (ev) {
    var item = this.treeView.getSelected();
    var query = this._getQueryFromFolder(item.id);
    this.executeQuery(query);
};

AttachMailTabView1.prototype._hideRoot = function (treeView) {
    var ti = treeView.getTreeItemById(ZmOrganizer.ID_ROOT);
    if (!ti) {
        var rootId = ZmOrganizer.getSystemId(ZmOrganizer.ID_ROOT);
        ti = treeView.getTreeItemById(rootId);
    }
    ti.showCheckBox(true);
    ti.setExpanded(true);
    ti.setVisible(false, true);
};

AttachMailTabView1.prototype.executeQuery = function (query, forward) {
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
 * @extends		ZmListController
 */
ZmAttachMailController = function (container, app) {
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
 * @extends		ZmListView
 */
ZmAttachMailListView = function (params) {
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
    htmlArr[idx++] = "<DIV style=\"height:70px;cursor:pointer;border-left:1px solid #E0E0E0; border-left:2px solid #E0E0E0; border-bottom:1px solid #E0E0E0; border-right:1px solid #E0E0E0; border-top:1px solid #E0E0E0;\">";
    htmlArr[idx++] = "<TABLE width=100%><tr> ";
    htmlArr[idx++] = attachCell;
    htmlArr[idx++] = "<td  align=left><span style=\"font-weight:bold;font-size:14px;\"> ";
    htmlArr[idx++] = from;
    htmlArr[idx++] = "</SPAN></td><td align=right>";
    htmlArr[idx++] = AjxDateUtil.computeDateStr(params.now || new Date(), item.date);
    htmlArr[idx++] = "</td></tr></TABLE>";
    var subject = item.subject;
    if (subject == undefined) subject = "<no subject>";
    else if (subject.length > 35) {
        subject = subject.substring(0, 32) + "...";
    }

    htmlArr[idx++] = "<span style=\"font-weight:bold;\"> " + subject + "</SPAN>";
    if (fragment != "") {
        htmlArr[idx++] = "<span style=\"color:gray\"> - " + fragment + "</SPAN></DIV>";
    }
    return idx;
};