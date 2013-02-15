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

public class Notification {
	static public final int record_saved = 0;
	static public final int record_not_saved = 1;
	static public final int record_update = 2;
	static public final int record_not_update = 3;
	static public final int record_delete = 4;
	static public final int record_not_delete = 5;

	static public final int task_attach = 8;
	static public final int task_not_attach = 9;
	static public final int task_detached = 10;
	static public final int task_not_detached = 11;

	static public final int appt_attach = 12;
	static public final int appt_not_attach = 13;
	static public final int appt_detached = 14;
	static public final int appt_not_detached = 15;

	static public final int mail_attach = 16;
	static public final int mail_not_attach = 17;
	static public final int mail_detached = 18;
	static public final int mail_not_detached = 19;

}
