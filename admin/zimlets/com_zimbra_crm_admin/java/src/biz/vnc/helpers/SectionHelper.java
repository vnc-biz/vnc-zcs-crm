package biz.vnc.helpers;


import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import biz.vnc.base.AbstractBean;
import biz.vnc.base.InterfaceHelper;
import biz.vnc.beans.SectionBean;

import biz.vnc.util.DBUtility;

import com.google.gson.Gson;
import com.zimbra.cs.account.Domain;
import com.zimbra.cs.account.soap.SoapProvisioning;
import com.zimbra.cs.account.soap.SoapProvisioning.Options;

public class SectionHelper implements InterfaceHelper {

	Gson gson = new Gson();
	int operationStatus=0;
	DBUtility dbu = new DBUtility();
	@Override
	public String listView() {
		String str = gson.toJson(getAllRecords());
		return str;
	}

	@Override
	public int add(AbstractBean ab) {

		SectionBean sectionBean = (SectionBean)ab;
		String query = "insert into tbl_crm_section values (" + sectionBean.getSectionId() + ",\"" + sectionBean.getSectionName() + "\",\"" + sectionBean.getSectionCode() + "\",\"" + sectionBean.getUserId() + "\"," + sectionBean.isStatus() + ",\"" + sectionBean.getCreateBy() + "\"," + sectionBean.getCreateDate() + ",\"" + sectionBean.getWriteBy() + "\"," + sectionBean.getWriteDate() + ");" ;
		operationStatus = dbu.insert(query);
		return operationStatus;
	}

	@Override
	public int update(AbstractBean ab) {
		SectionBean sectionBean = (SectionBean)ab;
		String query = "update tbl_crm_section set sectionName = \"" + sectionBean.getSectionName() + "\", sectionCode =\"" + sectionBean.getSectionCode() + "\", userId =\"" + sectionBean.getUserId() + "\", status =" + sectionBean.isStatus() + ", writeBy = \"" + sectionBean.getWriteBy() + "\", writeDate = '" + new Timestamp(System.currentTimeMillis()) + "' " + "where sectionId = " + sectionBean.getSectionId() + ";" ;
		operationStatus = dbu.update(query);
		return operationStatus;
	}

	@Override
	public int delete(AbstractBean ab) {
		SectionBean sectionBean = (SectionBean)ab;
		String query = "delete from tbl_crm_section where sectionId =" + sectionBean.getSectionId() + ";" ;
		operationStatus = dbu.delete(query);
		return operationStatus;
	}
	private SectionBean getRecordFromResultSet(ResultSet rs) {
		SectionBean sectionBean = new SectionBean();
		sectionBean = new SectionBean();
		try {
			sectionBean.setSectionId(rs.getInt("sectionId"));
			sectionBean.setSectionName(rs.getString("sectionName"));
			sectionBean.setSectionCode(rs.getString("sectionCode"));
			sectionBean.setUserId(rs.getString("userId"));
			sectionBean.setStatus(rs.getBoolean("status"));
			sectionBean.setCreateBy(rs.getString("createBy"));
			sectionBean.setCreateDate(rs.getString("createDate"));
			sectionBean.setWriteBy(rs.getString("writeBy"));
			sectionBean.setWriteDate(rs.getString("writeDate"));
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return sectionBean;
	}

	@Override
	public List<AbstractBean> getAllRecords() {
		List<AbstractBean> retValue = new ArrayList<AbstractBean>();
		String query = "select * from tbl_crm_section;" ;
		ResultSet rs = dbu.select(query);
		SectionBean sectionBean = null;
		try {
			while (rs.next()) {
				sectionBean = new SectionBean();
				sectionBean.setSectionId(rs.getInt("sectionId"));
				sectionBean.setSectionName(rs.getString("sectionName"));
				sectionBean.setSectionCode(rs.getString("sectionCode"));
				sectionBean.setUserId(rs.getString("userId"));
				sectionBean.setStatus(rs.getBoolean("status"));
				sectionBean.setCreateBy(rs.getString("createBy"));
				sectionBean.setCreateDate(rs.getString("createDate"));
				sectionBean.setWriteBy(rs.getString("writeBy"));
				sectionBean.setWriteDate(rs.getString("writeDate"));

				retValue.add(sectionBean);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return retValue;
	}


	@Override
	public int deleteByIds(String arrayIds) {
		String query = "update tbl_crm_section set status = false where sectionId IN (" + arrayIds + ");" ;
		operationStatus = dbu.delete(query);
		return operationStatus;
	}

	@Override
	public AbstractBean getRecordById(String id) {
		String query = "select * from tbl_crm_section where sectionId = " + id + ";" ;
		ResultSet rs = dbu.select(query);
		return (getRecordFromResultSet(rs));
	}

	@Override
	public AbstractBean getRecordByName(String name) {
		String query = "select * from tbl_crm_section where sectionName = '" + name + "';" ;
		ResultSet rs = dbu.select(query);
		return (getRecordFromResultSet(rs));
	}

	@Override
	public AbstractBean toBean(String jsonString) {
		try {
			SectionBean sectionBean  = new SectionBean ();

			sectionBean = gson.fromJson(jsonString, SectionBean.class);
			//JSONObject jObj = (JSONObject)new JSONParser().parse(jsonString);
			//sectionBean.setSectionName(gson.get("sectionName").toString());
			//sectionBean.setSectionCode(gson.get("sectionCode").toString());
			return sectionBean;
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

	public String getUsers () {
		try {
			List<String> listOfAccounts = new ArrayList<String>();
			SoapProvisioning soap = null;
			Options options=new Options();
			options.setLocalConfigAuth(true);
			soap = new SoapProvisioning(options);
			System.out.println("All Domain size" +soap.getAllDomains().size());
			for (int i=0; i<soap.getAllDomains().size(); i++) {
				System.out.println("All User size" +soap.getAllAccounts(soap.getAllDomains().get(i)).size());
				Domain singleD = soap.getAllDomains().get(i);
				listOfAccounts.add(soap.getAllAccounts(singleD).toString());
				System.out.println("Inner : " +listOfAccounts.toString());
			}
			return listOfAccounts.toString();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

}
