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
import biz.vnc.beans.CountryBean;
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

public class CountryHelper implements InterfaceHelper {

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
		CountryBean countryBean = (CountryBean)ab;
		String query = "insert into tbl_crm_country values (?,?,?,?,?,?,?,?);" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setInt(1, countryBean.getCountryId());
			preparedStatement.setString(2, countryBean.getCountryName());
			preparedStatement.setString(3, countryBean.getCountryCode());
			preparedStatement.setBoolean(4, countryBean.isStatus());
			preparedStatement.setString(5, countryBean.getCreateBy());
			preparedStatement.setTimestamp(6, new Timestamp(System.currentTimeMillis()));
			preparedStatement.setString(7, countryBean.getWriteBy());
			preparedStatement.setTimestamp(8, new Timestamp(System.currentTimeMillis()));
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in insert operation in CountryHelper", e);
		}
		operationStatus = dbu.insert(preparedStatement);
		return operationStatus;
	}

	@Override
	public int update(AbstractBean ab) {
		CountryBean countryBean = (CountryBean)ab;
		String query = "update tbl_crm_country set countryName = ?, countryCode = ?, status = ?, writeBy = ?, writeDate = ? where countryId = ?;" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setString(1, countryBean.getCountryName());
			preparedStatement.setString(2, countryBean.getCountryCode());
			preparedStatement.setBoolean(3, countryBean.isStatus());
			preparedStatement.setString(4, countryBean.getWriteBy());
			preparedStatement.setTimestamp(5, new Timestamp(System.currentTimeMillis()));
			preparedStatement.setInt(6, countryBean.getCountryId());
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in update operation in CountryHelper", e);
		}
		operationStatus = dbu.update(preparedStatement);
		return operationStatus;
	}

	@Override
	public int delete(AbstractBean ab) {
		CountryBean countryBean = (CountryBean)ab;
		String query = "delete from tbl_crm_country where countryId = ?;" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setInt(1, countryBean.getCountryId());
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in delete operation in CountryHelper", e);
		}
		operationStatus = dbu.delete(preparedStatement);
		return operationStatus;
	}

	private CountryBean getRecordFromResultSet(ResultSet rs) {
		CountryBean countryBean = new CountryBean();
		try {
			while(rs.next()) {
				countryBean.setCountryId(rs.getInt("countryId"));
				countryBean.setCountryName(rs.getString("countryName"));
				countryBean.setCountryCode(rs.getString("countryCode"));
				countryBean.setStatus(rs.getBoolean("status"));
				countryBean.setCreateBy(rs.getString("createBy"));
				countryBean.setCreateDate(rs.getString("createDate"));
				countryBean.setWriteBy(rs.getString("writeBy"));
				countryBean.setWriteDate(rs.getString("writeDate"));
			}
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra","Error in Country Helper Class", e);
		}
		return countryBean;
	}

	@Override
	public List<AbstractBean> getAllRecords(String username) {
		List<AbstractBean> retValue = new ArrayList<AbstractBean>();
		String query = "select * from tbl_crm_country;" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in getting all records in CountryHelper", e);
		}
		ResultSet rs = dbu.select(preparedStatement);
		CountryBean countryBean = null;
		try {
			while(rs.next()) {
				countryBean = new CountryBean();
				countryBean.setCountryId(rs.getInt("countryId"));
				countryBean.setCountryName(rs.getString("countryName"));
				countryBean.setCountryCode(rs.getString("countryCode"));
				countryBean.setStatus(rs.getBoolean("status"));
				countryBean.setCreateBy(rs.getString("createBy"));
				countryBean.setCreateDate(rs.getString("createDate"));
				countryBean.setWriteBy(rs.getString("writeBy"));
				countryBean.setWriteDate(rs.getString("writeDate"));
				retValue.add(countryBean);
			}
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra","Error in Country Helper Class", e);
		}
		return retValue;
	}

	@Override
	public int deleteByIds(String arrayIds,String user) {
		String query = "update tbl_crm_country set status = ?, writeBy = ?, writeDate = ? where countryId IN (" + arrayIds + ");";
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setBoolean(1, false);
			preparedStatement.setString(2, user);
			preparedStatement.setTimestamp(3, new Timestamp(System.currentTimeMillis()));
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in deleteByIds in CountryHelper", e);
		}
		operationStatus = dbu.delete(preparedStatement);
		return operationStatus;
	}

	@Override
	public AbstractBean getRecordById(String id) {
		String query = "select * from tbl_crm_country where countryId = ?;" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setString(1, id);
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in recordById in CountryHelper", e);
		}
		ResultSet rs = dbu.select(preparedStatement);
		return (getRecordFromResultSet(rs));
	}

	@Override
	public AbstractBean getRecordByName(String name) {
		String query = "select * from tbl_crm_country where countryName = ?;" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setString(1, name);
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in recordByName in CountryHelper", e);
		}
		ResultSet rs = dbu.select(preparedStatement);
		return (getRecordFromResultSet(rs));
	}

	@Override
	public CountryBean toBean(String jsonString) {

		try {
			CountryBean countryBean  = new CountryBean ();
			countryBean = gson.fromJson(jsonString, CountryBean.class);
			return countryBean;
		} catch(Exception e) {
			ZLog.err("VNC CRM for Zimbra","Error in toBean() :",e);
		}
		return null;
	}

	public List<AbstractBean> getStringRecord(AbstractBean ab) {
		List<AbstractBean> retValue = new ArrayList<AbstractBean>();
		retValue.add(ab);
		return retValue;
	}

	@Override
	public String getUsers() {
		return null;
	}

	@Override
	public List<AbstractBean> getAllActiveRecords(String username) {
		List<AbstractBean> retValue = new ArrayList<AbstractBean>();
		String query = "select * from tbl_crm_country where status = ?;" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setBoolean(1, true);
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in getting all active records in CountryHelper", e);
		}
		ResultSet rs = dbu.select(preparedStatement);
		CountryBean countryBean = null;
		try {
			while(rs.next()) {
				countryBean = new CountryBean();
				countryBean.setCountryId(rs.getInt("countryId"));
				countryBean.setCountryName(rs.getString("countryName"));
				countryBean.setCountryCode(rs.getString("countryCode"));
				countryBean.setStatus(rs.getBoolean("status"));
				countryBean.setCreateBy(rs.getString("createBy"));
				countryBean.setCreateDate(rs.getString("createDate"));
				countryBean.setWriteBy(rs.getString("writeBy"));
				countryBean.setWriteDate(rs.getString("writeDate"));
				retValue.add(countryBean);
			}
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra","Error in Country Helper Class", e);
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
		String tableName = "tbl_crm_country";
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
