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

var ZmReportView = function() {}

ZmReportView.prototype.constructor = ZmReportView;

ZmReportView.prototype.toString = function () {
    return "ZmReportView";
}

ZmReportView.type = [];
ZmReportView.state = [];
ZmReportView.responseLead = null;
ZmReportView.response = null;

ZmReportView.createForm = function(app) {
    var content = AjxTemplate.expand("biz_vnc_crm_client.templates.SimpleOpportunity#MainOpportunity");
    app.setContent(content);

    var toolbar = app.getToolbar();
    toolbar.setVisibility(false);
    biz_vnc_crm_client._flag = 3;
    ZmReportView.type = [];
    ZmReportView.state = [];
    Ext.Loader.setConfig({
        enabled: true
    });

    Ext.require(['Ext.tab.*', 'Ext.window.*', 'Ext.tip.*', 'Ext.layout.container.Border', 'Ext.window.MessageBox', 'Ext.grid.*', 'Ext.data.*', 'Ext.util.*', 'Ext.state.*', 'Ext.form.*', 'Ext.layout.container.Column', 'Ext.tab.Panel', 'Ext.panel.*', 'Ext.toolbar.*', 'Ext.button.*', 'Ext.container.ButtonGroup', 'Ext.layout.container.Table', 'Ext.selection.CheckboxModel', 'Ext.window.Window', 'Ext.toolbar.Spacer', 'Ext.layout.container.Card', 'Ext.chart.*', 'Ext.EventManager', 'Ext.tree.*', 'Ext.form.field.Number', 'Ext.form.field.Date', 'Ext.tip.QuickTipManager']);

    Ext.tip.QuickTipManager.init();
    Ext.define('data', {
        extend: 'Ext.data.Model',

        fields: [{
            name: 'leadId',
            type: 'int'
        }, {
            name: 'subjectName',
            type: 'string'
        }, {
            name: 'leadDescription',
            type: 'string'
        }, {
            name: 'contactName',
            type: 'string'
        }, {
            name: 'companyName',
            mapping: 'companyBean.companyName',
            type: 'string'
        }, {
            name: 'companyId',
            mapping: 'companyBean.companyId',
            type: 'int'
        }, {
            name: 'valuation',
            type: 'float'
        }, {
            name: 'leadState',
            type: 'string'
        }, {
            name: 'leadClassId',
            mapping: 'leadClassBean.leadClassId',
            type: 'int'
        }, {
            name: 'leadClassName',
            mapping: 'leadClassBean.leadClassName',
            type: 'string'
        }, {
            name: 'phone',
            type: 'string'
        }, {
            name: 'fax',
            type: 'string'
        }, {
            name: 'partnerName',
            type: 'string'
        }, {
            name: 'email',
            type: 'string'
        }, {
            name: 'workPhone',
            type: 'string'
        }, {
            name: 'mobile',
            type: 'string'
        }, {
            name: 'street1',
            type: 'string'
        }, {
            name: 'street2',
            type: 'string'
        }, {
            name: 'city',
            type: 'string'
        }, {
            name: 'zip',
            type: 'string'
        }, {
            name: 'stateName',
            mapping: 'stateBean.stateName',
            type: 'string'
        }, {
            name: 'stateId',
            mapping: 'stateBean.stateId',
            type: 'int'
        }, {
            name: 'countryName',
            mapping: 'countryBean.countryName',
            type: 'string'
        }, {
            name: 'countryId',
            mapping: 'countryBean.countryId',
            type: 'int'
        }, {
            name: 'type',
            type: 'string'
        }, {
            name: 'dateOpen',
            type: 'string'
        }, {
            name: 'dateClose',
            type: 'string'
        }, {
            name: 'expectedDateClose',
            type: 'string'
        }, {
            name: 'stageName',
            mapping: 'stageBean.stageName',
            type: 'string'
        }, {
            name: 'stageId',
            mapping: 'stageBean.stageId',
            type: 'int'
        }, {
            name: 'stageProbability',
            mapping: 'stageBean.stageProbability',
            type: 'float'
        }, {
            name: 'probability',
            type: 'float'
        }, {
            name: 'channelName',
            mapping: 'channelBean.channelName',
            type: 'string'
        }, {
            name: 'channelId',
            mapping: 'channelBean.channelId',
            type: 'int'
        }, {
            name: 'sectionId',
            mapping: 'sectionBean.sectionId',
            type: 'int'
        }, {
            name: 'sectionName',
            mapping: 'sectionBean.sectionName',
            type: 'string'
        }, {
            name: 'categoryName',
            mapping: 'categoryBean.categoryName',
            type: 'string'
        }, {
            name: 'categoryId',
            mapping: 'categoryBean.categoryId',
            type: 'int'
        }, {
            name: 'dayClose',
            type: 'float'
        }, {
            name: 'dayOpen',
            type: 'float'
        }, {
            name: 'referredBy',
            type: 'string'
        }, {
            name: 'userId',
            type: 'string'
        }, {
            name: 'priorityId',
            mapping: 'priorityBean.priorityId',
            type: 'int'
        }, {
            name: 'priorityName',
            mapping: 'priorityBean.priorityName',
            type: 'string'
        }, {
            name: 'nextActionDate',
            type: 'string'
        }, {
            name: 'nextAction',
            type: 'string'
        }, {
            name: 'status',
            type: 'bool'
        }, {
            name: 'createBy',
            type: 'string'
        }, {
            name: 'createDate',
            type: 'string'
        }, {
            name: 'writeBy',
            type: 'string'
        }, {
            name: 'writeDate',
            type: 'string'
        }]
    });

    ZmReportView.responseLead = biz_vnc_crm_client.rpc("jsonobj={\"action\":\"FULLLIST\",\"object\":\"lead\",\"username\":\"" + biz_vnc_crm_client.username + "\"}");
    ZmReportView.response = jsonParse(ZmReportView.responseLead.text);
    var store = Ext.create('Ext.data.JsonStore', {
        model: 'data',
        storeId: 'data',
        proxy: {
            type: 'memory',
            data: ZmReportView.response
        },
        autoLoad: true,
        actionMethods: {
            read: 'POST'
        },
        groupers: [{
            property: null
        }]
    });
    var LeadPanel = Ext.create('Ext.grid.Panel', {
        width: '100%',
        height: '100%',
        id: 'leadPanel',
        frame: true,
        store: store,
        viewConfig: {
            stripeRows: true
        },
        features: [{
            id: 'group',
            ftype: 'groupingsummary',
            groupHeaderTpl: '{name}',
            hideGroupedHeader: true,
            enableGroupingMenu: false
        }],
        columns: [{
            text: biz_vnc_crm_client.subject,
            flex: 1,
            sortable: true,
            hideable: false,
            width: 150,
            dataIndex: 'subjectName',
            tdCls: 'biz_vnc_crm_client_leadOpp',
            summaryType: 'count',
            summaryRenderer: function(value, summaryData, dataIndex) {
                return ((value === 0 || value > 1) ? '(' + value + ' Records)' : '(1 Record)');
            }
        }, {
            header: biz_vnc_crm_client.customer,
            width: 150,
            dataIndex: 'contactName',
            sortable: true
        }, {
            header: biz_vnc_crm_client.expectedRevenue,
            width: 150,
            dataIndex: 'valuation',
            sortable: true,
            summaryType: 'sum',
            summaryRenderer: function(value, summaryData, dataIndex){
                return (biz_vnc_crm_client.reportTotal + ': ' + value);
            }
        }, {
            header: biz_vnc_crm_client.probability,
               width: 150,
            dataIndex: 'probability',
            sortable: true,
            summaryType: 'average',
            summaryRenderer: function(value, summaryData, dataIndex){
                value = biz_vnc_crm_client.setPrecision(value);
                return (biz_vnc_crm_client.reportAverage + ': ' + value);
            }
        }, {
            header: biz_vnc_crm_client.reportDayOpen,
            width: 150,
            dataIndex: 'dayOpen',
            sortable: true,
            summaryType: 'max',
            summaryRenderer: function(value, summaryData, dataIndex){
                return (biz_vnc_crm_client.reportMax + ': ' + value);
            }
        }, {
            header: biz_vnc_crm_client.reportDayClose,
            width: 150,
            dataIndex: 'dayClose',
            sortable: true,
            summaryType: 'max',
            summaryRenderer: function(value, summaryData, dataIndex){
                return (biz_vnc_crm_client.reportMax + ': ' + value);
            }
        }],
        listeners: {
            dblclick: {
                element: 'body',
                fn: function (grid, rowIndex, colIndex) {
	
                    var toolbar = app.getToolbar();
                    toolbar.setVisibility(true);
                    var rec = Ext.getCmp('leadPanel').getSelectionModel().getSelection();
                    Ext.each(rec, function (item) {
                        rec = item;
                    });
                    if (rec.data.type == "1") {
                        var content = AjxTemplate.expand("biz_vnc_crm_client.templates.OpportunityForm#OpportunityFormMain");
                        app.setContent(content);
                        ZmOpportunityListView.prototype.getContacts(0, [], rec, app);
                    } else if(rec.data.type == "0") {
                        var content = AjxTemplate.expand("biz_vnc_crm_client.templates.LeadForm#LeadFormMain");
                        app.setContent(content);
                        ZmLeadListView.prototype.getContacts(0, [], rec, app);
                    }
                }
            }
        }
    });

    Ext.create('Ext.panel.Panel', {
        title: biz_vnc_crm_client.lblReport,
        id: 'reportPanel',
        width: '100%',
        height: '100%',
        defaults: {
            autoScroll: true,
            autoRender: true
        },
        items:[{
            xtype: 'buttongroup',
            id: 'buttonGroupFirst',
            columns: 2,
            title: biz_vnc_crm_client.reportFilter,
            items: [{
                xtype: 'buttongroup',
                id: 'buttonGroupType',
                columns: 2,
                title: biz_vnc_crm_client.reportType,
                items: [{
                    text: biz_vnc_crm_client.tabLead,
                    id: 'toggleButtonLead',
                    enableToggle: true,
                    scale: 'large',
                    rowspan: 3,
                    iconCls: 'btnLead32',
                        iconAlign: 'top',
                    toggleHandler: function(btn, pressedStatus){
                        if(pressedStatus){
                            ZmReportView.type.push('0');
                        } else {
                            ZmReportView.popItemType('0');
                        }
                        ZmReportView.filter(store);
                    }
                },{
                    text: biz_vnc_crm_client.tabOpportunity,
                    id: 'toggleButtonOpp',
                    enableToggle: true,
                    scale: 'large',
                    rowspan: 3,
                    iconCls: 'btnOpportunity32',
                    iconAlign: 'top',
                    toggleHandler: function(btn, pressedStatus){
                        if(pressedStatus){
                            ZmReportView.type.push('1');
                        } else {
                            ZmReportView.popItemType('1');
                        }
                        ZmReportView.filter(store);
                    }
                }]
            },{
                xtype: 'buttongroup',
                id: 'buttonGroupState',
                columns: 4,
                title: biz_vnc_crm_client.state,
                items: [{
                    text: biz_vnc_crm_client.reportNew,
                    id: 'toggleButtonNew',
                    enableToggle: true,
                    scale: 'large',
                    rowspan: 3,
                    iconCls: 'btnNew32',
                    iconAlign: 'top',
                    toggleHandler: function(btn, pressedStatus){
                        if(pressedStatus){
                            ZmReportView.state.push('New');
                        } else {
                            ZmReportView.popItemState('New');
                        }
                        ZmReportView.filter(store);
                    }
                },{
                    text: biz_vnc_crm_client.reportInProgress,
                    id: 'toggleButtonInProgress',
                    enableToggle: true,
                    scale: 'large',
                    rowspan: 3,
                    iconCls: 'btnOpen32',
                    iconAlign: 'top',
                    toggleHandler: function(btn, pressedStatus){
                        if(pressedStatus){
                            ZmReportView.state.push('In Progress');
                        } else {
                            ZmReportView.popItemState('In Progress');
                        }
                        ZmReportView.filter(store);
                    }
                },{
                    text: biz_vnc_crm_client.reportPending,
                    id: 'toggleButtonPending',
                    enableToggle: true,
                    scale: 'large',
                    rowspan: 3,
                    iconCls: 'btnPending32',
                    iconAlign: 'top',
                    toggleHandler: function(btn, pressedStatus){
                        if(pressedStatus){
                            ZmReportView.state.push('Pending');
                        } else {
                            ZmReportView.popItemState('Pending');
                        }
                        ZmReportView.filter(store);
                    }
                },{
                    text: biz_vnc_crm_client.reportClosed,
                    id: 'toggleButtonClosed',
                    enableToggle: true,
                    scale: 'large',
                    rowspan: 3,
                    iconCls: 'btnClosed32',
                    iconAlign: 'top',
                    toggleHandler: function(btn, pressedStatus){
                        if(pressedStatus){
                            ZmReportView.state.push('Closed');
                        } else {
                            ZmReportView.popItemState('Closed');
                        }
                        ZmReportView.filter(store);
                    }
                }]
            }]
        },{
            xtype: 'buttongroup',
            id: 'buttonGroupSecond',
            columns: 3,
            title: biz_vnc_crm_client.reportGroupBy,
            items: [{
                xtype: 'buttongroup',
                id: 'buttonGroupOthers',
                columns: 8,
                title: biz_vnc_crm_client.reportOthers,
                items: [{
                    text: biz_vnc_crm_client.salesman,
                    id: 'toggleButtonSalesman',
                    enableToggle: true,
                    scale: 'large',
                    rowspan: 3,
                    iconCls: 'btnSalesman32',
                    iconAlign: 'top',
                    toggleGroup: 'others',
                    toggleHandler : function(btn, pressedStatus){
                        ZmReportView.groupBy(pressedStatus, 'userId');
                    }
                },{
                    text: biz_vnc_crm_client.reportSalesTeam,
                    id: 'toggleButtonSalesTeam',
                    enableToggle: true,
                    scale: 'large',
                    rowspan: 3,
                    iconCls: 'btnSalesTeam32',
                    iconAlign: 'top',
                    toggleGroup: 'others',
                    toggleHandler : function(btn, pressedStatus){
                        ZmReportView.groupBy(pressedStatus, 'sectionName');
                    }
                },{
                    text: biz_vnc_crm_client.partner,
                    id: 'toggleButtonPartner',
                    enableToggle: true,
                    scale: 'large',
                    rowspan: 3,
                    iconCls: 'btnPartner32',
                    iconAlign: 'top',
                    toggleGroup: 'others',
                    toggleHandler : function(btn, pressedStatus){
                        ZmReportView.groupByPartner(pressedStatus, 'partnerName');
                    }
                },{
                    text: biz_vnc_crm_client.company,
                    id: 'toggleButtonCompany',
                    enableToggle: true,
                    scale: 'large',
                    rowspan: 3,
                    iconCls: 'btnCompany32',
                    iconAlign: 'top',
                    toggleGroup: 'others',
                    toggleHandler : function(btn, pressedStatus){
                        ZmReportView.groupBy(pressedStatus, 'companyName');
                    }
                },{
                    text: biz_vnc_crm_client.leadClass,
                    id: 'toggleButtonLeadClass',
                    enableToggle: true,
                    scale: 'large',
                    rowspan: 3,
                    iconCls: 'btnLeadClass32',
                    iconAlign: 'top',
                    toggleGroup: 'others',
                    toggleHandler : function(btn, pressedStatus){
                        ZmReportView.groupBy(pressedStatus, 'leadClassName');
                    }
                },{
                    text: biz_vnc_crm_client.stage,
                    id: 'toggleButtonStage',
                    enableToggle: true,
                    scale: 'large',
                    rowspan: 3,
                    iconCls: 'btnStage32',
                    iconAlign: 'top',
                    toggleGroup: 'others',
                    toggleHandler : function(btn, pressedStatus){
                        ZmReportView.groupBy(pressedStatus, 'stageName');
                    }
                },{
                    text: biz_vnc_crm_client.priority,
                    id: 'toggleButtonPriority',
                    enableToggle: true,
                    scale: 'large',
                    rowspan: 3,
                    iconCls: 'btnPriority32',
                    iconAlign: 'top',
                    toggleGroup: 'others',
                    toggleHandler : function(btn, pressedStatus){
                        ZmReportView.groupBy(pressedStatus, 'priorityName');
                    }
                },{
                    text: biz_vnc_crm_client.channel,
                    id: 'toggleButtonChannel',
                    enableToggle: true,
                    scale: 'large',
                    rowspan: 3,
                    iconCls: 'btnChannel32',
                    iconAlign: 'top',
                    toggleGroup: 'others',
                    toggleHandler : function(btn, pressedStatus){
                        ZmReportView.groupBy(pressedStatus, 'channelName');
                    }
                }]
            },{
                xtype: 'buttongroup',
                id: 'buttonGroupRegion',
                columns: 2,
                title: biz_vnc_crm_client.reportRegion,
                items: [{
                    text: biz_vnc_crm_client.country,
                    id: 'toggleButtonCountry',
                    enableToggle: true,
                    scale: 'large',
                    rowspan: 3,
                    iconCls: 'btnCountry32',
                    iconAlign: 'top',
                    toggleGroup: 'others',
                    toggleHandler : function(btn, pressedStatus){
                        ZmReportView.groupBy(pressedStatus, 'countryName');
                    }
                },{
                    text: biz_vnc_crm_client.state,
                    id: 'toggleButtonState',
                    enableToggle: true,
                    scale: 'large',
                    rowspan: 3,
                    iconCls: 'btnState32',
                    iconAlign: 'top',
                    toggleGroup: 'others',
                    toggleHandler : function(btn, pressedStatus){
                        ZmReportView.groupBy(pressedStatus, 'stateName');
                    }
                }]
            },{
                xtype: 'buttongroup',
                id: 'buttonGroupTimeline',
                columns: 5,
                title: biz_vnc_crm_client.reportTimeline,
                items: [{
                    text: biz_vnc_crm_client.reportYear,
                    id: 'toggleButtonYear',
                    enableToggle: true,
                    scale: 'large',
                    rowspan: 3,
                    iconCls: 'btnYear32',
                    iconAlign: 'top',
                    toggleGroup: 'others',
                    toggleHandler : function(btn, pressedStatus){
                        ZmReportView.groupByYear(pressedStatus,'createDate');
                    }
                },{
                    text: biz_vnc_crm_client.reportMonth,
                    id: 'toggleButtonMonth',
                    enableToggle: true,
                    scale: 'large',
                    rowspan: 3,
                    iconCls: 'btnMonth32',
                    iconAlign: 'top',
                    toggleGroup: 'others',
                    toggleHandler : function(btn, pressedStatus){
                        ZmReportView.groupByMonth(pressedStatus,'createDate');
                    }
                },{
                    text: biz_vnc_crm_client.reportWeek,
                    id: 'toggleButtonWeek',
                    enableToggle: true,
                    scale: 'large',
                    rowspan: 3,
                    iconCls: 'btnWeek32',
                    iconAlign: 'top',
                    toggleGroup: 'others',
                    toggleHandler : function(btn, pressedStatus){
                        ZmReportView.groupByWeek(pressedStatus,'createDate');
                    }
                },{
                    text: biz_vnc_crm_client.reportDay,
                    id: 'toggleButtonDay',
                    enableToggle: true,
                    scale: 'large',
                    rowspan: 3,
                    iconCls: 'btnDay32',
                    iconAlign: 'top',
                    toggleGroup: 'others',
                    toggleHandler : function(btn, pressedStatus){
                        ZmReportView.groupByDay(pressedStatus,'createDate');
                    }
                },{
                    text: biz_vnc_crm_client.expectedClosing,
                    id: 'toggleButtonExpectedClosing',
                    enableToggle: true,
                    scale: 'large',
                    rowspan: 3,
                    iconCls: 'btnExpectedClosing32',
                    iconAlign: 'top',
                    toggleGroup: 'others',
                    toggleHandler : function(btn, pressedStatus){
                        ZmReportView.groupByMonth(pressedStatus,'expectedDateClose');
                    }
                }]
            }]
        },LeadPanel],
        renderTo: 'datagridOpportunity'
    });
}

