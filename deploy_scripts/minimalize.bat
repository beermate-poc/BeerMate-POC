@echo off

call npm install -g handlebars@4.2.0

setlocal EnableDelayedExpansion

set "Filesx=CC_B2B_MC_CanadaStore_Theme CC_B2B_MC_DefaultStore_Theme CC_B2B_MC_UKStore_Theme"

for %%i in (%Filesx%) do (
	echo %%i
	set "result="
	for %%b in (d:\a\1\s\src\staticresources\%%i\js\templates\) do (
		echo %%b
		set "t="
		for /f "delims=" %%q in ('dir /s /b /a:-d %%b') do (
			set "t=!t! %%q"
				
		)
		call handlebars !t! -f d:\a\1\s\src\staticresources\%%i\js\templates.js -n CCRZ.templates
	)
)
@echo on