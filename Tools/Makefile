all: InitialTnConfig.fs

.PHONY: InitialTnConfig.fs

InitialTnConfig.fs: init.tnconfig.json
	rm -f $@
	./dumpconf.py > $@
	cp -f $@ ../Lib/
