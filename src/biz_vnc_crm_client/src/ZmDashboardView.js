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

var ZmDashboardView = function() {}

ZmDashboardView.prototype.constructor = ZmDashboardView;

ZmDashboardView.prototype.toString = function () {
    return "ZmDashboardView";
}

ZmDashboardView.dashboard = function (app) {
    var content = AjxTemplate.expand("biz_vnc_crm_client.templates.Simple#MainLead");
    app.setContent(content);

    var toolbar = app.getToolbar();
    toolbar.setVisibility(false);

    Ext.require(['Ext.tab.*', 'Ext.window.*', 'Ext.tip.*', 'Ext.layout.container.Border', 'Ext.window.MessageBox', 'Ext.grid.*', 'Ext.data.*', 'Ext.util.*', 'Ext.state.*', 'Ext.form.*', 'Ext.layout.container.Column', 'Ext.tab.Panel', 'Ext.panel.*', 'Ext.toolbar.*', 'Ext.button.*', 'Ext.container.ButtonGroup', 'Ext.layout.container.Table', 'Ext.selection.CheckboxModel', 'Ext.window.Window', 'Ext.toolbar.Spacer', 'Ext.layout.container.Card', 'Ext.chart.*']);
    Ext.MessageBox.buttonText.yes = biz_vnc_crm_client.btnYes;
    Ext.MessageBox.buttonText.no = biz_vnc_crm_client.btnNo;

    // pie chart start--------------------------------------------------------------------------------------------
    var json = "jsonobj={\"action\":\"LIST\",\"object\":\"lead\",\"username\":\"" + biz_vnc_crm_client.username + "\"}";
    var reqHeader = {
        "Content-Type": "application/x-www-form-urlencoded"
    };
    var reqJson = AjxStringUtil.urlEncode(json);
    var responseLead = AjxRpc.invoke(reqJson, "/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);

    var leadData = jsonParse(responseLead.text);
    var closelead = inProgresslead = newlead = pendinglead = total = 0;

    for (var i = 0; i < leadData.length; i++) {
        if (leadData[i].leadState == "New") {
            newlead++;
        } else if (leadData[i].leadState == "In Progress") {
            inProgresslead++;
        } else if (leadData[i].leadState == "Pending") {
            pendinglead++;
        } else if (leadData[i].leadState == "Closed") {
            closelead++;
        }
    }

    total = closelead + inProgresslead + newlead + pendinglead;
    var leadChartStore = Ext.create('Ext.data.JsonStore', {
        fields: [{
            name: 'name',
            type: 'string'
        }, {
            name: 'data',
            type: 'int'
        }],
        data: [{
            'name': 'New',
            'data': newlead
        }, {
            'name': 'In Progress',
            'data': inProgresslead
        }, {
            'name': 'Closed',
            'data': closelead
        }, {
            'name': 'Pending',
            'data': pendinglead
        }]
    });

    leadChart = Ext.create('Ext.chart.Chart', {
        xtype: 'chart',
        id: 'chartCmp',
        animate: false,
        store: leadChartStore,
        shadow: false,
        legend: {
            position: 'right'
        },
        theme: 'Base:gradients',
        series: [{
            type: 'pie',
            angleField: 'data',
            showInLegend: true,
            tips: {
                trackMouse: true,
                width: 140,
                height: 28,
                renderer: function (storeItem, item) {
                    this.setTitle(storeItem.get('name') + ': ' + Math.round(storeItem.get('data') / total * 100) + '%');
                }
            },
            highlight: {
                segment: {
                    margin: 20
                }
            },
            label: {
                field: 'name',
                display: 'rotate',
                contrast: true,
                font: '10px Arial'
            }
        }]
    });

    var leadChartPanel = Ext.create('widget.panel', {
            width: 450,
            height: 300,
            x: 920,
            y: 320,
            title: biz_vnc_crm_client.lblNumberofleadsbystate,
            renderTo: Ext.getBody(),
            layout: 'fit',
            items: leadChart
        });

    // pie chart end--------------------------------------------------------------------------------------------

    // ---------------opp Chart start------------------------------

    var json = "jsonobj={\"action\":\"LIST\",\"object\":\"opp\",\"username\":\"" + biz_vnc_crm_client.username + "\"}";
    var reqHeader = {
        "Content-Type": "application/x-www-form-urlencoded"
    };
    var reqJson = AjxStringUtil.urlEncode(json);
    var responseOpp = AjxRpc.invoke(reqJson, "/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);

    var oppData = jsonParse(responseOpp.text);
    var date, month;
    var jan = feb = march = april = may = jun = jul = aug = sep = oct = nov = dec = 0;
    for (var i = 0; i < oppData.length; i++) {
        date = oppData[i].createDate;
        date = date.split(" ");
        month = AjxDateFormat.parse("yyyy-MM-dd", date[0]).getMonth();
        if (month === 0) {
            jan += parseInt(oppData[i].valuation);
        } else if (month == 1) {
            feb += parseInt(oppData[i].valuation);
        } else if (month == 2) {
            march += parseInt(oppData[i].valuation);
        } else if (month == 3) {
            april += parseInt(oppData[i].valuation);
        } else if (month == 4) {
            may += parseInt(oppData[i].valuation);
        } else if (month == 5) {
            jun += parseInt(oppData[i].valuation);
        } else if (month == 6) {
            jul += parseInt(oppData[i].valuation);
        } else if (month == 7) {
            aug += parseInt(oppData[i].valuation);
        } else if (month == 8) {
            sep += parseInt(oppData[i].valuation);
        } else if (month == 9) {
            oct += parseInt(oppData[i].valuation);
        } else if (month == 10) {
            nov += parseInt(oppData[i].valuation);
        } else if (month == 11) {
            dec += parseInt(oppData[i].valuation);
        }
    }

    var oppChartStore = Ext.create('Ext.data.JsonStore', {
        fields: [{
            name: 'name',
            type: 'string'
        }, {
            name: 'data',
            type: 'int'
        }],
        data: [{
            'name': 'Jan',
            'data': jan
        }, {
            'name': 'Feb',
            'data': feb
        }, {
            'name': 'Mar',
            'data': march
        }, {
            'name': 'Apr',
            'data': april
        }, {
            'name': 'May',
            'data': may
        }, {
            'name': 'Jun',
            'data': jun
        }, {
            'name': 'Jul',
            'data': jul
        }, {
            'name': 'Aug',
            'data': aug
        }, {
            'name': 'Sep',
            'data': sep
        }, {
            'name': 'Oct',
            'data': oct
        }, {
            'name': 'Nov',
            'data': nov
        }, {
            'name': 'Dec',
            'data': dec
        }]
    });

    var oppChart = Ext.create('Ext.chart.Chart', {
        id: 'chartCmp12',
        xtype: 'chart',
        style: 'background:#fff',
        animate: true,
        shadow: true,
        height: 440,
        width: 300,
        store: oppChartStore,
        axes: [{
            type: 'Numeric',
            position: 'left',
            fields: ['data'],
            label: {
                renderer: Ext.util.Format.numberRenderer('0,0')
            },
            title: biz_vnc_crm_client.lblRevenue,
            grid: true,
            minimum: 0
        }, {
            type: 'Category',
            position: 'bottom',
            fields: ['name'],
            title: biz_vnc_crm_client.lblMonthsOfCurrentYear
        }],
        series: [{
            type: 'column',
            axis: 'left',
            highlight: true,
            tips: {
                trackMouse: true,
                width: 140,
                height: 28,
                renderer: function (storeItem, item) {
                    this.setTitle(storeItem.get('name') + ': ' + storeItem.get('data'));
                }
            },
            label: {
                display: 'insideEnd',
                'text-anchor': 'middle',
                field: 'data',
                renderer: Ext.util.Format.numberRenderer('0'),
                orientation: 'vertical',
                color: '#333'
            },
            xField: 'name',
            yField: 'data'
        }]
    });

    var oppChartPanel = Ext.create('widget.panel', {
        width: 450,
        height: 300,
        x: 920,
        y: 10,
        title: biz_vnc_crm_client.lblMonthlyRevenue,
        layout: 'fit',
        items: oppChart
    });

    // ----------------- opp chart end -----------------------------

    var idArray = [];
    var str = "'" + "In Progress" + "'";
    idArray.push(str);

    var json = "jsonobj={\"action\":\"FILTER\",\"object\":\"opp\",\"array\":\"" + idArray + "\",\"username\":\"" + biz_vnc_crm_client.username + "\"}";
    var reqHeader = {
        "Content-Type": "application/x-www-form-urlencoded"
    };
    var reqJson = AjxStringUtil.urlEncode(json);
    var oppResponse = AjxRpc.invoke(reqJson, "/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);
    var json1 = "jsonobj={\"action\":\"FILTER\",\"object\":\"lead\",\"array\":\"" + idArray + "\",\"username\":\"" + biz_vnc_crm_client.username + "\"}";
    var reqHeader = {
        "Content-Type": "application/x-www-form-urlencoded"
    };
    var reqJson = AjxStringUtil.urlEncode(json1);
    var leadResponse = AjxRpc.invoke(reqJson, "/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);

    Ext.define('model_1', {
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
            type: 'string'
        }, {
            name: 'leadState',
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
            name: 'leadClassName',
            mapping: 'leadClassBean.leadClassName',
            type: 'string'
        }, {
            name: 'leadClassId',
            mapping: 'leadClassBean.leadClassId',
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
            type: 'date'
        }, {
            name: 'dateClose',
            type: 'date'
        }, {
            name: 'expectedDateClose',
            type: 'date'
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
            type: 'date'
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
            type: 'date'
        }, {
            name: 'writeBy',
            type: 'string'
        }, {
            name: 'writeDate',
            type: 'date'
        }]
    });

    var LeadPanel, OppPanel;

    OppPanel = Ext.create('Ext.form.Panel', {
        width: 900,
        height: 300,
        x: 10,
        y: 10,
        title: biz_vnc_crm_client.lblMyOpportunities,
        id: 'oppPanel',
        layout: 'fit',
        items: [{
            xtype: 'grid',
            id: 'opportunityGrid',
            defaults: {
                autoRender: true,
                autoScroll: true
            },
            store: Ext.create('Ext.data.Store', {
                model: 'model_1',
                proxy: {
                    type: 'memory',
                    data: jsonParse(oppResponse.text)
                },
                autoLoad: true,
                actionMethods: {
                    read: 'POST'
                }

            }),
            viewConfig: {
                stripeRows: true
            },
            columns: [{
                sortable: false,
                xtype: 'actioncolumn',
                width: 25,
                items: [{
                    icon: "/service/zimlet/biz_vnc_crm_client/default/btn/pencil.gif", // Use a URL in the icon config
                    tooltip: biz_vnc_crm_client.btnEdit,
                    handler: function (grid, rowIndex, colIndex) {
                        var rec = grid.getStore().getAt(rowIndex);
                        var content = AjxTemplate.expand("biz_vnc_crm_client.templates.OpportunityForm#OpportunityFormMain");
                        app.setContent(content);
                        appCtxt.getCurrentApp()._overviewPanelContent._children._array[1]._children._array[0]._setSelected(false);
                        appCtxt.getCurrentApp()._overviewPanelContent._children._array[1]._children._array[2]._setSelected(true);
                        ZmOpportunityListView.prototype.getContacts(0, [], rec, app);
                    }
                }]
            }, {
                header: biz_vnc_crm_client.opportunity,
                width: 150,
                dataIndex: 'subjectName',
                sortable: true
            }, {
                header: biz_vnc_crm_client.customer,
                width: 150,
                dataIndex: 'contactName',
                sortable: true
            }, {
                header: biz_vnc_crm_client.stage,
                width: 150,
                dataIndex: 'stageName',
                sortable: true
            }, {
                header: biz_vnc_crm_client.expectedRevenue,
                width: 150,
                dataIndex: 'valuation',
                sortable: true
            }, {
                header: biz_vnc_crm_client.probability,
                width: 110,
                dataIndex: 'probability',
                sortable: true
            }, {
                header: biz_vnc_crm_client.state,
                width: 120,
                dataIndex: 'leadState',
                sortable: true
            }, {
                sortable: false,
                xtype: 'actioncolumn',
                width: 25,
                items: [{
                    icon: '/service/zimlet/biz_vnc_crm_client/default/btn/cancel.png',
                    tooltip: biz_vnc_crm_client.btnDelete,
                    handler: function (grid, rowIndex, colIndex) {
                        var rec = grid.getStore().getAt(rowIndex);
                        Ext.MessageBox.confirm(biz_vnc_crm_client.msgConfirmHeader, biz_vnc_crm_client.msgConfirm, showResult);
                        function showResult(btn) {
                            if (btn == "yes") {
                                var name = appCtxt.getUsername();
                                var idArray = rec.get('leadId');
                                var json = "jsonobj={\"action\":\"DELETEBYID\",\"object\":\"lead\",\"array\":\"" + idArray + "\",\"writeBy\":\"" + name + "\"}";
                                var reqHeader = {
                                    "Content-Type": "application/x-www-form-urlencoded"
                                };
                                var reqJson = AjxStringUtil.urlEncode(json);
                                var response = AjxRpc.invoke(reqJson, "/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);

                                var idArray = [];
                                var str = "'" + "In Progress" + "'";
                                idArray.push(str);

                                var json = "jsonobj={\"action\":\"FILTER\",\"object\":\"opp\",\"array\":\"" + idArray + "\",\"username\":\"" + biz_vnc_crm_client.username + "\"}";

                                var reqJson = AjxStringUtil.urlEncode(json);
                                var oppResponse = AjxRpc.invoke(reqJson, "/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);
                                Ext.example.msg('', biz_vnc_crm_client.msgDelete);
                                Ext.getCmp('opportunityGrid').getStore().loadData(jsonParse(oppResponse.text), false);
                                Ext.getCmp('opportunityGrid').getView().refresh();
                            }
                        };
                    }
                }]
            }],
            listeners: {
                dblclick: {
                    element: 'body', //bind to the underlying body property on the panel
                    fn: function (grid, rowIndex, colIndex) {

                        var toolbar = app.getToolbar();
                        toolbar.setVisibility(true);
                        var rec = Ext.getCmp('opportunityGrid').getSelectionModel().getSelection();
                        Ext.each(rec, function (item) {
                            rec = item;
                        });
                        var content = AjxTemplate.expand("biz_vnc_crm_client.templates.OpportunityForm#OpportunityFormMain");
                        app.setContent(content);
                        ZmOpportunityListView.prototype.getContacts(0, [], rec, app);
                    }
                }
            }
        }]
    });

    LeadPanel = Ext.create('Ext.form.Panel', {
        title: biz_vnc_crm_client.lblMyLeads,
        width: 900,
        height: 300,
        x: 10,
        y: 320,
        id: 'leadPanel',
        layout: 'fit',
        items: [{
            xtype: 'grid',
            id: 'leadGrid',
            defaults: {
                autoRender: true,
                autoScroll: true
            },
            store: Ext.create('Ext.data.Store', {
                model: 'model_1',
                proxy: {
                    type: 'memory',
                    data: jsonParse(leadResponse.text)
                },
                autoLoad: true,
                actionMethods: {
                    read: 'POST'
                }

            }),
            viewConfig: {
                stripeRows: true
            },
            columns: [{
                sortable: false,
                xtype: 'actioncolumn',
                width: 25,
                icon: "/service/zimlet/biz_vnc_crm_client/default/btn/pencil.gif",
                items: [{
                    icon: "/service/zimlet/biz_vnc_crm_client/default/btn/pencil.gif", // Use a URL in the icon config
                    tooltip: biz_vnc_crm_client.btnEdit,
                    handler: function (grid, rowIndex, colIndex) {
                        var rec = grid.getStore().getAt(rowIndex);
                        var content = AjxTemplate.expand("biz_vnc_crm_client.templates.LeadForm#LeadFormMain");
                        app.setContent(content);
                        appCtxt.getCurrentApp()._overviewPanelContent._children._array[1]._children._array[0]._setSelected(false);
                        appCtxt.getCurrentApp()._overviewPanelContent._children._array[1]._children._array[1]._setSelected(true);
                        ZmLeadListView.prototype.getContacts(0, [], rec, app);
                    }
                }]
            }, {
                text: biz_vnc_crm_client.subject,
                width: 150,
                dataIndex: 'subjectName'
            }, {
                text: biz_vnc_crm_client.contactName,
                width: 150,
                dataIndex: 'contactName'
            }, {
                text: biz_vnc_crm_client.email,
                width: 150,
                dataIndex: 'email'
            }, {
                text: biz_vnc_crm_client.phone,
                width: 150,
                dataIndex: 'phone'
            }, {
                text: biz_vnc_crm_client.stage,
                width: 110,
                dataIndex: 'stageName'
            }, {
                text: biz_vnc_crm_client.state,
                width: 120,
                dataIndex: 'leadState'
            }, {
                sortable: false,
                xtype: 'actioncolumn',
                width: 25,

                items: [{
                    icon: '/service/zimlet/biz_vnc_crm_client/default/btn/cancel.png',
                    tooltip: biz_vnc_crm_client.btnDelete,
                    handler: function (grid, rowIndex, colIndex) {
                        var rec = grid.getStore().getAt(rowIndex);
                        Ext.MessageBox.confirm(biz_vnc_crm_client.msgConfirmHeader, biz_vnc_crm_client.msgConfirm, showResult);
                        function showResult(btn) {
                            if (btn == "yes") {
                                var name = appCtxt.getUsername();
                                var idArray = rec.get('leadId');
                                var json = "jsonobj={\"action\":\"DELETEBYID\",\"object\":\"lead\",\"array\":\"" + idArray + "\",\"writeBy\":\"" + name + "\"}";
                                var reqHeader = {
                                    "Content-Type": "application/x-www-form-urlencoded"
                                };
                                var reqJson = AjxStringUtil.urlEncode(json);
                                var response = AjxRpc.invoke(reqJson, "/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);
                                var idArray = [];
                                var str = "'" + "In Progress" + "'";
                                idArray.push(str);

                                var json1 = "jsonobj={\"action\":\"FILTER\",\"object\":\"lead\",\"array\":\"" + idArray + "\",\"username\":\"" + biz_vnc_crm_client.username + "\"}";
                                var reqJson = AjxStringUtil.urlEncode(json1);
                                var leadResponse = AjxRpc.invoke(reqJson, "/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);

                                Ext.example.msg('', biz_vnc_crm_client.msgDelete);
                                Ext.getCmp('leadGrid').getStore().loadData(jsonParse(leadResponse.text), false);
                                Ext.getCmp('leadGrid').getView().refresh();
                            }
                        };
                    }
                }]
            }],
            listeners: {
                dblclick: {
                    element: 'body', //bind to the underlying body property on the panel
                    fn: function (grid, rowIndex, colIndex) {
                        var rec = grid.getStore().getAt(rowIndex);
                        var content = AjxTemplate.expand("biz_vnc_crm_client.templates.OpportunityForm#OpportunityFormMain");
                        app.setContent(content);
                        ZmLeadListView.prototype.getContacts(0, [], rec, app);
                    }
                }
            }
        }]
    });

    // -------------------------------------------------------------

    Ext.create('Ext.container.Container', {
        layout: {
            type: 'absolute'
        },
        width: Ext.get('datagrid').getWidth(),
        height: Ext.get('datagrid').getHeight(),
        renderTo: 'datagrid',
        border: 0,
        style: {
            borderColor: '#000000',
            borderStyle: 'solid',
            borderWidth: '1px'
        },
        items: [OppPanel, oppChartPanel, LeadPanel, leadChartPanel]
    });
};
