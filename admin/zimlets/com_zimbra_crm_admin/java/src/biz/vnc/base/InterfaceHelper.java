package biz.vnc.base;

import java.util.List;

public interface InterfaceHelper {
	public String listView();
	public int add(AbstractBean ab);
	public int update(AbstractBean ab);
	public int delete(AbstractBean ab);
	public int deleteByIds(String arrayIds);
	public List<AbstractBean> getAllRecords();
	public AbstractBean getRecordById(String id);
	public AbstractBean getRecordByName(String name);
	public AbstractBean toBean(String jsonString);
	public List<AbstractBean> getStringRecord(AbstractBean ab);
	public String getUsers();
}
