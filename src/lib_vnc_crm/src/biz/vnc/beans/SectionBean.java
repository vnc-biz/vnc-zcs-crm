package biz.vnc.beans;

import biz.vnc.base.AbstractBean;

public class SectionBean extends AbstractBean {

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