ZmReportView.filter = function (store) {
    Ext.getStore('data').clearFilter();
    store.filterBy (
        function(record, id){
            if(ZmReportView.type.length > 0 && ZmReportView.state.length > 0){
                for(var i=0;i<ZmReportView.type.length;i++){
                    for(var j=0; j<ZmReportView.state.length;j++){
                        if(record.get('type') == ZmReportView.type[i] && record.get('leadState') == ZmReportView.state[j]){
                            return true;
                        }
                    }
                }
                return false;
            } else if (ZmReportView.type.length > 0 && ZmReportView.state.length <= 0) {
                for(var i=0; i<ZmReportView.type.length; i++){
                    if(record.get('type') == ZmReportView.type[i]){
                        return true;
                    }
                }
                return false;
            } else if (ZmReportView.type.length <= 0 && ZmReportView.state.length > 0) {
                for(var i=0; i<ZmReportView.state.length; i++){
                    if(record.get('leadState') == ZmReportView.state[i]){
                        return true;
                    }
                }
                return false;
            } else {
                return true;
            }
        }
    );
}

ZmReportView.groupBy = function(pressedStatus, str) {
    if(pressedStatus){
        Ext.getStore('data').groupers.items[0].property = str;
        Ext.getStore('data').load();
    } else {
        Ext.getStore('data').groupers.items[0].property = null;
        Ext.getStore('data').load();
    }
}

