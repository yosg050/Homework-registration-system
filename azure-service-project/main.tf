provider "azurerm" {
  features {}
  subscription_id = var.subscription_id
}
variable "subscription_id" {}

resource "azurerm_resource_group" "example" {
  name     = "my-homework-registration-system"
  location = "Israel Central"
}