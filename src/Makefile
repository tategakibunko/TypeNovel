all: cleanup grammar.ts compile deploy

.PHONY: grammar.ts

cleanup:
	rm -f ../dist/*.map
	rm -f ../dist/*.js
	rm -f ../dist/*.d.ts

grammar.ts: grammar.ne
	nearleyc $< -o $@

compile: grammar.ts
	tsc

deploy:
	cp -f lexer.js ../dist
