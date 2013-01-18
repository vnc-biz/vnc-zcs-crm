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

package biz.vnc.util;

import biz.vnc.zimbra.util.LocalDB;
import biz.vnc.zimbra.util.ZLog;
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class DBUtility {

	public static Connection connection;
	public static Statement statement;
	public static String MYSQL_PASSWORD = null;

	static {
		try{
			connection = LocalDB.connect("vnccrm");
			statement = connection.createStatement();
			ZLog.info("VNC CRM for Zimbra","Connection Established Successfully.");
		} catch(Exception e) {
			ZLog.err("VNC CRM for Zimbra","Connection Error",e);
		}
	}

	public DBUtility() {
	}

	public void stopConnection() {
		try {
			statement.close();
			connection.close();
		} catch(Exception e) {
			ZLog.err("VNC CRM for Zimbra","Connection close exception:",e);
		}
	}

	public int insert(PreparedStatement preparedStatement) {
		try {
			preparedStatement.executeUpdate();
			return 1;
		} catch(Exception e) {
			ZLog.err("VNC CRM for Zimbra","Insertion Exception: ",e);
			return 0;
		}
	}

	public int update(PreparedStatement preparedStatement) {
		try {
			preparedStatement.executeUpdate();
			return 1;
		} catch(Exception e) {
			ZLog.err("VNC CRM for Zimbra","Updation Exception: ",e);
			return 0;
		}
	}

	public int delete(PreparedStatement preparedStatement) {
		try {
			preparedStatement.executeUpdate();
			return 1;
		} catch(Exception e) {
			ZLog.err("VNC CRM for Zimbra","Deletion Exception: ",e);
			return 0;
		}
	}

	public ResultSet select(PreparedStatement preparedStatement) {
		try {
			ResultSet rs = preparedStatement.executeQuery();
			return rs;
		} catch(Exception e) {
			ZLog.err("VNC CRM for Zimbra","Selection Exception: ",e);
		}
		return null;
	}

	public int adminCounter(String tableName) {
		try {
			Statement statement = connection.createStatement();
			String query = "select count(*) from " + tableName + " where status = true;";
			ResultSet rs = statement.executeQuery(query);
			while (rs.next()) {
				return rs.getInt(1);
			}
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra","Error in Admin Counter", e);
		}
		return 0;
	}

	public int clientCounter(String tableName, int type) {
		try {
			Statement statement = connection.createStatement();
			String query = "select count(*) from " + tableName + " where status = true and type = " + type + ";";
			ResultSet rs = statement.executeQuery(query);
			while (rs.next()) {
				return rs.getInt(1);
			}
		} catch (SQLException e) {
			ZLog.err("VNC CRM for Zimbra","Error in Client Counter", e);
		}
		return 0;
	}
}
