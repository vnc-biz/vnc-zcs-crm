
include $(TOPDIR)/common.mk

SKIN_VERSION=$(CURRENT_VERSION).$(MICRO_REVISION)$(VERSION_SUFFIX)
SKIN_DIR=$(IMAGE_ROOT)/$(SKIN_PREFIX_USER)/$(SKIN_NAME)
SKIN_ZIP=$(TOPDIR)/dist/user-skins/$(SKIN_NAME).zip

all:	build

build:	tree $(SKIN_ZIP)

## build the target installation tree
tree:
	@mkdir -p $(SKIN_DIR)
	@cp -R src/* $(SKIN_DIR)

## zipfile for old-style deployment
$(SKIN_ZIP): tree
	@mkdir -p $(dir $(SKIN_ZIP))
	@cd $(SKIN_DIR) && zip -r $(abspath $(SKIN_ZIP)) *

clean:
	@rm -Rf $(SKIN_ZIP) $(SKIN_DIR)
	@true
