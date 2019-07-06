include Makefile.def
all: mac win linux

mac:
	cd Lib && make
	cd Tnc && make mac
	cd Packages/Mac && make
	@echo \"Packages/Mac/TypeNovel-$(VERSION).pkg\" is generated!

win:
	cd Lib && make
	cd Tnc && make win
	cd Packages/Win && make
	@echo \"Packages/Win/TypeNovel-$(VERSION).zip\" is generated!

linux:
	cd Lib && make
	cd Tnc && make win
	cd Packages/Linux && make
	@echo \"Packages/Linux/TypeNovel-$(VERSION).zip\" is generated!
