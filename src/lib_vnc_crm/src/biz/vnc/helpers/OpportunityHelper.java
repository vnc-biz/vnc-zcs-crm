/*
##############################################################################
#    VNC-Virtual Network Consult GmbH.
#    Copyright (C) 2004-TODAY VNC-Virtual Network Consult GmbH
#    (< http://www.vnc.biz >).
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
#    along with this program.  If not, see < http://www.gnu.org/licenses/ >.
#
##############################################################################
*/

package biz.vnc.helpers;

import biz.vnc.base.AbstractBean;
import biz.vnc.base.InterfaceHelper;
import biz.vnc.beans.CategoryBean;
import biz.vnc.beans.ChannelBean;
import biz.vnc.beans.CompanyBean;
import biz.vnc.beans.CountryBean;
import biz.vnc.beans.LeadBean;
import biz.vnc.beans.LeadClassBean;
import biz.vnc.beans.PriorityBean;
import biz.vnc.beans.SectionBean;
import biz.vnc.beans.StageBean;
import biz.vnc.beans.StateBean;
import biz.vnc.util.DBUtility;
import biz.vnc.util.Limits;
import com.google.gson.Gson;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import biz.vnc.zimbra.util.ZLog;

public class OpportunityHelper implements InterfaceHelper {

	Gson gson = new Gson();
	int operationStatus=0;
	DBUtility dbu = new DBUtility();

	@Override
	public String listView() {
		String strOfAllRecords = gson.toJson(getAllRecords());
		return strOfAllRecords;
	}

	@Override
	public int add(AbstractBean ab) {
		LeadBean leadBean = (LeadBean)ab;
		String query = "insert into tbl_crm_lead values (" + leadBean.getLeadId() + ",\"" + leadBean.getSubjectName() + "\",\"" + leadBean.getLeadDescription() + "\",\"" + leadBean.getContactName() + "\"," + leadBean.getCompanyId() + ",\"" + leadBean.getValuation() + "\",'" + leadBean.getLeadState() + "'," + leadBean.getLeadClassId() + ",'" + leadBean.getPartnerName() + "','" + leadBean.getPhone() + "','" + leadBean.getFax() + "','" + leadBean.getEmail() + "','" + leadBean.getWorkPhone() + "','" + leadBean.getMobile() + "','" + leadBean.getStreet1() + "','" + leadBean.getStreet2() + "','" + leadBean.getCity() + "','" + leadBean.getZip() + "'," + leadBean.getStateId() + "," + leadBean.getCountryId() + "," + leadBean.getType() + ",'" + leadBean.getDateOpen() + "','" + leadBean.getDateClose() + "','" + leadBean.getExpectedDateClose() + "'," + leadBean.getStageId() + "," + leadBean.getProbability() + "," + leadBean.getChannelId() + "," + leadBean.getSectionId() + "," + leadBean.getCategoryId() + "," + leadBean.getDayClose() + "," + leadBean.getDayOpen() + ",'" + leadBean.getReferredBy() + "','" + leadBean.getUserId() + "'," + leadBean.getPriorityId() + ",'" + leadBean.getNextActionDate() + "','" + leadBean.getNextAction() + "'," + leadBean.isStatus() + ",'" + leadBean.getCreateBy() + "','" + new Timestamp(System.currentTimeMillis()) + "','" + leadBean.getWriteBy() + "','" + leadBean.getWriteDate()+ "');" ;
		operationStatus = dbu.insert(query);
		return operationStatus;
	}

