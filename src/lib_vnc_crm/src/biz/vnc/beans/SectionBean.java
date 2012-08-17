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

public class SectionBean extends AbstractBean{

	private int sectionId;
	private String sectionName;
	private String sectionCode;
	private String sectionSalesTeamIds;
	private String sectionManagerId;
	private String sectionLeaderId;
	private String sectionWatcherId;
	
	public SectionBean() {
		super();
	}

	public int getSectionId() {
		return sectionId;
	}

	public void setSectionId(int sectionId) {
		this.sectionId = sectionId;
	}

	public String getSectionName() {
		return sectionName;
	}

	public void setSectionName(String sectionName) {
		this.sectionName = sectionName;
	}

	public String getSectionCode() {
		return sectionCode;
	}

	public void setSectionCode(String sectionCode) {
		this.sectionCode = sectionCode;
	}

	@Override
	public String toString() {

		return null;
	}

	public String getSectionSalesTeamIds() {
		return sectionSalesTeamIds;
	}

	public void setSectionSalesTeamIds(String sectionSalesTeamIds) {
		this.sectionSalesTeamIds = sectionSalesTeamIds;
	}

	public String getSectionManagerId() {
		return sectionManagerId;
	}

	public void setSectionManagerId(String sectionManagerId) {
		this.sectionManagerId = sectionManagerId;
	}

	public String getSectionLeaderId() {
		return sectionLeaderId;
	}

	public void setSectionLeaderId(String sectionLeaderId) {
		this.sectionLeaderId = sectionLeaderId;
	}

	public String getSectionWatcherId() {
		return sectionWatcherId;
	}

	public void setSectionWatcherId(String sectionWatcherId) {
		this.sectionWatcherId = sectionWatcherId;
	}

}
