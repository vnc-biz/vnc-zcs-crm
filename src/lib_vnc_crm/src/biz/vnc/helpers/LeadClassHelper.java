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
import biz.vnc.beans.LeadClassBean;
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

public class LeadClassHelper  implements InterfaceHelper {

	Gson gson = new Gson();
	int operationStatus=0;
	PreparedStatement preparedStatement;
	DBUtility dbu = new DBUtility();

	@Override
	public String listClientView(String username) {
		String strOfAllRecords = gson.toJson(getAllActiveRecords(username));
		return strOfAllRecords;
	}

	@Override
	public String listView(String username) {
		String strOfAllRecords = gson.toJson(getAllRecords(username));
		return strOfAllRecords;
	}

	@Override
	public int add(AbstractBean ab) {
		LeadClassBean leadClassBean = (LeadClassBean)ab;
		String query = "insert into tbl_crm_leadClass values (?,?,?,?,?,?,?);" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setInt(1, leadClassBean.getLeadClassId());
			preparedStatement.setString(2, leadClassBean.getLeadClassName());
			preparedStatement.setBoolean(3, leadClassBean.isStatus());
			preparedStatement.setString(4, leadClassBean.getCreateBy());
			preparedStatement.setTimestamp(5, new Timestamp(System.currentTimeMillis()));
			preparedStatement.setString(6, leadClassBean.getWriteBy());
			preparedStatement.setTimestamp(7, new Timestamp(System.currentTimeMillis()));
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in insert operation in LeadClassHelper", e);
		}
		operationStatus = dbu.insert(preparedStatement);
		return operationStatus;
	}

	@Override
	public int update(AbstractBean ab) {
		LeadClassBean leadClassBean = (LeadClassBean)ab;
		String query = "update tbl_crm_leadClass set leadClassName = ?, status = ?, writeBy = ?, writeDate = ? where leadClassId = ?;" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setString(1, leadClassBean.getLeadClassName());
			preparedStatement.setBoolean(2, leadClassBean.isStatus());
			preparedStatement.setString(3, leadClassBean.getWriteBy());
			preparedStatement.setTimestamp(4, new Timestamp(System.currentTimeMillis()));
			preparedStatement.setInt(5, leadClassBean.getLeadClassId());
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in update operation in LeadClassHelper", e);
		}
		operationStatus = dbu.update(preparedStatement);
		return operationStatus;
	}

	@Override
	public int delete(AbstractBean ab) {
		LeadClassBean leadClassBean = (LeadClassBean)ab;
		String query = "delete from tbl_crm_leadClass where leadClassId = ?;" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setInt(1, leadClassBean.getLeadClassId());
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in delete operation in LeadClassHelper", e);
		}
		operationStatus = dbu.delete(preparedStatement);
		return operationStatus;
	}

	private LeadClassBean getRecordFromResultSet(ResultSet rs) {
		LeadClassBean leadClassBean = new LeadClassBean();
		try {
			while(rs.next()) {
				leadClassBean.setLeadClassId(rs.getInt("leadClassId"));
				leadClassBean.setLeadClassName(rs.getString("leadClassName"));
				leadClassBean.setStatus(rs.getBoolean("status"));
				leadClassBean.setCreateBy(rs.getString("createBy"));
				leadClassBean.setCreateDate(rs.getString("createDate"));
				leadClassBean.setWriteBy(rs.getString("writeBy"));
				leadClassBean.setWriteDate(rs.getString("writeDate"));
			}
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra","Error in LeadClass Helper Class", e);
		}
		return leadClassBean;
	}

	@Override
	public int deleteByIds(String arrayIds, String user) {
		String query = "update tbl_crm_leadClass set status = ?, writeBy = ?, writeDate = ? where leadClassId IN (" + arrayIds + ");";
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setBoolean(1, false);
			preparedStatement.setString(2, user);
			preparedStatement.setTimestamp(3, new Timestamp(System.currentTimeMillis()));
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in deleteByIds in LeadClassHelper", e);
		}
		operationStatus = dbu.delete(preparedStatement);
		return operationStatus;
	}

	@Override
	public List<AbstractBean> getAllRecords(String username) {
		List<AbstractBean> retValue = new ArrayList<AbstractBean>();
		String query = "select * from tbl_crm_leadClass;" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in getting all records in LeadClassHelper", e);
		}
		ResultSet rs = dbu.select(preparedStatement);
		LeadClassBean leadClassBean = null;
		try {
			while(rs.next()) {
				leadClassBean = new LeadClassBean();
				leadClassBean.setLeadClassId(rs.getInt("leadClassId"));
				leadClassBean.setLeadClassName(rs.getString("leadClassName"));
				leadClassBean.setStatus(rs.getBoolean("status"));
				leadClassBean.setCreateBy(rs.getString("createBy"));
				leadClassBean.setCreateDate(rs.getString("createDate"));
				leadClassBean.setWriteBy(rs.getString("writeBy"));
				leadClassBean.setWriteDate(rs.getString("writeDate"));
				retValue.add(leadClassBean);
			}
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra","Error in LeadClass Helper Class", e);
		}
		return retValue;
	}

	@Override
	public AbstractBean getRecordById(String id) {
		String query = "select * from tbl_crm_leadClass where leadClassId = ? and status = ?;" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setString(1, id);
			preparedStatement.setBoolean(2, true);
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in recordById in LeadClassHelper", e);
		}
		ResultSet rs = dbu.select(preparedStatement);
		return (getRecordFromResultSet(rs));
	}

	@Override
	public AbstractBean getRecordByName(String name) {
		String query = "select * from tbl_crm_leadClass where leadClassName = ?;" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setString(1, name);
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in recordByName in LeadClassHelper", e);
		}
		ResultSet rs = dbu.select(preparedStatement);
		return (getRecordFromResultSet(rs));
	}

	@Override
	public AbstractBean toBean(String jsonString) {
		try {
			LeadClassBean leadClassBean = new LeadClassBean();
			leadClassBean = gson.fromJson(jsonString, LeadClassBean.class);
			return leadClassBean;
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
		String query = "select * from tbl_crm_leadClass where status = ?;" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setBoolean(1, true);
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in getting all active records in LeadClassHelper", e);
		}
		ResultSet rs = dbu.select(preparedStatement);
		LeadClassBean leadClassBean = null;
		try {
			while(rs.next()) {
				leadClassBean = new LeadClassBean();
				leadClassBean.setLeadClassId(rs.getInt("leadClassId"));
				leadClassBean.setLeadClassName(rs.getString("leadClassName"));
				leadClassBean.setStatus(rs.getBoolean("status"));
				leadClassBean.setCreateBy(rs.getString("createBy"));
				leadClassBean.setCreateDate(rs.getString("createDate"));
				leadClassBean.setWriteBy(rs.getString("writeBy"));
				leadClassBean.setWriteDate(rs.getString("writeDate"));
				retValue.add(leadClassBean);
			}
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra","Error in LeadClass Helper Class", e);
		}
		return retValue;
	}

	@Override
	public List<AbstractBean> getAllActiveFilterRecords(String str, String field, String username) {
		return null;
	}

	@Override
	public String filterView(String array, String username) {
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
	public int deleteHistory(String array, String leadId) {
		return 0;
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
	public int deleteAppointment(String array, String leadId) {
		return 0;
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
	public int deleteTask(String array, String leadId) {
		return 0;
	}

	@Override
	public int recordCounter() {
		String tableName = "tbl_crm_leadClass";
		operationStatus = dbu.adminCounter(tableName);
		if(operationStatus >= Limits.max_limit)
			return 2;
		return 0;
	}

}
