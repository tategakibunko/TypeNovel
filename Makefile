include Makefile.def
all: mac win linux

rebuild:
	cd Lib && make
	cd Tnc && make

mac:
	cd Lib && make mac
	cd Tnc && make mac
	cd Archives/Mac && make
	@echo \"Archives/Mac/TypeNovel-$(VERSION).pkg\" is generated!

win:
	cd Lib && make win
	cd Tnc && make win
	cd Archives/Win && make
	@echo \"Archives/Win/TypeNovel-$(VERSION).zip\" is generated!

linux:
	cd Lib && make linux
	cd Tnc && make linux
	cd Archives/Linux && make
	@echo \"Archives/Linux/TypeNovel-$(VERSION).zip\" is generated!
