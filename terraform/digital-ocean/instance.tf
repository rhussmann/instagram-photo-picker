variable "private_key" {}
variable "provision_script" {}
variable "public_key" {}
variable "server_name" {}

provider "digitalocean" {}
resource "digitalocean_droplet" "web" {
    image = "ubuntu-16-04-x64"
    name = "${var.server_name}"
    region = "nyc2"
    size = "512mb"
    ssh_keys = ["${digitalocean_ssh_key.deployer.id}"]

    provisioner "remote-exec" {
      script = "${var.provision_script}"
      connection {
        type = "ssh"
        user = "root"
        private_key = "${var.private_key}"
      }
    }
}

resource "digitalocean_ssh_key" "deployer" {
    name = "deployer-key"
    public_key = "${var.public_key}"
}
