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

ZaItem.CRM_ADMIN = "ZaCRMadmin";

function ZaCRMadmin(app) {
    ZaItem.call(app, "ZaCRMadmin");
    this.type = ZaItem.CRM_ADMIN;
    this._init(app);
}

ZaCRMadmin.prototype = new ZaItem;
ZaCRMadmin.prototype.constructor = ZaCRMadmin;

ZaCRMadmin.A_company_list_cache = "company_list_cache";
ZaCRMadmin.A_company = "company";
ZaCRMadmin.A_companyId = "companyId";
ZaCRMadmin.A_companyName = "companyName";
ZaCRMadmin.A_companyAddress = "companyAddress";
ZaCRMadmin.A_companyPhone = "companyPhone";
ZaCRMadmin.A_companyFax = "companyFax";
ZaCRMadmin.A_companyEmail = "companyEmail";
ZaCRMadmin.A_companyStatus = "status";
ZaCRMadmin.A_companyCreatedby = "createBy";
ZaCRMadmin.A_companyCreateddate = "createDate";
ZaCRMadmin.A_companyWriteby = "writeBy";
ZaCRMadmin.A_companyWritedate = "writeDate";
ZaCRMadmin.A_companyRemoved = "companyRemoved";

ZaCRMadmin.companyList = {
    items: [{
        id: ZaCRMadmin.A_companyId,
        type: _NUMBER_,
        ref: ZaCRMadmin.A_companyId
    }, {
        id: ZaCRMadmin.A_companyName,
        type: _STRING_,
        ref: ZaCRMadmin.A_companyName
    }, {
        id: ZaCRMadmin.A_companyAddress,
        type: _STRING_,
        ref: ZaCRMadmin.A_companyAddress
    }, {
        id: ZaCRMadmin.A_companyPhone,
        type: _STRING_,
        ref: ZaCRMadmin.A_companyPhone
    }, {
        id: ZaCRMadmin.A_companyFax,
        type: _STRING_,
        ref: ZaCRMadmin.A_companyFax
    }, {
        id: ZaCRMadmin.A_companyEmail,
        type: _STRING_,
        ref: ZaCRMadmin.A_companyEmail
    }, {
        id: ZaCRMadmin.A_companyStatus,
        type: _ENUM_,
        choices: [false, true],
        defaultValue: true
    }, {
        id: ZaCRMadmin.A_companyCreatedby,
        type: _STRING_,
        ref: ZaCRMadmin.A_companyCreatedby
    }, {
        id: ZaCRMadmin.A_companyCreateddate,
        type: _STRING_,
        ref: ZaCRMadmin.A_companyCreateddate
    }, {
        id: ZaCRMadmin.A_companyWriteby,
        type: _STRING_,
        ref: ZaCRMadmin.A_companyWriteby
    }, {
        id: ZaCRMadmin.A_companyWritedate,
        type: _STRING_,
        ref: ZaCRMadmin.A_companyWritedate
    }],
    type: _OBJECT_
}

// Country list
ZaCRMadmin.A_country_list_cache = "country_list_cache";
ZaCRMadmin.A_country = "country";
ZaCRMadmin.A_countryId = "countryId";
ZaCRMadmin.A_countryName = "countryName";
ZaCRMadmin.A_countryCode = "countryCode";
ZaCRMadmin.A_countryStatus = "status";
ZaCRMadmin.A_countryCreatedby = "createBy";
ZaCRMadmin.A_countryCreateddate = "createDate";
ZaCRMadmin.A_countryWriteby = "writeBy";
ZaCRMadmin.A_countryWritedate = "writeDate";
ZaCRMadmin.A_countryRemoved = "countryRemoved";

