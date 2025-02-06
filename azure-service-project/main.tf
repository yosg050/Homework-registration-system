provider "azurerm" {
  features {}
  subscription_id = var.subscription_id
}

variable "subscription_id" {}

variable "MY_IP1" {
  type = list(string)
}

variable "MY_IP2" {
  type = list(string)
}


variable "MY_SERVER_IP" {}

output "server_ip" {
  value = azurerm_public_ip.example.ip_address
  description = "The public IP address of the Python server"
}


resource "azurerm_resource_group" "example" {
  name     = "my-homework-registration-system"
  location = "Israel Central"
}

resource "azurerm_public_ip" "example" { 
  name = "python-server-ip"
  location = "Israel Central"
  resource_group_name = azurerm_resource_group.example.name
  allocation_method = "Static"
}

resource "azurerm_network_security_group" "example" {
  name                = "python-server-nsg"
  location            = "Israel Central"
  resource_group_name = azurerm_resource_group.example.name

  security_rule {
    name                       = "SSH"
    priority                   = 1000
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "22"
    source_address_prefix     = "*"
    destination_address_prefix = "*"
  }


  security_rule {
    name                       = "Flask-8000"
    priority                   = 1003
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "8000"
    source_address_prefix   = "*"
    destination_address_prefix = "*"
  }
}

resource "azurerm_virtual_network" "example" {
  name                = "python-vnet"
  location            = "Israel Central"
  resource_group_name = azurerm_resource_group.example.name
  address_space       = ["10.0.0.0/16"]
}

resource "azurerm_subnet" "example" {
  name                 = "python-subnet"
  resource_group_name  = azurerm_resource_group.example.name
  virtual_network_name = azurerm_virtual_network.example.name
  address_prefixes     = ["10.0.1.0/24"]
}

resource "azurerm_network_interface" "example" {
  name                = "python-server-nic"
  location            = "Israel Central"
  resource_group_name = azurerm_resource_group.example.name

  ip_configuration {
    name                          = "internal"
    subnet_id                     = azurerm_subnet.example.id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = azurerm_public_ip.example.id
  }
}

resource "azurerm_network_interface_security_group_association" "example" {
  network_interface_id      = azurerm_network_interface.example.id
  network_security_group_id = azurerm_network_security_group.example.id
}

resource "azurerm_linux_virtual_machine" "example" {
  name                  = "python-server-vm"
  location              = "Israel Central"
  resource_group_name   = azurerm_resource_group.example.name
  size                  = "Standard_B1s"
  admin_username        = "adminuser"
  network_interface_ids = [azurerm_network_interface.example.id]

  depends_on = [ 
    azurerm_network_interface_security_group_association.example,
    azurerm_network_security_group.example
  ]

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
      host        = azurerm_public_ip.example.ip_address
      timeout     = "10m"
    }
  }
}