	@Override
	public int update(AbstractBean ab) {
		LeadBean leadBean = (LeadBean)ab;
		String query = "update tbl_crm_lead set subjectName = \"" + leadBean.getSubjectName() + "\", leadDescription='" + leadBean.getLeadDescription() + "', contactName = '" + leadBean.getContactName() + "', companyId = " + leadBean.getCompanyId() + ", valuation = '" + leadBean.getValuation() + "', leadState = '" +leadBean.getLeadState() + "', leadClassId = " + leadBean.getLeadClassId() + " , partnerName = '" + leadBean.getPartnerName() + "', phone = '" + leadBean.getPhone() + "', fax = '" + leadBean.getFax() + "', email = '" + leadBean.getEmail() + "', workPhone = '" + leadBean.getWorkPhone() + "', mobile = '" + leadBean.getMobile() + "', street1 = '" + leadBean.getStreet1() + "', street2 = '" + leadBean.getStreet2() + "', city = '" + leadBean.getCity() + "', zip = '" + leadBean.getZip() + "', stateId = " + leadBean.getStateId() + ", countryId = " + leadBean.getCountryId() + ", type = '" + leadBean.getType() + "', dateOpen = '" + leadBean.getDateOpen() + "', dateClose = '" + leadBean.getDateClose() + "', expectedDateClose = '" + leadBean.getExpectedDateClose() + "', stageId = " + leadBean.getStageId() + ", probability = '" + leadBean.getProbability() +  "', channelId = " + leadBean.getChannelId() + ", sectionId = " + leadBean.getSectionId() + ", categoryId = " + leadBean.getCategoryId() + ", dayClose = " + leadBean.getDayClose() + ",dayOpen = " + leadBean.getDayOpen() + ", referredBy = '" + leadBean.getReferredBy() + "', userId = '" + leadBean.getUserId() + "', priorityId = " + leadBean.getPriorityId() + ", nextActionDate = '" + leadBean.getNextActionDate() + "', nextAction = '" + leadBean.getNextAction() + "', writeBy = \"" + leadBean.getWriteBy() + "\", writeDate = '" + new Timestamp(System.currentTimeMillis()) + "' " + "where leadId = " + leadBean.getLeadId() + ";" ;
		operationStatus = dbu.update(query);
		return operationStatus;
	}

	@Override
	public int delete(AbstractBean ab) {
		LeadBean leadBean = (LeadBean)ab;
		String query = "delete from tbl_crm_lead where leadId =" + leadBean.getLeadId() + ";" ;
		operationStatus = dbu.delete(query);
		return operationStatus;
	}

	@Override
	public int deleteByIds(String arrayIds, String user) {
		String query = "update tbl_crm_lead set status = false, writeBy = '" + user + "', writeDate = '" + new Timestamp(System.currentTimeMillis()) + "' where leadId IN (" + arrayIds + ");" ;
		operationStatus = dbu.delete(query);
		return operationStatus;
	}

