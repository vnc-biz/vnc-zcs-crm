package biz.vnc.beans;

import biz.vnc.base.AbstractBean;

public class StageBean extends AbstractBean {

	private int stageId;
	private String stageName;
	private int stageSequence;
	private int stageType;
	private String stageState;
	private float stageProbability;
	private String stageDescription;
	private boolean stageAuto;


	public StageBean() {
		super();
	}

	public int getStageId() {
		return stageId;
	}

	public void setStageId(int stageId) {
		this.stageId = stageId;
	}

	public String getStageName() {
		return stageName;
	}

	public void setStageName(String stageName) {
		this.stageName = stageName;
	}

	public int getStageSequence() {
		return stageSequence;
	}

	public void setStageSequence(int stageSequence) {
		this.stageSequence = stageSequence;
	}

	public int getStageType() {
		return stageType;
	}

	public void setStageType(int stageType) {
		this.stageType = stageType;
	}

	public float getStageProbability() {
		return stageProbability;
	}

	public void setStageProbability(float stageProbability) {
		this.stageProbability = stageProbability;
	}

	public String getStageDescription() {
		return stageDescription;
	}

	public void setStageDescription(String stageDescription) {
		this.stageDescription = stageDescription;
	}

	public boolean getStageAuto() {
		return stageAuto;
	}

	public void setStageAuto(boolean stageAuto) {
		this.stageAuto = stageAuto;
	}

	@Override
	public String toString() {

		return null;
	}

	public void setStageState(String stageState) {
		this.stageState = stageState;
	}

	public String getStageState() {
		return stageState;
	}



}
