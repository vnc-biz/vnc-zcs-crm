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
import biz.vnc.beans.SectionBean;
import biz.vnc.util.DBUtility;
import biz.vnc.util.Limits;
import biz.vnc.zimbra.util.ZLog;
import com.google.gson.Gson;
import com.zimbra.cs.account.Account;
import com.zimbra.cs.account.Domain;
import com.zimbra.cs.account.soap.SoapProvisioning;
import com.zimbra.cs.account.soap.SoapProvisioning.Options;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

public class SectionHelper implements InterfaceHelper {

	Gson gson = new Gson();
	int operationStatus=0;
	PreparedStatement preparedStatement;
	DBUtility dbu = new DBUtility();

	@Override
	public String listView(String username) {
		String str = gson.toJson(getAllRecords(username));
		return str;
	}

	@Override
	public int add(AbstractBean ab) {
		SectionBean sectionBean = (SectionBean)ab;
		String query = "insert into tbl_crm_section values (?,?,?,?,?,?,?,?,?,?,?,?);";
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setInt(1, sectionBean.getSectionId());
			preparedStatement.setString(2, sectionBean.getSectionName());
			preparedStatement.setString(3, sectionBean.getSectionCode());
			preparedStatement.setString(4, sectionBean.getSectionManagerId());
			preparedStatement.setString(5, sectionBean.getSectionLeaderId());
			preparedStatement.setString(6, sectionBean.getSectionWatcherId());
			preparedStatement.setString(7, sectionBean.getSectionSalesTeamIds());
			preparedStatement.setBoolean(8, sectionBean.isStatus());
			preparedStatement.setString(9, sectionBean.getCreateBy());
			preparedStatement.setTimestamp(10, new Timestamp(System.currentTimeMillis()));
			preparedStatement.setString(11, sectionBean.getWriteBy());
			preparedStatement.setTimestamp(12, new Timestamp(System.currentTimeMillis()));
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in insert operation in SectionHelper", e);
		}
		operationStatus = dbu.insert(preparedStatement);
		return operationStatus;
	}

	@Override
	public int update(AbstractBean ab) {
		SectionBean sectionBean = (SectionBean)ab;
		String query = "update tbl_crm_section set sectionName = ?, sectionCode = ?, sectionManagerId = ?, sectionLeaderId = ?, sectionWatcherId = ?, sectionSalesTeamIds = ?, status = ?, writeBy = ?, writeDate = ? where sectionId = ?;" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setString(1, sectionBean.getSectionName());
			preparedStatement.setString(2, sectionBean.getSectionCode());
			preparedStatement.setString(3, sectionBean.getSectionManagerId());
			preparedStatement.setString(4, sectionBean.getSectionLeaderId());
			preparedStatement.setString(5, sectionBean.getSectionWatcherId());
			preparedStatement.setString(6, sectionBean.getSectionSalesTeamIds());
			preparedStatement.setBoolean(7, sectionBean.isStatus());
			preparedStatement.setString(8, sectionBean.getWriteBy());
			preparedStatement.setTimestamp(9, new Timestamp(System.currentTimeMillis()));
			preparedStatement.setInt(10, sectionBean.getSectionId());
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in update operation in SectionHelper", e);
		}
		operationStatus = dbu.update(preparedStatement);
		return operationStatus;
	}

	@Override
	public int delete(AbstractBean ab) {
		SectionBean sectionBean = (SectionBean)ab;
		String query = "delete from tbl_crm_section where sectionId = ?;" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setInt(1, sectionBean.getSectionId());
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in delete operation in SectionHelper", e);
		}
		operationStatus = dbu.delete(preparedStatement);
		return operationStatus;
	}

	private SectionBean getRecordFromResultSet(ResultSet rs) {
		SectionBean sectionBean = new SectionBean();
		sectionBean = new SectionBean();
		try {
			while(rs.next()) {
				sectionBean.setSectionId(rs.getInt("sectionId"));
				sectionBean.setSectionName(rs.getString("sectionName"));
				sectionBean.setSectionCode(rs.getString("sectionCode"));
				sectionBean.setSectionManagerId(rs.getString("sectionManagerId"));
				sectionBean.setSectionLeaderId(rs.getString("sectionLeaderId"));
				sectionBean.setSectionWatcherId(rs.getString("sectionWatcherId"));
				sectionBean.setSectionSalesTeamIds(rs.getString("sectionSalesTeamIds"));
				sectionBean.setStatus(rs.getBoolean("status"));
				sectionBean.setCreateBy(rs.getString("createBy"));
				sectionBean.setCreateDate(rs.getString("createDate"));
				sectionBean.setWriteBy(rs.getString("writeBy"));
				sectionBean.setWriteDate(rs.getString("writeDate"));
			}
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra","Error in Section Helper Class", e);
		}
		return sectionBean;
	}

	@Override
	public List<AbstractBean> getAllRecords(String username) {
		List<AbstractBean> retValue = new ArrayList<AbstractBean>();
		String query = "select * from tbl_crm_section;" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in getting all records in SectionHelper", e);
		}
		ResultSet rs = dbu.select(preparedStatement);
		SectionBean sectionBean = null;
		try {
			while(rs.next()) {
				sectionBean = new SectionBean();
				sectionBean.setSectionId(rs.getInt("sectionId"));
				sectionBean.setSectionName(rs.getString("sectionName"));
				sectionBean.setSectionCode(rs.getString("sectionCode"));
				sectionBean.setSectionManagerId(rs.getString("sectionManagerId"));
				sectionBean.setSectionLeaderId(rs.getString("sectionLeaderId"));
				sectionBean.setSectionWatcherId(rs.getString("sectionWatcherId"));
				sectionBean.setSectionSalesTeamIds(rs.getString("sectionSalesTeamIds"));
				sectionBean.setStatus(rs.getBoolean("status"));
				sectionBean.setCreateBy(rs.getString("createBy"));
				sectionBean.setCreateDate(rs.getString("createDate"));
				sectionBean.setWriteBy(rs.getString("writeBy"));
				sectionBean.setWriteDate(rs.getString("writeDate"));
				retValue.add(sectionBean);
			}
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra","Error in Section Helper Class", e);
		}
		return retValue;
	}

	@Override
	public int deleteByIds(String arrayIds,String user) {
		String query = "update tbl_crm_section set status = ?, writeBy = ?, writeDate = ? where sectionId IN (" + arrayIds + ");";
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setBoolean(1, false);
			preparedStatement.setString(2, user);
			preparedStatement.setTimestamp(3, new Timestamp(System.currentTimeMillis()));
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in deleteByIds in SectionHelper", e);
		}
		operationStatus = dbu.delete(preparedStatement);
		return operationStatus;
	}

	@Override
	public AbstractBean getRecordById(String id) {
		String query = "select * from tbl_crm_section where sectionId = ?;" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setString(1, id);
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in recordById in SectionHelper", e);
		}
		ResultSet rs = dbu.select(preparedStatement);
		return (getRecordFromResultSet(rs));
	}

	@Override
	public AbstractBean getRecordByName(String name) {
		String query = "select * from tbl_crm_section where sectionName = ?;" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setString(1, name);
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in recordById in SectionHelper", e);
		}
		ResultSet rs = dbu.select(preparedStatement);
		return (getRecordFromResultSet(rs));
	}

	@Override
	public AbstractBean toBean(String jsonString) {
		try {
			SectionBean sectionBean  = new SectionBean ();
			sectionBean = gson.fromJson(jsonString, SectionBean.class);
			return sectionBean;
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
	public String getUsers () {
		try {
			String rec = "";
			List<String> listOfAccounts = new ArrayList<String>();
			SoapProvisioning soap = null;
			Options options=new Options();
			options.setLocalConfigAuth(true);
			soap = new SoapProvisioning(options);
			List<Domain> allDomains = soap.getAllDomains();
			List allAccounts = null;
			for(int i=0; i<allDomains.size(); i++) {
				Domain singleD = allDomains.get(i);
				allAccounts = singleD.getAllAccounts();
				for(int j=0; j<allAccounts.size(); j++) {
					Account ac = (Account)allAccounts.get(j);
					rec = "{\"value\":\""+ac.getMail().toString()+"\",\"label\":\""+ac.getMail().toString()+"\"}";
					listOfAccounts.add(rec);
				}
			}
			return listOfAccounts.toString();
		} catch(Exception e) {
			ZLog.err("VNC CRM for Zimbra","Error in Section Helper Class", e);
		}
		return null;
	}

	@Override
	public List<AbstractBean> getAllActiveRecords(String username) {
		List<AbstractBean> retValue = new ArrayList<AbstractBean>();
		String query = "select * from tbl_crm_section where status = ?;" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setBoolean(1, true);
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in getting all active records in SectionHelper", e);
		}
		ResultSet rs = dbu.select(preparedStatement);
		SectionBean sectionBean = null;
		try {
			while(rs.next()) {
				sectionBean = new SectionBean();
				sectionBean.setSectionId(rs.getInt("sectionId"));
				sectionBean.setSectionName(rs.getString("sectionName"));
				sectionBean.setSectionCode(rs.getString("sectionCode"));
				sectionBean.setSectionManagerId(rs.getString("sectionManagerId"));
				sectionBean.setSectionLeaderId(rs.getString("sectionLeaderId"));
				sectionBean.setSectionWatcherId(rs.getString("sectionWatcherId"));
				sectionBean.setSectionSalesTeamIds(rs.getString("sectionSalesTeamIds"));
				sectionBean.setStatus(rs.getBoolean("status"));
				sectionBean.setCreateBy(rs.getString("createBy"));
				sectionBean.setCreateDate(rs.getString("createDate"));
				sectionBean.setWriteBy(rs.getString("writeBy"));
				sectionBean.setWriteDate(rs.getString("writeDate"));
				retValue.add(sectionBean);
			}
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra","Error in Section Helper Class", e);
		}
		return retValue;
	}

	@Override
	public String listClientView(String username) {
		String strOfAllRecords = gson.toJson(getAllActiveRecords(username));
		return strOfAllRecords;
	}

	@Override
	public String filterView(String array, String username) {
		return null;
	}

	@Override
	public List<AbstractBean> getAllActiveFilterRecords(String str, String field, String username) {
		return null;
	}

	@Override
	public String filterByContact(String Array, String username) {
		return null;
	}

	@Override
	public int addHistory(String array, String leadId, String userId) {
		return 0;
	}

	@Override
	public String listHistory(String leadId) {
		return null;
	}

	@Override
	public String showMail(String userId, String mailId) {
		return null;
	}

	@Override
	public int addAppointment(String array, String leadId) {
		return 0;
	}

	@Override
	public String listAppointment(String leadId) {
		return null;
	}

	@Override
	public int addTask(String array, String leadId) {
		return 0;
	}

	@Override
	public String listTask(String leadId) {
		return null;
	}

	@Override
	public int deleteHistory(String array, String leadId) {
		return 0;
	}

	@Override
	public int deleteAppointment(String array, String leadId) {
		return 0;
	}

	@Override
	public int deleteTask(String array, String leadId) {
		return 0;
	}

	@Override
	public int recordCounter() {
		String tableName = "tbl_crm_section";
		operationStatus = dbu.adminCounter(tableName);
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
		return 0;
	}

	@Override
	public int deleteSharedItems(String leadId) {
		return 0;
	}
}
