package biz.vnc.helpers;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import com.google.gson.Gson;

import biz.vnc.base.AbstractBean;
import biz.vnc.base.InterfaceHelper;
import biz.vnc.beans.ChannelBean;
import biz.vnc.util.DBUtility;

public class ChannelHelper implements InterfaceHelper {

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

		ChannelBean channelBean = (ChannelBean)ab;
		String query = "insert into tbl_crm_channel values (" + channelBean.getChannelId() + ",\"" + channelBean.getChannelName() + "\"," + channelBean.isStatus() + ",\"" + channelBean.getCreateBy() + "\",'" + new Timestamp(System.currentTimeMillis()) + "',\"" + channelBean.getWriteBy() + "\",'" + new Timestamp(System.currentTimeMillis()) + "');" ;
		operationStatus = dbu.insert(query);
		System.out.println("Operation Status :  " + operationStatus);
		return operationStatus;
	}


	@Override
	public int update(AbstractBean ab) {
		ChannelBean channelBean = (ChannelBean)ab;
		String query = "update tbl_crm_channel set channelName = \"" + channelBean.getChannelName() + "\", status =" + channelBean.isStatus() + ", writeBy = \"" + channelBean.getWriteBy() + "\", writeDate = '" + new Timestamp(System.currentTimeMillis()) + "' " + "where channelId = " + channelBean.getChannelId() + ";" ;
		operationStatus = dbu.update(query);
		return operationStatus;
	}


	@Override
	public int delete(AbstractBean ab) {
		ChannelBean channelBean = (ChannelBean)ab;
		String query = "delete from tbl_crm_channel where channelId =" + channelBean.getChannelId() + ";" ;
		operationStatus = dbu.delete(query);
		return operationStatus;
	}

	private ChannelBean getRecordFromResultSet(ResultSet rs) {
		ChannelBean channelBean = new ChannelBean();
		try {
			channelBean.setChannelId(rs.getInt("channelId"));
			channelBean.setChannelName(rs.getString("channelName"));
			channelBean.setStatus(rs.getBoolean("status"));
			channelBean.setCreateBy(rs.getString("createBy"));
			channelBean.setCreateDate(rs.getString("createDate"));
			channelBean.setWriteBy(rs.getString("writeBy"));
			channelBean.setWriteDate(rs.getString("writeDate"));
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return channelBean;
	}

	@Override
	public List<AbstractBean> getAllRecords() {
		List<AbstractBean> retValue = new ArrayList<AbstractBean>();
		String query = "select * from tbl_crm_channel;" ;
		ResultSet rs = dbu.select(query);
		ChannelBean channelBean = null;
		try {
			while(rs.next()) {
				channelBean = new ChannelBean();
				channelBean.setChannelId(rs.getInt("channelId"));
				channelBean.setChannelName(rs.getString("channelName"));
				channelBean.setStatus(rs.getBoolean("status"));
				channelBean.setCreateBy(rs.getString("createBy"));
				channelBean.setCreateDate(rs.getString("createDate"));
				channelBean.setWriteBy(rs.getString("writeBy"));
				channelBean.setWriteDate(rs.getString("writeDate"));

				retValue.add(channelBean);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return retValue;
	}

	@Override
	public int deleteByIds(String arrayIds,String user) {
		String query = "update tbl_crm_channel set status = false, writeBy = '" + user + "', writeDate = '" + new Timestamp(System.currentTimeMillis()) + "' where channelId IN (" + arrayIds + ");" ;
		operationStatus = dbu.delete(query);
		return operationStatus;
	}


	@Override
	public AbstractBean getRecordById(String id) {
		String query = "select * from tbl_crm_channel where channelId = " + id + ";" ;
		ResultSet rs = dbu.select(query);
		return (getRecordFromResultSet(rs));
	}

	@Override
	public AbstractBean getRecordByName(String name) {
		String query = "select * from tbl_crm_channel where channelName = '" + name + "';" ;
		ResultSet rs = dbu.select(query);
		return (getRecordFromResultSet(rs));
	}

	@Override
	public ChannelBean toBean(String jsonString) {

		try {
			ChannelBean channelBean = new ChannelBean();

			channelBean = gson.fromJson(jsonString, ChannelBean.class);
			return channelBean;
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

}
