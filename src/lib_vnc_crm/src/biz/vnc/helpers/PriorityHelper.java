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
import biz.vnc.beans.PriorityBean;
import biz.vnc.util.DBUtility;
import biz.vnc.util.Limits;
import biz.vnc.zimbra.util.ZLog;
import com.google.gson.Gson;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

public class PriorityHelper implements InterfaceHelper {

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
		PriorityBean priorityBean = (PriorityBean)ab;
		String query = "insert into tbl_crm_priority values (?,?,?,?,?,?,?,?);" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setInt(1, priorityBean.getPriorityId());
			preparedStatement.setString(2, priorityBean.getPriorityName());
			preparedStatement.setString(3, priorityBean.getPriorityCode());
			preparedStatement.setBoolean(4, priorityBean.isStatus());
			preparedStatement.setString(5, priorityBean.getCreateBy());
			preparedStatement.setTimestamp(6, new Timestamp(System.currentTimeMillis()));
			preparedStatement.setString(7, priorityBean.getWriteBy());
			preparedStatement.setTimestamp(8, new Timestamp(System.currentTimeMillis()));
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in insert operation in PriorityHelper", e);
		}
		operationStatus = dbu.insert(preparedStatement);
		return operationStatus;
	}

	@Override
	public int update(AbstractBean ab) {
		PriorityBean priorityBean = (PriorityBean)ab;
		String query = "update tbl_crm_priority set priorityName = ?, priorityCode = ?, status = ?, writeBy = ?, writeDate = ? where priorityId = ?;" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setString(1, priorityBean.getPriorityName());
			preparedStatement.setString(2, priorityBean.getPriorityCode());
			preparedStatement.setBoolean(3, priorityBean.isStatus());
			preparedStatement.setString(4, priorityBean.getWriteBy());
			preparedStatement.setTimestamp(5, new Timestamp(System.currentTimeMillis()));
			preparedStatement.setInt(6, priorityBean.getPriorityId());
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in update operation in PriorityHelper", e);
		}
		operationStatus = dbu.update(preparedStatement);
		return operationStatus;
	}

	@Override
	public int delete(AbstractBean ab) {
		PriorityBean priorityBean = (PriorityBean)ab;
		String query = "delete from tbl_crm_priority where priorityId = ?;" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setInt(1, priorityBean.getPriorityId());
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in delete operation in PriorityHelper", e);
		}
		operationStatus = dbu.delete(preparedStatement);
		return operationStatus;
	}

	private PriorityBean getRecordFromResultSet(ResultSet rs) {
		PriorityBean priorityBean = new PriorityBean();
		try {
			while(rs.next()) {
				priorityBean.setPriorityId(rs.getInt("priorityId"));
				priorityBean.setPriorityName(rs.getString("priorityName"));
				priorityBean.setPriorityCode(rs.getString("priorityCode"));
				priorityBean.setStatus(rs.getBoolean("status"));
				priorityBean.setCreateBy(rs.getString("createBy"));
				priorityBean.setCreateDate(rs.getString("createDate"));
				priorityBean.setWriteBy(rs.getString("writeBy"));
				priorityBean.setWriteDate(rs.getString("writeDate"));
			}
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra","Error in Priority Helper Class", e);
		}
		return priorityBean;
	}

	@Override
	public List<AbstractBean> getAllRecords(String username) {
		List<AbstractBean> retValue = new ArrayList<AbstractBean>();
		String query = "select * from tbl_crm_priority;" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in getting all records in PriorityHelper", e);
		}
		ResultSet rs = dbu.select(preparedStatement);
		PriorityBean priorityBean = null;
		try {
			while(rs.next()) {
				priorityBean = new PriorityBean();
				priorityBean.setPriorityId(rs.getInt("priorityId"));
				priorityBean.setPriorityName(rs.getString("priorityName"));
				priorityBean.setPriorityCode(rs.getString("priorityCode"));
				priorityBean.setStatus(rs.getBoolean("status"));
				priorityBean.setCreateBy(rs.getString("createBy"));
				priorityBean.setCreateDate(rs.getString("createDate"));
				priorityBean.setWriteBy(rs.getString("writeBy"));
				priorityBean.setWriteDate(rs.getString("writeDate"));
				retValue.add(priorityBean);
			}
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra","Error in Priority Helper Class", e);
		}
		return retValue;
	}

	@Override
	public int deleteByIds(String arrayIds,String user) {
		String query = "update tbl_crm_priority set status = ?, writeBy = ?, writeDate = ? where priorityId IN (" + arrayIds + ");";
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setBoolean(1, false);
			preparedStatement.setString(2, user);
			preparedStatement.setTimestamp(3, new Timestamp(System.currentTimeMillis()));
			preparedStatement.setString(4, arrayIds);
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in deleteByIds in PriorityHelper", e);
		}
		operationStatus = dbu.delete(preparedStatement);
		return operationStatus;
	}

	@Override
	public AbstractBean getRecordById(String id) {
		String query = "select * from tbl_crm_priority where priorityId = ? and status = ?;" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setString(1, id);
			preparedStatement.setBoolean(2, true);
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in recordById in PriorityHelper", e);
		}
		ResultSet rs = dbu.select(preparedStatement);
		return (getRecordFromResultSet(rs));
	}

	@Override
	public AbstractBean getRecordByName(String name) {
		String query = "select * from tbl_crm_priority where priorityName = ?;" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setString(1, name);
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in recordById in PriorityHelper", e);
		}
		ResultSet rs = dbu.select(preparedStatement);
		return (getRecordFromResultSet(rs));
	}

	@Override
	public PriorityBean toBean(String jsonString) {
		try {
			PriorityBean priorityBean = new PriorityBean();
			priorityBean = gson.fromJson(jsonString, PriorityBean.class);
			return priorityBean;
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
		String query = "select * from tbl_crm_priority where status = ?;" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setBoolean(1, true);
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in getting all active records in PriorityHelper", e);
		}
		ResultSet rs = dbu.select(preparedStatement);
		PriorityBean priorityBean = null;
		try {
			while(rs.next()) {
				priorityBean = new PriorityBean();
				priorityBean.setPriorityId(rs.getInt("priorityId"));
				priorityBean.setPriorityName(rs.getString("priorityName"));
				priorityBean.setPriorityCode(rs.getString("priorityCode"));
				priorityBean.setStatus(rs.getBoolean("status"));
				priorityBean.setCreateBy(rs.getString("createBy"));
				priorityBean.setCreateDate(rs.getString("createDate"));
				priorityBean.setWriteBy(rs.getString("writeBy"));
				priorityBean.setWriteDate(rs.getString("writeDate"));
				retValue.add(priorityBean);
			}
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra","Error in Priority Helper Class", e);
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
	public int addAppointment(String array, String leadId, String userId) {
		return 0;
	}

	@Override
	public String listAppointment(String leadId) {
		return null;
	}

	@Override
	public int addTask(String array, String leadId, String userId) {
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
		String tableName = "tbl_crm_priority";
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

	@Override
	public boolean checkWriteAccess(String leadId, String userId) {
		return false;
	}
}
