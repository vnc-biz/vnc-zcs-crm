JAR ?= jar
JAVAC ?= javac

ZIMLET_JAR=zimbraCRM.jar

all:	build

build:	$(ZIMLET_JAR)

clean:
	@rm -Rf classes $(ZIMLET_JAR)

$(ZIMLET_JAR):
	@mkdir -p `dirname "$@"`
	@mkdir -p classes
	@$(JAVAC) -d classes -cp `find lib -name "*.jar" | tr '\n' ':'` `find src -name "*.java"`
	@$(JAR) cvf $(ZIMLET_JAR) -C classes .