ZaCRMadmin.countryList = {
    items: [{
        id: ZaCRMadmin.A_countryId,
        type: _NUMBER_,
        ref: ZaCRMadmin.A_countryId
    }, {
        id: ZaCRMadmin.A_countryName,
        type: _STRING_,
        ref: ZaCRMadmin.A_countryName
    }, {
        id: ZaCRMadmin.A_countryCode,
        type: _STRING_,
        ref: ZaCRMadmin.A_countryCode
    }, {
        id: ZaCRMadmin.A_countryStatus,
        type: _ENUM_,
        choices: [false, true],
        defaultValue: true
    }, {
        id: ZaCRMadmin.A_countryCreatedby,
        type: _STRING_,
        ref: ZaCRMadmin.A_countryCreatedby
    }, {
        id: ZaCRMadmin.A_countryCreateddate,
        type: _STRING_,
        ref: ZaCRMadmin.A_countryCreateddate
    }, {
        id: ZaCRMadmin.A_countryWriteby,
        type: _STRING_,
        ref: ZaCRMadmin.A_countryWriteby
    }, {
        id: ZaCRMadmin.A_countryWritedate,
        type: _STRING_,
        ref: ZaCRMadmin.A_countryWritedate
    }],
    type: _OBJECT_
}

// Country State List
ZaCRMadmin.A_state_list_cache = "state_list_cache";
ZaCRMadmin.A_state = "states";
ZaCRMadmin.A_stateId = "stateId";
ZaCRMadmin.A_stateName = "stateName";
ZaCRMadmin.A_stateCode = "stateCode";
ZaCRMadmin.A_stateCountryStatus = "status";
ZaCRMadmin.A_stateCountryName = "countryId";
ZaCRMadmin.A_stateCreatedby = "createBy";
ZaCRMadmin.A_stateCreateddate = "createDate";
ZaCRMadmin.A_stateWriteby = "writeBy";
ZaCRMadmin.A_stateWritedate = "writeDate";
ZaCRMadmin.A_stateRemoved = "stateRemoved";

ZaCRMadmin.stageChoices = [{
    value: 0,
    label: "Lead"
}, {
    value: 1,
    label: "Opportunity"
}];

ZaCRMadmin.stateChoices = [{
    value: "New",
    label: "New"
}, {
    value: "In Progress",
    label: "In Progress"
}, {
    value: "Pending",
    label: "Pending"
}, {
    value: "Closed",
    label: "Closed"
}];

ZaCRMadmin.stateList = {
    items: [{
        id: ZaCRMadmin.A_stateId,
        type: _STRING_,
        ref: ZaCRMadmin.A_stateId
    }, {
        id: ZaCRMadmin.A_stateName,
        type: _STRING_,
        ref: ZaCRMadmin.A_stateName
    }, {
        id: ZaCRMadmin.A_stateCode,
        type: _STRING_,
        ref: ZaCRMadmin.A_stateCode
    }, {
        id: ZaCRMadmin.A_stateCountryStatus,
        type: _ENUM_,
        choices: [false, true],
        defaultValue: true
    }, {
        id: ZaCRMadmin.A_stateCountryName,
        type: _NUMBER_,
        ref: ZaCRMadmin.A_stateCountryName
    }, {
        id: ZaCRMadmin.A_stateCreatedby,
        type: _STRING_,
        ref: ZaCRMadmin.A_stateCreatedby
    }, {
        id: ZaCRMadmin.A_stateCreateddate,
        type: _STRING_,
        ref: ZaCRMadmin.A_stateCreateddate
    }, {
        id: ZaCRMadmin.A_stateWriteby,
        type: _STRING_,
        ref: ZaCRMadmin.A_stateWriteby
    }, {
        id: ZaCRMadmin.A_stateWritedate,
        type: _STRING_,
        ref: ZaCRMadmin.A_stateWritedate
    }],
    type: _OBJECT_
}

// Channel List
ZaCRMadmin.A_channel_list_cache = "channel_list_cache";
ZaCRMadmin.A_channel = "channels";
ZaCRMadmin.A_channelId = "channelId";
ZaCRMadmin.A_channelName = "channelName";
ZaCRMadmin.A_channelStatus = "status";
ZaCRMadmin.A_channelCreatedby = "createBy";
ZaCRMadmin.A_channelCreateddate = "createDate";
ZaCRMadmin.A_channelWriteby = "writeBy";
ZaCRMadmin.A_channelWritedate = "writeDate";
ZaCRMadmin.A_channelRemoved = "channelRemoved";

