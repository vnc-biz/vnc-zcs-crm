package biz.vnc.base;

public abstract class AbstractBean {
	private String createBy;
	private String createDate;
	private String writeBy;
	private String writeDate;
	private boolean status;

	public String getCreateBy() {
		return createBy;
	}

	public void setCreateBy(String string) {
		this.createBy = string;
	}

	public String getCreateDate() {
		return createDate;
	}

	public void setCreateDate(String createDate) {
		this.createDate = createDate;
	}

	public String getWriteBy() {
		return writeBy;
	}

	public void setWriteBy(String writeBy) {
		this.writeBy = writeBy;
	}

	public String getWriteDate() {
		return writeDate;
	}

	public void setWriteDate(String writeDate) {
		this.writeDate = writeDate;
	}

	public void setStatus(boolean status) {
		this.status = status;
	}

	public boolean isStatus() {
		return status;
	}

	public abstract String toString();

}
