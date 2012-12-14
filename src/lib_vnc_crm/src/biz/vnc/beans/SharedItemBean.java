package biz.vnc.beans;

public class SharedItemBean {

	private int leadId;
	private String userId;
	private Boolean writeAccess;

	public int getLeadId() {
		return leadId;
	}
	public void setLeadId(int leadId) {
		this.leadId = leadId;
	}
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public Boolean getWriteAccess() {
		return writeAccess;
	}
	public void setWriteAccess(Boolean writeAccess) {
		this.writeAccess = writeAccess;
	}
}
