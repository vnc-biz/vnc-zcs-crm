var headerList_stage = new Array();
	headerList_stage[0] = new ZaListHeaderItem(ZaCRMadmin.A_id, biz_vnc_crm_admin.HDR_id, null, "50px", true,ZaCRMadmin.A_stageId,true, true);
	headerList_stage[1] = new ZaListHeaderItem(ZaCRMadmin.A_name, biz_vnc_crm_admin.HDR_name, null, "150px", true,ZaCRMadmin.A_stageName,true, true);
	headerList_stage[2] = new ZaListHeaderItem(ZaCRMadmin.A_stageSequence, biz_vnc_crm_admin.HDR_stageSequence, null, "70px", true,ZaCRMadmin.A_stageSequence,true, true);
	headerList_stage[3] = new ZaListHeaderItem(ZaCRMadmin.A_stageType, biz_vnc_crm_admin.HDR_stageType, null, "100px", true,ZaCRMadmin.A_stageType,true, true);
	headerList_stage[4] = new ZaListHeaderItem(ZaCRMadmin.A_stageState, biz_vnc_crm_admin.HDR_stageState, null, "100px", true,ZaCRMadmin.A_stageState,true, true);
	headerList_stage[5] = new ZaListHeaderItem(ZaCRMadmin.A_stageProbability, biz_vnc_crm_admin.HDR_stageProb, null, "80px", true,ZaCRMadmin.A_stageProbability,true, true);
	headerList_stage[6] = new ZaListHeaderItem(ZaCRMadmin.A_stageDescription, biz_vnc_crm_admin.HDR_stageDesc, null, "200px", true,ZaCRMadmin.A_stageDescription,true, true);
	headerList_stage[7] = new ZaListHeaderItem(ZaCRMadmin.A_stageAuto, biz_vnc_crm_admin.HDR_stageAuto, null, "50px", true,ZaCRMadmin.A_stageAuto,true, true);
	headerList_stage[8] = new ZaListHeaderItem(ZaCRMadmin.A_stageStatus, biz_vnc_crm_admin.HDR_status, null, "50px", true,ZaCRMadmin.A_stageStatus,true, true);
	headerList_stage[9] = new ZaListHeaderItem(ZaCRMadmin.A_stageCreatedby, biz_vnc_crm_admin.HDR_createdBy, null, "150px", true,ZaCRMadmin.A_stageCreatedby,true, true);
	headerList_stage[10] = new ZaListHeaderItem(ZaCRMadmin.A_stageCreateddate, biz_vnc_crm_admin.HDR_createdDate, null, "125px", true,ZaCRMadmin.A_stagecreateddate,true, true);
	headerList_stage[11] = new ZaListHeaderItem(ZaCRMadmin.A_stageWriteby, biz_vnc_crm_admin.HDR_writeBy, null, "150px", true,ZaCRMadmin.A_stageWriteby,true, true);
	headerList_stage[12] = new ZaListHeaderItem(ZaCRMadmin.A_stageWritedate, biz_vnc_crm_admin.HDR_writeDate, null, "125px", true,ZaCRMadmin.A_stageWritedate,true, true);

function ZaCRMadminStageListView(parent, className, posStyle) {
	ZaListView.call(this, parent, className, posStyle, headerList_stage);
}

ZaCRMadminStageListView.prototype = new ZaListView;
ZaCRMadminStageListView.prototype.constructor = ZaCRMadminStageListView;

ZaCRMadminStageListView.prototype.toString = function() {
	return "ZaCRMadminStageListView";
};

