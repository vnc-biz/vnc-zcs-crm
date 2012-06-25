package biz.vnc.helpers;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import com.google.gson.Gson;

import biz.vnc.base.AbstractBean;
import biz.vnc.base.InterfaceHelper;
import biz.vnc.beans.PriorityBean;
import biz.vnc.util.DBUtility;

public class PriorityHelper implements InterfaceHelper {

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

		PriorityBean priorityBean = (PriorityBean)ab;
		String query = "insert into tbl_crm_priority values (" + priorityBean.getPriorityId() + ",\"" + priorityBean.getPriorityName() + "\",\"" + priorityBean.getPriorityCode() + "\"," + priorityBean.isStatus() + ",\"" + priorityBean.getCreateBy() + "\",'" + new Timestamp(System.currentTimeMillis()) + "',\"" + priorityBean.getWriteBy() + "\",'" + new Timestamp(System.currentTimeMillis()) + "');" ;
		operationStatus = dbu.insert(query);
		return operationStatus;
	}


	@Override
	public int update(AbstractBean ab) {
		PriorityBean priorityBean = (PriorityBean)ab;
		String query = "update tbl_crm_priority set priorityName =\"" + priorityBean.getPriorityName() + "\", priorityCode =\"" + priorityBean.getPriorityCode() + "\", status =" + priorityBean.isStatus() + ", writeBy = \"" + priorityBean.getWriteBy() + "\", writeDate = '" + new Timestamp(System.currentTimeMillis()) + "' " + "where priorityId = " + priorityBean.getPriorityId() + ";" ;
		operationStatus = dbu.update(query);
		return operationStatus;
	}


	@Override
	public int delete(AbstractBean ab) {
		PriorityBean priorityBean = (PriorityBean)ab;
		String query = "delete from tbl_crm_priority where priorityId =" + priorityBean.getPriorityId() + ";" ;
		operationStatus = dbu.delete(query);
		return operationStatus;
	}

	private PriorityBean getRecordFromResultSet(ResultSet rs) {
		PriorityBean priorityBean = new PriorityBean();
		try {
			while(rs.next()) {
				priorityBean.setPriorityId(rs.getInt("priorityId"));
				priorityBean.setPriorityName(rs.getString("priorityName"));
				priorityBean.setPriorityCode(rs.getString("priorityCode"));
				priorityBean.setStatus(rs.getBoolean("status"));
				priorityBean.setCreateBy(rs.getString("createBy"));
				priorityBean.setCreateDate(rs.getString("createDate"));
				priorityBean.setWriteBy(rs.getString("writeBy"));
				priorityBean.setWriteDate(rs.getString("writeDate"));
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return priorityBean;
	}

	@Override
	public List<AbstractBean> getAllRecords() {
		List<AbstractBean> retValue = new ArrayList<AbstractBean>();
		String query = "select * from tbl_crm_priority;" ;
		ResultSet rs = dbu.select(query);
		PriorityBean priorityBean = null;
		try {
			while(rs.next()) {
				priorityBean = new PriorityBean();
				priorityBean.setPriorityId(rs.getInt("priorityId"));
				priorityBean.setPriorityName(rs.getString("priorityName"));
				priorityBean.setPriorityCode(rs.getString("priorityCode"));
				priorityBean.setStatus(rs.getBoolean("status"));
				priorityBean.setCreateBy(rs.getString("createBy"));
				priorityBean.setCreateDate(rs.getString("createDate"));
				priorityBean.setWriteBy(rs.getString("writeBy"));
				priorityBean.setWriteDate(rs.getString("writeDate"));

				retValue.add(priorityBean);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return retValue;
	}

	@Override
	public int deleteByIds(String arrayIds,String user) {
		String query = "update tbl_crm_priority set status = false, writeBy = '" + user + "', writeDate = '" + new Timestamp(System.currentTimeMillis()) + "' where priorityId IN (" + arrayIds + ");" ;
		operationStatus = dbu.delete(query);
		return operationStatus;
	}


	@Override
	public AbstractBean getRecordById(String id) {
		String query = "select * from tbl_crm_priority where priorityId = " + id + ";" ;
		ResultSet rs = dbu.select(query);
		return (getRecordFromResultSet(rs));
	}

	@Override
	public AbstractBean getRecordByName(String name) {
		String query = "select * from tbl_crm_priority where priorityName = '" + name + "';" ;
		ResultSet rs = dbu.select(query);
		return (getRecordFromResultSet(rs));
	}

	@Override
	public PriorityBean toBean(String jsonString) {

		try {
			PriorityBean priorityBean = new PriorityBean();

			priorityBean = gson.fromJson(jsonString, PriorityBean.class);
			return priorityBean;
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
		String query = "select * from tbl_crm_priority where status = true;" ;
		ResultSet rs = dbu.select(query);
		PriorityBean priorityBean = null;
		try {
			while(rs.next()) {
				priorityBean = new PriorityBean();
				priorityBean.setPriorityId(rs.getInt("priorityId"));
				priorityBean.setPriorityName(rs.getString("priorityName"));
				priorityBean.setPriorityCode(rs.getString("priorityCode"));
				priorityBean.setStatus(rs.getBoolean("status"));
				priorityBean.setCreateBy(rs.getString("createBy"));
				priorityBean.setCreateDate(rs.getString("createDate"));
				priorityBean.setWriteBy(rs.getString("writeBy"));
				priorityBean.setWriteDate(rs.getString("writeDate"));

				retValue.add(priorityBean);
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
	public int deleteHistory(String array) {
		// TODO Auto-generated method stub
		return 0;
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
	public int deleteAppointment(String array) {
		// TODO Auto-generated method stub
		return 0;
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
	public int deleteTask(String array) {
		// TODO Auto-generated method stub
		return 0;
	}

}
