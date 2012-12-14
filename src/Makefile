
SUBDIRS=lib_vnc_crm biz_vnc_crm_admin biz_vnc_crm_client

all:
	@for t in $(SUBDIRS) ; do if [ -f "$$t/Makefile" ] ; then $(MAKE) -C $$t ; fi done

clean:
	@for t in $(SUBDIRS) ; do if [ -f "$$t/Makefile" ] ; then $(MAKE) -C $$t clean ; fi ; done
