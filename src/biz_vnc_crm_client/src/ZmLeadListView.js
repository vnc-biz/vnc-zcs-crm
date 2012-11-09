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

var ZmLeadListView = function() {}
ZmLeadListView.prototype.constructor = ZmLeadListView;

ZmLeadListView.prototype.getContacts = function (offset, contactList, rec, app) {
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
        callback: new AjxCallback(this, this.handleGetContactsResponse, [contactList, rec, app]),
        errorCallback: new AjxCallback(this, this.handleGetContactsError)
    };
    appCtxt.getAppController().sendRequest(searchParams);
};

ZmLeadListView.prototype.handleGetContactsResponse = function (contactList, rec, app, result) {
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
                    biz_vnc_crm_client.temp += "{\"value\":\"" + contact.id + "\",\"label\":\"" + ZmLeadListView.CheckField(contact._attrs.company,"<< Blank >>") + "\"}]";
                } else {
                    biz_vnc_crm_client.temp += "{\"value\":\"" + contact.id + "\",\"label\":\"" + ZmLeadListView.CheckField(contact._attrs.company,"<< Blank >>") + "\"},";
                }
            }
        } else {
            biz_vnc_crm_client.temp = "[{'value':'','label':''}]";
        }
        ZmLeadListView.createForm(rec, contactList, app);
        if (response.more) {
            this.getContacts(response.offset + 500, biz_vnc_crm_client.contactList);
        } else {}
    }
};

ZmLeadListView.prototype.toString = function () {
    return "ZmLeadListView";
}

ZmLeadListView._myCancelListener = function (app) {
    app.pushView(app.getName());
}

ZmLeadListView.CheckField = function (field,retValue) {
    if(field == undefined) {
        if(retValue){
            return retValue;
        }else{
            return "";
        }
    } else {
        return field;
    }
}

ZmLeadListView._mySaveResponseListener = function (result) {
    var set = ZmLeadListView.CheckField(result.getResponse().BatchResponse.CreateContactResponse[0].cn[0].id);
    var firstName = ZmLeadListView.CheckField(result.getResponse().BatchResponse.CreateContactResponse[0].cn[0]._attrs.firstName);
    var lastName = ZmLeadListView.CheckField(result.getResponse().BatchResponse.CreateContactResponse[0].cn[0]._attrs.lastName);
    var mobilePhone = ZmLeadListView.CheckField(result.getResponse().BatchResponse.CreateContactResponse[0].cn[0]._attrs.mobilePhone);
    var contactName = firstName + " " + lastName;
    var workPostalCode = ZmLeadListView.CheckField(result.getResponse().BatchResponse.CreateContactResponse[0].cn[0]._attrs.workPostalCode);
    var email = ZmLeadListView.CheckField(result.getResponse().BatchResponse.CreateContactResponse[0].cn[0]._attrs.email);
    var workStreet = ZmLeadListView.CheckField(result.getResponse().BatchResponse.CreateContactResponse[0].cn[0]._attrs.workStreet);
    var workCity = ZmLeadListView.CheckField(result.getResponse().BatchResponse.CreateContactResponse[0].cn[0]._attrs.workCity);
    var company = ZmLeadListView.CheckField(result.getResponse().BatchResponse.CreateContactResponse[0].cn[0]._attrs.company,"<< Blank >>");
    var workState = ZmLeadListView.CheckField(result.getResponse().BatchResponse.CreateContactResponse[0].cn[0]._attrs.workState);
    var workCountry = ZmLeadListView.CheckField(result.getResponse().BatchResponse.CreateContactResponse[0].cn[0]._attrs.workCountry);
    var workFax = ZmLeadListView.CheckField(result.getResponse().BatchResponse.CreateContactResponse[0].cn[0]._attrs.workFax);

    biz_vnc_crm_client.getContacts(0, [], set);
    if(biz_vnc_crm_client.contactFlag == 1){
        Ext.getCmp('cmbOpppartner').getStore().add({
            'value': set,
            'label': company
        });

        Ext.getCmp('cmbOpppartner').setValue(set);
        Ext.getCmp('txtOppMobile').setValue(mobilePhone);
        Ext.getCmp('txtOppContact').setValue(contactName);
        Ext.getCmp('txtOppZip').setValue(workPostalCode);
        Ext.getCmp('txtOppEmail').setValue(email);
        Ext.getCmp('txtOppStreet1').setValue(workStreet);
        Ext.getCmp('txtOppCity').setValue(workCity);
        Ext.getCmp('txtOppFax').setValue(workFax);

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
    } else {
        Ext.getCmp('cmbpartner').getStore().add({
            'value': set,
            'label': company
        });
        Ext.getCmp('cmbpartner').setValue(set);
        Ext.getCmp('txtleadmobile').setValue(mobilePhone);
        Ext.getCmp('txtleadcontactName').setValue(contactName);
        Ext.getCmp('txtleadzip').setValue(workPostalCode);
        Ext.getCmp('txtleademail').setValue(email);
        Ext.getCmp('txtleadstreet1').setValue(workStreet);
        Ext.getCmp('txtleadcity').setValue(workCity);
        Ext.getCmp('txtleadfax').setValue(workFax);

        var state = Ext.getCmp('cmbstate').getStore().findRecord("stateName", workState);
        var country = Ext.getCmp('cmbcountry').getStore().findRecord("countryName", workCountry);

        if (state != null) {
            Ext.getCmp('cmbstate').getStore().load({
                callback: function () {
                    Ext.getCmp('cmbstate').setValue(state.data.stateId);
                }
            });
        } else {
            Ext.getCmp('cmbstate').setValue();
        }
        if (country != null) {
            Ext.getCmp('cmbcountry').getStore().load({
                callback: function () {
                    Ext.getCmp('cmbcountry').setValue(country.data.countryId);
                }
            });
        } else {
            Ext.getCmp('cmbcountry').setValue();
        }
    }
}

ZmLeadListView._mySaveListener = function (app) {
    var modifiedAttributes = appCtxt.getCurrentView().getModifiedAttrs();
    var contact = appCtxt.getCurrentView().getContact();
    appCtxt.getCurrentApp().popView(true);
    batchCmd = new ZmBatchCommand(true, null, true);
    batchCmd.add(new AjxCallback(contact, contact.create, [modifiedAttributes]));
    batchCmd.run(new AjxCallback(this, ZmLeadListView._mySaveResponseListener));
    app.pushView(app.getName());
    return true;
}

