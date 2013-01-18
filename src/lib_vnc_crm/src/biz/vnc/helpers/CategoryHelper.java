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

public class CategoryHelper implements InterfaceHelper {

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
		CategoryBean categoryBean = (CategoryBean)ab;
		String query = "insert into tbl_crm_category values (?,?,?,?,?,?,?,?);";
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setInt(1, categoryBean.getCategoryId());
			preparedStatement.setString(2, categoryBean.getCategoryName());
			preparedStatement.setInt(3, categoryBean.getSectionId());
			preparedStatement.setBoolean(4, categoryBean.isStatus());
			preparedStatement.setString(5, categoryBean.getCreateBy());
			preparedStatement.setTimestamp(6, new Timestamp(System.currentTimeMillis()));
			preparedStatement.setString(7, categoryBean.getWriteBy());
			preparedStatement.setTimestamp(8, new Timestamp(System.currentTimeMillis()));
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in insert operation in CategoryHelper", e);
		}
		operationStatus = dbu.insert(preparedStatement);
		return operationStatus;
	}

	@Override
	public int update(AbstractBean ab) {
		CategoryBean categoryBean = (CategoryBean)ab;
		String query = "update tbl_crm_category set categoryName = ?, sectionId = ?, status = ?, writeBy = ?, writeDate = ? where categoryId = ?;" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setString(1, categoryBean.getCategoryName());
			preparedStatement.setInt(2, categoryBean.getSectionId());
			preparedStatement.setBoolean(3, categoryBean.isStatus());
			preparedStatement.setString(4, categoryBean.getWriteBy());
			preparedStatement.setTimestamp(5, new Timestamp(System.currentTimeMillis()));
			preparedStatement.setInt(6, categoryBean.getCategoryId());
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in update operation in CategoryHelper", e);
		}
		operationStatus = dbu.update(preparedStatement);
		return operationStatus;
	}

	@Override
	public int delete(AbstractBean ab) {
		CategoryBean categoryBean = (CategoryBean)ab;
		String query = "delete from tbl_crm_category where categoryId = ?;" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setInt(1, categoryBean.getCategoryId());
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in delete operation in CategoryHelper", e);
		}
		operationStatus = dbu.delete(preparedStatement);
		return operationStatus;
	}

	private CategoryBean getRecordFromResultSet(ResultSet rs) {
		CategoryBean categoryBean = new CategoryBean();
		try {
			while(rs.next()) {
				categoryBean.setCategoryId(rs.getInt("categoryId"));
				categoryBean.setCategoryName(rs.getString("categoryName"));
				categoryBean.setSectionId(rs.getString("sectionId"));
				categoryBean.setStatus(rs.getBoolean("status"));
				categoryBean.setCreateBy(rs.getString("createBy"));
				categoryBean.setCreateDate(rs.getString("createDate"));
				categoryBean.setWriteBy(rs.getString("writeBy"));
				categoryBean.setWriteDate(rs.getString("writeDate"));
			}
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra","Error in Category Helper Class", e);
		}
		return categoryBean;
	}

	@Override
	public List<AbstractBean> getAllRecords(String username) {
		List<AbstractBean> retValue = new ArrayList<AbstractBean>();
		String query = "select categoryId,categoryName,s.sectionName,c.status,c.createBy, c.createDate, c.writeBy, c.writeDate from tbl_crm_category c join tbl_crm_section s where c.sectionId = s.sectionId;" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in getting all records in CategoryHelper", e);
		}
		ResultSet rs = dbu.select(preparedStatement);
		CategoryBean categoryBean = null;
		try {
			while(rs.next()) {
				categoryBean = new CategoryBean();
				categoryBean.setCategoryId(rs.getInt("categoryId"));
				categoryBean.setCategoryName(rs.getString("categoryName"));
				categoryBean.setSectionId(rs.getString("sectionName"));
				categoryBean.setStatus(rs.getBoolean("status"));
				categoryBean.setCreateBy(rs.getString("createBy"));
				categoryBean.setCreateDate(rs.getString("createDate"));
				categoryBean.setWriteBy(rs.getString("writeBy"));
				categoryBean.setWriteDate(rs.getString("writeDate"));
				retValue.add(categoryBean);
			}
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra","Error in Category Helper Class", e);
		}
		return retValue;
	}

	@Override
	public int deleteByIds(String arrayIds,String user) {
		String query = "update tbl_crm_category set status = ?, writeBy = ?, writeDate = ? where categoryId IN (" + arrayIds + ");";
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setBoolean(1, false);
			preparedStatement.setString(2, user);
			preparedStatement.setTimestamp(3, new Timestamp(System.currentTimeMillis()));
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in deleteByIds in CategoryHelper", e);
		}
		operationStatus = dbu.delete(preparedStatement);
		return operationStatus;
	}

	@Override
	public AbstractBean getRecordById(String id) {
		String query = "select * from tbl_crm_category where categoryId = ?;" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setString(1, id);
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in recordById in CategoryHelper", e);
		}
		ResultSet rs = dbu.select(preparedStatement);
		return (getRecordFromResultSet(rs));
	}

	@Override
	public AbstractBean getRecordByName(String name) {
		String query = "select * from tbl_crm_category where categoryName = ?;" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setString(1, name);
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in recordByName in CategoryHelper", e);
		}
		ResultSet rs = dbu.select(preparedStatement);
		return (getRecordFromResultSet(rs));
	}

	@Override
	public CategoryBean toBean(String jsonString) {
		try {
			CategoryBean categoryBean  = new CategoryBean ();
			categoryBean = gson.fromJson(jsonString, CategoryBean.class);
			return categoryBean;
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
		String query = "select categoryId,categoryName,s.sectionName,c.status,c.createBy, c.createDate, c.writeBy, c.writeDate from tbl_crm_category c join tbl_crm_section s where c.status = ? AND c.sectionId = s.sectionId;" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setBoolean(1, true);
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in getting all active records in CategoryHelper", e);
		}
		ResultSet rs = dbu.select(preparedStatement);
		CategoryBean categoryBean = null;
		try {
			while(rs.next()) {
				categoryBean = new CategoryBean();
				categoryBean.setCategoryId(rs.getInt("categoryId"));
				categoryBean.setCategoryName(rs.getString("categoryName"));
				categoryBean.setSectionId(rs.getString("sectionName"));
				categoryBean.setStatus(rs.getBoolean("status"));
				categoryBean.setCreateBy(rs.getString("createBy"));
				categoryBean.setCreateDate(rs.getString("createDate"));
				categoryBean.setWriteBy(rs.getString("writeBy"));
				categoryBean.setWriteDate(rs.getString("writeDate"));
				retValue.add(categoryBean);
			}
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra","Error in Category Helper Class", e);
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
		String tableName = "tbl_crm_category";
		operationStatus = dbu.adminCounter(tableName);
		if(operationStatus >= Limits.max_limit)
			return 2;
		return 0;
	}
}
