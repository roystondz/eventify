-- Starting catalog and site settings. Each table is only seeded while it is
-- still empty, so this never overwrites data an admin has entered.

INSERT INTO services (name, description, price, image)
SELECT * FROM (VALUES
    ('Decor & Backdrop Elegance', 'Premium shimmer walls, floral backdrops, geometric neon installations, and custom monogram arches.', 45, '/assets/services/decor and backdrop.webp'),
    ('Custom Theme Decor & Styling', 'Fully personalized floral arches, luxurious stage setups, custom props, and personalized theme decor.', 0, '/assets/services/custom theme decor.webp'),
    ('DJ & Sound System', 'Concert-grade audio setup, wireless microphones, and professional DJ services.', 80, '/assets/services/dj and sound system.webp'),
    ('Event Lighting', 'Intelligent moving-head lights, uplighting, and ambience creation.', 0, '/assets/services/event lighting.webp'),
    ('LED Display', 'High-resolution LED video walls and dynamic visual content.', 0, '/assets/services/led display.webp'),
    ('Host / MC', 'Charismatic multilingual hosts to keep the event flowing.', 45, '/assets/services/host_mc.webp'),
    ('Photography', 'Editorial-grade portrait and candid event coverage.', 45, '/assets/services/photography.webp'),
    ('Videography', 'Cinematic 4K video capture, highlights, and drone footage.', 60, '/assets/services/videography.webp'),
    ('Photography + Videography', 'Combined photo and video package for complete coverage.', 100, '/assets/services/photography.webp')
)
WHERE NOT EXISTS (SELECT 1 FROM services);

INSERT INTO packages (name, description, price, items, savings)
SELECT * FROM (VALUES
    ('Eventify Essential', 'Ideal for small birthdays, intimate gatherings and simple private celebrations.', 85, '["Decor & Backdrop Elegance","Photography"]', 'You Save: 5 KD'),
    ('Eventify Celebration', 'Ideal for birthdays, graduations, farewell parties and private celebrations where entertainment is required.', 165, '["Decor & Backdrop Elegance","DJ & Sound System","Photography"]', 'You Save: 5 KD'),
    ('Eventify Complete', 'Ideal for clients who want decor, entertainment and complete media coverage.', 215, '["Decor & Backdrop Elegance","DJ & Sound System","Photography","Videography"]', 'You Save: 10 KD')
)
WHERE NOT EXISTS (SELECT 1 FROM packages);

INSERT INTO addons (name, description, price)
SELECT * FROM (VALUES
    ('Host / MC', 'Charismatic multilingual hosts to keep the event flowing.', 45),
    ('Custom Theme Decor', 'Fully personalized decor tailored to the client''s theme.', 0),
    ('Event Lighting', 'Intelligent moving-head lights, uplighting, and ambience creation.', 0),
    ('LED Display', 'High-resolution LED video walls and dynamic visual content.', 0)
)
WHERE NOT EXISTS (SELECT 1 FROM addons);

INSERT OR IGNORE INTO settings (key, value) VALUES
    ('company_name', 'Eventify'),
    ('tagline', 'Your Events. Our Expertise.'),
    ('hero_headline', 'Elevate Every Moment. We Create Experiences.'),
    ('hero_subheadline', 'From grand fairytale weddings and high-profile corporate galas to exclusive VIP parties, we blend breathtaking floral decor, concert-grade sound, intelligent lighting, and seamless production.'),
    ('phone', '+965 6643 3680'),
    ('whatsapp_number', '+965 6643 3680'),
    ('email', ''),
    ('instagram_url', 'https://instagram.com/eventifykw'),
    ('address', 'Kuwait');
