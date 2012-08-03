package biz.vnc.util;

import biz.vnc.base.InterfaceHelper;
import biz.vnc.helpers.CategoryHelper;
import biz.vnc.helpers.ChannelHelper;
import biz.vnc.helpers.CompanyHelper;
import biz.vnc.helpers.CountryHelper;
import biz.vnc.helpers.LeadClassHelper;
import biz.vnc.helpers.LeadHelper;
import biz.vnc.helpers.OpportunityHelper;
import biz.vnc.helpers.PriorityHelper;
import biz.vnc.helpers.SectionHelper;
import biz.vnc.helpers.StageHelper;
import biz.vnc.helpers.StateHelper;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class Utility {

	public static InterfaceHelper callHelper(String jString) {
		JsonObject k  = new JsonParser().parse(jString).getAsJsonObject();
		String objType = k.get("object").getAsString();
		if(objType.equals("country")) {
			return new CountryHelper();
		} else if(objType.equals("company")) {
			return new CompanyHelper();
		} else if(objType.equals("state")) {
			return new StateHelper();
		} else if(objType.equals("category")) {
			return new CategoryHelper();
		} else if(objType.equals("channel")) {
			return new ChannelHelper();
		} else if(objType.equals("section")) {
			return new SectionHelper();
		} else if(objType.equals("priority")) {
			return new PriorityHelper();
		} else if(objType.equals("stage")) {
			return new StageHelper();
		} else if(objType.equals("lead")) {
			return new LeadHelper();
		} else if(objType.equals("opp")) {
			return new OpportunityHelper();
		} else if(objType.equals("leadClass")) {
			return new LeadClassHelper();
		}
		return null;
	}
}