ZmReportView.groupByYear = function(pressedStatus, str) {
    if(pressedStatus){
        var response = jsonParse(ZmReportView.responseLead.text);
        for(var i=0; i < response.length ; i++){
            date = response[i].createDate.split(" ");
            year = new Date(date[0]).getFullYear();
            response[i].createDate = year;
        }
        ZmReportView.response = response;
        Ext.getStore('data').groupers.items[0].property = str;
        Ext.getStore('data').loadData(ZmReportView.response, false);
    } else {
        Ext.getStore('data').groupers.items[0].property = null;
        Ext.getStore('data').load();
    }
}

ZmReportView.groupByMonth = function(pressedStatus, str) {
    if(pressedStatus){
        var response = jsonParse(ZmReportView.responseLead.text);
        var monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
        for(var i=0; i < response.length ; i++){
            date = response[i].createDate.split(" ");
               month = monthNames[new Date(date[0]).getMonth()];
            if(str == 'expectedDateClose'){
                response[i].expectedDateClose = month;
            } else {
                response[i].createDate = month;
            }
        }
        ZmReportView.response = response;
        Ext.getStore('data').groupers.items[0].property = str;
        Ext.getStore('data').loadData(ZmReportView.response, false);
    } else {
        Ext.getStore('data').groupers.items[0].property = null;
        Ext.getStore('data').load();
    }
}

