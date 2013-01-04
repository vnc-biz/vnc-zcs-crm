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
import biz.vnc.beans.StateBean;
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

public class StateHelper implements InterfaceHelper {

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
		StateBean stateBean = (StateBean)ab;
		String query = "insert into tbl_crm_state values (?,?,?,?,?,?,?,?,?);" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setInt(1, stateBean.getStateId());
			preparedStatement.setString(2, stateBean.getStateName());
			preparedStatement.setString(3, stateBean.getStateCode());
			preparedStatement.setInt(4, stateBean.getCountryId());
			preparedStatement.setBoolean(5, stateBean.isStatus());
			preparedStatement.setString(6, stateBean.getCreateBy());
			preparedStatement.setTimestamp(7, new Timestamp(System.currentTimeMillis()));
			preparedStatement.setString(8, stateBean.getWriteBy());
			preparedStatement.setTimestamp(9, new Timestamp(System.currentTimeMillis()));
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in insert operation in StateHelper", e);
		}
		operationStatus = dbu.insert(preparedStatement);
		return operationStatus;
	}

	@Override
	public int update(AbstractBean ab) {
		StateBean stateBean = (StateBean)ab;
		String query = "update tbl_crm_state set stateName = ?, stateCode = ?, countryId = ?, status = ?, writeBy = ?, writeDate = ? where stateId = ?;" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setString(1, stateBean.getStateName());
			preparedStatement.setString(2, stateBean.getStateCode());
			preparedStatement.setInt(3, stateBean.getCountryId());
			preparedStatement.setBoolean(4, stateBean.isStatus());
			preparedStatement.setString(5, stateBean.getWriteBy());
			preparedStatement.setTimestamp(6, new Timestamp(System.currentTimeMillis()));
			preparedStatement.setInt(7, stateBean.getStateId());
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in update operation in StateHelper", e);
		}
		operationStatus = dbu.update(preparedStatement);
		return operationStatus;
	}

	@Override
	public int delete(AbstractBean ab) {
		StateBean stateBean = (StateBean)ab;
		String query = "delete from tbl_crm_state where stateId = ?;" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setInt(1, stateBean.getStateId());
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in delete operation in StateHelper", e);
		}
		operationStatus = dbu.delete(preparedStatement);
		return operationStatus;
	}

	private StateBean getRecordFromResultSet(ResultSet rs) {
		StateBean stateBean = new StateBean();
		stateBean = new StateBean();
		try {
			while(rs.next()) {
				stateBean.setStateId(rs.getInt("stateId"));
				stateBean.setStateName(rs.getString("stateName"));
				stateBean.setStateCode(rs.getString("stateCode"));
				stateBean.setCountryId(rs.getString("countryId"));
				stateBean.setStatus(rs.getBoolean("status"));
				stateBean.setCreateBy(rs.getString("createBy"));
				stateBean.setCreateDate(rs.getString("createDate"));
				stateBean.setWriteBy(rs.getString("writeBy"));
				stateBean.setWriteDate(rs.getString("writeDate"));
			}
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra","Error in State Helper Class", e);
		}
		return stateBean;
	}

	@Override
	public List<AbstractBean> getAllRecords(String username) {
		List<AbstractBean> retValue = new ArrayList<AbstractBean>();
		String query = "select stateId, stateName, stateCode, c.countryName, s.status, s.createBy, s.createDate, s.writeBy, s.writeDate from tbl_crm_state s join tbl_crm_country c where s.countryId = c.countryId;" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in getting all records in StateHelper", e);
		}
		ResultSet rs = dbu.select(preparedStatement);
		StateBean stateBean = null;
		try {
			while(rs.next()) {
				stateBean = new StateBean();
				stateBean.setStateId(rs.getInt("stateId"));
				stateBean.setStateName(rs.getString("stateName"));
				stateBean.setStateCode(rs.getString("stateCode"));
				stateBean.setStatus(rs.getBoolean("status"));
				stateBean.setCountryId(rs.getString("countryName"));
				stateBean.setCreateBy(rs.getString("createBy"));
				stateBean.setCreateDate(rs.getString("createDate"));
				stateBean.setWriteBy(rs.getString("writeBy"));
				stateBean.setWriteDate(rs.getString("writeDate"));
				retValue.add(stateBean);
			}
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra","Error in State Helper Class", e);
		}
		return retValue;
	}

	@Override
	public int deleteByIds(String arrayIds,String user) {
		String query = "update tbl_crm_state set status = ?, writeBy = ?, writeDate = ? where stateId IN (" + arrayIds + ");";
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setBoolean(1, false);
			preparedStatement.setString(2, user);
			preparedStatement.setTimestamp(3, new Timestamp(System.currentTimeMillis()));
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in deleteByIds in StateHelper", e);
		}
		operationStatus = dbu.delete(preparedStatement);
		return operationStatus;
	}

	@Override
	public AbstractBean getRecordById(String id) {
		String query = "select * from tbl_crm_state where stateId = ?;" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setString(1, id);
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in recordById in StateHelper", e);
		}
		ResultSet rs = dbu.select(preparedStatement);
		return (getRecordFromResultSet(rs));
	}

	@Override
	public AbstractBean getRecordByName(String name) {
		String query = "select * from tbl_crm_state where stateName = ?;" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setString(1, name);
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in recordById in StateHelper", e);
		}
		ResultSet rs = dbu.select(preparedStatement);
		return (getRecordFromResultSet(rs));
	}

	@Override
	public StateBean toBean(String jsonString) {
		try {
			StateBean stateBean  = new StateBean ();
			stateBean = gson.fromJson(jsonString, StateBean.class);
			return stateBean;
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
		String query = "select stateId, stateName, stateCode, c.countryName, s.status, s.createBy, s.createDate, s.writeBy, s.writeDate from tbl_crm_state s join tbl_crm_country c where s.status = ? AND s.countryId = c.countryId;" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setBoolean(1, true);
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in getting all active records in StateHelper", e);
		}
		ResultSet rs = dbu.select(preparedStatement);
		StateBean stateBean = null;
		try {
			while(rs.next()) {
				stateBean = new StateBean();
				stateBean.setStateId(rs.getInt("stateId"));
				stateBean.setStateName(rs.getString("stateName"));
				stateBean.setStateCode(rs.getString("stateCode"));
				stateBean.setStatus(rs.getBoolean("status"));
				stateBean.setCountryId(rs.getString("countryName"));
				stateBean.setCreateBy(rs.getString("createBy"));
				stateBean.setCreateDate(rs.getString("createDate"));
				stateBean.setWriteBy(rs.getString("writeBy"));
				stateBean.setWriteDate(rs.getString("writeDate"));
				retValue.add(stateBean);
			}
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra","Error in State Helper Class", e);
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
		String tableName = "tbl_crm_state";
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