	@Override
	public List<AbstractBean> getAllRecords() {
		List<AbstractBean> retValue = new ArrayList<AbstractBean>();
		String query = "select * from tbl_crm_lead;" ;
		ResultSet rs = dbu.select(query);
		try {
			System.out.println("Number of records : " + rs.getRow());
		} catch (SQLException e1) {
			ZLog.err("VNC CRM for Zimbra","Error in Opportunity Helper Class", e1);
		}
		LeadBean leadBean = null;
		CountryHelper countryHelper = new CountryHelper();
		StateHelper stateHelper = new StateHelper();
		ChannelHelper channelHelper = new ChannelHelper();
		SectionHelper sectionHelper = new SectionHelper();
		CategoryHelper categoryHelper = new CategoryHelper();
		PriorityHelper priorityHelper = new PriorityHelper();
		StageHelper stageHelper = new StageHelper();
		CompanyHelper companyHelper = new CompanyHelper();
		LeadClassHelper leadClassHelper = new LeadClassHelper();
		try {
			while(rs.next()) {
				leadBean = new LeadBean();
				leadBean.setLeadId(rs.getInt("leadId"));
				leadBean.setSubjectName(rs.getString("subjectName"));
				leadBean.setLeadDescription(rs.getString("leadDescription"));
				leadBean.setContactName(rs.getString("contactName"));
				leadBean.setCompanyBean((CompanyBean)(companyHelper.getRecordById(rs.getString("companyId"))));
				leadBean.setValuation(rs.getString("valuation"));
				leadBean.setLeadState(rs.getString("leadState"));
				leadBean.setLeadClassBean((LeadClassBean) (leadClassHelper.getRecordById(rs.getString("leadClassId"))));
				leadBean.setPartnerName(rs.getString("partnerName"));
				leadBean.setPhone(rs.getString("phone"));
				leadBean.setFax(rs.getString("fax"));
				leadBean.setEmail(rs.getString("email"));
				leadBean.setWorkPhone(rs.getString("workPhone"));
				leadBean.setMobile(rs.getString("mobile"));
				leadBean.setStreet1(rs.getString("street1"));
				leadBean.setStreet2(rs.getString("street2"));
				leadBean.setCity(rs.getString("city"));
				leadBean.setZip(rs.getString("zip"));
				leadBean.setCountryBean((CountryBean) (countryHelper.getRecordById(rs.getString("countryId"))));
				leadBean.setStateBean((StateBean) (stateHelper.getRecordById(rs.getString("stateId"))));
				leadBean.setChannelBean((ChannelBean) (channelHelper.getRecordById(rs.getString("channelId"))));
				leadBean.setPriorityBean((PriorityBean) (priorityHelper.getRecordById(rs.getString("priorityId"))));
				leadBean.setStageBean((StageBean) (stageHelper.getRecordById(rs.getString("stageId"))));
				leadBean.setCategoryBean((CategoryBean) (categoryHelper.getRecordById(rs.getString("categoryId"))));
				leadBean.setSectionBean((SectionBean) (sectionHelper.getRecordById(rs.getString("sectionId"))));
				leadBean.setType(rs.getString("type"));
				leadBean.setDateOpen(rs.getString("dateOpen"));
				leadBean.setDateClose(rs.getString("dateClose"));
				leadBean.setExpectedDateClose(rs.getString("expectedDateClose"));
				leadBean.setProbability(rs.getString("probability"));
				leadBean.setDayClose(rs.getString("dayClose"));
				leadBean.setDayOpen(rs.getString("dayOpen"));
				leadBean.setReferredBy(rs.getString("referredBy"));
				leadBean.setUserId(rs.getString("userId"));
				leadBean.setNextActionDate(rs.getString("nextActionDate"));
				leadBean.setNextAction(rs.getString("nextAction"));
				leadBean.setStatus(rs.getBoolean("status"));
				leadBean.setCreateBy(rs.getString("createBy"));
				leadBean.setCreateDate(rs.getString("createDate"));
				leadBean.setWriteBy(rs.getString("writeBy"));
				leadBean.setWriteDate(rs.getString("writeDate"));
				retValue.add(leadBean);
			}
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra","Error in Opportunity Helper Class", e);
		}
		return retValue;
	}

	@Override
	public AbstractBean getRecordById(String id) {
		return null;
	}

	@Override
	public AbstractBean getRecordByName(String name) {
		return null;
	}

	@Override
	public AbstractBean toBean(String jsonString) {
		try {
			LeadBean leadBean  = new LeadBean();
			leadBean = gson.fromJson(jsonString, LeadBean.class);
			return leadBean;
		} catch(Exception e) {
			System.out.println("Error in toBean() :" + e);
		}
		return null;
	}

	@Override
	public List<AbstractBean> getStringRecord(AbstractBean ab) {
		return null;
	}

	@Override
	public String getUsers() {
		return null;
	}

