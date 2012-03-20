DISTDIR=../dist/zimlet
ZIMLET=$(DISTDIR)/com_zimbra_crm_admin.zip

all:	build

build:
	@$(MAKE) -C com_zimbra_crm_admin all

clean:
	@$(MAKE) -C com_zimbra_crm_admin clean
	@rm -f $(ZIMLET)
	@rmdir `dirname "$(ZIMLET)"` 2>/dev/null || true

