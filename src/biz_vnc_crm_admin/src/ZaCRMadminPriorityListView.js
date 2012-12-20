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

biz_vnc_crm_admin.headerList_priority = new Array();
biz_vnc_crm_admin.headerList_priority[0] = new ZaListHeaderItem(ZaCRMadmin.A_priorityId, biz_vnc_crm_admin.HDR_id, null, "50px", true, ZaCRMadmin.A_priorityId, true, true);
biz_vnc_crm_admin.headerList_priority[1] = new ZaListHeaderItem(ZaCRMadmin.A_priorityName, biz_vnc_crm_admin.HDR_name, null, "200px", true, ZaCRMadmin.A_priorityName, true, true);
biz_vnc_crm_admin.headerList_priority[2] = new ZaListHeaderItem(ZaCRMadmin.A_priorityCode, biz_vnc_crm_admin.HDR_code, null, "150px", true, ZaCRMadmin.A_priorityCode, true, true);
biz_vnc_crm_admin.headerList_priority[3] = new ZaListHeaderItem(ZaCRMadmin.A_priorityStatus, biz_vnc_crm_admin.HDR_status, null, "50px", true, ZaCRMadmin.A_priorityStatus, true, true);
biz_vnc_crm_admin.headerList_priority[4] = new ZaListHeaderItem(ZaCRMadmin.A_priorityCreatedby, biz_vnc_crm_admin.HDR_createdBy, null, "200px", true, ZaCRMadmin.A_priorityCreatedby, true, true);
biz_vnc_crm_admin.headerList_priority[5] = new ZaListHeaderItem(ZaCRMadmin.A_priorityCreateddate, biz_vnc_crm_admin.HDR_createdDate, null, "150px", true, ZaCRMadmin.A_prioritycreateddate, true, true);
biz_vnc_crm_admin.headerList_priority[6] = new ZaListHeaderItem(ZaCRMadmin.A_priorityWriteby, biz_vnc_crm_admin.HDR_writeBy, null, "200px", true, ZaCRMadmin.A_priorityWriteby, true, true);
biz_vnc_crm_admin.headerList_priority[7] = new ZaListHeaderItem(ZaCRMadmin.A_priorityWritedate, biz_vnc_crm_admin.HDR_writeDate, null, "150px", true, ZaCRMadmin.A_priorityWritedate, true, true);

var ZaCRMadminPriorityListView = function(parent, className, posStyle) {
    ZaListView.call(this, parent, className, posStyle, biz_vnc_crm_admin.headerList_priority);
}

ZaCRMadminPriorityListView.prototype = new ZaListView;
ZaCRMadminPriorityListView.prototype.constructor = ZaCRMadminPriorityListView;

ZaCRMadminPriorityListView.prototype.toString = function () {
    return "ZaCRMadminPriorityListView";
};

ZaCRMadminPriorityListView.prototype._createItemHtml = function (item) {
    var html = new Array(100);
    var div = document.createElement("div");
    div[DwtListView._STYLE_CLASS] = "Row";
    div[DwtListView._SELECTED_STYLE_CLASS] = div[DwtListView._STYLE_CLASS] + "-" + DwtCssStyle.SELECTED;
    div.className = div[DwtListView._STYLE_CLASS];
    this.associateItemWithElement(item, div, DwtListView.TYPE_LIST_ITEM);

    if (item[ZaCRMadmin.A_priorityStatus] == true) {
        var image = AjxImg.getImageHtml("Check");
    } else if (item[ZaCRMadmin.A_priorityStatus] == false) {
        var image = AjxImg.getImageHtml("Delete");
    }
    var dataArray = {item: item, headerList: this._headerList, checkImage: image};
    var idx = 0;
    html[idx++] = AjxTemplate.expand("biz_vnc_crm_admin.templates.ListView#listViewStart");
    if (this._headerList) {
        html[idx++] = AjxTemplate.expand("biz_vnc_crm_admin.templates.ListView#priorityListViewEnd",dataArray);
    }
    html[idx++] = "</tr></table>";
    div.innerHTML = html.join("");
    return div;
}

ZaCRMadminPriorityListView.prototype._setNoResultsHtml = function () {
    var buffer = new AjxBuffer();
    var div = document.createElement("div");

    buffer.append("<table width='100%' cellspacing='0' cellpadding='0'>", "<tr><td class='NoResults'><br>&nbsp", "</td></tr></table>");

    div.innerHTML = buffer.toString();
    this._addRow(div);
};
