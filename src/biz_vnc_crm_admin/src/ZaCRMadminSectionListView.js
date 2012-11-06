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

var headerList_section = new Array();
headerList_section[0] = new ZaListHeaderItem(ZaCRMadmin.A_sectionId, biz_vnc_crm_admin.HDR_id, null, "50px", true, ZaCRMadmin.A_sectionId, true, true);
headerList_section[1] = new ZaListHeaderItem(ZaCRMadmin.A_sectionName, biz_vnc_crm_admin.HDR_name, null, "150px", true, ZaCRMadmin.A_sectionName, true, true);
headerList_section[2] = new ZaListHeaderItem(ZaCRMadmin.A_sectionCode, biz_vnc_crm_admin.HDR_code, null, "100px", true, ZaCRMadmin.A_sectionCode, true, true);
headerList_section[3] = new ZaListHeaderItem(ZaCRMadmin.A_sectionManagerId, biz_vnc_crm_admin.HDR_sectionManagerId, null, "150px", true, ZaCRMadmin.A_sectionManagerId, true, true);
headerList_section[4] = new ZaListHeaderItem(ZaCRMadmin.A_sectionLeaderId, biz_vnc_crm_admin.HDR_sectionLeaderId, null, "150px", true, ZaCRMadmin.A_sectionLeaderId, true, true);
headerList_section[5] = new ZaListHeaderItem(ZaCRMadmin.A_sectionWatcherId, biz_vnc_crm_admin.HDR_sectionWatcherId, null, "150px", true, ZaCRMadmin.A_sectionWatcherId, true, true);
headerList_section[6] = new ZaListHeaderItem(ZaCRMadmin.A_sectionStatus, biz_vnc_crm_admin.HDR_status, null, "50px", true, ZaCRMadmin.A_sectionStatus, true, true);
headerList_section[7] = new ZaListHeaderItem(ZaCRMadmin.A_sectionCreatedby, biz_vnc_crm_admin.HDR_createdBy, null, "150px", true, ZaCRMadmin.A_sectionCreatedby, true, true);
headerList_section[8] = new ZaListHeaderItem(ZaCRMadmin.A_sectionCreateddate, biz_vnc_crm_admin.HDR_createdDate, null, "150px", true, ZaCRMadmin.A_stateCreateddate, true, true);
headerList_section[9] = new ZaListHeaderItem(ZaCRMadmin.A_sectionWriteby, biz_vnc_crm_admin.HDR_writeBy, null, "150px", true, ZaCRMadmin.A_A_sectionWriteby, true, true);
headerList_section[10] = new ZaListHeaderItem(ZaCRMadmin.A_sectionWritedate, biz_vnc_crm_admin.HDR_writeDate, null, "150px", true, ZaCRMadmin.A_sectionWritedate, true, true);

var ZaCRMadminSectionListView = function(parent, className, posStyle) {
    ZaListView.call(this, parent, className, posStyle, headerList_section);
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

    var idx = 0;
    html[idx++] = "<table border='0' width='100%' cellspacing='0' cellpadding='0'>";

    html[idx++] = "<tr>";
    if (this._headerList) {
        var cnt = this._headerList.length;


        html[idx++] = "<td align=left height=20px width=" + this._headerList[0]._width + ">";
        html[idx++] = item[ZaCRMadmin.A_sectionId];
        html[idx++] = "</td>";

        html[idx++] = "<td align=left height=20px width=" + this._headerList[1]._width + ">";
        html[idx++] = item[ZaCRMadmin.A_sectionName];
        html[idx++] = "</td>";

        html[idx++] = "<td align=left height=20px width=" + this._headerList[2]._width + ">";
        html[idx++] = item[ZaCRMadmin.A_sectionCode];
        html[idx++] = "</td>";

        html[idx++] = "<td align=left height=20px width=" + this._headerList[3]._width + ">";
        html[idx++] = item[ZaCRMadmin.A_sectionManagerId];
        html[idx++] = "</td>";

        html[idx++] = "<td align=left height=20px width=" + this._headerList[4]._width + ">";
        html[idx++] = item[ZaCRMadmin.A_sectionLeaderId];
        html[idx++] = "</td>";

        html[idx++] = "<td align=left height=20px width=" + this._headerList[5]._width + ">";
        html[idx++] = item[ZaCRMadmin.A_sectionWatcherId];
        html[idx++] = "</td>";

        html[idx++] = "<td align=left height=20px width=" + this._headerList[6]._width + ">";
        if (item[ZaCRMadmin.A_sectionStatus] == true) {
            html[idx++] = AjxImg.getImageHtml("Check");
        } else {
            html[idx++] = AjxImg.getImageHtml("Delete");
        }
        html[idx++] = "</td>";

        html[idx++] = "<td align=left height=20px width=" + this._headerList[7]._width + ">";
        html[idx++] = item[ZaCRMadmin.A_sectionCreatedby];
        html[idx++] = "</td>";

        html[idx++] = "<td align=left height=20px width=" + this._headerList[8]._width + ">";
        html[idx++] = item[ZaCRMadmin.A_sectionCreateddate];
        html[idx++] = "</td>";

        html[idx++] = "<td align=left height=20px width=" + this._headerList[9]._width + ">";
        html[idx++] = item[ZaCRMadmin.A_sectionWriteby];
        html[idx++] = "</td>";

        html[idx++] = "<td align=left height=20px width=" + this._headerList[10]._width + ">";
        html[idx++] = item[ZaCRMadmin.A_sectionWritedate];
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

ZaCRMadminSectionListView.prototype._setNoResultsHtml = function () {
    var buffer = new AjxBuffer();
    var div = document.createElement("div");

    buffer.append("<table width='100%' cellspacing='0' cellpadding='0'>", "<tr><td class='NoResults'><br>&nbsp", "</td></tr></table>");

    div.innerHTML = buffer.toString();
    this._addRow(div);
};
