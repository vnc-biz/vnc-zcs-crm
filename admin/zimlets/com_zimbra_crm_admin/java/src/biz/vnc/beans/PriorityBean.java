package biz.vnc.beans;

import biz.vnc.base.AbstractBean;

public class PriorityBean extends AbstractBean {

	private int priorityId;
	private String priorityName;
	private String priorityCode;

	public PriorityBean() {
		super();
	}

	public int getPriorityId() {
		return priorityId;
	}

	public void setPriorityId(int priorityId) {
		this.priorityId = priorityId;
	}

	public String getPriorityName() {
		return priorityName;
	}

	public void setPriorityName(String priorityName) {
		this.priorityName = priorityName;
	}

	public String getPriorityCode() {
		return priorityCode;
	}

	public void setPriorityCode(String priorityCode) {
		this.priorityCode = priorityCode;
	}

	@Override
	public String toString() {

		return null;
	}

}
