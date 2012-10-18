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
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import biz.vnc.zimbra.util.ZLog;

public class CompanyHelper implements InterfaceHelper {

	Gson gson = new Gson();
	int operationStatus=0;
	DBUtility dbu = new DBUtility();

	@Override
	public String listClientView() {
		String strOfAllRecords = gson.toJson(getAllActiveRecords());
		return strOfAllRecords;
	}

	@Override
	public String listView() {
		String strOfAllRecords = gson.toJson(getAllRecords());
		return strOfAllRecords;
	}

	@Override
	public int add(AbstractBean ab) {
		CompanyBean companyBean = (CompanyBean)ab;
		String query = "insert into tbl_crm_company values (" + companyBean.getCompanyId() + ",\"" + companyBean.getCompanyName() + "\",\"" + companyBean.getCompanyAddress() + "\",\"" + companyBean.getCompanyPhone() + "\",\"" + companyBean.getCompanyFax() + "\",\"" + companyBean.getCompanyEmail() + "\"," + companyBean.isStatus() + ",\"" + companyBean.getCreateBy() + "\",'" + new Timestamp(System.currentTimeMillis()) + "',\"" + companyBean.getWriteBy() + "\",'" + new Timestamp(System.currentTimeMillis()) + "');" ;
		operationStatus = dbu.insert(query);
		return operationStatus;
	}

	@Override
	public int update(AbstractBean ab) {
		CompanyBean companyBean = (CompanyBean)ab;
		String query = "update tbl_crm_company set companyName = \"" + companyBean.getCompanyName() + "\", companyAddress =\"" + companyBean.getCompanyAddress() + "\", companyPhone =\"" + companyBean.getCompanyPhone() + "\", companyFax =\"" + companyBean.getCompanyFax() + "\", companyEmail =\"" + companyBean.getCompanyEmail() + "\", status =" + companyBean.isStatus() + ", writeBy = \"" + companyBean.getWriteBy() + "\", writeDate = '" + new Timestamp(System.currentTimeMillis()) + "' " + "where companyId = " + companyBean.getCompanyId() + ";" ;
		operationStatus = dbu.update(query);
		return operationStatus;
	}

	@Override
	public int delete(AbstractBean ab) {
		CompanyBean companyBean = (CompanyBean)ab;
		String query = "delete from tbl_crm_company where companyId =" + companyBean.getCompanyId() + ";" ;
		operationStatus = dbu.delete(query);
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
			ZLog.err("VNC CRM for Zimbra","Error in Opportunity Helper Class", e);
		}
		return companyBean;
	}

	@Override
	public int deleteByIds(String arrayIds, String user) {
		String query = "update tbl_crm_company set status = false, writeBy = '" + user + "', writeDate = '" + new Timestamp(System.currentTimeMillis()) + "' where companyId IN (" + arrayIds + ");" ;
		operationStatus = dbu.delete(query);
		return operationStatus;
	}

	@Override
	public List<AbstractBean> getAllRecords() {
		List<AbstractBean> retValue = new ArrayList<AbstractBean>();
		String query = "select * from tbl_crm_company;" ;
		ResultSet rs = dbu.select(query);
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
			ZLog.err("VNC CRM for Zimbra","Error in Opportunity Helper Class", e);
		}
		return retValue;
	}

	@Override
	public AbstractBean getRecordById(String id) {
		String query = "select * from tbl_crm_company where companyId = '" + id + "' " ;
		ResultSet rs = dbu.select(query);
		return (getRecordFromResultSet(rs));
	}

	@Override
	public AbstractBean getRecordByName(String name) {
		String query = "select * from tbl_crm_company where companyName = '" + name + "';" ;
		ResultSet rs = dbu.select(query);
		return (getRecordFromResultSet(rs));
	}

	@Override
	public AbstractBean toBean(String jsonString) {
		try {
			CompanyBean companyBean  = new CompanyBean ();
			companyBean = gson.fromJson(jsonString, CompanyBean.class);
			return companyBean;
		} catch(Exception e) {
			System.out.println("Error in toBean() :" + e);
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
	public List<AbstractBean> getAllActiveRecords() {
		List<AbstractBean> retValue = new ArrayList<AbstractBean>();
		String query = "select * from tbl_crm_company where status = true;" ;
		ResultSet rs = dbu.select(query);
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
			ZLog.err("VNC CRM for Zimbra","Error in Opportunity Helper Class", e);
		}
		return retValue;
	}

	@Override
	public String filterView(String array) {
		return null;
	}

	@Override
	public List<AbstractBean> getAllActiveFilterRecords(String str, String field) {
		return null;
	}

	@Override
	public String filterByContact(String Array) {
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
