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
import biz.vnc.beans.CategoryBean;
import biz.vnc.util.DBUtility;
import biz.vnc.util.Limits;
import com.google.gson.Gson;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

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
		operationStatus = dbu.delete(query);
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
		return null;
	}

	@Override
	public String getUsers() {
		return null;
	}

	@Override
	public List<AbstractBean> getAllActiveRecords() {
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
		String tableName = "tbl_crm_category";
		operationStatus = dbu.adminCounter(tableName);
		if(operationStatus >= Limits.max_limit)
			return 2;
		return 0;
	}
}
