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

biz_vnc_crm_admin.headerList_section = new Array();
biz_vnc_crm_admin.headerList_section[0] = new ZaListHeaderItem(ZaCRMadmin.A_sectionId, biz_vnc_crm_admin.HDR_id, null, "50px", true, ZaCRMadmin.A_sectionId, true, true);
biz_vnc_crm_admin.headerList_section[1] = new ZaListHeaderItem(ZaCRMadmin.A_sectionName, biz_vnc_crm_admin.HDR_name, null, "150px", true, ZaCRMadmin.A_sectionName, true, true);
biz_vnc_crm_admin.headerList_section[2] = new ZaListHeaderItem(ZaCRMadmin.A_sectionCode, biz_vnc_crm_admin.HDR_code, null, "100px", true, ZaCRMadmin.A_sectionCode, true, true);
biz_vnc_crm_admin.headerList_section[3] = new ZaListHeaderItem(ZaCRMadmin.A_sectionManagerId, biz_vnc_crm_admin.HDR_sectionManagerId, null, "150px", true, ZaCRMadmin.A_sectionManagerId, true, true);
biz_vnc_crm_admin.headerList_section[4] = new ZaListHeaderItem(ZaCRMadmin.A_sectionLeaderId, biz_vnc_crm_admin.HDR_sectionLeaderId, null, "150px", true, ZaCRMadmin.A_sectionLeaderId, true, true);
biz_vnc_crm_admin.headerList_section[5] = new ZaListHeaderItem(ZaCRMadmin.A_sectionWatcherId, biz_vnc_crm_admin.HDR_sectionWatcherId, null, "150px", true, ZaCRMadmin.A_sectionWatcherId, true, true);
biz_vnc_crm_admin.headerList_section[6] = new ZaListHeaderItem(ZaCRMadmin.A_sectionStatus, biz_vnc_crm_admin.HDR_status, null, "50px", true, ZaCRMadmin.A_sectionStatus, true, true);
biz_vnc_crm_admin.headerList_section[7] = new ZaListHeaderItem(ZaCRMadmin.A_sectionCreatedby, biz_vnc_crm_admin.HDR_createdBy, null, "150px", true, ZaCRMadmin.A_sectionCreatedby, true, true);
biz_vnc_crm_admin.headerList_section[8] = new ZaListHeaderItem(ZaCRMadmin.A_sectionCreateddate, biz_vnc_crm_admin.HDR_createdDate, null, "150px", true, ZaCRMadmin.A_stateCreateddate, true, true);
biz_vnc_crm_admin.headerList_section[9] = new ZaListHeaderItem(ZaCRMadmin.A_sectionWriteby, biz_vnc_crm_admin.HDR_writeBy, null, "150px", true, ZaCRMadmin.A_A_sectionWriteby, true, true);
biz_vnc_crm_admin.headerList_section[10] = new ZaListHeaderItem(ZaCRMadmin.A_sectionWritedate, biz_vnc_crm_admin.HDR_writeDate, null, "150px", true, ZaCRMadmin.A_sectionWritedate, true, true);

var ZaCRMadminSectionListView = function(parent, className, posStyle) {
    ZaListView.call(this, parent, className, posStyle, biz_vnc_crm_admin.headerList_section);
}

ZaCRMadminSectionListView.prototype = new ZaListView;
ZaCRMadminSectionListView.prototype.constructor = ZaCRMadminSectionListView;

ZaCRMadminSectionListView.prototype.toString = function () {
    return "ZaCRMadminSectionListView";
};

ZaCRMadminSectionListView.prototype._createItemHtml = function (item) {
    var html = new Array(100);
    var div = document.createElement("div");
    div[DwtListView._STYLE_CLASS] = "Row";
    div[DwtListView._SELECTED_STYLE_CLASS] = div[DwtListView._STYLE_CLASS] + "-" + DwtCssStyle.SELECTED;
    div.className = div[DwtListView._STYLE_CLASS];
    this.associateItemWithElement(item, div, DwtListView.TYPE_LIST_ITEM);

    if (item[ZaCRMadmin.A_sectionStatus] == true) {
        var image = AjxImg.getImageHtml("Check");
    } else if (item[ZaCRMadmin.A_sectionStatus] == false) {
        var image = AjxImg.getImageHtml("Delete");
    }
    var dataArray = {item: item, headerList: this._headerList, checkImage: image};
    var idx = 0;
    html[idx++] = AjxTemplate.expand("biz_vnc_crm_admin.templates.ListView#listViewStart");
    if (this._headerList) {
        html[idx++] = AjxTemplate.expand("biz_vnc_crm_admin.templates.ListView#sectionListViewEnd",dataArray);
    }
    html[idx++] = "</tr></table>";
    div.innerHTML = html.join("");
    return div;
}

ZaCRMadminSectionListView.prototype._setNoResultsHtml = function () {
    var buffer = new AjxBuffer();
    var div = document.createElement("div");

    buffer.append("<table width='100%' cellspacing='0' cellpadding='0'>", "<tr><td class='NoResults'><br>&nbsp", "</td></tr></table>");

    div.innerHTML = buffer.toString();
    this._addRow(div);
};
