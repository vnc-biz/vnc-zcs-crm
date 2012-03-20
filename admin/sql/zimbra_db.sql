drop database test_zimbra;

create database test_zimbra;

use test_zimbra;

CREATE TABLE tbl_crm_country (
countryId Integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
countryName varchar(256) NOT NULL,
countryCode varchar(256) NOT NULL,
status Boolean,
createBy varchar(255),
createDate timestamp default 0,
writeBy varchar(255),
writeDate timestamp default 0
);

CREATE TABLE tbl_crm_state (
stateId Integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
stateName varchar(256) NOT NULL,
stateCode varchar(256) NOT NULL,
countryId Integer REFERENCES tbl_res_country(countryId),
status Boolean,
createBy varchar(255),
createDate timestamp default 0,
writeBy varchar(255),
writeDate timestamp default 0
);

CREATE TABLE tbl_crm_stage (
stageId Integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
stageName varchar(64) NOT NULL,
stageSequence Integer,
stageType Integer,
stageProbability Float NOT NULL,
stageDescription Text,
stageAuto Boolean,
status Boolean,
createBy varchar(255),
createDate timestamp default 0,
writeBy varchar(255),
writeDate timestamp default 0
);

CREATE TABLE tbl_crm_channel (
channelId Integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
channelName varchar(64) NOT NULL,
status Boolean,
createBy varchar(255),
createDate timestamp default 0,
writeBy varchar(255),
writeDate timestamp default 0
);

CREATE TABLE tbl_crm_section (
sectionId Integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
sectionName varchar(64) NOT NULL,
sectionCode varchar(64),
userId varchar(255),
status Boolean,
createBy varchar(255),
createDate timestamp default 0,
writeBy varchar(255),
writeDate timestamp default 0
);

CREATE TABLE tbl_crm_category (
categoryId Integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
categoryName varchar(64) NOT NULL,
sectionId Integer REFERENCES tbl_crm_case_section (sectionId),
status Boolean,
createBy varchar(255),
createDate timestamp default 0,
writeBy varchar(255),
writeDate timestamp default 0
);

CREATE TABLE tbl_crm_priority (
priorityId Integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
priorityName varchar(64) NOT NULL,
priorityCode varchar(16) NOT NULL,
status Boolean,
createBy varchar(255),
createDate timestamp default 0,
writeBy varchar(255),
writeDate timestamp default 0
);

CREATE TABLE tbl_crm_lead (
leadId Integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
subjectName varchar(128) NOT NULL,
leadDescription Text,
contactName varchar(64) NOT NULL,
phone varchar(16),
fax varchar(16),
email varchar(256),
workPhone varchar(16),
mobile varchar(16),
street1 varchar(256),
street2 varchar(256),
city varchar(64),
zip varchar(8),
stateId Integer REFERENCES tbl_res_country_state(stateId),
countryId Integer REFERENCES tbl_res_country(countryId),
type Integer NOT NULL,
dateOpen timestamp default 0,
dateClose timestamp default 0,
expectedDateClose timestamp default 0,
stageId Integer NOT NULL REFERENCES tbl_crm_case_stage(stageId),
channelId Integer REFERENCES tbl_crm_case_channel(channelId),
sectionId Integer REFERENCES tbl_crm_case_section(sectionId),
categoryId Integer REFERENCES tbl_crm_case_category(categoryId),
dayClose Float,
dayOpen Float,
referredBy varchar(64),
userId varchar(255),
priorityId Integer NOT NULL REFERENCES tbl_crm_case_priority(priorityId),
createBy varchar(255),
createDate timestamp default 0,
writeBy varchar(255),
writeDate timestamp default 0
);