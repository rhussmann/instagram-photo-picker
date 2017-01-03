variable "public_key" {}
variable "private_key" {}

module "instance" {
  source = "./digital-ocean"

  server_name = "PhotoPicker"
  public_key = "${file(var.public_key)}"
  private_key = "${file(var.private_key)}"
  provision_script = "./files/provision.sh"
}

output {
  value = "${instance}"
}
