include ../../Makefile.def

all: zip

zip:
	mkdir Tnc
	cp -r ../../Tnc/bin/Release/netcoreapp2.2/linux-x64/* Tnc/
	rm -f *.zip
	zip -r TypeNovel-$(VERSION).zip Tnc
	rm -rf Tnc
