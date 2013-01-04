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

CREATE DATABASE IF NOT EXISTS vnccrm;

USE vnccrm;

CREATE TABLE IF NOT EXISTS tbl_crm_company (
companyId Integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
companyName varchar(256) NOT NULL,
companyAddress varchar(256),
companyPhone varchar(16),
companyFax varchar(16),
companyEmail varchar(256),
status Boolean,
createBy varchar(255),
createDate timestamp default 0,
writeBy varchar(255),
writeDate timestamp default 0
);

CREATE TABLE IF NOT EXISTS tbl_crm_country (
countryId Integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
countryName varchar(256) NOT NULL,
countryCode varchar(256) NOT NULL,
status Boolean,
createBy varchar(255),
createDate timestamp default 0,
writeBy varchar(255),
writeDate timestamp default 0
);

CREATE TABLE IF NOT EXISTS tbl_crm_state (
stateId Integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
stateName varchar(256) NOT NULL,
stateCode varchar(256) NOT NULL,
countryId Integer REFERENCES tbl_crm_country(countryId),
status Boolean,
createBy varchar(255),
createDate timestamp default 0,
writeBy varchar(255),
writeDate timestamp default 0
);

CREATE TABLE IF NOT EXISTS tbl_crm_stage (
stageId Integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
stageName varchar(64) NOT NULL,
stageSequence Integer,
stageType Integer,
stageState varchar(64),
stageProbability Float NOT NULL,
stageDescription Text,
stageAuto Boolean,
status Boolean,
createBy varchar(255),
createDate timestamp default 0,
writeBy varchar(255),
writeDate timestamp default 0
);

CREATE TABLE IF NOT EXISTS tbl_crm_channel (
channelId Integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
channelName varchar(64) NOT NULL,
status Boolean,
createBy varchar(255),
createDate timestamp default 0,
writeBy varchar(255),
writeDate timestamp default 0
);

CREATE TABLE IF NOT EXISTS tbl_crm_section (
sectionId Integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
sectionName varchar(64) NOT NULL,
sectionCode varchar(64),
sectionManagerId varchar(64),
sectionLeaderId varchar(64),
sectionWatcherId varchar(64),
sectionSalesTeamIds varchar(255),
status Boolean,
createBy varchar(255),
createDate timestamp default 0,
writeBy varchar(255),
writeDate timestamp default 0
);

CREATE TABLE IF NOT EXISTS tbl_crm_category (
categoryId Integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
categoryName varchar(64) NOT NULL,
sectionId Integer REFERENCES tbl_crm_section (sectionId),
status Boolean,
createBy varchar(255),
createDate timestamp default 0,
writeBy varchar(255),
writeDate timestamp default 0
);

CREATE TABLE IF NOT EXISTS tbl_crm_priority (
priorityId Integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
priorityName varchar(64) NOT NULL,
priorityCode varchar(16) NOT NULL,
status Boolean,
createBy varchar(255),
createDate timestamp default 0,
writeBy varchar(255),
writeDate timestamp default 0
);

CREATE TABLE IF NOT EXISTS tbl_crm_lead (
leadId Integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
subjectName varchar(128),
leadDescription Text,
contactName varchar(64),
companyId Integer REFERENCES tbl_crm_company(companyId),
valuation varchar(64),
leadState varchar(64),
partnerName varchar(255),
phone varchar(16),
fax varchar(16),
email varchar(256),
workPhone varchar(16),
mobile varchar(16),
street1 varchar(256),
street2 varchar(256),
city varchar(64),
zip varchar(8),
stateId Integer REFERENCES tbl_crm_state(stateId),
countryId Integer REFERENCES tbl_crm_country(countryId),
type Integer,
dateOpen timestamp NULL, 
dateClose timestamp NULL,
expectedDateClose timestamp NULL, 
stageId Integer REFERENCES tbl_crm_stage(stageId),
probability float,
channelId Integer REFERENCES tbl_crm_channel(channelId),
sectionId Integer REFERENCES tbl_crm_section(sectionId),
categoryId Integer REFERENCES tbl_crm_category(categoryId),
dayClose Float,
dayOpen Float,
referredBy varchar(64),
userId varchar(255),
priorityId Integer REFERENCES tbl_crm_priority(priorityId),
nextActionDate timestamp NULL,
nextAction varchar(255),
status Boolean,
createBy varchar(255),
createDate timestamp NULL,
writeBy varchar(255),
writeDate timestamp NULL
);

CREATE TABLE IF NOT EXISTS tbl_crm_lead_mailHistory (
leadId Integer REFERENCES tbl_crm_lead(leadId),
messageId varchar(255) 
);

CREATE TABLE IF NOT EXISTS tbl_crm_lead_task (
leadId Integer REFERENCES tbl_crm_lead(leadId),
taskId varchar(255) 
);

CREATE TABLE IF NOT EXISTS tbl_crm_lead_calendar (
leadId Integer REFERENCES tbl_crm_lead(leadId),
appointmentId varchar(255) 
);

CREATE TABLE IF NOT EXISTS tbl_crm_leadClass (
leadClassId Integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
leadClassName varchar(64) NOT NULL,
status Boolean,
createBy varchar(255),
createDate timestamp default 0,
writeBy varchar(255),
writeDate timestamp default 0
);

ALTER TABLE tbl_crm_lead ADD COLUMN leadClassId Integer REFERENCES tbl_crm_leadClass(leadClassId) AFTER leadState;

CREATE TABLE IF NOT EXISTS tbl_crm_share (
leadId Integer REFERENCES tbl_crm_lead(leadId),
userId varchar(255),
writeAccess Boolean
);

ALTER TABLE tbl_crm_lead_mailHistory ADD COLUMN userId varchar(255);
ALTER TABLE tbl_crm_lead_calendar ADD COLUMN userId varchar(255);

