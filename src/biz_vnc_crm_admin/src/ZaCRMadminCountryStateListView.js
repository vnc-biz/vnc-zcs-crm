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

var headerList_cont_state = new Array();
headerList_cont_state[0] = new ZaListHeaderItem(ZaCRMadmin.A_stateId, biz_vnc_crm_admin.HDR_id, null, "50px", true, ZaCRMadmin.A_stateId, true, true);
headerList_cont_state[1] = new ZaListHeaderItem(ZaCRMadmin.A_stateName, biz_vnc_crm_admin.HDR_name, null, "200px", true, ZaCRMadmin.A_stateName, true, true);
headerList_cont_state[2] = new ZaListHeaderItem(ZaCRMadmin.A_stateCode, biz_vnc_crm_admin.HDR_code, null, "150px", true, ZaCRMadmin.A_stateCode, true, true);
headerList_cont_state[3] = new ZaListHeaderItem(ZaCRMadmin.A_stateCountryName, biz_vnc_crm_admin.TBB_country, null, "150px", true, ZaCRMadmin.A_stateCountryName, true, true);
headerList_cont_state[4] = new ZaListHeaderItem(ZaCRMadmin.A_stateCountryStatus, biz_vnc_crm_admin.HDR_status, null, "50px", true, ZaCRMadmin.A_stateCountryStatus, true, true);
headerList_cont_state[5] = new ZaListHeaderItem(ZaCRMadmin.A_stateCreatedby, biz_vnc_crm_admin.HDR_createdBy, null, "200px", true, ZaCRMadmin.A_stateCreatedby, true, true);
headerList_cont_state[6] = new ZaListHeaderItem(ZaCRMadmin.A_stateCreateddate, biz_vnc_crm_admin.HDR_createdDate, null, "150px", true, ZaCRMadmin.A_stateCreateddate, true, true);
headerList_cont_state[7] = new ZaListHeaderItem(ZaCRMadmin.A_stateWriteby, biz_vnc_crm_admin.HDR_writeBy, null, "200px", true, ZaCRMadmin.A_stateWriteby, true, true);
headerList_cont_state[8] = new ZaListHeaderItem(ZaCRMadmin.A_stateWritedate, biz_vnc_crm_admin.HDR_writeDate, null, "150px", true, ZaCRMadmin.A_stateWritedate, true, true);

function ZaCRMadminCountryStateListView(parent, className, posStyle) {
    ZaListView.call(this, parent, className, posStyle, headerList_cont_state);
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

    var idx = 0;
    html[idx++] = "<table border='0' width='100%' cellspacing='0' cellpadding='0'>";

    html[idx++] = "<tr>";
    if (this._headerList) {
        var cnt = this._headerList.length;

        html[idx++] = "<td align=left height=20px width=" + this._headerList[0]._width + ">";
        html[idx++] = item[ZaCRMadmin.A_stateId];
        html[idx++] = "</td>";

        html[idx++] = "<td align=left height=20px width=" + this._headerList[1]._width + ">";
        html[idx++] = item[ZaCRMadmin.A_stateName];
        html[idx++] = "</td>";

        html[idx++] = "<td align=left height=20px width=" + this._headerList[2]._width + ">";
        html[idx++] = item[ZaCRMadmin.A_stateCode];
        html[idx++] = "</td>";

        html[idx++] = "<td align=left height=20px width=" + this._headerList[3]._width + ">";
        html[idx++] = item[ZaCRMadmin.A_stateCountryName];
        html[idx++] = "</td>";

        html[idx++] = "<td align=left height=20px width=" + this._headerList[4]._width + ">";
        if (item[ZaCRMadmin.A_stateCountryStatus] == true) {
            html[idx++] = AjxImg.getImageHtml("Check");
        } else {
            html[idx++] = AjxImg.getImageHtml("Delete");
        }
        html[idx++] = "</td>";


        html[idx++] = "<td align=left height=20px width=" + this._headerList[5]._width + ">";
        html[idx++] = item[ZaCRMadmin.A_stateCreatedby];
        html[idx++] = "</td>";

        html[idx++] = "<td align=left height=20px width=" + this._headerList[6]._width + ">";
        html[idx++] = item[ZaCRMadmin.A_stateCreateddate];
        html[idx++] = "</td>";

        html[idx++] = "<td align=left height=20px width=" + this._headerList[7]._width + ">";
        html[idx++] = item[ZaCRMadmin.A_stateWriteby];
        html[idx++] = "</td>";

        html[idx++] = "<td align=left height=20px width=" + this._headerList[8]._width + ">";
        html[idx++] = item[ZaCRMadmin.A_stateWritedate];
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

ZaCRMadminCountryStateListView.prototype._setNoResultsHtml = function () {
    var buffer = new AjxBuffer();
    var div = document.createElement("div");

    buffer.append("<table width='100%' cellspacing='0' cellpadding='0'>", "<tr><td class='NoResults'><br>&nbsp", "</td></tr></table>");

    div.innerHTML = buffer.toString();
    this._addRow(div);
};