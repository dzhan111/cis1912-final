variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "expense-tracker"
}

variable "environment" {
  description = "Environment"
  type        = string
  default     = "dev"
}

variable "db_username" {
  description = "DB username"
  type        = string
  default     = "expense_user"
  sensitive   = true
}

variable "db_password" {
  description = "DB password"
  type        = string
  sensitive   = true
}

variable "db_name" {
  description = "DB name"
  type        = string
  default     = "expense_tracker"
}

variable "backend_cpu" {
  description = "Backend CPU"
  type        = number
  default     = 256
}

variable "backend_memory" {
  description = "Backend memory"
  type        = number
  default     = 512
}

variable "frontend_cpu" {
  description = "Frontend CPU"
  type        = number
  default     = 256
}

variable "frontend_memory" {
  description = "Frontend memory"
  type        = number
  default     = 512
}

