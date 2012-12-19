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

biz_vnc_crm_admin.headerList_channel = new Array();
biz_vnc_crm_admin.headerList_channel[0] = new ZaListHeaderItem(ZaCRMadmin.A_channelId, biz_vnc_crm_admin.HDR_id, null, "50px", true, ZaCRMadmin.A_channelId, true, true);
biz_vnc_crm_admin.headerList_channel[1] = new ZaListHeaderItem(ZaCRMadmin.A_channelName, biz_vnc_crm_admin.HDR_name, null, "200px", true, ZaCRMadmin.A_channelName, true, true);
biz_vnc_crm_admin.headerList_channel[2] = new ZaListHeaderItem(ZaCRMadmin.A_channelStatus, biz_vnc_crm_admin.HDR_status, null, "50px", true, ZaCRMadmin.A_channelStatus, true, true);
biz_vnc_crm_admin.headerList_channel[3] = new ZaListHeaderItem(ZaCRMadmin.A_channelCreatedby, biz_vnc_crm_admin.HDR_createdBy, null, "200px", true, ZaCRMadmin.A_channelCreatedby, true, true);
biz_vnc_crm_admin.headerList_channel[4] = new ZaListHeaderItem(ZaCRMadmin.A_channelCreateddate, biz_vnc_crm_admin.HDR_createdDate, null, "150px", true, ZaCRMadmin.A_channelcreateddate, true, true);
biz_vnc_crm_admin.headerList_channel[5] = new ZaListHeaderItem(ZaCRMadmin.A_channelWriteby, biz_vnc_crm_admin.HDR_writeBy, null, "200px", true, ZaCRMadmin.A_channelWriteby, true, true);
biz_vnc_crm_admin.headerList_channel[6] = new ZaListHeaderItem(ZaCRMadmin.A_channelWritedate, biz_vnc_crm_admin.HDR_writeDate, null, "150px", true, ZaCRMadmin.A_channelWritedate, true, true);

var ZaCRMadminChannelListView = function(parent, className, posStyle) {
    ZaListView.call(this, parent, className, posStyle, biz_vnc_crm_admin.headerList_channel);
}

ZaCRMadminChannelListView.prototype = new ZaListView;
ZaCRMadminChannelListView.prototype.constructor = ZaCRMadminChannelListView;

ZaCRMadminChannelListView.prototype.toString = function () {
    return "ZaCRMadminChannelListView";
};

ZaCRMadminChannelListView.prototype._createItemHtml = function (item) {
    var html = new Array(100);
    var div = document.createElement("div");
    div[DwtListView._STYLE_CLASS] = "Row";
    div[DwtListView._SELECTED_STYLE_CLASS] = div[DwtListView._STYLE_CLASS] + "-" + DwtCssStyle.SELECTED;
    div.className = div[DwtListView._STYLE_CLASS];
    this.associateItemWithElement(item, div, DwtListView.TYPE_LIST_ITEM);

    if (item[ZaCRMadmin.A_channelStatus] == true) {
        var image = AjxImg.getImageHtml("Check");
    } else if (item[ZaCRMadmin.A_channelStatus] == false) {
        var image = AjxImg.getImageHtml("Delete");
    }
    var dataArray = {item: item, headerList: this._headerList, checkImage: image};
    var idx = 0;
    html[idx++] = AjxTemplate.expand("biz_vnc_crm_admin.templates.ListView#listViewStart");
    if (this._headerList) {
        html[idx++] = AjxTemplate.expand("biz_vnc_crm_admin.templates.ListView#channelListViewEnd",dataArray);
    }
    html[idx++] = "</tr></table>";
    div.innerHTML = html.join("");
    return div;
}

ZaCRMadminChannelListView.prototype._setNoResultsHtml = function () {
    var buffer = new AjxBuffer();
    var div = document.createElement("div");

    buffer.append("<table width='100%' cellspacing='0' cellpadding='0'>", "<tr><td class='NoResults'><br>&nbsp", "</td></tr></table>");

    div.innerHTML = buffer.toString();
    this._addRow(div);
};
