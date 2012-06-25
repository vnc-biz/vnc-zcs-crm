package biz.vnc.beans;

import biz.vnc.base.AbstractBean;

public class CategoryBean extends AbstractBean {

	private int categoryId;
	private String categoryName;
	private String sectionId;

	public CategoryBean() {
		super();
	}

	public int getCategoryId() {
		return categoryId;
	}

	public void setCategoryId(int categoryId) {
		this.categoryId = categoryId;
	}

	public String getCategoryName() {
		return categoryName;
	}

	public void setCategoryName(String categoryName) {
		this.categoryName = categoryName;
	}

	public int getSectionId() {
		return Integer.parseInt(sectionId);
	}

	public void setSectionId(String sectionId) {
		this.sectionId = sectionId;
	}

	@Override
	public String toString() {

		return null;
	}

}
