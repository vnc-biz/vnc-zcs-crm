var headerList_category = new Array();
headerList_category[0] = new ZaListHeaderItem(ZaCRMadmin.A_categoryId, biz_vnc_crm_admin.HDR_id, null, "50px", true, ZaCRMadmin.A_categoryId, true, true);
headerList_category[1] = new ZaListHeaderItem(ZaCRMadmin.A_categoryName, biz_vnc_crm_admin.HDR_name, null, "200px", true, ZaCRMadmin.A_categoryName, true, true);
headerList_category[2] = new ZaListHeaderItem(ZaCRMadmin.A_sales_team_id, biz_vnc_crm_admin.HDR_sales_team_id, null, "150px", true, ZaCRMadmin.A_sales_team_id, true, true);
headerList_category[3] = new ZaListHeaderItem(ZaCRMadmin.A_categoryStatus, biz_vnc_crm_admin.HDR_status, null, "50px", true, ZaCRMadmin.A_categoryStatus, true, true);
headerList_category[4] = new ZaListHeaderItem(ZaCRMadmin.A_categoryCreatedby, biz_vnc_crm_admin.HDR_createdBy, null, "200px", true, ZaCRMadmin.A_categoryCreatedby, true, true);
headerList_category[5] = new ZaListHeaderItem(ZaCRMadmin.A_categoryCreateddate, biz_vnc_crm_admin.HDR_createdDate, null, "200px", true, ZaCRMadmin.A_categorycreateddate, true, true);
headerList_category[6] = new ZaListHeaderItem(ZaCRMadmin.A_categoryWriteby, biz_vnc_crm_admin.HDR_writeBy, null, "200px", true, ZaCRMadmin.A_categoryWriteby, true, true);
headerList_category[7] = new ZaListHeaderItem(ZaCRMadmin.A_categoryWritedate, biz_vnc_crm_admin.HDR_writeDate, null, "200px", true, ZaCRMadmin.A_categoryWritedate, true, true);



function ZaCRMadminCategoryListView(parent, className, posStyle) {
    ZaListView.call(this, parent, className, posStyle, headerList_category);
}

ZaCRMadminCategoryListView.prototype = new ZaListView;
ZaCRMadminCategoryListView.prototype.constructor = ZaCRMadminCategoryListView;

ZaCRMadminCategoryListView.prototype.toString = function () {
    return "ZaCRMadminCategoryListView";
};

ZaCRMadminCategoryListView.prototype._createItemHtml = function (item) {
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
        html[idx++] = item[ZaCRMadmin.A_categoryId];
        html[idx++] = "</td>";

        html[idx++] = "<td align=left height=20px width=" + this._headerList[1]._width + ">";
        html[idx++] = item[ZaCRMadmin.A_categoryName];
        html[idx++] = "</td>";

        html[idx++] = "<td align=left height=20px width=" + this._headerList[2]._width + ">";
        html[idx++] = item[ZaCRMadmin.A_sales_team_id];
        html[idx++] = "</td>";

        html[idx++] = "<td align=left height=20px width=" + this._headerList[3]._width + ">";
        if (item[ZaCRMadmin.A_categoryStatus] == true) {
            html[idx++] = AjxImg.getImageHtml("Check");
        } else if (item[ZaCRMadmin.A_categoryStatus] == false) {
            html[idx++] = AjxImg.getImageHtml("Delete");
        }
        html[idx++] = "</td>";

        html[idx++] = "<td align=left height=20px width=" + this._headerList[4]._width + ">";
        html[idx++] = item[ZaCRMadmin.A_categoryCreatedby];
        html[idx++] = "</td>";

        html[idx++] = "<td align=left height=20px width=" + this._headerList[5]._width + ">";
        html[idx++] = item[ZaCRMadmin.A_categoryCreateddate];
        html[idx++] = "</td>";

        html[idx++] = "<td align=left height=20px width=" + this._headerList[6]._width + ">";
        html[idx++] = item[ZaCRMadmin.A_categoryWriteby];
        html[idx++] = "</td>";

        html[idx++] = "<td align=left height=20px width=" + this._headerList[6]._width + ">";
        html[idx++] = item[ZaCRMadmin.A_categoryWritedate];
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

ZaCRMadminCategoryListView.prototype._setNoResultsHtml = function () {
    var buffer = new AjxBuffer();
    var div = document.createElement("div");

    buffer.append("<table width='100%' cellspacing='0' cellpadding='0'>", "<tr><td class='NoResults'><br>&nbsp", "</td></tr></table>");

    div.innerHTML = buffer.toString();
    this._addRow(div);
};