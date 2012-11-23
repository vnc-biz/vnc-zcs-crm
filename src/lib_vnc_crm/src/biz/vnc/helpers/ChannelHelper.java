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
import biz.vnc.beans.ChannelBean;
import biz.vnc.util.DBUtility;
import biz.vnc.util.Limits;
import com.google.gson.Gson;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import biz.vnc.zimbra.util.ZLog;

public class ChannelHelper implements InterfaceHelper {

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
		ChannelBean channelBean = (ChannelBean)ab;
		String query = "insert into tbl_crm_channel values (?,?,?,?,?,?,?);" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setInt(1, channelBean.getChannelId());
			preparedStatement.setString(2, channelBean.getChannelName());
			preparedStatement.setBoolean(3, channelBean.isStatus());
			preparedStatement.setString(4, channelBean.getCreateBy());
			preparedStatement.setTimestamp(5, new Timestamp(System.currentTimeMillis()));
			preparedStatement.setString(6, channelBean.getWriteBy());
			preparedStatement.setTimestamp(7, new Timestamp(System.currentTimeMillis()));
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in insert operation in ChannelHelper", e);
		}
		operationStatus = dbu.insert(preparedStatement);
		return operationStatus;
	}

	@Override
	public int update(AbstractBean ab) {
		ChannelBean channelBean = (ChannelBean)ab;
		String query = "update tbl_crm_channel set channelName = ?, status = ?, writeBy = ?, writeDate = ? where channelId = ?;" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setString(1, channelBean.getChannelName());
			preparedStatement.setBoolean(2, channelBean.isStatus());
			preparedStatement.setString(3, channelBean.getWriteBy());
			preparedStatement.setTimestamp(4, new Timestamp(System.currentTimeMillis()));
			preparedStatement.setInt(5, channelBean.getChannelId());
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in update operation in ChannelHelper", e);
		}
		operationStatus = dbu.update(preparedStatement);
		return operationStatus;
	}

	@Override
	public int delete(AbstractBean ab) {
		ChannelBean channelBean = (ChannelBean)ab;
		String query = "delete from tbl_crm_channel where channelId = ?;" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setInt(1, channelBean.getChannelId());
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in delete operation in ChannelHelper", e);
		}
		operationStatus = dbu.delete(preparedStatement);
		return operationStatus;
	}

	private ChannelBean getRecordFromResultSet(ResultSet rs) {
		ChannelBean channelBean = new ChannelBean();
		try {
			while(rs.next()) {
				channelBean.setChannelId(rs.getInt("channelId"));
				channelBean.setChannelName(rs.getString("channelName"));
				channelBean.setStatus(rs.getBoolean("status"));
				channelBean.setCreateBy(rs.getString("createBy"));
				channelBean.setCreateDate(rs.getString("createDate"));
				channelBean.setWriteBy(rs.getString("writeBy"));
				channelBean.setWriteDate(rs.getString("writeDate"));
			}
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra","Error in Channel Helper Class", e);
		}
		return channelBean;
	}

	@Override
	public List<AbstractBean> getAllRecords(String username) {
		List<AbstractBean> retValue = new ArrayList<AbstractBean>();
		String query = "select * from tbl_crm_channel;" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in getting all records in ChannelHelper", e);
		}
		ResultSet rs = dbu.select(preparedStatement);
		ChannelBean channelBean = null;
		try {
			while(rs.next()) {
				channelBean = new ChannelBean();
				channelBean.setChannelId(rs.getInt("channelId"));
				channelBean.setChannelName(rs.getString("channelName"));
				channelBean.setStatus(rs.getBoolean("status"));
				channelBean.setCreateBy(rs.getString("createBy"));
				channelBean.setCreateDate(rs.getString("createDate"));
				channelBean.setWriteBy(rs.getString("writeBy"));
				channelBean.setWriteDate(rs.getString("writeDate"));
				retValue.add(channelBean);
			}
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra","Error in Channel Helper Class", e);
		}
		return retValue;
	}

	@Override
	public int deleteByIds(String arrayIds,String user) {
		String query = "update tbl_crm_channel set status = ?, writeBy = ?, writeDate = ? where channelId IN (" + arrayIds + ");";
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setBoolean(1, false);
			preparedStatement.setString(2, user);
			preparedStatement.setTimestamp(3, new Timestamp(System.currentTimeMillis()));
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in deleteByIds in ChannelHelper", e);
		}
		operationStatus = dbu.delete(preparedStatement);
		return operationStatus;
	}

	@Override
	public AbstractBean getRecordById(String id) {
		String query = "select * from tbl_crm_channel where channelId = ?;" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setString(1, id);
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in recordById in ChannelHelper", e);
		}
		ResultSet rs = dbu.select(preparedStatement);
		return (getRecordFromResultSet(rs));
	}

	@Override
	public AbstractBean getRecordByName(String name) {
		String query = "select * from tbl_crm_channel where channelName = ?;" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setString(1, name);
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in recordByName in ChannelHelper", e);
		}
		ResultSet rs = dbu.select(preparedStatement);
		return (getRecordFromResultSet(rs));
	}

	@Override
	public ChannelBean toBean(String jsonString) {
		try {
			ChannelBean channelBean = new ChannelBean();
			channelBean = gson.fromJson(jsonString, ChannelBean.class);
			return channelBean;
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
		String query = "select * from tbl_crm_channel where status = ?;" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setBoolean(1, true);
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in getting all active records in ChannelHelper", e);
		}
		ResultSet rs = dbu.select(preparedStatement);
		ChannelBean channelBean = null;
		try {
			while(rs.next()) {
				channelBean = new ChannelBean();
				channelBean.setChannelId(rs.getInt("channelId"));
				channelBean.setChannelName(rs.getString("channelName"));
				channelBean.setStatus(rs.getBoolean("status"));
				channelBean.setCreateBy(rs.getString("createBy"));
				channelBean.setCreateDate(rs.getString("createDate"));
				channelBean.setWriteBy(rs.getString("writeBy"));
				channelBean.setWriteDate(rs.getString("writeDate"));
				retValue.add(channelBean);
			}
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra","Error in Channel Helper Class", e);
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
	public int addHistory(String array, String leadId) {
		return 0;
	}

	@Override
	public String listHistory(String leadId) {
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
		String tableName = "tbl_crm_channel";
		operationStatus = dbu.adminCounter(tableName);
		if(operationStatus >= Limits.max_limit)
			return 2;
		return 0;
	}
}
