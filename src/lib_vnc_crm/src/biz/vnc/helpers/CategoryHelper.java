package biz.vnc.helpers;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import com.google.gson.Gson;

import biz.vnc.base.AbstractBean;
import biz.vnc.base.InterfaceHelper;
import biz.vnc.beans.CategoryBean;
import biz.vnc.util.DBUtility;

public class CategoryHelper implements InterfaceHelper {

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

		CategoryBean categoryBean = (CategoryBean)ab;
		String query = "insert into tbl_crm_category values (" + categoryBean.getCategoryId() + ",\"" + categoryBean.getCategoryName() + "\"," + categoryBean.getSectionId() + "," + categoryBean.isStatus() + ",\"" + categoryBean.getCreateBy() + "\",'" + new Timestamp(System.currentTimeMillis()) + "',\"" + categoryBean.getWriteBy() + "\",'" + new Timestamp(System.currentTimeMillis()) + "');" ;
		operationStatus = dbu.insert(query);
		return operationStatus;
	}


	@Override
	public int update(AbstractBean ab) {
		CategoryBean categoryBean = (CategoryBean)ab;
		String query = "update tbl_crm_category set categoryName =\"" + categoryBean.getCategoryName() + "\", sectionId =" + categoryBean.getSectionId() + ", status =" + categoryBean.isStatus() + ", writeBy = \"" + categoryBean.getWriteBy() + "\", writeDate = '" + new Timestamp(System.currentTimeMillis()) + "' " + "where categoryId = " + categoryBean.getCategoryId() + ";" ;
		operationStatus = dbu.update(query);
		return operationStatus;
	}


	@Override
	public int delete(AbstractBean ab) {
		CategoryBean categoryBean = (CategoryBean)ab;
		String query = "delete from tbl_crm_category where id =" + categoryBean.getCategoryId() + ";" ;
		operationStatus = dbu.delete(query);
		return operationStatus;
	}

	private CategoryBean getRecordFromResultSet(ResultSet rs) {
		CategoryBean categoryBean = new CategoryBean();
		try {
			while(rs.next()) {
				categoryBean.setCategoryId(rs.getInt("categoryId"));
				categoryBean.setCategoryName(rs.getString("categoryName"));
				categoryBean.setSectionId(rs.getString("sectionId"));
				categoryBean.setStatus(rs.getBoolean("status"));
				categoryBean.setCreateBy(rs.getString("createBy"));
				categoryBean.setCreateDate(rs.getString("createDate"));
				categoryBean.setWriteBy(rs.getString("writeBy"));
				categoryBean.setWriteDate(rs.getString("writeDate"));
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return categoryBean;
	}

	@Override
	public List<AbstractBean> getAllRecords() {
		List<AbstractBean> retValue = new ArrayList<AbstractBean>();
		String query = "select categoryId,categoryName,s.sectionName,c.status,c.createBy, c.createDate, c.writeBy, c.writeDate from tbl_crm_category c join tbl_crm_section s where c.sectionId = s.sectionId;" ;
		ResultSet rs = dbu.select(query);
		CategoryBean categoryBean = null;
		try {
			while(rs.next()) {
				categoryBean = new CategoryBean();
				categoryBean.setCategoryId(rs.getInt("categoryId"));
				categoryBean.setCategoryName(rs.getString("categoryName"));
				categoryBean.setSectionId(rs.getString("sectionName"));
				categoryBean.setStatus(rs.getBoolean("status"));
				categoryBean.setCreateBy(rs.getString("createBy"));
				categoryBean.setCreateDate(rs.getString("createDate"));
				categoryBean.setWriteBy(rs.getString("writeBy"));
				categoryBean.setWriteDate(rs.getString("writeDate"));

				retValue.add(categoryBean);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return retValue;
	}

	@Override
	public int deleteByIds(String arrayIds,String user) {
		String query = "update tbl_crm_category set status = false, writeBy = '" + user + "', writeDate = '" + new Timestamp(System.currentTimeMillis()) + "' where categoryId IN (" + arrayIds + ");" ;
		System.out.println(query);
		operationStatus = dbu.delete(query);
		System.out.println(operationStatus);
		return operationStatus;
	}


	@Override
	public AbstractBean getRecordById(String id) {
		String query = "select * from tbl_crm_category where categoryId = " + id + ";" ;
		ResultSet rs = dbu.select(query);
		return (getRecordFromResultSet(rs));
	}

	@Override
	public AbstractBean getRecordByName(String name) {
		String query = "select * from tbl_crm_category where categoryName = '" + name + "';" ;
		ResultSet rs = dbu.select(query);
		return (getRecordFromResultSet(rs));
	}

	@Override
	public CategoryBean toBean(String jsonString) {

		try {
			CategoryBean categoryBean  = new CategoryBean ();

			categoryBean = gson.fromJson(jsonString, CategoryBean.class);
			return categoryBean;
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
		String query = "select categoryId,categoryName,s.sectionName,c.status,c.createBy, c.createDate, c.writeBy, c.writeDate from tbl_crm_category c join tbl_crm_section s where c.status = true AND c.sectionId = s.sectionId;" ;
		ResultSet rs = dbu.select(query);
		CategoryBean categoryBean = null;
		try {
			while(rs.next()) {
				categoryBean = new CategoryBean();
				categoryBean.setCategoryId(rs.getInt("categoryId"));
				categoryBean.setCategoryName(rs.getString("categoryName"));
				categoryBean.setSectionId(rs.getString("sectionName"));
				categoryBean.setStatus(rs.getBoolean("status"));
				categoryBean.setCreateBy(rs.getString("createBy"));
				categoryBean.setCreateDate(rs.getString("createDate"));
				categoryBean.setWriteBy(rs.getString("writeBy"));
				categoryBean.setWriteDate(rs.getString("writeDate"));

				retValue.add(categoryBean);
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
