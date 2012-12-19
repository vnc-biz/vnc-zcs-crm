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

biz_vnc_crm_admin.headerList_cont_state = new Array();
biz_vnc_crm_admin.headerList_cont_state[0] = new ZaListHeaderItem(ZaCRMadmin.A_stateId, biz_vnc_crm_admin.HDR_id, null, "50px", true, ZaCRMadmin.A_stateId, true, true);
biz_vnc_crm_admin.headerList_cont_state[1] = new ZaListHeaderItem(ZaCRMadmin.A_stateName, biz_vnc_crm_admin.HDR_name, null, "200px", true, ZaCRMadmin.A_stateName, true, true);
biz_vnc_crm_admin.headerList_cont_state[2] = new ZaListHeaderItem(ZaCRMadmin.A_stateCode, biz_vnc_crm_admin.HDR_code, null, "150px", true, ZaCRMadmin.A_stateCode, true, true);
biz_vnc_crm_admin.headerList_cont_state[3] = new ZaListHeaderItem(ZaCRMadmin.A_stateCountryName, biz_vnc_crm_admin.TBB_country, null, "150px", true, ZaCRMadmin.A_stateCountryName, true, true);
biz_vnc_crm_admin.headerList_cont_state[4] = new ZaListHeaderItem(ZaCRMadmin.A_stateCountryStatus, biz_vnc_crm_admin.HDR_status, null, "50px", true, ZaCRMadmin.A_stateCountryStatus, true, true);
biz_vnc_crm_admin.headerList_cont_state[5] = new ZaListHeaderItem(ZaCRMadmin.A_stateCreatedby, biz_vnc_crm_admin.HDR_createdBy, null, "200px", true, ZaCRMadmin.A_stateCreatedby, true, true);
biz_vnc_crm_admin.headerList_cont_state[6] = new ZaListHeaderItem(ZaCRMadmin.A_stateCreateddate, biz_vnc_crm_admin.HDR_createdDate, null, "150px", true, ZaCRMadmin.A_stateCreateddate, true, true);
biz_vnc_crm_admin.headerList_cont_state[7] = new ZaListHeaderItem(ZaCRMadmin.A_stateWriteby, biz_vnc_crm_admin.HDR_writeBy, null, "200px", true, ZaCRMadmin.A_stateWriteby, true, true);
biz_vnc_crm_admin.headerList_cont_state[8] = new ZaListHeaderItem(ZaCRMadmin.A_stateWritedate, biz_vnc_crm_admin.HDR_writeDate, null, "150px", true, ZaCRMadmin.A_stateWritedate, true, true);

var ZaCRMadminCountryStateListView = function(parent, className, posStyle) {
    ZaListView.call(this, parent, className, posStyle, biz_vnc_crm_admin.headerList_cont_state);
}

ZaCRMadminCountryStateListView.prototype = new ZaListView;
ZaCRMadminCountryStateListView.prototype.constructor = ZaCRMadminCountryStateListView;

ZaCRMadminCountryStateListView.prototype.toString = function () {
    return "ZaCRMadminCountryStateListView";
};

ZaCRMadminCountryStateListView.prototype._createItemHtml = function (item) {
    var html = new Array(100);
    var div = document.createElement("div");
    div[DwtListView._STYLE_CLASS] = "Row";
    div[DwtListView._SELECTED_STYLE_CLASS] = div[DwtListView._STYLE_CLASS] + "-" + DwtCssStyle.SELECTED;
    div.className = div[DwtListView._STYLE_CLASS];
    this.associateItemWithElement(item, div, DwtListView.TYPE_LIST_ITEM);

    if (item[ZaCRMadmin.A_stateCountryStatus] == true) {
        var image = AjxImg.getImageHtml("Check");
    } else if (item[ZaCRMadmin.A_stateCountryStatus] == false) {
        var image = AjxImg.getImageHtml("Delete");
    }
    var dataArray = {item: item, headerList: this._headerList, checkImage: image};
    var idx = 0;
    html[idx++] = AjxTemplate.expand("biz_vnc_crm_admin.templates.ListView#listViewStart");
    if (this._headerList) {
        html[idx++] = AjxTemplate.expand("biz_vnc_crm_admin.templates.ListView#stateListViewEnd",dataArray);
    }
    html[idx++] = "</tr></table>";
    div.innerHTML = html.join("");
    return div;
}

ZaCRMadminCountryStateListView.prototype._setNoResultsHtml = function () {
    var buffer = new AjxBuffer();
    var div = document.createElement("div");

    buffer.append("<table width='100%' cellspacing='0' cellpadding='0'>", "<tr><td class='NoResults'><br>&nbsp", "</td></tr></table>");

    div.innerHTML = buffer.toString();
    this._addRow(div);
};
