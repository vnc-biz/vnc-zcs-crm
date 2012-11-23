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
import biz.vnc.beans.CompanyBean;
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

public class CompanyHelper implements InterfaceHelper {

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
		CompanyBean companyBean = (CompanyBean)ab;
		String query = "insert into tbl_crm_company values (?,?,?,?,?,?,?,?,?,?,?);" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setInt(1, companyBean.getCompanyId());
			preparedStatement.setString(2, companyBean.getCompanyName());
			preparedStatement.setString(3, companyBean.getCompanyAddress());
			preparedStatement.setString(4, companyBean.getCompanyPhone());
			preparedStatement.setString(5, companyBean.getCompanyFax());
			preparedStatement.setString(6, companyBean.getCompanyEmail());
			preparedStatement.setBoolean(7, companyBean.isStatus());
			preparedStatement.setString(8, companyBean.getCreateBy());
			preparedStatement.setTimestamp(9, new Timestamp(System.currentTimeMillis()));
			preparedStatement.setString(10, companyBean.getWriteBy());
			preparedStatement.setTimestamp(11, new Timestamp(System.currentTimeMillis()));
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in insert operation in CompanyHelper", e);
		}
		operationStatus = dbu.insert(preparedStatement);
		return operationStatus;
	}

	@Override
	public int update(AbstractBean ab) {
		CompanyBean companyBean = (CompanyBean)ab;
		String query = "update tbl_crm_company set companyName = ?, companyAddress = ?, companyPhone = ?, companyFax = ?, companyEmail = ?, status = ?, writeBy = ?, writeDate = ? where companyId = ?;" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setString(1, companyBean.getCompanyName());
			preparedStatement.setString(2, companyBean.getCompanyAddress());
			preparedStatement.setString(3, companyBean.getCompanyPhone());
			preparedStatement.setString(4, companyBean.getCompanyFax());
			preparedStatement.setString(5, companyBean.getCompanyEmail());
			preparedStatement.setBoolean(6, companyBean.isStatus());
			preparedStatement.setString(7, companyBean.getWriteBy());
			preparedStatement.setTimestamp(8, new Timestamp(System.currentTimeMillis()));
			preparedStatement.setInt(9, companyBean.getCompanyId());
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in update operation in CompanyHelper", e);
		}
		operationStatus = dbu.update(preparedStatement);
		return operationStatus;
	}

	@Override
	public int delete(AbstractBean ab) {
		CompanyBean companyBean = (CompanyBean)ab;
		String query = "delete from tbl_crm_company where companyId = ?;" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setInt(1, companyBean.getCompanyId());
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in delete operation in CompanyHelper", e);
		}
		operationStatus = dbu.delete(preparedStatement);
		return operationStatus;
	}

	private CompanyBean getRecordFromResultSet(ResultSet rs) {
		CompanyBean companyBean = new CompanyBean();
		try {
			while(rs.next()) {
				companyBean.setCompanyId(rs.getInt("companyId"));
				companyBean.setCompanyName(rs.getString("companyName"));
				companyBean.setCompanyAddress(rs.getString("companyAddress"));
				companyBean.setCompanyPhone(rs.getString("companyPhone"));
				companyBean.setCompanyFax(rs.getString("companyFax"));
				companyBean.setCompanyEmail(rs.getString("companyEmail"));
				companyBean.setStatus(rs.getBoolean("status"));
				companyBean.setCreateBy(rs.getString("createBy"));
				companyBean.setCreateDate(rs.getString("createDate"));
				companyBean.setWriteBy(rs.getString("writeBy"));
				companyBean.setWriteDate(rs.getString("writeDate"));
			}
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra","Error in Company Helper Class", e);
		}
		return companyBean;
	}

	@Override
	public int deleteByIds(String arrayIds, String user) {
		String query = "update tbl_crm_company set status = ?, writeBy = ?, writeDate = ? where companyId IN (" + arrayIds + ");";
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setBoolean(1, false);
			preparedStatement.setString(2, user);
			preparedStatement.setTimestamp(3, new Timestamp(System.currentTimeMillis()));
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in deleteByIds in CompanyHelper", e);
		}
		operationStatus = dbu.delete(preparedStatement);
		return operationStatus;
	}

	@Override
	public List<AbstractBean> getAllRecords(String username) {
		List<AbstractBean> retValue = new ArrayList<AbstractBean>();
		String query = "select * from tbl_crm_company;" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in getting all records in CompanyHelper", e);
		}
		ResultSet rs = dbu.select(preparedStatement);
		CompanyBean companyBean = null;
		try {
			while(rs.next()) {
				companyBean = new CompanyBean();
				companyBean.setCompanyId(rs.getInt("companyId"));
				companyBean.setCompanyName(rs.getString("companyName"));
				companyBean.setCompanyAddress(rs.getString("companyAddress"));
				companyBean.setCompanyPhone(rs.getString("companyPhone"));
				companyBean.setCompanyFax(rs.getString("companyFax"));
				companyBean.setCompanyEmail(rs.getString("companyEmail"));
				companyBean.setStatus(rs.getBoolean("status"));
				companyBean.setCreateBy(rs.getString("createBy"));
				companyBean.setCreateDate(rs.getString("createDate"));
				companyBean.setWriteBy(rs.getString("writeBy"));
				companyBean.setWriteDate(rs.getString("writeDate"));
				retValue.add(companyBean);
			}
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra","Error in Company Helper Class", e);
		}
		return retValue;
	}

	@Override
	public AbstractBean getRecordById(String id) {
		String query = "select * from tbl_crm_company where companyId = ?;" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setString(1, id);
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in recordById in CompanyHelper", e);
		}
		ResultSet rs = dbu.select(preparedStatement);
		return (getRecordFromResultSet(rs));
	}

	@Override
	public AbstractBean getRecordByName(String name) {
		String query = "select * from tbl_crm_company where companyName = ?;" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setString(1, name);
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in recordByName in CompanyHelper", e);
		}
		ResultSet rs = dbu.select(preparedStatement);
		return (getRecordFromResultSet(rs));
	}

	@Override
	public AbstractBean toBean(String jsonString) {
		try {
			CompanyBean companyBean  = new CompanyBean ();
			companyBean = gson.fromJson(jsonString, CompanyBean.class);
			return companyBean;
		} catch(Exception e) {
			ZLog.err("VNC CRM for Zimbra","Error in toBean() :",e);
		}
		return null;
	}

	@Override
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
		String query = "select * from tbl_crm_company where status = ?;" ;
		try {
			preparedStatement = DBUtility.connection.prepareStatement(query);
			preparedStatement.setBoolean(1, true);
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra", "Error in getting all active records in CompanyHelper", e);
		}
		ResultSet rs = dbu.select(preparedStatement);
		CompanyBean companyBean = null;
		try {
			while(rs.next()) {
				companyBean = new CompanyBean();
				companyBean.setCompanyId(rs.getInt("companyId"));
				companyBean.setCompanyName(rs.getString("companyName"));
				companyBean.setCompanyAddress(rs.getString("companyAddress"));
				companyBean.setCompanyPhone(rs.getString("companyPhone"));
				companyBean.setCompanyFax(rs.getString("companyFax"));
				companyBean.setCompanyEmail(rs.getString("companyEmail"));
				companyBean.setStatus(rs.getBoolean("status"));
				companyBean.setCreateBy(rs.getString("createBy"));
				companyBean.setCreateDate(rs.getString("createDate"));
				companyBean.setWriteBy(rs.getString("writeBy"));
				companyBean.setWriteDate(rs.getString("writeDate"));
				retValue.add(companyBean);
			}
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra","Error in Company Helper Class", e);
		}
		return retValue;
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
		String tableName = "tbl_crm_company";
		operationStatus = dbu.adminCounter(tableName);
		if(operationStatus >= Limits.max_limit)
			return 2;
		return 0;
	}
}
