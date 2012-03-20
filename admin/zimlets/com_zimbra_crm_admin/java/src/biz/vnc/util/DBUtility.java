package biz.vnc.util;

import java.io.*;
import java.sql.*;


public class DBUtility {
	public static Connection connection;
	public static Statement statement;
	public static String MYSQL_PASSWORD = null;
	static {
		try {
			String cmd[] = {"/bin/sh","-c","/opt/zimbra/bin/zmlocalconfig -s | /bin/grep zimbra_mysql_password | /usr/bin/cut -d\" \" -f 3"};
			Runtime r = Runtime.getRuntime();
			Process p = r.exec(cmd);
			InputStream stdin = p.getInputStream();
			InputStreamReader isr = new InputStreamReader(stdin);
			BufferedReader br = new BufferedReader(isr);
			MYSQL_PASSWORD = br.readLine();
			System.out.println("Mysql password: " + MYSQL_PASSWORD);

			Class.forName("com.mysql.jdbc.Driver");
			String dbUrl = "jdbc:mysql://localhost:7306/test_zimbra";
			String dbUsername = "zimbra";
			connection = DriverManager.getConnection(dbUrl, dbUsername, MYSQL_PASSWORD);
			statement = connection.createStatement();
			System.out.println("Connection Established Successfully.");
		} catch (Exception e) {
			System.out.println("Exception:" + e);
		}
	}
	public DBUtility() {

	}

	public void stopConnection() {
		try {
			statement.close();
			connection.close();
		} catch (Exception e) {
			System.out.println("Connection close exception:" + e);
		}
	}

	public int insert(String query) {
		try {
			System.out.println(query);
			statement.execute(query);
			return 1;
		} catch (Exception e) {
			System.out.println("Insertion Exception: " + e);
			return 0;
		}
	}

	public int update(String query) {
		try {
			statement.execute(query);
			return 1;
		} catch (Exception e) {
			System.out.println("Updation Exception: " + e);
			return 0;
		}
	}

	public int delete(String query) {
		try {
			statement.execute(query);
			return 1;
		} catch (Exception e) {
			System.out.println("Deletion Exception: " + e);
			return 0;
		}
	}

	public ResultSet select(String query) {
		try {
			ResultSet rs = statement.executeQuery(query);
			return rs;

		} catch (Exception e) {
			System.out.println("Selection Exception: " + e);
		}
		return null;

	}
}