ZaCRMadmin.channelList = {
    items: [{
        id: ZaCRMadmin.A_channelId,
        type: _STRING_,
        ref: ZaCRMadmin.A_channelId
    }, {
        id: ZaCRMadmin.A_channelName,
        type: _STRING_,
        ref: ZaCRMadmin.A_channelName
    }, {
        id: ZaCRMadmin.A_channelStatus,
        type: _ENUM_,
        choices: [false, true],
        defaultValue: true
    }, {
        id: ZaCRMadmin.A_channelCreatedby,
        type: _STRING_,
        ref: ZaCRMadmin.A_channelCreatedby
    }, {
        id: ZaCRMadmin.A_channelCreateddate,
        type: _STRING_,
        ref: ZaCRMadmin.A_channelCreateddate
    }, {
        id: ZaCRMadmin.A_channelWriteby,
        type: _STRING_,
        ref: ZaCRMadmin.A_channelWriteby
    }, {
        id: ZaCRMadmin.A_channelWritedate,
        type: _STRING_,
        ref: ZaCRMadmin.A_channelWritedate
    }],
    type: _OBJECT_
}

// Priority List
ZaCRMadmin.A_priority_list_cache = "priority_list_cache";
ZaCRMadmin.A_priority = "prioritys";
ZaCRMadmin.A_priorityId = "priorityId";
ZaCRMadmin.A_priorityName = "priorityName";
ZaCRMadmin.A_priorityCode = "priorityCode";
ZaCRMadmin.A_priorityStatus = "status";
ZaCRMadmin.A_priorityCreatedby = "createBy";
ZaCRMadmin.A_priorityCreateddate = "createDate";
ZaCRMadmin.A_priorityWriteby = "writeBy";
ZaCRMadmin.A_priorityWritedate = "writeDate";
ZaCRMadmin.A_priorityRemoved = "priorityRemoved";

ZaCRMadmin.priorityList = {
    items: [{
        id: ZaCRMadmin.A_priorityId,
        type: _STRING_,
        ref: ZaCRMadmin.A_priorityId
    }, {
        id: ZaCRMadmin.A_priorityName,
        type: _STRING_,
        ref: ZaCRMadmin.A_priorityName
    }, {
        id: ZaCRMadmin.A_priorityCode,
        type: _STRING_,
        ref: ZaCRMadmin.A_priorityCode
    }, {
        id: ZaCRMadmin.A_priorityStatus,
        type: _ENUM_,
        choices: [false, true],
        defaultValue: true
    }, {
        id: ZaCRMadmin.A_priorityCreatedby,
        type: _STRING_,
        ref: ZaCRMadmin.A_priorityCreatedby
    }, {
        id: ZaCRMadmin.A_priorityCreateddate,
        type: _STRING_,
        ref: ZaCRMadmin.A_priorityCreateddate
    }, {
        id: ZaCRMadmin.A_priorityWriteby,
        type: _STRING_,
        ref: ZaCRMadmin.A_priorityWriteby
    }, {
        id: ZaCRMadmin.A_priorityWritedate,
        type: _STRING_,
        ref: ZaCRMadmin.A_priorityWritedate
    }],
    type: _OBJECT_
}

// Category List
ZaCRMadmin.A_category_list_cache = "category_list_cache";
ZaCRMadmin.A_category = "categorys";
ZaCRMadmin.A_categoryId = "categoryId";
ZaCRMadmin.A_categoryName = "categoryName";
ZaCRMadmin.A_categoryStatus = "status";
ZaCRMadmin.A_sales_team_id = "sectionId";
ZaCRMadmin.A_categoryCreatedby = "createBy";
ZaCRMadmin.A_categoryCreateddate = "createDate";
ZaCRMadmin.A_categoryWriteby = "writeBy";
ZaCRMadmin.A_categoryWritedate = "writeDate";
ZaCRMadmin.A_categoryRemoved = "categoryRemoved";

