package biz.vnc.base;

import java.util.List;

public interface InterfaceHelper {
	public String listClientView();
	public String listView();
	public int add(AbstractBean ab);
	public int update(AbstractBean ab);
	public int delete(AbstractBean ab);
	public int deleteByIds(String arrayIds,String user);
	public List<AbstractBean> getAllRecords();
	public AbstractBean getRecordById(String id);
	public AbstractBean getRecordByName(String name);
	public AbstractBean toBean(String jsonString);
	public List<AbstractBean> getStringRecord(AbstractBean ab);
	public String getUsers();
	public List<AbstractBean> getAllActiveRecords();
	public List<AbstractBean> getAllActiveFilterRecords(String str, String field);
	public String filterView(String array);
	public String filterByContact(String Array);
	public int addHistory(String array, String leadId);
	public String listHistory(String leadId);
	public int deleteHistory(String array,String leadId);
	public int addAppointment(String array, String leadId);
	public String listAppointment(String leadId);
	public int deleteAppointment(String array,String leadId);
	public int addTask(String array, String leadId);
	public String listTask(String leadId);
	public int deleteTask(String array,String leadId);
	public int recordCounter();
}
