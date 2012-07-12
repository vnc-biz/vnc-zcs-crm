ZmLeadListView.prototype.getContacts=function(offset, contactList, rec, app){
			contactBook="Contacts";
			if(contactBook == null){
				return;
			}
			var jsonObj = {SearchRequest:{_jsns:"urn:zimbraMail"}};
			var request = jsonObj.SearchRequest;

			request.sortBy = ZmSearch.NAME_ASC;
			ZmTimezone.set(request, AjxTimezone.DEFAULT);
			request.locale = { _content: AjxEnv.DEFAULT_LOCALE };
			request.offset = 0;
			request.types = ZmSearch.TYPE[ZmItem.CONTACT];
			request.query = "in:\""+contactBook+"\"";
			request.offset = offset;
			request.limit = 500;

			contactList = contactList || [];
			var searchParams = {
					jsonObj:jsonObj,
					asyncMode:true,
					callback:new AjxCallback(this, this.handleGetContactsResponse, [contactList, rec, app]),
					errorCallback:new AjxCallback(this, this.handleGetContactsError)
			};
			appCtxt.getAppController().sendRequest(searchParams);
};
			
ZmLeadListView.prototype.handleGetContactsResponse = function(contactList, rec, app, result) {
		if (result) {
			
			var contactList = [];
			var response = result.getResponse().SearchResponse;
			var responseContactList = response[ZmList.NODE[ZmItem.CONTACT]];
			if (responseContactList) {
				var numContacts = responseContactList.length;
				var contarry = [];
				for (var i = 0; i < numContacts; i++) {
					contactList.push(responseContactList[i]);
				}
			}
			ZmLeadListView.createForm(rec, contactList, app);
			if (response.more) {
				this.getContacts(response.offset + 500, contactList);
			} else {
			}	
		}
};





function ZmLeadListView () {}

ZmLeadListView.prototype.constructor = ZmLeadListView;
//biz_vnc_crm_client_HandlerObject.prototype
ZmLeadListView.prototype.toString = function() {
		return "ZmLeadListView";
}

ZmLeadListView._myCancelListener = function(app){
	app.pushView(app.getName());
}
ZmLeadListView._mySaveResponseListener = function(result){
	var set= result.getResponse().BatchResponse.CreateContactResponse[0].cn[0].id;
	var firstName = result.getResponse().BatchResponse.CreateContactResponse[0].cn[0]._attrs.firstName;
	var lastName = result.getResponse().BatchResponse.CreateContactResponse[0].cn[0]._attrs.firstName;
	var mobilePhone = result.getResponse().BatchResponse.CreateContactResponse[0].cn[0]._attrs.mobilePhone;
	var contactName = firstName + " " + lastName;
	var homePostalCode = result.getResponse().BatchResponse.CreateContactResponse[0].cn[0]._attrs.homePostalCode;
	var email = result.getResponse().BatchResponse.CreateContactResponse[0].cn[0]._attrs.email;
	var homeStreet = result.getResponse().BatchResponse.CreateContactResponse[0].cn[0]._attrs.homeStreet;
	var homeCity = result.getResponse().BatchResponse.CreateContactResponse[0].cn[0]._attrs.homeCity;
	
	Ext.getCmp('cmbpartner').getStore().add({'value':set,'label':firstName});
	biz_vnc_crm_client.getContacts(0, [], set);
	Ext.getCmp('cmbpartner').setValue(set);
	Ext.getCmp('txtleadmobile').setValue(mobilePhone);
	Ext.getCmp('txtleadcontactName').setValue(contactName);
	Ext.getCmp('txtleadzip').setValue(homePostalCode);
	Ext.getCmp('txtleademail').setValue(email);
	Ext.getCmp('txtleadstreet1').setValue(homeStreet);
	Ext.getCmp('txtleadcity').setValue(homeCity);
}

ZmLeadListView._mySaveListener = function(app) {
	
	var modifiedAttributes = appCtxt.getCurrentView().getModifiedAttrs();
	var contact = appCtxt.getCurrentView().getContact();
	appCtxt.getCurrentApp().popView(true);
	batchCmd = new ZmBatchCommand(true,null,true);
	batchCmd.add(new AjxCallback(contact,contact.create,[modifiedAttributes]));
	batchCmd.run(new AjxCallback(this,ZmLeadListView._mySaveResponseListener));

	app.pushView(app.getName());
	
	return true;
}

