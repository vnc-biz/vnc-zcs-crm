package biz.vnc.beans;

import biz.vnc.base.AbstractBean;

public class LeadClassBean extends AbstractBean {

	private int leadClassId;
	private String leadClassName;
	private String leadClassActive;

	@Override
	public String toString() {
		// TODO Auto-generated method stub
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
