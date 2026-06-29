-- Insert categories
INSERT INTO categories (name) VALUES 
('Tinto'),
('Blanco'),
('Rosado'),
('Espumante');

-- Insert products (Wines)
-- We will use local paths for the images which we'll generate and store in the frontend public directory.
INSERT INTO products (name, description, price, stock, category_id, image_url, winery) VALUES
(
  'Rutini Malbec', 
  'Un clásico argentino de color rojo violáceo intenso. Notas de ciruelas maduras, cacao y vainilla aportadas por su crianza en roble francés.', 
  12500.00, 
  45, 
  1, -- Tinto
  '/images/rutini_malbec.webp', 
  'Rutini Wines'
),
(
  'Catena Zapata Cabernet Sauvignon', 
  'Elegante y complejo, con notas de frutos rojos pequeños, pimienta negra y dejos florales. Excelente estructura en boca con taninos suaves.', 
  15200.00, 
  30, 
  1, -- Tinto
  '/images/catena_cabernet.webp', 
  'Catena Zapata'
),
(
  'Luigi Bosca Chardonnay', 
  'De color amarillo brillante con reflejos dorados. Destaca por sus aromas a frutos tropicales, miel y un sutil toque de vainilla tostada.', 
  9800.00, 
  25, 
  2, -- Blanco
  '/images/luigi_chardonnay.webp', 
  'Luigi Bosca'
),
(
  'El Enemigo Sémillon', 
  'Un blanco complejo y expresivo. Combina frescura cítrica con notas de frutos secos, miel y una textura untuosa y elegante.', 
  18900.00, 
  15, 
  2, -- Blanco
  '/images/enemigo_semillon.webp', 
  'El Enemigo'
),
(
  'Salentein Reserve Rosé', 
  'Rosado de Malbec de color rosa pálido y brillante. Aromas intensos a frutos rojos frescos como cereza y frutilla, con final fresco y floral.', 
  8200.00, 
  50, 
  3, -- Rosado
  '/images/salentein_rose.webp', 
  'Bodega Salentein'
),
(
  'Chandon Extra Brut', 
  'El espumante insignia de Argentina. De burbujas finas y persistentes, con aromas cítricos y a pan tostado. Fresco y equilibrado.', 
  7900.00, 
  60, 
  4, -- Espumante
  '/images/chandon_extra_brut.webp', 
  'Chandon'
),
(
  'D.V. Catena Cabernet-Malbec', 
  'Blend de gran complejidad aromática. Se aprecian las notas de frutas negras del Cabernet combinadas con la redondez y frutos dulces del Malbec.', 
  14000.00, 
  40, 
  1, -- Tinto
  '/images/dv_catena_blend.webp', 
  'Catena Zapata'
),
(
  'Familia Gascón Sauvignon Blanc', 
  'Joven y sumamente fresco. Destacan las notas de ruda, pomelo rosado y hierba recién cortada. Gran acidez y vivacidad.', 
  6800.00, 
  35, 
  2, -- Blanco
  '/images/gascon_sauvignon.webp', 
  'Escorihuela Gascón'
);
