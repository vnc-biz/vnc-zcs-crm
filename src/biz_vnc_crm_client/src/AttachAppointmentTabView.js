AttachAppointmentTabView = function (parent, zimlet, className) {
    this.zimlet = zimlet;
    DwtTabViewPage.call(this, parent, className, Dwt.STATIC_STYLE);
};

AttachAppointmentTabView.prototype = new DwtTabViewPage;
AttachAppointmentTabView.prototype.constructor = AttachAppointmentTabView;

AttachAppointmentTabView.prototype.showMe = function () {
    DwtTabViewPage.prototype.showMe.call(this);
    if (this._isLoaded) {
        this.setSize("500", "300");
        return;
    }

    this._createErView(biz_vnc_crm_client);
    var start_Listener = new AjxListener(this, this.crm_apt_start_date_List);
    var start_Selection = new AjxListener(this, this.crm_apt_start_date_Sl)
    var crm_apt_start_date = ZmCalendarApp.createMiniCalButton(this, this.crm_apt_start_date_container_id, start_Listener, start_Selection);
    document.getElementById(this.crm_apt_start_date_container_id).appendChild(crm_apt_start_date.getHtmlElement());

    var end_Listener = new AjxListener(this, this.crm_apt_end_date_List);
    var end_Selection = new AjxListener(this, this.crm_apt_end_date_Sl)
    var crm_apt_end_date = ZmCalendarApp.createMiniCalButton(this, this.crm_apt_end_date_container_id, end_Listener, end_Selection);
    document.getElementById(this.crm_apt_end_date_container_id).appendChild(crm_apt_end_date.getHtmlElement());

    var button = new DwtButton({
        parent: this
    });
    button.setText(biz_vnc_crm_client.search);
    button.addSelectionListener(new AjxListener(this, this.search_appt));
    document.getElementById(this.crm_apt_search_button_id).appendChild(button.getHtmlElement());

    var listHeaders = [];
    listHeaders.push(new DwtListHeaderItem({
        field: "subject",
        text: biz_vnc_crm_client.subject,
        align: DwtLabel.ALIGN_LEFT,
        icon: "Zimbra"
    }));
    listHeaders.push(new DwtListHeaderItem({
        field: "calendar",
        text: biz_vnc_crm_client.calendar,
        align: DwtLabel.ALIGN_LEFT
    }));
    listHeaders.push(new DwtListHeaderItem({
        field: "start_date",
        text: biz_vnc_crm_client.start_date,
        align: DwtLabel.ALIGN_LEFT
    }))
    listHeaders.push(new DwtListHeaderItem({
        field: "itemid",
        text: biz_vnc_crm_client.start_date,
        align: DwtLabel.ALIGN_LEFT,
        visible: false
    }))

    var listParams = {
        parent: this,
        headerList: listHeaders,
        controller: new ZmListController(this, appCtxt.getCurrentApp())
    };
    this.searchResult = new CRMAppointmentListView(listParams);
    this.searchResult.reparentHtmlElement(this.crm_apt_list_id);
    this.searchResult.setUI(null, true); // renders headers and empty list
    this.searchResult._initialized = true;
    this._isLoaded = true;
}

CRMAppointmentListView = function (params) {
    ZmListView.call(this, params);
};

CRMAppointmentListView.prototype = new ZmListView;
CRMAppointmentListView.prototype.constructor = CRMAppointmentListView;
CRMAppointmentListView.prototype.toString = function () {
    return "CRMAppointmentListView";
};

CRMAppointmentListView.prototype._getCellContents = function (htmlArr, idx, item, field, colIdx, params) {
    htmlArr[idx++] = item[field];
    return idx;
};

