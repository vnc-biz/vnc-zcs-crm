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
import com.google.gson.Gson;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import biz.vnc.zimbra.util.ZLog;

public class CountryHelper implements InterfaceHelper {

	Gson gson = new Gson();
	int operationStatus=0;
	DBUtility dbu = new DBUtility();

	@Override
	public String listView() {
		String strOfAllRecords = gson.toJson(getAllRecords());
		return strOfAllRecords;
	}

	@Override
	public int add(AbstractBean ab) {
		CountryBean countryBean = (CountryBean)ab;
		String query = "insert into tbl_crm_country values (" + countryBean.getCountryId() + ",\"" + countryBean.getCountryName() + "\",\"" + countryBean.getCountryCode() + "\"," + countryBean.isStatus() + ",\"" + countryBean.getCreateBy() + "\",'" + new Timestamp(System.currentTimeMillis()) + "',\"" + countryBean.getWriteBy() + "\",'" + new Timestamp(System.currentTimeMillis()) + "');" ;
		operationStatus = dbu.insert(query);
		return operationStatus;
	}

	@Override
	public int update(AbstractBean ab) {
		CountryBean countryBean = (CountryBean)ab;
		String query = "update tbl_crm_country set countryName = \"" + countryBean.getCountryName() + "\", countryCode =\"" + countryBean.getCountryCode() + "\", status =" + countryBean.isStatus() + ", writeBy = \"" + countryBean.getWriteBy() + "\", writeDate = '" + new Timestamp(System.currentTimeMillis()) + "' " + "where countryId = " + countryBean.getCountryId() + ";" ;
		operationStatus = dbu.update(query);
		return operationStatus;
	}

	@Override
	public int delete(AbstractBean ab) {
		CountryBean countryBean = (CountryBean)ab;
		String query = "delete from tbl_crm_country where countryId =" + countryBean.getCountryId() + ";" ;
		operationStatus = dbu.delete(query);
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
			ZLog.err("VNC CRM for Zimbra","Error in Opportunity Helper Class", e);
		}
		return countryBean;
	}

	@Override
	public List<AbstractBean> getAllRecords() {
		List<AbstractBean> retValue = new ArrayList<AbstractBean>();
		String query = "select * from tbl_crm_country;" ;
		ResultSet rs = dbu.select(query);
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
			ZLog.err("VNC CRM for Zimbra","Error in Opportunity Helper Class", e);
		}
		return retValue;
	}

	@Override
	public int deleteByIds(String arrayIds,String user) {
		String query = "update tbl_crm_country set status = false, writeBy = '" + user + "', writeDate = '" + new Timestamp(System.currentTimeMillis()) + "' where countryId IN (" + arrayIds + ");" ;
		operationStatus = dbu.delete(query);
		return operationStatus;
	}

	@Override
	public AbstractBean getRecordById(String id) {
		String query = "select * from tbl_crm_country where countryId = '" + id + "' " ;
		ResultSet rs = dbu.select(query);
		return (getRecordFromResultSet(rs));
	}

	@Override
	public AbstractBean getRecordByName(String name) {
		String query = "select * from tbl_crm_country where countryName = '" + name + "';" ;
		ResultSet rs = dbu.select(query);
		return (getRecordFromResultSet(rs));
	}

	@Override
	public CountryBean toBean(String jsonString) {

		try {
			CountryBean countryBean  = new CountryBean ();
			countryBean = gson.fromJson(jsonString, CountryBean.class);
			return countryBean;
		} catch(Exception e) {
			System.out.println("Error in toBean() :" + e);
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
	public List<AbstractBean> getAllActiveRecords() {
		List<AbstractBean> retValue = new ArrayList<AbstractBean>();
		String query = "select * from tbl_crm_country where status = true;" ;
		ResultSet rs = dbu.select(query);
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
			ZLog.err("VNC CRM for Zimbra","Error in Opportunity Helper Class", e);
		}
		return retValue;
	}

	@Override
	public String listClientView() {
		String strOfAllRecords = gson.toJson(getAllActiveRecords());
		return strOfAllRecords;
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
		String tableName = "tbl_crm_country";
		operationStatus = dbu.adminCounter(tableName);
		if(operationStatus >= Limits.max_limit)
			return 2;
		return 0;
	}
}
