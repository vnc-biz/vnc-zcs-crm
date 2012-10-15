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

package biz.vnc.beans;

import biz.vnc.base.AbstractBean;

public class LeadClassBean extends AbstractBean {

	private int leadClassId;
	private String leadClassName;
	private String leadClassActive;

	@Override
	public String toString() {
		return null;
	}

	public void setLeadClassId(int leadClassId) {
		this.leadClassId = leadClassId;
	}

	public int getLeadClassId() {
		return leadClassId;
	}

	public void setLeadClassName(String leadClassName) {
		this.leadClassName = leadClassName;
	}

	public String getLeadClassName() {
		return leadClassName;
	}

	public void setLeadClassActive(String leadClassActive) {
		this.leadClassActive = leadClassActive;
	}

	public String getLeadClassActive() {
		return leadClassActive;
	}
}

