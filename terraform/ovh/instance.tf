variable "server_name" {}
variable "public_key" {}
variable "private_key" {}
variable "provision_script" {}

output "instance" {
  value = "${openstack_compute_instance_v2.test.access_ip_v4}"
}

provider "openstack" {}
resource "openstack_compute_instance_v2" "test" {
  # region provided by env variable
  name = "${var.server_name}"
  image_id = "39253253-d5d9-48a6-92e3-48c41e537194"               # Ubuntu 16.04 from `openstack image list`
  flavor_id = "550757b3-36c2-4027-b6fe-d70f45304b9c"              # vps-ssd-1 from `openstack flavor list`
  key_pair = "${openstack_compute_keypair_v2.test.name}"
  security_groups = ["${openstack_compute_secgroup_v2.ssh.name}"]

  provisioner "remote-exec" {
    script = "${var.provision_script}"
    connection {
      type = "ssh"
      user = "ubuntu"
      private_key = "${var.private_key}"
    }
  }
}

resource "openstack_compute_keypair_v2" "test" {
  # region provided by env variable
  name = "test"
  public_key = "${var.public_key}"
}

resource "openstack_compute_secgroup_v2" "ssh" {
  # region provided by env variable
  name = "ssh"
  description = "ssh access"
  rule {
    from_port = 22
    to_port = 22
    ip_protocol = "tcp"
    cidr = "0.0.0.0/0"
  }
  rule {
    from_port = 80
    to_port = 80
    ip_protocol = "tcp"
    cidr = "0.0.0.0/0"
  }
}
