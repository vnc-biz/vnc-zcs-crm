package biz.vnc.beans;

import biz.vnc.base.AbstractBean;

public class SectionBean extends AbstractBean {

	private int sectionId;
	private String sectionName;
	private String sectionCode;
	private String userId;

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

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getUserId() {
		return userId;
	}

	@Override
	public String toString() {

		return null;
	}

}
