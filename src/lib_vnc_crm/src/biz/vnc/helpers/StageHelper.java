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
import biz.vnc.beans.StageBean;
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

public class StageHelper implements InterfaceHelper {

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
		StageBean stageBean = (StageBean)ab;
		String query = "insert into tbl_crm_stage values (?,?,?,?,?,?,?,?,?,?,?,?,?);" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setInt(1, stageBean.getStageId());
			preparedStatement.setString(2, stageBean.getStageName());
			preparedStatement.setInt(3, stageBean.getStageSequence());
			preparedStatement.setInt(4, stageBean.getStageType());
			preparedStatement.setString(5, stageBean.getStageState());
			preparedStatement.setFloat(6, stageBean.getStageProbability());
			preparedStatement.setString(7, stageBean.getStageDescription());
			preparedStatement.setBoolean(8, stageBean.getStageAuto());
			preparedStatement.setBoolean(9, stageBean.isStatus());
			preparedStatement.setString(10, stageBean.getCreateBy());
			preparedStatement.setTimestamp(11, new Timestamp(System.currentTimeMillis()));
			preparedStatement.setString(12, stageBean.getWriteBy());
			preparedStatement.setTimestamp(13, new Timestamp(System.currentTimeMillis()));
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in insert operation in StageHelper", e);
		}
		operationStatus = dbu.insert(preparedStatement);
		return operationStatus;
	}

	@Override
	public int update(AbstractBean ab) {
		StageBean stageBean = (StageBean)ab;
		String query = "update tbl_crm_stage set stageName = ?, stageSequence = ?, stageType = ?, stageState = ?, stageProbability = ?, stageDescription = ?, stageAuto = ?, status = ?, writeBy = ?, writeDate = ? where stageId = ?;" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setString(1, stageBean.getStageName());
			preparedStatement.setInt(2, stageBean.getStageSequence());
			preparedStatement.setInt(3, stageBean.getStageType());
			preparedStatement.setString(4, stageBean.getStageState());
			preparedStatement.setFloat(5, stageBean.getStageProbability());
			preparedStatement.setString(6, stageBean.getStageDescription());
			preparedStatement.setBoolean(7, stageBean.getStageAuto());
			preparedStatement.setBoolean(8, stageBean.isStatus());
			preparedStatement.setString(9, stageBean.getWriteBy());
			preparedStatement.setTimestamp(10, new Timestamp(System.currentTimeMillis()));
			preparedStatement.setInt(11, stageBean.getStageId());
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in update operation in StageHelper", e);
		}
		operationStatus = dbu.update(preparedStatement);
		return operationStatus;
	}

	@Override
	public int delete(AbstractBean ab) {
		StageBean stageBean = (StageBean)ab;
		String query = "delete from tbl_crm_stage where stageId = ?;" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setInt(1, stageBean.getStageId());
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in delete operation in StageHelper", e);
		}
		operationStatus = dbu.delete(preparedStatement);
		return operationStatus;
	}

	private StageBean getRecordFromResultSet(ResultSet rs) {
		StageBean stageBean = new StageBean();
		try {
			while(rs.next()) {
				stageBean.setStageId(rs.getInt("stageId"));
				stageBean.setStageName(rs.getString("stageName"));
				stageBean.setStageSequence(rs.getInt("stageSequence"));
				stageBean.setStageType(rs.getInt("stageType"));
				stageBean.setStageState(rs.getString("stageState"));
				stageBean.setStageProbability(rs.getInt("stageProbability"));
				stageBean.setStageDescription(rs.getString("stageDescription"));
				stageBean.setStageAuto(rs.getBoolean("stageAuto"));
				stageBean.setStatus(rs.getBoolean("status"));
				stageBean.setCreateBy(rs.getString("createBy"));
				stageBean.setCreateDate(rs.getString("createDate"));
				stageBean.setWriteBy(rs.getString("writeBy"));
				stageBean.setWriteDate(rs.getString("writeDate"));
			}
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra","Error in Stage Helper Class", e);
		}
		return stageBean;
	}

	@Override
	public List<AbstractBean> getAllRecords(String username) {
		List<AbstractBean> retValue = new ArrayList<AbstractBean>();
		String query = "select * from tbl_crm_stage;" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in getting all records in StageHelper", e);
		}
		ResultSet rs = dbu.select(preparedStatement);
		StageBean stageBean = null;
		try {
			while(rs.next()) {
				stageBean = new StageBean();
				stageBean.setStageId(rs.getInt("stageId"));
				stageBean.setStageName(rs.getString("stageName"));
				stageBean.setStageSequence(rs.getInt("stageSequence"));
				stageBean.setStageType(rs.getInt("stageType"));
				stageBean.setStageState(rs.getString("stageState"));
				stageBean.setStageProbability(rs.getInt("stageProbability"));
				stageBean.setStageDescription(rs.getString("stageDescription"));
				stageBean.setStageAuto(rs.getBoolean("stageAuto"));
				stageBean.setStatus(rs.getBoolean("status"));
				stageBean.setCreateBy(rs.getString("createBy"));
				stageBean.setCreateDate(rs.getString("createDate"));
				stageBean.setWriteBy(rs.getString("writeBy"));
				stageBean.setWriteDate(rs.getString("writeDate"));
				retValue.add(stageBean);
			}
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra","Error in Stage Helper Class", e);
		}
		return retValue;
	}

	@Override
	public int deleteByIds(String arrayIds, String user) {
		String query = "update tbl_crm_stage set status = ?, writeBy = ?, writeDate = ? where stageId IN (" + arrayIds + ");";
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setBoolean(1, false);
			preparedStatement.setString(2, user);
			preparedStatement.setTimestamp(3, new Timestamp(System.currentTimeMillis()));
			preparedStatement.setString(4, arrayIds);
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in deleteByIds in StageHelper", e);
		}
		operationStatus = dbu.delete(preparedStatement);
		return operationStatus;
	}

	@Override
	public AbstractBean getRecordById(String id) {
		String query = "select * from tbl_crm_stage where stageId = ?;" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setString(1, id);
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in recordById in StageHelper", e);
		}
		ResultSet rs = dbu.select(preparedStatement);
		return (getRecordFromResultSet(rs));
	}

	@Override
	public AbstractBean getRecordByName(String name) {
		String query = "select * from tbl_crm_stage where stageName = ?;" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setString(1, name);
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in recordById in StageHelper", e);
		}
		ResultSet rs = dbu.select(preparedStatement);
		return (getRecordFromResultSet(rs));
	}

	@Override
	public StageBean toBean(String jsonString) {
		try {
			StageBean stageBean  = new StageBean ();
			stageBean = gson.fromJson(jsonString, StageBean.class);
			return stageBean;
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
		String query = "select * from tbl_crm_stage where status = ?;" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setBoolean(1, true);
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in getting all active records in StageHelper", e);
		}
		ResultSet rs = dbu.select(preparedStatement);
		StageBean stageBean = null;
		try {
			while(rs.next()) {
				stageBean = new StageBean();
				stageBean.setStageId(rs.getInt("stageId"));
				stageBean.setStageName(rs.getString("stageName"));
				stageBean.setStageSequence(rs.getInt("stageSequence"));
				stageBean.setStageType(rs.getInt("stageType"));
				stageBean.setStageState(rs.getString("stageState"));
				stageBean.setStageProbability(rs.getInt("stageProbability"));
				stageBean.setStageDescription(rs.getString("stageDescription"));
				stageBean.setStageAuto(rs.getBoolean("stageAuto"));
				stageBean.setStatus(rs.getBoolean("status"));
				stageBean.setCreateBy(rs.getString("createBy"));
				stageBean.setCreateDate(rs.getString("createDate"));
				stageBean.setWriteBy(rs.getString("writeBy"));
				stageBean.setWriteDate(rs.getString("writeDate"));
				retValue.add(stageBean);
			}
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra","Error in Stage Helper Class", e);
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
		String tableName = "tbl_crm_stage";
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
