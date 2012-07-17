function ZmDashboardView() {}
ZmDashboardView.prototype.constructor = ZmDashboardView;

ZmDashboardView.prototype.toString = function () {
    return "ZmDashboardView";
}

ZmDashboardView.dashboard = function (app) {

    var content = AjxTemplate.expand("biz_vnc_crm_client.templates.Simple#MainLead");
    app.setContent(content);

    Ext.require(['Ext.tab.*', 'Ext.window.*', 'Ext.tip.*', 'Ext.layout.container.Border', 'Ext.window.MessageBox', 'Ext.grid.*', 'Ext.data.*', 'Ext.util.*', 'Ext.state.*', 'Ext.form.*', 'Ext.layout.container.Column', 'Ext.tab.Panel', 'Ext.panel.*', 'Ext.toolbar.*', 'Ext.button.*', 'Ext.container.ButtonGroup', 'Ext.layout.container.Table', 'Ext.selection.CheckboxModel', 'Ext.window.Window', 'Ext.toolbar.Spacer', 'Ext.layout.container.Card', 'Ext.chart.*']);
	Ext.MessageBox.buttonText.yes = biz_vnc_crm_client.btnYes;
	Ext.MessageBox.buttonText.no = biz_vnc_crm_client.btnNo;

    // pie chart start--------------------------------------------------------------------------------------------
    var json = "jsonobj={\"action\":\"LIST\",\"object\":\"lead\"}";
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
        } else if (leadData[i].leadState == "Close") {
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
            'name': 'Close',
            'data': closelead
        }, {
            'name': 'Pending',
            'data': pendinglead
        }]
    });

    var donut = false;
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
            donut: donut,
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
			title: 'Number of leads by state',
			renderTo: Ext.getBody(),
			layout: 'fit',
			tbar: [{
				text: biz_vnc_crm_client.btnSaveChart,
				handler: function() {
					Ext.MessageBox.confirm(biz_vnc_crm_client.msgConfirmHeader, biz_vnc_crm_client.msgConfirmDownload, function (choice) {
						if (choice == 'yes'){
							leadChart.save({
								type: 'image/png'
							});
						}
					});
				}
			},{
				enableToggle: true,
				pressed: false,
				text: biz_vnc_crm_client.btnDonut,
				toggleHandler: function(btn, pressed) {
					var chart = Ext.getCmp('chartCmp');
					chart.series.first().donut = pressed ? 35 : false;
					chart.refresh();
				}
			}],
			items: leadChart
		});

    // pie chart end--------------------------------------------------------------------------------------------

    ////////////////----------------opp Chart start------------------------------

    var json = "jsonobj={\"action\":\"LIST\",\"object\":\"opp\"}";
    var reqHeader = {
        "Content-Type": "application/x-www-form-urlencoded"
    };
    var reqJson = AjxStringUtil.urlEncode(json);
    var responseOpp = AjxRpc.invoke(reqJson, "/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);

    var oppData = jsonParse(responseOpp.text);
    var closeopp = inProgressopp = newopp = pendingopp = totalopp = 0;
    for (var i = 0; i < oppData.length; i++) {

        if (oppData[i].leadState == "New") {
            newopp++;
        } else if (oppData[i].leadState == "In Progress") {
            inProgressopp++;
        } else if (oppData[i].leadState == "Pending") {
            pendingopp++;
        } else if (oppData[i].leadState == "Close") {
            closeopp++;
        }
    }
    totalopp = closeopp + inProgressopp + newopp + pendingopp;
    var oppChartStore = Ext.create('Ext.data.JsonStore', {
        fields: [{
            name: 'name',
            type: 'string'
        }, {
            name: 'data',
            type: 'int'
        }],
        data: [{
            'name': 'New',
            'data': newopp
        }, {
            'name': 'In Progress',
            'data': inProgressopp
        }, {
            'name': 'Close',
            'data': closeopp
        }, {
            'name': 'Pending',
            'data': pendingopp
        }]
    });
    var date;
    var jan = feb = march = april = may = jun = jul = aug = sep = oct = nov = dec = 0;
    
	for (var i = 0; i < oppData.length; i++) {
        date = oppData[i].createDate;
        date = date.split(" ");

        if (new Date(date[0]).getMonth() == 0) {
            jan += parseInt(oppData[i].valuation);
        } else if (new Date(date[0]).getMonth() == 1) {
            feb += parseInt(oppData[i].valuation);
        } else if (new Date(date[0]).getMonth() == 2) {
            march += parseInt(oppData[i].valuation);
        } else if (new Date(date[0]).getMonth() == 3) {
            april += parseInt(oppData[i].valuation);
        } else if (new Date(date[0]).getMonth() == 4) {
            may += parseInt(oppData[i].valuation);
        } else if (new Date(date[0]).getMonth() == 5) {
            jun += parseInt(oppData[i].valuation);
        } else if (new Date(date[0]).getMonth() == 6) {
            jul += parseInt(oppData[i].valuation);
        } else if (new Date(date[0]).getMonth() == 7) {
            aug += parseInt(oppData[i].valuation);
        } else if (new Date(date[0]).getMonth() == 8) {
            sep += parseInt(oppData[i].valuation);
        } else if (new Date(date[0]).getMonth() == 9) {
            oct += parseInt(oppData[i].valuation);
        } else if (new Date(date[0]).getMonth() == 10) {
            nov += parseInt(oppData[i].valuation);
        } else if (new Date(date[0]).getMonth() == 11) {

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
        title: 'Monthly Expected Revenue',
        layout: 'fit',
        tbar: [{
            text: biz_vnc_crm_client.btnSaveChart,
            handler: function () {
                Ext.MessageBox.confirm(biz_vnc_crm_client.msgConfirmHeader, biz_vnc_crm_client.msgConfirmDownload, function (choice) {
                    if (choice == 'yes') {
                        oppChart.save({
                            type: 'image/png'
                        });
                    }
                });
            }
        }],
        items: oppChart

    });



    ////////////////////----------------- opp chart end -----------------------------


    var idArray = [];
    var str = "'" + "In Progress" + "'";
    idArray.push(str);

    var json = "jsonobj={\"action\":\"FILTER\",\"object\":\"opp\",\"array\":\"" + idArray + "\"}";
    var reqHeader = {
        "Content-Type": "application/x-www-form-urlencoded"
    };
    var reqJson = AjxStringUtil.urlEncode(json);
    var oppResponse = AjxRpc.invoke(reqJson, "/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);
    var json1 = "jsonobj={\"action\":\"FILTER\",\"object\":\"lead\",\"array\":\"" + idArray + "\"}";
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
        }, //userId
        {
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
        title: 'My Opportunities',
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
                                Ext.example.msg('', biz_vnc_crm_client.msgDelete);
                                biz_vnc_crm_client.initOpportunityGrid(app);
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
        title: 'My Leads',
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
                text: biz_vnc_crm_client.leadstate,
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
                                Ext.example.msg('', biz_vnc_crm_client.msgDelete);
                                biz_vnc_crm_client.initLeadGrid(app);
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

    var leadChartWindow = new Ext.Window({
        title: biz_vnc_crm_client.lblNumberofleadsbystate,
        renderTo: 'datagrid',
        maxWidth: 450,
        maxHeight: 300,
        minWidth: 450,
        minHeight: 300,
        x: 920,
        y: 320,
        collapsible: true,
        closable: true,
        border: false,
        layoutConfig: {
            animate: true
        },
        items: [{
            stateId: 'first',
            title: null,
            collapsed: false,
            items: leadChartPanel
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