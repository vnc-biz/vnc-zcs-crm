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
import com.google.gson.Gson;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

public class StateHelper implements InterfaceHelper {

	Gson gson = new Gson();
	int operationStatus=0;
	DBUtility dbu = new DBUtility();

	@Override
	public String listView() {
		String str = gson.toJson(getAllRecords());
		return str;
	}

	@Override
	public int add(AbstractBean ab) {
		StateBean stateBean = (StateBean)ab;
		String query = "insert into tbl_crm_state values (" +stateBean.getStateId() + ",\"" + stateBean.getStateName() + "\",\"" + stateBean.getStateCode() + "\"," + stateBean.getCountryId() + "," + stateBean.isStatus() + ",\"" + stateBean.getCreateBy() + "\",'" + new Timestamp(System.currentTimeMillis()) + "',\"" + stateBean.getWriteBy() + "\",'" + new Timestamp(System.currentTimeMillis()) + "');" ;
		operationStatus = dbu.insert(query);
		return operationStatus;
	}

	@Override
	public int update(AbstractBean ab) {
		StateBean stateBean = (StateBean)ab;
		String query = "update tbl_crm_state set stateName =\"" + stateBean.getStateName() + "\", stateCode =\"" + stateBean.getStateCode() + "\", countryId =" + stateBean.getCountryId() + ", status =" + stateBean.isStatus() + ", writeBy = \"" + stateBean.getWriteBy() + "\", writeDate = '" + new Timestamp(System.currentTimeMillis()) + "' " + "where stateId = " + stateBean.getStateId() + ";" ;
		operationStatus = dbu.update(query);
		return operationStatus;
	}

	@Override
	public int delete(AbstractBean ab) {
		StateBean stateBean = (StateBean)ab;
		String query = "delete from tbl_crm_state where stateId =" + stateBean.getStateId() + ";" ;
		operationStatus = dbu.delete(query);
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
			e.printStackTrace();
		}
		return stateBean;
	}

	@Override
	public List<AbstractBean> getAllRecords() {
		List<AbstractBean> retValue = new ArrayList<AbstractBean>();
		String query = "select stateId, stateName, stateCode, c.countryName, s.status, s.createBy, s.createDate, s.writeBy, s.writeDate from tbl_crm_state s join tbl_crm_country c where s.countryId = c.countryId;" ;
		ResultSet rs = dbu.select(query);
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
			e.printStackTrace();
		}
		return retValue;
	}

	@Override
	public int deleteByIds(String arrayIds,String user) {
		String query = "update tbl_crm_state set status = false, writeBy = '" + user + "', writeDate = '" + new Timestamp(System.currentTimeMillis()) + "' where stateId IN (" + arrayIds + ");" ;
		operationStatus = dbu.delete(query);
		return operationStatus;
	}

	@Override
	public AbstractBean getRecordById(String id) {
		String query = "select * from tbl_crm_state where stateId = " + id + ";" ;
		ResultSet rs = dbu.select(query);
		return (getRecordFromResultSet(rs));
	}

	@Override
	public AbstractBean getRecordByName(String name) {
		String query = "select * from tbl_crm_state where stateName = '" + name + "';" ;
		ResultSet rs = dbu.select(query);
		return (getRecordFromResultSet(rs));
	}

	@Override
	public StateBean toBean(String jsonString) {
		try {
			StateBean stateBean  = new StateBean ();
			stateBean = gson.fromJson(jsonString, StateBean.class);
			return stateBean;
		} catch(Exception e) {
			System.out.println("Error in toBean() :" + e);
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
	public List<AbstractBean> getAllActiveRecords() {
		List<AbstractBean> retValue = new ArrayList<AbstractBean>();
		String query = "select stateId, stateName, stateCode, c.countryName, s.status, s.createBy, s.createDate, s.writeBy, s.writeDate from tbl_crm_state s join tbl_crm_country c where s.status = true AND s.countryId = c.countryId;" ;
		ResultSet rs = dbu.select(query);
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
			e.printStackTrace();
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
		String tableName = "tbl_crm_state";
		operationStatus = dbu.adminCounter(tableName);
		if(operationStatus >= Limits.max_limit)
			return 2;
		return 0;
	}
}
