DST:=../TypeNovelReader/node_modules/typenovel

all:
	cd src && make

deploy:
	mkdir -p $(DST)
	cp -f package.json $(DST)/
	cp -rf dist $(DST)/
	cp -rf src $(DST)/
	cp -rf bin $(DST)/

