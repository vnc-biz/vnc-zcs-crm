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
		String query = "insert into tbl_crm_category values (" + categoryBean.getCategoryId() + ",\"" + categoryBean.getCategoryName() + "\"," + categoryBean.getSectionId() + "," + categoryBean.isStatus() + ",\"" + categoryBean.getCreateBy() + "\"," + categoryBean.getCreateDate() + ",\"" + categoryBean.getWriteBy() + "\"," + categoryBean.getWriteDate() + ");" ;
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
			categoryBean.setCategoryId(rs.getInt("categoryId"));
			categoryBean.setCategoryName(rs.getString("categoryName"));
			categoryBean.setSectionId(rs.getString("sectionName"));
			categoryBean.setStatus(rs.getBoolean("status"));
			categoryBean.setCreateBy(rs.getString("createBy"));
			categoryBean.setCreateDate(rs.getString("createDate"));
			categoryBean.setWriteBy(rs.getString("writeBy"));
			categoryBean.setWriteDate(rs.getString("writeDate"));
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return categoryBean;
	}

	@Override
	public List<AbstractBean> getAllRecords() {
		List<AbstractBean> retValue = new ArrayList<AbstractBean>();
		String query = "select categoryId,categoryName,s.sectionName,s.status,c.createBy, c.createDate, c.writeBy, c.writeDate from tbl_crm_category c join tbl_crm_section s where c.sectionId = s.sectionId;" ;
		ResultSet rs = dbu.select(query);
		CategoryBean categoryBean = null;
		try {
			while (rs.next()) {
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
	public int deleteByIds(String arrayIds) {
		String query = "update tbl_crm_category set status = false where categoryId IN (" + arrayIds + ");" ;
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
