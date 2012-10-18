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

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import com.google.gson.Gson;
import biz.vnc.base.AbstractBean;
import biz.vnc.base.InterfaceHelper;
import biz.vnc.beans.LeadClassBean;
import biz.vnc.util.DBUtility;
import biz.vnc.util.Limits;
import biz.vnc.zimbra.util.ZLog;

public class LeadClassHelper  implements InterfaceHelper {

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
		LeadClassBean leadClassBean = (LeadClassBean)ab;
		String query = "insert into tbl_crm_leadClass values (" + leadClassBean.getLeadClassId() + ",\"" + leadClassBean.getLeadClassName() + "\"," + leadClassBean.isStatus() + ",\"" + leadClassBean.getCreateBy() + "\",'" + new Timestamp(System.currentTimeMillis()) + "',\"" + leadClassBean.getWriteBy() + "\",'" + new Timestamp(System.currentTimeMillis()) + "');" ;
		operationStatus = dbu.insert(query);
		return operationStatus;
	}

	@Override
	public int update(AbstractBean ab) {
		LeadClassBean leadClassBean = (LeadClassBean)ab;
		String query = "update tbl_crm_leadClass set leadClassName = \"" + leadClassBean.getLeadClassName() + "\", status =" + leadClassBean.isStatus() + ", writeBy = \"" + leadClassBean.getWriteBy() + "\", writeDate = '" + new Timestamp(System.currentTimeMillis()) + "' " + "where leadClassId = " + leadClassBean.getLeadClassId() + ";" ;
		operationStatus = dbu.update(query);
		return operationStatus;
	}

	@Override
	public int delete(AbstractBean ab) {
		LeadClassBean leadClassBean = (LeadClassBean)ab;
		String query = "delete from tbl_crm_leadClass where leadClassId =" + leadClassBean.getLeadClassId() + ";" ;
		operationStatus = dbu.delete(query);
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
			ZLog.err("VNC CRM for Zimbra","Error in Opportunity Helper Class", e);
		}
		return leadClassBean;
	}

	@Override
	public int deleteByIds(String arrayIds, String user) {
		String query = "update tbl_crm_leadClass set status = false, writeBy = '" + user + "', writeDate = '" + new Timestamp(System.currentTimeMillis()) + "' where leadClassId IN (" + arrayIds + ");" ;
		operationStatus = dbu.delete(query);
		return operationStatus;
	}

	@Override
	public List<AbstractBean> getAllRecords() {
		List<AbstractBean> retValue = new ArrayList<AbstractBean>();
		String query = "select * from tbl_crm_leadClass;" ;
		ResultSet rs = dbu.select(query);
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
			ZLog.err("VNC CRM for Zimbra","Error in Opportunity Helper Class", e);
		}
		return retValue;
	}

	@Override
	public AbstractBean getRecordById(String id) {
		String query = "select * from tbl_crm_leadClass where leadClassId = " + id + ";" ;
		ResultSet rs = dbu.select(query);
		return (getRecordFromResultSet(rs));
	}

	@Override
	public AbstractBean getRecordByName(String name) {
		String query = "select * from tbl_crm_leadClass where leadClassName = '" + name + "';" ;
		ResultSet rs = dbu.select(query);
		return (getRecordFromResultSet(rs));
	}

	@Override
	public AbstractBean toBean(String jsonString) {
		try {
			LeadClassBean leadClassBean = new LeadClassBean();
			leadClassBean = gson.fromJson(jsonString, LeadClassBean.class);
			return leadClassBean;
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
		String query = "select * from tbl_crm_leadClass where status = true;" ;
		ResultSet rs = dbu.select(query);
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
			ZLog.err("VNC CRM for Zimbra","Error in Opportunity Helper Class", e);
		}
		return retValue;
	}

	@Override
	public List<AbstractBean> getAllActiveFilterRecords(String str, String field) {
		return null;
	}

	@Override
	public String filterView(String array) {
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
	public int deleteHistory(String array, String leadId) {
		return 0;
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
	public int deleteAppointment(String array, String leadId) {
		return 0;
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
