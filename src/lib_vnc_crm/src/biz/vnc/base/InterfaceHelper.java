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

package biz.vnc.base;

import java.util.List;

public interface InterfaceHelper {
	public String listClientView(String username);
	public String listView(String username);
	public int add(AbstractBean ab);
	public int update(AbstractBean ab);
	public int delete(AbstractBean ab);
	public int deleteByIds(String arrayIds,String user);
	public List<AbstractBean> getAllRecords(String username);
	public AbstractBean getRecordById(String id);
	public AbstractBean getRecordByName(String name);
	public AbstractBean toBean(String jsonString);
	public List<AbstractBean> getStringRecord(AbstractBean ab);
	public String getUsers();
	public List<AbstractBean> getAllActiveRecords(String username);
	public List<AbstractBean> getAllActiveFilterRecords(String str, String field, String username);
	public String filterView(String array, String username);
	public String filterByContact(String Array, String username);
	public int addHistory(String array, String leadId, String userId);
	public String listHistory(String leadId);
	public int deleteHistory(String array,String leadId);
	public int addAppointment(String array, String leadId);
	public String listAppointment(String leadId);
	public int deleteAppointment(String array,String leadId);
	public int addTask(String array, String leadId);
	public String listTask(String leadId);
	public int deleteTask(String array,String leadId);
	public int recordCounter();
	public String listSharedItems(String leadId);
	public String showMail(String userId, String mailId);
	public int addSharedItems(String userArray, String accessArray, String leadId);
	public int deleteSharedItems(String leadId);
}