	@Override
	public List<AbstractBean> getAllActiveRecords() {
		List<AbstractBean> retValue = new ArrayList<AbstractBean>();
		String query = "select * from tbl_crm_lead where type = 1 AND status = true;" ;
		ResultSet rs = dbu.select(query);
		try {
			System.out.println("Number of records : " + rs.getRow());
		} catch (SQLException e1) {
			ZLog.err("VNC CRM for Zimbra","Error in Opportunity Helper Class", e1);
		}
		LeadBean leadBean = null;
		CountryHelper countryHelper = new CountryHelper();
		StateHelper stateHelper = new StateHelper();
		ChannelHelper channelHelper = new ChannelHelper();
		SectionHelper sectionHelper = new SectionHelper();
		CategoryHelper categoryHelper = new CategoryHelper();
		PriorityHelper priorityHelper = new PriorityHelper();
		StageHelper stageHelper = new StageHelper();
		CompanyHelper companyHelper = new CompanyHelper();
		LeadClassHelper leadClassHelper = new LeadClassHelper();
		try {
			while(rs.next()) {
				leadBean = new LeadBean();
				leadBean.setLeadId(rs.getInt("leadId"));
				leadBean.setSubjectName(rs.getString("subjectName"));
				leadBean.setLeadDescription(rs.getString("leadDescription"));
				leadBean.setContactName(rs.getString("contactName"));
				leadBean.setCompanyBean((CompanyBean)(companyHelper.getRecordById(rs.getString("companyId"))));
				leadBean.setValuation(rs.getString("valuation"));
				leadBean.setLeadState(rs.getString("leadState"));
				leadBean.setLeadClassBean((LeadClassBean)(leadClassHelper.getRecordById(rs.getString("leadClassId"))));
				leadBean.setPartnerName(rs.getString("partnerName"));
				leadBean.setPhone(rs.getString("phone"));
				leadBean.setFax(rs.getString("fax"));
				leadBean.setEmail(rs.getString("email"));
				leadBean.setWorkPhone(rs.getString("workPhone"));
				leadBean.setMobile(rs.getString("mobile"));
				leadBean.setStreet1(rs.getString("street1"));
				leadBean.setStreet2(rs.getString("street2"));
				leadBean.setCity(rs.getString("city"));
				leadBean.setZip(rs.getString("zip"));
				leadBean.setCountryBean((CountryBean) (countryHelper.getRecordById(rs.getString("countryId"))));
				leadBean.setStateBean((StateBean) (stateHelper.getRecordById(rs.getString("stateId"))));
				leadBean.setChannelBean((ChannelBean) (channelHelper.getRecordById(rs.getString("channelId"))));
				leadBean.setPriorityBean((PriorityBean) (priorityHelper.getRecordById(rs.getString("priorityId"))));
				leadBean.setStageBean((StageBean) (stageHelper.getRecordById(rs.getString("stageId"))));
				leadBean.setCategoryBean((CategoryBean) (categoryHelper.getRecordById(rs.getString("categoryId"))));
				leadBean.setSectionBean((SectionBean) (sectionHelper.getRecordById(rs.getString("sectionId"))));
				leadBean.setType(rs.getString("type"));
				leadBean.setDateOpen(rs.getString("dateOpen"));
				leadBean.setDateClose(rs.getString("dateClose"));
				leadBean.setExpectedDateClose(rs.getString("expectedDateClose"));
				leadBean.setProbability(rs.getString("probability"));
				leadBean.setDayClose(rs.getString("dayClose"));
				leadBean.setDayOpen(rs.getString("dayOpen"));
				leadBean.setReferredBy(rs.getString("referredBy"));
				leadBean.setUserId(rs.getString("userId"));
				leadBean.setNextActionDate(rs.getString("nextActionDate"));
				leadBean.setNextAction(rs.getString("nextAction"));
				leadBean.setStatus(rs.getBoolean("status"));
				leadBean.setCreateBy(rs.getString("createBy"));
				leadBean.setCreateDate(rs.getString("createDate"));
				leadBean.setWriteBy(rs.getString("writeBy"));
				leadBean.setWriteDate(rs.getString("writeDate"));
				retValue.add(leadBean);
			}
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra","Error in Opportunity Helper Class", e);
		}
		return retValue;
	}

	@Override
	public String listClientView() {
		String strOfAllRecords = gson.toJson(getAllActiveRecords());
		return strOfAllRecords;
	}

