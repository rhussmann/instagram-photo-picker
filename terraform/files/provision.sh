#!/usr/bin/env bash
# Cleanup any packages
sudo apt-get update
sudo apt-get autoremove -y

# TODO: Remove this once finished debugging
sudo apt-get install -y emacs-nox

# Install docker
## Setup the docker apt repo
sudo apt-get install -y apt-transport-https ca-certificates
sudo apt-key adv \
               --keyserver hkp://ha.pool.sks-keyservers.net:80 \
               --recv-keys 58118E89F3A912897C070ADBF76221572C52609D
echo "deb https://apt.dockerproject.org/repo ubuntu-xenial main" | sudo tee /etc/apt/sources.list.d/docker.list
sudo apt-get update

## Install docker
sudo apt-get install -y linux-image-extra-$(uname -r) linux-image-extra-virtual
sudo apt-get install -y docker-engine
sudo gpasswd -a ${USER} docker
sudo service docker restart

## Install docker-compose
sudo curl -L "https://github.com/docker/compose/releases/download/1.9.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

## Clone instagram
git clone https://github.com/rhussmann/instagram-photo-picker.git
