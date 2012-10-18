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
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import biz.vnc.zimbra.util.ZLog;

public class ChannelHelper implements InterfaceHelper {

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
		ChannelBean channelBean = (ChannelBean)ab;
		String query = "insert into tbl_crm_channel values (" + channelBean.getChannelId() + ",\"" + channelBean.getChannelName() + "\"," + channelBean.isStatus() + ",\"" + channelBean.getCreateBy() + "\",'" + new Timestamp(System.currentTimeMillis()) + "',\"" + channelBean.getWriteBy() + "\",'" + new Timestamp(System.currentTimeMillis()) + "');" ;
		operationStatus = dbu.insert(query);
		return operationStatus;
	}

	@Override
	public int update(AbstractBean ab) {
		ChannelBean channelBean = (ChannelBean)ab;
		String query = "update tbl_crm_channel set channelName = \"" + channelBean.getChannelName() + "\", status =" + channelBean.isStatus() + ", writeBy = \"" + channelBean.getWriteBy() + "\", writeDate = '" + new Timestamp(System.currentTimeMillis()) + "' " + "where channelId = " + channelBean.getChannelId() + ";" ;
		operationStatus = dbu.update(query);
		return operationStatus;
	}

	@Override
	public int delete(AbstractBean ab) {
		ChannelBean channelBean = (ChannelBean)ab;
		String query = "delete from tbl_crm_channel where channelId =" + channelBean.getChannelId() + ";" ;
		operationStatus = dbu.delete(query);
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
	public List<AbstractBean> getAllRecords() {
		List<AbstractBean> retValue = new ArrayList<AbstractBean>();
		String query = "select * from tbl_crm_channel;" ;
		ResultSet rs = dbu.select(query);
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
		String query = "update tbl_crm_channel set status = false, writeBy = '" + user + "', writeDate = '" + new Timestamp(System.currentTimeMillis()) + "' where channelId IN (" + arrayIds + ");" ;
		operationStatus = dbu.delete(query);
		return operationStatus;
	}

	@Override
	public AbstractBean getRecordById(String id) {
		String query = "select * from tbl_crm_channel where channelId = " + id + ";" ;
		ResultSet rs = dbu.select(query);
		return (getRecordFromResultSet(rs));
	}

	@Override
	public AbstractBean getRecordByName(String name) {
		String query = "select * from tbl_crm_channel where channelName = '" + name + "';" ;
		ResultSet rs = dbu.select(query);
		return (getRecordFromResultSet(rs));
	}

	@Override
	public ChannelBean toBean(String jsonString) {
		try {
			ChannelBean channelBean = new ChannelBean();
			channelBean = gson.fromJson(jsonString, ChannelBean.class);
			return channelBean;
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
		String query = "select * from tbl_crm_channel where status = true;" ;
		ResultSet rs = dbu.select(query);
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
		String tableName = "tbl_crm_channel";
		operationStatus = dbu.adminCounter(tableName);
		if(operationStatus >= Limits.max_limit)
			return 2;
		return 0;
	}
}