ZmReportView.groupByWeek = function(pressedStatus, str) {
    if(pressedStatus){
        var response = jsonParse(ZmReportView.responseLead.text);
        for(var i=0; i < response.length ; i++){
            date = response[i].createDate.split(" ")[0];
            var weekNo = ZmReportView.getWeek(new Date(date));
            var weekRange = ZmReportView.getDateRangeOfWeek(weekNo);
            response[i].createDate = "[ " + biz_vnc_crm_client.reportWeek + ": " + weekNo + "] -" + " " + weekRange;
        }
        ZmReportView.response = response;
        Ext.getStore('data').groupers.items[0].property = str;
        Ext.getStore('data').loadData(ZmReportView.response, false);
    } else {
        Ext.getStore('data').groupers.items[0].property = null;
        Ext.getStore('data').load();
    }
}

ZmReportView.getWeek = function(date) {
    var onejan = new Date(date.getFullYear(),0,1);
    return Math.ceil((((date - onejan) / 86400000) + onejan.getDay()+1)/7);
}

ZmReportView.getDateRangeOfWeek = function(weekNo) {
    var tempDate = new Date();
    numOfdaysPastSinceLastMonday = eval(tempDate.getDay()- 1);
    tempDate.setDate(tempDate.getDate() - numOfdaysPastSinceLastMonday);
    var weekNoToday = ZmReportView.getWeek(tempDate);
    var weeksInTheFuture = eval( weekNo - weekNoToday );
    tempDate.setDate(tempDate.getDate() + eval( 7 * weeksInTheFuture ));
    var rangeIsFrom =  tempDate.getFullYear() + "/" + eval(tempDate.getMonth()+1)   +"/"  +  tempDate.getDate();
    tempDate.setDate(tempDate.getDate() + 6);
    var rangeIsTo = tempDate.getFullYear() + "/" + eval(tempDate.getMonth()+1) + "/" +  tempDate.getDate();
    return rangeIsFrom + " to "+ rangeIsTo;
}

