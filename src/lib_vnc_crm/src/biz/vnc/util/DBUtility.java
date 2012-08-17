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

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class DBUtility {
	public static Connection connection;
	public static Statement statement;
	public static String MYSQL_PASSWORD = null;
	static{
		try{
				String cmd[] = {"/bin/sh","-c","/opt/zimbra/bin/zmlocalconfig -s | /bin/grep zimbra_mysql_password | /usr/bin/cut -d\" \" -f 3"};
				Runtime r = Runtime.getRuntime();
	            Process p = r.exec(cmd);
	            InputStream stdin = p.getInputStream();
	            InputStreamReader isr = new InputStreamReader(stdin);
	            BufferedReader br = new BufferedReader(isr);
	            MYSQL_PASSWORD = br.readLine();
	            
	            Class.forName("com.mysql.jdbc.Driver");
	            String dbUrl = "jdbc:mysql://localhost:7306/test_zimbra?zeroDateTimeBehavior=convertToNull&autoReconnect=true";
	            String dbUsername = "zimbra";
	            connection = DriverManager.getConnection(dbUrl, dbUsername, MYSQL_PASSWORD);
	            statement = connection.createStatement();
	            System.out.println("Connection Established Successfully.");
		}catch(Exception e){
			System.out.println("Exception:" + e);
		}
	}
	public DBUtility(){
		
	}
	
	public void stopConnection(){
		try{
			statement.close();
			connection.close();
		}catch(Exception e){
			System.out.println("Connection close exception:" + e);
		}
	}
	
	public int insert(String query){
		try {
			System.out.println(query);
			statement.execute(query);
			return 1;
		}catch(Exception e){
			System.out.println("Insertion Exception: " + e);
			return 0;
		}
	}
	
	public int update(String query){
		try{
			statement.execute(query);
			return 1;
		}catch(Exception e){
			System.out.println("Updation Exception: " + e);
			return 0;
		}
	}
	
	public int delete(String query){
		try{
			statement.execute(query);
			return 1;
		}catch(Exception e){
			System.out.println("Deletion Exception: " + e);
			return 0;
		}
	}
	
	public ResultSet select(String query){
		try{
			Statement st = connection.createStatement();
			ResultSet rs = st.executeQuery(query);
			return rs;
				
		}catch(Exception e){
			System.out.println("Selection Exception: " + e);
		}
		return null;
	}
	
	public int adminCounter(String tableName){
		try {
			Statement statement = connection.createStatement();
			String query = "select count(*) from " + tableName + " where status = true;";
			ResultSet rs = statement.executeQuery(query);
			while (rs.next()){
				return rs.getInt(1);
			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return 0;
	}
	
	public int clientCounter(String tableName, int type){
		try {
			Statement statement = connection.createStatement();
			String query = "select count(*) from " + tableName + " where status = true and type = " + type + ";";
			ResultSet rs = statement.executeQuery(query);
			while (rs.next()){
				return rs.getInt(1);
			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return 0;
	}
}