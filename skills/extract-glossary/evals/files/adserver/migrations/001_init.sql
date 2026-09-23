CREATE TABLE adv_campaigns (id bigint PRIMARY KEY, name text, daily_budget_usd numeric);
CREATE TABLE adv_creatives (id bigint PRIMARY KEY, campaign_id bigint REFERENCES adv_campaigns, status text CHECK (status IN ('pending','approved','rejected')));
CREATE TABLE adv_placements (id bigint PRIMARY KEY, publisher_id bigint, floor_cpm_usd numeric);