ZaCRMadmin.categoryList = {
    items: [{
        id: ZaCRMadmin.A_categoryId,
        type: _STRING_,
        ref: ZaCRMadmin.A_categoryId
    }, {
        id: ZaCRMadmin.A_categoryName,
        type: _STRING_,
        ref: ZaCRMadmin.A_categoryName
    }, {
        id: ZaCRMadmin.A_categoryStatus,
        type: _ENUM_,
        choices: [false, true],
        defaultValue: true
    }, {
        id: ZaCRMadmin.A_sales_team_id,
        type: _NUMBER_,
        ref: ZaCRMadmin.A_sales_team_id
    }, {
        id: ZaCRMadmin.A_categoryCreatedby,
        type: _STRING_,
        ref: ZaCRMadmin.A_categoryCreatedby
    }, {
        id: ZaCRMadmin.A_categoryCreateddate,
        type: _STRING_,
        ref: ZaCRMadmin.A_categoryCreateddate
    }, {
        id: ZaCRMadmin.A_categoryWriteby,
        type: _STRING_,
        ref: ZaCRMadmin.A_categoryWriteby
    }, {
        id: ZaCRMadmin.A_categoryWritedate,
        type: _STRING_,
        ref: ZaCRMadmin.A_categoryWritedate
    }],
    type: _OBJECT_
}

// Section List
ZaCRMadmin.A_section_list_cache = "section_list_cache";
ZaCRMadmin.A_section = "sections";
ZaCRMadmin.A_sectionId = "sectionId";
ZaCRMadmin.A_sectionName = "sectionName";
ZaCRMadmin.A_sectionCode = "sectionCode";
ZaCRMadmin.A_sectionManagerId = "sectionManagerId";
ZaCRMadmin.A_sectionLeaderId = "sectionLeaderId";
ZaCRMadmin.A_sectionWatcherId = "sectionWatcherId";
ZaCRMadmin.A_sectionSalesTeamIds = "sectionSalesTeamIds";
ZaCRMadmin.A_sectionCommonSalesTeamIds = "sectionCommonSalesTeamIds";
ZaCRMadmin.A_sectionStatus = "status";
ZaCRMadmin.A_sectionCreatedby = "createBy";
ZaCRMadmin.A_sectionCreateddate = "createDate";
ZaCRMadmin.A_sectionWriteby = "writeBy";
ZaCRMadmin.A_sectionWritedate = "writeDate";
ZaCRMadmin.A_sectionRemoved = "sectionRemoved";
ZaCRMadmin.A_common_user_selection = "common_user_selection";
ZaCRMadmin.A_selected_user_selection = "selected_user_selection";

ZaCRMadmin.sectionList = {
    items: [{
        id: ZaCRMadmin.A_sectionId,
        type: _STRING_,
        ref: ZaCRMadmin.A_sectionId
    }, {
        id: ZaCRMadmin.A_sectionName,
        type: _STRING_,
        ref: ZaCRMadmin.A_sectionName
    }, {
        id: ZaCRMadmin.A_sectionCode,
        type: _STRING_,
        ref: ZaCRMadmin.A_sectionCode
    }, {
        id: ZaCRMadmin.A_sectionManagerId,
        type: _STRING_,
        ref: ZaCRMadmin.A_sectionManagerId
    }, {
        id: ZaCRMadmin.A_sectionLeaderId,
        type: _STRING_,
        ref: ZaCRMadmin.A_sectionLeaderId
    }, {
        id: ZaCRMadmin.A_sectionWatcherId,
        type: _STRING_,
        ref: ZaCRMadmin.A_sectionWatcherId
    }, {
        id: ZaCRMadmin.A_sectionSalesTeamIds,
        type: _STRING_,
        ref: ZaCRMadmin.A_sectionSalesTeamIds
    }, {
        id: ZaCRMadmin.A_sectionCommonSalesTeamIds,
        type: _STRING_,
        ref: ZaCRMadmin.A_sectionCommonSalesTeamIds
    }, {
        id: ZaCRMadmin.A_sectionStatus,
        type: _ENUM_,
        choices: [false, true],
        defaultValue: true
    }, {
        id: ZaCRMadmin.A_sectionCreatedby,
        type: _STRING_,
        ref: ZaCRMadmin.A_sectionCreatedby
    }, {
        id: ZaCRMadmin.A_sectionCreateddate,
        type: _STRING_,
        ref: ZaCRMadmin.A_sectionCreateddate
    }, {
        id: ZaCRMadmin.A_sectionWriteby,
        type: _STRING_,
        ref: ZaCRMadmin.A_sectionWriteby
    }, {
        id: ZaCRMadmin.A_sectionWritedate,
        type: _STRING_,
        ref: ZaCRMadmin.A_sectionWritedate
    }, {
        id: ZaCRMadmin.A_selected_user_selection,
        type: _STRING_,
        ref: ZaCRMadmin.A_selected_user_selection
    }, {
        id: ZaCRMadmin.A_common_user_selection,
        type: _STRING_,
        ref: ZaCRMadmin.A_common_user_selection
    }

    ],
    type: _OBJECT_
}

