include ../../Makefile.def
PKG_ROOT:=../../Tnc/bin/Release/netcoreapp2.2/osx-x64/publish
PKG_IDENT:=com.antiscroll.typenovel
PKG_INST_LOC:=/Applications/TypeNovel.App
PKG_TEMP:=TypeNovel.pkg
PKG_DIST:=TypeNovel-${VERSION}.pkg
PKG_SCRIPTS_DIR:=./scripts

all: pkg.temp pkg.dist

# output $(PKG_TEMP)
# The name of $(PKG_TEMP) must be described in distribution.xml
# [example]
# <pkg-ref id="com.antiscroll.typenovel" version="0.9.0" onConclusion="none">TypeNovel.pkg</pkg-ref>
pkg.temp:
	rm *.pkg
	chmod +x $(PKG_SCRIPTS_DIR)/*
	pkgbuild --root $(PKG_ROOT) --identifier $(PKG_IDENT) --install-location $(PKG_INST_LOC) --version $(VERSION) --scripts $(PKG_SCRIPTS_DIR) $(PKG_TEMP)

#pkg.temp:
#	rm -f $(PKG_TEMP)
#	chmod +x $(PKG_SCRIPTS_DIR)/*
#	pkgbuild --root $(PKG_ROOT) --identifier $(PKG_IDENT) --install-location $(PKG_INST_LOC) --version $(VERSION) --scripts $(PKG_SCRIPTS_DIR) $(PKG_TEMP)

# Do once to produce 'distribution.xml'.
# macpkg.xml:
# 	productbuild --synthesize --package $(PKG_DIST_NAME) ./distribution.xml

# --package-path is the path of $(PKG_TEMP). In this case, it's current directory(of Makefile).
pkg.dist:
	rm -f $(PKG_DIST)
	productbuild --distribution ./distribution.xml --package-path . $(PKG_DIST)
	rm -f $(PKG_TEMP)
