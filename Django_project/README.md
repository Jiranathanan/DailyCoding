# install pyenv from

https://github.com/pyenv-win/pyenv-win

Windowns (powershell)
```
Invoke-WebRequest -UseBasicParsing -Uri "https://raw.githubusercontent.com/pyenv-win/pyenv-win/master/pyenv-win/install-pyenv-win.ps1" -OutFile "./install-pyenv-win.ps1"; &"./install-pyenv-win.ps1"
```

Run pyenv --version to check if the installation was successful
Run pyenv install -l to check a list of Python verison support by pyenv-win
Run pyenv install <version> to install the supported version
Run pyenv global <version> to set s Python version as the global version