// Stage List
ZaCRMadmin.A_stage_list_cache = "stage_list_cache";
ZaCRMadmin.A_stage = "Stages";
ZaCRMadmin.A_stageId = "stageId";
ZaCRMadmin.A_stageName = "stageName";
ZaCRMadmin.A_stageSequence = "stageSequence";
ZaCRMadmin.A_stageType = "stageType";
ZaCRMadmin.A_stageProbability = "stageProbability";
ZaCRMadmin.A_stageAuto = "stageAuto";
ZaCRMadmin.A_stageDescription = "stageDescription";
ZaCRMadmin.A_stageStatus = "status";
ZaCRMadmin.A_stageState = "stageState";
ZaCRMadmin.A_stageCreatedby = "createBy";
ZaCRMadmin.A_stageCreateddate = "createDate";
ZaCRMadmin.A_stageWriteby = "writeBy";
ZaCRMadmin.A_stageWritedate = "writeDate";
ZaCRMadmin.A_stageRemoved = "stageRemoved";

ZaCRMadmin.stageList = {
    items: [{
        id: ZaCRMadmin.A_stageId,
        type: _STRING_,
        ref: ZaCRMadmin.A_stageId
    }, {
        id: ZaCRMadmin.A_stageName,
        type: _STRING_,
        ref: ZaCRMadmin.A_stageName
    }, {
        id: ZaCRMadmin.A_stageSequence,
        type: _STRING_,
        ref: ZaCRMadmin.A_stageSequence
    }, {
        id: ZaCRMadmin.A_stageType,
        type: _NUMBER_,
        ref: ZaCRMadmin.A_stageType
    }, {
        id: ZaCRMadmin.A_stageState,
        type: _STRING_,
        ref: ZaCRMadmin.A_stageState
    }, {
        id: ZaCRMadmin.A_stageProbability,
        type: _STRING_,
        ref: ZaCRMadmin.A_stageProbability
    }, {
        id: ZaCRMadmin.A_A_stageAuto,
        type: _ENUM_,
        choices: [false, true],
        defaultValue: true
    }, {
        id: ZaCRMadmin.A_stageDescription,
        type: _STRING_,
        ref: ZaCRMadmin.A_stageDescription
    }, {
        id: ZaCRMadmin.A_stageStatus,
        type: _ENUM_,
        choices: [false, true],
        defaultValue: true
    }, {
        id: ZaCRMadmin.A_stageCreatedby,
        type: _STRING_,
        ref: ZaCRMadmin.A_stageCreatedby
    }, {
        id: ZaCRMadmin.A_stageCreateddate,
        type: _STRING_,
        ref: ZaCRMadmin.A_stageCreateddate
    }, {
        id: ZaCRMadmin.A_stageWriteby,
        type: _STRING_,
        ref: ZaCRMadmin.A_stageWriteby
    }, {
        id: ZaCRMadmin.A_stageWritedate,
        type: _STRING_,
        ref: ZaCRMadmin.A_stageWritedate
    }],
    type: _OBJECT_
}

// LeadClass List
ZaCRMadmin.A_leadClass_list_cache = "leadClass_list_cache";
ZaCRMadmin.A_leadClass = "leadClasses";
ZaCRMadmin.A_leadClassId = "leadClassId";
ZaCRMadmin.A_leadClassName = "leadClassName";
ZaCRMadmin.A_leadClassStatus = "status";
ZaCRMadmin.A_leadClassCreatedby = "createBy";
ZaCRMadmin.A_leadClassCreateddate = "createDate";
ZaCRMadmin.A_leadClassWriteby = "writeBy";
ZaCRMadmin.A_leadClassWritedate = "writeDate";
ZaCRMadmin.A_leadClassRemoved = "leadClassRemoved";

