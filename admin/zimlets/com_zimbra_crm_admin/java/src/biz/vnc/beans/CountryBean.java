package biz.vnc.beans;

import biz.vnc.base.AbstractBean;

public class CountryBean extends AbstractBean {

	private int countryId;
	private String countryName;
	private String countryCode;

	public CountryBean() {
		super();
	}

	public int getCountryId() {
		return countryId;
	}

	public void setCountryId(int countryId) {
		this.countryId = countryId;
	}

	public String getCountryName() {
		return countryName;
	}

	public void setCountryName(String countryName) {
		this.countryName = countryName;
	}

	public String getCountryCode() {
		return countryCode;
	}

	public void setCountryCode(String countryCode) {
		this.countryCode = countryCode;
	}

	@Override
	public String toString() {

		return null;
	}
}
