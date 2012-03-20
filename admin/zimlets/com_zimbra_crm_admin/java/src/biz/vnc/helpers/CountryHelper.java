package biz.vnc.helpers;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import biz.vnc.base.AbstractBean;
import biz.vnc.base.InterfaceHelper;
import biz.vnc.beans.CountryBean;
import biz.vnc.util.DBUtility;


import com.google.gson.Gson;

public class CountryHelper implements InterfaceHelper {

	Gson gson = new Gson();
	int operationStatus=0;
	DBUtility dbu = new DBUtility();

	@Override
	public String listView() {

		String strOfAllRecords = gson.toJson(getAllRecords());
		/*for(AbstractBean cb : getAllRecords()){
			System.out.println("Bean: " + ((CountryBean)cb).getCountryName());
		}*/
		return strOfAllRecords;
	}


	@Override
	public int add(AbstractBean ab) {

		CountryBean countryBean = (CountryBean)ab;
		String query = "insert into tbl_crm_country values (" + countryBean.getCountryId() + ",\"" + countryBean.getCountryName() + "\",\"" + countryBean.getCountryCode() + "\"," + countryBean.isStatus() + ",\"" + countryBean.getCreateBy() + "\"," + countryBean.getCreateDate() + ",\"" + countryBean.getWriteBy() + "\"," + countryBean.getWriteDate() + ");" ;
		operationStatus = dbu.insert(query);
		return operationStatus;
	}


	@Override
	public int update(AbstractBean ab) {
		CountryBean countryBean = (CountryBean)ab;
		String query = "update tbl_crm_country set countryName = \"" + countryBean.getCountryName() + "\", countryCode =\"" + countryBean.getCountryCode() + "\", status =" + countryBean.isStatus() + ", writeBy = \"" + countryBean.getWriteBy() + "\", writeDate = '" + new Timestamp(System.currentTimeMillis()) + "' " + "where countryId = " + countryBean.getCountryId() + ";" ;
		System.out.println("Query------------->" + query);
		operationStatus = dbu.update(query);
		return operationStatus;
	}


	@Override
	public int delete(AbstractBean ab) {
		CountryBean countryBean = (CountryBean)ab;
		String query = "delete from tbl_crm_country where countryId =" + countryBean.getCountryId() + ";" ;
		operationStatus = dbu.delete(query);
		return operationStatus;
	}

	private CountryBean getRecordFromResultSet(ResultSet rs) {
		CountryBean countryBean = new CountryBean();
		try {
			countryBean.setCountryId(rs.getInt("countryId"));
			countryBean.setCountryName(rs.getString("countryName"));
			countryBean.setCountryCode(rs.getString("countryCode"));
			countryBean.setStatus(rs.getBoolean("status"));
			countryBean.setCreateBy(rs.getString("createBy"));
			countryBean.setCreateDate(rs.getString("createDate"));
			countryBean.setWriteBy(rs.getString("writeBy"));
			countryBean.setWriteDate(rs.getString("writeDate"));
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return countryBean;
	}

	@Override
	public List<AbstractBean> getAllRecords() {
		List<AbstractBean> retValue = new ArrayList<AbstractBean>();
		String query = "select * from tbl_crm_country;" ;
		ResultSet rs = dbu.select(query);
		CountryBean countryBean = null;
		try {
			while (rs.next()) {
				countryBean = new CountryBean();
				countryBean.setCountryId(rs.getInt("countryId"));
				countryBean.setCountryName(rs.getString("countryName"));
				countryBean.setCountryCode(rs.getString("countryCode"));
				countryBean.setStatus(rs.getBoolean("status"));
				countryBean.setCreateBy(rs.getString("createBy"));
				countryBean.setCreateDate(rs.getString("createDate"));
				countryBean.setWriteBy(rs.getString("writeBy"));
				countryBean.setWriteDate(rs.getString("writeDate"));

				retValue.add(countryBean);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return retValue;
	}

	@Override
	public int deleteByIds(String arrayIds) {
		String query = "update tbl_crm_country set status = false where countryId IN (" + arrayIds + ");" ;
		operationStatus = dbu.delete(query);
		return operationStatus;
	}


	@Override
	public AbstractBean getRecordById(String id) {
		String query = "select * from tbl_crm_country where countryId = '" + id + "' " ;
		ResultSet rs = dbu.select(query);
		return (getRecordFromResultSet(rs));
	}

	@Override
	public AbstractBean getRecordByName(String name) {
		String query = "select * from tbl_crm_country where countryName = '" + name + "';" ;
		ResultSet rs = dbu.select(query);
		return (getRecordFromResultSet(rs));
	}

	@Override
	public CountryBean toBean(String jsonString) {

		try {
			CountryBean countryBean  = new CountryBean ();

			countryBean = gson.fromJson(jsonString, CountryBean.class);
			//JSONObject jObj = (JSONObject)new JSONParser().parse(jsonString);
			//countryBean.setCountryName(gson.get("countryName").toString());
			//countryBean.setCountryCode(gson.get("countryCode").toString());
			return countryBean;
		} catch (Exception e) {
			System.out.println("Error in toBean() :" + e);
		}
		return null;
	}

	public List<AbstractBean> getStringRecord(AbstractBean ab) {
		List<AbstractBean> retValue = new ArrayList<AbstractBean>();
		retValue.add(ab);
		return retValue;
	}


	@Override
	public String getUsers() {
		// TODO Auto-generated method stub
		return null;
	}

}
