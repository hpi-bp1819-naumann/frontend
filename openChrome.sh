# set permissions via: chmod u=rwx openChrome.sh

case "$OSTYPE" in
  darwin*)  open -a "Google Chrome" --args --disable-web-security --user-data-dir="Desktop/Chrome dev session" ;; 
  linux*)   google-chrome --disable-web-security --user-data-dir="Desktop/Chrome dev session" ;;
  msys*)    echo “Windows not yet supported” ;;
  *)        echo "unknown: $OSTYPE" ;;
esac