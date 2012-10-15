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

var headerList_leadClass = new Array();
headerList_leadClass[0] = new ZaListHeaderItem(ZaCRMadmin.A_leadClassId, biz_vnc_crm_admin.HDR_id, null, "50px", true, ZaCRMadmin.A_leadClassId, true, true);
headerList_leadClass[1] = new ZaListHeaderItem(ZaCRMadmin.A_leadClassName, biz_vnc_crm_admin.HDR_name, null, "200px", true, ZaCRMadmin.A_leadClassName, true, true);
headerList_leadClass[2] = new ZaListHeaderItem(ZaCRMadmin.A_leadClassStatus, biz_vnc_crm_admin.HDR_status, null, "50px", true, ZaCRMadmin.A_leadClassStatus, true, true);
headerList_leadClass[3] = new ZaListHeaderItem(ZaCRMadmin.A_leadClassCreatedby, biz_vnc_crm_admin.HDR_createdBy, null, "200px", true, ZaCRMadmin.A_leadClassCreatedby, true, true);
headerList_leadClass[4] = new ZaListHeaderItem(ZaCRMadmin.A_leadClassCreateddate, biz_vnc_crm_admin.HDR_createdDate, null, "150px", true, ZaCRMadmin.A_leadClasscreateddate, true, true);
headerList_leadClass[5] = new ZaListHeaderItem(ZaCRMadmin.A_leadClassWriteby, biz_vnc_crm_admin.HDR_writeBy, null, "200px", true, ZaCRMadmin.A_leadClassWriteby, true, true);
headerList_leadClass[6] = new ZaListHeaderItem(ZaCRMadmin.A_leadClassWritedate, biz_vnc_crm_admin.HDR_writeDate, null, "150px", true, ZaCRMadmin.A_leadClassWritedate, true, true);

function ZaCRMadminLeadClassListView(parent, className, posStyle) {
    ZaListView.call(this, parent, className, posStyle, headerList_leadClass);
}

ZaCRMadminLeadClassListView.prototype = new ZaListView;
ZaCRMadminLeadClassListView.prototype.constructor = ZaCRMadminLeadClassListView;

ZaCRMadminLeadClassListView.prototype.toString = function () {
    return "ZaCRMadminLeadClassListView";
};

ZaCRMadminLeadClassListView.prototype._createItemHtml = function (item) {
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
        html[idx++] = item[ZaCRMadmin.A_leadClassId];
        html[idx++] = "</td>";

        html[idx++] = "<td align=left height=20px width=" + this._headerList[1]._width + ">";
        html[idx++] = item[ZaCRMadmin.A_leadClassName];
        html[idx++] = "</td>";

        html[idx++] = "<td align=left height=20px width=" + this._headerList[2]._width + ">";
        if (item[ZaCRMadmin.A_leadClassStatus] == true) {
            html[idx++] = AjxImg.getImageHtml("Check");
        } else {
            html[idx++] = AjxImg.getImageHtml("Delete");
        }
        html[idx++] = "</td>";

        html[idx++] = "<td align=left height=20px width=" + this._headerList[3]._width + ">";
        html[idx++] = item[ZaCRMadmin.A_leadClassCreatedby];
        html[idx++] = "</td>";

        html[idx++] = "<td align=left height=20px width=" + this._headerList[4]._width + ">";
        html[idx++] = item[ZaCRMadmin.A_leadClassCreateddate];
        html[idx++] = "</td>";

        html[idx++] = "<td align=left height=20px width=" + this._headerList[5]._width + ">";
        html[idx++] = item[ZaCRMadmin.A_leadClassWriteby];
        html[idx++] = "</td>";

        html[idx++] = "<td align=left height=20px width=" + this._headerList[6]._width + ">";
        html[idx++] = item[ZaCRMadmin.A_leadClassWritedate];
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

ZaCRMadminLeadClassListView.prototype._setNoResultsHtml = function () {
    var buffer = new AjxBuffer();
    var div = document.createElement("div");

    buffer.append("<table width='100%' cellspacing='0' cellpadding='0'>", "<tr><td class='NoResults'><br>&nbsp", "</td></tr></table>");

    div.innerHTML = buffer.toString();
    this._addRow(div);
};
