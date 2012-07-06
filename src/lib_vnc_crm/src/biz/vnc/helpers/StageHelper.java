package biz.vnc.helpers;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import com.google.gson.Gson;

import biz.vnc.base.AbstractBean;
import biz.vnc.base.InterfaceHelper;
import biz.vnc.beans.StageBean;
import biz.vnc.util.DBUtility;

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
		System.out.println("query ------------->" + query);
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
		// TODO Auto-generated method stub
		return null;
	}


	@Override
	public String getUsers() {
		// TODO Auto-generated method stub
		return null;
	}


	@Override
	public List<AbstractBean> getAllActiveRecords() {
		// TODO Auto-generated method stub
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
		// TODO Auto-generated method stub
		String strOfAllRecords = gson.toJson(getAllActiveRecords());
		return strOfAllRecords;
	}


	@Override
	public String filterView(String array) {
		// TODO Auto-generated method stub
		return null;
	}


	@Override
	public List<AbstractBean> getAllActiveFilterRecords(String str, String field) {
		// TODO Auto-generated method stub
		return null;
	}


	@Override
	public String filterByContact(String Array) {
		// TODO Auto-generated method stub
		return null;
	}


	@Override
	public int addHistory(String array, String leadId) {
		// TODO Auto-generated method stub
		return 0;
	}


	@Override
	public String listHistory(String leadId) {
		// TODO Auto-generated method stub
		return null;
	}


	@Override
	public int addAppointment(String array, String leadId) {
		// TODO Auto-generated method stub
		return 0;
	}


	@Override
	public String listAppointment(String leadId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public int addTask(String array, String leadId) {
		// TODO Auto-generated method stub
		return 0;
	}


	@Override
	public String listTask(String leadId) {
		// TODO Auto-generated method stub
		return null;
	}


	@Override
	public int deleteHistory(String array, String leadId) {
		// TODO Auto-generated method stub
		return 0;
	}


	@Override
	public int deleteAppointment(String array, String leadId) {
		// TODO Auto-generated method stub
		return 0;
	}


	@Override
	public int deleteTask(String array, String leadId) {
		// TODO Auto-generated method stub
		return 0;
	}
}