AttachAppointmentTabView.prototype._createErView = function (zm) {
    this.crm_apt_start_date_id = Dwt.getNextId();
    this.crm_apt_start_date_container_id = Dwt.getNextId();
    this.crm_apt_end_date_id = Dwt.getNextId();
    this.crm_apt_end_date_container_id = Dwt.getNextId();
    this.crm_apt_search_button_id = Dwt.getNextId();
    this.crm_apt_list_id = Dwt.getNextId();
    var i = 0;
    var html = new Array();
    html[i++] = "<table style='width:500px'><tr><td><div>";
    html[i++] = "<input type='text' id='" + this.crm_apt_start_date_id + "' style='height:24px;float:left;'/>";
    html[i++] = "<div id='" + this.crm_apt_start_date_container_id + "' style='margin-right:6px;width:21px;float:left;'></div>";
    html[i++] = "<input type='text' id='" + this.crm_apt_end_date_id + "' style='height:24px;float:left;'/>";
    html[i++] = "<div id='" + this.crm_apt_end_date_container_id + "' style='width:21px;margin-right:6px;float:left'></div>";
    html[i++] = "<div id='" + this.crm_apt_search_button_id + "' style='float:left;'></div>";
    html[i++] = "</div></td></tr>";
    html[i++] = "<tr><td>";
    html[i++] = "<div id='" + this.crm_apt_list_id + "'style='height:240px;'></div>";
    html[i++] = "</td></tr></table>";
    this.getContentHtmlElement().innerHTML = html.join("");
};

AttachAppointmentTabView.prototype.search_appt = function () {
    var start_date = document.getElementById(this.crm_apt_start_date_id).value;
    var end_date = document.getElementById(this.crm_apt_end_date_id).value;
	if (start_date.trim() == "") {
        appCtxt.setStatusMsg(biz_vnc_crm_client.select_start_date_msg);
        return;
    }
    if (end_date.trim() == "") {
        appCtxt.setStatusMsg(biz_vnc_crm_client.select_end_date_msg);
        return;
    }

	start_date = new Date(AjxDateUtil.getSimpleDateFormat().parse(start_date));
	end_date = new Date(AjxDateUtil.getSimpleDateFormat().parse(end_date));
	if (start_date.getTime() > end_date.getTime()) {
        appCtxt.setStatusMsg(biz_vnc_crm_client.start_date_gt_end_date_msg);
        return;
    }

    var query = "";
    var folderAry = appCtxt.getCalManager().getCheckedCalendarFolderIds(true);
    for (var i in folderAry) {
        if (folderAry.length - 1 != i) {
            query = query + "inid:\"" + folderAry[i] + "\"" + " OR ";
        } else {
            query = query + "inid:\"" + folderAry[i] + "\"";
        }
    }
    appCtxt.getCalManager()._rawAppts = [];
    response = appCtxt.getCalManager()._search({
        start: start_date.getTime(),
        end: end_date.getTime(),
        offset: 0,
        query: query
    });
    var searchResultVector = new AjxVector();
    for (var i = 0; i < response.size(); i++) {
        searchResultVector.add({
            "subject": response.get(i).getName(),
            "calendar": appCtxt.getFolderTree().getById(response.get(i).getFolderId()).getName(),
            "start_date": new AjxDateFormat(AjxDateFormat.SHORT).format(new Date(response.get(i).getStartTime())),
            "itemid": response.get(i).invId
        });
    }
    this.searchResult.set(searchResultVector);
}

AttachAppointmentTabView.prototype.crm_apt_start_date_List = function (ev) {
    var calDate = AjxDateUtil.simpleParseDateStr(document.getElementById(this.crm_apt_start_date_id).value);
    var menu = ev.item.getMenu();
    var cal = menu.getItem(0);
    cal.setDate(calDate, true);
    ev.item.popup();

}

AttachAppointmentTabView.prototype.crm_apt_start_date_Sl = function (ev) {
    document.getElementById(this.crm_apt_start_date_id).value = AjxDateUtil.simpleComputeDateStr(ev.detail);
};

AttachAppointmentTabView.prototype.crm_apt_end_date_List = function (ev) {
    var calDate = AjxDateUtil.simpleParseDateStr(document.getElementById(this.crm_apt_end_date_id).value);
    var menu = ev.item.getMenu();
    var cal = menu.getItem(0);
    cal.setDate(calDate, true);
    ev.item.popup();
};

AttachAppointmentTabView.prototype.crm_apt_end_date_Sl = function (ev) {
    document.getElementById(this.crm_apt_end_date_id).value = AjxDateUtil.simpleComputeDateStr(ev.detail);
};

AttachAppointmentTabView.prototype.getSelectedRecords = function () {
    if (this.searchResult) {
        return this.searchResult.getSelection();
    } else {
        return null;
    }
}
AttachAppointmentTabView.prototype.getSelectedCounts = function () {
    if (this.searchResult) {
        return this.searchResult.getSelectionCount();
    } else {
        return 0;
    }
}