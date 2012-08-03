var headerList_channel = new Array();
headerList_channel[0] = new ZaListHeaderItem(ZaCRMadmin.A_channelId, biz_vnc_crm_admin.HDR_id, null, "50px", true, ZaCRMadmin.A_channelId, true, true);
headerList_channel[1] = new ZaListHeaderItem(ZaCRMadmin.A_channelName, biz_vnc_crm_admin.HDR_name, null, "200px", true, ZaCRMadmin.A_channelName, true, true);
headerList_channel[2] = new ZaListHeaderItem(ZaCRMadmin.A_channelStatus, biz_vnc_crm_admin.HDR_status, null, "50px", true, ZaCRMadmin.A_channelStatus, true, true);
headerList_channel[3] = new ZaListHeaderItem(ZaCRMadmin.A_channelCreatedby, biz_vnc_crm_admin.HDR_createdBy, null, "200px", true, ZaCRMadmin.A_channelCreatedby, true, true);
headerList_channel[4] = new ZaListHeaderItem(ZaCRMadmin.A_channelCreateddate, biz_vnc_crm_admin.HDR_createdDate, null, "150px", true, ZaCRMadmin.A_channelcreateddate, true, true);
headerList_channel[5] = new ZaListHeaderItem(ZaCRMadmin.A_channelWriteby, biz_vnc_crm_admin.HDR_writeBy, null, "200px", true, ZaCRMadmin.A_channelWriteby, true, true);
headerList_channel[6] = new ZaListHeaderItem(ZaCRMadmin.A_channelWritedate, biz_vnc_crm_admin.HDR_writeDate, null, "150px", true, ZaCRMadmin.A_channelWritedate, true, true);



function ZaCRMadminChannelListView(parent, className, posStyle) {
    ZaListView.call(this, parent, className, posStyle, headerList_channel);
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

    var idx = 0;
    html[idx++] = "<table border='0' width='100%' cellspacing='0' cellpadding='0'>";

    html[idx++] = "<tr>";
    if (this._headerList) {
        var cnt = this._headerList.length;


        html[idx++] = "<td align=left height=20px width=" + this._headerList[0]._width + ">";
        html[idx++] = item[ZaCRMadmin.A_channelId];
        html[idx++] = "</td>";

        html[idx++] = "<td align=left height=20px width=" + this._headerList[1]._width + ">";
        html[idx++] = item[ZaCRMadmin.A_channelName];
        html[idx++] = "</td>";

        html[idx++] = "<td align=left height=20px width=" + this._headerList[2]._width + ">";
        if (item[ZaCRMadmin.A_channelStatus] == true) {
            html[idx++] = AjxImg.getImageHtml("Check");
        } else {
            html[idx++] = AjxImg.getImageHtml("Delete");
        }
        html[idx++] = "</td>";

        html[idx++] = "<td align=left height=20px width=" + this._headerList[3]._width + ">";
        html[idx++] = item[ZaCRMadmin.A_channelCreatedby];
        html[idx++] = "</td>";

        html[idx++] = "<td align=left height=20px width=" + this._headerList[4]._width + ">";
        html[idx++] = item[ZaCRMadmin.A_channelCreateddate];
        html[idx++] = "</td>";

        html[idx++] = "<td align=left height=20px width=" + this._headerList[5]._width + ">";
        html[idx++] = item[ZaCRMadmin.A_channelWriteby];
        html[idx++] = "</td>";

        html[idx++] = "<td align=left height=20px width=" + this._headerList[6]._width + ">";
        html[idx++] = item[ZaCRMadmin.A_channelWritedate];
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

ZaCRMadminChannelListView.prototype._setNoResultsHtml = function () {
    var buffer = new AjxBuffer();
    var div = document.createElement("div");

    buffer.append("<table width='100%' cellspacing='0' cellpadding='0'>", "<tr><td class='NoResults'><br>&nbsp", "</td></tr></table>");

    div.innerHTML = buffer.toString();
    this._addRow(div);
};