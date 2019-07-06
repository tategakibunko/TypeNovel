all: win mac linux

build: dotnet build

win:
	dotnet publish -c Release -r win-x64 --self-contained true

mac:
	dotnet publish -c Release -r osx-x64 --self-contained true

linux:
	dotnet publish -c Release -r linux-x64 --self-contained true
