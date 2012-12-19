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

biz_vnc_crm_admin.headerList_comp = new Array();
biz_vnc_crm_admin.headerList_comp[0] = new ZaListHeaderItem(ZaCRMadmin.A_companyId, biz_vnc_crm_admin.HDR_id, null, "50px", true, ZaCRMadmin.A_companyId, true, true);
biz_vnc_crm_admin.headerList_comp[1] = new ZaListHeaderItem(ZaCRMadmin.A_companyName, biz_vnc_crm_admin.HDR_name, null, "200px", true, ZaCRMadmin.A_companyName, true, true);
biz_vnc_crm_admin.headerList_comp[2] = new ZaListHeaderItem(ZaCRMadmin.A_companyAddress, biz_vnc_crm_admin.HDR_address, null, "200px", true, ZaCRMadmin.A_companyAddress, true, true);
biz_vnc_crm_admin.headerList_comp[3] = new ZaListHeaderItem(ZaCRMadmin.A_companyPhone, biz_vnc_crm_admin.HDR_phone, null, "100px", true, ZaCRMadmin.A_companyPhone, true, true);
biz_vnc_crm_admin.headerList_comp[4] = new ZaListHeaderItem(ZaCRMadmin.A_companyFax, biz_vnc_crm_admin.HDR_fax, null, "100px", true, ZaCRMadmin.A_companyFax, true, true);
biz_vnc_crm_admin.headerList_comp[5] = new ZaListHeaderItem(ZaCRMadmin.A_companyEmail, biz_vnc_crm_admin.HDR_email, null, "150px", true, ZaCRMadmin.A_companyEmail, true, true);
biz_vnc_crm_admin.headerList_comp[6] = new ZaListHeaderItem(ZaCRMadmin.A_companyStatus, biz_vnc_crm_admin.HDR_status, null, "50px", true, ZaCRMadmin.A_companyStatus, true, true);
biz_vnc_crm_admin.headerList_comp[7] = new ZaListHeaderItem(ZaCRMadmin.A_companyCreatedby, biz_vnc_crm_admin.HDR_createdBy, null, "150px", true, ZaCRMadmin.A_companyCreatedby, true, true);
biz_vnc_crm_admin.headerList_comp[8] = new ZaListHeaderItem(ZaCRMadmin.A_companyCreateddate, biz_vnc_crm_admin.HDR_createdDate, null, "150px", true, ZaCRMadmin.A_companyCreateddate, true, true);
biz_vnc_crm_admin.headerList_comp[9] = new ZaListHeaderItem(ZaCRMadmin.A_companyWriteby, biz_vnc_crm_admin.HDR_writeBy, null, "150px", true, ZaCRMadmin.A_companyWriteby, true, true);
biz_vnc_crm_admin.headerList_comp[10] = new ZaListHeaderItem(ZaCRMadmin.A_companyWritedate, biz_vnc_crm_admin.HDR_writeDate, null, "150px", true, ZaCRMadmin.A_companyWritedate, true, true);

var ZaCRMadminCompanyListView = function(parent, className, posStyle) {
    ZaListView.call(this, parent, className, posStyle, biz_vnc_crm_admin.headerList_comp);
}

ZaCRMadminCompanyListView.prototype = new ZaListView;
ZaCRMadminCompanyListView.prototype.constructor = ZaCRMadminCompanyListView;

ZaCRMadminCompanyListView.prototype.toString = function () {
    return "ZaCRMadminCompanyListView";
};

ZaCRMadminCompanyListView.prototype._createItemHtml = function (item) {

    var html = new Array(100);
    var div = document.createElement("div");
    div[DwtListView._STYLE_CLASS] = "Row";
    div[DwtListView._SELECTED_STYLE_CLASS] = div[DwtListView._STYLE_CLASS] + "-" + DwtCssStyle.SELECTED;
    div.className = div[DwtListView._STYLE_CLASS];
    this.associateItemWithElement(item, div, DwtListView.TYPE_LIST_ITEM);
	
    if (item[ZaCRMadmin.A_companyStatus] == true) {
        var image = AjxImg.getImageHtml("Check");
    } else if (item[ZaCRMadmin.A_companyStatus] == false) {
        var image = AjxImg.getImageHtml("Delete");
    }
    var dataArray = {item: item, headerList: this._headerList, checkImage: image};
    var idx = 0;
    html[idx++] = AjxTemplate.expand("biz_vnc_crm_admin.templates.ListView#listViewStart");
    if (this._headerList) {
        html[idx++] = AjxTemplate.expand("biz_vnc_crm_admin.templates.ListView#companyListViewEnd",dataArray);
    }
    html[idx++] = "</tr></table>";
    div.innerHTML = html.join("");
    return div;
}

ZaCRMadminCompanyListView.prototype._setNoResultsHtml = function () {
    var buffer = new AjxBuffer();
    var div = document.createElement("div");

    buffer.append("<table width='100%' cellspacing='0' cellpadding='0'>", "<tr><td class='NoResults'><br>&nbsp", "</td></tr></table>");

    div.innerHTML = buffer.toString();
    this._addRow(div);
};