ZaCRMadminStageListView.prototype._createItemHtml =
function(item) {
	var html = new Array(100);
	var div = document.createElement("div");
	div[DwtListView._STYLE_CLASS] = "Row";
	div[DwtListView._SELECTED_STYLE_CLASS] = div[DwtListView._STYLE_CLASS] + "-" + DwtCssStyle.SELECTED;
	div.className = div[DwtListView._STYLE_CLASS];
	this.associateItemWithElement(item, div, DwtListView.TYPE_LIST_ITEM);
	
	var idx = 0;
	html[idx++] = "<table border='0' width='100%' cellspacing='0' cellpadding='0'>";

	html[idx++] = "<tr>";
	if(this._headerList) {
		var cnt = this._headerList.length;
		
		 
				html[idx++] = "<td align=left height=20px width=" + this._headerList[0]._width + ">";
				html[idx++] = item[ZaCRMadmin.A_stageId];
				html[idx++] = "</td>";
			
				html[idx++] = "<td align=left height=20px width=" + this._headerList[1]._width + ">";
				html[idx++] = item[ZaCRMadmin.A_stageName];
				html[idx++] = "</td>";

				html[idx++] = "<td align=left height=20px width=" + this._headerList[2]._width + ">";
				html[idx++] = item[ZaCRMadmin.A_stageSequence];
				html[idx++] = "</td>";

				html[idx++] = "<td align=left height=20px width=" + this._headerList[3]._width + ">";
				if(item[ZaCRMadmin.A_stageType]==0){
					html[idx++] = "Lead";
				}
				else if(item[ZaCRMadmin.A_stageType]==1){
					html[idx++] = "Opportunity";
				}
				html[idx++] = "</td>";

				html[idx++] = "<td align=left height=20px width=" + this._headerList[4]._width + ">";
				html[idx++] = item[ZaCRMadmin.A_stageState];
				html[idx++] = "</td>";



				html[idx++] = "<td align=left height=20px width=" + this._headerList[5]._width + ">";
				html[idx++] = item[ZaCRMadmin.A_stageProbability];
				html[idx++] = "</td>";

				html[idx++] = "<td align=left height=20px width=" + this._headerList[6]._width + ">";
				html[idx++] = item[ZaCRMadmin.A_stageDescription];
				html[idx++] = "</td>";

				html[idx++] = "<td align=left height=20px width=" + this._headerList[7]._width + ">";
				if(item[ZaCRMadmin.A_stageAuto]==true){
					html[idx++] = AjxImg.getImageHtml("Check");
				}
				else{
					html[idx++] = AjxImg.getImageHtml("Delete");
				}
				html[idx++] = "</td>";

				html[idx++] = "<td align=left height=20px width=" + this._headerList[8]._width + ">";
				if(item[ZaCRMadmin.A_stageStatus]==true){
					html[idx++] = AjxImg.getImageHtml("Check");
				}
				else{
					html[idx++] = AjxImg.getImageHtml("Delete");
				}
				html[idx++] = "</td>";

				html[idx++] = "<td align=left height=20px width=" + this._headerList[9]._width + ">";
				html[idx++] = item[ZaCRMadmin.A_stageCreatedby];
				html[idx++] = "</td>";

				html[idx++] = "<td align=left height=20px width=" + this._headerList[10]._width + ">";
				html[idx++] = item[ZaCRMadmin.A_stageCreateddate];
				html[idx++] = "</td>";

				
				html[idx++] = "<td align=left height=20px width=" + this._headerList[11]._width + ">";
				html[idx++] = item[ZaCRMadmin.A_stageWriteby];
				html[idx++] = "</td>";

				
				html[idx++] = "<td align=left height=20px width=" + this._headerList[12]._width + ">";
				html[idx++] = item[ZaCRMadmin.A_stageWritedate];
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

ZaCRMadminStageListView.prototype._setNoResultsHtml = function() {
	var buffer = new AjxBuffer();
	var	div = document.createElement("div");
	
	buffer.append("<table width='100%' cellspacing='0' cellpadding='0'>",
				  "<tr><td class='NoResults'><br>&nbsp",
				  "</td></tr></table>");
	
	div.innerHTML = buffer.toString();
	this._addRow(div);
};