ZaCRMadmin.leadClassList = {
    items: [{
        id: ZaCRMadmin.A_leadClassId,
        type: _STRING_,
        ref: ZaCRMadmin.A_leadClassId
    }, {
        id: ZaCRMadmin.A_leadClassName,
        type: _STRING_,
        ref: ZaCRMadmin.A_leadClassName
    }, {
        id: ZaCRMadmin.A_leadClassStatus,
        type: _ENUM_,
        choices: [false, true],
        defaultValue: true
    }, {
        id: ZaCRMadmin.A_leadClassCreatedby,
        type: _STRING_,
        ref: ZaCRMadmin.A_leadClassCreatedby
    }, {
        id: ZaCRMadmin.A_leadClassCreateddate,
        type: _STRING_,
        ref: ZaCRMadmin.A_leadClassCreateddate
    }, {
        id: ZaCRMadmin.A_leadClassWriteby,
        type: _STRING_,
        ref: ZaCRMadmin.A_leadClassWriteby
    }, {
        id: ZaCRMadmin.A_leadClassWritedate,
        type: _STRING_,
        ref: ZaCRMadmin.A_leadClassWritedate
    }],
    type: _OBJECT_
}

ZaCRMadmin.myXModel = {
    items: [{
        id: ZaCRMadmin.A_company,
        ref: ZaCRMadmin.A_company,
        type: _LIST_,
        listItem: ZaCRMadmin.companyList
    }, {
        id: ZaCRMadmin.A_country,
        ref: ZaCRMadmin.A_country,
        type: _LIST_,
        listItem: ZaCRMadmin.countryList
    }, {
        id: ZaCRMadmin.A_state,
        ref: ZaCRMadmin.A_state,
        type: _LIST_,
        listItem: ZaCRMadmin.stateList
    }, {
        id: ZaCRMadmin.A_channel,
        ref: ZaCRMadmin.A_channel,
        type: _LIST_,
        listItem: ZaCRMadmin.channelList
    }, {
        id: ZaCRMadmin.A_priority,
        ref: ZaCRMadmin.A_priority,
        type: _LIST_,
        listItem: ZaCRMadmin.priorityList
    }, {
        id: ZaCRMadmin.A_category,
        ref: ZaCRMadmin.A_category,
        type: _LIST_,
        listItem: ZaCRMadmin.categoryList
    }, {
        id: ZaCRMadmin.A_section,
        ref: ZaCRMadmin.A_section,
        type: _LIST_,
        listItem: ZaCRMadmin.sectionList
    }, {
        id: ZaCRMadmin.A_stage,
        ref: ZaCRMadmin.A_stage,
        type: _LIST_,
        listItem: ZaCRMadmin.stageList
    }, {
        id: ZaCRMadmin.A_leadClass,
        ref: ZaCRMadmin.A_leadClass,
        type: _LIST_,
        listItem: ZaCRMadmin.leadClassList
    }, {
        id: ZaCRMadmin.A_company_list_cache,
        ref: ZaCRMadmin.A_company_list_cache,
        type: _LIST_
    }, {
        id: ZaCRMadmin.A_country_list_cache,
        ref: ZaCRMadmin.A_country_list_cache,
        type: _LIST_
    }, {
        id: ZaCRMadmin.A_channel_list_cache,
        ref: ZaCRMadmin.A_channel_list_cache,
        type: _LIST_
    }, {
        id: ZaCRMadmin.A_state_list_cache,
        ref: ZaCRMadmin.A_state_list_cache,
        type: _LIST_
    }, {
        id: ZaCRMadmin.A_priority_list_cache,
        ref: ZaCRMadmin.A_priority_list_cache,
        type: _LIST_
    }, {
        id: ZaCRMadmin.A_category_list_cache,
        ref: ZaCRMadmin.A_category_list_cache,
        type: _LIST_
    }, {
        id: ZaCRMadmin.A_section_list_cache,
        ref: ZaCRMadmin.A_section_list_cache,
        type: _LIST_
    }, {
        id: ZaCRMadmin.A_stage_list_cache,
        ref: ZaCRMadmin.A_stage_list_cache,
        type: _LIST_
    }, {
        id: ZaCRMadmin.A_leadClass_list_cache,
        ref: ZaCRMadmin.A_leadClass_list_cache,
        type: _LIST_
    }]
};
