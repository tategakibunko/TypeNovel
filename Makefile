all: cleanup grammar.ts compile deploy

cleanup:
	rm -f dist/*.map
	rm -f dist/*.js
	rm -f dist/*.d.ts

grammar.ts:
	cd src && make $@

compile:
	tsc

deploy:
	cp -f src/lexer.js dist/

test:
	jest

ts-examples:
	cd ts-examples && make
