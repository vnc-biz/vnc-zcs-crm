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

biz_vnc_crm_admin.headerList_cont = new Array();
biz_vnc_crm_admin.headerList_cont[0] = new ZaListHeaderItem(ZaCRMadmin.A_countryId, biz_vnc_crm_admin.HDR_id, null, "50px", true, ZaCRMadmin.A_countryId, true, true);
biz_vnc_crm_admin.headerList_cont[1] = new ZaListHeaderItem(ZaCRMadmin.A_countryName, biz_vnc_crm_admin.HDR_name, null, "200px", true, ZaCRMadmin.A_countryName, true, true);
biz_vnc_crm_admin.headerList_cont[2] = new ZaListHeaderItem(ZaCRMadmin.A_countryCode, biz_vnc_crm_admin.HDR_code, null, "150px", true, ZaCRMadmin.A_countryCode, true, true);
biz_vnc_crm_admin.headerList_cont[3] = new ZaListHeaderItem(ZaCRMadmin.A_countryStatus, biz_vnc_crm_admin.HDR_status, null, "50px", true, ZaCRMadmin.A_countryStatus, true, true);
biz_vnc_crm_admin.headerList_cont[4] = new ZaListHeaderItem(ZaCRMadmin.A_countryCreatedby, biz_vnc_crm_admin.HDR_createdBy, null, "200px", true, ZaCRMadmin.A_countryCreatedby, true, true);
biz_vnc_crm_admin.headerList_cont[5] = new ZaListHeaderItem(ZaCRMadmin.A_countryCreateddate, biz_vnc_crm_admin.HDR_createdDate, null, "200px", true, ZaCRMadmin.A_countryCreateddate, true, true);
biz_vnc_crm_admin.headerList_cont[6] = new ZaListHeaderItem(ZaCRMadmin.A_countryWriteby, biz_vnc_crm_admin.HDR_writeBy, null, "200px", true, ZaCRMadmin.A_countryWriteby, true, true);
biz_vnc_crm_admin.headerList_cont[7] = new ZaListHeaderItem(ZaCRMadmin.A_countryWritedate, biz_vnc_crm_admin.HDR_writeDate, null, "200px", true, ZaCRMadmin.A_countryWritedate, true, true);

var ZaCRMadminCountryListView = function(parent, className, posStyle) {
    ZaListView.call(this, parent, className, posStyle, biz_vnc_crm_admin.headerList_cont);
}

ZaCRMadminCountryListView.prototype = new ZaListView;
ZaCRMadminCountryListView.prototype.constructor = ZaCRMadminCountryListView;

ZaCRMadminCountryListView.prototype.toString = function () {
    return "ZaCRMadminCountryListView";
};

ZaCRMadminCountryListView.prototype._createItemHtml = function (item) {

    var html = new Array(100);
    var div = document.createElement("div");
    div[DwtListView._STYLE_CLASS] = "Row";
    div[DwtListView._SELECTED_STYLE_CLASS] = div[DwtListView._STYLE_CLASS] + "-" + DwtCssStyle.SELECTED;
    div.className = div[DwtListView._STYLE_CLASS];
    this.associateItemWithElement(item, div, DwtListView.TYPE_LIST_ITEM);

    if (item[ZaCRMadmin.A_countryStatus] == true) {
        var image = AjxImg.getImageHtml("Check");
    } else if (item[ZaCRMadmin.A_countryStatus] == false) {
        var image = AjxImg.getImageHtml("Delete");
    }
    var dataArray = {item: item, headerList: this._headerList, checkImage: image};
    var idx = 0;
    html[idx++] = AjxTemplate.expand("biz_vnc_crm_admin.templates.ListView#listViewStart");
    if (this._headerList) {
        html[idx++] = AjxTemplate.expand("biz_vnc_crm_admin.templates.ListView#countryListViewEnd",dataArray);
    }
    html[idx++] = "</tr></table>";
    div.innerHTML = html.join("");
    return div;
}

ZaCRMadminCountryListView.prototype._setNoResultsHtml = function () {
    var buffer = new AjxBuffer();
    var div = document.createElement("div");

    buffer.append("<table width='100%' cellspacing='0' cellpadding='0'>", "<tr><td class='NoResults'><br>&nbsp", "</td></tr></table>");

    div.innerHTML = buffer.toString();
    this._addRow(div);
};
