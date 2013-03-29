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

var biz_vnc_crm_client_AttachAppointmentTabView = function (parent, zimlet, className) {
    this.zimlet = zimlet;
    DwtTabViewPage.call(this, parent, className, Dwt.STATIC_STYLE);
};

biz_vnc_crm_client_AttachAppointmentTabView.prototype = new DwtTabViewPage;
biz_vnc_crm_client_AttachAppointmentTabView.prototype.constructor = biz_vnc_crm_client_AttachAppointmentTabView;

biz_vnc_crm_client_AttachAppointmentTabView.prototype.showMe = function () {
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
    button.addSelectionListener(new AjxListener(this, this.search_appt, false));
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
    this.search_appt(true);
}

var CRMAppointmentListView = function (params) {
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

biz_vnc_crm_client_AttachAppointmentTabView.prototype._createErView = function (zm) {
    this.crm_apt_start_date_id = Dwt.getNextId();
    this.crm_apt_start_date_container_id = Dwt.getNextId();
    this.crm_apt_end_date_id = Dwt.getNextId();
    this.crm_apt_end_date_container_id = Dwt.getNextId();
    this.crm_apt_search_button_id = Dwt.getNextId();
    this.crm_apt_list_id = Dwt.getNextId();
    var dataArray = {startDate: this.crm_apt_start_date_id, startDateContainer: this.crm_apt_start_date_container_id, endDate: this.crm_apt_end_date_id, endDateContainer: this.crm_apt_end_date_container_id, searchButtonId: this.crm_apt_search_button_id, listId: this.crm_apt_list_id};
    this.getContentHtmlElement().innerHTML = AjxTemplate.expand("biz_vnc_crm_client.templates.AttachAppointment#AttachApptData",dataArray);
};

biz_vnc_crm_client_AttachAppointmentTabView.prototype.search_appt = function (initFlagForAppt) {
    if (initFlagForAppt) {
        var end_date = new Date().getTime();
        var start_date = end_date - 31622400000;
        start_date = (new Date(start_date).getMonth()+1) + "/" + new Date(start_date).getDate() + "/" + new Date(start_date).getFullYear();
        end_date = (new Date(end_date).getMonth()+1) + "/" + new Date(end_date).getDate() + "/" + new Date(end_date).getFullYear();
    } else {
        var start_date = document.getElementById(this.crm_apt_start_date_id).value;
        var end_date = document.getElementById(this.crm_apt_end_date_id).value;
    }
    if (start_date == "") {
        appCtxt.setStatusMsg(biz_vnc_crm_client.select_start_date_msg);
        return;
    }
    if (end_date == "") {
        appCtxt.setStatusMsg(biz_vnc_crm_client.select_end_date_msg);
        return;
    }

    start_date = new Date(AjxDateUtil.getSimpleDateFormat().parse(start_date));
    end_date = new Date(AjxDateUtil.getSimpleDateFormat().parse(end_date));
    end_date.setDate(end_date.getDate() + 1);
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

biz_vnc_crm_client_AttachAppointmentTabView.prototype.crm_apt_start_date_List = function (ev) {
    var calDate = AjxDateUtil.simpleParseDateStr(document.getElementById(this.crm_apt_start_date_id).value);
    var menu = ev.item.getMenu();
    var cal = menu.getItem(0);
    cal.setDate(calDate, true);
    ev.item.popup();

}

biz_vnc_crm_client_AttachAppointmentTabView.prototype.crm_apt_start_date_Sl = function (ev) {
    document.getElementById(this.crm_apt_start_date_id).value = AjxDateUtil.simpleComputeDateStr(ev.detail);
};

biz_vnc_crm_client_AttachAppointmentTabView.prototype.crm_apt_end_date_List = function (ev) {
    var calDate = AjxDateUtil.simpleParseDateStr(document.getElementById(this.crm_apt_end_date_id).value);
    var menu = ev.item.getMenu();
    var cal = menu.getItem(0);
    cal.setDate(calDate, true);
    ev.item.popup();
};

biz_vnc_crm_client_AttachAppointmentTabView.prototype.crm_apt_end_date_Sl = function (ev) {
    document.getElementById(this.crm_apt_end_date_id).value = AjxDateUtil.simpleComputeDateStr(ev.detail);
};

biz_vnc_crm_client_AttachAppointmentTabView.prototype.getSelectedRecords = function () {
    if (this.searchResult) {
        return this.searchResult.getSelection();
    } else {
        return null;
    }
}

biz_vnc_crm_client_AttachAppointmentTabView.prototype.getSelectedCounts = function () {
    if (this.searchResult) {
        return this.searchResult.getSelectionCount();
    } else {
        return 0;
    }
}
