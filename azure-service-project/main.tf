# ספק Azure
provider "azurerm" {
  features {}
  subscription_id = var.subscription_id
}

variable "subscription_id" {}
variable "MY_IP1" { type = list(string) }
variable "MY_IP2" { type = list(string) }

resource "azurerm_resource_group" "homework_system" {
  name     = "my-homework-registration-system"
  location = "Israel Central"
}

resource "azurerm_public_ip" "python_server" { 
  name                = "python-server-ip"
  location            = "Israel Central"
  resource_group_name = azurerm_resource_group.homework_system.name
  allocation_method   = "Static"
}

resource "azurerm_public_ip" "node_server" { 
  name                = "node-server-ip"
  location            = "Israel Central"
  resource_group_name = azurerm_resource_group.homework_system.name
  allocation_method   = "Static"
}

resource "azurerm_network_security_group" "homework_nsg" {
  name                = "homework-system-nsg"
  location            = "Israel Central"
  resource_group_name = azurerm_resource_group.homework_system.name

  security_rule {
    name                       = "SSH"
    priority                   = 1000
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "22"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  security_rule {
    name                       = "python-8000"
    priority                   = 1003
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "8000"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  security_rule {
    name                       = "node-3000"
    priority                   = 1005
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "3000"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }
}

resource "azurerm_virtual_network" "homework_vnet" {
  name                = "homework-system-vnet"
  location            = "Israel Central"
  resource_group_name = azurerm_resource_group.homework_system.name
  address_space       = ["10.0.0.0/16"]
}

resource "azurerm_subnet" "homework_subnet" {
  name                 = "homework-system-subnet"
  resource_group_name  = azurerm_resource_group.homework_system.name
  virtual_network_name = azurerm_virtual_network.homework_vnet.name
  address_prefixes     = ["10.0.1.0/24"]
}

resource "azurerm_network_interface" "python_server" {
  name                = "python-server-nic"
  location            = "Israel Central"
  resource_group_name = azurerm_resource_group.homework_system.name

  ip_configuration {
    name                          = "python_server_ip_config"
    subnet_id                     = azurerm_subnet.homework_subnet.id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = azurerm_public_ip.python_server.id
  }
}

resource "azurerm_network_interface" "node_server" {
  name                = "node-server-nic"
  location            = "Israel Central"
  resource_group_name = azurerm_resource_group.homework_system.name

  ip_configuration {
    name                          = "node_server_ip_config"
    subnet_id                     = azurerm_subnet.homework_subnet.id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = azurerm_public_ip.node_server.id
  }
}

resource "azurerm_linux_virtual_machine" "python_server" {
  name                  = "python-server-vm"
  location              = "Israel Central"
  resource_group_name   = azurerm_resource_group.homework_system.name
  size                  = "Standard_B1s"
  admin_username        = "adminuser"
  network_interface_ids = [azurerm_network_interface.python_server.id]

  disable_password_authentication = true

  admin_ssh_key {
    username   = "adminuser"
    public_key = file("~/.ssh/id_rsa.pub")
  }

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "UbuntuServer"
    sku       = "18.04-LTS"
    version   = "latest"
  }

  provisioner "remote-exec" {
    inline = [
      "sudo apt update",
      "sudo apt install -y python3 python3-pip",
      "python3 --version"
    ]

    connection {
      type        = "ssh"
      user        = "adminuser"
      private_key = file("~/.ssh/id_rsa")
      host        = azurerm_public_ip.python_server.ip_address
      timeout     = "10m"
    }
  }

  provisioner "file" {
  source      = "C:/Users/yosef/Software Studies/Homeworks/registration-system/"
  destination = "/home/adminuser/python-app"

  connection {
    type        = "ssh"
    user        = "adminuser"
    private_key = file("~/.ssh/id_rsa")
    host        = azurerm_public_ip.python_server.ip_address
    timeout     = "10m"
  }
}
}

resource "azurerm_linux_virtual_machine" "node_server" {
  name                  = "node-server-vm"
  location              = "Israel Central"
  resource_group_name   = azurerm_resource_group.homework_system.name
  size                  = "Standard_B1s"
  admin_username        = "adminuser"
  network_interface_ids = [azurerm_network_interface.node_server.id]

  disable_password_authentication = true

  admin_ssh_key {
    username   = "adminuser"
    public_key = file("~/.ssh/id_rsa.pub")
  }

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "UbuntuServer"
    sku       = "18.04-LTS"
    version   = "latest"
  }

  provisioner "remote-exec" {
    inline = [
      "sudo apt update",
      "curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -",
      "sudo apt install -y nodejs",
      "node -v",
      "npm -v",
      "sudo npm install -g pm2",
      "mkdir -p /home/adminuser/node-app",
      "echo 'console.log(\"Node.js server running!\")' > /home/adminuser/node-app/server.js",
      "pm2 start /home/adminuser/node-app/server.js --name node-app",
      "pm2 save",
      "pm2 startup || true"
    ]

    connection {
      type        = "ssh"
      user        = "adminuser"
      private_key = file("~/.ssh/id_rsa")
      host        = azurerm_public_ip.node_server.ip_address
      timeout     = "10m"
    }
  }
  provisioner "file" {
  source      = "C:/Users/yosef/Software Studies/Homeworks/registration-system/"
  destination = "/home/adminuser/node-app"

  connection {
    type        = "ssh"
    user        = "adminuser"
    private_key = file("~/.ssh/id_rsa")
    host        = azurerm_public_ip.node_server.ip_address
    timeout     = "10m"
  }
}
}

output "python_server_ip" {
  value       = azurerm_public_ip.python_server.ip_address
  description = "The public IP address of the Python server"
}

output "node_server_ip" {
  value       = azurerm_public_ip.node_server.ip_address
  description = "The public IP address of the Node.js server"
}
