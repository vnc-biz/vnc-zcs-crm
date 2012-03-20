
include ../../conf.mk

DISTDIR=../../dist/zimlet
ZIMLET_NAME=com_zimbra_crm_admin
ZIMLET_TITLE=Zimbra CRM admin
ZIMLET_VERSION=$(VERSION)
ZIMLET_ZIP=$(DISTDIR)/$(ZIMLET_NAME)-$(VERSION).zip

ZIMLET_JAR=java/zimbraCRM.jar
ZIMLET_LIB=java/lib/gson-2.1.jar

all:	build

build:  $(ZIMLET_ZIP)

clean:
	@rm -Rf $(ZIMLET_ZIP) tmp
	@rmdir `dirname "$(ZIMLET_ZIP)"` 2>/dev/null || true
	@$(MAKE) -C java clean

$(ZIMLET_ZIP):	src/* $(ZIMLET_JAR)
	@mkdir -p `dirname "$@"`
	@rm -Rf tmp
	@cp -R src tmp
	@cat src/$(ZIMLET_NAME).xml \
	    | sed -e "s~@ZIMLET_VERSION@~$(ZIMLET_VERSION)~g" \
	    | sed -e "s~@ZIMLET_NAME@~$(ZIMLET_NAME)~g" \
	    | sed -e "s~@ZIMLET_TITLE@~$(ZIMLET_TITLE)~g" \
	    > tmp/$(ZIMLET_NAME).xml
	@zip -j $(ZIMLET_ZIP) tmp/* $(ZIMLET_LIB) $(ZIMLET_JAR)
	@rm -Rf tmp

$(ZIMLET_JAR):
	@$(MAKE) -C java