ZmReportView.groupByDay = function(pressedStatus, str) {
    if(pressedStatus){
        var response = jsonParse(ZmReportView.responseLead.text);
        for(var i=0; i < response.length ; i++){
            date = response[i].createDate.split(" ")[0];
            response[i].createDate = date;
        }
        ZmReportView.response = response;
        Ext.getStore('data').groupers.items[0].property = str;
        Ext.getStore('data').loadData(ZmReportView.response, false);
    } else {
        Ext.getStore('data').groupers.items[0].property = null;
        Ext.getStore('data').load();
    }
}

ZmReportView.popItemType = function (str){
    for(var i=0; i<ZmReportView.type.length ; i++){
        if(ZmReportView.type[i] == str) {
            ZmReportView.type.splice(i,1);
            break;
        }
    }
}

ZmReportView.popItemState = function (str){
    for(var i=0; i<ZmReportView.state.length ; i++){
        if(ZmReportView.state[i] == str) {
            ZmReportView.state.splice(i,1);
            break;
        }
    }
}

ZmReportView.groupByPartner = function(pressedStatus, str) {
    var partner = jsonParse(biz_vnc_crm_client.temp);
    var userCount = partner.length;
    if(pressedStatus){
        var response = jsonParse(ZmReportView.responseLead.text);
        for(var i=0; i < response.length ; i++){
            partnerId = response[i].partnerName;
            for(var j=0; j<userCount; j++){
                if(partnerId == partner[j].value){
                    response[i].partnerName = partner[j].label;
                    break;
                } else {
                    response[i].partnerName = "";
                }
            }
        }
        ZmReportView.response = response;
        Ext.getStore('data').groupers.items[0].property = str;
        Ext.getStore('data').loadData(ZmReportView.response, false);
    } else {
        Ext.getStore('data').groupers.items[0].property = null;
        Ext.getStore('data').load();
    }
}
