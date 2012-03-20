VERSION=1.0.0

DISTDIR=dist

all:	policy
	@$(MAKE) -C zimlets all

clean:
	@$(MAKE) -C zimlets clean
	@rmdir $(DISTDIR) 2>/dev/null || true

policy:
	@find \
		-name "*.java" 			\
		-or -name "*.html"		\
		-or -name "*.sql"		\
		-or -name "*.js"		\
		-or -name "*.css" 		\
		-or -name "*.xml"		\
		-or -iname "MANIFEST.MF"	\
	    | xargs dos2unix
	@find -name "*.java" \
	    | xargs astyle --style=java --indent=tab --suffix=none --indent-switches 2>&1 | grep -ve "^unchanged" \
	    || true

