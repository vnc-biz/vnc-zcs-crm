
TOPDIR=../../
JAR_FILE_NAME=ZimbraCRM.jar

## list jar files which need to be added to classpath
## (taken from $ZIMBRA_ROOT/lib/jars)
ZCS_LIB_JARS=\
	zimbracommon.jar	\
	zimbrastore.jar		\
	zcs-lib-json-simple.jar	\
	zcs-lib-gson.jar	\
	json.jar		\
	zcs-lib-vnc-common.jar

INSTALL_ZIMLET=y
INSTALL_USER=y
INSTALL_ADMIN=y
INSTALL_SERVICE=y
INSTALL_EXTENSION=y

include $(TOPDIR)/common.mk
include $(ZIMBRA_BUILD_ROOT)/extensions-extra/zmpkg/mk/zcs-java-lib.mk