ZmLeadListView.createForm = function(rec, contactList, app){
	
	var toolbar = app.getToolbar();
	toolbar.setVisibility(false);
	var leadTaskListData = "[{'subject':'','status':'','complete':'','dueDate':''}]";
	biz_vnc_crm_client.apptData = "[{'subject':'','location1':'','status':'','calendar':'','startdate':''}]";
	if(biz_vnc_crm_client.mailData == ""){
		biz_vnc_crm_client.mailData = "[{'date':'','from':'','subject':'','message':''}]";
	}
	var temp = "[";
	for (var i = 0; i < contactList.length; i++) {
		var contact = contactList[i];
		if(i == contactList.length-1) {
				temp +="{\"value\":\""+contact.id+"\",\"label\":\""+contact._attrs.firstName+"\"}]";
		} else {
				temp +="{\"value\":\""+contact.id+"\",\"label\":\""+contact._attrs.firstName+"\"},";
		}
	}
	
	var json,responsePriority,responseCategory,responseStage,responseChannel,responseState,responseCountry,responseSection,responseUser,responseCompany;
	var reqHeader = {"Content-Type":"application/x-www-form-urlencoded"};
	var reqJson;
	Ext.define('priority',{ 
		extend:'Ext.data.Model',
		fields:[
			{name: 'priorityId', type: 'int'},
			{name: 'priorityName', type: 'string'}
		]
	});
	json = "jsonobj={\"action\":\"LIST\",\"object\":\"priority\"}";
	reqJson = AjxStringUtil.urlEncode(json);
	responsePriority = AjxRpc.invoke(reqJson,"/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);
	Ext.define('category',{ 
		extend:'Ext.data.Model',
		fields:[
			{name: 'categoryId', type: 'int'},
			{name: 'categoryName', type: 'string'}
		]
	});
	json = "jsonobj={\"action\":\"LIST\",\"object\":\"category\"}";
	reqJson = AjxStringUtil.urlEncode(json);
	responseCategory = AjxRpc.invoke(reqJson,"/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);
								
	Ext.define('stage',{ 
		extend:'Ext.data.Model',
		fields:[
			{name: 'stageId', type: 'int'},
			{name: 'stageName', type: 'string'},
			{name: 'stageState', type: 'string'}
		]
	});
	json = "jsonobj={\"action\":\"LIST\",\"object\":\"stage\"}";
	reqJson = AjxStringUtil.urlEncode(json);
	responseStage = AjxRpc.invoke(reqJson,"/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);

	Ext.define('channel',{ 
		extend:'Ext.data.Model',
		fields:[
			{name: 'channelId', type: 'int'},
			{name: 'channelName', type: 'string'}
		]
	});
	json = "jsonobj={\"action\":\"LIST\",\"object\":\"channel\"}";
	reqJson = AjxStringUtil.urlEncode(json);
	responseChannel = AjxRpc.invoke(reqJson,"/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);

	Ext.define('state',{ 
		extend:'Ext.data.Model',
		fields:[
			{name: 'stateId', type: 'int'},
			{name: 'stateName', type: 'string'}
		]
	});
	json = "jsonobj={\"action\":\"LIST\",\"object\":\"state\"}";
	reqJson = AjxStringUtil.urlEncode(json);
	responseState = AjxRpc.invoke(reqJson,"/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);

	Ext.define('country',{ 
		extend:'Ext.data.Model',
		fields:[
			{name: 'countryId', type: 'int'},
			{name: 'countryName', type: 'string'}
		]
	});
	json = "jsonobj={\"action\":\"LIST\",\"object\":\"country\"}";
	reqJson = AjxStringUtil.urlEncode(json);
	responseCountry = AjxRpc.invoke(reqJson,"/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);

	json = "jsonobj={\"action\":\"LIST\",\"object\":\"company\"}";
	reqJson = AjxStringUtil.urlEncode(json);
	responseCompany = AjxRpc.invoke(reqJson,"/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);

	Ext.define('company',{ 
		extend:'Ext.data.Model',
		fields:[
			{name: 'companyId', type: 'int'},
			{name: 'companyName', type: 'string'}
		]
	});

	Ext.define('section',{ 
		extend:'Ext.data.Model',
		fields:[
			{name: 'sectionId', type: 'int'},
			{name: 'sectionName', type: 'string'}
		]
	});

	json = "jsonobj={\"action\":\"LIST\",\"object\":\"section\"}";
	reqJson = AjxStringUtil.urlEncode(json);
	responseSection = AjxRpc.invoke(reqJson,"/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);
	
	
	Ext.define('user',{ 
		extend:'Ext.data.Model',
		fields:[
			{name: 'value', type: 'string'},
			{name: 'label', type: 'string'}
		]
	});

	json = "jsonobj={\"action\":\"USER\",\"object\":\"section\"}";
	reqHeader = {"Content-Type":"application/x-www-form-urlencoded"};
	reqJson = AjxStringUtil.urlEncode(json);
	responseUser = AjxRpc.invoke(reqJson,"/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);
	

	

	


	//**********************************************************************************************************
	

Ext.define('taskModel',{ 
		extend:'Ext.data.Model',
		fields:[
			{name: 'taskId', type: 'string'},
			{name: 'subject', type: 'string'},
			{name: 'status', type: 'string'},
			{name: 'complete', type: 'string'},
			{name: 'dueDate', type: 'date'}
			
		]
	});

	Ext.define('contact1',{ 
		extend:'Ext.data.Model',
		fields:[
			{name: 'value', type: 'string'},
			{name: 'label', type: 'string'}
		]
	});


	//**********************************************************************************************************
Ext.define('mail',{ 
		extend:'Ext.data.Model',
		fields:[
			{name: 'mailId', type: 'string'},
			{name: 'date', type: 'string'},
			{name: 'from', type: 'string'},
			{name: 'subject', type: 'string'},
			{name: 'message', type: 'string'}
		]
	});

	var sm = Ext.create('Ext.selection.CheckboxModel', {
        listeners: {

		
            selectionchange: function(sm, selections) {
/*				if(selections.length == 1){
					Ext.getCmp('btnEditLead').enable();
				} else{
					Ext.getCmp('btnEditLead').disable();
				}
				if (selections.length > 0) {
					Ext.getCmp('btnDeleteLead').enable();
				} else {
					Ext.getCmp('btnEditLead').disable();
					Ext.getCmp('btnDeleteLead').disable();
				}*/
			}
        }
    });

Ext.define('leadApptModel',{ 
		extend:'Ext.data.Model',
		fields:[
			{name: 'appointmentId', type: 'string'},
			{name: 'subject', type: 'string'},
			{name: 'location1', type: 'string'},
			{name: 'status', type: 'string'},
			{name: 'calendar', type: 'string'},
			{name: 'startdate', type: 'string'}
		]
});

var leadSMAppt = Ext.create('Ext.selection.CheckboxModel', {
	listeners: {
		selectionchange: function(sm, selections) {
		}
	}
});

var leadSMTask = Ext.create('Ext.selection.CheckboxModel', {
	listeners: {
		selectionchange: function(sm, selections) {
		}
	}
});



	var tab2 = Ext.create('Ext.form.Panel', {
        title: 'Leads',
		id: 'formLead',
        bodyStyle:'padding:5px',
        width: '100%',
		height:'80%',
        fieldDefaults: {
          //  labelAlign: 'top',
            msgTarget: 'side'
        },
        defaults: {
            anchor: '100%',
			background: '#DADADA'
	    },

        items: [{
            layout:'column',
            border:false,
			defaults: {
			    anchor: '100%',
				background: '#DADADA'
			},
            items:[{
                columnWidth:.25,
                border:false,
                layout: 'anchor',
                //defaultType: 'textfield',
                items: [{
					xtype: 'textfield',
                    fieldLabel: 'Subject',
					id: 'txtleadsubjectName',
                    allowBlank:false,
					//width: 150,
                    anchor:'95%'
                },{					
					xtype:          'combo',
					mode:           'local',
					value:          'mrs',
					triggerAction:  'all',
					forceSelection: true,
					editable:       false,
					fieldLabel:     'Section',
					id:				'cmbsection',
					name:           'title',
					displayField:   'sectionName',
					valueField:     'sectionId',
					queryMode: 'local',
					store:     Ext.create('Ext.data.Store', {
						model:'section',
						proxy:{
							type:'memory',
							data:jsonParse(responseSection.text)
						},
						autoLoad:true,
						actionMethods:{read:'POST'}
					}),
					listeners:{
						change:function(combo, ewVal, oldVal) {
					    // do something
						}
					},
					anchor:'95%'
	               }]
				},{
                columnWidth:.25,
                border:false,
                layout: 'anchor',
                //defaultType: 'textfield',
                items: [{
					xtype:          'combo',
					mode:           'local',
					value:          'mrs',
					triggerAction:  'all',
					forceSelection: true,
					editable:       false,
					fieldLabel:     'Priority',
					id:				'cmbpriority',
					name:           'title',
					displayField:   'priorityName',
					valueField:     'priorityId',
					queryMode: 'local',
					autoSelect: true,
					store:     
						Ext.create('Ext.data.Store', {
						model:'priority',
						proxy:{
							type:'memory',
							data:jsonParse(responsePriority.text)
						},
						autoLoad:true,
						actionMethods:{read:'POST'}
					}),
					anchor:'95%'
                },{
					xtype:          'combo',
					mode:           'local',
					value:          'mrs',
					triggerAction:  'all',
					forceSelection: true,
					editable:       false,
					fieldLabel:     'Stage',
					id:				'cmbstage',
					name:           'title',
					displayField:   'stageName',
					valueField:     'stageId',
					queryMode: 'local',
					store:   Ext.create('Ext.data.Store', {
						model:'stage',
						proxy:{
							type:'memory',
							data:jsonParse(responseStage.text)
						},
						autoLoad:true,
						actionMethods:{read:'POST'}
					}),
					listeners:{
						change:function(combo, ewVal, oldVal) {
							var oldState = Ext.getCmp('txtleadState').getValue();
							var val = Ext.getCmp('cmbstage').getRawValue();
							var rec1 = Ext.getCmp('cmbstage').getStore().findRecord("stageName",val);	
							if (rec1 != null) {
								Ext.getCmp('txtleadState').setValue(rec1.get('stageState'));
							}
							var dateOpen = Ext.getCmp('dateopened').getSubmitValue();
							var state = Ext.getCmp('txtleadState').getValue();

							if(dateOpen == '' && state != "New") {
								Ext.getCmp('dateopened').setValue(new Date());
								if(state == "Close"){
									Ext.getCmp('dateopened').setValue(new Date());
									Ext.getCmp('dateclosed').setValue(new Date());
								}
							} else if(dateOpen != '' && state == "Close"){
								Ext.getCmp('dateclosed').setValue(new Date());
							}
							if(oldState == "Close" && state != "Close") {
								Ext.getCmp('dateopened').setValue(new Date());
								Ext.getCmp('dateclosed').setValue('');
							}

							var dayopen = Math.ceil(((new Date().getTime()) - (Ext.getCmp('dateopened').getValue()))/(1000*60*60*24));
							if(Ext.getCmp('dateclosed').getValue() != '') {
								var dayclose = Math.ceil(((Ext.getCmp('dateclosed').getValue())-(Ext.getCmp('dateopened').getValue()))/(1000*60*60*24));
								Ext.getCmp('txtleadday2close').setValue(dayclose);
							}
							Ext.getCmp('txtleadday2open').setValue(dayopen);
							
						}	
					},
					anchor:'95%'
				}]
				},{
                columnWidth:.25,
                border:false,
                layout: 'anchor',
                defaultType: 'textfield',

                items: [{
					xtype:          'combo',
					mode:           'local',
					value:          'mrs',
					triggerAction:  'all',
					forceSelection: true,
					editable:       false,
					fieldLabel:     'Category',
					id:				'cmbcategory',
					name:           'title',
					displayField:   'categoryName',
					valueField:     'categoryId',
					queryMode: 'local',
					store: Ext.create('Ext.data.Store', {
						model:'category',
						proxy:{
							type:'memory',
							data:jsonParse(responseCategory.text)
						},
						autoLoad:true,
						actionMethods:{read:'POST'}
					}),
					anchor:'95%'
                },{
					xtype:          'combo',
					mode:           'local',
					value:          'mrs',
					triggerAction:  'all',
					forceSelection: true,
					editable:       false,
					fieldLabel:     'SalesMan',
					id:				'cmbsalesman',
					name:           'title',
					displayField:   'label',
					valueField:     'value',
					queryMode: 'local',
					store: Ext.create('Ext.data.Store', {
						model:'user',
						proxy:{
							type:'memory',
							data:jsonParse(responseUser.text)
						},
						autoLoad:true,
						actionMethods:{read:'POST'}
					}),
					queryMode: 'local',
					listConfig: {
						getInnerTpl: function() {
							return '<div data-qtip="{label}. {name}">{label}</div>';
						}
					},
					anchor:'95%'
                },{
					xtype: 'textfield',
					id: 'txtleadState',
					fieldLabel: 'Lead State',
					value: 'New',
					disabled: true
				}]
            },{
                columnWidth:.25,
                border:false,
                layout: 'anchor',
                defaultType: 'textfield',

                items: [{
					xtype: 'button',
                    text: 'Convert to Opportunity',
					width:250,
					height:25,
					iconCls: 'convert',
					anchor:'95%',
					handler : function(){
			if(Ext.getCmp('txtleadsubjectName').getValue() == "")
			{
				Ext.getCmp('txtleadsubjectName').validate(false);
				Ext.getCmp('txtleadsubjectName').focus(true);
				Ext.example.msg('Empty Field', 'Please enter subject.');
				
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
				if(dateOpen == '')
				{dateOpen = '0000-00-00 00:00:00';}

				
				var dateClose = Ext.getCmp('dateclosed').getSubmitValue();
				if(dateClose == '')
				{ dateClose = '0000-00-00 00:00:00';}
				var expectedDateClose = Ext.getCmp('dateupdatedate').getSubmitValue();
				if(expectedDateClose == '')
					{expectedDateClose = '0000-00-00 00:00:00';}
				var stageId = Ext.getCmp('cmbstage').getValue();
				var channelId = Ext.getCmp('cmbchannel').getValue();
				var sectionId = Ext.getCmp('cmbsection').getValue();
				var categoryId = Ext.getCmp('cmbcategory').getValue();
				var partnerName = Ext.getCmp('cmbpartner').getValue();
				var dayopen = Ext.getCmp('txtleadday2open').getValue();
				var dayclose = Ext.getCmp('txtleadday2close').getValue();
				var referredBy = Ext.getCmp('txtleadreferredby').getValue();
				var userId = Ext.getCmp('cmbsalesman').getValue();
				if(userId == null){
					userId = appCtxt.getUsername();
				}
				var priorityId = Ext.getCmp('cmbpriority').getValue();
				var nextActionDate = '0000-00-00 00:00:00';
				var nextAction = "Null";
				var status = true;
				var createBy = appCtxt.getUsername();
             	var createDate = Ext.getCmp('datecreationdate').getSubmitValue();
				if(createDate == '') {
					createDate = '0000-00-00 00:00:00';}
				var writeBy = appCtxt.getUsername();
				var writeDate = Ext.getCmp('dateupdatedate').getSubmitValue();
				if(writeDate == '') {
					writeDate = '0000-00-00 00:00:00';}
				var valuation = "000";
				var companyId = Ext.getCmp('cmbcompanyName').getValue();
				var leadState = Ext.getCmp('txtleadState').getValue();
				var probability = 0;
				if(rec!=null){
					//var lead = rec.get('leadId');
					var leadId = rec.get('leadId');
					var j = JSON.stringify({action:"UPDATE",object:"lead",leadId:leadId,subjectName:subjectName,stageId:stageId,priorityId:priorityId,channelId:channelId,categoryId:categoryId,contactName:contactName,email:email,street1:street1,city:city,stateId:stateId,countryId:countryId,type:type,writeDate:writeDate,writeBy:writeBy,createDate:createDate,createBy:createBy,status:status,nextAction:nextAction,nextActionDate:nextActionDate,userId:userId,referredBy:referredBy,dayClose:dayclose,dayOpen:dayopen,sectionId:sectionId,expectedDateClose:expectedDateClose,dateClose:dateClose,dateOpen:dateOpen,zip:zip,street2:street2,mobile:mobile,workPhone:workPhone,fax:fax,phone:phone,leadDescription:leadDescription,valuation:valuation,companyId:companyId,leadState:leadState,probability:probability,partnerName:partnerName});
					var json = "jsonobj=" + j;
					var reqHeader = {"Content-Type":"application/x-www-form-urlencoded"};
					var reqJson = AjxStri
						ngUtil.urlEncode(json);
					var response = AjxRpc.invoke(reqJson,"/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);
				} else {
					var leadId = 0;
					var j = JSON.stringify({action:"ADD",object:"lead",leadId:leadId,subjectName:subjectName,stageId:stageId,priorityId:priorityId,channelId:channelId,categoryId:categoryId,contactName:contactName,email:email,street1:street1,city:city,stateId:stateId,countryId:countryId,type:type,writeDate:writeDate,writeBy:writeBy,createDate:createDate,createBy:createBy,status:status,nextAction:nextAction,nextActionDate:nextActionDate,userId:userId,referredBy:referredBy,dayClose:dayclose,dayOpen:dayopen,sectionId:sectionId,expectedDateClose:expectedDateClose,dateClose:dateClose,dateOpen:dateOpen,zip:zip,street2:street2,mobile:mobile,workPhone:workPhone,fax:fax,phone:phone,leadDescription:leadDescription,valuation:valuation,companyId:companyId,leadState:leadState,probability:probability,partnerName:partnerName});
					var json = "jsonobj=" + j;
					var reqHeader = {"Content-Type":"application/x-www-form-urlencoded"};
					var reqJson = AjxStringUtil.urlEncode(json);
					var response = AjxRpc.invoke(reqJson,"/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);
				}
				//biz_vnc_crm_client.initLeadGrid(app);*/
				Ext.example.msg('Convert to Opportunity', 'Lead successfully converted into Opportunity.');
				biz_vnc_crm_client.initOpportunityGrid(app);
			}
			

			}
                    //name: 'email',
                    //vtype:'email',
                }]
            }]
        },{
            xtype:'tabpanel',
            plain:true,
			id: 'leadTabPanel',
            activeTab: 0,
            height:'80%',
			layoutOnTabChange: true,
            defaults:{bodyStyle:'padding:10px', background: '#DADADA'},
			items:[{
                title:'Contact Info',
			
//                defaults: {width: 230},
                //defaultType: 'textfield',
				height:'70%',
				layout:'column',
				items: [{
				columnWidth: .32,
                border:false,
                layout: 'anchor',

			//		height:'40%',
				border: false,
				items: [{
					xtype:          'combo',
					mode:           'local',
					value:          'Partner',
					triggerAction:  'all',
					forceSelection: true,
					editable:       false,
					fieldLabel:     'Partner',
					id:				'cmbpartner',
					name:           'title',
					displayField:   'label',
					valueField:     'value',
					queryMode: 'local',
					store: Ext.create('Ext.data.Store', {
						model:'contact1',
						proxy:{
							type:'memory',
							data: jsonParse(biz_vnc_crm_client.temp)
						},
						autoLoad:true,
						actionMethods:{read:'POST'}
					}),
					listeners:{
						change:function(combo, ewVal, oldVal) {
						var selname = Ext.getCmp('cmbpartner').getValue();									
						for (var i = 0; i < biz_vnc_crm_client.contactList.length; i++) {

							if(biz_vnc_crm_client.contactList[i].id == selname) {
								var contactName = biz_vnc_crm_client.contactList[i]._attrs.firstName +" "+biz_vnc_crm_client.contactList[i]._attrs.lastName;
//								contactList[i]._attrs.company;
								Ext.getCmp('txtleadmobile').setValue(biz_vnc_crm_client.contactList[i]._attrs.mobilePhone);
								Ext.getCmp('txtleadcontactName').setValue(contactName);
								Ext.getCmp('txtleadzip').setValue(biz_vnc_crm_client.contactList[i]._attrs.homePostalCode);
								Ext.getCmp('txtleademail').setValue(biz_vnc_crm_client.contactList[i]._attrs.email);
								Ext.getCmp('txtleadstreet1').setValue(biz_vnc_crm_client.contactList[i]._attrs.homeStreet);
								Ext.getCmp('txtleadcity').setValue(biz_vnc_crm_client.contactList[i]._attrs.homeCity);
								Ext.getCmp('txtleadphone').setValue(biz_vnc_crm_client.contactList[i]._attrs.mobilePhone2);
							}
						}

						}
					},
					anchor:'100%'
                },{
					xtype:'textfield',
                    fieldLabel: 'Contact Name',
                    id: 'txtleadcontactName',
					anchor:'100%'
                   // value: 'Avins'
                },{
					xtype:'textfield',
                    fieldLabel: 'Email',
                    id: 'txtleademail',
					vtype:'email',
					anchor:'100%'
                },{
					xtype:'textareafield',
					grow: false,
                    fieldLabel: 'Description',
                    id: 'txtleadleadDescription',
					anchor:'100%'
                    //vtype:'email'
                }]
				
            },{
                columnWidth:.04,
                border:false,
				layout: 'anchor',
                //defaultType: 'textfield',
                items: [{
					
							xtype: 'button',
							text: null,
//							width:0,
							height:25,
							iconCls: 'add_contact',
//							margin: '3 0 3 0',
							anchor:'40%', 
							handler : function(){
								var contact = new ZmContact(null, null, null);
								var contactApp = appCtxt.getApp(ZmApp.CONTACTS);
								var contactController = new ZmContactController(contactApp._container,contactApp);
								contactController.show(contact);		
								contactController.getCurrentToolbar().getButton(ZmOperation.SAVE).removeSelectionListeners();
								contactController.getCurrentToolbar().addSelectionListener(ZmOperation.CANCEL,new AjxListener(this,ZmLeadListView._myCancelListener,[app]));
								contactController.getCurrentToolbar().addSelectionListener(ZmOperation.SAVE,new AjxListener(this,ZmLeadListView._mySaveListener,[app]) );
							}
                }]
			},{
                columnWidth:.32,
                border:false,
                layout: 'anchor',

			//	height:'50%',
                //layout: 'anchor',
                //defaultType: 'textfield',
                items: [{
						xtype:'textfield',
						fieldLabel: 'Street1',
						id: 'txtleadstreet1',
						anchor:'95%'
                },{
						xtype:'textfield',
						fieldLabel: 'Street2',
						id: 'txtleadstreet2',
						anchor:'95%'
                },{
						xtype:'textfield',
						fieldLabel: 'City',
						id: 'txtleadcity',
						anchor:'95%'
				},{
					   xtype:          'combo',
						mode:           'local',
						value:          'mrs',
						triggerAction:  'all',
						forceSelection: true,
						editable:       false,
						fieldLabel:     'State',
						id:				'cmbstate',
						name:           'title',
						displayField:   'stateName',
						valueField:     'stateId',
						queryMode: 'local',
						autoSelect: true,
						store:     
							Ext.create('Ext.data.Store', {
							model:'state',
							proxy:{
								type:'memory',
								data:jsonParse(responseState.text)
							},
							autoLoad:true,
							actionMethods:{read:'POST'}

						}),
						anchor:'95%'
				},{
						xtype:          'combo',
						mode:           'local',
						value:          'mrs',
						triggerAction:  'all',
						forceSelection: true,
						editable:       false,
						fieldLabel:     'Country',
						id:				'cmbcountry',
						name:           'title',
						displayField:   'countryName',
						valueField:     'countryId',
						queryMode: 'local',
						autoSelect: true,
						store:     
							Ext.create('Ext.data.Store', {
							model:'country',
							proxy:{
								type:'memory',
								data:jsonParse(responseCountry.text)
							},
							autoLoad:true,
							actionMethods:{read:'POST'}

						}),
						anchor:'95%'
				},{
						xtype:'textfield',
						fieldLabel: 'Zip Code',
						id: 'txtleadzip',
						anchor:'95%'
				}]
			},{
                columnWidth:.32,
                border:false,
                layout: 'anchor',
			//		height:'60%',
                //layout: 'anchor',
                //defaultType: 'textfield',
                items: [{
					xtype:'textfield',
                    fieldLabel: 'Phone',
                    id: 'txtleadphone',
					anchor:'95%'
                },{
				    xtype:'textfield',
					fieldLabel: 'Work Phone',
                    id: 'txtleadworkPhone',
					anchor:'95%'
                },{
					xtype:'textfield',
					fieldLabel: 'Mobile',
  					id: 'txtleadmobile',
					anchor:'95%'
                },{
				    xtype:'textfield',
					fieldLabel: 'Fax',
                    id: 'txtleadfax',
					anchor:'95%'
                }]
			}/*,{
					xtype:'textarea',
                    fieldLabel: 'Note',
					id: 'txtleadcompanyName1',
					width:'90%',
					height:'30%',
						anchor:'100%',
                    //name: 'first',
                    allowBlank:false,
                    //value: 'Jamie'
                }*/]
				
		},{
                title:'Communication & History',
				id: 'leadComm',
          		layout:'column',
				disabled: true,
				//margin: 0 0 0 0,
				width: '100%',
				height: 250,
				dockedItems: [{
						xtype:'toolbar',
						items: [{
						iconCls: 'attachment',
						text: 'Attach',
						//scope: this,
						handler: function(){
							var leadId = rec.get('leadId');
							var flag = 0;
							biz_vnc_crm_client_HandlerObject.prototype.showAttachMailDialog(leadId,flag);
						
						}
					}, {
						iconCls: 'cancel',
						text: 'Delete',
						//disabled: true,
						itemId: 'delete',
						//scope: this,
						handler: function(){
							Ext.MessageBox.confirm('Confirm', 'Are you sure you want to do that?', showResult);
							function showResult(btn){
								if(btn == "no"){
									Ext.example.msg('No', 'You cancelled the deletion..');		
								}else {
									var rec1 = Ext.getCmp('leadMailGrid').getSelectionModel().getSelection();
									var idArray = [];
									Ext.each(rec1, function (item) {
											idArray.push(item.data.mailId);
									});

									var leadId = rec.get('leadId')
									var json = "jsonobj={\"action\":\"DELETEHISTORY\",\"object\":\"lead\",\"array\":\"" + idArray + "\",\"leadId\":\"" + leadId + "\"}";
									var reqHeader = {"Content-Type":"application/x-www-form-urlencoded"};
									var reqJson = AjxStringUtil.urlEncode(json);
									var responseUser = AjxRpc.invoke(reqJson,"/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);
								
									if(rec!=null){
										var leadId = rec.get('leadId');
										var json = "jsonobj={\"action\":\"LISTHISTORY\",\"object\":\"lead\",\"leadId\":\""+ leadId + "\"}";
										var reqHeader = {"Content-Type":"application/x-www-form-urlencoded"};
										var reqJson = AjxStringUtil.urlEncode(json);
										var responseMailHistory = AjxRpc.invoke(reqJson,"/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);
										var msgArray = [];
										var item;
										var msgArray = (responseMailHistory.text).split(",");

										//biz_vnc_crm_client.mailData = "[{'mailId':'','date':'','from':'','subject':'','message':''}]";
										if(msgArray != "null"){
											biz_vnc_crm_client.requestMailList(msgArray);
										}else{
											biz_vnc_crm_client.mailData = "[{'mailId':'','date':'','from':'','subject':'','message':''}]";
										}
										Ext.getCmp('leadMailGrid').getStore().loadData(jsonParse(biz_vnc_crm_client.mailData),false);
										Ext.getCmp('leadMailGrid').getView().refresh();
									}
								}
							};
						}
					},/*{
						iconCls: 'email',
						text: 'Email',
						//disabled: true,
						itemId: 'email',
						//scope: this,
						handler: function(){
							//store1.loadData(biz_vnc_crm_client.mailData);										
						}
					}, */{
						iconCls: 'refresh',
						text: 'Refresh',
						//disabled: true,
						itemId: 'refresh',
						//scope: this,
						handler: function(){
							//store1.loadData(biz_vnc_crm_client.mailData);	
							if(rec!=null){
								var leadId = rec.get('leadId');
								var json = "jsonobj={\"action\":\"LISTHISTORY\",\"object\":\"lead\",\"leadId\":\""+ leadId + "\"}";
								var reqHeader = {"Content-Type":"application/x-www-form-urlencoded"};
								var reqJson = AjxStringUtil.urlEncode(json);
								var responseMailHistory = AjxRpc.invoke(reqJson,"/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);
								var msgArray = [];
								var item;
								var msgArray = (responseMailHistory.text).split(",");

								//biz_vnc_crm_client.mailData = "[{'mailId':'','date':'','from':'','subject':'','message':''}]";
								if(msgArray != "null"){
									biz_vnc_crm_client.requestMailList(msgArray);
								}else{
									biz_vnc_crm_client.mailData = "[{'mailId':'','date':'','from':'','subject':'','message':''}]";
								}
								Ext.getCmp('leadMailGrid').getStore().loadData(jsonParse(biz_vnc_crm_client.mailData),false);
								Ext.getCmp('leadMailGrid').getView().refresh();
							}
						}
					}]
					},{
						xtype: 'grid',
						selModel:sm,
						id: 'leadMailGrid',
						//margin: 0 0 0 0,
						defaults: {
							autoRender: true,	
							autoScroll: true
						},
						store: Ext.create('Ext.data.Store', {
							model:'mail',
							proxy:{
								type:'memory',
								data:jsonParse(biz_vnc_crm_client.mailData)
							},
							autoLoad:true,
							actionMethods:{read:'POST'}
						}),
						columnLines: true,
						columns: [
							{
								text     : 'Date',
								sortable : false,
								width: 200,
								dataIndex: 'date',
								renderer: Ext.util.Format.dateRenderer('Y-m-d H:i:s')
							},
							{
								text     : 'From',
								sortable : false,
								width: 200,
								dataIndex: 'from'
							},
							{
								text     : 'Subject', 
								width    : 300, 
								sortable : true, 
								dataIndex: 'subject'
							},
							{
								text     : 'Message', 
								width    : 600, 
								sortable : true, 
								dataIndex: 'message'
							}
						],
						//height: 350,
						//width: 600,
						title: 'History',
						//renderTo: 'grid-example',
						viewConfig: {
							stripeRows: true
						}
				}]
		  },{
                title:'Appointments',
				id: 'leadAppointment',
          		layout:'column',
				disabled: true,
				//margin: 0 0 0 0,
				width: '100%',
				height: 250,
				dockedItems: [{
						xtype:'toolbar',
						items: [{
						iconCls: 'attachment',
						text: 'Attach',
						//scope: this,
						handler: function(){
							var leadId = rec.get('leadId');
							var flag = 0;
							biz_vnc_crm_client_HandlerObject.prototype.showAttachAppointmentDialog(leadId, flag);
						}
					}, {
						iconCls: 'cancel',
						text: 'Delete',
						//disabled: true,
						itemId: 'delete',
						//scope: this,
						handler: function(){
							Ext.MessageBox.confirm('Confirm', 'Are you sure you want to do that?', showResult);
							function showResult(btn){
								if(btn == "no"){
									Ext.example.msg('No', 'You cancelled the deletion..');		
								}else {
									var rec1 = Ext.getCmp('leadApptGrid').getSelectionModel().getSelection();
									var idArray = [];
									Ext.each(rec1, function (item) {
											
											idArray.push("'"+item.data.appointmentId+"'");
									});
									var leadId = rec.get('leadId')
									var json = "jsonobj={\"action\":\"DELETEAPPT\",\"object\":\"lead\",\"array\":\"" + idArray + "\",\"leadId\":\"" + leadId + "\"}";
									var reqHeader = {"Content-Type":"application/x-www-form-urlencoded"};
									var reqJson = AjxStringUtil.urlEncode(json);
									var responseUser = AjxRpc.invoke(reqJson,"/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);
									if(rec!=null){
										var leadId = rec.get('leadId');
										var json = "jsonobj={\"action\":\"LISTAPPTHISTORY\",\"object\":\"lead\",\"leadId\":\""+ leadId + "\"}";
										var reqHeader = {"Content-Type":"application/x-www-form-urlencoded"};
										var reqJson = AjxStringUtil.urlEncode(json);
										var responseMailHistory = AjxRpc.invoke(reqJson,"/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);
										var msgArray = [];
										var item;
										var msgArray = (responseMailHistory.text).split(",");
										if(msgArray != "null"){
											biz_vnc_crm_client.requestApptList(msgArray);
										}else{
											biz_vnc_crm_client.apptData = "[{'subject':'','location1':'','status':'','calendar':'','startdate':''}]";
										}
										Ext.getCmp('leadApptGrid').getStore().loadData(jsonParse(biz_vnc_crm_client.apptData),false);
										Ext.getCmp('leadApptGrid').getView().refresh();
									}
								}
							};
						}
					},{
						iconCls: 'appointment',
						text: 'New',
						//disabled: true,
						itemId: 'newappoint',
						//scope: this,
						handler: function(){
							if(rec!=null){
								biz_vnc_crm_client.leadId = rec.get('leadId');
								biz_vnc_crm_client.flag = 0;
								new ZmCRMCalViewController(appCtxt.getApp(ZmApp.CALENDAR)).newAppointmentHelper(new Date(),null,10,null);	
							}
						}
					}, {
						iconCls: 'refresh',
						text: 'Refresh',
						//disabled: true,
						itemId: 'refresh',
						//scope: this,
						handler: function(){
							if(rec!=null){
								var leadId = rec.get('leadId');
								var json = "jsonobj={\"action\":\"LISTAPPTHISTORY\",\"object\":\"lead\",\"leadId\":\""+ leadId + "\"}";
								var reqHeader = {"Content-Type":"application/x-www-form-urlencoded"};
								var reqJson = AjxStringUtil.urlEncode(json);
								var responseMailHistory = AjxRpc.invoke(reqJson,"/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);
								var msgArray = [];
								var item;
								var msgArray = (responseMailHistory.text).split(",");
								if(msgArray != "null"){
									biz_vnc_crm_client.requestApptList(msgArray);
								}else{
									biz_vnc_crm_client.apptData = "[{'subject':'','location1':'','status':'','calendar':'','startdate':''}]";
								}
								Ext.getCmp('leadApptGrid').getStore().loadData(jsonParse(biz_vnc_crm_client.apptData),false);
								Ext.getCmp('leadApptGrid').getView().refresh();
							}
						}
					}]
					},{
						xtype: 'grid',
						selModel:leadSMAppt,
						id: 'leadApptGrid',
						//margin: 0 0 0 0,
						defaults: {
							autoRender: true,	
							autoScroll: true
						},
						store: Ext.create('Ext.data.Store', {
							model:'leadApptModel',
							proxy:{
								type:'memory',
								data:jsonParse(biz_vnc_crm_client.apptData)
							},
							autoLoad:true,
							actionMethods:{read:'POST'}
						}),
						columnLines: true,
						columns: [
							{
								text     : 'Subject',
								sortable : false,
								width: 400,
								dataIndex: 'subject'
							},
							{
								text     : 'Location',
								sortable : false,
								width: 250,
								dataIndex: 'location1'
							},
							{
								text     : 'Status', 
								width    : 100, 
								sortable : true, 
								dataIndex: 'status'
							},
							{
								text     : 'Calendar', 
								width    : 100, 
								sortable : true, 
								dataIndex: 'calendar'
							},
							{
								text     : 'Start Date',
								sortable : false,
								width: 200,
								dataIndex: 'startdate',
								renderer: Ext.util.Format.dateRenderer('Y-m-d H:i:s')
							}
						],
						//height: 350,
						//width: 600,
						title: null,
						//renderTo: 'grid-example',
						viewConfig: {
							stripeRows: true
						}
				}]
		  },{
                title:'Tasks',
				id: 'leadTask',
          		layout:'column',
				disabled: true,
				//margin: 0 0 0 0,
				width: '100%',
				height: 250,
				dockedItems: [{
						xtype:'toolbar',
						items: [{
						iconCls: 'attachment',
						text: 'Attach',
						//scope: this,
						handler: function(){
							var leadId = rec.get('leadId');
							var flag = 0;
                            biz_vnc_crm_client_HandlerObject.prototype.showAttachTaskDialog(leadId, flag);
						}
					}, {
						iconCls: 'cancel',
						text: 'Delete',
						//disabled: true,
						itemId: 'delete',
						//scope: this,
						handler: function(){
							Ext.MessageBox.confirm('Confirm', 'Are you sure you want to do that?', showResult);
							function showResult(btn){
								if(btn == "no"){
									Ext.example.msg('No', 'You cancelled the deletion..');		
								}else {
										var rec1 = Ext.getCmp('leadTaskGrid').getSelectionModel().getSelection();
										var idArray = [];
										Ext.each(rec1, function (item) {
												idArray.push("'"+item.data.taskId+"'");
										});
										var leadId = rec.get('leadId');
										var json = "jsonobj={\"action\":\"DELETETASK\",\"object\":\"lead\",\"array\":\"" + idArray + "\",\"leadId\":\"" + leadId + "\"}";
										var reqHeader = {"Content-Type":"application/x-www-form-urlencoded"};
										var reqJson = AjxStringUtil.urlEncode(json);
										var responseUser = AjxRpc.invoke(reqJson,"/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);
										
										if(rec!=null){
											var leadId = rec.get('leadId');
											var json = "jsonobj={\"action\":\"listTask\",\"object\":\"lead\",\"leadId\":\""+ leadId + "\"}";
											var reqHeader = {"Content-Type":"application/x-www-form-urlencoded"};
											var reqJson = AjxStringUtil.urlEncode(json);
											var responseTaskList = AjxRpc.invoke(reqJson,"/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);

											var newtaskArray = (responseTaskList.text).split(",");

											var allTask = appCtxt.getTaskManager()._rawTasks;
																	
											var taskArray = [];
											if (newtaskArray != null)
											{
												
												var k=0;
												for (var i=0;i<allTask.length;i++) {
													for (var j=0;j<newtaskArray.length ;j++)
													{
														if (allTask[i].invId == newtaskArray[j])
														{
															taskArray[k++] = newtaskArray[j];
														}
													}
												}
											}
											if (taskArray.length <= 0)
											{
												leadTaskListData = "[{'taskId':'','subject':'','status':'','complete':'','dueDate':''}]";
											} else {
												leadTaskListData = "[";
												var flag=0;
												for (var i=0;i<allTask.length;i++) {
													var temp = allTask[i];
													for (var j=0;j<taskArray.length;j++) {
														if (temp.invId == taskArray[j]) {
															if(flag == taskArray.length-1) {
																leadTaskListData += "{\"taskId\":\""+temp.invId+"\",\"subject\":\""+temp.name+"\",\"status\":\""+temp.status+"\",\"complete\":\""+temp.percentComplete+"\",\"dueDate\":\""+new Date(temp.d)+"\"}]";
															} else {
																leadTaskListData += "{\"taskId\":\""+temp.invId+"\",\"subject\":\""+temp.name+"\",\"status\":\""+temp.status+"\",\"complete\":\""+temp.percentComplete+"\",\"dueDate\":\""+new Date(temp.d)+"\"},";
																flag++;
															}
														}
													}
												}
											}
											
											Ext.getCmp('leadTaskGrid').getStore().loadData(jsonParse(leadTaskListData),false);
											Ext.getCmp('leadTaskGrid').getView().refresh();
											
										}

										
									}
							};
						}
					},{
						iconCls: 'task',
						text: 'New',
						//disabled: true,
						itemId: 'newappoint',
						//scope: this,
						handler: function(){
							biz_vnc_crm_client.flag = 0;
							var leadId = rec.get('leadId');
							var taskController = new ZmCRMTaskController(appCtxt.getApp(ZmApp.TASKS)._container,appCtxt.getApp(ZmApp.TASKS),appCtxt.getCurrentViewId(),leadId);
							taskController.initComposeView();
                            taskController.show(new ZmTask(null, null, 15),ZmCalItem.MODE_NEW,true);

						}
					}, {
						iconCls: 'refresh',
						text: 'Refresh',
						//disabled: true,
						itemId: 'refresh',
						//scope: this,
						handler: function(){}
					}]
					},{
						xtype: 'grid',
						selModel:leadSMTask,
						id: 'leadTaskGrid',
						//margin: 0 0 0 0,
						defaults: {
							autoRender: true,	
							autoScroll: true
						},
						store: Ext.create('Ext.data.Store', {
							model:'taskModel',
							proxy:{
								type:'memory',
								data:jsonParse(leadTaskListData)
							},
							autoLoad:true,
							actionMethods:{read:'POST'}
						}),
						columnLines: true,
						columns: [{
								text     : 'Subject',
								sortable : false,
								width: 600,
								dataIndex: 'subject'
							},
							{
								text     : 'Status', 
								width    : 200, 
								sortable : true, 
								dataIndex: 'status'
							},
							{
								text     : '% Complete', 
								width    : 100, 
								sortable : true, 
								dataIndex: 'complete'
							},
							{
								text     : 'Due Date',
								sortable : false,
								width: 200,
								dataIndex: 'dueDate',
								renderer: Ext.util.Format.dateRenderer('Y-m-d H:i:s')
							}
						],
						//height: 350,
						//width: 600,
						title: null,
						//renderTo: 'grid-example',
						viewConfig: {
							stripeRows: true
						}
				}]
		  },{
                title:'Extra Info',
              //  defaults: {width: 230},
                //defaultType: 'textfield',
				layout:'column',
				items: [{
					columnWidth: .50,
	                border:false,
		            layout: 'anchor',

					items: [{
						xtype:          'combo',
						mode:           'local',
						value:          'companyName',
						triggerAction:  'all',
						forceSelection: true,
						editable:       false,
						fieldLabel:     'Company',
						id:				'cmbcompanyName',
						name:           'CompanyName',
						displayField:   'companyName',
						valueField:     'companyId',
						queryMode: 'local',
						store:     Ext.create('Ext.data.Store', {
							model:'company',
							proxy:{
								type:'memory',
								data:jsonParse(responseCompany.text)
							},
							autoLoad:true,
							actionMethods:{read:'POST'}
						}),
						anchor:'60%'
					},{					
						xtype:          'combo',
						mode:           'local',
						value:          'channel',
						triggerAction:  'all',
						forceSelection: true,
						editable:       false,
						fieldLabel:     'Channel',
						id:				'cmbchannel',
						name:           'channel',
						displayField:   'channelName',
						valueField:     'channelId',
						queryMode: 'local',
						store:     Ext.create('Ext.data.Store', {
							model:'channel',
							proxy:{
								type:'memory',
								data:jsonParse(responseChannel.text)
							},
							autoLoad:true,
							actionMethods:{read:'POST'}
						}),
						anchor:'60%'
					},{
						xtype:		'textfield',
						fieldLabel: 'Referred By',
						id:			'txtleadreferredby',
						name:		'last',
						anchor:'60%'
					},{
						xtype:		'textfield',
						fieldLabel: 'Days to Open',
						id:'txtleadday2open',
						name: 'days2open',
						disabled: true,
						value: '0.00',
						anchor:'60%'
				}]
				},{
					columnWidth:.50,
	                border:false,
	                layout: 'anchor',

					//layout: 'anchor',
					//defaultType: 'textfield',
					items: [{
						xtype:		'datefield',
						format:		'Y-m-d H:i:s',
						fieldLabel: 'Creation Date',
						id:			'datecreationdate',
						disabled: true,
						//name: 'first',
						//width: 150,
						anchor:'60%'
					},{
						xtype:		'datefield',
						format:		'Y-m-d H:i:s',
						fieldLabel: 'Update Date',
						id:			'dateupdatedate',
						disabled: true,
						//name: 'first',
						//width: 150,
						anchor:		'60%'
					},{
						xtype:		'datefield',
						format:		'Y-m-d H:i:s',
						fieldLabel: 'Opened',
						id:			'dateopened',
						disabled: true,
						//name: 'first',
						//width: 150,
						anchor:		'60%'
					},{
						xtype:		'datefield',
						format:		'Y-m-d H:i:s',
						fieldLabel: 'Closed',
						id:			'dateclosed',
						disabled: true,
						//name: 'first',
						//width: 150,
						anchor:		'60%'
					},{
						xtype:		'textfield',
						fieldLabel: 'Days to Close',
						name:		'day2Close',
						id: 'txtleadday2close',
						disabled: true,
						value:		'0.00',
						anchor:'60%'
					}]
			   }]
			}],
			listeners: {
                'tabchange': function(tabPanel, tab){
                    if(tab.id == 'leadAppointment'){
						if(rec!=null){
							var leadId = rec.get('leadId');
							var json = "jsonobj={\"action\":\"LISTAPPTHISTORY\",\"object\":\"lead\",\"leadId\":\""+ leadId + "\"}";
							var reqHeader = {"Content-Type":"application/x-www-form-urlencoded"};
							var reqJson = AjxStringUtil.urlEncode(json);
							var responseMailHistory = AjxRpc.invoke(reqJson,"/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);
							var msgArray = [];
							var item;
							var msgArray = (responseMailHistory.text).split(",");
							alert("msgArray===========>"+msgArray);			
							if(msgArray != "null"){
								biz_vnc_crm_client.requestApptList(msgArray);
													
								Ext.getCmp('leadApptGrid').getStore().loadData(jsonParse(biz_vnc_crm_client.apptData),false);
								Ext.getCmp('leadApptGrid').getView().refresh();
							}else{
								biz_vnc_crm_client.apptData = "[{'subject':'','location1':'','status':'','calendar':'','startdate':''}]";
							}
						}
					} else if (tab.id == 'leadTask')
					{
						if(rec!=null){
							var leadId = rec.get('leadId');
							var json = "jsonobj={\"action\":\"listTask\",\"object\":\"lead\",\"leadId\":\""+ leadId + "\"}";
							var reqHeader = {"Content-Type":"application/x-www-form-urlencoded"};
							var reqJson = AjxStringUtil.urlEncode(json);
							var responseTaskList = AjxRpc.invoke(reqJson,"/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);

							var newtaskArray = (responseTaskList.text).split(",");

							var allTask = appCtxt.getTaskManager()._rawTasks;
													
							var taskArray = [];
							if (newtaskArray != null)
							{
								
								var k=0;
								for (var i=0;i<allTask.length;i++) {
									for (var j=0;j<newtaskArray.length ;j++)
									{
										if (allTask[i].invId == newtaskArray[j])
										{
											taskArray[k++] = newtaskArray[j];
										}
									}
								}
							}
							if (taskArray.length <= 0)
							{
								leadTaskListData = "[{'taskId':'','subject':'','status':'','complete':'','dueDate':''}]";
							} else {
								leadTaskListData = "[";
								var flag=0;
								for (var i=0;i<allTask.length;i++) {
									var temp = allTask[i];
									for (var j=0;j<taskArray.length;j++) {
										if (temp.invId == taskArray[j]) {
											if(flag == taskArray.length-1) {
												leadTaskListData += "{\"taskId\":\""+temp.invId+"\",\"subject\":\""+temp.name+"\",\"status\":\""+temp.status+"\",\"complete\":\""+temp.percentComplete+"\",\"dueDate\":\""+new Date(temp.d)+"\"}]";
											} else {
												leadTaskListData += "{\"taskId\":\""+temp.invId+"\",\"subject\":\""+temp.name+"\",\"status\":\""+temp.status+"\",\"complete\":\""+temp.percentComplete+"\",\"dueDate\":\""+new Date(temp.d)+"\"},";
												flag++;
											}
										}
									}
								}
							}
							Ext.getCmp('leadTaskGrid').getStore().loadData(jsonParse(leadTaskListData),false);
							Ext.getCmp('leadTaskGrid').getView().refresh();
						}

					} else if(tab.id == 'leadComm'){
						if(rec!=null){
							var leadId = rec.get('leadId');
							var json = "jsonobj={\"action\":\"LISTHISTORY\",\"object\":\"lead\",\"leadId\":\""+ leadId + "\"}";
							var reqHeader = {"Content-Type":"application/x-www-form-urlencoded"};
							var reqJson = AjxStringUtil.urlEncode(json);
							var responseMailHistory = AjxRpc.invoke(reqJson,"/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);
							var msgArray = [];
							var item;
							var msgArray = (responseMailHistory.text).split(",");
					
							if(msgArray != "null"){
								biz_vnc_crm_client.requestMailList(msgArray);
													
								Ext.getCmp('leadMailGrid').getStore().loadData(jsonParse(biz_vnc_crm_client.mailData),false);
								Ext.getCmp('leadMailGrid').getView().refresh();
							}else{
								biz_vnc_crm_client.mailData = "[{'mailId':'','date':'','from':'','subject':'','message':''}]";
							}
						}
					}
                }
            }
        }],
        buttons: [{
            text: 'Save',
			id: 'btnsave',
			width:150,
			height:25,
			iconCls: 'save',
			handler : function(){
			if(Ext.getCmp('txtleadsubjectName').getValue() == "")
			{
				Ext.getCmp('txtleadsubjectName').validate(false);
				Ext.getCmp('txtleadsubjectName').focus(true);
				Ext.example.msg('Empty Field', 'Please enter subject.');
				
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
				if(dateOpen == '')
				{dateOpen = '0000-00-00 00:00:00';}

				
				var dateClose = Ext.getCmp('dateclosed').getSubmitValue();
				if(dateClose == '')
				{ dateClose = '0000-00-00 00:00:00';}
				var expectedDateClose = Ext.getCmp('dateupdatedate').getSubmitValue();
				if(expectedDateClose == '')
					{expectedDateClose = '0000-00-00 00:00:00';}
				var stageId = Ext.getCmp('cmbstage').getValue();
				var channelId = Ext.getCmp('cmbchannel').getValue();
				var sectionId = Ext.getCmp('cmbsection').getValue();
				var categoryId = Ext.getCmp('cmbcategory').getValue();
				var partnerName = Ext.getCmp('cmbpartner').getValue();
				var dayopen = Ext.getCmp('txtleadday2open').getValue();
				var dayclose = Ext.getCmp('txtleadday2close').getValue();
				var referredBy = Ext.getCmp('txtleadreferredby').getValue();
				var userId = Ext.getCmp('cmbsalesman').getValue();
				if(userId == null){
					userId = appCtxt.getUsername();
				}
				var priorityId = Ext.getCmp('cmbpriority').getValue();
				var nextActionDate = '0000-00-00 00:00:00';
				var nextAction = "Null";
				var status = true;
				var createBy = appCtxt.getUsername();
             	var createDate = Ext.getCmp('datecreationdate').getSubmitValue();
				if(createDate == '') {
					createDate = '0000-00-00 00:00:00';}
				var writeBy = appCtxt.getUsername();
				var writeDate = Ext.getCmp('dateupdatedate').getSubmitValue();
				if(writeDate == '') {
					writeDate = '0000-00-00 00:00:00';}
				var valuation = "000";
				var companyId = Ext.getCmp('cmbcompanyName').getValue();
				var leadState = Ext.getCmp('txtleadState').getValue();
				var probability = 0;
				if(rec!=null){
					//var lead = rec.get('leadId');
					var leadId = rec.get('leadId');
					var j = JSON.stringify({action:"UPDATE",object:"lead",leadId:leadId,subjectName:subjectName,stageId:stageId,priorityId:priorityId,channelId:channelId,categoryId:categoryId,contactName:contactName,email:email,street1:street1,city:city,stateId:stateId,countryId:countryId,type:type,writeDate:writeDate,writeBy:writeBy,createDate:createDate,createBy:createBy,status:status,nextAction:nextAction,nextActionDate:nextActionDate,userId:userId,referredBy:referredBy,dayClose:dayclose,dayOpen:dayopen,sectionId:sectionId,expectedDateClose:expectedDateClose,dateClose:dateClose,dateOpen:dateOpen,zip:zip,street2:street2,mobile:mobile,workPhone:workPhone,fax:fax,phone:phone,leadDescription:leadDescription,valuation:valuation,companyId:companyId,leadState:leadState,probability:probability,partnerName:partnerName});
					var json = "jsonobj=" + j;
					var reqHeader = {"Content-Type":"application/x-www-form-urlencoded"};
					var reqJson = AjxStringUtil.urlEncode(json);
					var response = AjxRpc.invoke(reqJson,"/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);
					if(response.text == 1){
						Ext.example.msg('Save', 'Successfully Edit...');
					    biz_vnc_crm_client.initLeadGrid(app);
					} else {
						Ext.example.msg('Save Error', 'Not Successfully Edit...');
					    biz_vnc_crm_client.initLeadGrid(app);
					}
				} else {
					var leadId = 0;
					var j = JSON.stringify({action:"ADD",object:"lead",leadId:leadId,subjectName:subjectName,stageId:stageId,priorityId:priorityId,channelId:channelId,categoryId:categoryId,contactName:contactName,email:email,street1:street1,city:city,stateId:stateId,countryId:countryId,type:type,writeDate:writeDate,writeBy:writeBy,createDate:createDate,createBy:createBy,status:status,nextAction:nextAction,nextActionDate:nextActionDate,userId:userId,referredBy:referredBy,dayClose:dayclose,dayOpen:dayopen,sectionId:sectionId,expectedDateClose:expectedDateClose,dateClose:dateClose,dateOpen:dateOpen,zip:zip,street2:street2,mobile:mobile,workPhone:workPhone,fax:fax,phone:phone,leadDescription:leadDescription,valuation:valuation,companyId:companyId,leadState:leadState,probability:probability,partnerName:partnerName});
					var json = "jsonobj=" + j;
					var reqHeader = {"Content-Type":"application/x-www-form-urlencoded"};
					var reqJson = AjxStringUtil.urlEncode(json);
					var response = AjxRpc.invoke(reqJson,"/service/zimlet/biz_vnc_crm_client/client.jsp", reqHeader, null, false);
					if(response.text == 1){
						Ext.example.msg('Save', 'Successfully Created New Lead...');
						biz_vnc_crm_client.initLeadGrid(app);

					} else {
						Ext.example.msg('Save Error', 'Not Successfully Created New Lead...');
						biz_vnc_crm_client.initLeadGrid(app);
					}

				}
				//biz_vnc_crm_client.initLeadGrid(app);*/
			}
//			biz_vnc_crm_client.initLeadGrid(app);
			}
        },{
            text: 'Cancel',
			width:150,
			id: 'btncancel',
			height:25,
			iconCls: 'cancel',
			handler : function(){
				Ext.example.msg('Cancel', 'Successfully Canceled...');
				biz_vnc_crm_client.initLeadGrid(app);}
        }]
    });
    tab2.render('LeadForm');

	if(rec!=null){

		Ext.getCmp('leadTask').setDisabled(false);
		Ext.getCmp('leadAppointment').setDisabled(false);
		Ext.getCmp('leadComm').setDisabled(false);

		Ext.getCmp('cmbpartner').getStore().load({
			callback: function(){
				Ext.getCmp('cmbpartner').setValue(rec.get('partnerName'));
			}
		});
		Ext.getCmp('cmbstage').getStore().load({
			callback: function(){
				Ext.getCmp('cmbstage').setValue(rec.get('stageId'));
			}
		});
		Ext.getCmp('cmbpriority').getStore().load({
			callback: function(){
				Ext.getCmp('cmbpriority').setValue(rec.get('priorityId'));
			}
		});
		Ext.getCmp('cmbchannel').getStore().load({
			callback: function(){
				Ext.getCmp('cmbchannel').setValue(rec.get('channelId'));
			}
		});
		Ext.getCmp('cmbsection').getStore().load({
			callback: function(){
				Ext.getCmp('cmbsection').setValue(rec.get('sectionId'));
			}
		});
		Ext.getCmp('cmbstate').getStore().load({
			callback: function(){
				Ext.getCmp('cmbstate').setValue(rec.get('stateId'));
			}
		});
		Ext.getCmp('cmbcountry').getStore().load({
			callback: function(){
				Ext.getCmp('cmbcountry').setValue(rec.get('countryId'));
			}
		});
		Ext.getCmp('cmbsalesman').getStore().load({
		callback: function(){
			Ext.getCmp('cmbsalesman').setValue(rec.get('userId'));
		}
		});
		Ext.getCmp('cmbcategory').getStore().load({
			callback: function(){
				Ext.getCmp('cmbcategory').setValue(rec.get('categoryId'));
			}
		});
		Ext.getCmp('cmbcompanyName').getStore().load({
			callback: function(){
				Ext.getCmp('cmbcompanyName').setValue(rec.get('companyId'));
			}
		});
		Ext.getCmp('txtleadsubjectName').setValue(rec.get('subjectName'));
		Ext.getCmp('txtleadcontactName').setValue(rec.get('contactName'));
	//	Ext.getCmp('txtleadcompanyName').setValue(rec.get('companyName'));
		Ext.getCmp('txtleadleadDescription').setValue(rec.get('leadDescription'));
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
