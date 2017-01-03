variable "private_key" {}
variable "provision_script" {}
variable "public_key" {}
variable "server_name" {}

provider "aws" {}
data "aws_ami" "ubuntu" {
  most_recent = true
  filter {
    name = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-trusty-14.04-amd64-server-*"]
  }
  filter {
    name = "virtualization-type"
    values = ["hvm"]
  }
  owners = ["099720109477"] # Canonical
}

resource "aws_vpc" "main" {
    cidr_block = "10.0.0.0/16"
}

resource "aws_subnet" "main" {
    vpc_id = "${aws_vpc.main.id}"
    cidr_block = "10.0.1.0/24"
    map_public_ip_on_launch = true

    tags {
        Name = "Main"
    }
}

resource "aws_internet_gateway" "default" {
    vpc_id = "${aws_vpc.main.id}"
}


resource "aws_route_table" "us-east-1-public" {
    vpc_id = "${aws_vpc.main.id}"

    route {
        cidr_block = "0.0.0.0/0"
        gateway_id = "${aws_internet_gateway.default.id}"
    }

    tags {
        Name = "Public Subnet"
    }
}

resource "aws_route_table_association" "us-east-1-public" {
    subnet_id = "${aws_subnet.main.id}"
    route_table_id = "${aws_route_table.us-east-1-public.id}"
}

resource "aws_security_group" "web" {
    name = "vpc_web"
    description = "Allow incoming HTTP connections."

    ingress {
        from_port = 80
        to_port = 80
        protocol = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }
    ingress {
        from_port = 443
        to_port = 443
        protocol = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }
    ingress {
        from_port = 22
        to_port = 22
        protocol = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }
    ingress {
        from_port = -1
        to_port = -1
        protocol = "icmp"
        cidr_blocks = ["0.0.0.0/0"]
    }
    egress {
        from_port = 0
        to_port = 0
        protocol = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }

    vpc_id = "${aws_vpc.main.id}"
}

# Create a web server
resource "aws_instance" "web" {
    ami = "ami-9dcfdb8a"
    instance_type = "t2.micro"
    tags {
        Name = "${var.server_name}"
    }
    key_name = "${aws_key_pair.deployer.key_name}"
    subnet_id = "${aws_subnet.main.id}"
    vpc_security_group_ids = ["${aws_security_group.web.id}"]

    provisioner "remote-exec" {
      script = "${var.provision_script}"
      connection {
        type = "ssh"
        user = "ubuntu"
        private_key = "${var.private_key}"
      }
    }
}

resource "aws_key_pair" "deployer" {
    key_name = "deployer-key"
    public_key = "${var.public_key}"
}

output "instance" {
  value = "${aws_instance.web.public_ip}"
}
