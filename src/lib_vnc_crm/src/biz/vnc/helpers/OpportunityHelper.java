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
import biz.vnc.util.Notification;
import biz.vnc.zimbra.util.JSPUtil;
import biz.vnc.zimbra.util.ZLog;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.zimbra.common.service.ServiceException;
import com.zimbra.cs.account.AuthTokenException;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import org.json.JSONException;

public class OpportunityHelper implements InterfaceHelper {

	Gson gson = new Gson();
	int operationStatus=0;
	PreparedStatement preparedStatement;
	DBUtility dbu = new DBUtility();

	@Override
	public String listView(String username) {
		String strOfAllRecords = gson.toJson(getAllRecords(username));
		return strOfAllRecords;
	}

	@Override
	public int add(AbstractBean ab) {
		LeadBean leadBean = (LeadBean)ab;
		String query = "insert into tbl_crm_lead values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setInt(1, leadBean.getLeadId());
			preparedStatement.setString(2, leadBean.getSubjectName());
			preparedStatement.setString(3, leadBean.getLeadDescription());
			preparedStatement.setString(4, leadBean.getContactName());
			preparedStatement.setString(5, leadBean.getCompanyId());
			preparedStatement.setString(6, leadBean.getValuation());
			preparedStatement.setString(7, leadBean.getLeadState());
			preparedStatement.setString(8, leadBean.getLeadClassId());
			preparedStatement.setString(9, leadBean.getPartnerName());
			preparedStatement.setString(10, leadBean.getPhone());
			preparedStatement.setString(11, leadBean.getFax());
			preparedStatement.setString(12, leadBean.getEmail());
			preparedStatement.setString(13, leadBean.getWorkPhone());
			preparedStatement.setString(14, leadBean.getMobile());
			preparedStatement.setString(15, leadBean.getStreet1());
			preparedStatement.setString(16, leadBean.getStreet2());
			preparedStatement.setString(17, leadBean.getCity());
			preparedStatement.setString(18, leadBean.getZip());
			preparedStatement.setString(19, leadBean.getStateId());
			preparedStatement.setString(20, leadBean.getCountryId());
			preparedStatement.setString(21, leadBean.getType());
			preparedStatement.setString(22, leadBean.getDateOpen());
			preparedStatement.setString(23, leadBean.getDateClose());
			preparedStatement.setString(24, leadBean.getExpectedDateClose());
			preparedStatement.setString(25, leadBean.getStageId());
			preparedStatement.setString(26, leadBean.getProbability());
			preparedStatement.setString(27, leadBean.getChannelId());
			preparedStatement.setString(28, leadBean.getSectionId());
			preparedStatement.setString(29, leadBean.getCategoryId());
			preparedStatement.setString(30, leadBean.getDayClose());
			preparedStatement.setString(31, leadBean.getDayOpen());
			preparedStatement.setString(32, leadBean.getReferredBy());
			preparedStatement.setString(33, leadBean.getUserId());
			preparedStatement.setString(34, leadBean.getPriorityId());
			preparedStatement.setString(35, leadBean.getNextActionDate());
			preparedStatement.setString(36, leadBean.getNextAction());
			preparedStatement.setBoolean(37, leadBean.isStatus());
			preparedStatement.setString(38, leadBean.getCreateBy());
			preparedStatement.setTimestamp(39, new Timestamp(System.currentTimeMillis()));
			preparedStatement.setString(40, leadBean.getWriteBy());
			preparedStatement.setTimestamp(41, new Timestamp(System.currentTimeMillis()));
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in insert operation in OpportunityHelper", e);
		}
		operationStatus = dbu.insert(preparedStatement);
		if (operationStatus == 1) {
			return Notification.record_saved;
		} else {
			return Notification.record_not_saved;
		}
	}

	@Override
	public int update(AbstractBean ab) {
		LeadBean leadBean = (LeadBean)ab;
		String query = "update tbl_crm_lead set subjectName = ?, leadDescription= ?, contactName = ?, companyId = ?, valuation = ?, leadState = ?, leadClassId = ?, partnerName = ?, phone = ?, fax = ?, email = ?, workPhone = ?, mobile = ?, street1 = ?, street2 = ?, city = ?, zip = ?, stateId = ?, countryId = ?, type = ?, dateOpen = ?, dateClose = ?, expectedDateClose = ?, stageId = ?, probability = ?, channelId = ?, sectionId = ?, categoryId = ?, dayClose = ?, dayOpen = ?, referredBy = ?, userId = ?, priorityId = ?, nextActionDate = ?, nextAction = ?, writeBy = ?, writeDate = ? where leadId = ?;" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setString(1, leadBean.getSubjectName());
			preparedStatement.setString(2, leadBean.getLeadDescription());
			preparedStatement.setString(3, leadBean.getContactName());
			preparedStatement.setString(4, leadBean.getCompanyId());
			preparedStatement.setString(5, leadBean.getValuation());
			preparedStatement.setString(6, leadBean.getLeadState());
			preparedStatement.setString(7, leadBean.getLeadClassId());
			preparedStatement.setString(8, leadBean.getPartnerName());
			preparedStatement.setString(9, leadBean.getPhone());
			preparedStatement.setString(10, leadBean.getFax());
			preparedStatement.setString(11, leadBean.getEmail());
			preparedStatement.setString(12, leadBean.getWorkPhone());
			preparedStatement.setString(13, leadBean.getMobile());
			preparedStatement.setString(14, leadBean.getStreet1());
			preparedStatement.setString(15, leadBean.getStreet2());
			preparedStatement.setString(16, leadBean.getCity());
			preparedStatement.setString(17, leadBean.getZip());
			preparedStatement.setString(18, leadBean.getStateId());
			preparedStatement.setString(19, leadBean.getCountryId());
			preparedStatement.setString(20, leadBean.getType());
			preparedStatement.setString(21, leadBean.getDateOpen());
			preparedStatement.setString(22, leadBean.getDateClose());
			preparedStatement.setString(23, leadBean.getExpectedDateClose());
			preparedStatement.setString(24, leadBean.getStageId());
			preparedStatement.setString(25, leadBean.getProbability());
			preparedStatement.setString(26, leadBean.getChannelId());
			preparedStatement.setString(27, leadBean.getSectionId());
			preparedStatement.setString(28, leadBean.getCategoryId());
			preparedStatement.setString(29, leadBean.getDayClose());
			preparedStatement.setString(30, leadBean.getDayOpen());
			preparedStatement.setString(31, leadBean.getReferredBy());
			preparedStatement.setString(32, leadBean.getUserId());
			preparedStatement.setString(33, leadBean.getPriorityId());
			preparedStatement.setString(34, leadBean.getNextActionDate());
			preparedStatement.setString(35, leadBean.getNextAction());
			preparedStatement.setString(36, leadBean.getWriteBy());
			preparedStatement.setTimestamp(37, new Timestamp(System.currentTimeMillis()));
			preparedStatement.setInt(38, leadBean.getLeadId());
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in update operation in OpportunityHelper", e);
		}
		operationStatus = dbu.insert(preparedStatement);
		if (operationStatus == 1) {
			return Notification.record_update;
		} else {
			return Notification.record_not_update;
		}
	}

	@Override
	public int delete(AbstractBean ab) {
		LeadBean leadBean = (LeadBean)ab;
		String query = "delete from tbl_crm_lead where leadId = ?;" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setInt(1, leadBean.getLeadId());
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in delete operation in OpportunityHelper", e);
		}
		operationStatus = dbu.delete(preparedStatement);
		if (operationStatus == 1) {
			return Notification.record_delete;
		} else {
			return Notification.record_not_delete;
		}
	}

	@Override
	public int deleteByIds(String arrayIds, String user) {
		String query = "update tbl_crm_lead set status = ?, writeBy = ?, writeDate = ? where leadId IN (" + arrayIds + ");";
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setBoolean(1, false);
			preparedStatement.setString(2, user);
			preparedStatement.setTimestamp(3, new Timestamp(System.currentTimeMillis()));
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in deleteByIds in OpportunityHelper", e);
		}
		operationStatus = dbu.delete(preparedStatement);
		if (operationStatus == 1) {
			return Notification.record_delete;
		} else {
			return Notification.record_not_delete;
		}
	}

	@Override
	public List<AbstractBean> getAllRecords(String username) {
		List<AbstractBean> retValue = new ArrayList<AbstractBean>();
		String query = "select * from tbl_crm_lead where status = ? and userId = ? UNION select * from tbl_crm_lead where leadId IN (select leadId from tbl_crm_share where userId = ?) and status = ?;" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setBoolean(1, true);
			preparedStatement.setString(2, username);
			preparedStatement.setString(3, username);
			preparedStatement.setBoolean(4, true);
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in getting all records in OpportunityHelper", e);
		}
		ResultSet rs = dbu.select(preparedStatement);
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
			ZLog.err("VNC CRM for Zimbra","Error in toBean() :",e);
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
	public List<AbstractBean> getAllActiveRecords(String username) {
		List<AbstractBean> retValue = new ArrayList<AbstractBean>();
		String query = "select * from tbl_crm_lead where type = 1 and status = ? and userId = ? UNION select * from tbl_crm_lead where leadId IN (select leadId from tbl_crm_share where userId = ?) and type = 1 and status = ?;";
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setBoolean(1, true);
			preparedStatement.setString(2, username);
			preparedStatement.setString(3, username);
			preparedStatement.setBoolean(4, true);
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in getting all active records in OpportunityHelper", e);
		}
		ResultSet rs = dbu.select(preparedStatement);
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
	public String listClientView(String username) {
		String strOfAllRecords = gson.toJson(getAllActiveRecords(username));
		return strOfAllRecords;
	}

	@Override
	public List<AbstractBean> getAllActiveFilterRecords(String array,String field, String username) {
		List<AbstractBean> retValue = new ArrayList<AbstractBean>();
		String query = "select * from tbl_crm_lead where type = 1 and status = ? and userId = ? and " + field + " IN (" + array + ") UNION select * from tbl_crm_lead where leadId IN (select leadId from tbl_crm_share where userId = ?) and type = 1 and status = ? and " + field + " IN (" + array + ");";
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setBoolean(1, true);
			preparedStatement.setString(2, username);
			preparedStatement.setString(3, username);
			preparedStatement.setBoolean(4, true);
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in getting all active records in OpportunityHelper", e);
		}
		ResultSet rs = dbu.select(preparedStatement);
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
	public String filterView(String array, String username) {
		String field = "leadState";
		String strOfAllRecords = gson.toJson(getAllActiveFilterRecords(array,field, username));
		return strOfAllRecords;
	}

	@Override
	public String filterByContact(String Array, String username) {
		String field = "partnerName";
		String strOfAllRecords = gson.toJson(getAllActiveFilterRecords(Array,field, username));
		return strOfAllRecords;
	}

	@Override
	public int addHistory(String array, String leadId, String userId) {
		String[] str = array.split(",");
for(String messageId : str) {
			String query = "insert into tbl_crm_lead_mailHistory values (?,?,?);";
			try {
				preparedStatement = DBUtility.connection.prepareStatement(query);
				preparedStatement.setString(1, leadId);
				preparedStatement.setString(2, messageId);
				preparedStatement.setString(3, userId);
			} catch(Exception e) {
				ZLog.err("VNC CRM for Zimbra","Error in addHistory Opportunity Helper Class", e);
			}
			operationStatus = dbu.insert(preparedStatement);
		}
		if (operationStatus == 1) {
			return Notification.mail_attach;
		} else {
			return Notification.mail_not_attach;
		}
	}

	@Override
	public String listHistory(String leadId) {
		String query = "select userId, GROUP_CONCAT(messageid SEPARATOR ',') as messageid from tbl_crm_lead_mailHistory where leadId = ? GROUP BY userId;";
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setString(1, leadId);
		} catch(Exception e) {
			ZLog.err("VNC CRM for Zimbra","Error in addHistory Lead Helper Class", e);
		}
		ResultSet rs = dbu.select(preparedStatement);
		List<String> allMailResultList = new ArrayList<String>();
		try {
			while(rs.next()) {
				List<String> result = new ArrayList<String>();
				result = JSPUtil.fetchMailByUser(rs.getString("userId"),rs.getString("messageid"));
for(String mail : result) {
					allMailResultList.add(mail);
				}
			}
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra","Error in Lead Helper Class", e);
		} catch (ServiceException e) {
			ZLog.err("VNC CRM for Zimbra","Error in Lead Helper Class", e);
		} catch (JSONException e) {
			ZLog.err("VNC CRM for Zimbra","Error in Lead Helper Class", e);
		} catch (AuthTokenException e) {
			ZLog.err("VNC CRM for Zimbra","Error in Lead Helper Class", e);
		}
		return allMailResultList.toString();
	}

	@Override
	public String showMail(String userId, String mailId) {
		return null;
	}

	@Override
	public int deleteHistory(String array,String leadId) {
		String query = "delete from tbl_crm_lead_mailHistory where leadId = ? and messageId IN (" + array + ");";
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setString(1, leadId);
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in deleteHistory in OpportunityHelper", e);
		}
		operationStatus = dbu.delete(preparedStatement);
		if (operationStatus == 1) {
			return Notification.mail_detached;
		} else {
			return Notification.mail_not_detached;
		}
	}

	@Override
	public int addAppointment(String array, String leadId, String userId) {
		String[] str = array.split(",");
for(String appointmentId : str) {
			String query = "insert into tbl_crm_lead_calendar values (?,?,?);";
			try {
				preparedStatement = DBUtility.connection.prepareStatement(query);
				preparedStatement.setString(1, leadId);
				preparedStatement.setString(2, appointmentId);
				preparedStatement.setString(3, userId);
			} catch (SQLException e) {
				ZLog.err("VNC CRM for Zimbra", "Error in addAppointment in OpportunityHelper", e);
			}
			operationStatus = dbu.insert(preparedStatement);
		}
		if (operationStatus == 1) {
			return Notification.appt_attach;
		} else {
			return Notification.appt_not_attach;
		}
	}

	@Override
	public String listAppointment(String leadId) {
		String query = "select userId, GROUP_CONCAT(appointmentid SEPARATOR ',') as appointmentid from tbl_crm_lead_calendar where leadId = ? GROUP BY userId;";
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setString(1, leadId);
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in list appointment in LeadHelper", e);
		}
		ResultSet rs = dbu.select(preparedStatement);
		List<String> allAppointmentResultList = new ArrayList<String>();
		try {
			while(rs.next()) {
				List<String> result = new ArrayList<String>();
				result = JSPUtil.fetchAppointmentByUser(rs.getString("userId"),rs.getString("appointmentid"));
for(String appt : result) {
					allAppointmentResultList.add(appt);
				}
			}
		} catch (ServiceException e) {
			ZLog.err("VNC CRM for Zimbra","Error in Lead Helper Class", e);
		} catch (AuthTokenException e) {
			ZLog.err("VNC CRM for Zimbra","Error in Lead Helper Class", e);
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra","Error in Lead Helper Class", e);
		} catch (Exception e) {
			ZLog.err("VNC CRM for Zimbra","Error in Lead Helper Class", e);
		}
		return allAppointmentResultList.toString();
	}

	@Override
	public int deleteAppointment(String array,String leadId) {
		String query = "delete from tbl_crm_lead_calendar where leadId = ? and appointmentId IN (" + array + ");";
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setString(1, leadId);
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in deleteAppointment in OpportunityHelper", e);
		}
		operationStatus = dbu.delete(preparedStatement);
		if (operationStatus == 1) {
			return Notification.appt_detached;
		} else {
			return Notification.appt_not_detached;
		}
	}

	@Override
	public int addTask(String array, String leadId, String userId) {
		String[] str = array.split(",");
for(String taskId : str) {
			String query = "insert into tbl_crm_lead_task values (?,?,?);";
			try {
				preparedStatement = DBUtility.connection.prepareStatement(query);
				preparedStatement.setString(1, leadId);
				preparedStatement.setString(2, taskId);
				preparedStatement.setString(3, userId);
			} catch (SQLException e) {
				ZLog.err("VNC CRM for Zimbra", "Error in addTask in OpportunityHelper", e);
			}
			operationStatus = dbu.insert(preparedStatement);
		}
		if (operationStatus == 1) {
			return Notification.task_attach;
		} else {
			return Notification.task_not_attach;
		}
	}

	@Override
	public String listTask(String leadId) {
		String query = "select userId, GROUP_CONCAT(taskid SEPARATOR ',') as taskid from tbl_crm_lead_task where leadId = ? GROUP BY userId;";
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setString(1, leadId);
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in listTask in LeadHelper", e);
		}
		ResultSet rs = dbu.select(preparedStatement);
		List<String> allTaskResultList = new ArrayList<String>();
		try {
			while(rs.next()) {
				List<String> result = new ArrayList<String>();
				result = JSPUtil.fetchTaskByUser(rs.getString("userId"),rs.getString("taskid"));
for(String task : result) {
					allTaskResultList.add(task);
				}
			}
		} catch (ServiceException e) {
			ZLog.err("VNC CRM for Zimbra","Error in Lead Helper Class", e);
		} catch (AuthTokenException e) {
			ZLog.err("VNC CRM for Zimbra","Error in Lead Helper Class", e);
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra","Error in Lead Helper Class", e);
		} catch (Exception e) {
			ZLog.err("VNC CRM for Zimbra","Error in Lead Helper Class", e);
		}
		return allTaskResultList.toString();
	}

	@Override
	public int deleteTask(String array,String leadId) {
		String query = "delete from tbl_crm_lead_task where leadId = ? and taskId IN (" + array + ");";
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setString(1, leadId);
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in deleteTask in OpportunityHelper", e);
		}
		operationStatus = dbu.delete(preparedStatement);
		if (operationStatus == 1) {
			return Notification.task_detached;
		} else {
			return Notification.task_not_detached;
		}
	}

	@Override
	public int recordCounter() {
		String tableName = "tbl_crm_lead";
		operationStatus = dbu.clientCounter(tableName, 1);
		if(operationStatus >= Limits.max_limit)
			return 2;
		return 0;
	}

	@Override
	public String listSharedItems(String leadId) {
		return null;
	}

	@Override
	public int addSharedItems(String userArray, String accessArray, String leadId) {
		String[] users = userArray.split(",");
		String[] wAccess = accessArray.split(",");
		for(int i = 0; i<users.length; i++) {
			String query = "insert into tbl_crm_share values (?,?,?);";
			try {
				preparedStatement = DBUtility.connection.prepareStatement(query);
				preparedStatement.setString(1, leadId);
				preparedStatement.setString(2, users[i]);
				preparedStatement.setString(3, wAccess[i]);
			} catch (SQLException e) {
				ZLog.err("VNC CRM for Zimbra", "Error in addShareItems in LeadHelper", e);
			}
			operationStatus = dbu.insert(preparedStatement);
		}
		if (operationStatus == 1) {
			return Notification.record_shared;
		} else {
			return Notification.record_not_shared;
		}
	}

	@Override
	public int deleteSharedItems(String leadId) {
		return 0;
	}

	@Override
	public boolean checkWriteAccess(String leadId, String userId) {
		String query = "select writeAccess from tbl_crm_share where leadId = ? AND userId = ?; ";
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setString(1, leadId);
			preparedStatement.setString(2, userId);
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in deleteSharedItems in LeadHelper", e);
		}
		ResultSet rs = dbu.select(preparedStatement);
		try {
			while(rs.next()) {
				return rs.getBoolean("writeAccess");
			}
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra","Error listSharedItems result set in Lead Helper Class", e);
		}
		return true;
	}
}
