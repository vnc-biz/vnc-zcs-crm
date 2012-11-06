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

var headerList_cont = new Array();
headerList_cont[0] = new ZaListHeaderItem(ZaCRMadmin.A_countryId, biz_vnc_crm_admin.HDR_id, null, "50px", true, ZaCRMadmin.A_countryId, true, true);
headerList_cont[1] = new ZaListHeaderItem(ZaCRMadmin.A_countryName, biz_vnc_crm_admin.HDR_name, null, "200px", true, ZaCRMadmin.A_countryName, true, true);
headerList_cont[2] = new ZaListHeaderItem(ZaCRMadmin.A_countryCode, biz_vnc_crm_admin.HDR_code, null, "150px", true, ZaCRMadmin.A_countryCode, true, true);
headerList_cont[3] = new ZaListHeaderItem(ZaCRMadmin.A_countryStatus, biz_vnc_crm_admin.HDR_status, null, "50px", true, ZaCRMadmin.A_countryStatus, true, true);
headerList_cont[4] = new ZaListHeaderItem(ZaCRMadmin.A_countryCreatedby, biz_vnc_crm_admin.HDR_createdBy, null, "200px", true, ZaCRMadmin.A_countryCreatedby, true, true);
headerList_cont[5] = new ZaListHeaderItem(ZaCRMadmin.A_countryCreateddate, biz_vnc_crm_admin.HDR_createdDate, null, "200px", true, ZaCRMadmin.A_countryCreateddate, true, true);
headerList_cont[6] = new ZaListHeaderItem(ZaCRMadmin.A_countryWriteby, biz_vnc_crm_admin.HDR_writeBy, null, "200px", true, ZaCRMadmin.A_countryWriteby, true, true);
headerList_cont[7] = new ZaListHeaderItem(ZaCRMadmin.A_countryWritedate, biz_vnc_crm_admin.HDR_writeDate, null, "200px", true, ZaCRMadmin.A_countryWritedate, true, true);

var ZaCRMadminCountryListView = function(parent, className, posStyle) {
    ZaListView.call(this, parent, className, posStyle, headerList_cont);
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

    var idx = 0;
    html[idx++] = "<table border='0' width='100%' cellspacing='0' cellpadding='0'>";

    html[idx++] = "<tr>";
    if (this._headerList) {
        var cnt = this._headerList.length;

        html[idx++] = "<td align=left height=20px width=" + this._headerList[0]._width + ">";
        html[idx++] = item[ZaCRMadmin.A_countryId];
        html[idx++] = "</td>";

        html[idx++] = "<td align=left height=20px width=" + this._headerList[1]._width + ">";
        html[idx++] = item[ZaCRMadmin.A_countryName];
        html[idx++] = "</td>";

        html[idx++] = "<td align=left height=20px width=" + this._headerList[2]._width + ">";
        html[idx++] = item[ZaCRMadmin.A_countryCode];
        html[idx++] = "</td>";

        html[idx++] = "<td align=left height=20px width=" + this._headerList[3]._width + ">";
        if (item[ZaCRMadmin.A_countryStatus] == true) {
            html[idx++] = AjxImg.getImageHtml("Check");
        } else {
            html[idx++] = AjxImg.getImageHtml("Delete");
        }
        html[idx++] = "</td>";

        html[idx++] = "<td align=left height=20px width=" + this._headerList[4]._width + ">";
        html[idx++] = item[ZaCRMadmin.A_countryCreatedby];
        html[idx++] = "</td>";

        html[idx++] = "<td align=left height=20px width=" + this._headerList[5]._width + ">";
        html[idx++] = item[ZaCRMadmin.A_countryCreateddate];
        html[idx++] = "</td>";

        html[idx++] = "<td align=left height=20px width=" + this._headerList[6]._width + ">";
        html[idx++] = item[ZaCRMadmin.A_countryWriteby];
        html[idx++] = "</td>";

        html[idx++] = "<td align=left height=20px width=" + this._headerList[7]._width + ">";
        html[idx++] = item[ZaCRMadmin.A_countryWritedate];
        html[idx++] = "</td>";
    } else {
        html[idx++] = "<td width=100%>";
        html[idx++] = AjxStringUtil.htmlEncode(item);
        html[idx++] = "</td>";
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
