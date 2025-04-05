# This work of this code is to create an app service plan and a webapp inside the azure portal and it is just creating the webapp simply as a container like main webapp will be deployed using jenkins.

provider "azurerm" {
  features {}
  
  subscription_id = "d45d5d5b-2bc2-4f9b-a82b-3a2e6608afb5"
  client_id       = "d4890234-515f-43c5-8204-1feb2abdb995"
  client_secret   = "GAC8Q~JdQzUoHOnjpQzYC_yOeEATQmeRGsbELcqf"
  tenant_id       = "7a325369-5eda-4d37-803c-18c97c3527ef"
}

resource "azurerm_resource_group" "rg" {
  name     = "my-rg-dotnet"
  location = "East US"
}

resource "azurerm_service_plan" "asp" {
  name                = "my-reactproject-jecrc"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  sku_name            = "B1"
  os_type             = "Windows"
}

resource "azurerm_windows_web_app" "webapp" {
  name                = "my-project-webapp-001"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  service_plan_id     = azurerm_service_plan.asp.id

  site_config {
    always_on = true
  }

  https_only = true
}
