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

var ZmOpportunityListView = function() {}
ZmOpportunityListView.prototype.constructor = ZmOpportunityListView;

ZmOpportunityListView.prototype.getContacts = function (offset, contactList, rec, app) {
    contactBook = "Contacts";
    if (contactBook == null) {
        return;
    }
    var jsonObj = {
        SearchRequest: {
            _jsns: "urn:zimbraMail"
        }
    };
    var request = jsonObj.SearchRequest;

    request.sortBy = ZmSearch.NAME_ASC;
    ZmTimezone.set(request, AjxTimezone.DEFAULT);
    request.locale = {
        _content: AjxEnv.DEFAULT_LOCALE
    };
    request.offset = 0;
    request.types = ZmSearch.TYPE[ZmItem.CONTACT];
    request.query = "in:\"" + contactBook + "\"";
    request.offset = offset;
    request.limit = 500;

    contactList = contactList || [];
    var searchParams = {
        jsonObj: jsonObj,
        asyncMode: true,
        callback: new AjxCallback(this, this.handleGetContactsResponse, [app, contactList, rec]),
        errorCallback: new AjxCallback(this, this.handleGetContactsError)
    };
    appCtxt.getAppController().sendRequest(searchParams);
};

ZmOpportunityListView.prototype.handleGetContactsResponse = function (app, contactList, rec, result) {
    if (result) {
        biz_vnc_crm_client.contactList = [];
        var response = result.getResponse().SearchResponse;
        var responseContactList = response[ZmList.NODE[ZmItem.CONTACT]];
        if (responseContactList) {
            var numContacts = responseContactList.length;
            var contarry = [];
            for (var i = 0; i < numContacts; i++) {
                biz_vnc_crm_client.contactList.push(responseContactList[i]);
            }
            biz_vnc_crm_client.temp = "[";
            for (var i = 0; i < biz_vnc_crm_client.contactList.length; i++) {
                var contact = biz_vnc_crm_client.contactList[i];
                if (i == biz_vnc_crm_client.contactList.length - 1) {
                    biz_vnc_crm_client.temp += "{\"value\":\"" + contact.id + "\",\"label\":\"" + ZmLeadListView.CheckField(contact._attrs.company, "<< Blank >>")+ "\"}]";
                } else {
                    biz_vnc_crm_client.temp += "{\"value\":\"" + contact.id + "\",\"label\":\"" + ZmLeadListView.CheckField(contact._attrs.company, "<< Blank >>")+ "\"},";
                }
            }
        } else {
            biz_vnc_crm_client.temp = "[{'value':'','label':''}]";
        }

        ZmOpportunityListView.createForm(rec, contactList, app);

        if (response.more) {
            this.getContacts(response.offset + 500, biz_vnc_crm_client.contactList);
        } else {

        }
    }
};

ZmOpportunityListView.prototype.toString = function () {
    return "ZmOpportunityListView";
};

