#!/bin/bash
# For CentOS installation

# CentOS update
echo -e ".\n.\n.\n"
echo -e ">>> Updating CentOS system <<<\n"
sudo yum -y update || exit 1
echo -e ">>> CentOS system updated t<<<"
echo -e ".\n.\n.\n"

# CentOS upgrade
echo -e ">>> Upgrading CentOS system <<<\n"
sudo yum -y upgrade || exit 1
echo -e ">>> CentOS system upgraded <<<\n"
echo -e ".\n.\n.\n"

# CentOS configuration tool
echo -e ">>> Installing CentOS configuration tools <<<\n"
sudo yum -y install yum-utils device-mapper-persistent-data lvm2 || exit 1
echo -e ">>> CentOS configuration tools installed <<<\n"
echo -e ".\n.\n.\n"

# Docker download and install
echo -e ">>> Installing and starting Docker <<<\n"
echo -e ">>> Installing <<<\n"
sudo wget -qO- https://get.docker.com/ | sh || exit 1
sudo usermod -aG docker $(whoami) || exit 1
echo -e ">>> Installation complete <<<\n"
echo -e ".\n.\n.\n"
echo -e ">>> Starting Docker service <<<\n"
sudo systemctl enable docker.service || exit 1
sudo systemctl start docker.service || exit 1
echo -e ">>> Docker service running <<<\n"
echo -e ".\n.\n.\n"
echo -e ">>> Docker installation complete <<<\n"
echo -e ".\n.\n.\n"

# Installing Docker-Compose
echo -e ">>> Installing Docker-Compose <<<\n"
echo -e ">>> Installing epel-release <<<\n"
sudo yum -y install epel-release || exit 1
echo -e ">>> Installing python-pip <<<\n"
sudo yum -y install -y python-pip || exit 1
echo -e ">>> Installing docker-compose <<<\n"
sudo pip install docker-compose || exit 1
echo -e ">>> Upgrading python <<<\n"
sudo yum upgrade python* || exit 1
echo -e ">>> GIT installation complete <<<\n"
echo -e ".\n.\n.\n"

# Install GIT
echo -e ">>> Installing GIT <<<\n"
sudo yum -y install git || exit 1
echo -e ">>> GIT installation complete <<<\n"
echo -e ".\n.\n.\n"
echo -e ">>> Setup complete! <<<"
exit 0
