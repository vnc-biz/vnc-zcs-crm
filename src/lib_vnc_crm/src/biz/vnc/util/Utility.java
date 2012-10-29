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

public class Utility {

	public static InterfaceHelper callHelper(String objType) {
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
