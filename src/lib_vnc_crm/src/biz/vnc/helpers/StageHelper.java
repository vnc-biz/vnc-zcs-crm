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
import com.google.gson.Gson;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

public class StageHelper implements InterfaceHelper {

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
		StageBean stageBean = (StageBean)ab;
		String query = "insert into tbl_crm_stage values (" + stageBean.getStageId() + ",\"" + stageBean.getStageName() + "\"," + stageBean.getStageSequence() + "," + stageBean.getStageType() + ",'" + stageBean.getStageState() + "'," + stageBean.getStageProbability() + ",\"" + stageBean.getStageDescription() + "\"," + stageBean.getStageAuto() + "," + stageBean.isStatus() + ",\"" + stageBean.getCreateBy() + "\",'" + new Timestamp(System.currentTimeMillis()) + "',\"" + stageBean.getWriteBy() + "\",'" + new Timestamp(System.currentTimeMillis()) + "');" ;
		operationStatus = dbu.insert(query);
		return operationStatus;
	}

	@Override
	public int update(AbstractBean ab) {
		StageBean stageBean = (StageBean)ab;
		String query = "update tbl_crm_stage set stageName = \"" + stageBean.getStageName() + "\", stageSequence =" + stageBean.getStageSequence() + ", stageType =" + stageBean.getStageType() + ", stageState = '" + stageBean.getStageState() + "', stageProbability =" + stageBean.getStageProbability() + ", stageDescription =\"" + stageBean.getStageDescription() + "\", stageAuto =" + stageBean.getStageAuto() + ", status =" + stageBean.isStatus() + ", writeBy = \"" + stageBean.getWriteBy() + "\", writeDate = '" + new Timestamp(System.currentTimeMillis()) + "' " + "where stageId = " + stageBean.getStageId() + ";" ;
		operationStatus = dbu.update(query);
		return operationStatus;
	}

	@Override
	public int delete(AbstractBean ab) {
		StageBean stageBean = (StageBean)ab;
		String query = "delete from tbl_crm_stage where stageId =" + stageBean.getStageId() + ";" ;
		operationStatus = dbu.delete(query);
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
			e.printStackTrace();
		}
		return stageBean;
	}

	@Override
	public List<AbstractBean> getAllRecords() {
		List<AbstractBean> retValue = new ArrayList<AbstractBean>();
		String query = "select * from tbl_crm_stage;" ;
		ResultSet rs = dbu.select(query);
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
			e.printStackTrace();
		}
		return retValue;
	}

	@Override
	public int deleteByIds(String arrayIds, String user) {
		String query = "update tbl_crm_stage set status = false, writeBy = '" + user + "', writeDate = '" + new Timestamp(System.currentTimeMillis()) + "' where stageId IN (" + arrayIds + ");" ;
		operationStatus = dbu.delete(query);
		return operationStatus;
	}

	@Override
	public AbstractBean getRecordById(String id) {
		String query = "select * from tbl_crm_stage where stageId = " + id + ";" ;
		ResultSet rs = dbu.select(query);
		return (getRecordFromResultSet(rs));
	}

	@Override
	public AbstractBean getRecordByName(String name) {
		String query = "select * from tbl_crm_stage where stageName = '" + name + "';" ;
		ResultSet rs = dbu.select(query);
		return (getRecordFromResultSet(rs));
	}

	@Override
	public StageBean toBean(String jsonString) {
		try {
			StageBean stageBean  = new StageBean ();
			stageBean = gson.fromJson(jsonString, StageBean.class);
			return stageBean;
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
		String query = "select * from tbl_crm_stage where status = true;" ;
		ResultSet rs = dbu.select(query);
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
		String tableName = "tbl_crm_stage";
		operationStatus = dbu.adminCounter(tableName);
		if(operationStatus >= Limits.max_limit)
			return 2;
		return 0;
	}
}
