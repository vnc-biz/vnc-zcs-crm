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

public class LeadClassHelper  implements InterfaceHelper {

	Gson gson = new Gson();
	int operationStatus=0;
	DBUtility dbu = new DBUtility();

	@Override
	public String listClientView() {
		// TODO Auto-generated method stub
		String strOfAllRecords = gson.toJson(getAllActiveRecords());
		return strOfAllRecords;
	}

	@Override
	public String listView() {
		// TODO Auto-generated method stub
		String strOfAllRecords = gson.toJson(getAllRecords());
		return strOfAllRecords;
	}

	@Override
	public int add(AbstractBean ab) {
		// TODO Auto-generated method stub
		LeadClassBean leadClassBean = (LeadClassBean)ab;
		String query = "insert into tbl_crm_leadClass values (" + leadClassBean.getLeadClassId() + ",\"" + leadClassBean.getLeadClassName() + "\"," + leadClassBean.isStatus() + ",\"" + leadClassBean.getCreateBy() + "\",'" + new Timestamp(System.currentTimeMillis()) + "',\"" + leadClassBean.getWriteBy() + "\",'" + new Timestamp(System.currentTimeMillis()) + "');" ;
		operationStatus = dbu.insert(query);
		return operationStatus;
	}

	@Override
	public int update(AbstractBean ab) {
		// TODO Auto-generated method stub
		LeadClassBean leadClassBean = (LeadClassBean)ab;
		String query = "update tbl_crm_leadClass set leadClassName = \"" + leadClassBean.getLeadClassName() + "\", status =" + leadClassBean.isStatus() + ", writeBy = \"" + leadClassBean.getWriteBy() + "\", writeDate = '" + new Timestamp(System.currentTimeMillis()) + "' " + "where leadClassId = " + leadClassBean.getLeadClassId() + ";" ;
		operationStatus = dbu.update(query);
		return operationStatus;
	}

	@Override
	public int delete(AbstractBean ab) {
		// TODO Auto-generated method stub
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
			e.printStackTrace();
		}
		return leadClassBean;
	}

	@Override
	public int deleteByIds(String arrayIds, String user) {
		// TODO Auto-generated method stub
		String query = "update tbl_crm_leadClass set status = false, writeBy = '" + user + "', writeDate = '" + new Timestamp(System.currentTimeMillis()) + "' where leadClassId IN (" + arrayIds + ");" ;
		operationStatus = dbu.delete(query);
		return operationStatus;
	}

	@Override
	public List<AbstractBean> getAllRecords() {
		// TODO Auto-generated method stub
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
			e.printStackTrace();
		}
		return retValue;
	}

	@Override
	public AbstractBean getRecordById(String id) {
		// TODO Auto-generated method stub
		String query = "select * from tbl_crm_leadClass where leadClassId = " + id + ";" ;
		ResultSet rs = dbu.select(query);
		return (getRecordFromResultSet(rs));
	}

	@Override
	public AbstractBean getRecordByName(String name) {
		// TODO Auto-generated method stub
		String query = "select * from tbl_crm_leadClass where leadClassName = '" + name + "';" ;
		ResultSet rs = dbu.select(query);
		return (getRecordFromResultSet(rs));
	}

	@Override
	public AbstractBean toBean(String jsonString) {
		// TODO Auto-generated method stub
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
			e.printStackTrace();
		}
		return retValue;
	}

	@Override
	public List<AbstractBean> getAllActiveFilterRecords(String str, String field) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String filterView(String array) {
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
	public int deleteHistory(String array, String leadId) {
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
	public int deleteAppointment(String array, String leadId) {
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
	public int deleteTask(String array, String leadId) {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public int recordCounter() {
		// TODO Auto-generated method stub
		String tableName = "tbl_crm_leadClass";
		operationStatus = dbu.adminCounter(tableName);
		if(operationStatus >= Limits.max_limit)
			return 2;
		return 0;
	}

}
