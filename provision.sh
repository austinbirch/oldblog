#!/bin/bash

echo "Entry point for simple jekyll provisioning script."

echo "Install build-essential"
apt-get install build-essential -y

echo "Install javscript runtime for ruby"
if ! gem list libv8 -i; then
    gem install libv8 --no-ri --no-rdoc && gem install therubyracer --no-ri --no-rdoc
fi

echo "Install SASS gem"
gem install sass --no-ri --no-rdoc

echo "Install jekyll gem"
gem install jekyll --no-ri --no-rdoc

echo "Exiting provision script."
exit 0
