resource "aws_ecs_service" "bidder" { name = "adserver-bidder" }
resource "aws_elasticache_cluster" "placements" { engine = "redis" }
resource "aws_db_instance" "main" { engine = "postgres" }
resource "aws_kinesis_firehose_delivery_stream" "imp_log" { name = "imp-log" }
