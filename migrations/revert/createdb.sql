-- Revert mistyclic:createdb from pg

BEGIN;

DROP TABLE "condition_has_offer", "refund", "offer_has_user", "condition" ,"offer", "store", "type", "user", "city", "zip", "role";

COMMIT;
