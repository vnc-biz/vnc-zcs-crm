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

biz_vnc_crm_admin.headerList_stage = new Array();
biz_vnc_crm_admin.headerList_stage[0] = new ZaListHeaderItem(ZaCRMadmin.A_id, biz_vnc_crm_admin.HDR_id, null, "50px", true, ZaCRMadmin.A_stageId, true, true);
biz_vnc_crm_admin.headerList_stage[1] = new ZaListHeaderItem(ZaCRMadmin.A_name, biz_vnc_crm_admin.HDR_name, null, "150px", true, ZaCRMadmin.A_stageName, true, true);
biz_vnc_crm_admin.headerList_stage[2] = new ZaListHeaderItem(ZaCRMadmin.A_stageSequence, biz_vnc_crm_admin.HDR_stageSequence, null, "70px", true, ZaCRMadmin.A_stageSequence, true, true);
biz_vnc_crm_admin.headerList_stage[3] = new ZaListHeaderItem(ZaCRMadmin.A_stageType, biz_vnc_crm_admin.HDR_stageType, null, "100px", true, ZaCRMadmin.A_stageType, true, true);
biz_vnc_crm_admin.headerList_stage[4] = new ZaListHeaderItem(ZaCRMadmin.A_stageState, biz_vnc_crm_admin.HDR_stageState, null, "100px", true, ZaCRMadmin.A_stageState, true, true);
biz_vnc_crm_admin.headerList_stage[5] = new ZaListHeaderItem(ZaCRMadmin.A_stageProbability, biz_vnc_crm_admin.HDR_stageProb, null, "80px", true, ZaCRMadmin.A_stageProbability, true, true);
biz_vnc_crm_admin.headerList_stage[6] = new ZaListHeaderItem(ZaCRMadmin.A_stageDescription, biz_vnc_crm_admin.HDR_stageDesc, null, "200px", true, ZaCRMadmin.A_stageDescription, true, true);
biz_vnc_crm_admin.headerList_stage[7] = new ZaListHeaderItem(ZaCRMadmin.A_stageAuto, biz_vnc_crm_admin.HDR_stageAuto, null, "50px", true, ZaCRMadmin.A_stageAuto, true, true);
biz_vnc_crm_admin.headerList_stage[8] = new ZaListHeaderItem(ZaCRMadmin.A_stageStatus, biz_vnc_crm_admin.HDR_status, null, "50px", true, ZaCRMadmin.A_stageStatus, true, true);
biz_vnc_crm_admin.headerList_stage[9] = new ZaListHeaderItem(ZaCRMadmin.A_stageCreatedby, biz_vnc_crm_admin.HDR_createdBy, null, "150px", true, ZaCRMadmin.A_stageCreatedby, true, true);
biz_vnc_crm_admin.headerList_stage[10] = new ZaListHeaderItem(ZaCRMadmin.A_stageCreateddate, biz_vnc_crm_admin.HDR_createdDate, null, "125px", true, ZaCRMadmin.A_stagecreateddate, true, true);
biz_vnc_crm_admin.headerList_stage[11] = new ZaListHeaderItem(ZaCRMadmin.A_stageWriteby, biz_vnc_crm_admin.HDR_writeBy, null, "150px", true, ZaCRMadmin.A_stageWriteby, true, true);
biz_vnc_crm_admin.headerList_stage[12] = new ZaListHeaderItem(ZaCRMadmin.A_stageWritedate, biz_vnc_crm_admin.HDR_writeDate, null, "125px", true, ZaCRMadmin.A_stageWritedate, true, true);

var ZaCRMadminStageListView = function(parent, className, posStyle) {
    ZaListView.call(this, parent, className, posStyle, biz_vnc_crm_admin.headerList_stage);
}

ZaCRMadminStageListView.prototype = new ZaListView;
ZaCRMadminStageListView.prototype.constructor = ZaCRMadminStageListView;

ZaCRMadminStageListView.prototype.toString = function () {
    return "ZaCRMadminStageListView";
};

ZaCRMadminStageListView.prototype._createItemHtml = function (item) {
    var html = new Array(100);
    var div = document.createElement("div");
    div[DwtListView._STYLE_CLASS] = "Row";
    div[DwtListView._SELECTED_STYLE_CLASS] = div[DwtListView._STYLE_CLASS] + "-" + DwtCssStyle.SELECTED;
    div.className = div[DwtListView._STYLE_CLASS];
    this.associateItemWithElement(item, div, DwtListView.TYPE_LIST_ITEM);

    if (item[ZaCRMadmin.A_leadClassStatus] == true) {
        var image = AjxImg.getImageHtml("Check");
    } else if (item[ZaCRMadmin.A_leadClassStatus] == false) {
        var image = AjxImg.getImageHtml("Delete");
    }
    if (item[ZaCRMadmin.A_stageType] == 0) {
        var type = "Lead";
    } else if (item[ZaCRMadmin.A_stageType] == 1) {
        var type = "Opportunity";
    }
    if (item[ZaCRMadmin.A_stageAuto] == true) {
        var auto = AjxImg.getImageHtml("Check");
    } else {
        var auto = AjxImg.getImageHtml("Delete");
    }
    var dataArray = {item: item, headerList: this._headerList, checkImage: image, type: type, auto: auto};
    var idx = 0;
    html[idx++] = AjxTemplate.expand("biz_vnc_crm_admin.templates.ListView#listViewStart");
    if (this._headerList) {
        html[idx++] = AjxTemplate.expand("biz_vnc_crm_admin.templates.ListView#stageListViewEnd",dataArray);
    }
    html[idx++] = "</tr></table>";
    div.innerHTML = html.join("");
    return div;
}

ZaCRMadminStageListView.prototype._setNoResultsHtml = function () {
    var buffer = new AjxBuffer();
    var div = document.createElement("div");

    buffer.append("<table width='100%' cellspacing='0' cellpadding='0'>", "<tr><td class='NoResults'><br>&nbsp", "</td></tr></table>");

    div.innerHTML = buffer.toString();
    this._addRow(div);
};
