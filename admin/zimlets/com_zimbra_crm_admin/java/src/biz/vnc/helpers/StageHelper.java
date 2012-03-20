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
		String query = "insert into tbl_crm_stage values (" + stageBean.getStageId() + ",\"" + stageBean.getStageName() + "\"," + stageBean.getStageSequence() + "," + stageBean.getStageType() + "," + stageBean.getStageProbability() + ",\"" + stageBean.getStageDescription() + "\"," + stageBean.getStageAuto() + "," + stageBean.isStatus() + ",\"" + stageBean.getCreateBy() + "\"," + stageBean.getCreateDate() + ",\"" + stageBean.getWriteBy() + "\"," + stageBean.getWriteDate() + ");" ;
		System.out.println("query ------------->" + query);
		operationStatus = dbu.insert(query);
		return operationStatus;
	}


	@Override
	public int update(AbstractBean ab) {
		StageBean stageBean = (StageBean)ab;
		String query = "update tbl_crm_stage set stageName = \"" + stageBean.getStageName() + "\", stageSequence =" + stageBean.getStageSequence() + ", stageType =" + stageBean.getStageType() + ", stageProbability =" + stageBean.getStageProbability() + ", stageDescription =\"" + stageBean.getStageDescription() + "\", stageAuto =" + stageBean.getStageAuto() + ", status =" + stageBean.isStatus() + ", writeBy = \"" + stageBean.getWriteBy() + "\", writeDate = '" + new Timestamp(System.currentTimeMillis()) + "' " + "where stageId = " + stageBean.getStageId() + ";" ;
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
			stageBean.setStageId(rs.getInt("stageId"));
			stageBean.setStageName(rs.getString("stageName"));
			stageBean.setStageSequence(rs.getInt("stageSequence"));
			stageBean.setStageType(rs.getInt("stageType"));
			stageBean.setStageProbability(rs.getInt("stageProbability"));
			stageBean.setStageDescription(rs.getString("stageDescription"));
			stageBean.setStageAuto(rs.getBoolean("stageAuto"));
			stageBean.setStatus(rs.getBoolean("status"));
			stageBean.setCreateBy(rs.getString("createBy"));
			stageBean.setCreateDate(rs.getString("createDate"));
			stageBean.setWriteBy(rs.getString("writeBy"));
			stageBean.setWriteDate(rs.getString("writeDate"));
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
			while (rs.next()) {
				stageBean = new StageBean();
				stageBean.setStageId(rs.getInt("stageId"));
				stageBean.setStageName(rs.getString("stageName"));
				stageBean.setStageSequence(rs.getInt("stageSequence"));
				stageBean.setStageType(rs.getInt("stageType"));
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
	public int deleteByIds(String arrayIds) {
		String query = "update tbl_crm_stage set status = false where stageId IN (" + arrayIds + ");" ;
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
		} catch (Exception e) {
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
}