ZmOpportunityListView.selectedOppPartnerName = null;
ZmOpportunityListView.createForm = function (rec, contactList, app) {
    var toolbar = app.getToolbar();
    toolbar.setVisibility(false);
    biz_vnc_crm_client._leadTypeFlag = 1;
    biz_vnc_crm_client.overviewTreeItemSelection(2);
    var oppTaskListData = "[{'subject':'','status':'','complete':'','dueDate':''}]";
    biz_vnc_crm_client.apptData = "[{'subject':'','location1':'','calendar':'','startdate':''}]";
    if (biz_vnc_crm_client.mailData == "") {
        biz_vnc_crm_client.mailData = "[{'id':'','date':'','sender':'','subject':'','fragment':''}]";
    }
    Ext.define('priority', {
        extend: 'Ext.data.Model',
        fields: [{
            name: 'priorityId',
            type: 'int'
        }, {
            name: 'priorityName',
            type: 'string'
        }]
    });
    Ext.define('section', {
        extend: 'Ext.data.Model',
        fields: [{
            name: 'sectionId',
            type: 'int'
        }, {
            name: 'sectionName',
            type: 'string'
        }]
    });
    Ext.define('leadClass', {
        extend: 'Ext.data.Model',
        fields: [{
            name: 'leadClassId',
            type: 'int'
        }, {
            name: 'leadClassName',
            type: 'string'
        }]
    });
    Ext.define('customer', {
        extend: 'Ext.data.Model',
        fields: [{
            name: 'leadId',
            type: 'int'
        }, {
            name: 'companyName',
            type: 'string'
        }

        ]
    });
    Ext.define('contact', {
        extend: 'Ext.data.Model',
        fields: [{
            name: 'leadId',
            type: 'int'
        }, {
            name: 'contactName',
            type: 'string'
        }

        ]
    });
    Ext.define('category', {
        extend: 'Ext.data.Model',
        fields: [{
            name: 'categoryId',
            type: 'int'
        }, {
            name: 'categoryName',
            type: 'string'
        }]
    });
    Ext.define('company', {
        extend: 'Ext.data.Model',
        fields: [{
            name: 'companyId',
            type: 'int'
        }, {
            name: 'companyName',
            type: 'string'
        }]
    });
    Ext.define('stage', {
        extend: 'Ext.data.Model',
        fields: [{
            name: 'stageId',
            type: 'int'
        }, {
            name: 'stageName',
            type: 'string'
        }, {
            name: 'stageState',
            type: 'string'
        }, {
            name: 'stageProbability',
            type: 'float'
        }, {
            name: 'stageAuto',
            type: 'bool'
        }

        ]
    });
    Ext.define('channel', {
        extend: 'Ext.data.Model',
        fields: [{
            name: 'channelId',
            type: 'int'
        }, {
            name: 'channelName',
            type: 'string'
        }]
    });
    Ext.define('state', {
        extend: 'Ext.data.Model',
        fields: [{
            name: 'stateId',
            type: 'int'
        }, {
            name: 'stateName',
            type: 'string'
        }]
    });
    Ext.define('country', {
        extend: 'Ext.data.Model',
        fields: [{
            name: 'countryId',
            type: 'int'
        }, {
            name: 'countryName',
            type: 'string'
        }]
    });
    Ext.define('contact1', {
        extend: 'Ext.data.Model',
        fields: [{
            name: 'value',
            type: 'string'
        }, {
            name: 'label',
            type: 'string'
        }]
    });
    Ext.define('user', {
        extend: 'Ext.data.Model',
        fields: [{
            name: 'value',
            type: 'string'
        }, {
            name: 'label',
            type: 'string'
        }]
    });
    Ext.define('mail', {
        extend: 'Ext.data.Model',
        fields: [{
            name: 'mailId',
            type: 'string'
        }, {
            name: 'date',
            type: 'long'
        }, {
            name: 'from',
            type: 'string'
        }, {
            name: 'subject',
            type: 'string'
        }, {
            name: 'fragment',
            type: 'string'
        }, {
            name: 'to',
            type: 'string'
        }, {
            name: 'userId',
            type: 'string'
        }]
    });
    Ext.define('oppTaskModel', {
        extend: 'Ext.data.Model',
        fields: [{
            name: 'inviteId',
            type: 'string'
        }, {
            name: 'name',
            type: 'string'
        }, {
            name: 'status',
            type: 'string'
        }, {
            name: 'percentComplete',
            type: 'string'
        }, {
            name: 'startTime',
            type: 'date'
        }, {
            name: 'location',
            type: 'string'
        }, {
            name: 'organizer',
            type: 'string'
        }, {
            name: 'priority',
            type: 'string'
        }, {
            name: 'fragment',
            type: 'string'
        }]
    });
    Ext.define('oppApptModel', {
        extend: 'Ext.data.Model',
        fields: [{
            name: 'inviteId',
            type: 'string'
        }, {
            name: 'name',
            type: 'string'
        }, {
            name: 'organizer',
            type: 'string'
        }, {
            name: 'location',
            type: 'string'
        }, {
            name: 'status',
            type: 'string'
        }, {
            name: 'folderId',
            type: 'string'
        }, {
            name: 'startTime',
            type: 'long'
        }, {
            name: 'freeBusyActual',
            type: 'string'
        }, {
            name: 'allDay',
            type: 'string'
        }, {
            name: 'alarm',
            type: 'string'
        }, {
            name: 'fragment',
            type: 'string'
        }]
    });

    var oppSMMail = Ext.create('Ext.selection.CheckboxModel', {
        listeners: {
            selectionchange: function (sm, selections) {
                if(selections.length>0) {
                    Ext.getCmp('btnMailDelete').enable();
                } else {
                    Ext.getCmp('btnMailDelete').disable();
                }
            }
        }
    });

    var oppSMAppt = Ext.create('Ext.selection.CheckboxModel', {
        listeners: {
            selectionchange: function (sm, selections) {
                if(selections.length>0) {
                    Ext.getCmp('btnApptDelete').enable();
                } else {
                    Ext.getCmp('btnApptDelete').disable();
                }
            }
        }
    });

    var oppSMTask = Ext.create('Ext.selection.CheckboxModel', {
        listeners: {
            selectionchange: function (sm, selections) {
                if(selections.length>0) {
                    Ext.getCmp('btnTaskDelete').enable();
                } else {
                    Ext.getCmp('btnTaskDelete').disable();
                }
            }
        }
    });

    var historyGrid;
    var tabOpp = Ext.create('Ext.form.Panel', {
        title: biz_vnc_crm_client.lblOpportunityForm,
        bodyStyle: 'padding:5px',
        id: 'formOpportunity',
        width: '100%',
        height: '70%',
        fieldDefaults: {
            msgTarget: 'side'
        },
        defaults: {
            anchor: '100%'
        },
        items: [{
            layout: 'column',
            border: false,
            items: [{
                columnWidth: .30,
                border: false,
                layout: 'anchor',
                items: [{
                    xtype: 'textfield',
                    id: 'txtOppOpportunity',
                    fieldLabel: '<font color="red" size="2">* </font>' + biz_vnc_crm_client.opportunity,
                    allowBlank: false,
                    anchor: '95%',
                    maxLength: 128
                }, {
                    xtype: 'textfield',
                    id: 'txtOppExpectedRevenue',
                    fieldLabel: biz_vnc_crm_client.expectedRevenue,
                    anchor: '95%',
                    maxLength: 64
                }, {
                    xtype: 'datefield',
                    id: 'dateOppNextActionDate',
                    format: 'Y-m-d H:i:s.0',
                    fieldLabel: biz_vnc_crm_client.nextActionDate,
                    anchor: '95%'
                }, {
                    xtype: 'combo',
                    mode: 'local',
                    value: 'leadClass',
                    triggerAction: 'all',
                    forceSelection: true,
                    tabIndex: 2,
                    fieldLabel: biz_vnc_crm_client.leadClass,
                    id: 'cmbOppleadClass',
                    name: 'title',
                    displayField: 'leadClassName',
                    valueField: 'leadClassId',
                    queryMode: 'local',
                    store: Ext.create('Ext.data.Store', {
                        model: 'leadClass',
                        proxy: {
                            type: 'memory',
                            data: biz_vnc_crm_client.responseLeadClass
                        },
                        autoLoad: true,
                        actionMethods: {
                            read: 'POST'
                        }
                    }),
                    listeners: {
                        change: function (combo, ewVal, oldVal) {}
                    },
                    anchor: '95%'
                }]
            }, {
                columnWidth: .25,
                border: false,
                layout: 'anchor',
                items: [{
                    xtype: 'combo',
                    mode: 'local',
                    value: 'oppstage',
                    triggerAction: 'all',
                    forceSelection: true,
                    fieldLabel: biz_vnc_crm_client.stage,
                    id: 'cmbOppstage',
                    name: 'title',
                    displayField: 'stageName',
                    valueField: 'stageId',
                    queryMode: 'local',
                    store: Ext.create('Ext.data.Store', {
                        model: 'stage',
                        proxy: {
                            type: 'memory',
                            data: biz_vnc_crm_client.responseStage
                        },
                        autoLoad: true,
                        actionMethods: {
                            read: 'POST'
                        }
                    }),
                    listeners: {
                        change: function (combo, ewVal, oldVal) {
                            var oldState = Ext.getCmp('txtOppState').getValue();
                            var val = Ext.getCmp('cmbOppstage').getRawValue();
                            var rec1 = Ext.getCmp('cmbOppstage').getStore().findRecord("stageName", val);
                            if (rec1 != null) {
                                Ext.getCmp('txtOppState').setValue(rec1.get('stageState'));
                                if (rec1.get('stageAuto') == true) {
                                    Ext.getCmp('txtOppProbability').setValue(rec1.get('stageProbability'));
                                } else {
                                    Ext.getCmp('txtOppProbability').setValue('0');
                                }
                            }
                            var dateOpen = Ext.getCmp('dateOppOpened').getValue();
                            var state = Ext.getCmp('txtOppState').getValue();
                            if (dateOpen == null && state != "New") {
                                Ext.getCmp('dateOppOpened').setValue(new Date());
                                if (state == "Closed") {
                                    Ext.getCmp('dateOppOpened').setValue(new Date());
                                    Ext.getCmp('dateOppClosed').setValue(new Date());
                                }
                            } else if (dateOpen != null && state == "Closed") {
                                Ext.getCmp('dateOppClosed').setValue(new Date());
                            }
                            if (oldState == "Closed" && state != "Closed") {
                                Ext.getCmp('dateOppOpened').setValue(new Date());
                                Ext.getCmp('dateOppClosed').setValue('');
                            }
                            if (Ext.getCmp('dateOppOpened').getValue() != null) {
                                var dayopen = Math.ceil(((new Date().getTime()) - (Ext.getCmp('dateOppOpened').getValue())) / (1000 * 60 * 60 * 24));
                                Ext.getCmp('txtOppDaysToOpen').setValue(dayopen);
                            } else {
                                Ext.getCmp('txtOppDaysToOpen').setValue(0);
                            }
                            if (Ext.getCmp('dateOppClosed').getValue() != null) {
                                var dayclose = Math.ceil(((Ext.getCmp('dateOppClosed').getValue()) - (Ext.getCmp('dateOppOpened').getValue())) / (1000 * 60 * 60 * 24));
                                Ext.getCmp('txtOppDaysToClose').setValue(dayclose);
                            } else {
                                Ext.getCmp('txtOppDaysToClose').setValue(0);
                            }
                        }
                    },
                    anchor: '95%'
                }, {
                    xtype: 'textfield',
                    id: 'txtOppProbability',
                    fieldLabel: biz_vnc_crm_client.probability,
                    value: '0',
                    anchor: '95%'
                }, {
                    xtype: 'textfield',
                    id: 'txtOppNextAction',
                    fieldLabel: biz_vnc_crm_client.nextAction,
                    anchor: '95%',
                    maxLength: 255
                }, {
                    xtype: 'textfield',
                    id: 'txtOppState',
                    fieldLabel: biz_vnc_crm_client.opportunityState,
                    value: 'New',
                    disabled: true
                }]
            }, {
                columnWidth: .25,
                border: false,
                layout: 'anchor',
                items: [{
                    xtype: 'combo',
                    mode: 'local',
                    value: 'oppsalesman',
                    triggerAction: 'all',
                    forceSelection: true,
                    fieldLabel: biz_vnc_crm_client.salesman,
                    id: 'cmbOppsalesman',
                    name: 'title',
                    displayField: 'label',
                    valueField: 'value',
                    queryMode: 'local',
                    store: Ext.create('Ext.data.Store', {
                        model: 'user',
                        proxy: {
                            type: 'memory',
                            data: jsonParse(biz_vnc_crm_client.responseUser.text)
                        },
                        autoLoad: true,
                        actionMethods: {
                            read: 'POST'
                        }
                    }),
                    queryMode: 'local',
                    anchor: '95%'
                }, {
                    xtype: 'datefield',
                    id: 'dateOppExpectedClosing',
                    format: 'Y-m-d H:i:s.0',
                    fieldLabel: biz_vnc_crm_client.expectedClosing,
                    anchor: '95%'
                }, {
                    xtype: 'combo',
                    mode: 'local',
                    value: 'opppriority',
                    triggerAction: 'all',
                    forceSelection: true,
                    fieldLabel: biz_vnc_crm_client.priority,
                    id: 'cmbOpppriority',
                    name: 'title',
                    displayField: 'priorityName',
                    valueField: 'priorityId',
                    queryMode: 'local',
                    store: Ext.create('Ext.data.Store', {
                        model: 'priority',
                        proxy: {
                            type: 'memory',
                            data: biz_vnc_crm_client.responsePriority
                        },
                        autoLoad: true,
                        actionMethods: {
                            read: 'POST'
                        }
                    }),
                    anchor: '95%'
                }]
            }, {
                columnWidth: .20,
                border: false,
                layout: 'anchor',
                items: []
            }]
        }, {
            xtype: 'tabpanel',
            plain: true,
            id: 'oppTabPanel',
            activeTab: 0,
            height: '80%',
            defaults: {
                bodyStyle: 'padding:10px'
            },
            items: [{
                title: biz_vnc_crm_client.tabOpportunity,
                layout: 'column',
                height: 250,
                items: [{
                    columnWidth: .33,
                    border: false,
                    layout: 'anchor',
                    items: [{
                        xtype: 'combo',
                        mode: 'local',
                        value: 'Partner',
                        triggerAction: 'all',
                        forceSelection: true,
                        fieldLabel: biz_vnc_crm_client.partner,
                        id: 'cmbOpppartner',
                        name: 'title',
                        displayField: 'label',
                        valueField: 'value',
                        queryMode: 'local',
                        store: Ext.create('Ext.data.Store', {
                            model: 'contact1',
                            proxy: {
                                type: 'memory',
                                data: jsonParse(biz_vnc_crm_client.temp)
                            },
                            autoLoad: true,
                            actionMethods: {
                                read: 'POST'
                            }
                        }),
                        listeners: {
                            select: function (box, record, index) {
                                var selname = Ext.getCmp('cmbOpppartner').getValue();
                                ZmOpportunityListView.selectedOppPartnerName = selname;
                                for (var i = 0; i < biz_vnc_crm_client.contactList.length; i++) {
                                    if (biz_vnc_crm_client.contactList[i].id == selname) {
                                        var contactName = ZmLeadListView.CheckField(biz_vnc_crm_client.contactList[i]._attrs.firstName) + " " + ZmLeadListView.CheckField(biz_vnc_crm_client.contactList[i]._attrs.lastName);
                                        var workState = ZmLeadListView.CheckField(biz_vnc_crm_client.contactList[i]._attrs.workState);
                                        var workCountry = ZmLeadListView.CheckField(biz_vnc_crm_client.contactList[i]._attrs.workCountry);
                                        var state = Ext.getCmp('cmbOppstate').getStore().findRecord("stateName", workState);
                                        var country = Ext.getCmp('cmbOppcountry').getStore().findRecord("countryName", workCountry);
                                        if (state != null) {
                                            Ext.getCmp('cmbOppstate').getStore().load({
                                                callback: function () {
                                                    Ext.getCmp('cmbOppstate').setValue(state.data.stateId);
                                                }
                                            });
                                        } else {
                                            Ext.getCmp('cmbOppstate').setValue();
                                        }
                                        if (country != null) {
                                            Ext.getCmp('cmbOppcountry').getStore().load({
                                                callback: function () {
                                                    Ext.getCmp('cmbOppcountry').setValue(country.data.countryId);
                                                }
                                            });
                                        } else {
                                            Ext.getCmp('cmbOppcountry').setValue();
                                        }
                                        Ext.getCmp('txtOppMobile').setValue(ZmLeadListView.CheckField(biz_vnc_crm_client.contactList[i]._attrs.mobilePhone));
                                        Ext.getCmp('txtOppContact').setValue(contactName);
                                        Ext.getCmp('txtOppZip').setValue(ZmLeadListView.CheckField(biz_vnc_crm_client.contactList[i]._attrs.workPostalCode));
                                        Ext.getCmp('txtOppEmail').setValue(ZmLeadListView.CheckField(biz_vnc_crm_client.contactList[i]._attrs.email));
                                        Ext.getCmp('txtOppStreet1').setValue(ZmLeadListView.CheckField(biz_vnc_crm_client.contactList[i]._attrs.workStreet));
                                        Ext.getCmp('txtOppCity').setValue(ZmLeadListView.CheckField(biz_vnc_crm_client.contactList[i]._attrs.workCity));
                                        Ext.getCmp('txtOppPhone').setValue(ZmLeadListView.CheckField(biz_vnc_crm_client.contactList[i]._attrs.mobilePhone2));
                                        Ext.getCmp('txtOppFax').setValue(ZmLeadListView.CheckField(biz_vnc_crm_client.contactList[i]._attrs.workFax));
                                    }
                                }

                            }
                        },
                        anchor: '100%'
                    }, {
                        xtype: 'combo',
                        mode: 'local',
                        value: 'companyName',
                        triggerAction: 'all',
                        forceSelection: true,
                        fieldLabel: biz_vnc_crm_client.company,
                        id: 'cmbOppcompanyName',
                        name: 'CompanyName',
                        displayField: 'companyName',
                        valueField: 'companyId',
                        queryMode: 'local',
                        store: Ext.create('Ext.data.Store', {
                            model: 'company',
                            proxy: {
                                type: 'memory',
                                data: biz_vnc_crm_client.responseCompany
                            },
                            autoLoad: true,
                            actionMethods: {
                                read: 'POST'
                            }
                        }),
                        anchor: '100%'
                    }, {
                        xtype: 'textfield',
                        id: 'txtOppContact',
                        fieldLabel: biz_vnc_crm_client.contactName,
                        anchor: '100%',
                        maxLength: 64
                    }, {
                        xtype: 'textfield',
                        id: 'txtOppEmail',
                        fieldLabel: biz_vnc_crm_client.email,
                        vtype: 'email',
                        anchor: '100%'
                    }, {
                        xtype: 'textfield',
                        id: 'txtOppPhone',
                        fieldLabel: biz_vnc_crm_client.phone,
                        anchor: '100%',
                        maxLength: 16
                    }]
                }, {
                    columnWidth: .10,
                    border: false,
                    layout: 'anchor',
                    items: [{
                        xtype: 'image',
                        imgCls:'add_contact',
                        height: '26px',
                        width: '26px',
                        listeners: {
                            render: function(c) {
                                c.getEl().on('click', function(e) {
                                    biz_vnc_crm_client.add_contact(1);
                                }, c);
                            }
                        }
                    }]
                }, {
                    columnWidth: .33,
                    border: false,
                    layout: 'anchor',
                    items: [{
                        xtype: 'combo',
                        mode: 'local',
                        value: 'oppsection',
                        triggerAction: 'all',
                        forceSelection: true,
                        fieldLabel: biz_vnc_crm_client.section,
                        id: 'cmbOppsection',
                        name: 'title',
                        displayField: 'sectionName',
                        valueField: 'sectionId',
                        queryMode: 'local',
                        store: Ext.create('Ext.data.Store', {
                            model: 'section',
                            proxy: {
                                type: 'memory',
                                data: biz_vnc_crm_client.responseSection
                            },
                            autoLoad: true,
                            actionMethods: {
                                read: 'POST'
                            }
                        }),
                        anchor: '95%'
                    }, {
                        xtype: 'combo',
                        mode: 'local',
                        value: 'oppcategory',
                        triggerAction: 'all',
                        forceSelection: true,
                        fieldLabel: biz_vnc_crm_client.category,
                        id: 'cmbOppcategory',
                        name: 'title',
                        displayField: 'categoryName',
                        valueField: 'categoryId',
                        queryMode: 'local',
                        store: Ext.create('Ext.data.Store', {
                            model: 'category',
                            proxy: {
                                type: 'memory',
                                data: biz_vnc_crm_client.responseCategory
                            },
                            autoLoad: true,
                            actionMethods: {
                                read: 'POST'
                            }
                        }),
                        anchor: '95%'
                    }, {
                        xtype: 'textareafield',
                        grow: false,
                        id: 'txtOppDetails',
                        name: 'Details',
                        fieldLabel: biz_vnc_crm_client.description,
                        anchor: '95%'
                    }]
                }]
            }, {
                title: biz_vnc_crm_client.tabLead,
                layout: 'column',
                height: 250,
                items: [{
                    columnWidth: .33,
                    layout: 'anchor',
                    border: false,
                    items: [{
                        xtype: 'textfield',
                        id: 'txtOppStreet1',
                        fieldLabel: biz_vnc_crm_client.street1,
                        anchor: '95%',
                        maxLength: 256
                    }, {
                        xtype: 'textfield',
                        id: 'txtOppStreet2',
                        fieldLabel: biz_vnc_crm_client.street2,
                        anchor: '95%',
                        maxLength: 256
                    }, {
                        xtype: 'textfield',
                        id: 'txtOppCity',
                        fieldLabel: biz_vnc_crm_client.city,
                        anchor: '95%',
                        maxLength: 64
                    }, {
                        xtype: 'textfield',
                        id: 'txtOppZip',
                        fieldLabel: biz_vnc_crm_client.zipCode,
                        anchor: '95%',
                        maxLength: 8
                    }, {
                        xtype: 'combo',
                        mode: 'local',
                        value: 'oppstate',
                        triggerAction: 'all',
                        forceSelection: true,
                        fieldLabel: biz_vnc_crm_client.state,
                        id: 'cmbOppstate',
                        name: 'title',
                        displayField: 'stateName',
                        valueField: 'stateId',
                        queryMode: 'local',
                        autoSelect: true,
                        store: Ext.create('Ext.data.Store', {
                            model: 'state',
                            proxy: {
                                type: 'memory',
                                data: biz_vnc_crm_client.responseState
                            },
                            autoLoad: true,
                            actionMethods: {
                                read: 'POST'
                            }
                        }),
                        anchor: '95%'
                    }, {
                        xtype: 'combo',
                        mode: 'local',
                        value: 'oppcountry',
                        triggerAction: 'all',
                        forceSelection: true,
                        fieldLabel: biz_vnc_crm_client.country,
                        id: 'cmbOppcountry',
                        name: 'title',
                        displayField: 'countryName',
                        valueField: 'countryId',
                        queryMode: 'local',
                        autoSelect: true,
                        store: Ext.create('Ext.data.Store', {
                            model: 'country',
                            proxy: {
                                type: 'memory',
                                data: biz_vnc_crm_client.responseCountry
                            },
                            autoLoad: true,
                            actionMethods: {
                                read: 'POST'
                            }

                        }),
                        anchor: '95%'
                    }]
                }, {
                    columnWidth: .33,
                    border: false,
                    layout: 'anchor',
                    items: [{
                        xtype: 'textfield',
                        fieldLabel: biz_vnc_crm_client.mobile,
                        id: 'txtOppMobile',
                        anchor: '95%',
                        maxLength: 16
                    }, {
                        xtype: 'textfield',
                        fieldLabel: biz_vnc_crm_client.workPhone,
                        id: 'txtOppWorkPhone',
                        anchor: '95%',
                        maxLength: 16
                    }, {
                        xtype: 'textfield',
                        fieldLabel: biz_vnc_crm_client.fax,
                        id: 'txtOppFax',
                        anchor: '95%',
                        maxLength: 16
                    }, {
                        xtype: 'combo',
                        mode: 'local',
                        value: 'channel',
                        triggerAction: 'all',
                        forceSelection: true,
                        fieldLabel: biz_vnc_crm_client.channel,
                        id: 'cmbOppchannel',
                        name: 'channel',
                        displayField: 'channelName',
                        valueField: 'channelId',
                        queryMode: 'local',
                        store: store1 = Ext.create('Ext.data.Store', {
                            model: 'channel',
                            proxy: {
                                type: 'memory',
                                data: biz_vnc_crm_client.responseChannel
                            },
                            autoLoad: true,
                            actionMethods: {
                                read: 'POST'
                            }
                        }),
                        anchor: '95%'
                    }]
                }]
            }, {
                title: biz_vnc_crm_client.tabComm_History,
                id: 'oppComm',
                height: 250,
                layout: 'column',
                disabled: true,
                width: '100%',
                dockedItems: [{
                    xtype: 'toolbar',
                    items: [{
                        iconCls: 'attachment',
                        text: biz_vnc_crm_client.btnAttach,
                        handler: function () {
                            var leadId = rec.get('leadId');
                            var flag = 1;
                            biz_vnc_crm_client_HandlerObject.prototype.showAttachMailDialog(leadId, flag);
                        }
                    }, {
                        iconCls: 'cancel',
                        id: 'btnMailDelete',
                        disabled: true,
                        text: biz_vnc_crm_client.btnDelete,
                        handler: function () {
                            Ext.MessageBox.confirm(biz_vnc_crm_client.msgConfirmHeader, biz_vnc_crm_client.msgConfirm, showResult);

                            function showResult(btn) {
                                if (btn == "yes") {
                                    var rec1 = Ext.getCmp('oppMailGrid').getSelectionModel().getSelection();
                                    var idArray = [];
                                    Ext.each(rec1, function (item) {
                                        idArray.push(item.data.id);
                                    });

                                    var leadId = rec.get('leadId');
                                    var curUserId = appCtxt.getUsername();
                                    var responseUser = biz_vnc_crm_client.rpc("jsonobj={\"action\":\"DELETEHISTORY\",\"object\":\"opp\",\"array\":\"" + idArray + "\",\"curUserId\":\"" + curUserId + "\",\"leadId\":\"" + leadId + "\"}");
                                    biz_vnc_crm_client.msgNotification(responseUser.text);
                                    if (responseUser.text != 20) {
                                        if (rec != null) {
                                            var leadId = rec.get('leadId');
                                            biz_vnc_crm_client.requestMailList(leadId, "oppMailGrid");
                                        }
                                    }
                                }
                            };
                        }
                    }, {
                        iconCls: 'email',
                        text: biz_vnc_crm_client.btnNew,
                        itemId: 'newmail',
                        handler: function () {
                            biz_vnc_crm_client.flag = 1;
                            var leadId = rec.get('leadId');
                            biz_vnc_crm_client.composeMail(leadId);
                        }
                    }, {
                        iconCls: 'refresh',
                        text: biz_vnc_crm_client.btnRefresh,
                        itemId: 'refresh',
                        handler: function () {
                            if (rec != null) {
                                var leadId = rec.get('leadId');
                                biz_vnc_crm_client.requestMailList(leadId, "oppMailGrid");
                            }
                        }
                    }]
                }, {
                    xtype: 'grid',
                    selModel: oppSMMail,
                    id: 'oppMailGrid',
                    height: 215,
                    defaults: {
                        autoRender: true,
                        autoScroll: true
                    },
                    store: Ext.create('Ext.data.Store', {
                        model: 'mail',
                        proxy: {
                            type: 'memory',
                            data: jsonParse(biz_vnc_crm_client.mailData)
                        },
                        autoLoad: true,
                        actionMethods: {
                            read: 'POST'
                        }
                    }),
                    columnLines: true,
                    columns: [{
                        text: biz_vnc_crm_client.date,
                        sortable: false,
                        width: 170,
                        dataIndex: 'date',
                        renderer: function(value) {
                            if (value) {
                                return new Date(value).toUTCString();
                            } else {
                                return value;
                            }
                        }
                    }, {
                        text: biz_vnc_crm_client.from,
                        sortable: false,
                        width: 200,
                        dataIndex: 'from'
                    }, {
                        text: biz_vnc_crm_client.subject,
                        width: 250,
                        sortable: true,
                        dataIndex: 'subject'
                    }, {
                        text: biz_vnc_crm_client.message,
                        width: 500,
                        sortable: true,
                        dataIndex: 'fragment'
                    }],
                    title: null,
                    viewConfig: {
                        stripeRows: true
                    },
                    listeners: {
                        el:{
                            dblclick: function(){
                                var rec = Ext.getCmp('oppMailGrid').getSelectionModel().selected;
                                biz_vnc_crm_client.mailInfowindow(rec);
                            }
                        }
                    }
                }]
            }, {
                title: biz_vnc_crm_client.tabAppointment,
                id: 'oppAppointment',
                layout: 'column',
                disabled: true,
                width: '100%',
                height: 250,
                dockedItems: [{
                    xtype: 'toolbar',
                    items: [{
                        iconCls: 'attachment',
                        text: biz_vnc_crm_client.btnAttach,
                        handler: function () {
                            var leadId = rec.get('leadId');
                            var flag = 1;
                            biz_vnc_crm_client_HandlerObject.prototype.showAttachAppointmentDialog(leadId, flag);
                        }
                    }, {
                        iconCls: 'cancel',
                        id: 'btnApptDelete',
                        disabled: true,
                        text: biz_vnc_crm_client.btnDelete,
                        handler: function () {
                            Ext.MessageBox.confirm(biz_vnc_crm_client.msgConfirmHeader, biz_vnc_crm_client.msgConfirm, showResult);

                            function showResult(btn) {
                                if (btn == "yes") {
                                    var rec1 = Ext.getCmp('oppApptGrid').getSelectionModel().getSelection();
                                    var idArray = [];
                                    Ext.each(rec1, function (item) {
                                        idArray.push("'" + item.data.inviteId + "'");
                                    });

                                    var leadId = rec.get('leadId');
                                    var curUserId = appCtxt.getUsername();
                                    var responseUser = biz_vnc_crm_client.rpc("jsonobj={\"action\":\"DELETEAPPT\",\"object\":\"opp\",\"array\":\"" + idArray + "\",\"curUserId\":\"" + curUserId + "\",\"leadId\":\"" + leadId + "\"}");
                                    biz_vnc_crm_client.msgNotification(responseUser.text);
                                    if (responseUser.text != 20) {
                                        if (rec != null) {
                                            var leadId = rec.get('leadId');
                                            biz_vnc_crm_client.requestApptList(leadId, "oppApptGrid");
                                        }
                                    }
                                }
                            };
                        }
                    }, {
                        iconCls: 'appointment',
                        text: biz_vnc_crm_client.btnNew,
                        itemId: 'newappoint',
                        handler: function () {
                            if (rec != null) {
                                biz_vnc_crm_client.leadId = rec.get('leadId');
                                biz_vnc_crm_client.flag = 1;
                                biz_vnc_crm_client.createAppointment();
                            }
                        }
                    }, {
                        iconCls: 'refresh',
                        text: biz_vnc_crm_client.btnRefresh,
                        itemId: 'refresh',
                        handler: function () {
                            if (rec != null) {
                                var leadId = rec.get('leadId');
                                biz_vnc_crm_client.requestApptList(leadId, "oppApptGrid");
                            }
                        }
                    }]
                }, {
                    xtype: 'grid',
                    selModel: oppSMAppt,
                    id: 'oppApptGrid',
                    height: 215,
                    defaults: {
                        autoRender: true,
                        autoScroll: true
                    },
                    store: Ext.create('Ext.data.Store', {
                        model: 'oppApptModel',
                        proxy: {
                            type: 'memory',
                            data: jsonParse(biz_vnc_crm_client.apptData)
                        },
                        autoLoad: true,
                        actionMethods: {
                            read: 'POST'
                        }
                    }),
                    columnLines: true,
                    columns: [{
                        text: biz_vnc_crm_client.subject,
                        sortable: false,
                        width: 400,
                        dataIndex: 'name'
                    }, {
                        text: biz_vnc_crm_client.locations,
                        sortable: false,
                        width: 250,
                        dataIndex: 'location'
                    }, {
                        text: biz_vnc_crm_client.start_date,
                        sortable: false,
                        width: 200,
                        dataIndex: 'startTime',
                        renderer: function(value) {
                            if (value) {
                                return new Date(value).toUTCString();
                            } else {
                                return value;
                            }
                        }
                    }],
                    title: null,
                    viewConfig: {
                        stripeRows: true
                    },
                    listeners: {
                        el: {
                            dblclick: function(){
                                var rec = Ext.getCmp('oppApptGrid').getSelectionModel().selected;
                                biz_vnc_crm_client.viewApptDetails(rec);
                            }
                        }
                    }
                }]
            }, {
                title: biz_vnc_crm_client.tabTask,
                id: 'oppTask',
                layout: 'column',
                disabled: true,
                width: '100%',
                height: 250,
                dockedItems: [{
                    xtype: 'toolbar',
                    items: [{
                        iconCls: 'attachment',
                        text: biz_vnc_crm_client.btnAttach,
                        handler: function () {
                            var leadId = rec.get('leadId');
                            var flag = 1;
                            biz_vnc_crm_client_HandlerObject.prototype.showAttachTaskDialog(leadId, flag);
                        }
                    }, {
                        iconCls: 'cancel',
                        id: 'btnTaskDelete',
                        disabled: true,
                        text: biz_vnc_crm_client.btnDelete,
                        handler: function () {
                            Ext.MessageBox.confirm(biz_vnc_crm_client.msgConfirmHeader, biz_vnc_crm_client.msgConfirm, showResult);

                            function showResult(btn) {
                                if (btn == "yes") {
                                    var rec1 = Ext.getCmp('oppTaskGrid').getSelectionModel().getSelection();
                                    var idArray = [];
                                    Ext.each(rec1, function (item) {
                                        idArray.push("'" + item.data.inviteId + "'");
                                    });

                                    var leadId = rec.get('leadId');
                                    var curUserId = appCtxt.getUsername();
                                    var responseUser = biz_vnc_crm_client.rpc("jsonobj={\"action\":\"DELETETASK\",\"object\":\"opp\",\"array\":\"" + idArray + "\",\"curUserId\":\"" + curUserId + "\",\"leadId\":\"" + leadId + "\"}");
                                    biz_vnc_crm_client.msgNotification(responseUser.text);
                                    if (responseUser.text != 20) {
                                        if (rec != null) {
                                            var leadId = rec.get('leadId');
                                            biz_vnc_crm_client.requestTaskList(leadId, "oppTaskGrid");
                                        }
                                    }
                                }
                            };
                        }
                    }, {
                        iconCls: 'task',
                        text: biz_vnc_crm_client.btnNew,
                        itemId: 'newtask',
                        handler: function () {
                            biz_vnc_crm_client.flag = 1;
                            var leadId = rec.get('leadId');
                            var taskController = new ZmCRMTaskController(appCtxt.getApp(ZmApp.TASKS)._container, appCtxt.getApp(ZmApp.TASKS), appCtxt.getCurrentViewId(), leadId);
                            taskController.initComposeView();
                            taskController.show(new ZmTask(null, null, 15), ZmCalItem.MODE_NEW, true);
                        }
                    }, {
                        iconCls: 'refresh',
                        text: biz_vnc_crm_client.btnRefresh,
                        itemId: 'refresh',
                        handler: function () {
                            if (rec != null) {
                                var leadId = rec.get('leadId');
                                biz_vnc_crm_client.requestTaskList(leadId, "oppTaskGrid");
                            }
                        }
                    }]
                }, {
                    xtype: 'grid',
                    selModel: oppSMTask,
                    id: 'oppTaskGrid',
                    height: 215,
                    defaults: {
                        autoRender: true,
                        autoScroll: true
                    },
                    store: Ext.create('Ext.data.Store', {
                        model: 'oppTaskModel',
                        proxy: {
                            type: 'memory',
                            data: jsonParse(oppTaskListData)
                        },
                        autoLoad: true,
                        actionMethods: {
                            read: 'POST'
                        }
                    }),
                    columnLines: true,
                    columns: [{
                        text: biz_vnc_crm_client.subject,
                        sortable: false,
                        width: 600,
                        dataIndex: 'name'
                    }, {
                        text: biz_vnc_crm_client.status,
                        width: 200,
                        sortable: true,
                        dataIndex: 'status'
                    }, {
                        text: biz_vnc_crm_client.complete,
                        width: 100,
                        sortable: true,
                        dataIndex: 'percentComplete'
                    }, {
                        text: biz_vnc_crm_client.dueDate,
                        sortable: false,
                        width: 200,
                        dataIndex: 'startDate',
                        renderer: function(value) {
                            if (value) {
                                return new Date(value).toUTCString();
                            } else {
                                return value;
                            }
                        }
                    }],
                    title: null,
                    viewConfig: {
                        stripeRows: true
                    },
                    listeners: {
                        el: {
                            dblclick: function(){
                                var rec = Ext.getCmp('oppTaskGrid').getSelectionModel().selected;
                                biz_vnc_crm_client.viewTaskDetails(rec);
                            }
                        }
                    }
                }]
            }, {
                title: biz_vnc_crm_client.tabExtraInfo,
                layout: 'column',
                height: 250,
                items: [{
                    columnWidth: .50,
                    border: false,
                    layout: 'anchor',
                    items: [{
                        xtype: 'datefield',
                        fieldLabel: biz_vnc_crm_client.creationDate,
                        format: 'Y-m-d H:i:s.0',
                        id: 'dateOppCreationdate',
                        disabled: true,
                        anchor: '60%'
                    }, {
                        xtype: 'datefield',
                        id: 'dateOppUpdateDate',
                        format: 'Y-m-d H:i:s.0',
                        disabled: true,
                        fieldLabel: biz_vnc_crm_client.updateDate,
                        anchor: '60%'
                    }, {
                        xtype: 'datefield',
                        id: 'dateOppOpened',
                        format: 'Y-m-d H:i:s.0',
                        disabled: true,
                        fieldLabel: biz_vnc_crm_client.opened,
                        anchor: '60%'
                    }, {
                        xtype: 'datefield',
                        id: 'dateOppClosed',
                        format: 'Y-m-d H:i:s.0',
                        disabled: true,
                        fieldLabel: biz_vnc_crm_client.closed,
                        anchor: '60%'
                    }]
                }, {
                    columnWidth: .50,
                    border: false,
                    layout: 'anchor',
                    items: [{
                        xtype: 'textfield',
                        fieldLabel: biz_vnc_crm_client.daystoOpen,
                        id: 'txtOppDaysToOpen',
                        name: 'days2open',
                        disabled: true,
                        value: '0.00',
                        anchor: '60%'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: biz_vnc_crm_client.daystoClose,
                        id: 'txtOppDaysToClose',
                        disabled: true,
                        name: 'days2close',
                        value: '0.00',
                        anchor: '60%'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: biz_vnc_crm_client.referredBy,
                        id: 'txtOppReferredBy',
                        name: 'last',
                        anchor: '60%',
                        maxLength: 64
                    }]
                }]
            }],
            listeners: {
                'tabchange': function (tabPanel, tab) {
                    if (tab.id == 'oppAppointment') {
                        if (rec != null) {
                            Ext.getCmp('oppApptGrid').getStore().removeAll();
                            var leadId = rec.get('leadId');
                            biz_vnc_crm_client.requestApptList(leadId, "oppApptGrid")
                        }
                    } else if (tab.id == 'oppTask') {
                        if (rec != null) {
                            Ext.getCmp('oppTaskGrid').getStore().removeAll();
                            var leadId = rec.get('leadId');
                            biz_vnc_crm_client.requestTaskList(leadId, "oppTaskGrid");
                        }
                    } else if (tab.id == 'oppComm') {
                        if (rec != null) {
                            Ext.getCmp('oppMailGrid').getStore().removeAll();
                            var leadId = rec.get('leadId');
                            biz_vnc_crm_client.requestMailList(leadId, "oppMailGrid");
                        }
                    }
                }
            }
        }],
        buttons: [{
            text: biz_vnc_crm_client.btnSave,
            width: 150,
            height: 25,
            iconCls: 'save',
            handler: function () {
                if (Ext.getCmp('txtOppOpportunity').getValue() == "") {
                    Ext.getCmp('txtOppOpportunity').validate(false);
                    Ext.getCmp('txtOppOpportunity').focus(true);
                }
                var oppForm = Ext.getCmp('formOpportunity').getForm();
                if (oppForm.hasInvalidField()) {
                    Ext.example.msg('', biz_vnc_crm_client.msgInvalidField);
                } else {
                    var subjectName = Ext.getCmp('txtOppOpportunity').getValue();
                    var stageId = Ext.getCmp('cmbOppstage').getValue();
                    var probability = Ext.getCmp('txtOppProbability').getValue();
                    var nextAction = Ext.getCmp('txtOppNextAction').getValue();
                    var sectionId = Ext.getCmp('cmbOppsection').getValue();
                    var categoryId = Ext.getCmp('cmbOppcategory').getValue();
                    var partnerName = ZmOpportunityListView.selectedOppPartnerName;
                    var leadDescription = Ext.getCmp('txtOppDetails').getValue();
                    var contactName = Ext.getCmp('txtOppContact').getValue();
                    var email = Ext.getCmp('txtOppEmail').getValue();
                    var fax = Ext.getCmp('txtOppFax').getValue();
                    var phone = Ext.getCmp('txtOppPhone').getValue();
                    var mobile = Ext.getCmp('txtOppMobile').getValue();
                    var street1 = Ext.getCmp('txtOppStreet1').getValue();
                    var street2 = Ext.getCmp('txtOppStreet2').getValue();
                    var city = Ext.getCmp('txtOppCity').getValue();
                    var zip = Ext.getCmp('txtOppZip').getValue();
                    var stateId = Ext.getCmp('cmbOppstate').getValue();
                    var countryId = Ext.getCmp('cmbOppcountry').getValue();
                    var channelId = Ext.getCmp('cmbOppchannel').getValue();
                    var leadClassId = Ext.getCmp('cmbOppleadClass').getValue();
                    var companyId = Ext.getCmp('cmbOppcompanyName').getValue();

                    var status = true;
                    var createBy = appCtxt.getUsername();

                    var expectedDateClose = Ext.getCmp('dateOppExpectedClosing').getSubmitValue();
                    if (expectedDateClose == '') {
                        expectedDateClose = '0000-00-00 00:00:00';
                    }

                    var nextActionDate = Ext.getCmp('dateOppNextActionDate').getSubmitValue();
                    if (nextActionDate == '') {
                        nextActionDate = '0000-00-00 00:00:00';
                    }

                    var createDate = Ext.getCmp('dateOppCreationdate').getSubmitValue();
                    if (createDate == '') {
                        createDate = '0000-00-00 00:00:00';
                    }

                    var writeBy = appCtxt.getUsername();
                    var writeDate = Ext.getCmp('dateOppUpdateDate').getSubmitValue();
                    if (writeDate == '') {
                        writeDate = '0000-00-00 00:00:00';
                    }
                    var dateOpen = Ext.getCmp('dateOppOpened').getSubmitValue();
                    if (dateOpen == '') {
                        dateOpen = '0000-00-00 00:00:00';
                    }

                    var dateClose = Ext.getCmp('dateOppClosed').getSubmitValue();
                    if (dateClose == '') {
                        dateClose = '0000-00-00 00:00:00';
                    }
                    var dayopen = Ext.getCmp('txtOppDaysToOpen').getValue();
                    var dayclose = Ext.getCmp('txtOppDaysToClose').getValue();
                    var referredBy = Ext.getCmp('txtOppReferredBy').getValue();

                    var userId = Ext.getCmp('cmbOppsalesman').getValue();
                    if (userId == null) {
                        userId = appCtxt.getUsername();
                    }
                    var leadState = Ext.getCmp('txtOppState').getValue();
                    var priorityId = Ext.getCmp('cmbOpppriority').getValue();
                    var type = 1;
                    var valuation = Ext.getCmp('txtOppExpectedRevenue').getValue();
                    var workPhone = Ext.getCmp('txtOppWorkPhone').getValue();

                    if (rec != null) {
                        var leadId = rec.get('leadId');
                        var j = JSON.stringify({
                            action: "UPDATE",
                            object: "opp",
                            curUserId: appCtxt.getUsername(),
                            leadId: leadId,
                            subjectName: subjectName,
                            stageId: stageId,
                            priorityId: priorityId,
                            channelId: channelId,
                            categoryId: categoryId,
                            contactName: contactName,
                            email: email,
                            street1: street1,
                            city: city,
                            stateId: stateId,
                            countryId: countryId,
                            type: type,
                            writeDate: writeDate,
                            writeBy: writeBy,
                            createDate: createDate,
                            createBy: createBy,
                            status: status,
                            nextAction: nextAction,
                            nextActionDate: nextActionDate,
                            userId: userId,
                            referredBy: referredBy,
                            dayClose: dayclose,
                            dayOpen: dayopen,
                            sectionId: sectionId,
                            expectedDateClose: expectedDateClose,
                            dateClose: dateClose,
                            dateOpen: dateOpen,
                            zip: zip,
                            street2: street2,
                            mobile: mobile,
                            workPhone: workPhone,
                            fax: fax,
                            phone: phone,
                            leadDescription: leadDescription,
                            valuation: valuation,
                            companyId: companyId,
                            leadState: leadState,
                            leadClassId: leadClassId,
                            probability: probability,
                            partnerName: partnerName
                        });
                        var response = biz_vnc_crm_client.rpc("jsonobj=" + j);
                    } else {
                        var leadId = 0;
                        var j = JSON.stringify({
                            action: "ADD",
                            object: "opp",
                            leadId: leadId,
                            subjectName: subjectName,
                            stageId: stageId,
                            priorityId: priorityId,
                            channelId: channelId,
                            categoryId: categoryId,
                            contactName: contactName,
                            email: email,
                            street1: street1,
                            city: city,
                            stateId: stateId,
                            countryId: countryId,
                            type: type,
                            writeDate: writeDate,
                            writeBy: writeBy,
                            createDate: createDate,
                            createBy: createBy,
                            status: status,
                            nextAction: nextAction,
                            nextActionDate: nextActionDate,
                            userId: userId,
                            referredBy: referredBy,
                            dayClose: dayclose,
                            dayOpen: dayopen,
                            sectionId: sectionId,
                            expectedDateClose: expectedDateClose,
                            dateClose: dateClose,
                            dateOpen: dateOpen,
                            zip: zip,
                            street2: street2,
                            mobile: mobile,
                            workPhone: workPhone,
                            fax: fax,
                            phone: phone,
                            leadDescription: leadDescription,
                            valuation: valuation,
                            companyId: companyId,
                            leadState: leadState,
                            leadClassId: leadClassId,
                            probability: probability,
                            partnerName: partnerName
                        });
                        var response = biz_vnc_crm_client.rpc("jsonobj=" + j);
                    }
                    biz_vnc_crm_client.msgNotification(response.text);
                    biz_vnc_crm_client.switchingView(app);
                }
            }
        }, {
            id: 'btnOppCancel',
            text: biz_vnc_crm_client.btnCancel,
            width: 150,
            height: 25,
            iconCls: 'cancel',
            handler: function () {
                biz_vnc_crm_client.switchingView(app);
            }
        }]
    });
    tabOpp.render("OpportunityForm");
    if (rec != null) {
        Ext.getCmp('oppTask').setDisabled(false);
        Ext.getCmp('oppAppointment').setDisabled(false);
        Ext.getCmp('oppComm').setDisabled(false);

        Ext.getCmp('cmbOpppartner').getStore().load({
            callback: function () {
                Ext.getCmp('cmbOpppartner').setValue(rec.get('partnerName'));
                ZmOpportunityListView.selectedOppPartnerName = Ext.getCmp('cmbOpppartner').getValue();
            }
        });
        Ext.getCmp('cmbOppstage').getStore().load({
            callback: function () {
                Ext.getCmp('cmbOppstage').setValue(rec.get('stageId'));
            }
        });
        Ext.getCmp('cmbOpppriority').getStore().load({
            callback: function () {
                Ext.getCmp('cmbOpppriority').setValue(rec.get('priorityId'));
            }
        });
        Ext.getCmp('cmbOppsection').getStore().load({
            callback: function () {
                Ext.getCmp('cmbOppsection').setValue(rec.get('sectionId'));
            }
        });

        Ext.getCmp('cmbOppchannel').getStore().load({
            callback: function () {
                Ext.getCmp('cmbOppchannel').setValue(rec.get('channelId'));
            }
        });
        Ext.getCmp('cmbOppstate').getStore().load({
            callback: function () {
                Ext.getCmp('cmbOppstate').setValue(rec.get('stateId'));
            }
        });
        Ext.getCmp('cmbOppcountry').getStore().load({
            callback: function () {
                Ext.getCmp('cmbOppcountry').setValue(rec.get('countryId'));
            }
        });
        Ext.getCmp('cmbOppcategory').getStore().load({
            callback: function () {
                Ext.getCmp('cmbOppcategory').setValue(rec.get('categoryId'));
            }
        });
        Ext.getCmp('cmbOppcompanyName').getStore().load({
            callback: function () {
                Ext.getCmp('cmbOppcompanyName').setValue(rec.get('companyId'));
            }
        });
        Ext.getCmp('cmbOppsalesman').getStore().load({
            callback: function () {
                Ext.getCmp('cmbOppsalesman').setValue(rec.get('userId'));
            }
        });
        Ext.getCmp('cmbOppleadClass').getStore().load({
            callback: function () {
                Ext.getCmp('cmbOppleadClass').setValue(rec.get('leadClassId'));
            }
        });

        Ext.getCmp('txtOppOpportunity').setValue(rec.get('subjectName'));
        Ext.getCmp('txtOppExpectedRevenue').setValue(rec.get('valuation'));
        Ext.getCmp('txtOppNextAction').setValue(rec.get('nextAction'));
        Ext.getCmp('txtOppProbability').setValue(rec.get('probability'));
        Ext.getCmp('txtOppEmail').setValue(rec.get('email'));
        Ext.getCmp('txtOppPhone').setValue(rec.get('phone'));
        Ext.getCmp('txtOppContact').setValue(rec.get('contactName'));
        Ext.getCmp('txtOppDetails').setValue(rec.get('leadDescription'));
        Ext.getCmp('txtOppStreet1').setValue(rec.get('street1'));
        Ext.getCmp('txtOppStreet2').setValue(rec.get('street2'));
        Ext.getCmp('txtOppCity').setValue(rec.get('city'));
        Ext.getCmp('txtOppZip').setValue(rec.get('zip'));
        Ext.getCmp('txtOppWorkPhone').setValue(rec.get('workPhone'));
        Ext.getCmp('txtOppMobile').setValue(rec.get('mobile'));
        Ext.getCmp('txtOppFax').setValue(rec.get('fax'));
        Ext.getCmp('txtOppDaysToOpen').setValue(rec.get('dayOpen'));
        Ext.getCmp('txtOppDaysToClose').setValue(rec.get('dayClose'));
        Ext.getCmp('txtOppReferredBy').setValue(rec.get('referredBy'));
        Ext.getCmp('dateOppExpectedClosing').setValue(rec.get('expectedDateClose'));
        Ext.getCmp('dateOppOpened').setValue(rec.get('dateOpen'));
        Ext.getCmp('dateOppClosed').setValue(rec.get('dateClose'));
        Ext.getCmp('dateOppCreationdate').setValue(rec.get('createDate'));
        Ext.getCmp('dateOppUpdateDate').setValue(rec.get('writeDate'));
        Ext.getCmp('dateOppNextActionDate').setValue(rec.get('nextActionDate'));
    } else {
        Ext.getCmp('cmbOppsalesman').getStore().load({
            callback: function () {
                Ext.getCmp('cmbOppsalesman').setValue(appCtxt.getUsername());
            }
        });
        Ext.getCmp('cmbOpppriority').getStore().load({
            callback: function () {
                Ext.getCmp('cmbOpppriority').setValue(Ext.getCmp('cmbOpppriority').getStore().data.first());
            }
        });
        Ext.getCmp('cmbOppsection').getStore().load({
            callback: function () {
                Ext.getCmp('cmbOppsection').setValue(Ext.getCmp('cmbOppsection').getStore().data.first());
            }
        });
    }
};