	@Override
	public List<AbstractBean> getAllActiveFilterRecords(String array,String field) {
		List<AbstractBean> retValue = new ArrayList<AbstractBean>();
		String query = "select * from tbl_crm_lead where type = 1 and status = true and " + field + " IN (" + array + ");"  ;
		ResultSet rs = dbu.select(query);
		try {
			System.out.println("Number of records : " + rs.getRow());
		} catch (SQLException e1) {
			ZLog.err("VNC CRM for Zimbra","Error in Opportunity Helper Class", e1);
		}
		LeadBean leadBean = null;
		CountryHelper countryHelper = new CountryHelper();
		StateHelper stateHelper = new StateHelper();
		ChannelHelper channelHelper = new ChannelHelper();
		SectionHelper sectionHelper = new SectionHelper();
		CategoryHelper categoryHelper = new CategoryHelper();
		PriorityHelper priorityHelper = new PriorityHelper();
		StageHelper stageHelper = new StageHelper();
		CompanyHelper companyHelper = new CompanyHelper();
		LeadClassHelper leadClassHelper = new LeadClassHelper();
		try {
			while(rs.next()) {
				leadBean = new LeadBean();
				leadBean.setLeadId(rs.getInt("leadId"));
				leadBean.setSubjectName(rs.getString("subjectName"));
				leadBean.setLeadDescription(rs.getString("leadDescription"));
				leadBean.setContactName(rs.getString("contactName"));
				leadBean.setCompanyBean((CompanyBean)(companyHelper.getRecordById(rs.getString("companyId"))));
				leadBean.setValuation(rs.getString("valuation"));
				leadBean.setLeadState(rs.getString("leadState"));
				leadBean.setLeadClassBean((LeadClassBean)(leadClassHelper.getRecordById(rs.getString("leadClassId"))));
				leadBean.setPartnerName(rs.getString("partnerName"));
				leadBean.setPhone(rs.getString("phone"));
				leadBean.setFax(rs.getString("fax"));
				leadBean.setEmail(rs.getString("email"));
				leadBean.setWorkPhone(rs.getString("workPhone"));
				leadBean.setMobile(rs.getString("mobile"));
				leadBean.setStreet1(rs.getString("street1"));
				leadBean.setStreet2(rs.getString("street2"));
				leadBean.setCity(rs.getString("city"));
				leadBean.setZip(rs.getString("zip"));
				leadBean.setCountryBean((CountryBean) (countryHelper.getRecordById(rs.getString("countryId"))));
				leadBean.setStateBean((StateBean) (stateHelper.getRecordById(rs.getString("stateId"))));
				leadBean.setChannelBean((ChannelBean) (channelHelper.getRecordById(rs.getString("channelId"))));
				leadBean.setPriorityBean((PriorityBean) (priorityHelper.getRecordById(rs.getString("priorityId"))));
				leadBean.setStageBean((StageBean) (stageHelper.getRecordById(rs.getString("stageId"))));
				leadBean.setCategoryBean((CategoryBean) (categoryHelper.getRecordById(rs.getString("categoryId"))));
				leadBean.setSectionBean((SectionBean) (sectionHelper.getRecordById(rs.getString("sectionId"))));
				leadBean.setType(rs.getString("type"));
				leadBean.setDateOpen(rs.getString("dateOpen"));
				leadBean.setDateClose(rs.getString("dateClose"));
				leadBean.setExpectedDateClose(rs.getString("expectedDateClose"));
				leadBean.setProbability(rs.getString("probability"));
				leadBean.setDayClose(rs.getString("dayClose"));
				leadBean.setDayOpen(rs.getString("dayOpen"));
				leadBean.setReferredBy(rs.getString("referredBy"));
				leadBean.setUserId(rs.getString("userId"));
				leadBean.setNextActionDate(rs.getString("nextActionDate"));
				leadBean.setNextAction(rs.getString("nextAction"));
				leadBean.setStatus(rs.getBoolean("status"));
				leadBean.setCreateBy(rs.getString("createBy"));
				leadBean.setCreateDate(rs.getString("createDate"));
				leadBean.setWriteBy(rs.getString("writeBy"));
				leadBean.setWriteDate(rs.getString("writeDate"));
				retValue.add(leadBean);
			}
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra","Error in Opportunity Helper Class", e);
		}
		return retValue;
	}

