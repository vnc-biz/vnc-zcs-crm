package biz.vnc.beans;

import biz.vnc.base.AbstractBean;

public class ChannelBean extends AbstractBean {
	private int channelId;
	private String channelName;
	private String channelActive;

	public ChannelBean() {
		super();
	}

	public int getChannelId() {
		return channelId;
	}

	public void setChannelId(int channelId) {
		this.channelId = channelId;
	}

	public String getChannelName() {
		return channelName;
	}

	public void setChannelName(String channelName) {
		this.channelName = channelName;
	}

	public String getChannelActive() {
		return channelActive;
	}

	public void setChannelActive(String channelActive) {
		this.channelActive = channelActive;
	}

	@Override
	public String toString() {

		return null;
	}
}
