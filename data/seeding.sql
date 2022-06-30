BEGIN;

TRUNCATE TABLE "condition_has_offer", "offer_has_user", "condition", "offer", "store", "user", "type", "city", "role", "zip" RESTART IDENTITY;

INSERT INTO "condition"("text") VALUES 
('à recupérer en magasin'),
('non compatible avec d''autres offres'),
('à réserver');

INSERT INTO "role"("name") VALUES
('user'),
('collaborator'),
('professional'),
('admin');

INSERT INTO "type"("name") VALUES
('boulangerie'),
('épicerie'),
('fleuriste'),
('boucherie-charcuterie'),
('traiteur');

insert INTO "zip"("code") VALUES
('31190'),
('09700'),
('31700'),
('31600');

INSERT INTO "city"("name","zip_id") VALUES
('auterive', '1'),
('saverdun', '2'),
('muret', '3'),
('blagnac', '4');

INSERT INTO "user"("email", "password","role_id","city_id") VALUES
('user@hot.fr', 'aaaa','1', '3'),
('collaborator@hot.fr', 'aaaa','2', '3'),
('pro@hot.fr', 'aaaa','3', '1'),
('admin@hot.fr', 'aaaa','4', '2');

INSERT INTO "store"("name","presentation", "image_url", "street", "phone", "email", "user_id", "city_id", "type_id") VALUES
('chez paulo', 'épicerie fine, avec produits du terroir', 'maphoto.jpg', '48 avenu des jambon', '06 23 27 41 01', 'moncommerce@hot.fr', '3', '1', '1'),
('toto', 'viande et charcuterie faite maison', 'maphoto.jpg', '48 avenu des jambon', '06 23 27 41 01', 'moncommerce@hot.fr', '3', '2', '2');

COMMIT;