	@Override
	public String filterView(String array) {
		String field = "leadState";
		String strOfAllRecords = gson.toJson(getAllActiveFilterRecords(array,field));
		return strOfAllRecords;
	}

	@Override
	public String filterByContact(String Array) {
		String field = "partnerName";
		String strOfAllRecords = gson.toJson(getAllActiveFilterRecords(Array,field));
		return strOfAllRecords;
	}

	@Override
	public int addHistory(String array, String leadId) {
		String[] str = array.split(",");
for(String messageId : str) {
			String query = "insert into tbl_crm_lead_mailHistory values ('" + leadId +"','" + messageId + "');";
			operationStatus = dbu.insert(query);
		}
		return operationStatus;
	}

	@Override
	public String listHistory(String leadId) {
		String query = "select messageId from tbl_crm_lead_mailHistory where leadId = " + leadId + ";";
		ResultSet rs = dbu.select(query);
		String str;
		String msgArray = null;
		try {
			while(rs.next()) {
				str = rs.getString("messageId");
				if(msgArray == null) {
					msgArray = str;
				} else
					msgArray = msgArray + "," + str;
			}
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra","Error in Opportunity Helper Class", e);
		}
		return msgArray;
	}

	@Override
	public int deleteHistory(String array,String leadId) {
		String query = "delete from tbl_crm_lead_mailHistory where leadId = " + leadId + " and messageId IN (" + array + ");";
		operationStatus = dbu.delete(query);
		return operationStatus;
	}

	@Override
	public int addAppointment(String array, String leadId) {
		String[] str = array.split(",");
for(String messageId : str) {
			String query = "insert into tbl_crm_lead_calendar values ('" + leadId +"','" + messageId + "');";
			operationStatus = dbu.insert(query);
		}
		return operationStatus;
	}

	@Override
	public String listAppointment(String leadId) {
		String query = "select appointmentId from tbl_crm_lead_calendar where leadId = " + leadId + ";";
		ResultSet rs = dbu.select(query);
		String str;
		String msgArray = null;
		try {
			while(rs.next()) {
				str = rs.getString("appointmentId");
				if(msgArray == null) {
					msgArray = str;
				} else
					msgArray = msgArray + "," + str;
			}
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra","Error in Opportunity Helper Class", e);
		}
		return msgArray;
	}

	@Override
	public int deleteAppointment(String array,String leadId) {
		String query = "delete from tbl_crm_lead_calendar where leadId = " + leadId + " and appointmentId IN (" + array + ");";
		operationStatus = dbu.delete(query);
		return operationStatus;
	}

	@Override
	public int addTask(String array, String leadId) {
		String[] str = array.split(",");
for(String messageId : str) {
			String query = "insert into tbl_crm_lead_task values ('" + leadId +"','" + messageId + "');";
			operationStatus = dbu.insert(query);
		}
		return operationStatus;
	}

	@Override
	public String listTask(String leadId) {
		String query = "select taskId from tbl_crm_lead_task where leadId = " + leadId + ";";
		ResultSet rs = dbu.select(query);
		String str;
		String msgArray = null;
		try {
			while(rs.next()) {
				str = rs.getString("taskId");
				if(msgArray == null) {
					msgArray = str;
				} else
					msgArray = msgArray + "," + str;
			}
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra","Error in Opportunity Helper Class", e);
		}
		return msgArray;
	}

	@Override
	public int deleteTask(String array,String leadId) {
		String query = "delete from tbl_crm_lead_task where leadId = " + leadId + " and taskId IN (" + array + ");";
		operationStatus = dbu.delete(query);
		return operationStatus;
	}

	@Override
	public int recordCounter() {
		String tableName = "tbl_crm_lead";
		operationStatus = dbu.clientCounter(tableName, 1);
		if(operationStatus >= Limits.max_limit)
			return 2;
		return 0;
	}
}
