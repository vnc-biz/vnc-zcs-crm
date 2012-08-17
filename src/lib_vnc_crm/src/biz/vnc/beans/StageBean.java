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

public class StageBean extends AbstractBean{

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
