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

public class LeadBean extends AbstractBean {
	private int leadId;
	private String subjectName;
	private String leadDescription;
	private String contactName;
	private String companyName;
	private String valuation;
	private String leadState;
	private String partnerName;
	private String phone;
	private String fax;
	private String email;
	private String workPhone;
	private String mobile;
	private String street1;
	private String street2;
	private String city;
	private String zip;
	private String type;
	private String dateOpen;
	private String dateClose;
	private String dayClose;
	private String dayOpen;
	private String referredBy;
	private String userId;
	private String expectedDateClose;
	private String nextActionDate;
	private String nextAction;
	private String stageProbability;
	private String countryId;
	private String stateId;
	private String categoryId;
	private String stageId;
	private String channelId;
	private String sectionId;
	private String priorityId;
	private String companyId;
	private String probability;
	private String leadClassId;
	private CountryBean countryBean;
	private StateBean stateBean;
	private SectionBean sectionBean;
	private ChannelBean channelBean;
	private CategoryBean categoryBean;
	private PriorityBean priorityBean;
	private StageBean stageBean;
	private CompanyBean companyBean;
	private LeadClassBean leadClassBean;

	public String getCountryId() {
		return countryId;
	}

	public void setCountryId(String countryId) {
		this.countryId = countryId;
	}

	public String getStateId() {
		return stateId;
	}

	public void setStateId(String stateId) {
		this.stateId = stateId;
	}

	public String getCategoryId() {
		return categoryId;
	}

	public void setCategoryId(String categoryId) {
		this.categoryId = categoryId;
	}

	public String getStageId() {
		return stageId;
	}

	public void setStageId(String stageId) {
		this.stageId = stageId;
	}

	public String getChannelId() {
		return channelId;
	}

	public void setChannelId(String channelId) {
		this.channelId = channelId;
	}

	public String getSectionId() {
		return sectionId;
	}

	public void setSectionId(String sectionId) {
		this.sectionId = sectionId;
	}

	public String getPriorityId() {
		return priorityId;
	}

	public void setPriorityId(String priorityId) {
		this.priorityId = priorityId;
	}

	@Override
	public String toString() {
		return null;
	}

	public int getLeadId() {
		return leadId;
	}

	public void setLeadId(int leadId) {
		this.leadId = leadId;
	}

	public String getSubjectName() {
		return subjectName;
	}

	public void setSubjectName(String subjectName) {
		this.subjectName = subjectName;
	}

	public String getLeadDescription() {
		return leadDescription;
	}

	public void setLeadDescription(String leadDescription) {
		this.leadDescription = leadDescription;
	}

	public String getContactName() {
		return contactName;
	}

	public void setContactName(String contactName) {
		this.contactName = contactName;
	}

	public String getCompanyName() {
		return companyName;
	}

	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}

	public String getValuation() {
		return valuation;
	}

	public void setValuation(String valuation) {
		this.valuation = valuation;
	}

	public String getLeadState() {
		return leadState;
	}

	public void setLeadState(String leadState) {
		this.leadState = leadState;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getFax() {
		return fax;
	}

	public void setFax(String fax) {
		this.fax = fax;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getWorkPhone() {
		return workPhone;
	}

	public void setWorkPhone(String workPhone) {
		this.workPhone = workPhone;
	}

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public String getStreet1() {
		return street1;
	}

	public void setStreet1(String street1) {
		this.street1 = street1;
	}

	public String getStreet2() {
		return street2;
	}

	public void setStreet2(String street2) {
		this.street2 = street2;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getZip() {
		return zip;
	}

	public void setZip(String zip) {
		this.zip = zip;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getDateOpen() {
		return dateOpen;
	}

	public void setDateOpen(String timestamp) {
		this.dateOpen = timestamp;
	}

	public String getDateClose() {
		return dateClose;
	}

	public void setDateClose(String dateClose) {
		this.dateClose = dateClose;
	}

	public String getDayClose() {
		return dayClose;
	}

	public void setDayClose(String dayClose) {
		this.dayClose = dayClose;
	}

	public String getDayOpen() {
		return dayOpen;
	}

	public void setDayOpen(String dayOpen) {
		this.dayOpen = dayOpen;
	}

	public String getReferredBy() {
		return referredBy;
	}

	public void setReferredBy(String referredBy) {
		this.referredBy = referredBy;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getExpectedDateClose() {
		return expectedDateClose;
	}

	public void setExpectedDateClose(String expectedDateClose) {
		this.expectedDateClose = expectedDateClose;
	}

	public String getNextActionDate() {
		return nextActionDate;
	}

	public void setNextActionDate(String nextActionDate) {
		this.nextActionDate = nextActionDate;
	}

	public String getNextAction() {
		return nextAction;
	}

	public void setNextAction(String nextAction) {
		this.nextAction = nextAction;
	}

	public String getStageProbability() {
		return stageProbability;
	}

	public void setStageProbability(String stageProbability) {
		this.stageProbability = stageProbability;
	}

	public CountryBean getCountryBean() {
		return countryBean;
	}

	public void setCountryBean(CountryBean countryBean) {
		this.countryBean = countryBean;
	}

	public StateBean getStateBean() {
		return stateBean;
	}

	public void setStateBean(StateBean stateBean) {
		this.stateBean = stateBean;
	}

	public SectionBean getSectionBean() {
		return sectionBean;
	}

	public void setSectionBean(SectionBean sectionBean) {
		this.sectionBean = sectionBean;
	}

	public ChannelBean getChannelBean() {
		return channelBean;
	}

	public void setChannelBean(ChannelBean channelBean) {
		this.channelBean = channelBean;
	}

	public CategoryBean getCategoryBean() {
		return categoryBean;
	}

	public void setCategoryBean(CategoryBean categoryBean) {
		this.categoryBean = categoryBean;
	}

	public PriorityBean getPriorityBean() {
		return priorityBean;
	}

	public void setPriorityBean(PriorityBean priorityBean) {
		this.priorityBean = priorityBean;
	}

	public StageBean getStageBean() {
		return stageBean;
	}

	public void setStageBean(StageBean stageBean) {
		this.stageBean = stageBean;
	}

	public void setPartnerName(String partnerName) {
		this.partnerName = partnerName;
	}

	public String getPartnerName() {
		return partnerName;
	}

	public void setCompanyBean(CompanyBean companyBean) {
		this.companyBean = companyBean;
	}

	public CompanyBean getCompanyBean() {
		return companyBean;
	}

	public void setCompanyId(String companyId) {
		this.companyId = companyId;
	}

	public String getCompanyId() {
		return companyId;
	}

	public void setProbability(String probability) {
		this.probability = probability;
	}

	public String getProbability() {
		return probability;
	}

	public void setLeadClassBean(LeadClassBean leadClassBean) {
		this.leadClassBean = leadClassBean;
	}

	public LeadClassBean getLeadClassBean() {
		return leadClassBean;
	}

	public void setLeadClassId(String leadClassId) {
		this.leadClassId = leadClassId;
	}

	public String getLeadClassId() {
		return leadClassId;
	}
}