ZmLeadListView.selectedLeadPartnerName = null;
ZmLeadListView.createForm = function (rec, contactList, app) {
    var toolbar = app.getToolbar();
    toolbar.setVisibility(false);
    var leadTaskListData = "[{'subject':'','status':'','complete':'','dueDate':''}]";
    biz_vnc_crm_client.apptData = "[{'subject':'','location1':'','calendar':'','startdate':''}]";
    if (biz_vnc_crm_client.mailData == "") {
        biz_vnc_crm_client.mailData = "[{'date':'','from':'','subject':'','message':''}]";
    }
    var json, responsePriority, responseCategory, responseStage, responseChannel, responseState, responseCountry, responseSection, responseUser, responseCompany;
    var reqHeader = {
        "Content-Type": "application/x-www-form-urlencoded"
    };
    var reqJson;
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
        }]
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

    //**********************************************************************************************************

    Ext.define('taskModel', {
        extend: 'Ext.data.Model',
        fields: [{
            name: 'taskId',
            type: 'string'
        }, {
            name: 'subject',
            type: 'string'
        }, {
            name: 'status',
            type: 'string'
        }, {
            name: 'complete',
            type: 'string'
        }, {
            name: 'dueDate',
            type: 'date'
        }

        ]
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

    //**********************************************************************************************************
    Ext.define('mail', {
        extend: 'Ext.data.Model',
        fields: [{
            name: 'mailId',
            type: 'string'
        }, {
            name: 'date',
            type: 'string'
        }, {
            name: 'from',
            type: 'string'
        }, {
            name: 'subject',
            type: 'string'
        }, {
            name: 'message',
            type: 'string'
        }]
    });

    var leadSMMail = Ext.create('Ext.selection.CheckboxModel', {
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

    Ext.define('leadApptModel', {
        extend: 'Ext.data.Model',
        fields: [{
            name: 'appointmentId',
            type: 'string'
        }, {
            name: 'subject',
            type: 'string'
        }, {
            name: 'location1',
            type: 'string'
        }, {
            name: 'status',
            type: 'string'
        }, {
            name: 'calendar',
            type: 'string'
        }, {
            name: 'startdate',
            type: 'string'
        }]
    });

    var leadSMAppt = Ext.create('Ext.selection.CheckboxModel', {
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

    var leadSMTask = Ext.create('Ext.selection.CheckboxModel', {
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

    var tab2 = Ext.create('Ext.form.Panel', {
        title: biz_vnc_crm_client.titleLead,
        id: 'formLead',
        bodyStyle: 'padding:5px',
        width: '100%',
        height: '80%',
        fieldDefaults: {
            msgTarget: 'side'
        },
        defaults: {
            anchor: '100%',
            background: '#DADADA'
        },

        items: [{
            layout: 'column',
            border: false,
            defaults: {
                anchor: '100%',
                background: '#DADADA'
            },
            items: [{
                columnWidth: .25,
                border: false,
                layout: 'anchor',
                items: [{
                    xtype: 'textfield',
                    fieldLabel: biz_vnc_crm_client.subject,
                    id: 'txtleadsubjectName',
                    allowBlank: false,
                    anchor: '95%'
                }, {
                    xtype: 'combo',
                    mode: 'local',
                    value: 'section',
                    triggerAction: 'all',
                    forceSelection: true,
                    fieldLabel: biz_vnc_crm_client.section,
                    id: 'cmbsection',
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
                    listeners: {
                        change: function (combo, ewVal, oldVal) {

                        }
                    },
                    anchor: '95%'
                }, {
                    xtype: 'combo',
                    mode: 'local',
                    value: 'leadClass',
                    triggerAction: 'all',
                    forceSelection: true,
                    tabIndex: 2,
                    fieldLabel: biz_vnc_crm_client.leadClass,
                    id: 'cmbleadClass',
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
                    value: 'priority',
                    triggerAction: 'all',
                    forceSelection: true,
                    fieldLabel: biz_vnc_crm_client.priority,
                    id: 'cmbpriority',
                    name: 'title',
                    displayField: 'priorityName',
                    valueField: 'priorityId',
                    queryMode: 'local',
                    autoSelect: true,
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
                }, {
                    xtype: 'combo',
                    mode: 'local',
                    value: 'stage',
                    triggerAction: 'all',
                    forceSelection: true,
                    fieldLabel: biz_vnc_crm_client.stage,
                    id: 'cmbstage',
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
                            var oldState = Ext.getCmp('txtleadState').getValue();
                            var val = Ext.getCmp('cmbstage').getRawValue();
                            var rec1 = Ext.getCmp('cmbstage').getStore().findRecord("stageName", val);
                            if (rec1 != null) {
                                Ext.getCmp('txtleadState').setValue(rec1.get('stageState'));
                            }
                            var dateOpen = Ext.getCmp('dateopened').getValue();
                            var state = Ext.getCmp('txtleadState').getValue();

                            if (dateOpen == null && state != "New") {
                                Ext.getCmp('dateopened').setValue(new Date());
                                if (state == "Closed") {
                                    Ext.getCmp('dateopened').setValue(new Date());
                                    Ext.getCmp('dateclosed').setValue(new Date());
                                }
                            } else if (dateOpen != null && state == "Closed") {
                                Ext.getCmp('dateclosed').setValue(new Date());
                            }
                            if (oldState == "Closed" && state != "Closed") {
                                Ext.getCmp('dateopened').setValue(new Date());
                                Ext.getCmp('dateclosed').setValue('');
                            }
                            if (Ext.getCmp('dateopened').getValue() != null) {
                                var dayopen = Math.ceil(((new Date().getTime()) - (Ext.getCmp('dateopened').getValue())) / (1000 * 60 * 60 * 24));
                                Ext.getCmp('txtleadday2open').setValue(dayopen);
                            } else { 
                                Ext.getCmp('txtleadday2open').setValue(0);
                            }
                            if (Ext.getCmp('dateclosed').getValue() != null) {
                                var dayclose = Math.ceil(((Ext.getCmp('dateclosed').getValue()) - (Ext.getCmp('dateopened').getValue())) / (1000 * 60 * 60 * 24));
                                Ext.getCmp('txtleadday2close').setValue(dayclose);
                            } else {
                                Ext.getCmp('txtleadday2close').setValue(0);
                            }
                        }
                    },
                    anchor: '95%'
                }, {
                    xtype: 'textfield',
                    id: 'txtleadState',
                    fieldLabel: biz_vnc_crm_client.leadState,
                    value: 'New',
                    disabled: true
                }]
            }, {
                columnWidth: .25,
                border: false,
                layout: 'anchor',
                defaultType: 'textfield',
                items: [{
                    xtype: 'combo',
                    mode: 'local',
                    value: 'category',
                    triggerAction: 'all',
                    forceSelection: true,
                    fieldLabel: biz_vnc_crm_client.category,
                    id: 'cmbcategory',
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
                    xtype: 'combo',
                    mode: 'local',
                    value: 'salesman',
                    triggerAction: 'all',
                    forceSelection: true,
                    fieldLabel: biz_vnc_crm_client.salesman,
                    id: 'cmbsalesman',
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
                    listConfig: {
                        getInnerTpl: function () {
                            return '<div data-qtip="{label}. {name}">{label}</div>';
                        }
                    },
                    anchor: '95%'
                }]
            }, {
                columnWidth: .25,
                border: false,
                layout: 'anchor',
                defaultType: 'textfield',

                items: [{
                    xtype: 'button',
                    id: 'btnConvertToOpp',
                    disabled: true,
                    text: biz_vnc_crm_client.btnLeadToOpp,
                    width: 250,
                    height: 25,
                    iconCls: 'convert',
                    anchor: '95%',
                    handler: function () {
                        var json = "jsonobj={\"action\":\"COUNT\",\"object\":\"opp\"}";
                        var reqHeader = {
                            "Content-Type": "application/x-www-form-urlencoded"
                        };
                        var reqJson = AjxStringUtil.urlEncode(json);
                        var response = AjxRpc.invoke(reqJson, "/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);

                        if (response.text == 2){
                            Ext.Msg.alert(biz_vnc_crm_client.notification, biz_vnc_crm_client.usageLimitMessage);
                            return;
                        }

                        if (Ext.getCmp('txtleadsubjectName').getValue() == "") {
                            Ext.getCmp('txtleadsubjectName').validate(false);
                            Ext.getCmp('txtleadsubjectName').focus(true);
                            var leadEmptyField = [];
                            leadEmptyField.push(Ext.getCmp('txtleadsubjectName').fieldLabel);
                            Ext.example.msg('', leadEmptyField + " " + biz_vnc_crm_client.msgEmptyField);
                        } else {
                            var subjectName = Ext.getCmp('txtleadsubjectName').getValue();
                            var leadDescription = Ext.getCmp('txtleadleadDescription').getValue();
                            var contactName = Ext.getCmp('txtleadcontactName').getValue();
                            var phone = Ext.getCmp('txtleadphone').getValue();
                            var fax = Ext.getCmp('txtleadfax').getValue();
                            var email = Ext.getCmp('txtleademail').getValue();
                            var workPhone = Ext.getCmp('txtleadworkPhone').getValue();
                            var mobile = Ext.getCmp('txtleadmobile').getValue();
                            var street1 = Ext.getCmp('txtleadstreet1').getValue();
                            var street2 = Ext.getCmp('txtleadstreet2').getValue();
                            var city = Ext.getCmp('txtleadcity').getValue();
                            var zip = Ext.getCmp('txtleadzip').getValue();
                            var stateId = Ext.getCmp('cmbstate').getValue();
                            var countryId = Ext.getCmp('cmbcountry').getValue();
                            var type = 1;
                            var dateOpen = Ext.getCmp('dateopened').getSubmitValue();
                            if (dateOpen == '') {
                                dateOpen = '0000-00-00 00:00:00';
                            }
                            var dateClose = Ext.getCmp('dateclosed').getSubmitValue();
                            if (dateClose == '') {
                                dateClose = '0000-00-00 00:00:00';
                            }
                            var expectedDateClose = Ext.getCmp('dateupdatedate').getSubmitValue();
                            if (expectedDateClose == '') {
                                expectedDateClose = '0000-00-00 00:00:00';
                            }
                            var stageId = Ext.getCmp('cmbstage').getValue();
                            var channelId = Ext.getCmp('cmbchannel').getValue();
                            var leadClassId = Ext.getCmp('cmbleadClass').getValue();
                            var sectionId = Ext.getCmp('cmbsection').getValue();
                            var categoryId = Ext.getCmp('cmbcategory').getValue();
                            var partnerName = ZmLeadListView.selectedLeadPartnerName;
                            var dayopen = Ext.getCmp('txtleadday2open').getValue();
                            var dayclose = Ext.getCmp('txtleadday2close').getValue();
                            var referredBy = Ext.getCmp('txtleadreferredby').getValue();
                            var userId = Ext.getCmp('cmbsalesman').getValue();
                            if (userId == null) {
                                userId = appCtxt.getUsername();
                            }
                            var priorityId = Ext.getCmp('cmbpriority').getValue();
                            var nextActionDate = '0000-00-00 00:00:00';
                            var nextAction = "";
                            var status = true;
                            var createBy = appCtxt.getUsername();
                            var createDate = Ext.getCmp('datecreationdate').getSubmitValue();
                            if (createDate == '') {
                                createDate = '0000-00-00 00:00:00';
                            }
                            var writeBy = appCtxt.getUsername();
                            var writeDate = Ext.getCmp('dateupdatedate').getSubmitValue();
                            if (writeDate == '') {
                                writeDate = '0000-00-00 00:00:00';
                            }
                            var valuation = "000";
                            var companyId = Ext.getCmp('cmbcompanyName').getValue();
                            var leadState = Ext.getCmp('txtleadState').getValue();
                            var probability = 0;
                            if (rec != null) {
                                var leadId = rec.get('leadId');
                                var j = JSON.stringify({
                                    action: "UPDATE",
                                    object: "lead",
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
                                var json = "jsonobj=" + j;
                                var reqHeader = {
                                    "Content-Type": "application/x-www-form-urlencoded"
                                };
                                var reqJson = AjxStringUtil.urlEncode(json);
                                var response = AjxRpc.invoke(reqJson, "/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);
                            }
                            Ext.example.msg('', biz_vnc_crm_client.msgLeadToOpp);
                            var content = AjxTemplate.expand("biz_vnc_crm_client.templates.OpportunityForm#OpportunityFormMain");
                            app.setContent(content);
							appCtxt.getCurrentApp()._overviewPanelContent._children._array[1]._children._array[1]._setSelected(false);
							appCtxt.getCurrentApp()._overviewPanelContent._children._array[1]._children._array[2]._setSelected(true);
                            ZmOpportunityListView.prototype.getContacts(0, [], rec, app);
                        }
                    }
                }]
            }]
        }, {
            xtype: 'tabpanel',
            plain: true,
            id: 'leadTabPanel',
            activeTab: 0,
            height: '80%',
            layoutOnTabChange: true,
            defaults: {
                bodyStyle: 'padding:10px',
                background: '#DADADA'
            },
            items: [{
                title: biz_vnc_crm_client.tabContactInfo,
                height: '70%',
                height: 250,
                layout: 'column',
                items: [{
                    columnWidth: .32,
                    border: false,
                    layout: 'anchor',
                    border: false,
                    items: [{
                        xtype: 'combo',
                        mode: 'local',
                        value: 'Partner',
                        triggerAction: 'all',
                        forceSelection: true,
                        fieldLabel: 'Partner',
                        id: 'cmbpartner',
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
							select: function(box, record, index) {
								var selname = Ext.getCmp('cmbpartner').getValue();
								ZmLeadListView.selectedLeadPartnerName = selname;
                                for (var i = 0; i < biz_vnc_crm_client.contactList.length; i++) {
                                    if (biz_vnc_crm_client.contactList[i].id == selname) {
                                        var contactName = ZmLeadListView.CheckField(biz_vnc_crm_client.contactList[i]._attrs.firstName) + " " + ZmLeadListView.CheckField(biz_vnc_crm_client.contactList[i]._attrs.lastName);
                                        var workState = ZmLeadListView.CheckField(biz_vnc_crm_client.contactList[i]._attrs.workState);
                                        var workCountry = ZmLeadListView.CheckField(biz_vnc_crm_client.contactList[i]._attrs.workCountry);
                                        var state = Ext.getCmp('cmbstate').getStore().findRecord("stateName", workState);
                                        var country = Ext.getCmp('cmbcountry').getStore().findRecord("countryName", workCountry);
                                        if (state != null) {
                                            Ext.getCmp('cmbstate').getStore().load({
                                                callback: function () {
                                                    Ext.getCmp('cmbstate').setValue(state.data.stateId);
                                                }
                                            });
                                        } else {
                                            Ext.getCmp('cmbstate').setValue();
                                        }
                                        if (country != null) {
                                            Ext.getCmp('cmbcountry').getStore().load({
                                                callback: function () {
                                                    Ext.getCmp('cmbcountry').setValue(country.data.countryId);
                                                }
                                            });
                                        } else {
                                            Ext.getCmp('cmbcountry').setValue();
                                        }
                                        Ext.getCmp('txtleadmobile').setValue(ZmLeadListView.CheckField(biz_vnc_crm_client.contactList[i]._attrs.mobilePhone));
                                        Ext.getCmp('txtleadcontactName').setValue(contactName);
                                        Ext.getCmp('txtleadzip').setValue(ZmLeadListView.CheckField(biz_vnc_crm_client.contactList[i]._attrs.workPostalCode));
                                        Ext.getCmp('txtleademail').setValue(ZmLeadListView.CheckField(biz_vnc_crm_client.contactList[i]._attrs.email));
                                        Ext.getCmp('txtleadstreet1').setValue(ZmLeadListView.CheckField(biz_vnc_crm_client.contactList[i]._attrs.workStreet));
                                        Ext.getCmp('txtleadcity').setValue(ZmLeadListView.CheckField(biz_vnc_crm_client.contactList[i]._attrs.workCity));
                                        Ext.getCmp('txtleadphone').setValue(ZmLeadListView.CheckField(biz_vnc_crm_client.contactList[i]._attrs.mobilePhone2));
                                        Ext.getCmp('txtleadfax').setValue(ZmLeadListView.CheckField(biz_vnc_crm_client.contactList[i]._attrs.workFax));
                                    }
                                }

                            }
                        },
                        anchor: '100%'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: biz_vnc_crm_client.contactName,
                        id: 'txtleadcontactName',
                        anchor: '100%'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: biz_vnc_crm_client.email,
                        id: 'txtleademail',
                        vtype: 'email',
                        anchor: '100%'
                    }, {
                        xtype: 'textareafield',
                        grow: false,
                        fieldLabel: biz_vnc_crm_client.description,
                        id: 'txtleadleadDescription',
                        anchor: '100%'
                    }]
                }, {
                    columnWidth: .04,
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
                                       biz_vnc_crm_client.add_contact(0);
                                }, c);
                            }
                        }
                    }]
                }, {
                    columnWidth: .32,
                    border: false,
                    layout: 'anchor',
                    items: [{
                        xtype: 'textfield',
                        fieldLabel: biz_vnc_crm_client.street1,
                        id: 'txtleadstreet1',
                        anchor: '95%'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: biz_vnc_crm_client.street2,
                        id: 'txtleadstreet2',
                        anchor: '95%'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: biz_vnc_crm_client.city,
                        id: 'txtleadcity',
                        anchor: '95%'
                    }, {
                        xtype: 'combo',
                        mode: 'local',
                        value: 'state',
                        triggerAction: 'all',
                        forceSelection: true,
                        fieldLabel: biz_vnc_crm_client.state,
                        id: 'cmbstate',
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
                        value: 'country',
                        triggerAction: 'all',
                        forceSelection: true,
                        fieldLabel: biz_vnc_crm_client.country,
                        id: 'cmbcountry',
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
                    }, {
                        xtype: 'textfield',
                        fieldLabel: biz_vnc_crm_client.zipCode,
                        id: 'txtleadzip',
                        anchor: '95%'
                    }]
                }, {
                    columnWidth: .32,
                    border: false,
                    layout: 'anchor',
                    items: [{
                        xtype: 'textfield',
                        fieldLabel: biz_vnc_crm_client.phone,
                        id: 'txtleadphone',
                        anchor: '95%'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: biz_vnc_crm_client.workPhone,
                        id: 'txtleadworkPhone',
                        anchor: '95%'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: biz_vnc_crm_client.mobile,
                        id: 'txtleadmobile',
                        anchor: '95%'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: biz_vnc_crm_client.fax,
                        id: 'txtleadfax',
                        anchor: '95%'
                    }]
                }]

            }, {
                title: biz_vnc_crm_client.tabComm_History,
                id: 'leadComm',
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
                            var flag = 0;
                            biz_vnc_crm_client_HandlerObject.prototype.showAttachMailDialog(leadId, flag);
                        }
                    }, {
                        iconCls: 'cancel',
                        text: biz_vnc_crm_client.btnDelete,
                        id: 'btnMailDelete',
                        disabled: true,
                        itemId: 'delete',
                        handler: function () {
                            Ext.MessageBox.confirm(biz_vnc_crm_client.msgConfirmHeader, biz_vnc_crm_client.msgConfirm, showResult);

                            function showResult(btn) {
                                if (btn == "yes") {
                                    var rec1 = Ext.getCmp('leadMailGrid').getSelectionModel().getSelection();
                                    var idArray = [];
                                    Ext.each(rec1, function (item) {
                                        idArray.push(item.data.mailId);
                                    });

                                    var leadId = rec.get('leadId')
                                    var json = "jsonobj={\"action\":\"DELETEHISTORY\",\"object\":\"lead\",\"array\":\"" + idArray + "\",\"leadId\":\"" + leadId + "\"}";
                                    var reqHeader = {
                                        "Content-Type": "application/x-www-form-urlencoded"
                                    };
                                    var reqJson = AjxStringUtil.urlEncode(json);
                                    var responseUser = AjxRpc.invoke(reqJson, "/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);

                                    if (rec != null) {
                                        var leadId = rec.get('leadId');
                                        var json = "jsonobj={\"action\":\"LISTHISTORY\",\"object\":\"lead\",\"leadId\":\"" + leadId + "\"}";
                                        var reqHeader = {
                                            "Content-Type": "application/x-www-form-urlencoded"
                                        };
                                        var reqJson = AjxStringUtil.urlEncode(json);
                                        var responseMailHistory = AjxRpc.invoke(reqJson, "/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);
                                        var msgArray = [];
                                        var item;
                                        var msgArray = (responseMailHistory.text).split(",");

                                        if (msgArray != "null") {
                                            biz_vnc_crm_client.requestMailList(msgArray);
                                        } else {
                                            biz_vnc_crm_client.mailData = "[{'mailId':'','date':'','from':'','subject':'','message':''}]";
                                        }
                                        Ext.getCmp('leadMailGrid').getStore().loadData(jsonParse(biz_vnc_crm_client.mailData), false);
                                        Ext.getCmp('leadMailGrid').getView().refresh();
                                        Ext.example.msg('', biz_vnc_crm_client.msgEmailDelete);
                                    }
                                }
                            };
                        }
                    }, {
                        iconCls: 'email',
                        text: biz_vnc_crm_client.btnNew,
                        itemId: 'newmail',
                        handler: function () {
                            if(rec!=null){
                                biz_vnc_crm_client.flag = 0;
                                var leadId = rec.get('leadId');
                                biz_vnc_crm_client.composeMail(leadId);
                            }
                        }
                    }, {
                        iconCls: 'refresh',
                        text: biz_vnc_crm_client.btnRefresh,
                        itemId: 'refresh',
                        handler: function () {
                            if (rec != null) {
                                var leadId = rec.get('leadId');
                                var json = "jsonobj={\"action\":\"LISTHISTORY\",\"object\":\"lead\",\"leadId\":\"" + leadId + "\"}";
                                var reqHeader = {
                                    "Content-Type": "application/x-www-form-urlencoded"
                                };
                                var reqJson = AjxStringUtil.urlEncode(json);
                                var responseMailHistory = AjxRpc.invoke(reqJson, "/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);
                                var msgArray = [];
                                var item;
                                var msgArray = (responseMailHistory.text).split(",");
                                if (msgArray != "null") {
                                    biz_vnc_crm_client.requestMailList(msgArray);
                                } else {
                                    biz_vnc_crm_client.mailData = "[{'mailId':'','date':'','from':'','subject':'','message':''}]";
                                }
                                Ext.getCmp('leadMailGrid').getStore().loadData(jsonParse(biz_vnc_crm_client.mailData), false);
                                Ext.getCmp('leadMailGrid').getView().refresh();
                            }
                        }
                    }]
                }, {
                    xtype: 'grid',
                    selModel: leadSMMail,
                    id: 'leadMailGrid',
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
                        renderer: Ext.util.Format.dateRenderer('Y-m-d H:i:s')
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
                        dataIndex: 'message'
                    }],
                    title: null,
                    viewConfig: {
                        stripeRows: true
                    },
                    listeners: {
                        el:{
                                dblclick: function(){
                                    var rec = Ext.getCmp('leadMailGrid').getSelectionModel().selected;
                                    var mailID = rec.items[0].data.mailId;
                                    ZmMailMsgView.rfc822Callback(mailID, null, ZmId.VIEW_CONV);
                                }
                        }
                    }
                }]
            }, {
                title: biz_vnc_crm_client.tabAppointment,
                id: 'leadAppointment',
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
                            var flag = 0;
                            biz_vnc_crm_client_HandlerObject.prototype.showAttachAppointmentDialog(leadId, flag);
                        }
                    }, {
                        iconCls: 'cancel',
                        text: biz_vnc_crm_client.btnDelete,
                        id: 'btnApptDelete',
                        disabled: true,
                        itemId: 'delete',
                        handler: function () {
                            Ext.MessageBox.confirm(biz_vnc_crm_client.msgConfirmHeader, biz_vnc_crm_client.msgConfirm, showResult);

                            function showResult(btn) {
                                if (btn == "yes") {
                                    var rec1 = Ext.getCmp('leadApptGrid').getSelectionModel().getSelection();
                                    var idArray = [];
                                    Ext.each(rec1, function (item) {

                                        idArray.push("'" + item.data.appointmentId + "'");
                                    });
                                    var leadId = rec.get('leadId')
                                    var json = "jsonobj={\"action\":\"DELETEAPPT\",\"object\":\"lead\",\"array\":\"" + idArray + "\",\"leadId\":\"" + leadId + "\"}";
                                    var reqHeader = {
                                        "Content-Type": "application/x-www-form-urlencoded"
                                    };
                                    var reqJson = AjxStringUtil.urlEncode(json);
                                    var responseUser = AjxRpc.invoke(reqJson, "/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);
                                    if (rec != null) {
                                        var leadId = rec.get('leadId');
                                        var json = "jsonobj={\"action\":\"LISTAPPTHISTORY\",\"object\":\"lead\",\"leadId\":\"" + leadId + "\"}";
                                        var reqHeader = {
                                            "Content-Type": "application/x-www-form-urlencoded"
                                        };
                                        var reqJson = AjxStringUtil.urlEncode(json);
                                        var responseMailHistory = AjxRpc.invoke(reqJson, "/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);
                                        var msgArray = [];
                                        var item;
                                        var msgArray = (responseMailHistory.text).split(",");
                                        if (msgArray != "null") {
                                            biz_vnc_crm_client.requestApptList(msgArray);
                                        } else {
                                            biz_vnc_crm_client.apptData = "[{'subject':'','location1':'','calendar':'','startdate':''}]";
                                        }
                                        Ext.getCmp('leadApptGrid').getStore().loadData(jsonParse(biz_vnc_crm_client.apptData), false);
                                        Ext.getCmp('leadApptGrid').getView().refresh();
                                        Ext.example.msg('', biz_vnc_crm_client.msgApptDelete);
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
                                biz_vnc_crm_client.flag = 0;
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
                                var json = "jsonobj={\"action\":\"LISTAPPTHISTORY\",\"object\":\"lead\",\"leadId\":\"" + leadId + "\"}";
                                var reqHeader = {
                                    "Content-Type": "application/x-www-form-urlencoded"
                                };
                                var reqJson = AjxStringUtil.urlEncode(json);
                                var responseMailHistory = AjxRpc.invoke(reqJson, "/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);
                                var msgArray = [];
                                var item;
                                var msgArray = (responseMailHistory.text).split(",");
                                if (msgArray != "null") {
                                    biz_vnc_crm_client.requestApptList(msgArray);
                                } else {
                                    biz_vnc_crm_client.apptData = "[{'subject':'','location1':'','calendar':'','startdate':''}]";
                                }
                                Ext.getCmp('leadApptGrid').getStore().loadData(jsonParse(biz_vnc_crm_client.apptData), false);
                                Ext.getCmp('leadApptGrid').getView().refresh();
                            }
                        }
                    }]
                }, {
                    xtype: 'grid',
                    selModel: leadSMAppt,
                    id: 'leadApptGrid',
                    height: 215,
                    defaults: {
                        autoRender: true,
                        autoScroll: true
                    },
                    store: Ext.create('Ext.data.Store', {
                        model: 'leadApptModel',
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
                        dataIndex: 'subject'
                    }, {
                        text: biz_vnc_crm_client.locations,
                        sortable: false,
                        width: 250,
                        dataIndex: 'location1'
                    },{
                        text: biz_vnc_crm_client.calendar,
                        width: 100,
                        sortable: true,
                        dataIndex: 'calendar'
                    }, {
                        text: biz_vnc_crm_client.start_date,
                        sortable: false,
                        width: 200,
                        dataIndex: 'startdate',
                        renderer: Ext.util.Format.dateRenderer('Y-m-d H:i:s')
                    }],
                    title: null,
                    viewConfig: {
                        stripeRows: true
                    },
                    listeners: {
                        el: {
                            dblclick: function(){
                                var rec = Ext.getCmp('leadApptGrid').getSelectionModel().selected;
                                var apptId = rec.items[0].data.appointmentId;
                                biz_vnc_crm_client.viewApptDetails(apptId);
                            }
                        }
                    }
                }]
            }, {
                title: biz_vnc_crm_client.tabTask,
                id: 'leadTask',
                layout: 'column',
                disabled: true,
                width: '100%',
                height: 250,
                defaults: {
                    autoRender: true,
                    autoScroll: true
                },
                dockedItems: [{
                    xtype: 'toolbar',
                    items: [{
                        iconCls: 'attachment',
                        text: biz_vnc_crm_client.btnAttach,
                        handler: function () {
                            var leadId = rec.get('leadId');
                            var flag = 0;
                            biz_vnc_crm_client_HandlerObject.prototype.showAttachTaskDialog(leadId, flag);
                        }
                    }, {
                        iconCls: 'cancel',
                        text: biz_vnc_crm_client.btnDelete,
                        id: 'btnTaskDelete',
                        disabled: true,
                        handler: function () {
                            Ext.MessageBox.confirm(biz_vnc_crm_client.msgConfirmHeader, biz_vnc_crm_client.msgConfirm, showResult);

                            function showResult(btn) {
                                if (btn == "yes") {
                                    var rec1 = Ext.getCmp('leadTaskGrid').getSelectionModel().getSelection();
                                    var idArray = [];
                                    Ext.each(rec1, function (item) {
                                        idArray.push("'" + item.data.taskId + "'");
                                    });
                                    var leadId = rec.get('leadId');
                                    var json = "jsonobj={\"action\":\"DELETETASK\",\"object\":\"lead\",\"array\":\"" + idArray + "\",\"leadId\":\"" + leadId + "\"}";
                                    var reqHeader = {
                                        "Content-Type": "application/x-www-form-urlencoded"
                                    };
                                    var reqJson = AjxStringUtil.urlEncode(json);
                                    var responseUser = AjxRpc.invoke(reqJson, "/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);

                                    if (rec != null) {
                                        var leadId = rec.get('leadId');
                                        var json = "jsonobj={\"action\":\"listTask\",\"object\":\"lead\",\"leadId\":\"" + leadId + "\"}";
                                        var reqHeader = {
                                            "Content-Type": "application/x-www-form-urlencoded"
                                        };
                                        var reqJson = AjxStringUtil.urlEncode(json);
                                        var responseTaskList = AjxRpc.invoke(reqJson, "/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);

                                        var newtaskArray = (responseTaskList.text).split(",");

                                        var allTask = appCtxt.getTaskManager()._rawTasks;

                                        var taskArray = [];
                                        if (newtaskArray != null) {

                                            var k = 0;
                                            for (var i = 0; i < allTask.length; i++) {
                                                for (var j = 0; j < newtaskArray.length; j++) {
                                                    if (allTask[i].invId == newtaskArray[j]) {
                                                        taskArray[k++] = newtaskArray[j];
                                                    }
                                                }
                                            }
                                        }
                                        if (taskArray.length <= 0) {
                                            leadTaskListData = "[{'taskId':'','subject':'','status':'','complete':'','dueDate':''}]";
                                        } else {
                                            leadTaskListData = "[";
                                            var flag = 0;
                                            for (var i = 0; i < allTask.length; i++) {
                                                var temp = allTask[i];
                                                for (var j = 0; j < taskArray.length; j++) {
                                                    if (temp.invId == taskArray[j]) {
                                                        if (flag == taskArray.length - 1) {
                                                            leadTaskListData += "{\"taskId\":\"" + temp.invId + "\",\"subject\":\"" + temp.name + "\",\"status\":\"" + ZmCalItem.getLabelForStatus(temp.status) + "\",\"complete\":\"" + temp.percentComplete + "\",\"dueDate\":\"" + new Date(temp.d) + "\"}]";
                                                        } else {
                                                            leadTaskListData += "{\"taskId\":\"" + temp.invId + "\",\"subject\":\"" + temp.name + "\",\"status\":\"" + ZmCalItem.getLabelForStatus(temp.status) + "\",\"complete\":\"" + temp.percentComplete + "\",\"dueDate\":\"" + new Date(temp.d) + "\"},";
                                                            flag++;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        Ext.example.msg('', biz_vnc_crm_client.msgTaskDelete);
                                        Ext.getCmp('leadTaskGrid').getStore().loadData(jsonParse(leadTaskListData), false);
                                        Ext.getCmp('leadTaskGrid').getView().refresh();
                                    }
                                }
                            };
                        }
                    }, {
                        iconCls: 'task',
                        text: biz_vnc_crm_client.btnNew,
                        itemId: 'newappoint',
                        handler: function () {
                            biz_vnc_crm_client.flag = 0;
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
                                var json = "jsonobj={\"action\":\"listTask\",\"object\":\"lead\",\"leadId\":\"" + leadId + "\"}";
                                var reqHeader = {
                                    "Content-Type": "application/x-www-form-urlencoded"
                                };
                                var reqJson = AjxStringUtil.urlEncode(json);
                                var responseTaskList = AjxRpc.invoke(reqJson, "/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);

                                var newtaskArray = (responseTaskList.text).split(",");

                                var allTask = appCtxt.getTaskManager()._rawTasks;

                                var taskArray = [];
                                if (newtaskArray != null) {

                                    var k = 0;
                                    for (var i = 0; i < allTask.length; i++) {
                                        for (var j = 0; j < newtaskArray.length; j++) {
                                            if (allTask[i].invId == newtaskArray[j]) {
                                                taskArray[k++] = newtaskArray[j];
                                            }
                                        }
                                    }
                                }
                                if (taskArray.length <= 0) {
                                    leadTaskListData = "[{'taskId':'','subject':'','status':'','complete':'','dueDate':''}]";
                                } else {
                                    leadTaskListData = "[";
                                    var flag = 0;
                                    for (var i = 0; i < allTask.length; i++) {
                                        var temp = allTask[i];
                                        for (var j = 0; j < taskArray.length; j++) {
                                            if (temp.invId == taskArray[j]) {
                                                if (flag == taskArray.length - 1) {
                                                    leadTaskListData += "{\"taskId\":\"" + temp.invId + "\",\"subject\":\"" + temp.name + "\",\"status\":\"" + ZmCalItem.getLabelForStatus(temp.status) + "\",\"complete\":\"" + temp.percentComplete + "\",\"dueDate\":\"" + new Date(temp.d) + "\"}]";
                                                } else {
                                                    leadTaskListData += "{\"taskId\":\"" + temp.invId + "\",\"subject\":\"" + temp.name + "\",\"status\":\"" + ZmCalItem.getLabelForStatus(temp.status) + "\",\"complete\":\"" + temp.percentComplete + "\",\"dueDate\":\"" + new Date(temp.d) + "\"},";
                                                    flag++;
                                                }
                                            }
                                        }
                                    }
                                }

                                Ext.getCmp('leadTaskGrid').getStore().loadData(jsonParse(leadTaskListData), false);
                                Ext.getCmp('leadTaskGrid').getView().refresh();
                            }
                        }
                    }]
                }, {
                    xtype: 'grid',
                    selModel: leadSMTask,
                    id: 'leadTaskGrid',
                    height: 215,
                    defaults: {
                        autoRender: true,
                        autoScroll: true
                    },
                    store: Ext.create('Ext.data.Store', {
                        model: 'taskModel',
                        proxy: {
                            type: 'memory',
                            data: jsonParse(leadTaskListData)
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
                        dataIndex: 'subject'
                    }, {
                        text: biz_vnc_crm_client.status,
                        width: 200,
                        sortable: true,
                        dataIndex: 'status'
                    }, {
                        text: biz_vnc_crm_client.complete,
                        width: 100,
                        sortable: true,
                        dataIndex: 'complete'
                    }, {
                        text: biz_vnc_crm_client.dueDate,
                        sortable: false,
                        width: 200,
                        dataIndex: 'dueDate',
                        renderer: Ext.util.Format.dateRenderer('Y-m-d H:i:s')
                    }],
                    title: null,
                    viewConfig: {
                        stripeRows: true
                    },
                    listeners: {
                        el: {
                            dblclick: function(){
                                var rec = Ext.getCmp('leadTaskGrid').getSelectionModel().selected;
                                var taskId = rec.items[0].data.taskId;
                                biz_vnc_crm_client.viewTaskDetails(taskId);
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
                        xtype: 'combo',
                        mode: 'local',
                        value: 'companyName',
                        triggerAction: 'all',
                        forceSelection: true,
                        fieldLabel: biz_vnc_crm_client.company,
                        id: 'cmbcompanyName',
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
                        anchor: '60%'
                    }, {
                        xtype: 'combo',
                        mode: 'local',
                        value: 'channel',
                        triggerAction: 'all',
                        forceSelection: true,
                        fieldLabel: biz_vnc_crm_client.channel,
                        id: 'cmbchannel',
                        name: 'channel',
                        displayField: 'channelName',
                        valueField: 'channelId',
                        queryMode: 'local',
                        store: Ext.create('Ext.data.Store', {
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
                        anchor: '60%'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: biz_vnc_crm_client.referredBy,
                        id: 'txtleadreferredby',
                        name: 'last',
                        anchor: '60%'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: biz_vnc_crm_client.daystoOpen,
                        id: 'txtleadday2open',
                        name: 'days2open',
                        disabled: true,
                        value: '0.00',
                        anchor: '60%'
                    }]
                }, {
                    columnWidth: .50,
                    border: false,
                    layout: 'anchor',
                    items: [{
                        xtype: 'datefield',
                        format: 'Y-m-d H:i:s.0',
                        fieldLabel: biz_vnc_crm_client.creationDate,
                        id: 'datecreationdate',
                        disabled: true,
                        anchor: '60%'
                    }, {
                        xtype: 'datefield',
                        format: 'Y-m-d H:i:s.0',
                        fieldLabel: biz_vnc_crm_client.updateDate,
                        id: 'dateupdatedate',
                        disabled: true,
                        anchor: '60%'
                    }, {
                        xtype: 'datefield',
                        format: 'Y-m-d H:i:s.0',
                        fieldLabel: biz_vnc_crm_client.opened,
                        id: 'dateopened',
                        disabled: true,
                        anchor: '60%'
                    }, {
                        xtype: 'datefield',
                        format: 'Y-m-d H:i:s.0',
                        fieldLabel: biz_vnc_crm_client.closed,
                        id: 'dateclosed',
                        disabled: true,
                        anchor: '60%'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: biz_vnc_crm_client.daystoClose,
                        name: 'day2Close',
                        id: 'txtleadday2close',
                        disabled: true,
                        value: '0.00',
                        anchor: '60%'
                    }]
                }]
            }],
            listeners: {
                'tabchange': function (tabPanel, tab) {
                    if (tab.id == 'leadAppointment') {
                        if (rec != null) {
                            Ext.getCmp('leadApptGrid').getStore().removeAll();
                            var leadId = rec.get('leadId');
                            var json = "jsonobj={\"action\":\"LISTAPPTHISTORY\",\"object\":\"lead\",\"leadId\":\"" + leadId + "\"}";
                            var reqHeader = {
                                "Content-Type": "application/x-www-form-urlencoded"
                            };
                            var reqJson = AjxStringUtil.urlEncode(json);
                            var responseMailHistory = AjxRpc.invoke(reqJson, "/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);
                            var msgArray = [];
                            var item;
                            var msgArray = (responseMailHistory.text).split(",");
                            if (msgArray != "null") {
                                biz_vnc_crm_client.requestApptList(msgArray);
                                Ext.getCmp('leadApptGrid').getStore().loadData(jsonParse(biz_vnc_crm_client.apptData), false);
                                Ext.getCmp('leadApptGrid').getView().refresh();
                            } else {
                                biz_vnc_crm_client.apptData = "[{'subject':'','location1':'','calendar':'','startdate':''}]";
                            }
                        }
                    } else if (tab.id == 'leadTask') {
                        if (rec != null) {
                            Ext.getCmp('leadTaskGrid').getStore().removeAll();
                            var leadId = rec.get('leadId');
                            var json = "jsonobj={\"action\":\"listTask\",\"object\":\"lead\",\"leadId\":\"" + leadId + "\"}";
                            var reqHeader = {
                                "Content-Type": "application/x-www-form-urlencoded"
                            };
                            var reqJson = AjxStringUtil.urlEncode(json);
                            var responseTaskList = AjxRpc.invoke(reqJson, "/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);

                            var newtaskArray = (responseTaskList.text).split(",");

                            var allTask = appCtxt.getTaskManager()._rawTasks;

                            var taskArray = [];
                            if (newtaskArray != null) {

                                var k = 0;
                                for (var i = 0; i < allTask.length; i++) {
                                    for (var j = 0; j < newtaskArray.length; j++) {
                                        if (allTask[i].invId == newtaskArray[j]) {
                                            taskArray[k++] = newtaskArray[j];
                                        }
                                    }
                                }
                            }
                            if (taskArray.length <= 0) {
                                leadTaskListData = "[{'taskId':'','subject':'','status':'','complete':'','dueDate':''}]";
                            } else {
                                leadTaskListData = "[";
                                var flag = 0;
                                for (var i = 0; i < allTask.length; i++) {
                                    var temp = allTask[i];
                                    for (var j = 0; j < taskArray.length; j++) {
                                        if (temp.invId == taskArray[j]) {
                                            if (flag == taskArray.length - 1) {
                                                leadTaskListData += "{\"taskId\":\"" + temp.invId + "\",\"subject\":\"" + temp.name + "\",\"status\":\"" + ZmCalItem.getLabelForStatus(temp.status) + "\",\"complete\":\"" + temp.percentComplete + "\",\"dueDate\":\"" + new Date(temp.d) + "\"}]";
                                            } else {
                                                leadTaskListData += "{\"taskId\":\"" + temp.invId + "\",\"subject\":\"" + temp.name + "\",\"status\":\"" + ZmCalItem.getLabelForStatus(temp.status) + "\",\"complete\":\"" + temp.percentComplete + "\",\"dueDate\":\"" + new Date(temp.d) + "\"},";
                                                flag++;
                                            }
                                        }
                                    }
                                }
                            }
                            Ext.getCmp('leadTaskGrid').getStore().loadData(jsonParse(leadTaskListData), false);
                            Ext.getCmp('leadTaskGrid').getView().refresh();
                        }

                    } else if (tab.id == 'leadComm') {
                        if (rec != null) {
                            Ext.getCmp('leadMailGrid').getStore().removeAll();
                            var leadId = rec.get('leadId');
                            var json = "jsonobj={\"action\":\"LISTHISTORY\",\"object\":\"lead\",\"leadId\":\"" + leadId + "\"}";
                            var reqHeader = {
                                "Content-Type": "application/x-www-form-urlencoded"
                            };
                            var reqJson = AjxStringUtil.urlEncode(json);
                            var responseMailHistory = AjxRpc.invoke(reqJson, "/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);
                            var msgArray = [];
                            var item;
                            var msgArray = (responseMailHistory.text).split(",");

                            if (msgArray != "null") {
                                biz_vnc_crm_client.requestMailList(msgArray);

                                Ext.getCmp('leadMailGrid').getStore().loadData(jsonParse(biz_vnc_crm_client.mailData), false);
                                Ext.getCmp('leadMailGrid').getView().refresh();
                            } else {
                                biz_vnc_crm_client.mailData = "[{'mailId':'','date':'','from':'','subject':'','message':''}]";
                            }
                        }
                    }
                }
            }
        }],
        buttons: [{
            text: biz_vnc_crm_client.btnSave,
            id: 'btnsave',
            width: 150,
            height: 25,
            iconCls: 'save',
            handler: function () {
                if (Ext.getCmp('txtleadsubjectName').getValue() == "") {
                    Ext.getCmp('txtleadsubjectName').validate(false);
                    Ext.getCmp('txtleadsubjectName').focus(true);
                    var emptyField = [];
                    emptyField.push(Ext.getCmp('txtleadsubjectName').fieldLabel);
                    Ext.example.msg('', emptyField + " " + biz_vnc_crm_client.msgEmptyField);
                } else {
                    var subjectName = Ext.getCmp('txtleadsubjectName').getValue();
                    var leadDescription = Ext.getCmp('txtleadleadDescription').getValue();
                    var contactName = Ext.getCmp('txtleadcontactName').getValue();
                    var phone = Ext.getCmp('txtleadphone').getValue();
                    var fax = Ext.getCmp('txtleadfax').getValue();
                    var email = Ext.getCmp('txtleademail').getValue();
                    var workPhone = Ext.getCmp('txtleadworkPhone').getValue();
                    var mobile = Ext.getCmp('txtleadmobile').getValue();
                    var street1 = Ext.getCmp('txtleadstreet1').getValue();
                    var street2 = Ext.getCmp('txtleadstreet2').getValue();
                    var city = Ext.getCmp('txtleadcity').getValue();
                    var zip = Ext.getCmp('txtleadzip').getValue();
                    var stateId = Ext.getCmp('cmbstate').getValue();
                    var countryId = Ext.getCmp('cmbcountry').getValue();
                    var type = 0;
                    var dateOpen = Ext.getCmp('dateopened').getSubmitValue();
                    if (dateOpen == '') {
                        dateOpen = '0000-00-00 00:00:00';
                    }
                    var dateClose = Ext.getCmp('dateclosed').getSubmitValue();
                    if (dateClose == '') {
                        dateClose = '0000-00-00 00:00:00';
                    }
                    var expectedDateClose = Ext.getCmp('dateupdatedate').getSubmitValue();
                    if (expectedDateClose == '') {
                        expectedDateClose = '0000-00-00 00:00:00';
                    }
                    var stageId = Ext.getCmp('cmbstage').getValue();
                    var channelId = Ext.getCmp('cmbchannel').getValue();
                    var leadClassId = Ext.getCmp('cmbleadClass').getValue();
                    var sectionId = Ext.getCmp('cmbsection').getValue();
                    var categoryId = Ext.getCmp('cmbcategory').getValue();
                    var partnerName = ZmLeadListView.selectedLeadPartnerName;
                    var dayopen = Ext.getCmp('txtleadday2open').getValue();
                    var dayclose = Ext.getCmp('txtleadday2close').getValue();
                    var referredBy = Ext.getCmp('txtleadreferredby').getValue();
                    var userId = Ext.getCmp('cmbsalesman').getValue();
                    if (userId == null) {
                        userId = appCtxt.getUsername();
                    }
                    var priorityId = Ext.getCmp('cmbpriority').getValue();
                    var nextActionDate = '0000-00-00 00:00:00';
                    var nextAction = "";
                    var status = true;
                    var createBy = appCtxt.getUsername();
                    var createDate = Ext.getCmp('datecreationdate').getSubmitValue();
                    if (createDate == '') {
                        createDate = '0000-00-00 00:00:00';
                    }
                    var writeBy = appCtxt.getUsername();
                    var writeDate = Ext.getCmp('dateupdatedate').getSubmitValue();
                    if (writeDate == '') {
                        writeDate = '0000-00-00 00:00:00';
                    }
                    var valuation = "000";
                    var companyId = Ext.getCmp('cmbcompanyName').getValue();
                    var leadState = Ext.getCmp('txtleadState').getValue();
                    var probability = 0;
                    if (rec != null) {
                        var leadId = rec.get('leadId');
                        var j = JSON.stringify({
                            action: "UPDATE",
                            object: "lead",
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
                        var json = "jsonobj=" + j;
                        var reqHeader = {
                            "Content-Type": "application/x-www-form-urlencoded"
                        };
                        var reqJson = AjxStringUtil.urlEncode(json);
                        var response = AjxRpc.invoke(reqJson, "/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);
                        if (response.text == 1) {
                            Ext.example.msg('', biz_vnc_crm_client.msgEdit);
                            biz_vnc_crm_client.initLeadGrid(app);
                        } else {
                            Ext.example.msg('', biz_vnc_crm_client.msgNotEdit);
                            biz_vnc_crm_client.initLeadGrid(app);
                        }
                    } else {
                        var leadId = 0;
                        var j = JSON.stringify({
                            action: "ADD",
                            object: "lead",
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
                        var json = "jsonobj=" + j;
                        var reqHeader = {
                            "Content-Type": "application/x-www-form-urlencoded"
                        };
                        var reqJson = AjxStringUtil.urlEncode(json);
                        var response = AjxRpc.invoke(reqJson, "/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);
                        if (response.text == 1) {
                            Ext.example.msg('', biz_vnc_crm_client.msgSave);
                            biz_vnc_crm_client.initLeadGrid(app);

                        } else {
                            Ext.example.msg('', biz_vnc_crm_client.msgNotSave);
                            biz_vnc_crm_client.initLeadGrid(app);
                        }
                    }
                }
            }
        }, {
            text: biz_vnc_crm_client.btnCancel,
            width: 150,
            id: 'btncancel',
            height: 25,
            iconCls: 'cancel',
            handler: function () {
                biz_vnc_crm_client.initLeadGrid(app);
            }
        }]
    });
    tab2.render('LeadForm');

    if (rec != null) {
        Ext.getCmp('btnConvertToOpp').enable();
        Ext.getCmp('leadTask').setDisabled(false);
        Ext.getCmp('leadAppointment').setDisabled(false);
        Ext.getCmp('leadComm').setDisabled(false);
        Ext.getCmp('cmbpartner').getStore().load({
            callback: function () {
                Ext.getCmp('cmbpartner').setValue(rec.get('partnerName'));
            }
        });
        Ext.getCmp('cmbstage').getStore().load({
            callback: function () {
                Ext.getCmp('cmbstage').setValue(rec.get('stageId'));
            }
        });
        Ext.getCmp('cmbpriority').getStore().load({
            callback: function () {
                Ext.getCmp('cmbpriority').setValue(rec.get('priorityId'));
            }
        });
        Ext.getCmp('cmbchannel').getStore().load({
            callback: function () {
                Ext.getCmp('cmbchannel').setValue(rec.get('channelId'));
            }
        });
        Ext.getCmp('cmbsection').getStore().load({
            callback: function () {
                Ext.getCmp('cmbsection').setValue(rec.get('sectionId'));
            }
        });
        Ext.getCmp('cmbstate').getStore().load({
            callback: function () {
                Ext.getCmp('cmbstate').setValue(rec.get('stateId'));
            }
        });
        Ext.getCmp('cmbcountry').getStore().load({
            callback: function () {
                Ext.getCmp('cmbcountry').setValue(rec.get('countryId'));
            }
        });
        Ext.getCmp('cmbsalesman').getStore().load({
            callback: function () {
                Ext.getCmp('cmbsalesman').setValue(rec.get('userId'));
            }
        });
        Ext.getCmp('cmbcategory').getStore().load({
            callback: function () {
                Ext.getCmp('cmbcategory').setValue(rec.get('categoryId'));
            }
        });
        Ext.getCmp('cmbcompanyName').getStore().load({
            callback: function () {
                Ext.getCmp('cmbcompanyName').setValue(rec.get('companyId'));
            }
        });
        Ext.getCmp('cmbleadClass').getStore().load({
            callback: function () {
                Ext.getCmp('cmbleadClass').setValue(rec.get('leadClassId'));
            }
        });
        Ext.getCmp('txtleadsubjectName').setValue(rec.get('subjectName'));
        Ext.getCmp('txtleadcontactName').setValue(rec.get('contactName'));
        Ext.getCmp('txtleadleadDescription').setValue(rec.get('leadDescription'));
        Ext.getCmp('txtleadreferredby').setValue(rec.get('referredBy'));
        Ext.getCmp('txtleadworkPhone').setValue(rec.get('workPhone'));
        Ext.getCmp('txtleadzip').setValue(rec.get('zip'));
        Ext.getCmp('txtleademail').setValue(rec.get('email'));
        Ext.getCmp('txtleadstreet1').setValue(rec.get('street1'));
        Ext.getCmp('txtleadstreet2').setValue(rec.get('street2'));
        Ext.getCmp('txtleadcity').setValue(rec.get('city'));
        Ext.getCmp('txtleadmobile').setValue(rec.get('mobile'));
        Ext.getCmp('txtleadfax').setValue(rec.get('fax'));
        Ext.getCmp('txtleadphone').setValue(rec.get('phone'));
        Ext.getCmp('datecreationdate').setValue(rec.get('createDate'));
        Ext.getCmp('dateupdatedate').setValue(rec.get('writeDate'));
        Ext.getCmp('dateopened').setValue(rec.get('dateOpen'));
        Ext.getCmp('dateclosed').setValue(rec.get('dateClose'));
    }
};
