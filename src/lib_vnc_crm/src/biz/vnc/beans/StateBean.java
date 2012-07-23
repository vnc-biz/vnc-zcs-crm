package biz.vnc.beans;

import biz.vnc.base.AbstractBean;

public class StateBean extends AbstractBean {

	private int stateId;
	private String stateName;
	private String stateCode;
	private String countryId;


	public StateBean() {
		super();
	}

	public int getStateId() {
		return stateId;
	}

	public void setStateId(int stateId) {
		this.stateId = stateId;
	}

	public String getStateName() {
		return stateName;
	}

	public void setStateName(String stateName) {
		this.stateName = stateName;
	}

	public String getStateCode() {
		return stateCode;
	}

	public void setStateCode(String stateCode) {
		this.stateCode = stateCode;
	}

	public void setCountryId(String countryId) {
		this.countryId = countryId;
	}

	public void setCountryId(int countryId) {
		this.countryId = String.valueOf(countryId);
	}

	public int getCountryId() {
		return Integer.parseInt(countryId);
	}

	@Override
	public String toString() {
		return null;
	}
}
