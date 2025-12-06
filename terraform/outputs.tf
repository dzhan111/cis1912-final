output "ecs_cluster_name" {
  description = "ECS cluster"
  value       = aws_ecs_cluster.main.name
}

output "backend_ecr_repository_url" {
  description = "Backend ECR URL"
  value       = aws_ecr_repository.backend.repository_url
}

output "frontend_ecr_repository_url" {
  description = "Frontend ECR URL"
  value       = aws_ecr_repository.frontend.repository_url
}

output "alb_dns_name" {
  description = "ALB DNS"
  value       = aws_lb.main.dns_name
}

output "alb_zone_id" {
  description = "ALB zone"
  value       = aws_lb.main.zone_id
}

output "rds_endpoint" {
  description = "RDS endpoint"
  value       = aws_db_instance.main.endpoint
  sensitive   = true
}

output "backend_service_name" {
  description = "Backend service"
  value       = aws_ecs_service.backend.name
}

output "frontend_service_name" {
  description = "Frontend service"
  value       = aws_ecs_service.frontend.name
}

